import { useEffect, useState } from "react";
import { Panel } from "./Panel";

const PASS_MARK = 75;

// Sample data: replace with the real quiz history from the API later.
const QUIZ_HISTORY = [
  { id: 1, title: "HTML and CSS Basics", subject: "Web Development", date: "Sep 28, 2026", correct: 9, total: 10, xp: 90 },
  { id: 2, title: "JavaScript Fundamentals", subject: "Web Development", date: "Sep 27, 2026", correct: 7, total: 10, xp: 60 },
  { id: 3, title: "Rizal: Early Life and Education", subject: "Rizal Life and Works", date: "Sep 25, 2026", correct: 5, total: 10, xp: 30 },
  { id: 4, title: "Software Engineering: SDLC", subject: "Software Engineering", date: "Sep 24, 2026", correct: 14, total: 15, xp: 140 },
  { id: 5, title: "REST APIs and Integration", subject: "System Integration", date: "Sep 22, 2026", correct: 8, total: 12, xp: 65 },
  { id: 6, title: "Routing Protocols", subject: "Networking II", date: "Sep 20, 2026", correct: 18, total: 20, xp: 170 },
];

const FILTERS = ["All", "Passed", "Need Improvements"];

const scoreColor = (pct) => (pct >= 90 ? "#a5e060" : pct >= PASS_MARK ? "#f4c542" : "#e05252");

function QuizRow({ quiz, onView }) {
  const pct = Math.round((quiz.correct / quiz.total) * 100);
  const passed = pct >= PASS_MARK;
  const color = scoreColor(pct);

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 border border-edge bg-inset">
      <div className="flex-1 min-w-[200px]">
        <p className="font-display text-[14px] font-medium text-ink">{quiz.title}</p>
        <p className="label mt-1">
          {quiz.subject}, {quiz.date}
        </p>
      </div>

      <div className="w-40">
        <div className="flex items-center justify-between font-label text-[11px] mb-1">
          <span style={{ color }} className="font-bold">{pct}%</span>
          <span className="text-mute">{quiz.correct}/{quiz.total}</span>
        </div>
        <div className="w-full h-2.5 bg-deep border border-edge">
          <div className="h-full" style={{ width: `${pct}%`, backgroundColor: color }} />
        </div>
      </div>

      <span className="font-label text-[11px] font-bold text-cyan w-16 text-right">+{quiz.xp} XP</span>

      <span className={`tag min-w-[150px] justify-center ${passed ? "tag-lime" : "tag-rose"}`}>
        {passed ? "Passed" : "Need improvements"}
      </span>

      <button
        type="button"
        onClick={() => onView(quiz)}
        aria-label={`Show quiz: ${quiz.title}`}
        className="btn btn-lime"
      >
        {"\u25A4"} Show Quiz
      </button>
    </div>
  );
}

// Sample data: replace with the real questions and answers from the API later.
function buildReview(quiz) {
  const wrong = quiz.total - quiz.correct;
  const wrongAt = new Set(Array.from({ length: wrong }, (_, i) => Math.floor(((i + 1) * quiz.total) / (wrong + 1))));
  return Array.from({ length: quiz.total }, (_, i) => ({ n: i + 1, isCorrect: !wrongAt.has(i) }));
}

function QuizReviewModal({ quiz, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const pct = Math.round((quiz.correct / quiz.total) * 100);
  const passed = pct >= PASS_MARK;
  const review = buildReview(quiz);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={quiz.title}
        onClick={(e) => e.stopPropagation()}
        className="panel w-full max-w-[640px] max-h-[85vh] flex flex-col"
      >
        <div className="flex items-start justify-between gap-4 px-4 py-3 border-b border-edge bg-bar">
          <div>
            <h3 className="font-display text-[18px] font-bold text-ink">{quiz.title}</h3>
            <p className="label mt-1">{quiz.subject}, {quiz.date}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="btn btn-ghost px-2.5! py-1!">
            {"\u2715"}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-edge">
          <span className={`tag ${passed ? "tag-lime" : "tag-rose"}`}>
            {passed ? "Passed" : "Need improvements"}
          </span>
          <span className="tag tag-gold">Score {pct}% ({quiz.correct}/{quiz.total})</span>
          <span className="tag tag-cyan">+{quiz.xp} XP</span>
        </div>

        <div className="overflow-y-auto p-4 flex flex-col gap-2">
          {review.map((q) => (
            <div
              key={q.n}
              className={`flex items-start gap-3 px-3 py-2.5 border ${
                q.isCorrect ? "border-edge bg-inset" : "border-rose/40 bg-rose/10"
              }`}
            >
              <span className="w-7 h-7 shrink-0 border border-edge bg-deep flex items-center justify-center font-label text-[11px] font-bold text-mute">
                {q.n}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-display text-[13px] text-ink">Question text goes here (sample).</p>
                <p className="label mt-1">
                  Your answer: <span className={q.isCorrect ? "text-lime" : "text-rose"}>Sample answer</span>
                </p>
                {!q.isCorrect && (
                  <p className="label mt-0.5">
                    Correct answer: <span className="text-lime">Sample correct answer</span>
                  </p>
                )}
              </div>
              <span className={`tag ${q.isCorrect ? "tag-lime" : "tag-rose"}`}>
                {q.isCorrect ? "Correct" : "Wrong"}
              </span>
            </div>
          ))}
        </div>

        <div className="px-4 py-3 border-t border-edge flex justify-end">
          <button type="button" onClick={onClose} className="btn btn-ghost">Close</button>
        </div>
      </div>
    </div>
  );
}

function QuizHistory() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [filter, setFilter] = useState(FILTERS[0]);
  const [history, setHistory] = useState(QUIZ_HISTORY);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(new Date());

  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    // TODO: fetch the latest quiz history from the API instead of the sample data
    setTimeout(() => {
      setHistory([...QUIZ_HISTORY]);
      setUpdatedAt(new Date());
      setRefreshing(false);
    }, 800);
  };

  const visible = history.filter((q) => {
    const passed = (q.correct / q.total) * 100 >= PASS_MARK;
    return filter === "All" || (filter === "Passed" ? passed : !passed);
  });

  const updatedLabel = updatedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
    <Panel
      icon={"\u21BB"}
      title="Quiz History"
      right={
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`tag cursor-pointer transition-colors duration-100 ${
                filter === f ? "tag-cyan" : "border-edge text-mute hover:text-ink"
              }`}
            >
              {f}
            </button>
          ))}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            aria-label="Refresh quiz history"
            className="btn btn-cyan px-2.5! py-1! text-[10px]!"
          >
            <span className={`inline-block text-[13px] leading-none ${refreshing ? "animate-spin" : ""}`}>
              {"\u27F3"}
            </span>
            {refreshing ? "Refreshing" : "Refresh"}
          </button>
        </div>
      }
    >
      <p className="label mb-3 text-faint">Last updated {updatedLabel}</p>

      <div className={`flex flex-col gap-2 transition-opacity duration-200 ${refreshing ? "opacity-40" : ""}`}>
        {visible.length ? (
          visible.map((quiz) => <QuizRow key={quiz.id} quiz={quiz} onView={setSelectedQuiz} />)
        ) : (
          <p className="label text-center py-6">No quizzes match this filter.</p>
        )}
      </div>
    </Panel>
    {selectedQuiz && <QuizReviewModal quiz={selectedQuiz} onClose={() => setSelectedQuiz(null)} />}
    </>
  );
}

export default QuizHistory;