import React from "react";

// Type definition for module icons
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

const CommandLineIcon = ({ className }: { className?: string }) => (
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
      d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
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

const ClockIcon = ({ className }: { className?: string }) => (
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
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const DocumentIcon = ({ className }: { className?: string }) => (
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
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

// Type definition for a learning module
export interface LearningModule {
  id: string;
  title: string;
  description: string;
  icon: (props: { className?: string }) => React.ReactElement;
  level: string;
  duration?: string;
  challenges?: number;
  status: "available" | "coming-soon";
  href: string;
  target: string;
  gradient: string;
  features: string[];
}

// Learning modules data
export const learningModules: LearningModule[] = [
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
    href: "https://www.speedrunstylus.com/",
    target: "_blank",
    gradient: "from-purple-500 to-pink-600",
    features: [
      "Rust Development",
      "WebAssembly",
      "Performance Optimization",
      "Multi-language Support",
    ],
  },
  {
    id: "arbitrum-precompiles",
    title: "Stylus Core Concepts",
    description:
      "Master Arbitrum's powerful precompiles through interactive coding challenges",
    icon: CodeBracketIcon,
    level: "Beginner to Advanced",
    duration: "2-4 weeks",
    challenges: 6,
    status: "available",
    href: "/challenges",
    target: "_self",
    gradient: "from-blue-500 to-indigo-600",
    features: [
      "Interactive Challenges",
      "Real-world Examples",
      "Gas Optimization",
      "L1-L2 Messaging",
    ],
  },
  {
    id: "arbitrum-orbit",
    title: "Arbitrum Orbit",
    description:
      "Launch your own Layer 3 blockchain using Arbitrum's Orbit technology",
    icon: RocketLaunchIcon,
    level: "Advanced",
    duration: "4-6 weeks",
    challenges: 10,
    status: "available",
    href: "/learn-orbit",
    target: "_self",
    gradient: "from-emerald-500 to-teal-600",
    features: [
      "Chain Deployment",
      "Custom Gas Tokens",
      "Validator Setup",
      "Bridge Configuration",
    ],
  },
  {
    id: "defi-arbitrum",
    title: "DeFi on Arbitrum",
    description:
      "Master DeFi development on Arbitrum from absolute beginner to building your first DeFi app. Explore $2.527B TVL ecosystem with hands-on practice.",
    icon: AcademicCapIcon,
    level: "Beginner to Developer",
    duration: "4-6 weeks",
    challenges: 24,
    status: "available",
    href: "/learn-defi",
    target: "_self",
    gradient: "from-cyan-500 to-blue-600",
    features: [
      "6 Comprehensive Chapters",
      "Interactive Code Editors",
      "Vault Simulators",
      "NFT Badge Rewards",
      "Quiz & Challenges",
      "Real Protocol Integration",
    ],
  },
  {
    id: "cross-chain",
    title: "Cross-Chain Development",
    description:
      "Master cross-chain communication and bridge development on Arbitrum",
    icon: BookOpenIcon,
    level: "Advanced",
    duration: "4-5 weeks",
    challenges: 8,
    status: "coming-soon",
    href: "#",
    target: "_self",
    gradient: "from-violet-500 to-purple-600",
    features: [
      "Bridge Development",
      "Message Passing",
      "Token Transfers",
      "Security Patterns",
    ],
  },
  {
    id: "project-submission",
    title: "Project Submission",
    description:
      "Built something cool with Stylus? Submit your project to get featured and reviewed by the community. Highlight your skills, gain visibility, and inspire others in the ecosystem.",
    icon: DocumentIcon,
    level: "All Levels",
    status: "coming-soon",
    href: "#",
    target: "_self",
    gradient: "from-orange-500 to-red-600",
    features: [],
  },
];

export default learningModules;