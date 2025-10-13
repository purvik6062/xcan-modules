import React from "react";

// Icons for NFT modules
const GlobeIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
    />
  </svg>
);

const CodeBracketIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
    />
  </svg>
);

const CpuChipIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
    />
  </svg>
);

const RocketLaunchIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

const AcademicCapIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 14l9-5-9-5-9 5 9 5z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
    />
  </svg>
);

const BookOpenIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);

export interface NFTModule {
  id: string;
  title: string;
  description: string;
  icon: (props: { className?: string }) => React.ReactElement;
  level: string;
  duration: string;
  challenges: number;
  status: "available" | "coming-soon";
  gradient: string;
  database: "mongodb" | "postgres";
  collectionName?: string; // For MongoDB modules
  href: string; // For navigation
  features: string[];
}

export const nftModules: NFTModule[] = [
  {
    id: "web3-basics",
    title: "Web3 Basics",
    description:
      "Learn Web3 fundamentals through engaging stories and interactive lessons. Perfect for beginners - no prior experience needed!",
    icon: GlobeIcon,
    level: "Absolute Beginner",
    duration: "1-2 weeks",
    challenges: 6,
    status: "available",
    gradient: "from-purple-500 to-blue-600",
    database: "mongodb",
    collectionName: "challenges-web3-basics",
    href: "/learn-web3-basics",
    features: [
      "Story-Based Learning",
      "Interactive Quizzes",
      "8 Core Concepts",
      "No Prerequisites",
    ],
  },
  {
    id: "stylus-core-concepts",
    title: "Stylus Core Concepts",
    description:
      "Master Arbitrum Stylus and build high-performance smart contracts with Rust. Learn WASM, constructors, storage, and advanced patterns through interactive lessons.",
    icon: CpuChipIcon,
    level: "Beginner to Intermediate",
    duration: "1-2 weeks",
    challenges: 6,
    status: "available",
    gradient: "from-blue-500 to-cyan-500",
    database: "mongodb",
    collectionName: "challenges-stylus-core-concepts",
    href: "/learn-stylus",
    features: [
      "Rust & WASM Fundamentals",
      "Constructors & Storage",
      "Mappings & Arrays",
      "Events & Error Handling",
      "Real-World Examples",
      "10-100x Performance Gains",
    ],
  },
  {
    id: "stylus-foundation",
    title: "Stylus Foundation",
    description:
      "Build a complete ERC20 token system and mint your achievement certificate! Learn ERC20 and ERC721 standards with Rust contract development.",
    icon: CpuChipIcon,
    level: "Beginner",
    duration: "Less than 1 week",
    challenges: 1,
    status: "available",
    gradient: "from-green-500 to-emerald-600",
    database: "postgres",
    href: "/nft/stylus-foundation",
    features: [
      "ERC20 Standard Implementation",
      "ERC721 NFT Standard",
      "Rust Contract Development",
      "Interaction with Rust-based Smart Contracts",
    ],
  },
  {
    id: "arbitrum-orbit",
    title: "Master Arbitrum Orbit",
    description:
      "Configure, deploy, test, and operate your own Orbit L3 chain through structured theory and quizzes — no coding required.",
    icon: RocketLaunchIcon,
    level: "Intermediate to Advanced",
    duration: "2-3 weeks",
    challenges: 6,
    status: "available",
    gradient: "from-emerald-500 to-teal-600",
    database: "mongodb",
    collectionName: "challenges-arbitrum-orbit",
    href: "/learn-orbit",
    features: [
      "Orbit Fundamentals",
      "Chain Configuration & Gas Tokens",
      "Deployment Flow (prepare → params → create)",
      "Testing & Bridge Validation",
      "Advanced Features & Governance",
      "Production Ops & Monitoring",
    ],
  },
  {
    id: "arbitrum-stylus",
    title: "Arbitrum Stylus",
    description:
      "Build high-performance smart contracts with Rust, C, and C++ on Arbitrum",
    icon: CpuChipIcon,
    level: "Intermediate to Advanced",
    duration: "3-5 weeks",
    challenges: 11,
    status: "available",
    gradient: "from-purple-500 to-pink-600",
    database: "postgres",
    href: "/nft/arbitrum-stylus", // Special route for Postgres module
    features: [
      "Rust Development",
      "WebAssembly",
      "Performance Optimization",
      "Multi-language Support",
    ],
  },
  {
    id: "defi-arbitrum",
    title: "Master DeFi on Arbitrum",
    description:
      "Learn DeFi fundamentals, DEXs, vaults, and security on Arbitrum through structured theory and quizzes with practical concepts.",
    icon: AcademicCapIcon,
    level: "Beginner to Intermediate",
    duration: "1-2 weeks",
    challenges: 6,
    status: "available",
    gradient: "from-blue-500 to-cyan-500",
    database: "mongodb",
    collectionName: "challenges-defi-arbitrum",
    href: "/learn-defi",
    features: [
      "Fundamentals, DEXs, Vaults, Security",
      "Story-Based Lessons",
      "Targeted Quizzes",
      "Glossary & Progress Tracking",
      "Arbitrum Ecosystem Focus",
    ],
  },
  {
    id: "cross-chain",
    title: "Master Cross‑Chain Development",
    description:
      "Foundations → token bridging → advanced protocols → tooling → Arbitrum bridge and troubleshooting — delivered via stories and quizzes.",
    icon: BookOpenIcon,
    level: "Intermediate to Advanced",
    duration: "2-3 weeks",
    challenges: 6,
    status: "available",
    gradient: "from-blue-500 to-cyan-500",
    database: "mongodb",
    collectionName: "challenges-cross-chain",
    href: "/learn-cross-chain",
    features: [
      "Foundations & Real‑World Analogies",
      "Token Bridging Mechanics",
      "Messaging & Oracle Designs",
      "Security & Validator Economics",
      "Tooling & Dev Patterns",
      "Arbitrum Bridge Basics & Troubleshooting",
    ],
  },
  {
    id: "arbitrum-precompiles",
    title: "Precompile Playground",
    description:
      "Master Arbitrum's powerful precompiles through interactive coding challenges",
    icon: CodeBracketIcon,
    level: "Beginner to Advanced",
    duration: "1-2 weeks",
    challenges: 6,
    status: "available",
    gradient: "from-blue-500 to-indigo-600",
    database: "mongodb",
    collectionName: "challenges-precompiles-overview",
    href: "/challenges",
    features: [
      "Interactive Challenges",
      "Real-world Examples",
      "Gas Optimization",
      "L1-L2 Messaging",
    ],
  },
];

export default nftModules;
