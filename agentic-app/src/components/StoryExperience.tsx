"use client";

import { useMemo, useState } from "react";
import { rootNodeId, storyGraph, type StoryNode } from "@/lib/story";

const moodColors: Record<string, string> = {
  hope: "bg-emerald-100 text-emerald-900 border-emerald-300",
  wonder: "bg-sky-100 text-sky-900 border-sky-300",
  mystery: "bg-indigo-100 text-indigo-900 border-indigo-300",
  danger: "bg-rose-100 text-rose-900 border-rose-300"
};

type HistoryStep = {
  id: string;
  choiceLabel?: string;
};

export function StoryExperience() {
  const [currentId, setCurrentId] = useState<string>(rootNodeId);
  const [history, setHistory] = useState<HistoryStep[]>([{ id: rootNodeId }]);

  const node: StoryNode = useMemo(() => storyGraph[currentId], [currentId]);

  const handleChoice = (choiceId: string) => {
    const choice = node.choices?.find((opt) => opt.id === choiceId);
    if (!choice) return;

    setHistory((prev) => [...prev, { id: choice.next, choiceLabel: choice.text }]);
    setCurrentId(choice.next);
  };

  const handleBack = () => {
    setHistory((prev) => {
      if (prev.length <= 1) return prev;
      const updated = prev.slice(0, -1);
      setCurrentId(updated[updated.length - 1].id);
      return updated;
    });
  };

  const canGoBack = history.length > 1;

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-10">
      <header className="space-y-2 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">चाँद की कथा</p>
        <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">तरुण और नीली रोशनी</h1>
        <p className="text-base text-slate-600">
          यह एक इंटरएक्टिव हिंदी कथा है जिसमें आप हर मोड़ पर तरुण के कदम चुनते हैं। हर चयन एक नई
          भावना और नई सीख लेकर आता है।
        </p>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{node.title}</h2>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">अध्याय {history.length}</p>
          </div>
          <button
            type="button"
            onClick={handleBack}
            disabled={!canGoBack}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            पिछली झलक देखें
          </button>
        </div>

        <div className="mt-6 space-y-4 text-lg leading-relaxed text-slate-700">
          <p>{node.scene}</p>
          <p className="text-slate-500">{node.ambiance}</p>
        </div>

        {node.reflection && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-amber-900">
            <h3 className="text-sm font-semibold tracking-wide text-amber-700">अनुभूति</h3>
            <p className="mt-1 text-base leading-relaxed">{node.reflection}</p>
          </div>
        )}

        {node.choices && node.choices.length > 0 ? (
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {node.choices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                onClick={() => handleChoice(choice.id)}
                className={`flex flex-col gap-2 rounded-2xl border px-5 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 ${moodColors[choice.mood]} `}
              >
                <span className="text-sm uppercase tracking-[0.2em] text-slate-500">आगे की राह</span>
                <span className="text-lg font-semibold text-slate-900">{choice.text}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 text-emerald-900">
            <h3 className="text-lg font-semibold">कथा का उजाला</h3>
            <p className="mt-2 leading-relaxed">
              यात्रा यहाँ ठहरती है, लेकिन कहानी अब आपके भीतर चल रही है। बन्द करें आँखें और महसूस करें कि
              कौन-सी रोशनी आपने जगाई है।
            </p>
            <button
              type="button"
              onClick={() => {
                setCurrentId(rootNodeId);
                setHistory([{ id: rootNodeId }]);
              }}
              className="mt-4 inline-flex items-center justify-center rounded-full border border-emerald-400 bg-white/80 px-5 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-500 hover:bg-white"
            >
              कहानी दोबारा सुनें
            </button>
          </div>
        )}
      </section>

      <aside className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur">
        <h2 className="text-sm uppercase tracking-[0.3em] text-slate-400">आपकी यात्रा</h2>
        <ol className="mt-4 space-y-3">
          {history.map((step, index) => {
            const stepNode = storyGraph[step.id];
            return (
              <li key={`${step.id}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">क्षण {index + 1}</p>
                <p className="mt-1 text-base font-semibold text-slate-800">{stepNode.title}</p>
                {step.choiceLabel && (
                  <p className="mt-1 text-sm text-slate-600">आपने चुना: {step.choiceLabel}</p>
                )}
              </li>
            );
          })}
        </ol>
      </aside>
    </div>
  );
}
