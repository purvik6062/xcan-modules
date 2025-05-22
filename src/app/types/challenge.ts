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
}

export interface TestResult {
  description: string;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
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
