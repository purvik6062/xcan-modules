export interface TestCase {
  input: any[];
  expectedOutput: any;
  description: string;
}

export interface Challenge {
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
  slug?: string;
  hints?: string[]; // Array of hints to guide users without giving direct solutions
}

export interface TestResult {
  description: string;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  duration?: number; // execution time in ms
  gasUsed?: number; // estimated gas used
  logs?: string[]; // console logs captured during execution
}

export interface ChallengePreview {
  id: number;
  title: string;
  level: string;
  description: string;
  slug: string;
  category: string;
  points: number;
  precompileUsed: string;
}
