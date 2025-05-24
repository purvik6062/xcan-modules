"use client";

import { useEffect, useState } from "react";
import Editor, { OnMount } from "@monaco-editor/react";

interface CodeEditorProps {
  defaultValue: string;
  value: string;
  onChange: (value: string | undefined) => void;
  height?: string;
  isLoading?: boolean;
}

export default function CodeEditor({
  defaultValue,
  value,
  onChange,
  height = "100%",
  isLoading = false,
}: CodeEditorProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect dark mode on component mount
  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(isDark);

    // Listen for changes in color scheme preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // Disable TypeScript validation for better performance
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });
  };

  return (
    <div className="h-full overflow-hidden">
      <Editor
        height={height}
        defaultLanguage="typescript"
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        theme={isDarkMode ? "vs-dark" : "light"}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          wordWrap: "on",
          formatOnPaste: true,
          formatOnType: true,
          automaticLayout: true,
          tabSize: 2,
          lineNumbers: "on",
          glyphMargin: true,
          folding: true,
          scrollbar: {
            vertical: "visible",
            verticalScrollbarSize: 14,
            horizontalScrollbarSize: 14
          },
          suggest: {
            showInlineDetails: true,
          },
          parameterHints: {
            enabled: true,
          },
        }}
        loading={
          <div className="flex justify-center items-center h-full text-gray-500">
            Loading Editor...
          </div>
        }
      />
    </div>
  );
}
