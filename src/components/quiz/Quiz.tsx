import * as React from "react";
import { cn } from "@/lib/utils";
import { makeSet } from "@/lib/quiz/math.js";
import { estimateBand, ITEMS_PER_LEVEL } from "@/lib/english/level.js";
import { LEVELS } from "@/lib/english/level-test.js";

export type Q = {
  id: string;
  stem: string;
  choices: string[];
  answer: number;
  explanation: string[];
  wrongNotes?: (string | null)[];
  difficulty?: number;
  level?: string;
};

const LETTERS = ["A", "B", "C", "D"];

/** A stem is plain text with line breaks; generated math stems may contain one <table>. */
function Stem({ text }: { text: string }) {
  return (
    <div className="grid gap-2">
      {text.split("\n").map((line, i) =>
        line.startsWith("<table") ? (
          <div key={i} className="table-wrap !my-1" dangerouslySetInnerHTML={{ __html: line }} />
        ) : (
          <p key={i} className={cn(i === text.split("\n").length - 1 && text.includes("\n") && "font-medium")}>{line}</p>
        ),
      )}
    </div>
  );
}

/**
 * Practice set: answer each question, see right/wrong immediately and the
 * explanation for every choice. Server-rendered with all questions and
 * explanations (closed), so the page is complete without JavaScript.
 * Math skills can draw a fresh set of generated questions.
 */
export default function Quiz({ questions, skill, generated = false, estimate = false }: { questions: Q[]; skill: string; generated?: boolean; estimate?: boolean }) {
  const [qs, setQs] = React.useState(questions);
  const [picked, setPicked] = React.useState<Record<string, number>>({});
  const [setNo, setSetNo] = React.useState(1);
  const done = qs.filter((q) => picked[q.id] !== undefined);
  const right = done.filter((q) => picked[q.id] === q.answer).length;

  const newSet = () => {
    const next = setNo + 1;
    setSetNo(next);
    setQs(makeSet(skill, (next - 1) * qs.length + 1, qs.length) as Q[]);
    setPicked({});
    document.getElementById("practice")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const reset = () => setPicked({});
  // English level test: count correct answers per CEFR level and estimate a band.
  const byLevel = Object.fromEntries(LEVELS.map((l: string) => [l, qs.filter((q) => q.level === l && picked[q.id] === q.answer).length]));
  const band = estimate ? estimateBand(byLevel) : null;

  return (
    <div id={skill.startsWith("toefl") ? `practice-${skill}` : "practice"} className="grid gap-5">
      <div className="bg-card sticky top-16 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 shadow-sm">
        <p className="text-sm" aria-live="polite">
          <span className="num font-semibold">{done.length}</span> of {qs.length} answered ·{" "}
          <span className="num text-brand font-semibold">{right}</span> correct
          {generated && <span className="text-muted-foreground"> · set {setNo}</span>}
        </p>
        <div className="flex gap-2 text-sm">
          <button type="button" onClick={reset} className="rounded-md border px-3 py-1.5">Clear answers</button>
          {generated && <button type="button" onClick={newSet} className="bg-brand text-brand-foreground rounded-md px-3 py-1.5 font-medium">New set of {qs.length}</button>}
        </div>
      </div>

      <ol className="!m-0 grid !list-none gap-5 !p-0">
        {qs.map((q, n) => {
          const p = picked[q.id];
          const answered = p !== undefined;
          return (
            <li key={q.id} className="bg-card rounded-xl border p-5 md:p-6">
              <div className="text-muted-foreground mb-3 flex items-center justify-between text-xs font-semibold tracking-wider uppercase">
                <span>Question {n + 1}</span>
                {q.difficulty && <span>{["", "Easier", "Medium", "Harder"][q.difficulty]}</span>}
              </div>
              <Stem text={q.stem} />
              <div role="radiogroup" aria-label={`Question ${n + 1} choices`} className="mt-4 grid gap-2">
                {q.choices.map((c, i) => {
                  const isKey = i === q.answer, isPick = i === p;
                  return (
                    <button key={i} type="button" role="radio" aria-checked={isPick} disabled={answered}
                      onClick={() => setPicked((o) => ({ ...o, [q.id]: i }))}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                        !answered && "hover:border-brand hover:bg-brand-soft/40",
                        answered && isKey && "border-hit bg-hit/10",
                        answered && isPick && !isKey && "border-destructive bg-destructive/10",
                      )}>
                      <span className={cn("grid size-7 shrink-0 place-items-center rounded-full border text-sm font-semibold", answered && isKey && "bg-hit border-hit text-white", answered && isPick && !isKey && "bg-destructive border-destructive text-white")}>{LETTERS[i]}</span>
                      <span className="pt-0.5">{c}</span>
                    </button>
                  );
                })}
              </div>
              {answered && (
                <p className={cn("mt-4 font-semibold", p === q.answer ? "text-hit" : "text-destructive")}>
                  {p === q.answer ? "Correct." : `Not quite. The answer is ${LETTERS[q.answer]}.`}
                </p>
              )}
              <details open={answered} className="mt-3 rounded-lg bg-muted/60 px-4 py-3 text-[0.95rem]">
                <summary className="cursor-pointer text-sm font-semibold">{answered ? "Explanation" : "Show answer and explanation"}</summary>
                {!answered && <p className="mt-2 text-sm font-semibold">Answer: {LETTERS[q.answer]}</p>}
                <div className="mt-2 grid gap-1.5">
                  {q.explanation.map((s, i) => <p key={i}>{s}</p>)}
                  {q.wrongNotes && (
                    <ul className="mt-1 grid gap-1">
                      {q.wrongNotes.map((w, i) => w && <li key={i}><strong>{LETTERS[i]}:</strong> {w}</li>)}
                    </ul>
                  )}
                </div>
              </details>
            </li>
          );
        })}
      </ol>

      {done.length === qs.length && estimate && band && (
        <div className="bg-brand-soft rounded-xl p-5" aria-live="polite">
          <p className="font-display text-2xl font-bold text-center">Your answers are consistent with: {band.label}</p>
          <p className="text-muted-foreground mt-2 text-center text-sm">This is a practice estimate from {qs.length} questions, not a certified level. Only an official exam gives a certified level.</p>
          <table className="mx-auto mt-4 text-sm"><thead><tr><th className="px-3 py-1 text-left">Level</th><th className="px-3 py-1 text-left">Correct</th></tr></thead><tbody>
            {LEVELS.map((l: string) => <tr key={l}><td className="px-3 py-1">{l}</td><td className="num px-3 py-1">{byLevel[l]} of {ITEMS_PER_LEVEL}</td></tr>)}
          </tbody></table>
          <div className="mt-3 text-center"><button type="button" onClick={reset} className="rounded-md border px-3 py-1.5 text-sm">Try again</button></div>
        </div>
      )}
      {done.length === qs.length && !estimate && (
        <div className="bg-brand-soft rounded-xl p-5 text-center">
          <p className="font-display text-2xl font-bold">You got {right} of {qs.length} right.</p>
          <p className="text-muted-foreground mt-1">{right === qs.length ? "A perfect set." : right >= qs.length * 0.7 ? "Solid. Review the ones you missed, then try a new set." : "Read the explanations for the ones you missed, then try again."}</p>
          {generated && <button type="button" onClick={newSet} className="bg-brand text-brand-foreground mt-3 rounded-md px-4 py-2 font-medium">Try a new set</button>}
        </div>
      )}
    </div>
  );
}
