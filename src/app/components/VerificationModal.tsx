import { useState, useEffect } from "react";
import { TestResult } from "../types/challenge";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  testResults: TestResult[];
  allPassed: boolean;
}

export default function VerificationModal({
  isOpen,
  onClose,
  testResults,
  allPassed,
}: VerificationModalProps) {
  const [currentStage, setCurrentStage] = useState(1);
  const [stagesComplete, setStagesComplete] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  // Simulate the verification process with stages
  useEffect(() => {
    if (!isOpen) return;

    // Reset stages
    setCurrentStage(1);
    setStagesComplete([false, false, false]);

    // Stage 1: Syntax verification
    const timer1 = setTimeout(() => {
      setStagesComplete((prev) => [true, prev[1], prev[2]]);
      setCurrentStage(2);

      // Stage 2: Test execution
      const timer2 = setTimeout(() => {
        setStagesComplete((prev) => [prev[0], true, prev[2]]);
        setCurrentStage(3);

        // Stage 3: Results analysis
        const timer3 = setTimeout(() => {
          setStagesComplete((prev) => [prev[0], prev[1], true]);
        }, 800);

        return () => clearTimeout(timer3);
      }, 1200);

      return () => clearTimeout(timer2);
    }, 600);

    return () => clearTimeout(timer1);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">
            Verifying Solution
          </h3>
          <p className="text-gray-400 text-sm">
            Your code is being processed through our verification system
          </p>
        </div>

        {/* Progress stages */}
        <div className="space-y-4 mb-6">
          <StageItem
            number={1}
            label="Syntax Verification"
            isActive={currentStage === 1}
            isComplete={stagesComplete[0]}
          />
          <StageItem
            number={2}
            label="Test Execution"
            isActive={currentStage === 2}
            isComplete={stagesComplete[1]}
          />
          <StageItem
            number={3}
            label="Results Analysis"
            isActive={currentStage === 3}
            isComplete={stagesComplete[2]}
          />
        </div>

        {/* Results summary (only shown when all stages complete) */}
        {stagesComplete[2] && (
          <div
            className={`rounded-lg p-4 mb-6 ${
              allPassed ? "bg-green-900/30" : "bg-red-900/30"
            }`}
          >
            <div className="flex items-center">
              {allPassed ? (
                <svg
                  className="w-6 h-6 text-green-500 mr-2"
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
                <svg
                  className="w-6 h-6 text-red-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              )}
              <div>
                <h4
                  className={`font-medium ${
                    allPassed ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {allPassed ? "All Tests Passed!" : "Some Tests Failed"}
                </h4>
                <p className="text-gray-300 text-sm">
                  {testResults.filter((r) => r.passed).length}/
                  {testResults.length} tests successful
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded ${
              stagesComplete[2]
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            } text-white transition-colors`}
            disabled={!stagesComplete[2]}
          >
            {stagesComplete[2] ? "Close" : "Processing..."}
          </button>
        </div>
      </div>
    </div>
  );
}

interface StageItemProps {
  number: number;
  label: string;
  isActive: boolean;
  isComplete: boolean;
}

function StageItem({ number, label, isActive, isComplete }: StageItemProps) {
  return (
    <div className="flex items-center">
      <div
        className={`
        w-8 h-8 rounded-full flex items-center justify-center
        ${
          isComplete
            ? "bg-green-600"
            : isActive
            ? "bg-blue-600 animate-pulse"
            : "bg-gray-700"
        }
        mr-3
      `}
      >
        {isComplete ? (
          <svg
            className="w-5 h-5 text-white"
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
          <span className="text-white text-sm">{number}</span>
        )}
      </div>
      <div>
        <span
          className={`
          text-sm font-medium
          ${
            isComplete
              ? "text-green-400"
              : isActive
              ? "text-blue-400"
              : "text-gray-400"
          }
        `}
        >
          {label}
        </span>
        {isActive && !isComplete && (
          <span className="ml-3 text-xs text-gray-300">Processing...</span>
        )}
        {isComplete && (
          <span className="ml-3 text-xs text-green-500">Complete</span>
        )}
      </div>
    </div>
  );
}
