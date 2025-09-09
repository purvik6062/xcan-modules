import { NextRequest, NextResponse } from "next/server";
import { challengesData } from "../../../data/challenges";
import { connectToDatabase } from "../../../lib/database/mongodb";
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
  console.log("slug::", slug);
  try {
    const mockProvider = createMockProvider(slug);

    // Clean the code
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

    const functionName = functionCallMatch[1];
    console.log(`Detected function call: ${functionName}`);

    // Define the user's function once
    const defineFunction = new Function(
      "ethers",
      "provider",
      `
        ${cleanedCode}
        if (typeof ${functionName} !== 'function') {
          throw new Error('Function ${functionName} is not defined in your code');
        }
        return ${functionName};
      `
    );

    const userFunc = defineFunction(ethers, mockProvider);

    // Execute the function for each test case with log capture
    const results = await Promise.all(
      testCases.map(async (testCase) => {
        const logs: string[] = [];

        // Custom log function
        const customLog = (...args: any[]) => {
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
        };

        // Override global console.log
        const originalLog = console.log;
        console.log = customLog;

        try {
          const start = performance.now();
          const result = await userFunc(...(testCase.input || []));
          const duration = performance.now() - start;

          const passed = verifyResult(result, testCase.expectedOutput);

          return {
            description: testCase.description,
            input: JSON.stringify(testCase.input),
            expected: JSON.stringify(serializeBigInt(testCase.expectedOutput)),
            actual: JSON.stringify(serializeBigInt(result)),
            passed,
            duration: Math.round(duration),
            gasUsed: estimateGasUsed(code, slug),
            logs,
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
            logs,
          };
        } finally {
          // Restore original console.log
          console.log = originalLog;
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
    const { code, slug, userAddress } = await request.json();

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

      // Persist successful result for progress tracking
      try {
        const { db } = await connectToDatabase();
        const collection = db.collection("challenge-core-stylus");
        if (userAddress && typeof userAddress === "string") {
          const lower = userAddress.toLowerCase();
          const resultEntry = {
            summary,
            testResults,
            completedAt: new Date(),
            success: true,
          };
          await collection.updateOne(
            { userAddress: lower },
            {
              $set: {
                userAddress: lower,
                updatedAt: new Date(),
                [`results.${slug}`]: resultEntry,
              },
              $setOnInsert: { createdAt: new Date() },
              $addToSet: { challenges: slug },
            },
            { upsert: true }
          );
        }
      } catch (dbErr) {
        console.error("Failed to persist challenge result:", dbErr);
      }
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

// GET /api/execute-challenge?userAddress=0x...&slug=optional
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userAddress = searchParams.get("userAddress");
    const slug = searchParams.get("slug");

    if (!userAddress) {
      return NextResponse.json(
        { error: "userAddress is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const collection = db.collection("challenge-core-stylus");

    const doc = await collection.findOne(
      { userAddress: userAddress.toLowerCase() },
      { projection: { _id: 0 } }
    );

    const progress = doc || {
      userAddress: userAddress.toLowerCase(),
      challenges: [],
      results: {},
    };

    if (slug) {
      const completed =
        Array.isArray(progress.challenges) &&
        progress.challenges.includes(slug);
      const result = progress.results?.[slug] || null;
      return NextResponse.json({
        completed,
        result,
        challenges: progress.challenges || [],
      });
    }

    return NextResponse.json({ progress });
  } catch (error: any) {
    console.error("GET progress error:", error);
    return NextResponse.json(
      { error: `Error fetching results: ${error.message}` },
      { status: 500 }
    );
  }
}
