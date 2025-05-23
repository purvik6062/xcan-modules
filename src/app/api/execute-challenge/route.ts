import { NextRequest, NextResponse } from "next/server";
import { challengesData } from "../../data/challenges";
import { ethers } from "ethers";

// Improved helper function for BigInt serialization
function serializeBigInt(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === "bigint") {
    return obj.toString();
  }

  if (Array.isArray(obj)) {
    return obj.map(serializeBigInt);
  }

  if (typeof obj === "object") {
    try {
      const result: Record<string, any> = {};
      for (const key in obj) {
        result[key] = serializeBigInt(obj[key]);
      }
      return result;
    } catch (error) {
      return "[Complex Object]";
    }
  }

  return obj;
}

// Secure sandbox for executing code
async function executeInSandbox(code: string, testCases: any[], slug: string) {
  // In production, this would use a secure serverless function or isolated container
  // For now, we're implementing a more robust but still simulated testing environment
  console.log("slug::", slug);
  try {
    // Create a mock provider that mimics Arbitrum Sepolia responses
    const mockProvider = createMockProvider(slug);

    // Find the actual function call at the end of the code
    // This regex extracts the name of the function being executed at the end of the user's code
    // Clean the code - remove imports and exports to avoid errors
    const cleanedCode = code
      .replace(/import\s+{\s*ethers\s*}\s+from\s+['"]ethers['"];?/g, "")
      .replace(/export\s+default\s+[^;]+;?/g, "")
      .trim();

    const functionCallMatch = cleanedCode.match(/([a-zA-Z0-9_]+)\(\);?\s*$/);

    if (!functionCallMatch) {
      return testCases.map((testCase) => ({
        description: testCase.description,
        input: JSON.stringify(testCase.input),
        expected: JSON.stringify(serializeBigInt(testCase.expectedOutput)),
        actual:
          "Error: No function call found in your code. Make sure you call your function at the end.",
        passed: false,
        duration: 0,
        gasUsed: 0,
        logs: [],
      }));
    }

    // Extract the actual called function name from the code
    const functionName = functionCallMatch[1];
    console.log(`Detected function call: ${functionName}`);

    // Dynamically evaluate the code in a controlled environment
    // This is simplified - a real implementation would use VM2 or a container
    const AsyncFunction = Object.getPrototypeOf(
      async function () {}
    ).constructor;

    // Execute against each test case
    const results = await Promise.all(
      testCases.map(async (testCase) => {
        // Create a separate logs array for each test case
        const logs: string[] = [];

        // Create a custom console object to capture logs
        const customConsole = {
          log: (...args: any[]) => {
            const logMessage = args
              .map((arg) => {
                try {
                  if (typeof arg === "bigint") {
                    return arg.toString();
                  } else if (typeof arg === "object") {
                    return JSON.stringify(serializeBigInt(arg));
                  } else {
                    return String(arg);
                  }
                } catch (error) {
                  return "[Unable to serialize]";
                }
              })
              .join(" ");
            logs.push(logMessage);
            console.log(...args); // Also log to server console
          },
          error: (...args: any[]) => {
            const logMessage = `ERROR: ${args
              .map((arg) => {
                try {
                  if (typeof arg === "bigint") {
                    return arg.toString();
                  } else if (typeof arg === "object") {
                    return JSON.stringify(serializeBigInt(arg));
                  } else {
                    return String(arg);
                  }
                } catch (error) {
                  return "[Unable to serialize]";
                }
              })
              .join(" ")}`;
            logs.push(logMessage);
            console.error(...args); // Also log to server console
          },
          warn: (...args: any[]) => {
            const logMessage = `WARN: ${args
              .map((arg) => {
                try {
                  if (typeof arg === "bigint") {
                    return arg.toString();
                  } else if (typeof arg === "object") {
                    return JSON.stringify(serializeBigInt(arg));
                  } else {
                    return String(arg);
                  }
                } catch (error) {
                  return "[Unable to serialize]";
                }
              })
              .join(" ")}`;
            logs.push(logMessage);
            console.warn(...args); // Also log to server console
          },
        };

        // Create the function to evaluate for this test case
        const userFunction = new AsyncFunction(
          "ethers",
          "provider",
          "testInput",
          "console",
          `
            ${cleanedCode}
            
            // Define the function we want to test if it exists
            if (typeof ${functionName} !== 'function') {
              throw new Error('Function ${functionName} is not defined in your code');
            }
            
            // Return the result of calling the function with test input
            return await ${functionName}(...testInput);
          `
        );

        try {
          const start = performance.now();
          const result = await userFunction(
            ethers,
            mockProvider,
            testCase.input || [],
            customConsole
          );
          const duration = performance.now() - start;

          // Verify the result matches expected output
          const passed = verifyResult(result, testCase.expectedOutput);

          return {
            description: testCase.description,
            input: JSON.stringify(testCase.input),
            expected: JSON.stringify(serializeBigInt(testCase.expectedOutput)),
            actual: JSON.stringify(serializeBigInt(result)),
            passed,
            duration: Math.round(duration),
            gasUsed: estimateGasUsed(code, slug),
            logs: logs, // Include only this test case's logs
          };
        } catch (error: any) {
          console.error("Test case execution error:", error);
          return {
            description: testCase.description,
            input: JSON.stringify(testCase.input),
            expected: JSON.stringify(serializeBigInt(testCase.expectedOutput)),
            actual: `Error: ${error.message}`,
            passed: false,
            duration: 0,
            gasUsed: 0,
            logs: logs, // Include only this test case's logs
          };
        }
      })
    );

    return results;
  } catch (error: any) {
    console.error("Sandbox execution error:", error);
    return testCases.map((testCase) => ({
      description: testCase.description,
      input: JSON.stringify(testCase.input),
      expected: JSON.stringify(serializeBigInt(testCase.expectedOutput)),
      actual: `Execution error: ${error.message}`,
      passed: false,
      duration: 0,
      gasUsed: 0,
      logs: [],
    }));
  }
}

// Create a mock provider that emulates Arbitrum Sepolia behavior
function createMockProvider(slug: string) {
  // This would be a much more comprehensive mock in production
  const mockResponses: any = {
    arbBlockNumber: async () => BigInt(123456789),
    arbChainID: async () => BigInt(421614),
    arbOSVersion: async () => BigInt(11),
    getPricesInWei: async () => [
      BigInt(100000000), // L2 transaction fee
      BigInt(500000000), // L1 data fee
      BigInt(10000000), // Storage fee
      BigInt(0),
      BigInt(0),
      BigInt(0), // Other values
    ],
  };

  // Create custom provider with mock Contract method
  return {
    JsonRpcProvider: function () {
      return {
        // Add any provider methods here as needed
      };
    },
    Contract: function (address: string, abi: any) {
      return new Proxy(
        {},
        {
          get: (target, prop) => {
            if (typeof prop === "string" && mockResponses[prop]) {
              return mockResponses[prop];
            }
            // Default mock for any contract method
            return async () => {
              // If it's getPricesInWei, return the mock data
              if (prop === "getPricesInWei") {
                return mockResponses.getPricesInWei();
              }
              // Default return for other methods
              return {
                wait: async () => ({ hash: "0x123...", status: 1 }),
              };
            };
          },
        }
      );
    },
  };
}

// Verify the result matches the expected output
function verifyResult(result: any, expectedOutput: any) {
  if (expectedOutput.type === "bigint" && typeof result === "bigint") {
    return true;
  }

  if (expectedOutput.value && result == expectedOutput.value) {
    return true;
  }

  if (expectedOutput.hasProperties && Array.isArray(result)) {
    return expectedOutput.hasProperties.every(
      (prop: string | number) =>
        (result as unknown as Record<string | number, unknown>)[prop] !==
        undefined
    );
  }

  if (expectedOutput.type === "object" && typeof result === "object") {
    return true;
  }

  return false;
}

// Estimate gas used based on code complexity
function estimateGasUsed(code: string, slug: string) {
  // This would use a more sophisticated analysis in production
  const baseGas = 21000;
  const storageOperations = (code.match(/await/g) || []).length * 5000;
  const computeOperations = code.length * 10;

  return baseGas + storageOperations + computeOperations;
}

export async function POST(request: NextRequest) {
  try {
    const { code, slug } = await request.json();

    if (!code || !slug) {
      return NextResponse.json(
        { error: "Code and challenge slug are required" },
        { status: 400 }
      );
    }

    const challenge = challengesData[slug];

    if (!challenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 }
      );
    }

    console.log(`Executing challenge: ${slug}`);

    // Execute the code in our sandbox
    const testResults = await executeInSandbox(code, challenge.testCases, slug);

    // Calculate the summary
    const passedCount = testResults.filter((r: any) => r.passed).length;
    const totalCount = testResults.length;
    const allPassed = passedCount === totalCount;

    let summary = allPassed
      ? `✅ All tests passed! ${passedCount}/${totalCount}`
      : `❌ ${passedCount}/${totalCount} tests passed`;

    // Add performance insights if all tests passed
    if (allPassed) {
      const avgDuration = Math.round(
        testResults.reduce((sum: number, r: any) => sum + r.duration, 0) /
          testResults.length
      );
      const totalGas = testResults.reduce(
        (sum: number, r: any) => sum + r.gasUsed,
        0
      );

      summary += ` • Average execution: ${avgDuration}ms • Estimated gas: ${totalGas}`;
    }

    return NextResponse.json({
      testResults,
      summary,
      success: allPassed,
    });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: `Error processing request: ${error.message}` },
      { status: 500 }
    );
  }
}
