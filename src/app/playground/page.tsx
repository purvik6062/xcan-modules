"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

// Boilerplate code for different languages
const pythonBoilerplateCode = `# A simple function that returns the sum of two numbers
def add(a, b):
    return a + b

# Example usage
result = add(5, 7)
print(f"5 + 7 = {result}")
print("Hello from Python!")`;

const cppBoilerplateCode = `#include <iostream>

// A simple function that returns the sum of two numbers
int add(int a, int b) {
  return a + b;
}

int main() {
  // Example usage
  int result = add(5, 7);
  std::cout << "5 + 7 = " << result << std::endl;
  std::cout << "Hello from C++!" << std::endl;
  return 0;
}`;

const rustBoilerplateCode = `// A simple function that returns the sum of two numbers
fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    // Example usage
    let result = add(5, 7);
    println!("5 + 7 = {}", result);
    println!("Hello from Rust!");
}`;

const csharpBoilerplateCode = `using System;

class Program {
    // A simple function that returns the sum of two numbers
    static int Add(int a, int b) {
        return a + b;
    }

    static void Main() {
        // Example usage
        int result = Add(5, 7);
        Console.WriteLine("5 + 7 = " + result);
        Console.WriteLine("Hello from C#!");
    }
}`;

const cBoilerplateCode = `#include <stdio.h>

// A simple function that returns the sum of two numbers
int add(int a, int b) {
    return a + b;
}

int main() {
    // Example usage
    int result = add(5, 7);
    printf("5 + 7 = %d\\n", result);
    printf("Hello from C!\\n");
    return 0;
}`;

const javascriptBoilerplateCode = `// A simple function that returns the sum of two numbers
function add(a, b) {
  return a + b;
}

// Example usage
const result = add(5, 7);
console.log(\`5 + 7 = \${result}\`);
console.log("Hello from JavaScript!");`;

export default function Playground() {
  const [code, setCode] = useState(javascriptBoilerplateCode);
  const [output, setOutput] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isRunning, setIsRunning] = useState(false);

  // Language IDs for Rapid API
  const languageMap = {
    javascript: '17',
    python: '5',
    c: '6',
    c_cpp: '7',
    rust: '46',
    csharp: '1',
  };

  // Set dark mode when the component mounts
  useEffect(() => {
    // Check for dark mode preference
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(isDark);

    // Check if there's a saved language preference
    const savedLanguage = localStorage.getItem("playground_language");
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }

    // Load saved code for the current language
    const savedCode = localStorage.getItem(`playground_${savedLanguage || 'javascript'}_code`);
    if (savedCode) {
      setCode(savedCode);
    }
  }, []);

  // Handle editor mounting
  function handleEditorDidMount() {
    setEditorReady(true);
  }

  // Handle code changes
  function handleEditorChange(value: string | undefined) {
    if (value !== undefined) {
      setCode(value);
      localStorage.setItem(`playground_${selectedLanguage}_code`, value);
    }
  }

  // Handle language change  
  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const language = event.target.value;
    setSelectedLanguage(language);
    localStorage.setItem("playground_language", language);
    
    // Load saved code for the selected language, or use default boilerplate
    const savedCode = localStorage.getItem(`playground_${language}_code`);
    
    if (savedCode) {
      setCode(savedCode);
    } else {
      // Set boilerplate code based on language
      let boilerplate = javascriptBoilerplateCode;
      
      if (language === 'javascript') {
        boilerplate = javascriptBoilerplateCode;
      } else if (language === 'python') {
        boilerplate = pythonBoilerplateCode;
      } else if (language === 'c_cpp') {
        boilerplate = cppBoilerplateCode;
      } else if (language === 'rust') {
        boilerplate = rustBoilerplateCode;
      } else if (language === 'csharp') {
        boilerplate = csharpBoilerplateCode;
      } else if (language === 'c') {
        boilerplate = cBoilerplateCode;
      }
      
      setCode(boilerplate);
      localStorage.setItem(`playground_${language}_code`, boilerplate);
    }
  };
  
  // Reset code to default
  const handleReset = () => {
    let defaultCode = javascriptBoilerplateCode;
    
    if (selectedLanguage === 'javascript') {
      defaultCode = javascriptBoilerplateCode;
    } else if (selectedLanguage === 'python') {
      defaultCode = pythonBoilerplateCode;
    } else if (selectedLanguage === 'c_cpp') {
      defaultCode = cppBoilerplateCode;
    } else if (selectedLanguage === 'rust') {
      defaultCode = rustBoilerplateCode;
    } else if (selectedLanguage === 'csharp') {
      defaultCode = csharpBoilerplateCode;
    } else if (selectedLanguage === 'c') {
      defaultCode = cBoilerplateCode;
    }
    
    setCode(defaultCode);
    localStorage.setItem(`playground_${selectedLanguage}_code`, defaultCode);
  };

  // Run code using Rapid API compiler
  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("Running your code...");
    
    try {
      const response = await axios.post('/api/compile', {
        languageChoice: languageMap[selectedLanguage as keyof typeof languageMap],
        program: code
      });
      
      if (response.data.Result) {
        setOutput(response.data.Result);
      } else if (response.data.Errors) {
        setOutput(response.data.Errors);
      } else if (response.data.error) {
        setOutput(`Error: ${response.data.error}`);
      } else {
        setOutput('No output or errors available.');
      }
    } catch (error: any) {
      console.error(error);
      setOutput(`Error: ${error.message || "Unknown error occurred while executing code."}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Code Playground</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Test and run code in different languages using the Stylus APIs
        </p>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold">Code Editor</h3>
              <select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className="ml-2 px-2 py-1 text-sm rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="c_cpp">C++</option>
                <option value="rust">Rust</option>
                <option value="c">C</option>
                <option value="csharp">C#</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <button
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1 rounded text-sm"
                onClick={handleReset}
              >
                Reset
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                onClick={handleRunCode}
                disabled={isRunning}
              >
                {isRunning ? "Running..." : "Run Code"}
              </button>
            </div>
          </div>
        </div>

        <div className="h-[600px] overflow-hidden">
          <Editor
            height="600px"
            defaultLanguage="typescript"
            language={
              selectedLanguage === "c_cpp" ? "cpp" : selectedLanguage
            }
            defaultValue={code}
            value={code}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            theme={isDarkMode ? "vs-dark" : "light"}
            beforeMount={(monaco) => {
              // Disable TypeScript validation
              monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
                {
                  noSemanticValidation: true,
                  noSyntaxValidation: true,
                }
              );
            }}
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

        <div className="bg-gray-100 dark:bg-gray-800 p-3 border-t border-gray-200 dark:border-gray-700 h-[200px] overflow-auto">
          <div className="font-mono text-sm whitespace-pre-wrap">
            {output ? (
              <div
                className={
                  output.includes("Error")
                    ? "text-red-600"
                    : "text-green-600"
                }
              >
                {output}
              </div>
            ) : (
              <div className="text-gray-500">Run code to see results</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
