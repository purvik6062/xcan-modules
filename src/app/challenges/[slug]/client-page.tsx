"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CodeEditor from "../../components/CodeEditor";
import ChallengeDetails from "../../components/ChallengeDetails";
import InstructionsPanel from "../../components/InstructionsPanel";
import TestResults from "../../components/TestResults";
import { Challenge, TestResult } from "../../types/challenge";

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
  const [activeTab, setActiveTab] = useState("instructions"); // instructions, tests

  // Set the initial code when the component mounts
  useEffect(() => {
    if (challenge) {
      setCode(challenge.startingCode);
    }
  }, [challenge]);

  // Handle code changes
  function handleEditorChange(value: string | undefined) {
    if (value !== undefined) {
      setCode(value);
    }
  }

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
      <ChallengeDetails challenge={challenge} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left panel: Instructions/Tests */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === "instructions"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
                onClick={() => setActiveTab("instructions")}
                aria-label="Show instructions"
              >
                Instructions
              </button>
              <button
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === "tests"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
                onClick={() => setActiveTab("tests")}
                aria-label="Show tests"
              >
                Tests
              </button>
            </div>
          </div>

          <div className="p-4 h-[600px] overflow-y-auto">
            {activeTab === "instructions" ? (
              <InstructionsPanel instructions={challenge.instructions} />
            ) : (
              <TestResults
                testCases={challenge.testCases}
                testResults={testResults}
                isLoading={isLoading}
                output={output}
                runTests={runTests}
              />
            )}
          </div>
        </div>

        {/* Right panel: Code editor */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Code Editor</h3>
              <div className="flex space-x-2">
                <button
                  className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1 rounded text-sm transition-colors"
                  onClick={() => setCode(challenge.startingCode)}
                >
                  Reset
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded transition-colors"
                  onClick={runTests}
                  disabled={isLoading}
                >
                  {isLoading ? "Running..." : "Run Tests"}
                </button>
              </div>
            </div>
          </div>

          <div className="h-[500px] overflow-hidden">
            <CodeEditor
              defaultValue={challenge.startingCode}
              value={code}
              onChange={handleEditorChange}
            />
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="font-mono text-sm">
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
                <div className="text-gray-500">Run tests to see results</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
