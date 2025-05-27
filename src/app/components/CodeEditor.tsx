"use client";

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
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // Disable TypeScript validation for better performance
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });

    // Define custom theme
    monaco.editor.defineTheme("myCustomTheme", {
      base: "vs-dark", // Base theme: 'vs', 'vs-dark', or 'hc-black'
      inherit: true, // Inherit styles from the base theme
      rules: [
        { token: "comment", foreground: "658218", fontStyle: "italic" }, // Orange italic comments
        { token: "keyword", foreground: "569cd6" }, // Green keywords
      ],
      colors: {
        "editor.background": "#0A142A",
        "editor.foreground": "#d4d4d4",
        "editorLineNumber.foreground": "#5c6b99", // Lighter shade for line numbers
      },
    });

    // Set the custom theme
    monaco.editor.setTheme("myCustomTheme");
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
        theme="myCustomTheme" // Updated to use the custom theme explicitly
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineHeight: 20,
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
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 6,
          },
          suggest: { showInlineDetails: true },
          parameterHints: { enabled: true },
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
