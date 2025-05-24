import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface HintsPanelProps {
  hints: string[];
}

export default function HintsPanel({ hints }: HintsPanelProps) {
  const [revealedHints, setRevealedHints] = useState<boolean[]>(
    Array(hints.length).fill(false)
  );

  const revealHint = (index: number) => {
    const newRevealedHints = [...revealedHints];
    newRevealedHints[index] = true;
    setRevealedHints(newRevealedHints);
  };

  if (!hints || hints.length === 0) {
    return (
      <div className="bg-gray-800 rounded-md p-4">
        <p className="text-gray-400 italic">
          No hints available for this challenge.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-white mb-3">Challenge Hints</h2>

      <p className="text-sm text-gray-400 mb-4">
        Stuck? These hints can guide you without giving away the complete
        solution. Reveal them one by one as needed.
      </p>

      {hints.map((hint, index) => (
        <div
          key={index}
          className="bg-gray-800 rounded-md overflow-hidden border border-gray-700"
        >
          <div className="p-3 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-300">
              Hint {index + 1} {revealedHints[index] ? "" : "(Hidden)"}
            </h3>
            {!revealedHints[index] && (
              <button
                onClick={() => revealHint(index)}
                className="text-xs cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
              >
                Reveal Hint
              </button>
            )}
          </div>

          <div className={`p-3 ${!revealedHints[index] && "hidden"}`}>
            <div className="prose prose-sm prose-invert max-w-none">
              <ReactMarkdown>{hint}</ReactMarkdown>
            </div>
          </div>
        </div>
      ))}

      <div className="mt-6 p-4 bg-gray-800 rounded-md border-l-4 border-yellow-500">
        <h3 className="text-sm font-medium text-gray-200 mb-1">
          Challenge yourself!
        </h3>
        <p className="text-xs text-gray-400">
          Try to solve the challenge on your own before revealing all hints.
          Each hint you don&apos;t need to use demonstrates your growing expertise!
        </p>
      </div>
    </div>
  );
}
