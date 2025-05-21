"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Editor from "@monaco-editor/react";
import axios from "axios";

interface TestCase {
  input: any[];
  expectedOutput: any;
  description: string;
}

interface Challenge {
  id: number;
  title: string;
  level: string;
  description: string;
  category: string;
  points: number;
  instructions: string;
  testCases: TestCase[];
  startingCode: string;
  solution: string;
  precompileUsed: string;
}

interface TestResult {
  description: string;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
}

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

export default function ClientChallenge({
  challenge,
  slug,
}: {
  challenge: Challenge;
  slug: string | any;
}) {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("instructions"); // instructions, code, tests
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

  // Set the initial code and detect dark mode when the component mounts
  useEffect(() => {
    if (challenge) {
      setCode(challenge.startingCode);
    }

    // Check for dark mode preference
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(isDark);

    // Check if there's a saved language preference
    const savedLanguage = localStorage.getItem(`${slug}_language`);
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }

    // Load saved code for the current language and challenge
    const savedCode = localStorage.getItem(`${slug}_${savedLanguage || 'javascript'}_code`);
    if (savedCode) {
      setCode(savedCode);
    }
  }, [challenge, slug]);

  // Handle editor mounting
  function handleEditorDidMount() {
    setEditorReady(true);
  }

  // Handle code changes
  function handleEditorChange(value: string | undefined) {
    if (value !== undefined) {
      setCode(value);
      localStorage.setItem(`${slug}_${selectedLanguage}_code`, value);
    }
  }

  // Handle language change  
  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const language = event.target.value;
    setSelectedLanguage(language);
    localStorage.setItem(`${slug}_language`, language);
    
    // Load saved code for the selected language, or use default boilerplate
    const savedCode = localStorage.getItem(`${slug}_${language}_code`);
    
    if (savedCode) {
      setCode(savedCode);
    } else {
      // Set boilerplate code based on language
      let boilerplate = challenge.startingCode;
      
      if (language === 'javascript') {
        // For JavaScript, always use the challenge's starting code
        boilerplate = challenge.startingCode;
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
      localStorage.setItem(`${slug}_${language}_code`, boilerplate);
    }
  };
  
  // Reset code to default
  const handleReset = () => {
    let defaultCode = challenge.startingCode;
    
    if (selectedLanguage === 'javascript') {
      defaultCode = challenge.startingCode;
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
    localStorage.setItem(`${slug}_${selectedLanguage}_code`, defaultCode);
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

  // Run the tests
  const runTests = () => {
    setIsLoading(true);
    setTestResults([]);
    setOutput("");

    // In a real implementation, this would connect to Arbitrum and execute the code
    // For demonstration, we're simulating with simplified checks
    setTimeout(() => {
      try {
        // IMPORTANT: In a real implementation, we would:
        // 1. Send the code to a backend for safe execution
        // 2. The backend would run the code against Arbitrum Sepolia
        // 3. Return the results securely

        // For the demo, we'll do some simple validation
        const results = challenge.testCases.map((testCase) => {
          // Simple check for type-based expectations
          let passed = false;
          let actual = "Not evaluated (simulation)";

          if (testCase.expectedOutput.type === "bigint") {
            // Check if the code attempts to return a BigInt
            passed =
              code.includes("return") &&
              (code.includes("BigInt") ||
                code.includes("await") ||
                code.includes(".arbBlockNumber()") ||
                code.includes(".arbChainID()") ||
                code.includes(".arbOSVersion()") ||
                code.includes(".getPricesInWei()"));
            actual = `${passed ? "Valid" : "Invalid"} BigInt return`;
          } else if (testCase.expectedOutput.hasProperties) {
            // Check if the code attempts to return an object with required properties
            const props = testCase.expectedOutput.hasProperties;
            passed =
              code.includes("return") &&
              code.includes("[") &&
              props.every(
                (prop: string) =>
                  code.includes(`version[${prop}]`) || code.includes("return [")
              );
            actual = `Array with ${passed ? "valid" : "missing"} properties`;
          } else if (testCase.expectedOutput.value) {
            // Check for specific expected value
            passed =
              code.includes(testCase.expectedOutput.value.toString()) ||
              code.includes(".arbChainID()");
            actual = passed
              ? "Likely correct implementation"
              : "Implementation may not return correct value";
          } else if (testCase.expectedOutput.type === "object") {
            // Check if it returns a transaction receipt
            passed =
              code.includes("return receipt") ||
              (code.includes("return") && code.includes("tx.wait()"));
            actual = passed
              ? "Valid transaction receipt return"
              : "Missing transaction receipt return";
          }

          return {
            description: testCase.description,
            input: JSON.stringify(testCase.input),
            expected: JSON.stringify(testCase.expectedOutput),
            actual,
            passed,
          };
        });

        setTestResults(results);

        // Calculate summary
        const passedCount = results.filter((r) => r.passed).length;
        const totalCount = results.length;

        // Set output message
        if (passedCount === totalCount) {
          setOutput(
            `Tests: ${passedCount}/${totalCount} passed! Note: This is a simulation. In production, your code would be executed against the actual Arbitrum network.`
          );
        } else {
          setOutput(
            `Tests: ${passedCount}/${totalCount} passed. Review your implementation and try again.`
          );
        }
      } catch (error: any) {
        setOutput(`Error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{challenge.title}</h1>
        <div className="flex items-center space-x-2">
          <span
            className={`text-xs px-2 py-1 rounded ${
              challenge.level === "Beginner"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : challenge.level === "Intermediate"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {challenge.level}
          </span>
          <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 text-xs">
            {challenge.category}
          </span>
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded px-2 py-1 text-xs">
            {challenge.precompileUsed}
          </span>
          <span className="font-semibold text-sm">
            {challenge.points} points
          </span>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {challenge.description}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left panel: Instructions/Tests */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 rounded ${
                  activeTab === "instructions"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
                onClick={() => setActiveTab("instructions")}
              >
                Instructions
              </button>
              <button
                className={`px-3 py-1 rounded ${
                  activeTab === "tests"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
                onClick={() => setActiveTab("tests")}
              >
                Tests
              </button>
            </div>
          </div>

          <div className="p-4 h-[600px] overflow-y-auto">
            {activeTab === "instructions" ? (
              <div className="prose dark:prose-invert max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: challenge.instructions
                      .replace(
                        /^#{1,6}\s+(.*)$/gm,
                        '<h3 class="font-bold text-xl mb-2">$1</h3>'
                      )
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\*(.*?)\*/g, "<em>$1</em>")
                      .replace(
                        /```(?:js|javascript)\n([\s\S]*?)```/g,
                        '<pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded my-3 overflow-x-auto"><code>$1</code></pre>'
                      )
                      .replace(
                        /`(.*?)`/g,
                        '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">$1</code>'
                      )
                      .replace(/\n\n/g, "<br/><br/>"),
                  }}
                />
              </div>
            ) : (
              <div>
                <h3 className="font-bold text-lg mb-4">Test Cases</h3>
                <div className="space-y-4">
                  {challenge.testCases.map((test, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                    >
                      <div className="font-medium">{test.description}</div>
                      <div className="text-sm mt-1">
                        <span className="text-gray-500">Input:</span>{" "}
                        {JSON.stringify(test.input)}
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Expected:</span>{" "}
                        {test.expectedOutput.type === "bigint"
                          ? "BigInt value"
                          : test.expectedOutput.hasProperties
                          ? `Array with indices: ${test.expectedOutput.hasProperties.join(
                              ", "
                            )}`
                          : test.expectedOutput.value
                          ? test.expectedOutput.value.toString()
                          : JSON.stringify(test.expectedOutput)}
                      </div>

                      {testResults[index] && (
                        <div
                          className={`mt-2 text-sm ${
                            testResults[index].passed
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {testResults[index].passed
                            ? "✓ Passed"
                            : `✗ Failed - Got: ${testResults[index].actual}`}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right panel: Code editor */}
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
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
                  onClick={runTests}
                  disabled={isLoading}
                >
                  {isLoading ? "Testing..." : "Run Tests"}
                </button>
              </div>
            </div>
          </div>

          <div className="h-[500px] overflow-hidden">
            {/* Using Monaco Editor with enhanced options */}
            <Editor
              height="500px"
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

          <div className="bg-gray-100 dark:bg-gray-800 p-3 border-t border-gray-200 dark:border-gray-700 h-[120px] overflow-auto">
            <div className="font-mono text-sm whitespace-pre-wrap">
              {output ? (
                <div
                  className={
                    output.includes("Error")
                      ? "text-red-600"
                      : output.includes("0/")
                      ? "text-red-600"
                      : "text-green-600"
                  }
                >
                  {output}
                </div>
              ) : (
                <div className="text-gray-500">Run code or tests to see results</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
