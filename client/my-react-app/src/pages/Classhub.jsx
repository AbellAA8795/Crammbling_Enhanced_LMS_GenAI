import { useSyncExternalStore } from "react";

/* =====================================================================
   classHub — the link between Classroom and Group Collab.

   Classroom and Group Collab used to keep their own private copies of
   everything, so nothing could travel between them. This module is the one
   shared place both pages read from:

   • the list of classes (Classroom reads + writes it, Group Collab reads it)
   • a "take me to this class / task" request (Group Collab writes it,
     Classroom picks it up when it opens)
   • syncClassGroups(): turns classes into Group Collab chats — a chat for
     every class, every class member as a chat member, and a clickable
     message for every task posted in the classroom.

   The store lives on globalThis (same trick as Theme.jsx) so it stays ONE
   store even if the file is evaluated twice (hot reload, import casing).
   ===================================================================== */

/* ------------------------------------------------------------------ */
/*  Sample data (moved here from classroom.jsx)                         */
/* ------------------------------------------------------------------ */
export const INITIAL_CLASSES = [
    {
        id: "cls_cs240",
        name: "Data Structures & Algorithms",
        section: "CS240 — Section A",
        subject: "CS240",
        room: "Room 304",
        code: "alg0k2",
        color: "var(--t-ac)",
        owner: "Prof. Reyes",
        teachers: [{ id: "t1", name: "Prof. Reyes", email: "reyes@univ.edu" }],
        students: [
            { id: "you", name: "You" },
            { id: "s1", name: "Maya K." },
            { id: "s2", name: "Alex Chen" },
            { id: "s3", name: "Priya N." },
            { id: "s4", name: "Owen T." },
            { id: "s5", name: "Riley P." },
        ],
        topics: ["Graphs", "Trees", "Sorting & Heaps"],
        classwork: [
            {
                id: "cw1",
                type: "assignment",
                topic: "Graphs",
                title: "Assignment 3: Dijkstra Implementation",
                description: "Implement shortest path with a min-heap. Include a write-up of the time complexity.",
                due: "Mon, Mar 23, 11:59 PM",
                points: 100,
                posted: "Mar 18",
                attachments: [{ name: "Assignment_3_Starter.zip", size: "48 KB" }],
                submitted: false,
                grade: null,
            },
            {
                id: "cw2",
                type: "quiz",
                topic: "Trees",
                title: "Quiz 2: Balanced Tree Rotations",
                description: "Covers AVL and Red-Black rotations. Timed — 25 minutes.",
                due: "Fri, Mar 20, 9:00 AM",
                points: 40,
                posted: "Mar 16",
                attachments: [],
                submitted: false,
                grade: null,
            },
            {
                id: "cw3",
                type: "material",
                topic: "Graphs",
                title: "Chapter 5 Slides — Graph Traversals",
                description: "BFS, DFS, and topological sort reference deck.",
                posted: "Mar 15",
                attachments: [{ name: "Chapter_5_Graph_Traversals.pdf", size: "3.1 MB" }],
            },
            {
                id: "cw4",
                type: "question",
                topic: "Sorting & Heaps",
                title: "Which heap operation dominates heapify cost?",
                description: "Answer briefly and justify.",
                due: "Wed, Mar 25, 11:59 PM",
                points: 10,
                posted: "Mar 19",
                attachments: [],
                submitted: true,
                grade: 10,
            },
            {
                id: "cw5",
                type: "assignment",
                topic: "Trees",
                title: "Assignment 2: BST Deletion",
                description: "Handle all three deletion cases and write unit tests.",
                due: "Fri, Mar 14, 11:59 PM",
                points: 100,
                posted: "Mar 08",
                attachments: [],
                submitted: true,
                grade: 92,
            },
        ],
        stream: [
            {
                id: "p1",
                type: "announcement",
                authorId: "t1",
                authorName: "Prof. Reyes",
                authorRole: "teacher",
                text: "Reminder: Midterm covers chapters 1–6. Bring your student ID.",
                time: "Mar 19",
                comments: [
                    { id: "c1", authorId: "s1", authorName: "Maya K.", text: "Will graph algorithms be on it?", time: "Mar 19" },
                    { id: "c2", authorId: "t1", authorName: "Prof. Reyes", text: "Yes, sections 5.1–5.4.", time: "Mar 19" },
                ],
            },
            {
                id: "p2",
                type: "assignment",
                authorId: "t1",
                authorName: "Prof. Reyes",
                authorRole: "teacher",
                text: "Assignment 3 is now live. Start early — it's the heaviest one this term.",
                time: "Mar 18",
                classworkId: "cw1",
                comments: [],
            },
            {
                id: "p3",
                type: "material",
                authorId: "t1",
                authorName: "Prof. Reyes",
                authorRole: "teacher",
                text: "Added the Chapter 5 slides to Classwork.",
                time: "Mar 15",
                classworkId: "cw3",
                comments: [],
            },
        ],
    },
    {
        id: "cls_math210",
        name: "Discrete Mathematics",
        section: "MATH210 — Section B",
        subject: "MATH210",
        room: "Hall C",
        code: "dsc7t4",
        color: "var(--t-ok)",
        owner: "Dr. Navarro",
        teachers: [{ id: "t2", name: "Dr. Navarro", email: "navarro@univ.edu" }],
        students: [
            { id: "you", name: "You" },
            { id: "s6", name: "Devon M." },
            { id: "s7", name: "Riley P." },
            { id: "s8", name: "Sam W." },
        ],
        topics: ["Set Theory", "Induction", "Combinatorics"],
        classwork: [
            {
                id: "cw_m1",
                type: "assignment",
                topic: "Induction",
                title: "Assignment 4: Strong Induction Proofs",
                description: "Problems 1–8 from the handout. Show every step.",
                due: "Fri, Mar 27, 11:59 PM",
                points: 60,
                posted: "Mar 20",
                attachments: [{ name: "Induction_Handout.pdf", size: "820 KB" }],
                submitted: false,
                grade: null,
            },
            {
                id: "cw_m2",
                type: "material",
                topic: "Set Theory",
                title: "Set Theory Review Deck",
                description: "Definitions, notation, and worked examples.",
                posted: "Mar 12",
                attachments: [{ name: "Set_Theory_Review.pdf", size: "1.4 MB" }],
            },
            {
                id: "cw_m3",
                type: "assignment",
                topic: "Set Theory",
                title: "Assignment 2: Set Theory Proofs",
                description: "Prove the given identities using set builder notation.",
                due: "Fri, Mar 14, 11:59 PM",
                points: 50,
                posted: "Mar 06",
                attachments: [],
                submitted: true,
                grade: 45,
            },
        ],
        stream: [
            {
                id: "p_m1",
                type: "announcement",
                authorId: "t2",
                authorName: "Dr. Navarro",
                authorRole: "teacher",
                text: "Grades for Assignment 2 are posted. See me during office hours if you want to review yours.",
                time: "Mar 17",
                comments: [],
            },
        ],
    },
    {
        id: "cls_phys101",
        name: "Intro to Physics",
        section: "PHYS101 — Section C",
        subject: "PHYS101",
        room: "Lab 2",
        code: "phy9x1",
        color: "var(--t-warn)",
        owner: "Prof. Tan",
        teachers: [{ id: "t3", name: "Prof. Tan", email: "tan@univ.edu" }],
        students: [
            { id: "you", name: "You" },
            { id: "s9", name: "Kai L." },
            { id: "s10", name: "Jules B." },
        ],
        topics: ["Kinematics", "Forces", "Energy"],
        classwork: [
            {
                id: "cw_p1",
                type: "quiz",
                topic: "Kinematics",
                title: "Quiz 1: 1D Motion",
                description: "20 minutes, closed book.",
                due: "Tue, Mar 24, 10:00 AM",
                points: 25,
                posted: "Mar 18",
                attachments: [],
                submitted: false,
                grade: null,
            },
            {
                id: "cw_p2",
                type: "material",
                topic: "Forces",
                title: "Free-Body Diagram Cheat Sheet",
                description: "How to draw FBDs for the common cases.",
                posted: "Mar 10",
                attachments: [{ name: "FBD_Cheatsheet.pdf", size: "540 KB" }],
            },
        ],
        stream: [
            {
                id: "p_p1",
                type: "announcement",
                authorId: "t3",
                authorName: "Prof. Tan",
                authorRole: "teacher",
                text: "Lab this Thursday is cancelled. We'll make it up next week.",
                time: "Mar 18",
                comments: [],
            },
        ],
    },
    {
        // A class the user co-teaches, so the "Create" flow is demonstrable.
        id: "cls_study",
        name: "Peer Study Hall",
        section: "Open Section",
        subject: "STUDY",
        room: "Library — Room B",
        code: "peer42",
        color: "var(--t-ac2)",
        owner: "You",
        teachers: [
            { id: "you", name: "You", email: "you@univ.edu" },
            { id: "t4", name: "Prof. Reyes", email: "reyes@univ.edu" },
        ],
        students: [
            { id: "s11", name: "Maya K." },
            { id: "s12", name: "Devon M." },
            { id: "s13", name: "Priya N." },
        ],
        topics: ["General"],
        classwork: [
            {
                id: "cw_s1",
                type: "material",
                topic: "General",
                title: "How to run a good study session",
                description: "Short checklist we'll use each week.",
                posted: "Mar 05",
                attachments: [],
            },
        ],
        stream: [
            {
                id: "p_s1",
                type: "announcement",
                authorId: "you",
                authorName: "You",
                authorRole: "teacher",
                text: "Welcome! Bring one thing you're stuck on. We'll go around the room.",
                time: "Mar 05",
                comments: [],
            },
        ],
    },
];

/* Classes that ship with the app. Anything else was created/joined by the user. */
export const SEED_CLASS_IDS = new Set(INITIAL_CLASSES.map((c) => c.id));

/* ------------------------------------------------------------------ */
/*  Store                                                               */
/* ------------------------------------------------------------------ */
const hub = (globalThis.__crammblingClassHub ||= {
    classes: INITIAL_CLASSES,
    open: null, // pending { classId, classworkId, tab } request
    listeners: new Set(),
});

function emit() {
    hub.listeners.forEach((fn) => fn());
}
function subscribe(fn) {
    hub.listeners.add(fn);
    return () => hub.listeners.delete(fn);
}

/* Same call style as useState: setClasses(list) or setClasses((prev) => list). */
export function setHubClasses(next) {
    const value = typeof next === "function" ? next(hub.classes) : next;
    if (value === hub.classes) return;
    hub.classes = value;
    emit();
}

export function useHubClasses() {
    const classes = useSyncExternalStore(subscribe, () => hub.classes, () => hub.classes);
    return [classes, setHubClasses];
}

/* ---- "open this class / task in Classroom" requests ---- */
export function requestOpenClassroom(target) {
    hub.open = { ...target };
    emit();
}
export function clearOpenRequest() {
    if (hub.open === null) return;
    hub.open = null;
    emit();
}
export function useOpenRequest() {
    return useSyncExternalStore(subscribe, () => hub.open, () => hub.open);
}

/* "09:41" — same clock format the chat messages already use. */
export function clockNow() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/* ------------------------------------------------------------------ */
/*  Classes -> Group Collab chats                                       */
/* ------------------------------------------------------------------ */
export const TASK_TYPE_LABEL = {
    assignment: "Assignment",
    quiz: "Quiz",
    question: "Question",
    material: "Material",
};

function cleanPoints(p) {
    return p === "" || p === undefined ? null : p;
}

function newClassGroup(cls) {
    return {
        id: `gc_${cls.id}`,
        classId: cls.id,
        name: cls.name,
        type: "classroom",
        color: cls.color,
        members: [],
        messages: [
            {
                id: `sys_${cls.id}`,
                kind: "system",
                senderId: "system",
                senderName: "CLASSROOM",
                text: `Class chat created for ${cls.section || cls.name}`,
                time: cls.createdClock || "",
            },
        ],
        materials: [],
        tasks: [],
    };
}

/* Every teacher + student of the class becomes a chat member. Matching is by
   name, so people who are already in the chat are never duplicated. */
function withClassMembers(g, cls) {
    const known = new Set(g.members.map((m) => m.name.trim().toLowerCase()));
    const people = [...(cls.teachers || []), ...(cls.students || [])];
    const add = [];
    for (const p of people) {
        const key = p.name.trim().toLowerCase();
        if (known.has(key)) continue;
        known.add(key);
        add.push({ id: p.id === "you" ? "you" : `cm_${cls.id}_${p.id}`, name: p.name, role: "member" });
    }
    return add.length ? { ...g, members: [...g.members, ...add] } : g;
}

/* Every task posted through the classroom ("notify" items) becomes a clickable
   chat message, plus an entry in the chat's Assignments / Materials tabs. */
function withClassTasks(g, cls) {
    const msgIds = new Set(g.messages.map((m) => m.id));
    const taskIds = new Set((g.tasks || []).map((t) => t.id));
    const matIds = new Set((g.materials || []).map((t) => t.id));
    const newMsgs = [];
    const newTasks = [];
    const newMats = [];

    // classwork is stored newest-first; chat reads oldest-first
    for (const cw of [...(cls.classwork || [])].reverse()) {
        if (!cw.notify) continue;
        const by = cw.by || cls.owner;
        const mid = `task_${cw.id}`;
        if (!msgIds.has(mid)) {
            newMsgs.push({
                id: mid,
                kind: "task",
                senderId: cw.byId || "teacher",
                senderName: by,
                text: `New ${(TASK_TYPE_LABEL[cw.type] || "task").toLowerCase()}: ${cw.title}`,
                time: cw.postedClock || "",
                link: {
                    classId: cls.id,
                    classworkId: cw.id,
                    type: cw.type,
                    title: cw.title,
                    due: cw.due || "",
                    points: cleanPoints(cw.points),
                    className: cls.name,
                },
            });
        }
        if (cw.type === "material") {
            if (!matIds.has(`mat_${cw.id}`)) newMats.push({ id: `mat_${cw.id}`, title: cw.title, kind: "Material", addedBy: by });
        } else if (!taskIds.has(`at_${cw.id}`)) {
            newTasks.push({
                id: `at_${cw.id}`,
                title: cw.title,
                desc: cw.description || "",
                due: cw.due || "",
                points: cleanPoints(cw.points),
                submissions: [],
                createdBy: by,
            });
        }
    }

    if (!newMsgs.length && !newTasks.length && !newMats.length) return g;
    return {
        ...g,
        messages: [...g.messages, ...newMsgs],
        tasks: [...(g.tasks || []), ...newTasks],
        materials: [...(g.materials || []), ...newMats],
    };
}

/* Idempotent: returns the SAME array when nothing needs to change, so it is
   safe to call on mount and again whenever the classes change. */
export function syncClassGroups(groups, classes) {
    const updated = [...groups];
    const indexByClass = new Map();
    updated.forEach((g, i) => {
        if (g.classId) indexByClass.set(g.classId, i);
    });

    const fresh = []; // chats for classes the user just created / joined -> top of the list
    const seeded = []; // chats for built-in classes that had no chat yet -> bottom
    let changed = false;

    for (const cls of classes) {
        const idx = indexByClass.get(cls.id);
        const original = idx !== undefined ? updated[idx] : null;
        let g = original || newClassGroup(cls);
        g = withClassMembers(g, cls);
        g = withClassTasks(g, cls);

        if (original) {
            if (g !== original) {
                updated[idx] = g;
                changed = true;
            }
        } else {
            (SEED_CLASS_IDS.has(cls.id) ? seeded : fresh).push(g);
            changed = true;
        }
    }

    return changed ? [...fresh, ...updated, ...seeded] : groups;
}