"use client";

import { memo, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";

const markdownComponents = {
  h1: ({ children }: { children?: ReactNode }) => (
    <h1 className="mb-4 border-b border-gray-600 pb-2 text-2xl font-bold text-white sm:text-3xl sm:mb-6 lg:mb-4 lg:text-2xl">
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 className="mb-3 mt-6 text-xl font-semibold text-blue-300 sm:mb-4 sm:mt-8 sm:text-2xl lg:mb-3 lg:mt-5 lg:text-lg">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h3 className="mb-2 mt-5 text-lg font-semibold text-cyan-300 sm:mb-3 sm:mt-6 sm:text-xl lg:mb-2 lg:mt-4 lg:text-base">
      {children}
    </h3>
  ),
  p: ({ children }: { children?: ReactNode }) => (
    <p className="mb-3 text-sm leading-6 text-gray-200 sm:mb-4 sm:text-base sm:leading-7 lg:mb-3 lg:text-sm lg:leading-relaxed">
      {children}
    </p>
  ),
  strong: ({ children }: { children?: ReactNode }) => (
    <strong className="text-blue-300 font-semibold">{children}</strong>
  ),
  em: ({ children }: { children?: ReactNode }) => (
    <em className="text-cyan-300 italic">{children}</em>
  ),
  hr: () => <hr className="border-gray-600 my-8" />,
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="mb-3 ml-4 list-inside list-disc space-y-1.5 text-sm text-gray-300 sm:mb-4 sm:space-y-2 sm:text-base lg:mb-3 lg:text-sm">
      {children}
    </ul>
  ),
  li: ({ children }: { children?: ReactNode }) => (
    <li className="mb-0.5 leading-snug text-gray-200 sm:mb-1 sm:leading-6 lg:text-sm">{children}</li>
  ),
  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-300 bg-gray-800/50 py-2 rounded-r my-4">
      {children}
    </blockquote>
  ),
  code: ({ className, children }: { className?: string; children?: ReactNode }) => {
    const codeString = String(children).replace(/\n$/, "");
    const isInline = !className;
    return (
      <CodeBlock className={className} inline={isInline}>
        {codeString}
      </CodeBlock>
    );
  },
  pre: ({ children }: { children?: ReactNode }) => <>{children}</>,
};

function StoryQuizMarkdownPanelInner({ story }: { story: string }) {
  return (
    <div className="prose prose-sm max-w-none prose-invert sm:prose-lg prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-sm prose-p:leading-relaxed prose-p:mb-3 prose-strong:text-blue-300 prose-em:text-cyan-300 lg:prose-h1:text-2xl lg:prose-h2:text-lg lg:prose-h3:text-base lg:prose-p:text-sm lg:prose-p:mb-3">
      <div className="space-y-4 font-sans leading-relaxed text-gray-200 sm:space-y-6 lg:space-y-4">
        <ReactMarkdown components={markdownComponents}>{story}</ReactMarkdown>
      </div>
    </div>
  );
}

export const StoryQuizMarkdownPanel = memo(StoryQuizMarkdownPanelInner);
