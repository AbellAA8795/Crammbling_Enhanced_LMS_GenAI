import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  QUIZ ARENA                                                          */
/*  1. Upload a file (or paste notes)                                   */
/*  2. Pick a mode: Quiz, Boss Battle or Flashcards                     */
/*  3. Questions are generated automatically from the file's content    */
/*                                                                      */
/*  Question generation here runs in the browser and works on plain     */
/*  text (.txt, .md, .csv, pasted notes). PDF / Word / PowerPoint files */
/*  need the AI backend to read them - see the TODO in readFile().      */
/* ------------------------------------------------------------------ */

const ACCEPT = ".txt,.md,.markdown,.csv,.pdf,.docx,.pptx";
const TEXT_EXT = ["txt", "md", "markdown", "csv"];

const MODES = [
  { key: "quiz", icon: "\u270E", title: "Quiz", desc: "Answer questions and get instant feedback on every one." },
  { key: "boss", icon: "\u2694", title: "Boss Battle", desc: "Right answers hurt the boss. Wrong answers cost you a heart." },
  { key: "cards", icon: "\u25A3", title: "Flashcards", desc: "Flip cards to memorize key terms, then sort what you know." },
];

const TYPES = [
  { key: "mcq", title: "Multiple choice", desc: "Pick the right answer from 4 options" },
  { key: "ident", title: "Identification", desc: "Type the missing term" },
  { key: "tf", title: "True or false", desc: "Decide if the statement is correct" },
];

const COUNTS = [5, 10, 15];
const BOSS_DMG = 20;
const MAX_HEARTS = 5;

const STOP = new Set(
  (
    "about above after again against because before being below between both cannot could does doing during each " +
    "either every first from further have having here hers herself himself into itself just least less made make " +
    "many might more most much must never next only other ought over same shall should since some such than that " +
    "their theirs them themselves then there these they this those through under until upon very want were what " +
    "when where whether which while whom whose will with within without would your yours yourself these using used " +
    "uses also called often usually known based called include includes including"
  ).split(" ")
);

const DEMO_TEXT = `An algorithm is a finite sequence of well-defined steps that solves a specific problem. A stack follows the last-in first-out principle, so the most recently added element is removed first. A queue follows the first-in first-out principle, so the oldest element is removed first. Binary search repeatedly halves a sorted array to locate a target value in logarithmic time. A hash table maps keys to values using a hash function to compute an index into an array of buckets. Recursion is a technique where a function solves a problem by calling itself on smaller inputs. A linked list stores elements in nodes that each hold a reference to the next node. Depth-first search explores as far as possible along each branch before backtracking. Breadth-first search visits all neighbors of a node before moving to the next level of the graph. A binary tree is a hierarchical structure in which every node has at most two children. Dijkstra's algorithm finds the shortest paths from a source vertex to all other vertices in a weighted graph. Big-O notation describes the upper bound of an algorithm's growth rate as the input size increases. A heap is a complete binary tree that satisfies the heap property between parents and children. Dynamic programming solves complex problems by storing the results of overlapping subproblems. Sorting algorithms such as merge sort divide the input, sort each half, and then merge the results.`;

/* ------------------------------ helpers ------------------------------ */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, "");

function formatSize(bytes) {
  if (bytes > 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  return Math.max(1, Math.round(bytes / 1024)) + " KB";
}

function splitSentences(text) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 35 && s.length <= 240);
}

/* The longest non-trivial word in a sentence becomes the "key term". */
function pickTerm(sentence) {
  const words = sentence.match(/[A-Za-z][A-Za-z'-]{4,}/g) || [];
  const candidates = words.filter((w) => !STOP.has(w.toLowerCase()));
  if (!candidates.length) return null;
  return candidates.reduce((best, w) => (w.length > best.length ? w : best), candidates[0]);
}

function blankOut(sentence, term) {
  return sentence.replace(new RegExp(`\\b${escapeRe(term)}\\b`), "_____");
}

function buildFacts(text) {
  const seen = new Set();
  const facts = [];
  splitSentences(text).forEach((sentence) => {
    const term = pickTerm(sentence);
    if (!term) return;
    const key = term.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    facts.push({ sentence, term });
  });
  return facts;
}

function makeQuestions(facts, types, count) {
  const picked = shuffle(facts).slice(0, count);
  const terms = facts.map((f) => f.term);
  const typePool = shuffle(types);

  return picked.map((fact, i) => {
    const id = `q${i}_${fact.term}`;
    const others = shuffle(terms.filter((t) => t.toLowerCase() !== fact.term.toLowerCase()));
    let type = typePool[i % typePool.length];
    if (type === "mcq" && others.length < 3) type = "ident";

    if (type === "mcq") {
      return {
        id,
        type,
        prompt: blankOut(fact.sentence, fact.term),
        options: shuffle([fact.term, ...others.slice(0, 3)]),
        answer: fact.term,
        source: fact.sentence,
      };
    }
    if (type === "tf") {
      const makeFalse = others.length > 0 && Math.random() < 0.5;
      const statement = makeFalse
        ? fact.sentence.replace(new RegExp(`\\b${escapeRe(fact.term)}\\b`), others[0])
        : fact.sentence;
      return { id, type, prompt: statement, answer: makeFalse ? "false" : "true", source: fact.sentence };
    }
    return { id, type: "ident", prompt: blankOut(fact.sentence, fact.term), answer: fact.term, source: fact.sentence };
  });
}

function makeCards(facts, count) {
  return shuffle(facts)
    .slice(0, count)
    .map((f, i) => ({ id: `c${i}_${f.term}`, front: blankOut(f.sentence, f.term), back: f.term, source: f.sentence }));
}

function isCorrect(q, answer) {
  if (q.type === "ident") return norm(answer) === norm(q.answer);
  return answer === q.answer;
}

function bossNameFrom(fileName) {
  if (!fileName) return "Cram Dragon";
  const base = fileName.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
  return `${base.length > 28 ? base.slice(0, 28) + "\u2026" : base} Guardian`;
}

/* ----------------------------- styling bits ---------------------------- */

const card = "bg-[var(--t-bg1)] border border-solid border-[color:var(--t-bd0)]";
const cardShadow = { boxShadow: "2px 2px 0px var(--t-shadow)" };
const btnPrimary =
  "bg-[var(--t-ac)] text-[color:var(--t-onac)] text-xs font-bold py-3 px-5 uppercase tracking-wide hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 active:scale-[0.98]";
const btnGhost =
  "bg-[var(--t-bg3)] border border-solid border-[color:var(--t-bd0)] text-[color:var(--t-tx1)] text-xs font-bold py-3 px-5 uppercase tracking-wide hover:border-[color:var(--t-ac)] hover:text-[color:var(--t-ac)] transition-all duration-150 active:scale-[0.98]";

const KEYFRAMES = `
@keyframes qaHit { 0%,100% { transform: translateX(0) } 20% { transform: translateX(-9px) rotate(-5deg) } 40% { transform: translateX(9px) rotate(5deg) } 60% { transform: translateX(-6px) } 80% { transform: translateX(6px) } }
@keyframes qaFloat { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-7px) } }
@keyframes qaHurt { 0% { box-shadow: inset 0 0 0 0 transparent } 30% { box-shadow: inset 0 0 70px 0 color-mix(in srgb, var(--t-err) 55%, transparent) } 100% { box-shadow: inset 0 0 0 0 transparent } }
@keyframes qaPop { from { opacity: 0; transform: translateY(8px) scale(.97) } to { opacity: 1; transform: none } }
@keyframes qaDmg { 0% { opacity: 0; transform: translateY(6px) } 20% { opacity: 1 } 100% { opacity: 0; transform: translateY(-34px) } }
@media (prefers-reduced-motion: reduce) { .qa-anim { animation: none !important } }
`;

function Spinner() {
  return (
    <svg className="animate-spin w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Step({ n, title, children, right }) {
  return (
    <section className={`${card} p-4 sm:p-5 flex flex-col gap-4`} style={cardShadow}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 flex items-center justify-center bg-[var(--t-ac)] text-[color:var(--t-onac)] text-xs font-bold">
            {n}
          </span>
          <h3 className="text-[color:var(--t-tx0)] text-sm font-bold tracking-wide uppercase">{title}</h3>
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

/* ------------------------------ setup view ----------------------------- */

function SetupView({ onStart }) {
  const [text, setText] = useState("");
  const [fileInfo, setFileInfo] = useState(null); // { name, size, demo }
  const [reading, setReading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [mode, setMode] = useState("quiz");
  const [types, setTypes] = useState(["mcq", "ident", "tf"]);
  const [count, setCount] = useState(10);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const fileRef = useRef(null);

  const hasContent = text.trim().length > 0;

  async function readFile(file) {
    if (!file) return;
    setError("");
    setReading(true);
    const ext = file.name.split(".").pop().toLowerCase();
    try {
      if (TEXT_EXT.includes(ext)) {
        const content = await file.text();
        setText(content);
        setFileInfo({ name: file.name, size: file.size, demo: false });
      } else {
        // TODO: send the file to the backend / AI service, get the extracted text back,
        // and call setText(extracted). Until then PDF, Word and PowerPoint files use
        // sample notes so the whole flow can still be tried.
        setText(DEMO_TEXT);
        setFileInfo({ name: file.name, size: file.size, demo: true });
      }
    } catch {
      setError("That file could not be read. Try another one or paste your notes below.");
    } finally {
      setReading(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    readFile(e.dataTransfer.files?.[0]);
  }

  function clearFile() {
    setFileInfo(null);
    setText("");
    setError("");
  }

  function toggleType(key) {
    setTypes((prev) => {
      if (prev.includes(key)) return prev.length === 1 ? prev : prev.filter((k) => k !== key);
      return [...prev, key];
    });
  }

  function generate() {
    setError("");
    const facts = buildFacts(text);
    if (facts.length < 3) {
      setError("Not enough content to build questions. Upload a longer file or paste more notes (at least a few full sentences).");
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      const total = Math.min(count, facts.length);
      const title = fileInfo?.name || "Pasted notes";
      if (mode === "cards") {
        onStart({ mode, title, deck: makeCards(facts, total) });
      } else {
        onStart({ mode, title, questions: makeQuestions(facts, types, total) });
      }
      setGenerating(false);
    }, 900);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Step 1 - upload */}
      <Step
        n="1"
        title="Upload your study material"
        right={<span className="text-[color:var(--t-ac)] text-[11px] bg-[var(--t-bg3)] py-1 px-2.5 border border-solid border-[color:var(--t-bd0)]">TXT, MD, PDF, DOCX, PPTX</span>}
      >
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => {
            readFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />

        {fileInfo ? (
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--t-bg2)] p-3.5 border border-solid border-[color:var(--t-bd0)]">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-10 h-10 shrink-0 flex items-center justify-center bg-[var(--t-bg3)] border border-solid border-[color:var(--t-bd0)] text-[color:var(--t-ac)] text-lg">
                {"\u25A4"}
              </span>
              <div className="min-w-0">
                <p className="text-[color:var(--t-tx0)] text-sm font-bold truncate">{fileInfo.name}</p>
                <p className="text-[color:var(--t-tx2)] text-[11px]">
                  {formatSize(fileInfo.size)} {"\u2022"} {buildFacts(text).length} key facts found
                </p>
              </div>
            </div>
            <button type="button" onClick={clearFile} className="text-[color:var(--t-err)] text-xs font-bold hover:opacity-75">
              Remove
            </button>
          </div>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center text-center py-9 px-4 gap-2 border-2 border-dashed transition-all duration-150 ${
              dragging
                ? "bg-[color-mix(in_srgb,_var(--t-ac)_10%,_transparent)] border-[color:var(--t-ac)] scale-[1.01]"
                : "bg-[var(--t-bg0)] border-[color:var(--t-bd1)]"
            }`}
          >
            <span className="text-3xl text-[color:var(--t-ac)] leading-none">{"\u21EA"}</span>
            <p className="text-[color:var(--t-tx0)] text-base font-bold">Drop a lecture, slides, or notes here</p>
            <p className="text-[color:var(--t-tx2)] text-xs max-w-md">
              We read the file and turn the key facts into questions automatically. You choose how to practice in the next step.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
              <button type="button" onClick={() => fileRef.current?.click()} className={btnPrimary}>
                {reading ? "Reading\u2026" : "Choose file"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setText(DEMO_TEXT);
                  setFileInfo({ name: "Sample_Algorithms_Notes.txt", size: DEMO_TEXT.length, demo: false });
                }}
                className={btnGhost}
              >
                Use sample notes
              </button>
            </div>
          </div>
        )}

        {fileInfo?.demo && (
          <p className="text-[color:var(--t-warn)] text-[11px] leading-snug">
            Reading PDF, Word and PowerPoint files needs the AI backend, which isn't connected yet. Sample notes are used so you can try every mode.
          </p>
        )}

        <label className="flex flex-col gap-1.5">
          <span className="text-[color:var(--t-tx2)] text-[10px] font-bold tracking-wider uppercase">Or paste your notes</span>
          <textarea
            value={fileInfo ? "" : text}
            disabled={!!fileInfo}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder={fileInfo ? "Remove the uploaded file to paste notes instead." : "Paste lecture notes, a summary, or a reviewer here\u2026"}
            className="w-full resize-y bg-[var(--t-bg0)] border border-solid border-[color:var(--t-bd0)] text-[color:var(--t-tx0)] text-xs py-2.5 px-3 outline-none placeholder:text-[color:var(--t-tx2)] focus:border-[color:var(--t-ac)] disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </label>
      </Step>

      {/* Step 2 - mode + options */}
      <div className={hasContent ? "" : "opacity-50 pointer-events-none"} aria-disabled={!hasContent}>
        <Step n="2" title="Choose how you want to practice">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {MODES.map((m) => {
              const active = mode === m.key;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setMode(m.key)}
                  aria-pressed={active}
                  className={`flex flex-col items-start text-left gap-1.5 p-4 border border-solid transition-all duration-150 active:scale-[0.99] ${
                    active
                      ? "bg-[var(--t-bg3)] border-[color:var(--t-ac)]"
                      : "bg-[var(--t-bg2)] border-[color:var(--t-bd0)] hover:border-[color:var(--t-bd1)]"
                  }`}
                  style={active ? { boxShadow: "0px 0px 14px color-mix(in srgb, var(--t-ac) 25%, transparent)" } : undefined}
                >
                  <span className="text-xl leading-none" style={{ color: active ? "var(--t-ac)" : "var(--t-tx2)" }}>{m.icon}</span>
                  <span className={`text-sm font-bold ${active ? "text-[color:var(--t-ac)]" : "text-[color:var(--t-tx0)]"}`}>{m.title}</span>
                  <span className="text-[color:var(--t-tx2)] text-[11px] leading-snug">{m.desc}</span>
                </button>
              );
            })}
          </div>

          {mode !== "cards" && (
            <div className="flex flex-col gap-2">
              <span className="text-[color:var(--t-tx2)] text-[10px] font-bold tracking-wider uppercase">Question types</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {TYPES.map((t) => {
                  const on = types.includes(t.key);
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => toggleType(t.key)}
                      aria-pressed={on}
                      className={`flex items-start gap-2.5 text-left p-3 border border-solid transition-all duration-150 ${
                        on
                          ? "bg-[color-mix(in_srgb,_var(--t-ac)_10%,_transparent)] border-[color:var(--t-ac)]"
                          : "bg-[var(--t-bg2)] border-[color:var(--t-bd0)] hover:border-[color:var(--t-bd1)]"
                      }`}
                    >
                      <span
                        className={`mt-0.5 w-4 h-4 shrink-0 flex items-center justify-center border border-solid text-[10px] font-bold ${
                          on
                            ? "bg-[var(--t-ac)] border-[color:var(--t-ac)] text-[color:var(--t-onac)]"
                            : "border-[color:var(--t-bd1)] text-transparent"
                        }`}
                      >
                        {"\u2713"}
                      </span>
                      <span className="flex flex-col gap-0.5">
                        <span className="text-[color:var(--t-tx0)] text-xs font-bold">{t.title}</span>
                        <span className="text-[color:var(--t-tx2)] text-[10px] leading-snug">{t.desc}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <span className="text-[color:var(--t-tx2)] text-[10px] font-bold tracking-wider uppercase">
              {mode === "cards" ? "Number of cards" : "Number of questions"}
            </span>
            <div className="flex gap-2">
              {COUNTS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCount(c)}
                  aria-pressed={count === c}
                  className={`w-16 py-2 text-sm font-bold border border-solid transition-all duration-150 active:scale-95 ${
                    count === c
                      ? "bg-[color-mix(in_srgb,_var(--t-warn)_18%,_transparent)] border-[color:var(--t-warn)] text-[color:var(--t-warn)]"
                      : "bg-[var(--t-bg2)] border-[color:var(--t-bd0)] text-[color:var(--t-tx1)] hover:border-[color:var(--t-bd1)]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p role="alert" className="text-[color:var(--t-err)] text-xs">
              {error}
            </p>
          )}

          <button type="button" onClick={generate} disabled={!hasContent || generating} className={`${btnPrimary} self-start flex items-center gap-2`}>
            {generating && <Spinner />}
            {generating
              ? "Generating\u2026"
              : mode === "cards"
              ? "Generate flashcards"
              : mode === "boss"
              ? "Summon the boss"
              : "Generate quiz"}
          </button>
        </Step>
      </div>
    </div>
  );
}

/* ------------------------------ question view -------------------------- */

function QuestionView({ q, feedback, onAnswer, onNext, isLast }) {
  const [typed, setTyped] = useState("");
  const answered = !!feedback;
  const letters = ["A", "B", "C", "D"];

  const label =
    q.type === "mcq" ? "Multiple choice" : q.type === "ident" ? "Identification" : "True or false";

  return (
    <div className={`${card} p-4 sm:p-6 flex flex-col gap-4 qa-anim`} style={{ ...cardShadow, animation: "qaPop .25s ease-out" }}>
      <span className="self-start text-[10px] font-bold uppercase tracking-wider py-0.5 px-2 text-[color:var(--t-ac)] bg-[color-mix(in_srgb,_var(--t-ac)_14%,_transparent)] border border-solid border-[color:color-mix(in_srgb,_var(--t-ac)_35%,_transparent)]">
        {label}
      </span>

      <p className="text-[color:var(--t-tx0)] text-base sm:text-lg leading-relaxed">
        {q.type === "tf" ? q.prompt : <>{q.prompt}</>}
      </p>

      {q.type === "mcq" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {q.options.map((opt, i) => {
            const isAnswer = opt === q.answer;
            const picked = feedback?.ans === opt;
            let tone = "bg-[var(--t-bg2)] border-[color:var(--t-bd0)] hover:border-[color:var(--t-ac)]";
            if (answered && isAnswer) tone = "bg-[color-mix(in_srgb,_var(--t-ok)_16%,_transparent)] border-[color:var(--t-ok)]";
            else if (answered && picked) tone = "bg-[color-mix(in_srgb,_var(--t-err)_16%,_transparent)] border-[color:var(--t-err)]";
            return (
              <button
                key={opt}
                type="button"
                disabled={answered}
                onClick={() => onAnswer(opt)}
                className={`flex items-center gap-3 text-left p-3.5 border border-solid transition-all duration-150 active:scale-[0.99] disabled:cursor-default ${tone}`}
              >
                <span className="w-6 h-6 shrink-0 flex items-center justify-center bg-[var(--t-bg3)] text-[color:var(--t-tx1)] text-xs font-bold">
                  {letters[i]}
                </span>
                <span className="text-[color:var(--t-tx0)] text-sm">{opt}</span>
              </button>
            );
          })}
        </div>
      )}

      {q.type === "tf" && (
        <div className="grid grid-cols-2 gap-2.5">
          {[
            ["true", "True"],
            ["false", "False"],
          ].map(([val, text]) => {
            const isAnswer = val === q.answer;
            const picked = feedback?.ans === val;
            let tone = "bg-[var(--t-bg2)] border-[color:var(--t-bd0)] hover:border-[color:var(--t-ac)]";
            if (answered && isAnswer) tone = "bg-[color-mix(in_srgb,_var(--t-ok)_16%,_transparent)] border-[color:var(--t-ok)]";
            else if (answered && picked) tone = "bg-[color-mix(in_srgb,_var(--t-err)_16%,_transparent)] border-[color:var(--t-err)]";
            return (
              <button
                key={val}
                type="button"
                disabled={answered}
                onClick={() => onAnswer(val)}
                className={`p-4 text-sm font-bold text-[color:var(--t-tx0)] border border-solid transition-all duration-150 active:scale-[0.99] disabled:cursor-default ${tone}`}
              >
                {text}
              </button>
            );
          })}
        </div>
      )}

      {q.type === "ident" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!answered && typed.trim()) onAnswer(typed.trim());
          }}
          className="flex flex-wrap gap-2.5"
        >
          <input
            autoFocus
            value={typed}
            disabled={answered}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Type the missing term\u2026"
            className={`flex-1 min-w-[180px] bg-[var(--t-bg0)] border border-solid text-[color:var(--t-tx0)] text-sm py-3 px-3 outline-none placeholder:text-[color:var(--t-tx2)] focus:border-[color:var(--t-ac)] disabled:opacity-80 ${
              answered
                ? feedback.ok
                  ? "border-[color:var(--t-ok)]"
                  : "border-[color:var(--t-err)]"
                : "border-[color:var(--t-bd0)]"
            }`}
          />
          <button type="submit" disabled={answered || !typed.trim()} className={btnPrimary}>
            Submit
          </button>
        </form>
      )}

      {answered && (
        <div
          className={`flex flex-col gap-2 p-3.5 border-l-4 bg-[var(--t-bg2)] qa-anim`}
          style={{ borderColor: feedback.ok ? "var(--t-ok)" : "var(--t-err)", animation: "qaPop .2s ease-out" }}
        >
          <p className="text-sm font-bold" style={{ color: feedback.ok ? "var(--t-ok)" : "var(--t-err)" }}>
            {feedback.ok ? "Correct!" : "Not quite."}
            {!feedback.ok && q.type !== "tf" && (
              <span className="text-[color:var(--t-tx0)] font-normal"> The answer is <b>{q.answer}</b>.</span>
            )}
            {!feedback.ok && q.type === "tf" && (
              <span className="text-[color:var(--t-tx0)] font-normal"> This statement is <b>{q.answer}</b>.</span>
            )}
          </p>
          <p className="text-[color:var(--t-tx2)] text-xs italic leading-snug">From your notes: {q.source}</p>
          {feedback.note && <p className="text-xs font-bold" style={{ color: feedback.noteColor }}>{feedback.note}</p>}
          <button type="button" autoFocus onClick={onNext} className={`${btnPrimary} self-start mt-1`}>
            {isLast ? "See results" : "Next"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------ play (quiz + boss) --------------------- */

function PlayView({ session, setSession }) {
  const { mode, queue, pos, feedback } = session;
  const q = queue[pos];
  const boss = mode === "boss";
  const uniqueTotal = session.total;
  const progress = Math.round((session.answeredUnique / uniqueTotal) * 100);

  function answer(ans) {
    setSession((s) => {
      if (!s || s.feedback) return s;
      const cur = s.queue[s.pos];
      const ok = isCorrect(cur, ans);
      const streak = ok ? s.streak + 1 : 0;
      const next = {
        ...s,
        streak,
        bestStreak: Math.max(s.bestStreak, streak),
        feedback: { ok, ans },
      };
      if (ok) {
        next.correct = s.correct + 1;
        next.answeredUnique = s.answeredUnique + 1;
        if (s.mode === "boss") {
          const dmg = BOSS_DMG + (streak >= 3 ? 10 : 0);
          next.bossHp = Math.max(0, s.bossHp - dmg);
          next.hitKey = s.hitKey + 1;
          next.dmg = dmg;
          next.feedback = { ok, ans, note: `-${dmg} HP to the boss${streak >= 3 ? " (streak bonus!)" : ""}`, noteColor: "var(--t-ok)" };
        }
      } else {
        next.missed = s.missed.some((m) => m.id === cur.id) ? s.missed : [...s.missed, cur];
        if (s.mode === "boss") {
          next.hearts = s.hearts - 1;
          next.hurtKey = s.hurtKey + 1;
          next.queue = [...s.queue, cur]; // it comes back until you beat it
          next.feedback = { ok, ans, note: "You lost a heart. This question will come back.", noteColor: "var(--t-err)" };
        } else {
          next.answeredUnique = s.answeredUnique + 1;
        }
      }
      return next;
    });
  }

  function next() {
    setSession((s) => {
      const over = s.mode === "boss" && (s.bossHp <= 0 || s.hearts <= 0);
      const last = s.pos + 1 >= s.queue.length;
      if (over || last) return { ...s, done: true };
      return { ...s, pos: s.pos + 1, feedback: null };
    });
  }

  if (!q) return null;
  const bossPct = Math.round((session.bossHp / session.bossMax) * 100);
  const isLast =
    boss ? session.bossHp <= 0 || session.hearts <= 0 || pos + 1 >= queue.length : pos + 1 >= queue.length;

  return (
    <div className="flex flex-col gap-4">
      {boss ? (
        <div
          key={session.hurtKey}
          className={`${card} p-4 sm:p-5 flex flex-col gap-4 qa-anim`}
          style={{ ...cardShadow, animation: session.hurtKey ? "qaHurt .6s ease-out" : "none" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5" aria-label={`${session.hearts} of ${MAX_HEARTS} hearts left`}>
              {Array.from({ length: MAX_HEARTS }).map((_, i) => (
                <span key={i} className={`text-lg leading-none ${i < session.hearts ? "text-[color:var(--t-err)]" : "text-[color:var(--t-bd1)]"}`}>
                  {"\u2764"}
                </span>
              ))}
              <span className="text-[color:var(--t-tx2)] text-[10px] font-bold ml-1 uppercase tracking-wider">You</span>
            </div>
            {session.streak >= 2 && (
              <span className="text-[color:var(--t-warn)] text-[11px] font-bold">{"\u25B2"} {session.streak} streak</span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="qa-anim shrink-0" style={{ animation: "qaFloat 2.6s ease-in-out infinite" }}>
              <span
                key={session.hitKey}
                className="qa-anim inline-block text-5xl sm:text-6xl leading-none select-none"
                style={{ animation: session.hitKey ? "qaHit .45s ease-out" : "none", filter: session.bossHp <= 0 ? "grayscale(1)" : "none" }}
                aria-hidden="true"
              >
                {"\u{1F409}"}
              </span>
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[color:var(--t-tx0)] text-sm font-bold truncate">{session.bossName}</span>
                <span className="text-[color:var(--t-err)] text-[11px] font-bold shrink-0">
                  {session.bossHp} / {session.bossMax} HP
                </span>
              </div>
              <div className="h-4 bg-[var(--t-bg0)] border border-solid border-[color:var(--t-bd0)] overflow-hidden relative">
                <div
                  className="h-full transition-all duration-500 ease-out"
                  style={{
                    width: `${bossPct}%`,
                    background: "var(--t-err)",
                    backgroundImage: "repeating-linear-gradient(90deg, transparent 0 9px, rgba(0,0,0,0.25) 9px 10px)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`${card} p-3.5 flex flex-wrap items-center justify-between gap-3`} style={cardShadow}>
          <span className="text-[color:var(--t-tx1)] text-xs font-bold">
            Question {Math.min(session.answeredUnique + (feedback ? 0 : 1), uniqueTotal)} of {uniqueTotal}
          </span>
          <div className="flex items-center gap-3 flex-1 min-w-[160px] max-w-sm">
            <div className="flex-1 h-2.5 bg-[var(--t-bg0)] border border-solid border-[color:var(--t-bd0)]">
              <div className="h-full bg-[var(--t-ac)] transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-[color:var(--t-ok)] text-xs font-bold shrink-0">{session.correct} correct</span>
          </div>
        </div>
      )}

      <QuestionView key={`${pos}-${q.id}`} q={q} feedback={feedback} onAnswer={answer} onNext={next} isLast={isLast} />
    </div>
  );
}

/* ------------------------------ flashcards ----------------------------- */

function CardsView({ session, setSession }) {
  const { deck, pos, flipped } = session;
  const c = deck[pos];

  function flip() {
    setSession((s) => ({ ...s, flipped: !s.flipped }));
  }

  function mark(known) {
    setSession((s) => {
      const cur = s.deck[s.pos];
      const knownList = known ? [...s.known, cur] : s.known;
      const againList = known ? s.again : [...s.again, cur];
      if (s.pos + 1 >= s.deck.length) return { ...s, known: knownList, again: againList, done: true };
      return { ...s, known: knownList, again: againList, pos: s.pos + 1, flipped: false };
    });
  }

  function back() {
    // Step back one card without changing the sort so far.
    setSession((s) => (s.pos === 0 ? s : { ...s, pos: s.pos - 1, flipped: false, known: s.known.filter((k) => k.id !== s.deck[s.pos - 1].id), again: s.again.filter((k) => k.id !== s.deck[s.pos - 1].id) }));
  }

  useEffect(() => {
    function onKey(e) {
      const tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        flip();
      } else if (e.key === "ArrowRight" && session.flipped) mark(true);
      else if (e.key === "ArrowLeft" && session.flipped) mark(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.flipped, session.pos]);

  if (!c) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className={`${card} p-3.5 flex flex-wrap items-center justify-between gap-3`} style={cardShadow}>
        <span className="text-[color:var(--t-tx1)] text-xs font-bold">
          Card {pos + 1} of {deck.length}
        </span>
        <div className="flex items-center gap-3 flex-1 min-w-[160px] max-w-sm">
          <div className="flex-1 h-2.5 bg-[var(--t-bg0)] border border-solid border-[color:var(--t-bd0)]">
            <div className="h-full bg-[var(--t-ac)] transition-all duration-500" style={{ width: `${(pos / deck.length) * 100}%` }} />
          </div>
          <span className="text-[color:var(--t-ok)] text-xs font-bold shrink-0">{session.known.length} known</span>
        </div>
      </div>

      <div style={{ perspective: "1200px" }}>
        <button
          type="button"
          onClick={flip}
          aria-label={flipped ? "Show the question side" : "Reveal the answer"}
          className="relative w-full h-[260px] sm:h-[300px] cursor-pointer"
          style={{ transformStyle: "preserve-3d", transition: "transform .5s ease", transform: flipped ? "rotateY(180deg)" : "none" }}
        >
          <div
            className={`${card} absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center`}
            style={{ ...cardShadow, backfaceVisibility: "hidden" }}
          >
            <span className="text-[color:var(--t-ac)] text-[10px] font-bold tracking-wider uppercase">What is the missing term?</span>
            <p className="text-[color:var(--t-tx0)] text-base sm:text-xl leading-relaxed">{c.front}</p>
            <span className="text-[color:var(--t-tx2)] text-[11px]">Click or press Space to flip</span>
          </div>
          <div
            className={`${card} absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center`}
            style={{
              ...cardShadow,
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              borderColor: "var(--t-ok)",
            }}
          >
            <span className="text-[color:var(--t-ok)] text-[10px] font-bold tracking-wider uppercase">Answer</span>
            <p className="text-[color:var(--t-tx0)] text-2xl sm:text-3xl font-bold">{c.back}</p>
            <p className="text-[color:var(--t-tx2)] text-xs italic max-w-lg leading-snug">{c.source}</p>
          </div>
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={back} disabled={pos === 0} className={btnGhost}>
          {"\u2190"} Previous
        </button>
        <div className="flex gap-2.5">
          <button
            type="button"
            disabled={!flipped}
            onClick={() => mark(false)}
            className="bg-[color-mix(in_srgb,_var(--t-err)_14%,_transparent)] border border-solid border-[color:var(--t-err)] text-[color:var(--t-err)] text-xs font-bold py-3 px-5 uppercase tracking-wide disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all duration-150 active:scale-[0.98]"
          >
            Still learning
          </button>
          <button
            type="button"
            disabled={!flipped}
            onClick={() => mark(true)}
            className="bg-[color-mix(in_srgb,_var(--t-ok)_14%,_transparent)] border border-solid border-[color:var(--t-ok)] text-[color:var(--t-ok)] text-xs font-bold py-3 px-5 uppercase tracking-wide disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all duration-150 active:scale-[0.98]"
          >
            Got it
          </button>
        </div>
      </div>
      <p className="text-[color:var(--t-tx2)] text-[11px]">Tip: flip the card, then use the arrow keys. Left = still learning, Right = got it.</p>
    </div>
  );
}

/* ------------------------------ result view ---------------------------- */

function ResultView({ session, onRetry, onNew, onReviewCards, onBack, where }) {
  const isCards = session.mode === "cards";
  const boss = session.mode === "boss";

  let headline, sub, color, xp;
  if (isCards) {
    const total = session.deck.length;
    const pct = Math.round((session.known.length / total) * 100);
    headline = pct === 100 ? "You know them all!" : "Deck complete";
    sub = `${session.known.length} of ${total} cards marked as known (${pct}%).`;
    color = pct >= 70 ? "var(--t-ok)" : "var(--t-warn)";
    xp = session.known.length * 5;
  } else if (boss) {
    const won = session.bossHp <= 0;
    headline = won ? "Boss defeated!" : "You were defeated";
    sub = won
      ? `${session.bossName} fell with ${session.hearts} heart${session.hearts === 1 ? "" : "s"} to spare.`
      : `${session.bossName} still had ${session.bossHp} HP left. Review your notes and try again.`;
    color = won ? "var(--t-ok)" : "var(--t-err)";
    xp = session.correct * 10 + (won ? 50 : 0);
  } else {
    const pct = Math.round((session.correct / session.total) * 100);
    headline = pct === 100 ? "Perfect score!" : pct >= 70 ? "Nice work!" : "Keep practicing";
    sub = `You got ${session.correct} of ${session.total} correct (${pct}%). Best streak: ${session.bestStreak}.`;
    color = pct >= 70 ? "var(--t-ok)" : "var(--t-warn)";
    xp = session.correct * 10 + (pct === 100 ? 25 : 0);
  }

  const missedCards = isCards ? session.again : [];
  const missedQs = !isCards ? session.missed : [];

  return (
    <div className="flex flex-col gap-4">
      <div className={`${card} p-6 sm:p-8 flex flex-col items-center text-center gap-3 qa-anim`} style={{ ...cardShadow, animation: "qaPop .3s ease-out" }}>
        <span className="text-5xl leading-none" aria-hidden="true">
          {boss ? (session.bossHp <= 0 ? "\u{1F3C6}" : "\u{1F480}") : isCards ? "\u{1F4DA}" : "\u{1F389}"}
        </span>
        <h3 className="text-2xl font-bold" style={{ color }}>
          {headline}
        </h3>
        <p className="text-[color:var(--t-tx1)] text-sm max-w-md">{sub}</p>
        <span className="text-[color:var(--t-warn)] text-sm font-bold bg-[color-mix(in_srgb,_var(--t-warn)_14%,_transparent)] py-1 px-3 border border-solid border-[color:color-mix(in_srgb,_var(--t-warn)_35%,_transparent)]">
          +{xp} XP
        </span>
        {/* TODO: save the XP and result to the user's profile once the backend is connected */}
        <div className="flex flex-wrap justify-center gap-2.5 mt-2">
          {isCards && missedCards.length > 0 && (
            <button type="button" onClick={onReviewCards} className={btnPrimary}>
              Review {missedCards.length} card{missedCards.length === 1 ? "" : "s"} again
            </button>
          )}
          <button type="button" onClick={onRetry} className={isCards && missedCards.length > 0 ? btnGhost : btnPrimary}>
            {isCards ? "Restart deck" : boss ? "Fight again" : "Retry quiz"}
          </button>
          <button type="button" onClick={onNew} className={btnGhost}>
            New file
          </button>
          <button type="button" onClick={onBack} className={btnGhost}>
            Back to {where}
          </button>
        </div>
      </div>

      {missedQs.length > 0 && (
        <section className={`${card} p-4 sm:p-5 flex flex-col gap-3`} style={cardShadow}>
          <h4 className="text-[color:var(--t-tx0)] text-sm font-bold uppercase tracking-wide">
            Review your mistakes ({missedQs.length})
          </h4>
          {missedQs.map((m) => (
            <div key={m.id} className="flex flex-col gap-1 bg-[var(--t-bg2)] p-3 border-l-4 border-solid" style={{ borderColor: "var(--t-err)" }}>
              <p className="text-[color:var(--t-tx0)] text-xs leading-snug">{m.prompt}</p>
              <p className="text-[color:var(--t-ok)] text-xs font-bold">
                Answer: {m.type === "tf" ? (m.answer === "true" ? "True" : "False") : m.answer}
              </p>
              <p className="text-[color:var(--t-tx2)] text-[11px] italic leading-snug">{m.source}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

/* ------------------------------ main component ------------------------- */

function QuizArena({ where = "Dashboard", onBack }) {
  const [setup, setSetup] = useState(null); // what was generated, kept so "Retry" can reuse it
  const [session, setSession] = useState(null);
  const [view, setView] = useState("setup"); // "setup" | "play"

  function beginSession(cfg) {
    if (cfg.mode === "cards") {
      setSession({ mode: "cards", title: cfg.title, deck: cfg.deck, pos: 0, flipped: false, known: [], again: [], done: false });
    } else {
      const total = cfg.questions.length;
      const boss = cfg.mode === "boss";
      setSession({
        mode: cfg.mode,
        title: cfg.title,
        total,
        queue: cfg.questions,
        pos: 0,
        feedback: null,
        correct: 0,
        answeredUnique: 0,
        missed: [],
        streak: 0,
        bestStreak: 0,
        hearts: MAX_HEARTS,
        bossMax: total * BOSS_DMG,
        bossHp: total * BOSS_DMG,
        bossName: boss ? bossNameFrom(cfg.title) : "",
        hitKey: 0,
        hurtKey: 0,
        done: false,
      });
    }
    setSetup(cfg);
    setView("play");
  }

  function retry() {
    if (!setup) return;
    if (setup.mode === "cards") beginSession({ ...setup, deck: [...setup.deck].sort(() => Math.random() - 0.5) });
    else beginSession({ ...setup, questions: [...setup.questions].sort(() => Math.random() - 0.5) });
  }

  function reviewCards() {
    if (!session?.again?.length) return;
    beginSession({ mode: "cards", title: session.title, deck: session.again });
  }

  function newFile() {
    setSession(null);
    setSetup(null);
    setView("setup");
  }

  const inPlay = view === "play" && session;

  return (
    <div className="p-4 sm:p-6 lg:px-10">
      <style>{KEYFRAMES}</style>
      <div className="flex flex-col gap-4 max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-[color:var(--t-tx0)] text-xl font-bold tracking-wide">QUIZ ARENA</h2>
            <p className="text-[color:var(--t-tx2)] text-xs">
              {inPlay
                ? `${session.mode === "boss" ? "Boss Battle" : session.mode === "cards" ? "Flashcards" : "Quiz"} \u2022 ${session.title}`
                : "Upload your notes and we'll turn them into practice."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {inPlay && !session.done && (
              <button type="button" onClick={newFile} className={btnGhost}>
                Quit
              </button>
            )}
            <button type="button" onClick={onBack} className={btnGhost}>
              {"\u2190"} Back to {where}
            </button>
          </div>
        </div>

        {!inPlay && <SetupView onStart={beginSession} />}

        {inPlay && session.done && (
          <ResultView session={session} onRetry={retry} onNew={newFile} onReviewCards={reviewCards} onBack={onBack} where={where} />
        )}
        {inPlay && !session.done && session.mode === "cards" && <CardsView session={session} setSession={setSession} />}
        {inPlay && !session.done && session.mode !== "cards" && <PlayView session={session} setSession={setSession} />}
      </div>
    </div>
  );
}

export default QuizArena;