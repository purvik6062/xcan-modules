"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";
import type { ReactNode } from "react";

const questionMarkdownComponents = {
  p: ({ children }: { children?: ReactNode }) => (
    <span className="text-gray-200">{children}</span>
  ),
  code: ({
    className,
    children,
  }: {
    className?: string;
    children?: ReactNode;
  }) => {
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

/**
 * Renders question text with syntax-highlighted code blocks.
 * Parses markdown so ```rust ... ``` blocks become proper CodeBlocks
 * instead of ugly raw text.
 */
function QuestionTextInner({ text }: { text: string }) {
  return (
    <div className="text-sm leading-snug text-gray-200 sm:text-base lg:text-sm lg:leading-normal">
      <ReactMarkdown components={questionMarkdownComponents}>
        {text}
      </ReactMarkdown>
    </div>
  );
}

export const QuestionText = memo(QuestionTextInner);
