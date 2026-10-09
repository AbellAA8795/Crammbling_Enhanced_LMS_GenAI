// End-to-end API tests: they call the running server over HTTP, so they
// exercise Express, the PostgreSQL procedures/functions/triggers and Redis
// together. Uses Node's built-in test runner — no extra packages.
//
// Run inside Docker (recommended):   docker compose exec server npm test
// Run against another server:        API_URL=http://localhost:5000 npm test
//
// Needs the test accounts from docker/db/init/03_test_accounts.sql.
// Everything the tests create is tagged with RUN and removed again, so the
// suite can be re-run against the same database.

import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";

const API = process.env.API_URL || "http://localhost:5000";
const PASSWORD = "Password123!";
const RUN = `apitest-${Date.now()}`;

async function api(method, path, { token, body } = {}) {
    const res = await fetch(`${API}${path}`, {
        method,
        headers: {
            ...(body ? { "Content-Type": "application/json" } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    let json = null;
    try {
        json = JSON.parse(text);
    } catch {
        /* not JSON (e.g. the plain-text root route) */
    }
    return { status: res.status, body: json, text };
}

async function login(email) {
    const res = await api("POST", "/api/login", { body: { email, password: PASSWORD } });
    assert.equal(res.status, 200, `login as ${email} failed: ${res.text}`);
    return { token: res.body.token, id: res.body.user.id, user: res.body.user };
}

const accounts = {};

before(async () => {
    const health = await api("GET", "/api/health").catch(() => null);
    assert.ok(health, `Can't reach the API at ${API}. Is the server running? (docker compose up -d)`);
    accounts.student1 = await login("student1@crammbling.test");
    accounts.student2 = await login("student2@crammbling.test");
    accounts.admin = await login("admin@crammbling.test");
});

describe("health", () => {
    test("API is up and the database is reachable", async () => {
        const res = await api("GET", "/api/health");
        assert.equal(res.status, 200);
        assert.equal(res.body.db, "up");
    });

    test("Redis is connected (cache)", async () => {
        const res = await api("GET", "/api/health");
        assert.equal(res.body.redis, "up", "Redis is down — the API still works, but caching is off");
    });
});

describe("authentication", () => {
    test("login needs an email and password", async () => {
        const res = await api("POST", "/api/login", { body: { email: "student1@crammbling.test" } });
        assert.equal(res.status, 400);
    });

    test("wrong password is rejected", async () => {
        const res = await api("POST", "/api/login", { body: { email: "student1@crammbling.test", password: "nope" } });
        assert.equal(res.status, 401);
    });

    test("unknown email is rejected", async () => {
        const res = await api("POST", "/api/login", { body: { email: `${RUN}@nowhere.test`, password: PASSWORD } });
        assert.equal(res.status, 401);
    });

    test("seeded student can log in and gets a token + role", () => {
        assert.ok(accounts.student1.token);
        assert.equal(accounts.student1.user.role, "student");
        assert.equal(accounts.admin.user.role, "super_admin");
    });

    test("protected routes need a token", async () => {
        assert.equal((await api("GET", "/api/social/friends")).status, 401);
        assert.equal((await api("GET", "/api/social/friends", { token: "not-a-jwt" })).status, 401);
    });
});

describe("roles", () => {
    test("students can't see admin usage stats", async () => {
        const res = await api("GET", "/api/chat/admin/usage-stats", { token: accounts.student1.token });
        assert.equal(res.status, 403);
    });

    test("super_admin can see admin usage stats", async () => {
        const res = await api("GET", "/api/chat/admin/usage-stats", { token: accounts.admin.token });
        assert.equal(res.status, 200);
    });

    test("anyone logged in can read the active chatbot prompt", async () => {
        const res = await api("GET", "/api/prompts/active", { token: accounts.student1.token });
        assert.equal(res.status, 200);
        assert.ok(res.body.data, "no active system prompt — is 02_seed.sql loaded?");
    });
});

describe("personalization: study events + sprint board", () => {
    let eventId;
    const title = `${RUN} Graph Theory Review`;

    after(async () => {
        // The study-event trigger also creates a sprint task; remove anything this run made.
        const { token } = accounts.student1;
        const tasks = await api("GET", "/api/personalization/sprint-tasks", { token });
        for (const t of tasks.body?.data || []) {
            if (t.title.startsWith(RUN)) await api("DELETE", `/api/personalization/sprint-tasks/${t.task_id}`, { token });
        }
        if (eventId) await api("DELETE", `/api/personalization/study-events/${eventId}`, { token });
    });

    test("creating a study event validates required fields", async () => {
        const res = await api("POST", "/api/personalization/study-events", { token: accounts.student1.token, body: { title } });
        assert.equal(res.status, 400);
    });

    test("create → read → update → delete a study event", async () => {
        const { token } = accounts.student1;
        const due = new Date(Date.now() + 3 * 86400000).toISOString();

        const created = await api("POST", "/api/personalization/study-events", {
            token,
            body: { title, type: "review", dueDate: due, subject: "CS240", description: "API test" },
        });
        assert.equal(created.status, 201, created.text);
        eventId = created.body.data.eventId;
        assert.ok(eventId);

        const one = await api("GET", `/api/personalization/study-events/${eventId}`, { token });
        assert.equal(one.status, 200);
        assert.equal(one.body.data.title, title);

        const list = await api("GET", "/api/personalization/study-events", { token });
        assert.ok(list.body.data.some((e) => e.event_id === eventId), "new event missing from the list");

        const updated = await api("PUT", `/api/personalization/study-events/${eventId}`, {
            token,
            body: { title: `${title} (moved)`, type: "exam", dueDate: due, subject: "CS240" },
        });
        assert.equal(updated.status, 200, updated.text);

        const removed = await api("DELETE", `/api/personalization/study-events/${eventId}`, { token });
        assert.equal(removed.status, 200, removed.text);
        const gone = await api("GET", `/api/personalization/study-events/${eventId}`, { token });
        assert.equal(gone.status, 404);
        eventId = null;
    });

    test("a new study event also lands on the sprint board (DB trigger)", async () => {
        const { token } = accounts.student1;
        const created = await api("POST", "/api/personalization/study-events", {
            token,
            body: { title: `${RUN} Trigger check`, type: "review", dueDate: new Date().toISOString(), subject: "MATH210" },
        });
        assert.equal(created.status, 201, created.text);
        eventId = created.body.data.eventId;

        const tasks = await api("GET", "/api/personalization/sprint-tasks", { token });
        const task = tasks.body.data.find((t) => t.source_event_id === eventId);
        assert.ok(task, "no sprint task was created for the study event");
        assert.equal(task.status, "backlog");
    });

    test("sprint task: create → move to done → delete", async () => {
        const { token } = accounts.student1;
        const created = await api("POST", "/api/personalization/sprint-tasks", { token, body: { title: `${RUN} Practice set`, subject: "ALGORITHMS" } });
        assert.equal(created.status, 201, created.text);
        const taskId = created.body.data.taskId;

        const badMove = await api("PATCH", `/api/personalization/sprint-tasks/${taskId}/move`, { token, body: { newStatus: "finished", newPosition: 0 } });
        assert.equal(badMove.status, 400);

        const moved = await api("PATCH", `/api/personalization/sprint-tasks/${taskId}/move`, { token, body: { newStatus: "done", newPosition: 0 } });
        assert.equal(moved.status, 200, moved.text);
        const tasks = await api("GET", "/api/personalization/sprint-tasks", { token });
        assert.equal(tasks.body.data.find((t) => t.task_id === taskId)?.status, "done");

        const removed = await api("DELETE", `/api/personalization/sprint-tasks/${taskId}`, { token });
        assert.equal(removed.status, 200);
    });

    test("you can't touch another student's sprint task", async () => {
        const created = await api("POST", "/api/personalization/sprint-tasks", {
            token: accounts.student1.token,
            body: { title: `${RUN} Private task`, subject: "CS240" },
        });
        const taskId = created.body.data.taskId;
        const res = await api("DELETE", `/api/personalization/sprint-tasks/${taskId}`, { token: accounts.student2.token });
        assert.equal(res.status, 403);
    });
});

describe("social: search, friend requests, friends", () => {
    // Start from "not friends, nothing pending" so the suite can be re-run.
    async function resetFriendship() {
        const s1 = accounts.student1;
        const s2 = accounts.student2;
        await api("DELETE", `/api/social/friends/${s2.id}`, { token: s1.token });
        const outgoing = await api("GET", "/api/social/friend-requests?direction=outgoing", { token: s1.token });
        for (const r of outgoing.body?.data || []) {
            if (r.other_user_id === s2.id) await api("DELETE", `/api/social/friend-requests/${r.request_id}`, { token: s1.token });
        }
        const incoming = await api("GET", "/api/social/friend-requests?direction=incoming", { token: s1.token });
        for (const r of incoming.body?.data || []) {
            if (r.other_user_id === s2.id) await api("PATCH", `/api/social/friend-requests/${r.request_id}`, { token: s1.token, body: { action: "decline" } });
        }
    }
    before(resetFriendship);
    after(resetFriendship);

    test("search needs at least 2 characters", async () => {
        const res = await api("GET", "/api/social/search?q=a", { token: accounts.student1.token });
        assert.equal(res.status, 400);
    });

    test("search finds another student by username", async () => {
        const res = await api("GET", "/api/social/search?q=test_student2", { token: accounts.student1.token });
        assert.equal(res.status, 200);
        assert.ok(res.body.data.some((u) => u.user_id === accounts.student2.id), "test_student2 not in search results");
    });

    test("you can't send a friend request to yourself", async () => {
        const res = await api("POST", "/api/social/friend-requests", { token: accounts.student1.token, body: { recipientId: accounts.student1.id } });
        assert.equal(res.status, 400);
    });

    test("send → accept → both see each other as friends → remove", async () => {
        const s1 = accounts.student1;
        const s2 = accounts.student2;

        const sent = await api("POST", "/api/social/friend-requests", { token: s1.token, body: { recipientId: s2.id } });
        assert.equal(sent.status, 201, sent.text);
        const dup = await api("POST", "/api/social/friend-requests", { token: s1.token, body: { recipientId: s2.id } });
        assert.equal(dup.status, 409);

        const incoming = await api("GET", "/api/social/friend-requests?direction=incoming", { token: s2.token });
        const req = incoming.body.data.find((r) => r.other_user_id === s1.id);
        assert.ok(req, "request didn't show up in the recipient's incoming list");

        const accepted = await api("PATCH", `/api/social/friend-requests/${req.request_id}`, { token: s2.token, body: { action: "accept" } });
        assert.equal(accepted.status, 200, accepted.text);

        // Both lists must update (checks the cache is invalidated for both people).
        const s1Friends = await api("GET", "/api/social/friends", { token: s1.token });
        const s2Friends = await api("GET", "/api/social/friends", { token: s2.token });
        assert.ok(s1Friends.body.data.some((f) => f.friend_user_id === s2.id), "requester's friends list is missing the new friend");
        assert.ok(s2Friends.body.data.some((f) => f.friend_user_id === s1.id), "accepter's friends list is missing the new friend");

        const removed = await api("DELETE", `/api/social/friends/${s2.id}`, { token: s1.token });
        assert.equal(removed.status, 200, removed.text);
    });

    test("accepting a request notifies the sender", async () => {
        const res = await api("GET", "/api/notifications", { token: accounts.student1.token });
        assert.equal(res.status, 200);
        assert.ok(
            res.body.data.some((n) => n.type === "friend_request_accepted"),
            "no friend_request_accepted notification for the sender"
        );
    });
});

describe("notifications", () => {
    test("list and unread count load", async () => {
        const { token } = accounts.student2;
        const list = await api("GET", "/api/notifications", { token });
        assert.equal(list.status, 200);
        assert.ok(Array.isArray(list.body.data));
        const count = await api("GET", "/api/notifications/unread-count", { token });
        assert.equal(count.status, 200);
        assert.equal(typeof Number(count.body.data.count), "number");
    });

    test("mark all as read sets unread count to 0", async () => {
        const { token } = accounts.student1;
        const res = await api("PATCH", "/api/notifications/read-all", { token });
        assert.equal(res.status, 200, res.text);
        const count = await api("GET", "/api/notifications/unread-count", { token });
        assert.equal(Number(count.body.data.count), 0);
    });
});
