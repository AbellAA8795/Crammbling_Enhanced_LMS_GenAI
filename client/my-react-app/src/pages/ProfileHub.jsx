import { useSyncExternalStore } from "react";

import firstCramBadge from "../assets/first_cram_badge.svg";
import quizRookieBadge from "../assets/quiz_rookie_badge.svg";
import quizVeteranBadge from "../assets/quiz_veteran_badge.svg";
import questionCrusherBadge from "../assets/question_crusher_badge.svg";
import questionMachineBadge from "../assets/question_machine_badge.svg";
import perfectCramBadge from "../assets/perfect_cram_badge.svg";
import flawlessFiveBadge from "../assets/flawless_five_badge.svg";
import accuracyAceBadge from "../assets/accuracy_ace_badge.svg";
import comebackCrammerBadge from "../assets/comeback_crammer_badge.svg";
import retakeWarriorBadge from "../assets/retake_warrior_badge.svg";
import noHintsBadge from "../assets/no_hints_badge.svg";
import hardModeHeroBadge from "../assets/hard_mode_hero_badge.svg";
import speedRunBadge from "../assets/speed_run_badge.svg";
import blitzMasterBadge from "../assets/blitz_master_badge.svg";
import quizArchitectBadge from "../assets/quiz_architect_badge.svg";
import promptToPassBadge from "../assets/prompt_to_pass_badge.svg";
import adaptiveAceBadge from "../assets/adaptive_ace_badge.svg";
import mistakeMinerBadge from "../assets/mistake_miner_badge.svg";
import quizStreakBadge from "../assets/quiz_streak_badge.svg";
import quizMarathonBadge from "../assets/quiz_marathon_badge.svg";

/* =====================================================================
   profileHub — people, friends and badges shared by Profile, Dashboard
   and Group Collab.

   • ACHIEVEMENTS: every badge in the app (Dashboard + Profile read it)
   • PEOPLE: the student / teacher directory (search, friends, profiles)
   • my profile + my friend list: a small store on globalThis (same trick
     as Theme.jsx / Classhub.jsx), saved to localStorage so friends you
     add survive a refresh.

   All of this is placeholder data until the server has user / friend
   endpoints — swap the lookups below for API calls then.
   ===================================================================== */

/* ------------------------------------------------------------------ */
/*  Badges                                                              */
/* ------------------------------------------------------------------ */
// `unlocked` is placeholder data for the signed-in user. Replace with real stats from the backend later.
export const ACHIEVEMENTS = [
    { id: "first-cram", name: "First Cram", mission: "Complete your first AI-generated quiz.", quote: "Every legend starts with one question.", badge: firstCramBadge, unlocked: true },
    { id: "quiz-rookie", name: "Quiz Rookie", mission: "Complete 10 quizzes.", quote: "You’re warming up. The questions are starting to fear you.", badge: quizRookieBadge, unlocked: true },
    { id: "quiz-veteran", name: "Quiz Veteran", mission: "Complete 50 quizzes.", quote: "You’ve seen it all: easy, hard, and weirdly specific.", badge: quizVeteranBadge, unlocked: false },
    { id: "question-crusher", name: "Question Crusher", mission: "Answer 100 quiz questions correctly.", quote: "One hundred down. Your brain is getting swole.", badge: questionCrusherBadge, unlocked: true },
    { id: "question-machine", name: "Question Machine", mission: "Answer 500 quiz questions correctly.", quote: "At this point, multiple choice feels like a conversation.", badge: questionMachineBadge, unlocked: false },
    { id: "perfect-cram", name: "Perfect Cram", mission: "Score 100% on any quiz.", quote: "No misses. No mercy.", badge: perfectCramBadge, unlocked: true },
    { id: "flawless-five", name: "Flawless Five", mission: "Score 100% on 5 different quizzes.", quote: "Perfection isn’t a fluke. It’s a habit.", badge: flawlessFiveBadge, unlocked: false },
    { id: "accuracy-ace", name: "Accuracy Ace", mission: "Maintain a 95%+ average across 20 quizzes.", quote: "Consistently brilliant. Annoyingly good.", badge: accuracyAceBadge, unlocked: false },
    { id: "comeback-crammer", name: "Comeback Crammer", mission: "Fail a quiz, then pass the same quiz within 24 hours.", quote: "You didn’t just retake it. You redeemed it.", badge: comebackCrammerBadge, unlocked: true },
    { id: "retake-warrior", name: "Retake Warrior", mission: "Retake a quiz 5 times until you pass.", quote: "Persistence beats talent when talent gives up.", badge: retakeWarriorBadge, unlocked: false },
    { id: "no-hints", name: "No Hints Needed", mission: "Score 100% on a quiz without hints or AI help.", quote: "Just you, the question, and the truth.", badge: noHintsBadge, unlocked: false },
    { id: "hard-mode-hero", name: "Hard Mode Hero", mission: "Score 90%+ on a hard-difficulty quiz.", quote: "You chose violence. And won.", badge: hardModeHeroBadge, unlocked: false },
    { id: "speed-run", name: "Speed Run", mission: "Finish a timed quiz with 90%+ in under 2 minutes.", quote: "Fast fingers, faster brain.", badge: speedRunBadge, unlocked: false },
    { id: "blitz-master", name: "Blitz Master", mission: "Complete 10 timed quizzes with 90%+ accuracy.", quote: "You don’t just survive the clock. You own it.", badge: blitzMasterBadge, unlocked: false },
    { id: "quiz-architect", name: "Quiz Architect", mission: "Generate 25 quizzes using the AI quiz generator.", quote: "You’re not just taking quizzes. You’re building them.", badge: quizArchitectBadge, unlocked: false },
    { id: "prompt-to-pass", name: "Prompt to Pass", mission: "Generate a quiz from a custom prompt and score 100%.", quote: "You asked the right question and answered it perfectly.", badge: promptToPassBadge, unlocked: false },
    { id: "adaptive-ace", name: "Adaptive Ace", mission: "Score 100% on an adaptive-difficulty quiz.", quote: "The AI tried to challenge you. You challenged it back.", badge: adaptiveAceBadge, unlocked: false },
    { id: "mistake-miner", name: "Mistake Miner", mission: "Review every incorrect answer from 10 quizzes.", quote: "Mistakes are just clues. You followed them all.", badge: mistakeMinerBadge, unlocked: false },
    { id: "quiz-streak", name: "Quiz Streak", mission: "Complete at least one quiz every day for 7 days.", quote: "Seven days. Seven quizzes. Zero excuses.", badge: quizStreakBadge, unlocked: true },
    { id: "quiz-marathon", name: "Quiz Marathon", mission: "Complete 10 quizzes in one day.", quote: "Cramming? No. This is a full-on quiz endurance event.", badge: quizMarathonBadge, unlocked: false },
];

/* ------------------------------------------------------------------ */
/*  People directory                                                    */
/* ------------------------------------------------------------------ */
// ids match the chat members in Group Collab so names there link to these profiles.
export const PEOPLE = [
    {
        id: "m2", name: "Jess R.", username: "jessR", gmail: "jess.reyes@gmail.com", role: "student",
        level: 16, xp: 4870, streak: 21, school: "State University", course: "BS Computer Science · 2nd year", joined: "Aug 2025",
        bio: "Algorithms nerd. Will trade heap-sort notes for coffee.",
        badges: ["first-cram", "quiz-rookie", "quiz-veteran", "question-crusher", "perfect-cram", "flawless-five", "quiz-streak", "speed-run"],
        friends: ["m3", "m4", "s4", "s2"],
    },
    {
        id: "m3", name: "Kayden L.", username: "kaydenL", gmail: "kayden.lim@gmail.com", role: "student",
        level: 13, xp: 3760, streak: 6, school: "State University", course: "BS Computer Science · 2nd year", joined: "Sep 2025",
        bio: "Notes guy. If it's in Files, I probably put it there.",
        badges: ["first-cram", "quiz-rookie", "question-crusher", "mistake-miner"],
        friends: ["m2", "m5"],
    },
    {
        id: "m4", name: "Priya N.", username: "priyaN", gmail: "priya.nair@gmail.com", role: "student",
        level: 15, xp: 4520, streak: 30, school: "State University", course: "BS Mathematics · 3rd year", joined: "Jun 2025",
        bio: "Proofs by induction are my love language.",
        badges: ["first-cram", "quiz-rookie", "quiz-veteran", "question-crusher", "question-machine", "perfect-cram", "accuracy-ace", "no-hints", "quiz-streak"],
        friends: ["m2", "m5", "s3"],
    },
    {
        id: "m5", name: "Owen T.", username: "owenT", gmail: "owen.tan@gmail.com", role: "student",
        level: 11, xp: 3105, streak: 3, school: "State University", course: "BS Information Technology · 1st year", joined: "Jan 2026",
        bio: "Learning to love discrete math. Slowly.",
        badges: ["first-cram", "quiz-rookie", "comeback-crammer"],
        friends: ["m3", "m4"],
    },
    {
        id: "s2", name: "Maya K.", username: "mayaK", gmail: "maya.kim@gmail.com", role: "student",
        level: 14, xp: 4110, streak: 12, school: "State University", course: "BS Computer Science · 2nd year", joined: "Aug 2025",
        bio: "Graph theory enjoyer. Ask me about Dijkstra.",
        badges: ["first-cram", "quiz-rookie", "question-crusher", "perfect-cram", "hard-mode-hero", "quiz-streak"],
        friends: ["m2", "s3"],
    },
    {
        id: "s3", name: "Alex Chen", username: "alexchen", gmail: "alex.chen@gmail.com", role: "student",
        level: 12, xp: 3540, streak: 9, school: "State University", course: "BS Computer Engineering · 2nd year", joined: "Oct 2025",
        bio: "Speedrunning quizzes, one timer at a time.",
        badges: ["first-cram", "quiz-rookie", "speed-run", "blitz-master"],
        friends: ["s2", "m4"],
    },
    {
        id: "s4", name: "Riley P.", username: "rileyP", gmail: "riley.park@gmail.com", role: "student",
        level: 13, xp: 3890, streak: 15, school: "State University", course: "BS Mathematics · 2nd year", joined: "Aug 2025",
        bio: "Free after 6pm for proof reviews.",
        badges: ["first-cram", "quiz-rookie", "question-crusher", "perfect-cram", "quiz-streak", "quiz-marathon"],
        friends: ["m2", "s6"],
    },
    {
        id: "s6", name: "Devon M.", username: "devonM", gmail: "devon.mendoza@gmail.com", role: "student",
        level: 11, xp: 3280, streak: 4, school: "State University", course: "BS Information Technology · 2nd year", joined: "Nov 2025",
        bio: "Grades posted? I'll be the first to tell you.",
        badges: ["first-cram", "quiz-rookie", "retake-warrior"],
        friends: ["s4"],
    },
    {
        id: "t1", name: "Prof. Elena Ramos", username: "eramos", gmail: "elena.ramos@gmail.com", role: "teacher",
        school: "State University", course: "Computer Science Department", joined: "Jan 2024",
        bio: "Teaching Data Structures & Algorithms. Office hours Tue/Thu 2–4pm.",
        badges: [], friends: ["t2", "t3"],
    },
    {
        id: "t2", name: "Dr. Marcus Lee", username: "mlee", gmail: "marcus.lee@gmail.com", role: "teacher",
        school: "State University", course: "Mathematics Department", joined: "Mar 2024",
        bio: "Linear algebra, one vector space at a time.",
        badges: [], friends: ["t1"],
    },
    {
        id: "t3", name: "Ms. Hannah Cruz", username: "hcruz", gmail: "hannah.cruz@gmail.com", role: "teacher",
        school: "State University", course: "Information Technology Department", joined: "Jun 2024",
        bio: "Web development basics — HTML, CSS, and patience.",
        badges: [], friends: ["t1"],
    },
];

export function findPerson(id) {
    return PEOPLE.find((p) => p.id === id) || null;
}

/* Chat members are matched by name (Group Collab copies names, not ids). */
export function findPersonByName(name) {
    const key = (name || "").trim().toLowerCase();
    return PEOPLE.find((p) => p.name.toLowerCase() === key) || null;
}

export function searchPeople(query) {
    const q = query.trim().toLowerCase().replace(/^@/, "");
    if (!q) return PEOPLE;
    return PEOPLE.filter(
        (p) => p.name.toLowerCase().includes(q) || p.username.toLowerCase().includes(q) || p.gmail.toLowerCase().startsWith(q) || p.role.startsWith(q)
    );
}

/* Exact lookups used by "Add friend". */
export function findByUsername(username) {
    const u = username.trim().replace(/^@/, "").toLowerCase();
    return PEOPLE.find((p) => p.username.toLowerCase() === u) || null;
}
export function findByGmail(email) {
    const e = email.trim().toLowerCase();
    return PEOPLE.find((p) => p.gmail.toLowerCase() === e) || null;
}

/* ------------------------------------------------------------------ */
/*  Me + my friends (store)                                             */
/* ------------------------------------------------------------------ */
const DEFAULT_ME = {
    id: "you",
    name: "John Cruz",
    initials: "CP", // same initials as the profile button in every top bar
    username: "cramplayer",
    gmail: "john.cruz@gmail.com",
    role: "student",
    level: 18,
    xp: 3420,
    xpPercent: 68,
    streak: 14,
    rank: 8,
    studyHours: 18.5,
    quizzes: 47,
    accuracy: 82,
    school: "State University",
    course: "BS Computer Science · 2nd year",
    joined: "Aug 2025",
    bio: "Cramming smarter, not harder. Algorithms + discrete math this semester.",
};
const DEFAULT_FRIENDS = ["m2", "s4", "m4"];

const STORAGE_KEY = "crammbling-profile";

function readStored() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
        if (saved && typeof saved === "object") {
            return {
                me: { ...DEFAULT_ME, ...(saved.me || {}) },
                friends: Array.isArray(saved.friends) ? saved.friends.filter((id) => findPerson(id)) : DEFAULT_FRIENDS,
            };
        }
    } catch {
        /* storage unavailable — fall back to defaults */
    }
    return { me: DEFAULT_ME, friends: DEFAULT_FRIENDS };
}

const hub = (globalThis.__crammblingProfileHub ||= {
    ...readStored(),
    listeners: new Set(),
});

function commit(next) {
    Object.assign(hub, next);
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ me: hub.me, friends: hub.friends }));
    } catch {
        /* storage unavailable — changes just won't survive a refresh */
    }
    hub.listeners.forEach((fn) => fn());
}
function subscribe(fn) {
    hub.listeners.add(fn);
    return () => hub.listeners.delete(fn);
}

export function useMe() {
    return useSyncExternalStore(subscribe, () => hub.me, () => hub.me);
}
export function updateMe(fields) {
    commit({ me: { ...hub.me, ...fields } });
}

/* Ids of the people you're friends with. */
export function useFriends() {
    return useSyncExternalStore(subscribe, () => hub.friends, () => hub.friends);
}
export function addFriend(id) {
    if (!findPerson(id) || hub.friends.includes(id)) return;
    commit({ friends: [id, ...hub.friends] });
}
export function removeFriend(id) {
    commit({ friends: hub.friends.filter((f) => f !== id) });
}

/* A person's friend ids as you'd see them — includes "you" once you've added them. */
export function friendsOf(person, myFriends) {
    return myFriends.includes(person.id) ? ["you", ...person.friends] : person.friends;
}
