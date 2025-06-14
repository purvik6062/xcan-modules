"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface InteractiveCodeDisplayProps {
  code: string;
  language?: string;
  title?: string;
  description?: string;
  highlightLines?: number[];
}

export default function InteractiveCodeDisplay({
  code,
  language = "javascript",
  title = "Code Example",
  description,
  highlightLines = [],
}: InteractiveCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  // Simple and reliable syntax highlighting
  const highlightSyntax = (line: string) => {
    // Escape HTML first
    let highlighted = line
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Define patterns that won't overlap
    const patterns = [
      // Comments (must come first)
      {
        regex: /(\/\/.*$|\/\*[\s\S]*?\*\/)/g,
        className: "text-gray-500 italic",
      },
      // Strings
      {
        regex: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,
        className: "text-green-400",
      },
      // Numbers
      { regex: /\b(\d+(?:\.\d+)?)\b/g, className: "text-orange-400" },
      // Keywords
      {
        regex:
          /\b(function|const|let|var|if|else|for|while|return|import|export|from|async|await|class|interface|type|contract|pragma|solidity|public|private|external|internal|view|pure|payable|memory|storage|calldata|require|emit|try|catch|throw|new|this|super|extends|implements)\b/g,
        className: "text-blue-400 font-semibold",
      },
      // Types
      {
        regex:
          /\b(string|number|boolean|uint256|address|bytes|mapping|array|object|undefined|null|void)\b/g,
        className: "text-cyan-400",
      },
    ];

    // Apply each pattern
    patterns.forEach(({ regex, className }) => {
      highlighted = highlighted.replace(
        regex,
        `<span class="${className}">$1</span>`
      );
    });

    return highlighted;
  };

  const codeLines = code.split("\n");

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-700 mb-6">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">{title}</span>
            {language && (
              <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs font-mono uppercase">
                {language}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-3 py-1.5 rounded text-sm transition-colors"
        >
          <span className="text-sm">{copied ? "✅" : "📋"}</span>
          <span>{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>

      {/* Description */}
      {description && (
        <div className="bg-blue-900/30 px-4 py-3 border-b border-gray-700">
          <p className="text-blue-200 text-sm">{description}</p>
        </div>
      )}

      {/* Code Content */}
      <div className="relative">
        <div className="flex">
          {/* Line Numbers */}
          <div className="bg-gray-800 px-3 py-4 text-gray-500 text-sm font-mono select-none border-r border-gray-700">
            {codeLines.map((_, index) => (
              <div
                key={index}
                className={`leading-6 text-right min-w-[2rem] ${
                  highlightLines.includes(index + 1)
                    ? "text-yellow-400 font-bold"
                    : ""
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>

          {/* Code */}
          <div className="flex-1 p-4 overflow-x-auto">
            <pre className="text-sm font-mono leading-6">
              {codeLines.map((line, index) => (
                <div
                  key={index}
                  className={`${
                    highlightLines.includes(index + 1)
                      ? "bg-yellow-500/10 border-l-2 border-yellow-400 pl-2 -ml-2"
                      : ""
                  }`}
                >
                  <code
                    className="text-gray-100"
                    dangerouslySetInnerHTML={{
                      __html: highlightSyntax(line || " "),
                    }}
                  />
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 px-4 py-2 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{codeLines.length} lines</span>
          <div className="flex items-center gap-4">
            {highlightLines.length > 0 && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-yellow-400 rounded"></span>
                Key lines highlighted
              </span>
            )}
            <span>Click to copy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
