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
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
      <div className="font-medium">{test.description}</div>
      <div className="text-sm mt-1">
        <span className="text-gray-500">Input:</span>{" "}
        {JSON.stringify(test.input)}
      </div>
      <div className="text-sm">
        <span className="text-gray-500">Expected:</span>{" "}
        {formatExpectedOutput(test.expectedOutput)}
      </div>

      {result && (
        <div
          className={`mt-2 text-sm ${
            result.passed ? "text-green-600" : "text-red-600"
          }`}
        >
          {result.passed ? "✓ Passed" : `✗ Failed - Got: ${result.actual}`}
        </div>
      )}
    </div>
  );
}
