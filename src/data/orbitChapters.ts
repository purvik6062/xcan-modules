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
      "Foundations of Orbit: L3 vs L2, architecture, DA choices, governance, and a fundamentals quiz.",
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
        type: "theory",
        status: "available",
        estimatedTime: "25 min",
      },
      {
        id: "orbit-governance-models",
        title: "Governance Options for Orbit Chains",
        type: "theory",
        status: "available",
        estimatedTime: "35 min",
        content: {
          story: `# Governance on Orbit Chains 🗳️\n\nOrbit chains are owned and governed by you. Choose mechanisms ranging from multisig admin for early phases to token-voting DAOs as you decentralize.\n\n## Progressive decentralization\n- Phase 0: Multisig admins for speed and safety\n- Phase 1: Council + time-lock + community RFCs\n- Phase 2: Token-weighted voting with quorum and proposal thresholds\n\n## Administrative domains\n- Protocol parameters (gas, fees)\n- Upgrades (Nitro versions, precompile sets)\n- Treasury and incentives (validators, relayers)\n- Emergency measures (pauses, kill switches)\n\n## Best practices\n- Public RFCs + audits\n- Timelocks on sensitive changes\n- Community dashboards\n- Post-mortems when incidents occur`,
          questions: [
            {
              id: "gov-q1",
              question: "What is a safe first step toward decentralization?",
              options: [
                "Unrestricted admin keys",
                "Direct token voting without guardrails",
                "Multisig with timelock and public RFCs",
                "No governance at all",
              ],
              correctAnswer: 2,
              explanation: "Start with a multisig and time locks; evolve as the community matures.",
              type: "multiple-choice",
            },
          ],
        },
      },
      {
        id: "orbit-da-overview",
        title: "Data Availability Choices: Rollup vs AnyTrust vs Alt-DA",
        type: "theory",
        status: "available",
        estimatedTime: "40 min",
        content: {
          story: `# DA Choices for Orbit Chains 📦\n\nDA determines how transaction data is published and verified.\n\n- Rollup (ETH DA): Highest security; data is posted to L1.\n- AnyTrust (DAC): Committee attests, lowering costs with different assumptions.\n- Alt-DA: External DA layers (when available) for cost-performance trade-offs.\n\n## Selection matrix\n- Security sensitivity → prefer Rollup\n- Cost constraints → consider AnyTrust/Alt-DA\n- Throughput and latency targets → measure empirically\n\n## Migration\nDesign for future DA migrations: governance plans, testing, and user comms.`,
          questions: [
            {
              id: "da-q1",
              question: "Which DA mode posts data to Ethereum for maximum security?",
              options: ["AnyTrust", "Alt-DA", "Rollup", "None"],
              correctAnswer: 2,
              explanation: "Rollup mode publishes data to Ethereum L1.",
              type: "multiple-choice",
            },
          ],
        },
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
      "Configure chain ID, ownership, gas token strategy, prepareChainConfig, deployment params, validation best practices, and governance templates — with a quiz.",
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
        content: {
          story: `# Understanding Chain Configuration 🔧\n\nChain configuration is the foundation of your Orbit chain. It defines critical parameters like chain ID, ownership, gas settings, and data availability mode.\n\n## Key Configuration Elements\n\n**Chain Identity**\n- Chain ID: Unique identifier preventing transaction replay\n- Chain name and symbol for wallet display\n- Network metadata for block explorers\n\n**Ownership Structure**\n- Initial Chain Owner: Controls upgrades and parameter changes\n- Multi-signature recommendations for production\n- Governance transition planning\n\n**Economic Parameters**\n- Gas pricing mechanisms\n- Custom gas token selection\n- Fee collection and distribution\n\n**Technical Settings**\n- Data availability mode (Rollup vs AnyTrust)\n- Block time and batch posting frequency\n- Validator set configuration\n\n## Why Configuration Matters\n\nProper configuration ensures your chain operates securely, efficiently, and meets your specific use case requirements. Poor configuration choices can lead to security vulnerabilities, high operational costs, or user experience issues.`,
          questions: [
            {
              id: "config-q1",
              question: "What is the primary purpose of a chain ID in Orbit configuration?",
              options: [
                "To set gas prices",
                "To prevent transaction replay attacks across different networks",
                "To configure validators",
                "To set block times"
              ],
              correctAnswer: 1,
              explanation: "Chain ID serves as a unique identifier that prevents transactions from one network being replayed on another network with the same address space.",
              type: "multiple-choice"
            }
          ]
        }
      },
      {
        id: "chain-id-ownership",
        title: "Chain ID & Initial Ownership",
        type: "theory",
        status: "available",
        estimatedTime: "25 min",
        content: {
          story: `# Chain ID & Initial Ownership 🔑\n\nTwo fundamental decisions that shape your Orbit chain's identity and governance structure.\n\n## Choosing Your Chain ID\n\n**What is a Chain ID?**\nA unique number that identifies your blockchain network. It's used in transaction signatures to prevent replay attacks across different networks.\n\n**Selection Guidelines:**\n- Must be unique across all EVM networks\n- Avoid conflicts with existing chains\n- Consider using chainlist.org for reference\n- Reserve a range for testnet versions\n\n**Examples:**\n- Ethereum Mainnet: 1\n- Arbitrum One: 42161\n- Arbitrum Nova: 42170\n- Your chain: Pick an unused number > 1000\n\n## Initial Chain Owner\n\n**Role and Responsibilities:**\n- Controls all chain upgrades and parameter changes\n- Can modify gas settings, validator sets, and DA mode\n- Should transition to decentralized governance over time\n\n**Best Practices:**\n- Start with a multi-signature wallet (3/5 or 5/7)\n- Plan governance decentralization roadmap\n- Document all owner actions publicly\n- Implement time delays for critical changes\n\n**Security Considerations:**\n- Owner key compromise = full chain control\n- Use hardware wallets or HSMs\n- Regular key rotation procedures\n- Emergency response protocols`,
          questions: [
            {
              id: "ownership-q1",
              question: "Why should the Initial Chain Owner use a multi-signature wallet?",
              options: [
                "To reduce gas costs",
                "To improve transaction speed",
                "To distribute control and reduce single points of failure",
                "To increase validator rewards"
              ],
              correctAnswer: 2,
              explanation: "Multi-signature wallets require multiple parties to authorize transactions, reducing the risk of a single compromised key taking control of the entire chain.",
              type: "multiple-choice"
            }
          ]
        }
      },
      {
        id: "custom-gas-tokens",
        title: "Custom Gas Token Configuration",
        type: "theory",
        status: "available",
        estimatedTime: "35 min",
        content: {
          story: `# Custom Gas Token Configuration 💰\n\nOrbit chains can use custom ERC-20 tokens for gas instead of ETH, enabling unique economic models and ecosystem alignment.\n\n## Native ETH vs Custom Gas Tokens\n\n**Using Native ETH:**\n- Familiar user experience\n- Wallet compatibility guaranteed\n- Simplified accounting\n- Lower complexity for bridges\n\n**Using Custom Gas Tokens:**\n- Ecosystem token utility\n- Custom economic models\n- Token value accrual\n- Governance token integration\n\n## Configuration Requirements\n\n**Token Standards:**\n- Must be a standard ERC-20 token\n- Should have adequate liquidity\n- Decimals recommendation: 18\n- Consider total supply economics\n\n**Technical Implementation:**\n\`\`\`javascript\n// Example configuration with custom gas token\nconst chainConfig = prepareChainConfig({\n  chainId: 123456,\n  arbitrum: {\n    InitialChainOwner: "0x...",\n    DataAvailabilityCommittee: false,\n    // Custom gas token address\n    nativeToken: "0x..." // ERC-20 token address\n  }\n});\n\`\`\`\n\n## Economic Considerations\n\n**Token Economics:**\n- Gas fee collection mechanisms\n- Token burn vs redistribution\n- Validator reward distribution\n- Economic sustainability models\n\n**User Experience:**\n- Wallet integration challenges\n- Gas estimation complexity\n- Bridge liquidity requirements\n- Exchange listing considerations`,
          questions: [
            {
              id: "gastoken-q1",
              question: "What is a key advantage of using a custom gas token over native ETH?",
              options: [
                "Always cheaper gas fees",
                "Better security",
                "Ecosystem token utility and value accrual",
                "Faster transaction processing"
              ],
              correctAnswer: 2,
              explanation: "Custom gas tokens can drive utility for ecosystem tokens and create value accrual mechanisms, though they introduce UX complexity.",
              type: "multiple-choice"
            }
          ]
        }
      },
      {
        id: "prepare-chain-config",
        title: "Using prepareChainConfig Function",
        type: "code-walkthrough",
        status: "available",
        estimatedTime: "40 min",
        content: {
          story: `# Using prepareChainConfig Function 💻\n\nThe \`prepareChainConfig\` function from the Orbit SDK generates the configuration object needed for chain deployment.\n\n## Function Overview\n\n\`\`\`javascript\nimport { prepareChainConfig } from '@arbitrum/orbit-sdk';\n\n// Basic configuration\nconst chainConfig = prepareChainConfig({\n  chainId: 123456,\n  arbitrum: {\n    InitialChainOwner: "0xYourOwnerAddress",\n    DataAvailabilityCommittee: false // Rollup mode\n  }\n});\n\`\`\`\n\n## Configuration Parameters\n\n**Required Parameters:**\n- \`chainId\`: Unique network identifier\n- \`arbitrum.InitialChainOwner\`: Address controlling the chain\n- \`arbitrum.DataAvailabilityCommittee\`: true for AnyTrust, false for Rollup\n\n**Optional Parameters:**\n- \`arbitrum.nativeToken\`: Custom gas token address\n- Various gas and fee settings\n- Precompile configurations\n\n## Advanced Configuration Examples\n\n**Rollup with Custom Gas Token:**\n\`\`\`javascript\nconst rollupWithToken = prepareChainConfig({\n  chainId: 123456,\n  arbitrum: {\n    InitialChainOwner: "0xOwner...",\n    DataAvailabilityCommittee: false,\n    nativeToken: "0xTokenAddress..."\n  }\n});\n\`\`\`\n\n**AnyTrust Configuration:**\n\`\`\`javascript\nconst anytrustConfig = prepareChainConfig({\n  chainId: 123457,\n  arbitrum: {\n    InitialChainOwner: "0xOwner...",\n    DataAvailabilityCommittee: true\n  }\n});\n\`\`\`\n\n## Configuration Validation\n\nThe function automatically:\n- Sets appropriate default values\n- Validates parameter combinations\n- Generates chain-specific configurations\n- Prepares for deployment process`,
          questions: [
            {
              id: "prepare-q1",
              question: "What happens when you set DataAvailabilityCommittee to true?",
              options: [
                "Creates a Rollup chain",
                "Creates an AnyTrust chain with data availability committee",
                "Enables custom precompiles",
                "Sets up custom gas token"
              ],
              correctAnswer: 1,
              explanation: "Setting DataAvailabilityCommittee to true creates an AnyTrust chain where a committee attests to data availability instead of posting all data to L1.",
              type: "multiple-choice"
            }
          ]
        }
      },
      {
        id: "deployment-params",
        title: "Preparing Deployment Parameters",
        type: "code-walkthrough",
        status: "available",
        estimatedTime: "45 min",
        content: {
          story: `# Preparing Deployment Parameters 🚀\n\nAfter creating your chain configuration, you need to prepare deployment parameters using \`createRollupPrepareDeploymentParamsConfig\`.\n\n## Deployment Parameters Function\n\n\`\`\`javascript\nimport { \n  createRollupPrepareDeploymentParamsConfig,\n  createPublicClient,\n  http\n} from '@arbitrum/orbit-sdk';\nimport { arbitrumSepolia } from 'viem/chains';\n\n// Create parent chain client\nconst parentChainPublicClient = createPublicClient({\n  chain: arbitrumSepolia,\n  transport: http()\n});\n\n// Prepare deployment parameters\nconst createRollupConfig = await createRollupPrepareDeploymentParamsConfig(\n  parentChainPublicClient,\n  {\n    chainId: 123456,\n    owner: "0xYourOwnerAddress",\n    chainConfig: chainConfig // From prepareChainConfig\n  }\n);\n\`\`\`\n\n## Required Parameters\n\n**Parent Chain Client:**\n- Connection to the parent chain (Arbitrum One/Sepolia)\n- Used to read current network state\n- Validates deployment prerequisites\n\n**Configuration Object:**\n- \`chainId\`: Must match your chain config\n- \`owner\`: Initial chain owner address\n- \`chainConfig\`: Output from prepareChainConfig\n\n## Deployment Configuration Structure\n\nThe function returns a configuration object containing:\n- Contract deployment parameters\n- Gas settings and limits\n- Validator and batch poster requirements\n- Bridge configuration details\n\n## Custom Gas Token Considerations\n\n**For Custom Gas Tokens:**\n\`\`\`javascript\n// Additional step: approve token spending\nconst tokenContract = new ethers.Contract(\n  customTokenAddress,\n  ['function approve(address spender, uint256 amount)'],\n  signer\n);\n\n// Approve RollupCreator to spend tokens\nconst approveTx = await tokenContract.approve(\n  ROLLUP_CREATOR_ADDRESS,\n  ethers.parseEther('100') // Amount needed for deployment\n);\n\nawait approveTx.wait();\n\`\`\`\n\n## Parameter Validation\n\nThe function automatically validates:\n- Parent chain connectivity\n- Owner address format\n- Chain ID uniqueness\n- Configuration compatibility`,
          questions: [
            {
              id: "deploy-params-q1",
              question: "What additional step is required when deploying with a custom gas token?",
              options: [
                "Deploy a new token contract",
                "Approve the RollupCreator contract to spend tokens",
                "Set up a price oracle",
                "Configure additional validators"
              ],
              correctAnswer: 1,
              explanation: "When using a custom gas token, you must approve the RollupCreator contract to spend your tokens for the deployment process.",
              type: "multiple-choice"
            }
          ]
        }
      },
      {
        id: "config-validation",
        title: "Configuration Validation & Best Practices",
        type: "theory",
        status: "available",
        estimatedTime: "30 min",
        content: {
          story: `# Configuration Validation & Best Practices ✅\n\nProper configuration validation prevents deployment failures and ensures your Orbit chain operates securely and efficiently.\n\n## Pre-Deployment Checklist\n\n**Chain Identity Verification:**\n- ✅ Chain ID is unique and not conflicting\n- ✅ Chain ID is greater than 1000\n- ✅ No conflicts with existing networks\n- ✅ Reserved testnet chain ID (+1 from mainnet)\n\n**Ownership Configuration:**\n- ✅ Owner address is controlled by your team\n- ✅ Multi-signature setup for production\n- ✅ Backup key management procedures\n- ✅ Governance transition plan documented\n\n**Economic Parameters:**\n- ✅ Gas token has adequate liquidity\n- ✅ Token decimal places are appropriate\n- ✅ Economic sustainability modeled\n- ✅ Fee collection mechanisms planned\n\n## Security Best Practices\n\n**Key Management:**\n- Use hardware wallets for owner keys\n- Implement multi-signature wallets (3/5 minimum)\n- Regular key rotation procedures\n- Secure backup and recovery processes\n\n**Configuration Testing:**\n- Deploy to testnet first\n- Test all configuration parameters\n- Validate economic models\n- Stress test under load\n\n## Common Configuration Mistakes\n\n**Chain ID Issues:**\n- Using an existing chain ID\n- Not reserving testnet variants\n- Conflicting with popular networks\n\n**Ownership Problems:**\n- Single key ownership in production\n- Lost or compromised owner keys\n- No succession planning\n\n**Token Configuration:**\n- Insufficient token liquidity\n- Wrong decimal configuration\n- Missing approval allowances\n\n## Validation Tools\n\n\`\`\`javascript\n// Example validation script\nfunction validateConfig(config) {\n  const issues = [];\n  \n  // Check chain ID\n  if (config.chainId < 1000) {\n    issues.push('Chain ID should be >= 1000');\n  }\n  \n  // Check owner address\n  if (!ethers.isAddress(config.arbitrum.InitialChainOwner)) {\n    issues.push('Invalid owner address');\n  }\n  \n  // Check token configuration\n  if (config.arbitrum.nativeToken && \n      !ethers.isAddress(config.arbitrum.nativeToken)) {\n    issues.push('Invalid token address');\n  }\n  \n  return issues;\n}\n\`\`\``,
          questions: [
            {
              id: "validation-q1",
              question: "What is the recommended minimum chain ID for custom Orbit chains?",
              options: [
                "1",
                "100",
                "1000",
                "10000"
              ],
              correctAnswer: 2,
              explanation: "Chain IDs below 1000 are typically reserved for major networks. Using 1000+ reduces the risk of conflicts.",
              type: "multiple-choice"
            }
          ]
        }
      },
      {
        id: "gas-token-options",
        title: "Gas Token Options and Economics",
        type: "theory",
        status: "available",
        estimatedTime: "35 min",
        content: {
          story: `# Gas Token Strategy for Orbit ⛽\n\nChoose native ETH gas for maximum familiarity or a custom gas token for ecosystem alignment.\n\n## Considerations\n- UX and wallet compatibility\n- Market liquidity and volatility\n- Accounting and treasury impacts\n- Bridges and exchange listings\n\n## Example policies\n- Fee rebates for ecosystem partners\n- Dynamic base fee per demand\n- Subsidized onboarding windows\n\nPlan governance safeguards for fee parameter changes.`,
          questions: [
            {
              id: "gas-q1",
              question: "Which factor is key when selecting a custom gas token?",
              options: ["Logo color", "Liquidity and wallet support", "Block size", "RPC brand"],
              correctAnswer: 1,
              explanation: "Liquidity and wallet support drive real UX and adoption.",
              type: "multiple-choice",
            },
          ],
        },
      },
      {
        id: "governance-params",
        title: "Parameter Governance Templates",
        type: "theory",
        status: "available",
        estimatedTime: "30 min",
        content: {
          story: `# Parameter Governance Templates 🧩\n\nTemplate guardrails for changing fees, DA mode, and validator sets.\n\n- Timelock windows (24–72h)\n- Quorum and proposal thresholds\n- Emergency pause with multi-sig + public notice\n\nDocument who can do what, when, and how users can verify.`,
          questions: [
            {
              id: "govp-q1",
              question: "Why add a timelock to parameter changes?",
              options: ["Lower gas", "Faster upgrades", "Community review time", "More oracle data"],
              correctAnswer: 2,
              explanation: "Time locks enable public review and response before effects.",
              type: "multiple-choice",
            },
          ],
        },
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
      "Deploy flow end‑to‑end: overview, required contracts, roles (batch poster/validators), env setup, createRollup, execution, verification, validator design, ops runbook, and a quiz.",
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
        content: {
          story: `# Deployment Process Overview 🏗️\n\nOrbit chain deployment follows a clear 3-phase flow: prepare configuration → prepare deployment parameters → execute rollup creation.\n\n## Phases\n\n1) Prepare Chain Configuration\n- Define \`chainId\`, \`InitialChainOwner\`, and DA mode (Rollup/AnyTrust)\n- Optionally set a custom gas token\n\n2) Prepare Deployment Parameters\n- Build the object consumed by the RollupCreator\n- Provide owner, validators, and batch poster\n\n3) Execute Deployment\n- Submit transaction to create the rollup\n- Wait for confirmations and extract core contract addresses\n\n## Key Actors\n- Owner: controls chain after deployment\n- Batch Poster: posts L2 batches\n- Validators: secure the chain state\n\nPlan testnet dry-runs before any production attempt.`,
          questions: [
            {
              id: "deploy-overview-q1",
              question: "Which is the correct high-level order for deployment?",
              options: [
                "Execute → Prepare Params → Prepare Config",
                "Prepare Config → Prepare Params → Execute",
                "Prepare Params → Execute → Prepare Config",
                "Execute → Prepare Config → Prepare Params"
              ],
              correctAnswer: 1,
              explanation: "You first prepare the chain configuration, then prepare deployment parameters, and finally execute the rollup creation.",
              type: "multiple-choice"
            }
          ]
        }
      },
      {
        id: "required-contracts",
        title: "Understanding Required Contracts",
        type: "theory",
        status: "available",
        estimatedTime: "35 min",
        content: {
          story: `# Contracts Involved In Deployment 📜\n\nDeployment interacts with a set of core contracts on the parent chain to instantiate your Orbit rollup.\n\n## Core Components (conceptual)\n- RollupCreator: factory that creates new rollups\n- Bridge/Nitro Core: contracts enabling L1↔L2 messaging and rollup state\n- Inbox/Outbox: message ingress/egress between layers\n\n## Outputs\nAfter deployment you receive:\n- Rollup address and core contracts\n- Inbox/Outbox addresses\n- Sequencer/BatchPoster configuration expectations\n\nAlways store these addresses for explorers, monitoring, and clients.`,
          questions: [
            {
              id: "req-contracts-q1",
              question: "Why must you record core contract addresses post-deployment?",
              options: [
                "They change every block",
                "They are needed for monitoring, UIs, and integrations",
                "They are required to pay gas",
                "They unlock validator rewards"
              ],
              correctAnswer: 1,
              explanation: "Downstream tools, dashboards, and apps need stable addresses to interact with your chain.",
              type: "multiple-choice"
            }
          ]
        }
      },
      {
        id: "batch-poster-validator",
        title: "Batch Poster & Validator Setup",
        type: "theory",
        status: "available",
        estimatedTime: "30 min",
        content: {
          story: `# Batch Poster & Validators 👥\n\nTwo operational roles are essential when launching an Orbit chain.\n\n## Batch Poster\n- Submits L2 transaction batches to the parent chain\n- Needs funding and reliable infra\n- Can be rotated via governance\n\n## Validators\n- Observe state and attest to correctness\n- For tests, you can reuse the same address; production should decentralize\n\n## Practical Tips\n- Use separate keys for poster vs validator\n- Add alerting for liveness and failures\n- Document rotation and emergency procedures`,
          questions: [
            {
              id: "bp-val-q1",
              question: "In early testing, which is acceptable?",
              options: [
                "Never run a batch poster",
                "Use the same address for poster and validator",
                "Use no validators",
                "Run validators without any monitoring"
              ],
              correctAnswer: 1,
              explanation: "For testing you can reuse a single address; production should split roles and decentralize.",
              type: "multiple-choice"
            }
          ]
        }
      },
      {
        id: "environment-setup",
        title: "Setting Up Development Environment (Templates)",
        type: "theory",
        status: "available",
        estimatedTime: "35 min",
        content: {
          story: `# Environment Setup ⚙️\n\nBefore deployment, create a reproducible environment and secure configuration management.\n\n## Prerequisites\n- Node.js toolchain and package manager\n- Access to parent chain RPC (e.g., Arbitrum Sepolia)\n- Private key management via env files or secure vaults\n\n## Templates\n- .env with DEPLOYER_PRIVATE_KEY, BATCH_POSTER_PRIVATE_KEY, VALIDATOR_PRIVATE_KEY\n- Scripts for config generation and validation\n\n## Safety\n- Never commit secrets\n- Use different keys for test and prod\n- Enable logging for auditability`,
          questions: [
            {
              id: "env-setup-q1",
              question: "Which item belongs in your .env for deployment?",
              options: [
                "User mnemonic of random community member",
                "Deployer private key and role addresses",
                "All node logs",
                "Block explorer API secrets in plaintext repos"
              ],
              correctAnswer: 1,
              explanation: "You need the deployer and role addresses; store secrets securely and avoid committing them.",
              type: "multiple-choice"
            }
          ]
        }
      },
      {
        id: "create-rollup-function",
        title: "Using createRollup Function",
        type: "code-walkthrough",
        status: "available",
        estimatedTime: "50 min",
        content: {
          story: `# Using createRollup 🚀\n\nAfter preparing parameters, \`createRollup\` sends the deployment tx to the RollupCreator and waits for execution.\n\n## Minimal Flow\n1) Build params (owner, validators, batch poster, config)\n2) Call \`createRollup\` with your deployer account\n3) Wait for receipt and parse returned core contracts\n\n## Common Pitfalls\n- Mismatch between \`chainId\` in params vs config\n- Missing allowance when deploying with custom gas token\n- Insufficient parent chain funds for the deployer`,
          questions: [
            {
              id: "create-rollup-q1",
              question: "What does createRollup do?",
              options: [
                "Generates documentation",
                "Sends the deployment transaction to RollupCreator",
                "Creates a wallet",
                "Runs a local node"
              ],
              correctAnswer: 1,
              explanation: "createRollup submits the deployment to the RollupCreator contract and returns core addresses when successful.",
              type: "multiple-choice"
            }
          ]
        }
      },
      {
        id: "deployment-execution",
        title: "Executing Chain Deployment (Templates)",
        type: "theory",
        status: "available",
        estimatedTime: "50 min",
        content: {
          story: `# Executing Deployment ▶️\n\nBring together config, prepared params, and operational addresses to launch.\n\n## Checklist\n- Parent RPC reachable and funded deployer key\n- Owner, validator(s), batch poster addresses confirmed\n- Config/params consistency validated\n\n## After Submission\n- Store tx hash and emitted contract addresses\n- Share artifacts with team (infra, explorers, wallets)\n- Begin liveness checks (RPC, blocks, fees)`,
          questions: [
            {
              id: "deploy-exec-q1",
              question: "Which artifact is most critical to save immediately after deployment?",
              options: [
                "Local cache files",
                "Transaction hash and core contract addresses",
                "Console colors",
                "Random logs"
              ],
              correctAnswer: 1,
              explanation: "You will repeatedly need the tx hash and deployed contract addresses for verification, monitoring, and clients.",
              type: "multiple-choice"
            }
          ]
        }
      },
      {
        id: "deployment-verification",
        title: "Verifying Successful Deployment (Checklist)",
        type: "theory",
        status: "available",
        estimatedTime: "25 min",
        content: {
          story: `# Verification Checklist ✅\n\nConfirm that the chain is live and configured as intended.\n\n## On-Chain/Infra Checks\n- Tx succeeded and core contracts are present\n- Chain ID matches configuration\n- Batch poster address is set and posting\n- Validator(s) are active\n\n## Functional Sanity\n- RPC responds and returns latest blocks\n- Fees estimations make sense\n- Bridge message paths are operable in tests`,
          questions: [
            {
              id: "deploy-verify-q1",
              question: "Which RPC-based check best verifies immediate liveness after deployment?",
              options: [
                "Call eth_blockNumber twice to ensure it increases",
                "Open the chain's marketing website",
                "Check web3_clientVersion once",
                "Read a cached explorer summary page"
              ],
              correctAnswer: 0,
              explanation: "A monotonically increasing eth_blockNumber confirms block production/liveness right after deployment.",
              type: "multiple-choice"
            }
          ]
        }
      },
      {
        id: "validator-designs",
        title: "Validator Sets and Staking Designs",
        type: "theory",
        status: "available",
        estimatedTime: "40 min",
        content: {
          story: `# Validator Design for Orbit 👥\n\nDesign validator sets that balance security and operations.\n\n- Permissioned early; roadmap to permissionless\n- Stake sizing: Minimum Stake > Max Attack Profit\n- Slashing rules and monitoring\n- Liveness incentives and rotation\n\nAdd dashboards to expose validator health and stake distribution.`,
          questions: [
            {
              id: "val-q1",
              question: "Which rule guides stake sizing?",
              options: [
                "Minimum Stake < Attack Profit",
                "Minimum Stake = Gas Price",
                "Minimum Stake > Maximum Attack Profit",
                "No stake required",
              ],
              correctAnswer: 2,
              explanation: "Stake exceeding attack profit disincentivizes attacks.",
              type: "multiple-choice",
            },
          ],
        },
      },
      {
        id: "ops-runbook",
        title: "Ops Runbook: From Preview to Mainnet",
        type: "theory",
        status: "available",
        estimatedTime: "35 min",
        content: {
          story: `# Operations Runbook 🧭\n\nLifecycle: preview → testnet → mainnet.\n\nChecklists:\n- Monitoring: alerts, dashboards, RPC health\n- Incident response: severity ladder, comms, rollback plans\n- Key management: HSMs, rotation, access logs\n\nPractice dry-runs and publish status pages.`,
          questions: [
            {
              id: "ops-q1",
              question: "Which is essential in incident response?",
              options: ["Hidden changes", "Public status and rollback plans", "No logging", "Ad-hoc paging"],
              correctAnswer: 1,
              explanation: "Clear status and planned rollbacks build trust.",
              type: "multiple-choice",
            },
          ],
        },
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
      "Test your chain: strategy, RPC checks, wallet config, first tx, contract deploy, bridge tests, gas‑token UX, observability, wallet UX templates, and a quiz.",
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
        content: {
          story: `# Testing Strategy 🎯\n\nA structured approach ensures your Orbit chain behaves correctly before opening access to users.\n\n## Layers of Testing\n- Unit tests: contract-level invariants\n- Integration tests: cross-contract flows\n- End-to-end: RPC, wallet, bridge paths\n- Chaos & load: liveness and performance under stress\n\n## Objectives\n- Prove core flows work (transfers, deployments, bridging)\n- Verify monitoring and alerting paths\n- Exercise validator and batch poster operations`,
          questions: [
            {
              id: "test-overview-q1",
              question: "Which test best validates on-chain + infra together?",
              options: ["Unit tests", "End-to-end tests", "Static analysis", "Linters"],
              correctAnswer: 1,
              explanation: "End-to-end tests traverse RPC, nodes, and contracts together.",
              type: "multiple-choice",
            },
          ],
        },
      },
      {
        id: "rpc-connection",
        title: "Connecting to Your Chain's RPC (Templates)",
        type: "theory",
        status: "available",
        estimatedTime: "25 min",
        content: {
          story: `# RPC Connectivity 🔌\n\nConfirm your RPC endpoint exposes basic chain data and handles load.\n\n## Checks\n- Get latest block and fee data\n- Fetch peer count/health from node metrics\n- Verify HTTPS/TLS and rate limits\n\n## Template (read-only)\n\n\`\`\`ts\nimport { ethers } from 'ethers';\nexport async function ping(rpc: string){\n  const p = new ethers.JsonRpcProvider(rpc);\n  const net = await p.getNetwork();\n  const block = await p.getBlockNumber();\n  const fees = await p.getFeeData();\n  return { chainId: Number(net.chainId), block, maxFee: fees.maxFeePerGas?.toString() };\n}\n\`\`\``,
          questions: [
            {
              id: "rpc-q1",
              question: "Which read validates liveness most directly?",
              options: ["getNetwork()", "getBlockNumber()", "getCode()", "getLogs()"],
              correctAnswer: 1,
              explanation: "A monotonically increasing block number is a quick liveness signal.",
              type: "multiple-choice",
            },
          ],
        },
      },
      {
        id: "wallet-configuration",
        title: "Adding Chain to MetaMask (Templates)",
        type: "theory",
        status: "available",
        estimatedTime: "20 min",
        content: {
          story: `# Wallet Configuration 👛\n\nUsers must add your network to interact. Provide copy/paste or one-click add-network.\n\n## Required Fields\n- Chain ID\n- RPC URL\n- Currency symbol\n- Block explorer URL\n\n## UX Tips\n- Detect wrong chain and prompt switch\n- Fail with clear actions when network is missing`,
          questions: [
            {
              id: "wallet-q1",
              question: "Which field is mandatory for add-network?",
              options: ["Logo URL", "Chain ID", "Twitter handle", "Governance link"],
              correctAnswer: 1,
              explanation: "Chain ID uniquely identifies your network to wallets.",
              type: "multiple-choice",
            },
          ],
        },
      },
      {
        id: "first-transaction",
        title: "Sending Your First Transaction (Templates)",
        type: "theory",
        status: "available",
        estimatedTime: "30 min",
        content: {
          story: `# First Transaction ✉️\n\nValidate writes: send a transfer or simple contract call and confirm it lands in a block.\n\n## Steps\n1) Ensure account funded for gas\n2) Build and send tx with sensible gas params\n3) Wait for receipt and verify status\n\n## Example (pseudo)\n\n\`\`\`ts\nimport { ethers } from 'ethers';\nasync function send(provider: ethers.Provider, signer: ethers.Signer, to: string, amountWei: bigint){\n  const tx = await signer.sendTransaction({ to, value: amountWei });\n  const r = await tx.wait();\n  return r?.status === 1;\n}\n\`\`\``,
          questions: [
            {
              id: "tx-q1",
              question: "What confirms a successful write?",
              options: ["Signed transaction", "Receipt status = 1", "Nonce increased", "Gas used > 0"],
              correctAnswer: 1,
              explanation: "A status of 1 indicates successful execution.",
              type: "multiple-choice",
            },
          ],
        },
      },
      {
        id: "contract-deployment",
        title: "Deploying Smart Contracts",
        type: "code-walkthrough",
        status: "available",
        estimatedTime: "45 min",
        content: {
          story: `# Contract Deployment 📦\n\nDeploy a small contract to validate toolchain and gas economics.\n\n## Checklist\n- Compiler version matches\n- Correct constructor params\n- Verify bytecode and source mapping on explorer\n\n## Tips\n- Use deterministic builds\n- Keep deployment scripts idempotent\n- Record addresses and ABIs in a registry`,
          questions: [
            {
              id: "deploy-ct-q1",
              question: "What should you do after deployment for transparency?",
              options: ["Nothing", "Verify the contract on an explorer", "Delete the bytecode", "Rotate RPC"],
              correctAnswer: 1,
              explanation: "Verification enables users and tools to read your source and ABIs.",
              type: "multiple-choice",
            },
          ],
        },
      },
      {
        id: "bridge-testing",
        title: "Testing L2-L3 Bridge Functionality (Templates)",
        type: "theory",
        status: "available",
        estimatedTime: "40 min",
        content: {
          story: `# Bridge Testing 🌉\n\nExercise lock/mint and burn/release paths with small amounts and clear tracing.\n\n## Flow\n- Lock or deposit on source\n- Relay/validate message\n- Mint/release on destination\n- Reverse with burn/withdraw\n\n## Safety\n- Start with test tokens\n- Track message ids and confirmations\n- Monitor retries and failure states`,
          questions: [
            {
              id: "bridge-test-q1",
              question: "Which sequence is correct for lock-mint?",
              options: [
                "Mint → Lock → Release",
                "Lock → Relay → Mint",
                "Relay → Mint → Lock",
                "Burn → Release → Mint"
              ],
              correctAnswer: 1,
              explanation: "Lock on source, relay/verify, then mint on destination.",
              type: "multiple-choice",
            },
          ],
        },
      },
      {
        id: "gas-token-testing",
        title: "Testing Custom Gas Token (If Configured)",
        type: "theory",
        status: "available",
        estimatedTime: "35 min",
        content: {
          story: `# Custom Gas Token Tests ⛽\n\nIf using a custom gas token, validate UX and economics.\n\n## Cases\n- Add-network and balances visible in wallets\n- Fee estimation stable\n- Allowance/approval flows work\n- Bridges/liquidity available for gas token acquisition`,
          questions: [
            {
              id: "gas-test-q1",
              question: "Which is a key UX risk with custom gas tokens?",
              options: ["Block size", "Wallet support and token acquisition", "Node version", "Log verbosity"],
              correctAnswer: 1,
              explanation: "Users must easily acquire and spend the gas token; poor support blocks activity.",
              type: "multiple-choice",
            },
          ],
        },
      },
      {
        id: "observability",
        title: "Observability: Logs, Metrics, Traces",
        type: "theory",
        status: "available",
        estimatedTime: "30 min",
        content: {
          story: `# Observability for Orbit 🔭\n\nKey telemetry:\n- RPC errors, latency, rate limits\n- Sequencer throughput, backlog\n- DA posting failures and retries\n\nBuild dashboards for real-time and historical trends; alert on SLA breaches.`,
          questions: [
            {
              id: "obs-q1",
              question: "Which metric helps detect RPC stress?",
              options: ["Color theme", "Error rate and latency", "Block icon", "Logo size"],
              correctAnswer: 1,
              explanation: "Error rate and latency are primary RPC health signals.",
              type: "multiple-choice",
            },
          ],
        },
      },
      {
        id: "wallet-ux",
        title: "Wallet UX Templates",
        type: "theory",
        status: "available",
        estimatedTime: "25 min",
        content: {
          story: `# Wallet UX Templates 👛\n\nUX patterns for add-network prompts, chain switching, failure states, and stuck nonce remediation.\n\nProvide copy and visuals explaining the L3 context to users.`,
          questions: [
            {
              id: "wux-q1",
              question: "Why show add-network prompts?",
              options: ["Decoration", "To ensure wallet targets the intended chain", "Gas reduction", "Explorer ads"],
              correctAnswer: 1,
              explanation: "Users must switch to the correct chain for successful interactions.",
              type: "multiple-choice",
            },
          ],
        },
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
      "Deep‑dive: custom precompiles, DAC setup, governance/upgrades, implementing precompiles, DAC keysets, performance monitoring, Timeboost/MEV, DAC ops, security best practices, and a quiz.",
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
        content: {
          story: `# Custom Precompiles 🧩\n\nExpose native functionality to contracts with custom precompiles.\n\n## Design\n- Define deterministic address space\n- Specify gas cost model\n- Document ABI-like interface\n\n## Risks\n- Consensus-critical logic\n- Auditing complexity\n- Backwards compatibility across upgrades`,
          questions: [
            {
              id: "precomp-q1",
              question: "What must be documented for a precompile?",
              options: ["Logo color", "Deterministic address and interface", "Testnet faucets", "UI themes"],
              correctAnswer: 1,
              explanation: "Callers need stable address and well-defined input/output semantics.",
              type: "multiple-choice",
            },
          ],
        },
      },
      {
        id: "data-availability-committee",
        title: "Data Availability Committee Setup",
        type: "theory",
        status: "available",
        estimatedTime: "40 min",
        content: {
          story: `# DAC Setup 🧑‍⚖️\n\nFor AnyTrust, define committee membership, attestation policies, and incident response.\n\n## Elements\n- Membership list and rotation cadence\n- Attestation thresholds and timeouts\n- Transparency page with contacts and status`,
          questions: [
            {
              id: "dac-setup-q1",
              question: "Which is essential for AnyTrust transparency?",
              options: ["Private keys", "Committee membership and procedures", "Gas token symbol", "RPC theme"],
              correctAnswer: 1,
              explanation: "Users must know who attests and how operations are handled.",
              type: "multiple-choice",
            },
          ],
        },
      },
      {
        id: "governance-mechanisms",
        title: "Chain Governance & Upgrades",
        type: "theory",
        status: "available",
        estimatedTime: "35 min",
        content: {
          story: `# Governance & Upgrades 🗳️\n\nEstablish safe upgrade paths with timelocks and staged releases.\n\n## Practices\n- RFCs and public review windows\n- Timelocked execution with multi-sig\n- Rollback and hotfix runbooks`,
          questions: [
            {
              id: "gov-up-q1",
              question: "Why use timelocks on upgrades?",
              options: ["Lower gas", "Allow community review and reaction", "Increase block size", "Reduce validator set"],
              correctAnswer: 1,
              explanation: "Delays create visibility and mitigate surprise changes.",
              type: "multiple-choice",
            },
          ],
        },
      },
      {
        id: "custom-precompile-implementation",
        title: "Implementing Custom Precompiles",
        type: "code-walkthrough",
        status: "available",
        estimatedTime: "60 min",
        content: {
          story: `# Implementing Precompiles 🔧\n\nWalk through a reference implementation: interface, gas, and tests.\n\n## Steps\n- Define call convention\n- Implement and benchmark\n- Fuzz and differential test against spec`,
          questions: [
            {
              id: "impl-precomp-q1",
              question: "Which testing approach adds confidence?",
              options: ["None", "Fuzzing and differential tests", "UI snapshots", "String comparisons"],
              correctAnswer: 1,
              explanation: "Precompile logic benefits from randomized and cross-impl checks.",
              type: "multiple-choice",
            },
          ],
        },
      },
      {
        id: "dac-implementation",
        title: "Setting Up DAC Keyset (Templates)",
        type: "theory",
        status: "available",
        estimatedTime: "35 min",
        content: {
          story: `# DAC Keyset 🔑\n\nDefine keys and rotation for committee members with secure ceremonies.\n\n## Guidance\n- Thresholds and slashing policies\n- Revocation and rotation\n- Public key registry`,
          questions: [
            {
              id: "dac-keys-q1",
              question: "What should a registry expose?",
              options: ["Private keys", "Public keys and metadata", "Wallet mnemonics", "Nothing"],
              correctAnswer: 1,
              explanation: "Public keys allow verification and discovery by clients.",
              type: "multiple-choice",
            },
          ],
        },
      },
      {
        id: "chain-monitoring",
        title: "Monitoring Chain Performance",
        type: "theory",
        status: "available",
        estimatedTime: "35 min",
        content: {
          story: `# Monitoring 📊\n\nTrack RPC error rates, latency, and sequencer throughput.\n\n## Dashboards\n- Time-series metrics for RPC, node, and DA posting\n- Alerts on thresholds\n- SLOs for availability and latency`,
          questions: [
            {
              id: "monitor-q1",
              question: "Which metric best signals RPC stress?",
              options: ["Logo color", "Error rate and latency", "Header size", "Trace length"],
              correctAnswer: 1,
              explanation: "Error rate and latency are primary health indicators.",
              type: "multiple-choice",
            },
          ],
        },
      },
      {
        id: "timeboost-mev",
        title: "Timeboost and MEV Considerations",
        type: "theory",
        status: "available",
        estimatedTime: "35 min",
        content: {
          story: `# Timeboost & MEV ⏱️\n\nUnderstand scheduling and ordering features and their impact on MEV.\n\n- Fair sequencing goals\n- Auction vs first-come rules\n- Monitoring for toxic order flow\n\nDocument policies publicly to guide integrators.`,
          questions: [
            {
              id: "tb-q1",
              question: "What’s a core goal of fair sequencing?",
              options: ["Max gas", "Unpredictable ordering", "Reducing manipulative ordering advantages", "No blocks"],
              correctAnswer: 2,
              explanation: "Fair sequencing aims to reduce unfair ordering advantages.",
              type: "multiple-choice",
            },
          ],
        },
      },
      {
        id: "dac-operations",
        title: "DAC Operations (AnyTrust)",
        type: "theory",
        status: "available",
        estimatedTime: "30 min",
        content: {
          story: `# DAC Operations 🧑‍💼\n\nIf using AnyTrust, plan committee membership, rotations, attestations, and incident protocols.\n\nPublish membership and contact procedures for transparency.`,
          questions: [
            {
              id: "dac-q1",
              question: "What should AnyTrust deployments publish?",
              options: ["GIFs", "Committee membership and procedures", "Private keys", "Nothing"],
              correctAnswer: 1,
              explanation: "Transparency about committee operations builds trust.",
              type: "multiple-choice",
            },
          ],
        },
      },
      {
        id: "security-considerations",
        title: "Security Best Practices",
        type: "theory",
        status: "available",
        estimatedTime: "30 min",
        content: {
          story: `# Security Best Practices 🔐\n\nSecurity spans keys, contracts, infra, governance, and operations. Bake safety into every layer.\n\n## Key Management\n- Use hardware wallets/HSMs for admins\n- Multi-signature for sensitive actions\n- Rotation procedures and access logs\n\n## Smart Contracts\n- Multiple audits for consensus-critical code\n- Formal verification where feasible\n- Immutable configs or timelocked upgrades\n\n## Infrastructure\n- Least-privilege IAM, secrets in vaults\n- Redundancy and DDoS protection for RPC\n- Backups and disaster recovery playbooks\n\n## Governance & Ops\n- Timelocks and public RFCs for changes\n- Incident response ladder and status pages\n- Post-incident reviews and transparency`,
          questions: [
            {
              id: "sec-best-q1",
              question: "Which measure reduces blast radius of admin key compromise?",
              options: ["Single EOA owner", "Multi-signature with timelock", "Plaintext keys in repo", "Disable logging"],
              correctAnswer: 1,
              explanation: "Multi-sig plus timelock distributes control and adds time for community response.",
              type: "multiple-choice"
            }
          ]
        }
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
      "Production readiness: mainnet prep, audits, monitoring/alerting, validator ops, upgrade procedures, incident response, community building, ops playbook, and launch runbook (coming soon).",
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
        content: {
          story: `# Mainnet Preparation 🚦\n\nDefine readiness criteria and freeze windows before mainnet.\n\n## Readiness Checklist\n- All critical issues closed; audits completed\n- Incident runbooks and on-call rotation set\n- Multi-sig owners verified and hardware keys ready\n- Funding plan for poster/validators and ops costs\n\n## Launch Plan\n- Change-freeze window with rollback steps\n- Dry-run on testnets mirroring production params\n- Communication plan for community and partners`,
          questions: [
            {
              id: "mainnet-prep-q1",
              question: "What should exist before mainnet launch?",
              options: ["Marketing only", "Runbooks and on-call rotation", "No audits", "One EOA admin"],
              correctAnswer: 1,
              explanation: "Operational readiness (runbooks, on-call) is essential for mainnet safety.",
              type: "multiple-choice"
            }
          ]
        }
      },
      {
        id: "security-audit",
        title: "Security Auditing Your Chain",
        type: "theory",
        status: "available",
        estimatedTime: "35 min",
        content: {
          story: `# Security Auditing 🔍\n\nAudit both contracts and operational posture.\n\n## Scope\n- Consensus/bridge contracts and custom logic\n- Governance mechanisms and upgrade paths\n- Key management, access control, and deployments\n\n## Process\n- Multiple firms and internal reviews\n- Remediation with verification\n- Public summary for transparency`,
          questions: [
            {
              id: "audit-q1",
              question: "Which adds most confidence pre-mainnet?",
              options: ["UI snapshot tests", "Independent multi-firm audits", "Single manual test", "Skipping tests"],
              correctAnswer: 1,
              explanation: "Independent reviews reduce blind spots and increase assurance.",
              type: "multiple-choice"
            }
          ]
        }
      },
      {
        id: "monitoring-setup",
        title: "Setting Up Monitoring & Alerting",
        type: "hands-on",
        status: "available",
        estimatedTime: "50 min",
        content: {
          story: `# Monitoring & Alerting 📈\n\nEstablish 24/7 visibility into RPC, sequencer, DA posting, and validators.\n\n## Metrics\n- RPC: error rate, latency, rate limits\n- Sequencer: throughput, backlog, time to inclusion\n- DA: posting failures, retries\n- Validators: liveness, stake, slashing events\n\n## Alerts\n- Breach of SLOs (availability/latency)\n- Posting stalls and backlog spikes\n- Validator downtime or stake drops`,
          questions: [
            {
              id: "monitor-q1-prod",
              question: "Which metric pair is core for RPC health?",
              options: ["Theme & logo", "Error rate & latency", "Tx nonce & tip", "Peer names"],
              correctAnswer: 1,
              explanation: "Error rate and latency best capture RPC health and UX impact.",
              type: "multiple-choice"
            }
          ]
        }
      },
      {
        id: "validator-nodes",
        title: "Running Validator Nodes",
        type: "hands-on",
        status: "available",
        estimatedTime: "60 min",
        content: {
          story: `# Validator Nodes 🧩\n\nOperate robust validator infrastructure with clear procedures.\n\n## Operations\n- Provisioning with IaC and secrets management\n- Health checks and auto-recovery\n- Version pinning and rollout strategy\n\n## Governance\n- Rotation policies and access reviews\n- Slashing and appeals procedures\n- Transparency of validator set`,
          questions: [
            {
              id: "val-prod-q1",
              question: "What improves validator reliability?",
              options: ["Single box", "IaC + health checks + rollout plan", "Plaintext keys", "No monitoring"],
              correctAnswer: 1,
              explanation: "Automated infra, health checks, and controlled rollouts harden operations.",
              type: "multiple-choice"
            }
          ]
        }
      },
      {
        id: "upgrade-mechanisms",
        title: "Chain Upgrade Procedures",
        type: "code-walkthrough",
        status: "available",
        estimatedTime: "45 min",
        content: {
          story: `# Upgrade Procedures 🛠️\n\nSafe upgrades require staged rollouts, timelocks, and communication.\n\n## Process\n- RFC → review window → queued via timelock → execute\n- Staged rollout with canary and monitoring\n- Rollback plan and signed announcements`,
          questions: [
            {
              id: "upgrade-q1",
              question: "Why add a timelock to upgrades?",
              options: ["Cheaper gas", "Public review and reaction time", "Faster blocks", "Private ops"],
              correctAnswer: 1,
              explanation: "Timelocks allow stakeholders to react and reduce surprise changes.",
              type: "multiple-choice"
            }
          ]
        }
      },
      {
        id: "incident-response",
        title: "Incident Response Planning",
        type: "theory",
        status: "available",
        estimatedTime: "30 min",
        content: {
          story: `# Incident Response 🚨\n\nDefine severity levels, comms, and decision trees before an incident.\n\n## Essentials\n- Severity matrix and escalation paths\n- War-room procedures and roles\n- Public status updates and timelines\n\n## Aftermath\n- Root-cause analysis\n- Action items with owners and deadlines\n- Post-incident report`,
          questions: [
            {
              id: "ir-q1",
              question: "What should every incident have?",
              options: ["No logs", "A root-cause analysis and action items", "Hidden timeline", "Private keys"],
              correctAnswer: 1,
              explanation: "RCAs with actionable follow-ups improve resilience over time.",
              type: "multiple-choice"
            }
          ]
        }
      },
      {
        id: "community-building",
        title: "Building Your Chain's Ecosystem",
        type: "theory",
        status: "available",
        estimatedTime: "35 min",
        content: {
          story: `# Ecosystem Building 🌱\n\nCommunicate roadmaps, support builders, and publish standards to grow adoption.\n\n## Tracks\n- Grants and hackathons\n- Developer docs and SDKs\n- Partner integrations and listings\n\n## Transparency\n- Public roadmap and changelogs\n- Governance participation and proposals`,
          questions: [
            {
              id: "eco-q1",
              question: "What accelerates third‑party integrations?",
              options: ["Private docs", "Clear SDKs and standards", "Closed repos", "Hidden addresses"],
              correctAnswer: 1,
              explanation: "Well-documented SDKs and standards reduce friction for partners.",
              type: "multiple-choice"
            }
          ]
        }
      },
      {
        id: "monitoring-operations",
        title: "Monitoring and Operations Playbook",
        type: "theory",
        status: "available",
        estimatedTime: "40 min",
        content: {
          story: `# Production Ops Playbook 📚\n\nDefine SLAs, alert policies, on-call rotation, and user comms.\n\n- Run books for common incidents\n- Backups and disaster recovery\n- Post-incident reports\n\nLink dashboards and public status.`,
          questions: [
            {
              id: "pop-q1",
              question: "Why publish post-incident reports?",
              options: ["Marketing only", "Transparency and learning", "Legal", "To remove logs"],
              correctAnswer: 1,
              explanation: "Transparency improves trust and helps the ecosystem learn.",
              type: "multiple-choice",
            },
          ],
        },
      }
    ],
  },
  {
    id: "hands-on-deployment",
    title: "Hands-On: Deploy Your Chain",
    description:
      "Deploy your own Arbitrum Orbit chain in real-time using our deployment API. Configure, launch, and monitor your chain from creation to completion.",
    icon: "🚀",
    level: "Intermediate",
    duration: "30-45 min",
    status: "available",
    badge: {
      title: "Chain Deployer",
      description: "Successfully Deployed Your Own Orbit Chain",
      image: "/badges/chain-deployer-live.png",
    },
    sections: [
      {
        id: "deployment-introduction",
        title: "Introduction to Live Deployment",
        type: "theory",
        status: "available",
        estimatedTime: "10 min",
        content: {
          story: `# Live Chain Deployment 🎯\n\nWelcome to the hands-on deployment experience! In this chapter, you'll deploy a real Arbitrum Orbit chain.\n\n## What You'll Accomplish\n\nBy the end of this chapter, you will have:\n- Deployed your own Layer 3 Orbit chain\n- Configured chain parameters (name, chain ID)\n- Monitored deployment progress in real-time\n- Received your chain's contract addresses\n\n## How It Works\n\nOur deployment system:\n1. **Accepts Your Configuration**: Chain name, ID, and owner address\n2. **Prepares Chain Config**: Uses Orbit SDK to prepare parameters\n3. **Deploys Contracts**: Deploys core contracts to parent chain\n4. **Initializes Infrastructure**: Sets up rollup infrastructure\n5. **Transfers Ownership**: Assigns control to your wallet\n\n## Prerequisites\n\n✅ **Wallet Connection**: Your connected wallet will be the chain owner\n✅ **Basic Understanding**: Complete previous chapters for context\n✅ **Internet Connection**: For API communication and monitoring\n## What Makes This Special\n\n The deployment:\n- Creates actual contracts on the parent chain\n- Establishes a functional Layer 3 blockchain\n- Can be used for testing and development\n- Demonstrates real-world Orbit deployment\n\n**Ready to become a chain deployer? Let's proceed! 🚀**`,
          questions: [
            {
              id: "deploy-intro-q1",
              question: "What role will your connected wallet address play in the deployment?",
              options: [
                "It will be used only for authentication",
                "It will become the chain owner with full control",
                "It will be the batch poster",
                "It has no role in deployment"
              ],
              correctAnswer: 1,
              explanation: "Your connected wallet address will become the chain owner, giving you full control over the deployed Orbit chain.",
              type: "multiple-choice"
            }
          ]
        }
      },
      {
        id: "deploy-your-chain-live",
        title: "Deploy Your Chain",
        type: "hands-on",
        status: "available",
        estimatedTime: "20-30 min",
      },
      {
        id: "post-deployment-steps",
        title: "Next Steps After Deployment",
        type: "theory",
        status: "available",
        estimatedTime: "15 min",
        content: {
          story: `# Post-Deployment Guide 📋\n\nCongratulations on deploying your Orbit chain! Here's what you can do next.\n\n## Immediate Next Steps\n\n### 1. Record Your Chain Information\n\nSave these critical details:\n- **Chain Address**: The contract address on the parent chain\n- **Deployment Transaction**: The tx hash for verification\n- **Chain ID**: Your unique chain identifier\n- **Owner Address**: Your wallet address (for governance)\n\n### 2. Set Up Chain Infrastructure\n\n**RPC Endpoint Configuration:**\n- Set up a node to serve RPC requests\n- Configure the node with your chain's parameters\n- Enable HTTPS/TLS for production use\n\n**Block Explorer:**\n- Deploy a block explorer (Blockscout or similar)\n- Configure it to index your chain\n- Make it publicly accessible for users\n\n### 3. Configure Operational Roles\n\n**Batch Poster:**\n- Designate an address to post batches\n- Fund it with sufficient parent chain gas\n- Set up monitoring for batch posting\n\n**Validators:**\n- Select validator addresses\n- Configure validator nodes\n- Establish validator communication channels\n\n## Development Activities\n\n### Test Your Chain\n\n\`\`\`javascript\n// Connect to your chain using ethers.js\nimport { ethers } from 'ethers';\n\nconst provider = new ethers.JsonRpcProvider(\n  'YOUR_CHAIN_RPC_URL'\n);\n\n// Check chain ID\nconst network = await provider.getNetwork();\nconsole.log('Chain ID:', network.chainId);\n\n// Get latest block\nconst block = await provider.getBlockNumber();\nconsole.log('Latest block:', block);\n\`\`\`\n\n### Add to MetaMask\n\n1. Open MetaMask\n2. Click "Add Network" → "Add Network Manually"\n3. Fill in:\n   - Network Name: Your chain name\n   - RPC URL: Your node's RPC endpoint\n   - Chain ID: Your chain ID\n   - Currency Symbol: ETH (or your custom token)\n\n### Deploy Your First Contract\n\n\`\`\`solidity\n// SimpleStorage.sol\npragma solidity ^0.8.0;\n\ncontract SimpleStorage {\n    uint256 private value;\n    \n    function setValue(uint256 _value) external {\n        value = _value;\n    }\n    \n    function getValue() external view returns (uint256) {\n        return value;\n    }\n}\n\`\`\`\n\nDeploy this to verify your chain is working!\n\n## Governance Setup\n\n### Transition to Multi-Sig\n\nFor production chains:\n1. Create a multi-signature wallet (Gnosis Safe)\n2. Transfer chain ownership to the multi-sig\n3. Document all ownership transfer steps\n4. Set up governance procedures\n\n### Define Upgrade Process\n\n- Establish proposal process\n- Implement timelocks for changes\n- Create public communication channels\n- Plan for emergency response\n\n## Monitoring & Maintenance\n\n### Set Up Monitoring\n\n**Key Metrics to Track:**\n- Block production rate\n- Transaction throughput\n- Gas prices and fees\n- Batch posting frequency\n- Validator uptime\n\n**Alerting:**\n- Configure alerts for downtime\n- Monitor for unusual activity\n- Track batch posting failures\n- Set up on-call rotation\n\n### Regular Maintenance\n\n- Keep nodes updated\n- Monitor disk space and resources\n- Review logs regularly\n- Perform periodic security audits\n\n## Community Building\n\n### Documentation\n\n- Create developer documentation\n- Publish RPC endpoints and chain info\n- Write integration guides\n- Maintain a public roadmap\n\n### Ecosystem Growth\n\n- Launch developer grants program\n- Host hackathons\n- Build partnerships\n- Support early adopters\n\n## Resources\n\n**Official Documentation:**\n- [Arbitrum Orbit Docs](https://docs.arbitrum.io/launch-orbit-chain/orbit-gentle-introduction)\n- [Orbit SDK GitHub](https://github.com/OffchainLabs/arbitrum-orbit-sdk)\n\n**Community:**\n- Arbitrum Discord\n- Developer Forums\n- Technical Support Channels\n\n## Troubleshooting\n\n**Chain Not Producing Blocks:**\n- Verify batch poster is funded\n- Check batch poster node is running\n- Review logs for errors\n\n**RPC Not Responding:**\n- Verify node is synced\n- Check network connectivity\n- Review node configuration\n\n**Bridge Issues:**\n- Verify bridge contracts are deployed\n- Check message relay configuration\n- Test with small amounts first\n\n## What's Next?\n\nNow that you have your chain, consider:\n\n1. **Building dApps**: Deploy applications to your chain\n2. **Custom Features**: Implement precompiles or custom gas tokens\n3. **Scaling**: Optimize for higher throughput\n4. **Governance**: Decentralize chain control\n5. **Ecosystem**: Grow your chain's user base\n\n**Congratulations on becoming a chain operator! 🎉**`,
        }
      },
    ],
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
  "hands-on-deployment": [
    {
      id: "q1",
      question: "What is the primary purpose of the hands-on deployment chapter?",
      options: [
        "To read about deployment theory",
        "To deploy a real Arbitrum Orbit chain using the deployment API",
        "To configure a wallet",
        "To learn about Ethereum",
      ],
      correctAnswer: 1,
      explanation:
        "The hands-on deployment chapter allows you to deploy a real Arbitrum Orbit chain in real-time using our deployment API.",
    },
    {
      id: "q2",
      question: "What becomes the chain owner address after deployment?",
      options: [
        "A random address",
        "The deployment API address",
        "Your connected wallet address",
        "Arbitrum's address",
      ],
      correctAnswer: 2,
      explanation:
        "Your connected wallet address becomes the chain owner, giving you full control over the deployed Orbit chain.",
    },
    {
      id: "q3",
      question: "What is the minimum recommended chain ID value?",
      options: [
        "1",
        "10",
        "100",
        "1000",
      ],
      correctAnswer: 3,
      explanation:
        "Chain IDs should be greater than or equal to 1000 to avoid conflicts with existing networks.",
    },
  ],
};
