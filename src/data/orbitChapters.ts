export interface Chapter {
  id: string;
  title: string;
  description: string;
  icon: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  status: "available" | "coming-soon";
  sections: Section[];
  badge?: {
    title: string;
    description: string;
    image: string;
  };
  capstoneProject?: {
    title: string;
    description: string;
    requirements: string[];
  };
}

export interface Section {
  id: string;
  title: string;
  type: "theory" | "hands-on" | "code-walkthrough" | "challenge" | "quiz";
  status: "available" | "coming-soon";
  content?: any;
  estimatedTime: string;
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  points: number;
  requirements: string[];
  hints: string[];
  solution?: string;
}

export const orbitChapters: Chapter[] = [
  {
    id: "intro-to-orbit",
    title: "Introduction to Arbitrum Orbit",
    description:
      "Understand the fundamentals of Arbitrum Orbit and how to create your own custom Layer 3 blockchain",
    icon: "🚀",
    level: "Beginner",
    duration: "2-3 hours",
    status: "available",
    badge: {
      title: "Orbit Explorer",
      description: "Mastered Arbitrum Orbit Fundamentals",
      image: "/badges/orbit-explorer.png",
    },
    sections: [
      {
        id: "what-is-orbit",
        title: "What is Arbitrum Orbit?",
        type: "theory",
        status: "available",
        estimatedTime: "20 min",
      },
      {
        id: "l3-vs-l2",
        title: "Layer 3 vs Layer 2: Understanding the Stack",
        type: "theory",
        status: "available",
        estimatedTime: "25 min",
      },
      {
        id: "orbit-use-cases",
        title: "Orbit Use Cases & Benefits",
        type: "theory",
        status: "available",
        estimatedTime: "20 min",
      },
      {
        id: "orbit-architecture",
        title: "Orbit Chain Architecture Overview",
        type: "theory",
        status: "available",
        estimatedTime: "30 min",
      },
      {
        id: "rollup-vs-anytrust",
        title: "Rollup vs AnyTrust Chains",
        type: "theory",
        status: "available",
        estimatedTime: "25 min",
      },
      {
        id: "orbit-sdk-overview",
        title: "Orbit SDK Overview",
        type: "hands-on",
        status: "available",
        estimatedTime: "20 min",
      },
      {
        id: "orbit-basics-quiz",
        title: "Orbit Fundamentals Quiz",
        type: "quiz",
        status: "available",
        estimatedTime: "15 min",
      },
    ],
  },
  {
    id: "chain-configuration",
    title: "Chain Configuration & Setup",
    description:
      "Learn how to configure your Orbit chain parameters, gas tokens, and governance settings",
    icon: "⚙️",
    level: "Intermediate",
    duration: "3-4 hours",
    status: "available",
    badge: {
      title: "Chain Architect",
      description: "Mastered Chain Configuration",
      image: "/badges/chain-architect.png",
    },
    sections: [
      {
        id: "chain-config-basics",
        title: "Understanding Chain Configuration",
        type: "theory",
        status: "available",
        estimatedTime: "30 min",
      },
      {
        id: "chain-id-ownership",
        title: "Chain ID & Initial Ownership",
        type: "theory",
        status: "available",
        estimatedTime: "25 min",
      },
      {
        id: "custom-gas-tokens",
        title: "Custom Gas Token Configuration",
        type: "theory",
        status: "available",
        estimatedTime: "35 min",
      },
      {
        id: "prepare-chain-config",
        title: "Using prepareChainConfig Function",
        type: "code-walkthrough",
        status: "available",
        estimatedTime: "40 min",
      },
      {
        id: "deployment-params",
        title: "Preparing Deployment Parameters",
        type: "code-walkthrough",
        status: "available",
        estimatedTime: "45 min",
      },
      {
        id: "config-validation",
        title: "Configuration Validation & Best Practices",
        type: "hands-on",
        status: "available",
        estimatedTime: "30 min",
      },
      {
        id: "config-challenge",
        title: "Create Your Chain Configuration",
        type: "challenge",
        status: "available",
        estimatedTime: "45 min",
      },
      {
        id: "config-quiz",
        title: "Configuration Mastery Quiz",
        type: "quiz",
        status: "available",
        estimatedTime: "15 min",
      },
    ],
  },
  {
    id: "chain-deployment",
    title: "Chain Deployment Process",
    description:
      "Deploy your Orbit chain to Arbitrum Sepolia and understand the deployment contracts and process",
    icon: "🏗️",
    level: "Intermediate",
    duration: "4-5 hours",
    status: "available",
    badge: {
      title: "Chain Deployer",
      description: "Successfully Deployed an Orbit Chain",
      image: "/badges/chain-deployer.png",
    },
    sections: [
      {
        id: "deployment-overview",
        title: "Deployment Process Overview",
        type: "theory",
        status: "available",
        estimatedTime: "25 min",
      },
      {
        id: "required-contracts",
        title: "Understanding Required Contracts",
        type: "theory",
        status: "available",
        estimatedTime: "35 min",
      },
      {
        id: "batch-poster-validator",
        title: "Batch Poster & Validator Setup",
        type: "theory",
        status: "available",
        estimatedTime: "30 min",
      },
      {
        id: "environment-setup",
        title: "Setting Up Development Environment",
        type: "hands-on",
        status: "available",
        estimatedTime: "45 min",
      },
      {
        id: "create-rollup-function",
        title: "Using createRollup Function",
        type: "code-walkthrough",
        status: "available",
        estimatedTime: "50 min",
      },
      {
        id: "deployment-execution",
        title: "Executing Chain Deployment",
        type: "hands-on",
        status: "available",
        estimatedTime: "60 min",
      },
      {
        id: "deployment-verification",
        title: "Verifying Successful Deployment",
        type: "hands-on",
        status: "available",
        estimatedTime: "30 min",
      },
      {
        id: "deployment-challenge",
        title: "Deploy Your First Orbit Chain",
        type: "challenge",
        status: "available",
        estimatedTime: "90 min",
      },
      {
        id: "deployment-quiz",
        title: "Deployment Process Quiz",
        type: "quiz",
        status: "available",
        estimatedTime: "15 min",
      },
    ],
  },
  {
    id: "chain-testing",
    title: "Testing Your Orbit Chain",
    description:
      "Learn how to test your deployed chain by sending transactions, deploying contracts, and verifying functionality",
    icon: "🧪",
    level: "Intermediate",
    duration: "3-4 hours",
    status: "available",
    badge: {
      title: "Chain Tester",
      description: "Mastered Chain Testing",
      image: "/badges/chain-tester.png",
    },
    sections: [
      {
        id: "testing-overview",
        title: "Chain Testing Strategy",
        type: "theory",
        status: "available",
        estimatedTime: "20 min",
      },
      {
        id: "rpc-connection",
        title: "Connecting to Your Chain's RPC",
        type: "hands-on",
        status: "available",
        estimatedTime: "30 min",
      },
      {
        id: "wallet-configuration",
        title: "Adding Chain to MetaMask",
        type: "hands-on",
        status: "available",
        estimatedTime: "25 min",
      },
      {
        id: "first-transaction",
        title: "Sending Your First Transaction",
        type: "hands-on",
        status: "available",
        estimatedTime: "35 min",
      },
      {
        id: "contract-deployment",
        title: "Deploying Smart Contracts",
        type: "code-walkthrough",
        status: "available",
        estimatedTime: "45 min",
      },
      {
        id: "bridge-testing",
        title: "Testing L2-L3 Bridge Functionality",
        type: "hands-on",
        status: "available",
        estimatedTime: "50 min",
      },
      {
        id: "gas-token-testing",
        title: "Testing Custom Gas Token (If Configured)",
        type: "hands-on",
        status: "available",
        estimatedTime: "40 min",
      },
      {
        id: "testing-challenge",
        title: "Complete Chain Testing Suite",
        type: "challenge",
        status: "available",
        estimatedTime: "60 min",
      },
      {
        id: "testing-quiz",
        title: "Chain Testing Quiz",
        type: "quiz",
        status: "available",
        estimatedTime: "15 min",
      },
    ],
  },
  {
    id: "advanced-features",
    title: "Advanced Orbit Features",
    description:
      "Explore advanced features like custom precompiles, data availability committees, and governance",
    icon: "🔬",
    level: "Advanced",
    duration: "4-5 hours",
    status: "available",
    badge: {
      title: "Orbit Advanced",
      description: "Mastered Advanced Orbit Features",
      image: "/badges/orbit-advanced.png",
    },
    sections: [
      {
        id: "custom-precompiles",
        title: "Custom Precompiles in Orbit",
        type: "theory",
        status: "available",
        estimatedTime: "35 min",
      },
      {
        id: "data-availability-committee",
        title: "Data Availability Committee Setup",
        type: "theory",
        status: "available",
        estimatedTime: "40 min",
      },
      {
        id: "governance-mechanisms",
        title: "Chain Governance & Upgrades",
        type: "theory",
        status: "available",
        estimatedTime: "35 min",
      },
      {
        id: "custom-precompile-implementation",
        title: "Implementing Custom Precompiles",
        type: "code-walkthrough",
        status: "available",
        estimatedTime: "60 min",
      },
      {
        id: "dac-implementation",
        title: "Setting Up DAC Keyset",
        type: "hands-on",
        status: "available",
        estimatedTime: "45 min",
      },
      {
        id: "chain-monitoring",
        title: "Monitoring Chain Performance",
        type: "hands-on",
        status: "available",
        estimatedTime: "40 min",
      },
      {
        id: "security-considerations",
        title: "Security Best Practices",
        type: "theory",
        status: "available",
        estimatedTime: "30 min",
      },
      {
        id: "advanced-challenge",
        title: "Implement Advanced Features",
        type: "challenge",
        status: "available",
        estimatedTime: "90 min",
      },
      {
        id: "advanced-quiz",
        title: "Advanced Features Quiz",
        type: "quiz",
        status: "available",
        estimatedTime: "20 min",
      },
    ],
  },
  {
    id: "production-deployment",
    title: "Production Deployment & Maintenance",
    description:
      "Learn how to deploy to mainnet, set up monitoring, and maintain your Orbit chain in production",
    icon: "🏭",
    level: "Advanced",
    duration: "5-6 hours",
    status: "available",
    badge: {
      title: "Production Master",
      description: "Mastered Production Deployment",
      image: "/badges/production-master.png",
    },
    sections: [
      {
        id: "mainnet-preparation",
        title: "Preparing for Mainnet Deployment",
        type: "theory",
        status: "available",
        estimatedTime: "40 min",
      },
      {
        id: "security-audit",
        title: "Security Auditing Your Chain",
        type: "theory",
        status: "available",
        estimatedTime: "35 min",
      },
      {
        id: "monitoring-setup",
        title: "Setting Up Monitoring & Alerting",
        type: "hands-on",
        status: "available",
        estimatedTime: "50 min",
      },
      {
        id: "validator-nodes",
        title: "Running Validator Nodes",
        type: "hands-on",
        status: "available",
        estimatedTime: "60 min",
      },
      {
        id: "upgrade-mechanisms",
        title: "Chain Upgrade Procedures",
        type: "code-walkthrough",
        status: "available",
        estimatedTime: "45 min",
      },
      {
        id: "incident-response",
        title: "Incident Response Planning",
        type: "theory",
        status: "available",
        estimatedTime: "30 min",
      },
      {
        id: "community-building",
        title: "Building Your Chain's Ecosystem",
        type: "theory",
        status: "available",
        estimatedTime: "35 min",
      },
      {
        id: "production-challenge",
        title: "Production Deployment Plan",
        type: "challenge",
        status: "available",
        estimatedTime: "120 min",
      },
    ],
    capstoneProject: {
      title: "Launch Your Production Orbit Chain",
      description:
        "Deploy a fully functional Orbit chain to mainnet with all production-ready features",
      requirements: [
        "Complete security audit checklist",
        "Set up monitoring and alerting",
        "Configure multiple validator nodes",
        "Implement governance mechanisms",
        "Create upgrade procedures",
        "Deploy to Arbitrum mainnet",
        "Document deployment process",
      ],
    },
  },
];

// Quiz questions for each chapter
export const quizQuestions: { [chapterId: string]: Quiz[] } = {
  "intro-to-orbit": [
    {
      id: "q1",
      question: "What is the main advantage of Arbitrum Orbit?",
      options: [
        "Cheaper transactions than Layer 2",
        "Ability to create custom Layer 3 chains with full control",
        "Faster consensus mechanism",
        "Built-in cross-chain bridges",
      ],
      correctAnswer: 1,
      explanation:
        "Arbitrum Orbit allows developers to create custom Layer 3 chains with full control over configuration, gas tokens, and governance.",
    },
    {
      id: "q2",
      question: "What are the two main types of Orbit chains?",
      options: [
        "Public and Private",
        "Fast and Secure",
        "Rollup and AnyTrust",
        "L2 and L3",
      ],
      correctAnswer: 2,
      explanation:
        "Orbit chains can be configured as either Rollup chains (with full data availability) or AnyTrust chains (with data availability committee).",
    },
    {
      id: "q3",
      question: "What is required to deploy an Orbit chain?",
      options: [
        "Permission from Arbitrum Foundation",
        "A minimum stake of ETH",
        "ETH for deployment costs and configured parameters",
        "Running your own validator from day one",
      ],
      correctAnswer: 2,
      explanation:
        "Deploying an Orbit chain requires ETH to pay for deployment transaction costs and properly configured chain parameters including owner addresses and chain ID.",
    },
  ],
  "chain-configuration": [
    {
      id: "q1",
      question: "What does the prepareChainConfig function do?",
      options: [
        "Deploys the chain contracts",
        "Creates the configuration object with appropriate defaults",
        "Validates the chain parameters",
        "Connects to the parent chain",
      ],
      correctAnswer: 1,
      explanation:
        "The prepareChainConfig function creates a chainConfig structure with appropriate defaults, allowing you to override specific parameters like chainId and InitialChainOwner.",
    },
    {
      id: "q2",
      question: "Which parameters are required when using prepareChainConfig?",
      options: [
        "chainId and gasLimit",
        "chainId and InitialChainOwner",
        "parentChain and validators",
        "batchPoster and sequencer",
      ],
      correctAnswer: 1,
      explanation:
        "The chainId and InitialChainOwner parameters must be set to the desired values when using prepareChainConfig.",
    },
    {
      id: "q3",
      question: "What is the DataAvailabilityCommittee parameter used for?",
      options: [
        "Setting up governance voting",
        "Choosing between Rollup and AnyTrust chain types",
        "Configuring validator rewards",
        "Setting gas price parameters",
      ],
      correctAnswer: 1,
      explanation:
        "The DataAvailabilityCommittee parameter determines whether to deploy a Rollup chain (false) or an AnyTrust chain (true).",
    },
  ],
  "chain-deployment": [
    {
      id: "q1",
      question: "What does the createRollup function do?",
      options: [
        "Creates the chain configuration",
        "Sends deployment transaction to RollupCreator contract",
        "Sets up the development environment",
        "Configures the batch poster",
      ],
      correctAnswer: 1,
      explanation:
        "The createRollup function sends the transaction to the RollupCreator contract and waits until the deployment is executed.",
    },
    {
      id: "q2",
      question: "What addresses must be provided during deployment?",
      options: [
        "Owner and deployer addresses",
        "Batch poster and validator addresses",
        "Bridge and rollup contract addresses",
        "Token and governance addresses",
      ],
      correctAnswer: 1,
      explanation:
        "Batch poster and validator addresses must be set to the desired values during deployment.",
    },
    {
      id: "q3",
      question: "What additional step is required for custom gas token chains?",
      options: [
        "Deploy a new ERC-20 token",
        "Set up a price oracle",
        "Give allowance to RollupCreator contract",
        "Configure bridge parameters",
      ],
      correctAnswer: 2,
      explanation:
        "For custom gas token chains, the deployer needs to give allowance to the RollupCreator contract before deployment so it can spend tokens for parent-to-child messages.",
    },
  ],
  "chain-testing": [
    {
      id: "q1",
      question: "What is the first step to test your deployed Orbit chain?",
      options: [
        "Deploy a smart contract",
        "Send a transaction",
        "Connect to the chain's RPC endpoint",
        "Set up a validator",
      ],
      correctAnswer: 2,
      explanation:
        "The first step is connecting to your chain's RPC endpoint to interact with the network.",
    },
    {
      id: "q2",
      question: "How do you add your Orbit chain to MetaMask?",
      options: [
        "It's automatically detected",
        "Manually add network with RPC URL and chain ID",
        "Import a configuration file",
        "Use the Orbit SDK",
      ],
      correctAnswer: 1,
      explanation:
        "You need to manually add the network to MetaMask using your chain's RPC URL, chain ID, and other network parameters.",
    },
  ],
  "advanced-features": [
    {
      id: "q1",
      question: "What are custom precompiles in Orbit?",
      options: [
        "Pre-built smart contracts",
        "Custom native functions available to all contracts",
        "Governance voting mechanisms",
        "Bridge configuration options",
      ],
      correctAnswer: 1,
      explanation:
        "Custom precompiles are custom native functions that can be made available to all smart contracts on your Orbit chain.",
    },
    {
      id: "q2",
      question: "What is a Data Availability Committee (DAC)?",
      options: [
        "A group that validates transactions",
        "A committee that ensures data is available off-chain",
        "Governance body for chain upgrades",
        "Security auditing team",
      ],
      correctAnswer: 1,
      explanation:
        "A DAC is a committee of parties that attest to data availability, allowing AnyTrust chains to reduce costs while maintaining security assumptions.",
    },
  ],
  "production-deployment": [
    {
      id: "q1",
      question: "What should be done before deploying to mainnet?",
      options: [
        "Get approval from Arbitrum",
        "Complete security audit and testing",
        "Set up customer support",
        "Launch marketing campaign",
      ],
      correctAnswer: 1,
      explanation:
        "Before mainnet deployment, it's crucial to complete thorough security auditing and testing to ensure the chain operates safely.",
    },
    {
      id: "q2",
      question: "What is essential for production chain monitoring?",
      options: [
        "Social media presence",
        "24/7 monitoring and alerting systems",
        "Marketing analytics",
        "User feedback forms",
      ],
      correctAnswer: 1,
      explanation:
        "Production chains require 24/7 monitoring and alerting systems to quickly detect and respond to any issues.",
    },
  ],
};
