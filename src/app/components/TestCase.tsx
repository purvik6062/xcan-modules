import React from 'react';
import { FiCheckCircle, FiXCircle, FiCode, FiPlay } from 'react-icons/fi';
import { GoNumber } from 'react-icons/go';

interface TestCase {
  description: string;
  input: any[];
  expectedOutput: any;
}

interface TestResult {
  description: string;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
}

interface TestCaseProps {
  test: TestCase;
  result?: TestResult;
  index: number;
}

export default function TestCase({ test, result, index }: TestCaseProps) {
  // Helper function to format expected output for display
  const formatExpectedOutput = (expectedOutput: any) => {
    if (expectedOutput.type === "bigint") {
      return "BigInt value";
    } else if (expectedOutput.hasProperties) {
      return `Array with indices: ${expectedOutput.hasProperties.join(", ")}`;
    } else if (expectedOutput.value) {
      return expectedOutput.value.toString();
    } else {
      return JSON.stringify(expectedOutput);
    }
  };

  return (
    <div className="bg-[#0f1d3a]/50 border border-[#1d315e]/50 rounded-lg p-4 text-gray-300">
      {/* Test case header with number */}
      <div className="flex items-start mb-3">
        <div className="bg-blue-700 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
          <span className="text-sm font-semibold">{index + 1}</span>
        </div>
        <div className="flex-1">
          <div className="font-medium text-blue-300 mb-2">{test.description}</div>
        </div>
      </div>

      {/* Input section */}
      <div className="ml-11 space-y-2">
        <div className="flex items-start">
          <FiPlay className="text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-blue-400 font-medium">Input: </span>
            <code className="bg-[#152241] px-2 py-0.5 rounded text-blue-300 font-mono text-sm">
              {JSON.stringify(test.input)}
            </code>
          </div>
        </div>

        {/* Expected output section */}
        <div className="flex items-start">
          <FiCode className="text-green-400 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-green-400 font-medium">Expected: </span>
            <code className="bg-[#152241] px-2 py-0.5 rounded text-green-300 font-mono text-sm">
              {formatExpectedOutput(test.expectedOutput)}
            </code>
          </div>
        </div>

        {/* Result section (if available) */}
        {result && (
          <div className="mt-3 pt-3 border-t border-[#1d315e]/50">
            <div className="flex items-start">
              {result.passed ? (
                <FiCheckCircle className="text-green-400 mr-2 mt-0.5 flex-shrink-0" />
              ) : (
                <FiXCircle className="text-red-400 mr-2 mt-0.5 flex-shrink-0" />
              )}
              <div>
                {result.passed ? (
                  <span className="text-green-400 font-medium">✓ Test Passed</span>
                ) : (
                  <div>
                    <span className="text-red-400 font-medium">✗ Test Failed</span>
                    <div className="mt-1">
                      <span className="text-red-300">Got: </span>
                      <code className="bg-[#152241] px-2 py-0.5 rounded text-red-300 font-mono text-sm">
                        {result.actual}
                      </code>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}