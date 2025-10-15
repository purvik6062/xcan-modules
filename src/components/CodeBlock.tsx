"use client";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';

interface CodeBlockProps {
  children: string;
  className?: string;
  inline?: boolean;
}

export default function CodeBlock({ children, className, inline }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  
  // Extract language from className (format: language-js, language-typescript, etc.)
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'typescript';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Inline code (single backticks)
  if (inline) {
    return (
      <code className="bg-blue-900/30 text-cyan-300 px-2 py-1 rounded text-sm font-mono border border-blue-700/50">
        {children}
      </code>
    );
  }

  // Custom dark blue theme based on vscDarkPlus
  const customTheme = {
    ...vscDarkPlus,
    'pre[class*="language-"]': {
      ...vscDarkPlus['pre[class*="language-"]'],
      background: 'linear-gradient(135deg, #0a1628 0%, #111c33 100%)',
      padding: '1.5rem',
      borderRadius: '0.75rem',
      margin: 0,
      border: '1px solid rgba(59, 130, 246, 0.2)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
    },
    'code[class*="language-"]': {
      ...vscDarkPlus['code[class*="language-"]'],
      background: 'transparent',
      fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
      fontSize: '0.875rem',
      lineHeight: '1.6',
    }
  };

  // Code block (triple backticks)
  return (
    <div className="relative group my-6">
      {/* Header with language label and copy button */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-950 to-slate-900 px-4 py-2 rounded-t-lg border border-blue-800/40 border-b-0">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <span className="text-xs font-medium text-blue-300 ml-2">
            {language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-blue-300 hover:text-blue-200 bg-blue-900/30 hover:bg-blue-900/50 rounded transition-all duration-200 border border-blue-700/30 hover:border-blue-600/50"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      
      {/* Code content */}
      <div className="rounded-b-lg overflow-hidden">
        <SyntaxHighlighter
          language={language}
          style={customTheme}
          customStyle={{
            margin: 0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
          showLineNumbers={true}
          lineNumberStyle={{
            minWidth: '3em',
            paddingRight: '1em',
            color: '#4a5568',
            userSelect: 'none',
          }}
          wrapLines={true}
          wrapLongLines={true}
        >
          {children}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

