"use client";

import { useState, useEffect } from "react";
import { TestCase as TestCaseType } from "../types/challenge";
import TestCase from "./TestCase";
import { TestResult } from "../types/challenge";

// Helper to safely stringify values, handling BigInt
function safeStringify(value: any): string {
  try {
    return JSON.stringify(value);
  } catch (error) {
    // If it contains BigInt, convert them to strings
    if (error instanceof TypeError && error.message.includes("BigInt")) {
      return JSON.stringify(value, (_, v) =>
        typeof v === "bigint" ? v.toString() : v
      );
    }
    // For other errors, return a simple string representation
    return String(value);
  }
}

interface TestResultsProps {
  testCases: any[];
  testResults: TestResult[];
  isLoading: boolean;
  output: string;
  runTests: () => void;
  verificationStage?: number; // 0: none, 1: syntax, 2: execution, 3: analysis
}

export default function TestResults({
  testCases,
  testResults,
  isLoading,
  output,
  runTests,
  verificationStage = 0,
}: TestResultsProps) {
  const [browserLogs, setBrowserLogs] = useState<string[]>([]);

  // Capture browser console logs
  useEffect(() => {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    console.log = (...args: any[]) => {
      setBrowserLogs((prev) => [
        ...prev,
        args
          .map((arg) => {
            if (typeof arg === "object") {
              return safeStringify(arg);
            }
            return String(arg);
          })
          .join(" "),
      ]);
      originalConsoleLog(...args);
    };

    console.error = (...args: any[]) => {
      setBrowserLogs((prev) => [
        ...prev,
        `ERROR: ${args
          .map((arg) => {
            if (typeof arg === "object") {
              return safeStringify(arg);
            }
            return String(arg);
          })
          .join(" ")}`,
      ]);
      originalConsoleError(...args);
    };

    console.warn = (...args: any[]) => {
      setBrowserLogs((prev) => [
        ...prev,
        `WARN: ${args
          .map((arg) => {
            if (typeof arg === "object") {
              return safeStringify(arg);
            }
            return String(arg);
          })
          .join(" ")}`,
      ]);
      originalConsoleWarn(...args);
    };

    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  // Collect all logs from test results
  const allTestLogs = testResults.reduce((logs, result) => {
    if (!result.logs || !result.logs.length) return logs;
    return [...logs, ...result.logs];
  }, [] as string[]);

  return (
    <div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Test Cases</h2>
          <button
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white text-sm px-4 py-2 rounded transition-colors"
            onClick={runTests}
            disabled={isLoading}
          >
            {isLoading ? "Running..." : "Run Tests"}
          </button>
        </div>

        {/* Verification Status - Only shown when testing is in progress */}
        {isLoading && (
          <div className="bg-[#151c34] rounded-md p-4 mb-4">
            <h3 className="font-medium text-gray-200 mb-3">
              Verification Status
            </h3>
            <div className="space-y-3">
              <VerificationStage
                number={1}
                label="Syntax Verification"
                isActive={verificationStage === 1}
                isComplete={verificationStage > 1}
              />
              <VerificationStage
                number={2}
                label="Test Execution"
                isActive={verificationStage === 2}
                isComplete={verificationStage > 2}
              />
              <VerificationStage
                number={3}
                label="Results Analysis"
                isActive={verificationStage === 3}
                isComplete={verificationStage > 3}
              />
            </div>
          </div>
        )}

        {testResults.length === 0 && !isLoading ? (
          <div className="space-y-3">
            {testCases.map((testCase, index) => (
              <div
                key={index}
                className="p-4 bg-[#141d36] rounded-md border border-gray-300"
              >
                <h3 className="font-medium text-gray-200 mb-2">
                  {testCase.description}
                </h3>
                <div className="text-xs text-gray-400">
                  <p>
                    <span className="font-medium">Input:</span>{" "}
                    {safeStringify(testCase.input)}
                  </p>
                  <p>
                    <span className="font-medium">Expected:</span>{" "}
                    {safeStringify(testCase.expectedOutput)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-md border ${
                  result.passed
                    ? "bg-green-900/20 border-green-700"
                    : "bg-red-900/20 border-red-700"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-200">
                    {result.description}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      result.passed
                        ? "bg-green-800 text-green-200"
                        : "bg-red-800 text-red-200"
                    }`}
                  >
                    {result.passed ? "Passed" : "Failed"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="space-y-1 overflow-auto">
                    <p className="text-gray-400">
                      <span className="font-medium">Input:</span>{" "}
                      <span className="font-mono">{result.input}</span>
                    </p>
                    <p className="text-gray-400">
                      <span className="font-medium">Expected:</span>{" "}
                      <span className="font-mono">{result.expected}</span>
                    </p>
                    <p
                      className={`${
                        result.passed ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      <span className="font-medium">Actual:</span>{" "}
                      <span className="font-mono">{result.actual}</span>
                    </p>
                  </div>

                  {/* Performance metrics - only shown if test passed */}
                  {result.passed && result.duration && (
                    <div className="bg-gray-800 p-2 rounded text-xs">
                      <h4 className="font-medium text-gray-200 mb-1">
                        Performance Metrics
                      </h4>
                      <p className="text-gray-400">
                        <span className="font-medium">Execution time:</span>{" "}
                        {result.duration}ms
                      </p>
                      {result.gasUsed && (
                        <p className="text-gray-400">
                          <span className="font-medium">Estimated gas:</span>{" "}
                          {result.gasUsed}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Console logs for this test - if any
                {result.logs && result.logs.length > 0 && (
                  <div className="mt-2 bg-gray-800 border border-gray-700 p-2 rounded text-xs">
                    <h4 className="font-medium text-gray-300 mb-1">
                      Console Output
                    </h4>
                    <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap max-h-20 overflow-y-auto">
                      {result.logs.map((log: string, i: number) => (
                        <div
                          key={i}
                          className={
                            log.startsWith("ERROR:")
                              ? "text-red-400"
                              : log.startsWith("WARN:")
                              ? "text-yellow-400"
                              : "text-green-400"
                          }
                        >
                          {log}
                        </div>
                      ))}
                    </pre>
                  </div>
                )} */}

                {/* Error details - only shown if test failed */}
                {!result.passed &&
                  result.actual &&
                  result.actual.includes("Error:") && (
                    <div className="mt-2 bg-red-900/30 border border-red-700/50 p-2 rounded text-xs">
                      <h4 className="font-medium text-red-300 mb-1">
                        Error Details
                      </h4>
                      <pre className="text-red-400 overflow-x-auto">
                        {result.actual}
                      </pre>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center p-6">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        )}

        {output && (
          <div
            className={`p-4 rounded-md ${
              output.includes("✅")
                ? "bg-green-900/20 border border-green-700"
                : output.includes("❌")
                ? "bg-red-900/20 border border-red-700"
                : "bg-gray-800 border border-gray-700"
            }`}
          >
            <h3 className="font-medium text-gray-200 mb-1">Result</h3>
            <p
              className={`text-sm ${
                output.includes("✅")
                  ? "text-green-400"
                  : output.includes("❌")
                  ? "text-red-400"
                  : "text-gray-400"
              }`}
            >
              {output}
            </p>
          </div>
        )}

        {/* Aggregated Console Logs Panel */}
        {(allTestLogs.length > 0 || browserLogs.length > 0) && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-300 mb-2">
              Console Output
            </h3>
            <div className="bg-[#1e1e1e] border border-gray-700 rounded-md p-3 max-h-40 overflow-y-auto">
              <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">
                {/* Test execution logs */}
                {allTestLogs.map((log: string, index: number) => (
                  <div
                    key={`test-${index}`}
                    className={
                      log.startsWith("ERROR:")
                        ? "text-red-400"
                        : log.startsWith("WARN:")
                        ? "text-yellow-400"
                        : "text-green-400"
                    }
                  >
                    {log}
                  </div>
                ))}

                {/* Browser logs */}
                {browserLogs.map((log: string, index: number) => (
                  <div
                    key={`browser-${index}`}
                    className={
                      log.startsWith("ERROR:")
                        ? "text-red-400"
                        : log.startsWith("WARN:")
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  >
                    {log}
                  </div>
                ))}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Verification stage component
interface VerificationStageProps {
  number: number;
  label: string;
  isActive: boolean;
  isComplete: boolean;
}

function VerificationStage({
  number,
  label,
  isActive,
  isComplete,
}: VerificationStageProps) {
  return (
    <div className="flex items-center">
      <div
        className={`
        w-6 h-6 rounded-full flex items-center justify-center
        ${
          isComplete
            ? "bg-green-600"
            : isActive
            ? "bg-blue-600 animate-pulse"
            : "bg-gray-700"
        }
        mr-2
      `}
      >
        {isComplete ? (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        ) : (
          <span className="text-white text-xs">{number}</span>
        )}
      </div>
      <div>
        <span
          className={`
          text-xs font-medium
          ${
            isComplete
              ? "text-green-400"
              : isActive
              ? "text-blue-400"
              : "text-gray-500"
          }
        `}
        >
          {label}
        </span>
        {isActive && !isComplete && (
          <span className="ml-2 text-xs text-gray-300">Processing...</span>
        )}
      </div>
    </div>
  );
}
