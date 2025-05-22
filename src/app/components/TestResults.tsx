"use client";

import { TestCase as TestCaseType } from "../types/challenge";
import TestCase from "./TestCase";
import { TestResult } from "../types/challenge";

interface TestResultsProps {
  testCases: TestCaseType[];
  testResults: TestResult[];
  isLoading: boolean;
  output: string;
  runTests: () => void;
}

export default function TestResults({
  testCases,
  testResults,
  isLoading,
  output,
  runTests,
}: TestResultsProps) {
  const getOutputStyle = () => {
    if (output.includes("Error")) {
      return "text-red-600";
    } else if (output.includes("0/")) {
      return "text-red-600";
    } else if (output) {
      return "text-green-600";
    }
    return "text-gray-500";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Test Cases</h3>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          onClick={runTests}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Running Tests...
            </div>
          ) : (
            "Run Tests"
          )}
        </button>
      </div>

      <div className="space-y-4">
        {testCases.map((test, index) => (
          <TestCase
            key={index}
            test={test}
            result={testResults[index]}
            index={index}
          />
        ))}
      </div>

      <div
        className={`mt-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg ${getOutputStyle()}`}
      >
        {output ? (
          <div>{output}</div>
        ) : (
          <div className="text-gray-500">Run tests to see results</div>
        )}
      </div>
    </div>
  );
}
