"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Section } from "../data/defiChapters";
import { getTheoryContent, TheoryContent } from "../data/defiContent";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";
import GitHubAuthHandler from "./GitHubAuthHandler";

interface ChapterContentProps {
  section: Section;
  chapterId: string;
  onComplete: () => void;
}

export default function ChapterContent({
  section,
  chapterId,
  onComplete,
}: ChapterContentProps) {
  const [completed, setCompleted] = useState(false);
  const [currentSubSection, setCurrentSubSection] = useState(0);
  // Inline quiz state for sections that provide direct content with a single question
  const [inlineAnswered, setInlineAnswered] = useState(false);
  const [inlineSelectedIndex, setInlineSelectedIndex] = useState<number | null>(null);

  // Reset subsection index when section changes to avoid out-of-range access
  useEffect(() => {
    setCurrentSubSection(0);
    // reset inline quiz states when section changes
    setInlineAnswered(false);
    setInlineSelectedIndex(null);
  }, [section.id, chapterId]);

  const handleComplete = () => {
    setCompleted(true);
    onComplete();
  };

  // Check if section has content directly (for orbit and other modules with inline content)
  const hasDirectContent = section.content && typeof section.content === 'object' &&
    ('story' in section.content || 'questions' in section.content);

  // Get comprehensive theory content (for DeFi module)
  const theoryContent = !hasDirectContent ? getTheoryContent(chapterId, section.id) : null;

  // Fallback content for sections without comprehensive content
  const getFallbackContent = () => {
    const safeTitle = section.title || "Concept";
    const isOrbitIntro = chapterId === "intro-to-orbit";
    // Orbit Intro: section-specific read-only templates
    if (isOrbitIntro) {
      if (section.id === "what-is-orbit") {
        return {
          title: "What is Arbitrum Orbit?",
          introduction:
            "Arbitrum Orbit lets teams launch their own Arbitrum chains (L2 or L3) using the Nitro stack—configurable execution, governance, DA, and gas models.",
          sections: [
            {
              id: "nutshell",
              title: "In a nutshell",
              content:
                "Orbit chains are permissionless, configurable instances of Arbitrum Nitro you own and govern. Choose throughput, privacy, gas token, DA layer (Rollup/AnyTrust/Alt-DA), and validation model. See the official gentle introduction for context.",
            },
            {
              id: "l1-l2-l3",
              title: "L1 vs L2 vs L3",
              content:
                "L1 (Ethereum): base security, finality, high fees during congestion. L2 (Arbitrum One/Nova): scales Ethereum via optimistic rollups or AnyTrust. L3 (Orbit): app- or ecosystem-specific chains that can settle to an L2 with dedicated throughput.",
            },
            {
              id: "read-template",
              title: "Read-only template: network metadata",
              content: "A simple template to fetch chain data (no private keys).",
              codeExample:
                "" +
                "// Fetch current chain and block number (read-only)\n" +
                "import { ethers } from 'ethers';\n\n" +
                "export async function describeNetwork(rpcUrl: string){\n" +
                "  const provider = new ethers.JsonRpcProvider(rpcUrl);\n" +
                "  const net = await provider.getNetwork();\n" +
                "  const block = await provider.getBlockNumber();\n" +
                "  return { chainId: Number(net.chainId), block };\n" +
                "}\n",
            },
          ],
          keyTakeaways: [
            "Orbit chains are configurable Arbitrum chains you own",
            "L3s inherit security via their settlement layer",
            "Start with read-only RPC interactions to learn",
          ],
          additionalResources: [
            {
              title: "A gentle introduction: Arbitrum chains",
              url: "https://docs.arbitrum.io/launch-arbitrum-chain/a-gentle-introduction",
              type: "documentation",
            },
          ],
        } as TheoryContent;
      }
      if (section.id === "l3-vs-l2") {
        return {
          title: "L3 vs L2 vs L1: Where Orbit Fits",
          introduction:
            "Clarify how Orbit chains differ from public L2s and Ethereum L1, and why teams pick L3s for tailored throughput and governance.",
          sections: [
            {
              id: "compare",
              title: "Comparison",
              content:
                "L1: maximum decentralization, highest cost. L2: optimistic rollups AnyTrust—lower cost, inherits L1 security. L3 (Orbit): custom execution and governance, can optimize for app needs while leveraging L2 settlement.",
            },
            {
              id: "template",
              title: "Read-only: gas price snapshot",
              content: "Compare gas price across two RPCs to see cost profiles.",
              codeExample:
                "import { ethers } from 'ethers';\n" +
                "export async function gasSnapshot(urls: string[]){\n" +
                "  const entries = await Promise.all(urls.map(async (u)=>{\n" +
                "    const p = new ethers.JsonRpcProvider(u);\n" +
                "    const price = await p.getFeeData();\n" +
                "    return { url: u, maxFeePerGas: price.maxFeePerGas?.toString() };\n" +
                "  }));\n" +
                "  return entries;\n" +
                "}\n",
            },
          ],
          keyTakeaways: [
            "Pick L3 when you need dedicated throughput and custom policy",
            "L2s balance cost and security for general users",
          ],
          additionalResources: [
            {
              title: "Arbitrum chains overview",
              url: "https://docs.arbitrum.io/launch-arbitrum-chain/a-gentle-introduction",
              type: "documentation",
            },
          ],
        } as TheoryContent;
      }
      if (section.id === "orbit-use-cases") {
        return {
          title: "Orbit Use Cases & Benefits",
          introduction:
            "Why teams adopt Orbit: dedicated throughput, custom gas token, privacy domains, governance, and tailored precompiles.",
          sections: [
            {
              id: "catalog",
              title: "Common use cases",
              content:
                "- DeFi ecosystems needing deterministic throughput\n- Gaming chains with predictable fees\n- Enterprise/private deployments\n- Data-availability experiments (AnyTrust/Alt-DA)",
            },
            {
              id: "template",
              title: "Read-only: ERC-20 metadata on your chain",
              content: "Inspect a token’s name/symbol/decimals via RPC.",
              codeExample:
                "import { ethers } from 'ethers';\n" +
                "const erc20 = ['function name() view returns(string)', 'function symbol() view returns(string)', 'function decimals() view returns(uint8)'];\n" +
                "export async function tokenMeta(rpc:string, token:string){\n" +
                "  const p=new ethers.JsonRpcProvider(rpc);\n" +
                "  const c=new ethers.Contract(token, erc20, p);\n" +
                "  const [n,s,d]=await Promise.all([c.name(),c.symbol(),c.decimals()]);\n" +
                "  return { n,s,d };\n" +
                "}\n",
            },
          ],
          keyTakeaways: [
            "Orbit enables app-tailored chains with EVM+ compatibility",
            "Benefits include governance and fee policy control",
          ],
        } as TheoryContent;
      }
      if (section.id === "orbit-architecture") {
        return {
          title: "Orbit Chain Architecture Overview",
          introduction:
            "High-level components: execution (Nitro), DA layer (Rollup/AnyTrust), settlement, validation, and bridge integration.",
          sections: [
            {
              id: "diagram",
              title: "Conceptual map",
              content:
                "Execution (Nitro) → Sequencing → Batching/Compression → DA posting → Settlement & challenge → Bridge integration for interop.",
            },
            {
              id: "template",
              title: "Read-only: latest block timestamp",
              content: "Simple block metadata fetch helps validate liveness.",
              codeExample:
                "import { ethers } from 'ethers';\n" +
                "export async function latest(rpc:string){\n" +
                "  const p=new ethers.JsonRpcProvider(rpc);\n" +
                "  const b=await p.getBlock('latest');\n" +
                "  return { number:b?.number, ts:b?.timestamp };\n" +
                "}\n",
            },
          ],
          keyTakeaways: [
            "Orbit architecture composes DA, settlement, validation",
            "Monitoring basics start with block/fee/health reads",
          ],
        } as TheoryContent;
      }
      if (section.id === "orbit-da-overview") {
        return {
          title: "Data Availability Choices: Rollup vs AnyTrust vs Alt-DA",
          introduction:
            "DA determines how and where your transaction data is stored and verified. Choose based on security, cost, and throughput goals.",
          sections: [
            {
              id: "matrix",
              title: "Selection matrix",
              content:
                "Rollup: post data to L1 (max security, higher cost). AnyTrust: DAC attestation (lower cost, different assumptions). Alt-DA: external DA layers (cost/perf trade-offs).",
            },
            {
              id: "code",
              title: "Read-only: DA mode flag (pseudo)",
              content:
                "A conceptual snippet to illustrate how a config might carry a DA selection flag.",
              codeExample:
                "type DAConfig = { mode: 'Rollup' | 'AnyTrust' | 'AltDA'; committee?: string[] }\n" +
                "function describeDA(c: DAConfig){\n" +
                "  if(c.mode==='Rollup') return 'Posts data to L1';\n" +
                "  if(c.mode==='AnyTrust') return 'DAC attestation, lower cost';\n" +
                "  return 'External DA integration';\n" +
                "}\n",
            },
          ],
          keyTakeaways: [
            "Pick DA based on security and cost needs",
            "Plan for migrations and user communications",
          ],
        } as TheoryContent;
      }
      if (section.id === "orbit-governance-models") {
        return {
          title: "Governance Options for Orbit Chains",
          introduction:
            "Start centralized for safety, then progressively decentralize with councils, timelocks, and token voting.",
          sections: [
            {
              id: "stages",
              title: "Progressive decentralization",
              content:
                "Phase 0: Multisig admins. Phase 1: Council + timelock. Phase 2: Token voting (quorum, thresholds).",
            },
            {
              id: "code",
              title: "Read-only: timelock policy (pseudo)",
              content:
                "Sketch a policy object that could parameterize governance actions with delays.",
              codeExample:
                "type TimelockPolicy = { minDelayHours:number; roles: Record<string,string[]> }\n" +
                "const policy: TimelockPolicy = { minDelayHours: 48, roles: { proposer: ['council'], executor: ['multisig'] } }\n" +
                "function canExecute(role:string){ return policy.roles.executor.includes(role) }\n",
            },
          ],
          keyTakeaways: [
            "Use timelocks and clear roles to reduce risk",
            "Publish RFCs and post-mortems for transparency",
          ],
        } as TheoryContent;
      }
      if (section.id === "rollup-vs-anytrust") {
        return {
          title: "Rollup vs AnyTrust",
          introduction:
            "Rollup uses L1 DA for maximum security; AnyTrust uses a DAC for lower costs—pick per use case.",
          sections: [
            {
              id: "tradeoffs",
              title: "Trade-offs",
              content:
                "Rollup: highest DA security, higher cost. AnyTrust: DAC attestation lowers cost, different assumptions. Alt-DA integrations expand choices.",
            },
            {
              id: "template",
              title: "Read-only: fee data",
              content: "Inspect fee data as a quick proxy for cost profile.",
              codeExample:
                "import { ethers } from 'ethers';\n" +
                "export async function feeInfo(rpc:string){\n" +
                "  const p=new ethers.JsonRpcProvider(rpc);\n" +
                "  const f=await p.getFeeData();\n" +
                "  return { base: f.gasPrice?.toString(), maxFee: f.maxFeePerGas?.toString() };\n" +
                "}\n",
            },
          ],
          keyTakeaways: [
            "Rollup maximizes security with L1 DA",
            "AnyTrust reduces costs via DAC attestations",
          ],
        } as TheoryContent;
      }
      if (section.id === "orbit-sdk-overview") {
        return {
          title: "Orbit SDK Overview (Conceptual)",
          introduction:
            "Understand the deployment flow conceptually—no execution required: prepare config → prepare params → create chain.",
          sections: [
            {
              id: "flow",
              title: "High-level flow",
              content:
                "1) Prepare chain config (chainId, owner). 2) Build deployment params. 3) Submit rollup creation. In practice use official guides and testnets first.",
            },
            {
              id: "template",
              title: "Read-only: config shape (pseudo)",
              content: "Sketch of types you’ll see when preparing parameters.",
              codeExample:
                "type ChainConfig = { chainId:number; owner:string; dac?:boolean };\n" +
                "type DeployParams = { config: ChainConfig; batchPoster:string; validators:string[] };\n" +
                "function validate(params:DeployParams){ if(!params.config.owner) throw new Error('owner'); }\n",
            },
          ],
          keyTakeaways: [
            "Orbit SDK structures deployment into clear phases",
            "Practice on testnets with read-only exploration first",
          ],
          additionalResources: [
            {
              title: "Arbitrum docs: introduction",
              url: "https://docs.arbitrum.io/launch-arbitrum-chain/a-gentle-introduction",
              type: "documentation",
            },
          ],
        } as TheoryContent;
      }
    }

    const codeBySection: { [key: string]: string } = {
      // 4) Setting up MetaMask & Connecting to Arbitrum
      "setup-wallet": `// MetaMask connection + Arbitrum network switch (read-only)
import { ethers } from 'ethers';

declare global { interface Window { ethereum?: any } }

export async function connectWalletAndSwitch() {
  if (!window.ethereum) throw new Error('Wallet not found');

  // Request accounts (prompts user)
  await window.ethereum.request({ method: 'eth_requestAccounts' });

  // Try switch to Arbitrum One (42161)
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xa4b1' }], // 42161
    });
  } catch (_) {
    // If not present, add network
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0xa4b1',
        chainName: 'Arbitrum One',
        rpcUrls: ['https://arb1.arbitrum.io/rpc'],
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        blockExplorerUrls: ['https://arbiscan.io/']
      }],
    });
  }

  // Provider for reads
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  return { address };
}`,

      // 5) Bridging Assets to Arbitrum (conceptual approve + deposit shape)
      "bridge-assets": `// Conceptual approve + deposit flow (read-only template)
import { ethers } from 'ethers';

const erc20Abi = [
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)'
];

const bridgeAbi = [
  'function depositERC20(address l1Token, address to, uint256 amount)'
];

async function depositToL2(token, bridge, amount) {
  // 1) Ensure allowance
  const allowance = await token.allowance(USER, bridge.address);
  if (allowance.lt(amount)) {
    // In practice this is a tx; here we just show the sequence
    await token.approve(bridge.address, amount);
  }
  // 2) Deposit call
  await bridge.depositERC20(token.address, USER, amount);
  // On optimistic rollups, credit appears on L2 after finalization
}`,

      // 6) Basic Smart Contract Interaction
      "smart-contract-interaction": `// Read (call) vs Write (transaction) pattern
import { ethers } from 'ethers';

const abi = [
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)'
];

async function readBalance(provider, tokenAddr, user) {
  const token = new ethers.Contract(tokenAddr, abi, provider);
  const bal = await token.balanceOf(user);
  return bal.toString();
}

async function sendToken(signer, tokenAddr, to, amount) {
  const token = new ethers.Contract(tokenAddr, abi, signer);
  const tx = await token.transfer(to, amount); // write → tx
  await tx.wait();
}`,

      // 7) Token Transfer Code Examples
      "send-tokens-example": `// ERC-20 transferFrom pattern used by DEXes and vaults
import { ethers } from 'ethers';

const abi = [
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)'
];

async function delegatedTransfer(signer, tokenAddr, spender, to, amount) {
  const token = new ethers.Contract(tokenAddr, abi, signer);
  const owner = await signer.getAddress();

  const current = await token.allowance(owner, spender);
  if (current.lt(amount)) {
    await (await token.approve(spender, amount)).wait();
  }
  // Later, spender calls transferFrom(owner, to, amount)
}`,
    };

    const defaultCode = `// Read-only template: basic ERC-20 interaction on Arbitrum\nimport { ethers } from 'ethers';\n\nconst provider = new ethers.providers.JsonRpcProvider('https://arb1.arbitrum.io/rpc');\nconst erc20Abi = [\n  'function name() view returns (string)',\n  'function symbol() view returns (string)',\n  'function decimals() view returns (uint8)',\n  'function balanceOf(address) view returns (uint256)'\n];\n\nasync function readTokenBasics(tokenAddress, user) {\n  const token = new ethers.Contract(tokenAddress, erc20Abi, provider);\n  const [name, symbol, decimals, balance] = await Promise.all([\n    token.name(), token.symbol(), token.decimals(), token.balanceOf(user)\n  ]);\n  return { name, symbol, decimals, balance: balance.toString() };\n}`;

    const chosenCode = codeBySection[section.id] || defaultCode;
    return {
      title: safeTitle,
      introduction:
        `Learn the core ideas behind ${safeTitle} on Arbitrum with a quick overview, a real-world analogy, and a simple read-only code template.`,
      sections: [
        {
          id: "overview",
          title: `${safeTitle}: What and Why`,
          content:
            `This topic explains how this concept shows up in day-to-day DeFi use. You'll understand its purpose, the actors involved (user, wallet, contracts, and protocols), and how Arbitrum's low fees and high throughput make the experience smoother for beginners.`,
        },
        {
          id: "analogy",
          title: "Real‑World Analogy",
          content:
            `Think of it like a digital bank transfer with guardrails. Your wallet is your identity card, the smart contract is the bank counter that follows strict rules, and the blockchain is the public ledger that records every movement transparently.`,
        },
        {
          id: "code-template",
          title: "Code Template (Read‑Only)",
          content:
            `Here is a simple template that mirrors how many DeFi interactions look in practice. It's not for running—just to help you read and recognize the flow.`,
          codeExample: chosenCode,
        },
      ],
      keyTakeaways: [
        `You can read contract state with a provider and an ABI`,
        `Arbitrum improves UX with lower fees and faster confirmations`,
        `Most DeFi flows follow a simple pattern: read → approve (if needed) → interact`,
      ],
    } as TheoryContent;
  };

  const content = theoryContent || getFallbackContent();

  const renderTypeBadge = (type: string) => {
    const base = "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border";
    switch (type) {
      case "code-walkthrough":
        return <span className={`${base} border-blue-500 bg-blue-900/30 text-blue-200`}>Code Walkthrough</span>;
      case "hands-on":
        return <span className={`${base} border-emerald-500 bg-emerald-900/30 text-emerald-200`}>Hands‑On</span>;
      case "quiz":
        return <span className={`${base} border-amber-500 bg-amber-900/30 text-amber-200`}>Quiz</span>;
      case "challenge":
        return <span className={`${base} border-pink-500 bg-pink-900/30 text-pink-200`}>Challenge</span>;
      case "theory":
      default:
        return <span className={`${base} border-blue-500 bg-blue-900/30 text-blue-200`}>Theory</span>;
    }
  };

  const renderTheoryContent = (content: TheoryContent, displayType?: string) => {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Content Header */}
        <div className="mb-8">
          <div className="mb-3">{renderTypeBadge(displayType || "theory")}</div>
          <h2 className="text-3xl font-bold text-white mb-4">
            {content.title}
          </h2>
          <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-xl p-6 border border-blue-700">
            <p className="text-lg text-blue-200 leading-relaxed">
              {content.introduction}
            </p>
          </div>
        </div>

        {/* Theory Sections Navigation */}
        {content.sections.length > 1 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {content.sections.map((subsection, index) => (
                <button
                  key={subsection.id}
                  onClick={() => setCurrentSubSection(index)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${currentSubSection === index
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                >
                  {index + 1}. {subsection.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Current Theory Section */}
        <motion.div
          key={currentSubSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
              <h3 className="text-2xl font-bold mb-2">
                {content.sections[Math.min(currentSubSection, Math.max(0, content.sections.length - 1))].title}
              </h3>
            </div>

            <div className="p-8">
              <div className="prose prose-lg prose-invert max-w-none">
                <div className="text-gray-300 whitespace-pre-line leading-relaxed text-base">
                  {content.sections[Math.min(currentSubSection, Math.max(0, content.sections.length - 1))].content}
                </div>
              </div>

              {/* Code Example */}
              {content.sections[Math.min(currentSubSection, Math.max(0, content.sections.length - 1))].codeExample && (
                <div className="mt-8">
                  <h4 className="text-white font-medium mb-4">
                    Code Example
                  </h4>
                  <CodeBlock className="language-javascript">
                    {content.sections[Math.min(currentSubSection, Math.max(0, content.sections.length - 1))].codeExample || ''}
                  </CodeBlock>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Navigation between sections */}
        {content.sections.length > 1 && (
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() =>
                setCurrentSubSection(Math.max(0, currentSubSection - 1))
              }
              disabled={currentSubSection === 0}
              className={`hover:cursor-pointer px-6 py-3 rounded-lg font-medium transition-all duration-200 ${currentSubSection === 0
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gray-600 hover:bg-gray-700 text-white"
                }`}
            >
              ← Previous
            </button>

            <span className="text-sm text-gray-400">
              {currentSubSection + 1} of {content.sections.length}
            </span>

            <button
              onClick={() =>
                setCurrentSubSection(
                  Math.min(content.sections.length - 1, currentSubSection + 1)
                )
              }
              disabled={currentSubSection === content.sections.length - 1}
              className={`hover:cursor-pointer px-6 py-3 rounded-lg font-medium transition-all duration-200 ${currentSubSection === content.sections.length - 1
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gray-600 hover:bg-gray-700 text-white"
                }`}
            >
              Next →
            </button>
          </div>
        )}

        {/* Key Takeaways */}
        <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-xl p-6 mb-8 border border-green-700">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🎯</span>
            <h4 className="text-xl font-bold text-green-100">
              Key Takeaways
            </h4>
          </div>
          <ul className="space-y-2">
            {content.keyTakeaways.map((takeaway, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-green-200"
              >
                <span className="text-green-400 mt-1">
                  ✓
                </span>
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Additional Resources */}
        {content.additionalResources &&
          content.additionalResources.length > 0 && (
            <div className="bg-blue-900/20 rounded-xl p-6 mb-8 border border-blue-700">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📚</span>
                <h4 className="text-xl font-bold text-blue-100">
                  Additional Resources
                </h4>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {content.additionalResources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-blue-700 hover:border-blue-500 transition-colors duration-200"
                  >
                    <span className="text-xl">
                      {resource.type === "tool"
                        ? "🛠️"
                        : resource.type === "documentation"
                          ? "📖"
                          : resource.type === "video"
                            ? "🎥"
                            : "📄"}
                    </span>
                    <div>
                      <div className="font-medium text-white">
                        {resource.title}
                      </div>
                      <div className="text-sm text-gray-400 capitalize">
                        {resource.type}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
      </div>
    );
  };

  const renderHandsOnContent = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-green-900/20 border border-green-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🔧</span>
          <h3 className="text-xl font-bold text-green-100">
            Hands-On Practice
          </h3>
        </div>
        <div className="mb-4">{renderTypeBadge("hands-on")}</div>
        <div className="text-green-200">
          <p className="mb-4">
            This hands-on section will guide you through practical
            implementation and real-world usage.
          </p>
          <p>
            Interactive tutorials and step-by-step guides are being developed to
            provide you with practical experience using the concepts you've
            learned.
          </p>
        </div>
      </div>
    </div>
  );

  const renderCodeWalkthroughContent = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-blue-900/20 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">💻</span>
          <h3 className="text-xl font-bold text-blue-100">
            Code Walkthrough
          </h3>
        </div>
        <div className="mb-4">{renderTypeBadge("code-walkthrough")}</div>
        <div className="text-blue-200 mb-6">
          <p>
            Detailed code walkthroughs with interactive examples are being
            developed to help you understand the technical implementation.
          </p>
        </div>

        {/* Interactive code example for demonstration */}
        <div>
          <h4 className="text-white font-medium mb-4">
            Code Walkthrough Example
          </h4>
          <p className="text-gray-300 text-sm mb-4">
            Example demonstrating how to interact with DeFi protocols using ethers.js
          </p>
          <CodeBlock className="language-javascript">
            {`// Example DeFi interaction
import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider('https://arb1.arbitrum.io/rpc');

async function interactWithProtocol() {
  // Connect to protocol contract
  const contract = new ethers.Contract(
    contractAddress,
    contractABI,
    wallet
  );
  
  // Execute transaction
  const tx = await contract.someFunction(parameters);
  await tx.wait();
  
  console.log('Transaction completed:', tx.hash);
}`}
          </CodeBlock>
        </div>
      </div>
    </div>
  );

  return (
    <GitHubAuthHandler
      onAuthComplete={() => {
        if (!completed) {
          handleComplete();
        }
      }}
      onAuthError={(error) => {
        console.error("GitHub authentication error:", error);
      }}
    >
      {({ isAuthenticating, hasGithub, triggerAuth }) => {
        const handleMarkAsCompleteClick = () => {
          if (completed) return;

          if (hasGithub) {
            handleComplete();
            return;
          }

          triggerAuth();
        };

        const renderCompletionButtonContent = () => {
          if (completed) {
            return (
              <span className="flex items-center gap-2">
                <span>✓</span>
                Section Completed!
              </span>
            );
          }

          if (isAuthenticating) {
            return (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Connecting GitHub...</span>
              </span>
            );
          }

          return (
            <span className="flex items-center gap-2">
              <span>📝</span>
              Mark as Complete
            </span>
          );
        };

        // If section has direct content with story and questions, render it
        if (hasDirectContent && section.content && section.content.story) {
          return (
            <div className="w-full">
              {/* Story + Quiz Content (if there are questions) */}
              {section.content.questions && section.content.questions.length > 0 && (
                <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                  <div className="w-full max-w-4xl mx-auto px-4">
                    <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                      <div className="mb-3">{renderTypeBadge(section.type)}</div>
                      {/* Story Content */}
                      <div className="prose prose-lg max-w-none prose-invert mb-8">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => (
                              <h1 className="text-3xl font-bold text-white mb-6 border-b border-gray-600 pb-2">{children}</h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-2xl font-semibold text-emerald-300 mb-4 mt-8">{children}</h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-xl font-semibold text-teal-300 mb-3 mt-6">{children}</h3>
                            ),
                            p: ({ children }) => (
                              <p className="text-gray-200 text-base leading-7 mb-4">{children}</p>
                            ),
                            strong: ({ children }) => <strong className="text-emerald-300 font-semibold">{children}</strong>,
                            em: ({ children }) => <em className="text-teal-300 italic">{children}</em>,
                            ul: ({ children }) => (
                              <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300 ml-4">{children}</ul>
                            ),
                            li: ({ children }) => <li className="text-gray-200 leading-6 mb-1">{children}</li>,
                            code: ({ node, className, children, ...props }: any) => {
                              const codeString = String(children).replace(/\n$/, '');
                              const isInline = !className;
                              return <CodeBlock className={className} inline={isInline}>{codeString}</CodeBlock>;
                            },
                            pre: ({ children }) => <>{children}</>
                          }}
                        >
                          {section.content.story}
                        </ReactMarkdown>
                      </div>

                      {/* Question */}
                      <div className="bg-slate-700 rounded-xl p-6 border border-slate-600">
                        <h3 className="text-lg font-semibold text-white mb-4">
                          {section.content.questions[0].question}
                        </h3>
                        <div className="space-y-3 mb-6">
                          {section.content.questions[0].options.map((option: string, index: number) => {
                            const correctIndex = section.content!.questions![0].correctAnswer;
                            const isSelected = inlineSelectedIndex === index;
                            const isCorrect = inlineAnswered && index === correctIndex;
                            const isWrongSelected = inlineAnswered && isSelected && index !== correctIndex;

                            return (
                              <button
                                key={index}
                                onClick={() => {
                                  if (inlineAnswered) return;
                                  setInlineSelectedIndex(index);
                                  setInlineAnswered(true);
                                  // Mark complete shortly after showing feedback
                                  setTimeout(() => handleComplete(), 1200);
                                }}
                                disabled={inlineAnswered}
                                className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${inlineAnswered
                                  ? isCorrect
                                    ? "border-green-500 bg-green-900/20 text-green-300"
                                    : isWrongSelected
                                      ? "border-red-500 bg-red-900/20 text-red-300"
                                      : "border-slate-600 bg-slate-700 text-gray-400"
                                  : "border-slate-500 hover:border-emerald-500 hover:bg-slate-600 text-gray-200 hover:text-white"
                                  }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${inlineAnswered
                                      ? isCorrect
                                        ? "border-green-500 bg-green-500 text-white"
                                        : isWrongSelected
                                          ? "border-red-500 bg-red-500 text-white"
                                          : "border-gray-600"
                                      : "border-gray-600"
                                      }`}
                                  >
                                    {inlineAnswered && isCorrect && "✓"}
                                    {inlineAnswered && isWrongSelected && "✗"}
                                    {!inlineAnswered && String.fromCharCode(65 + index)}
                                  </div>
                                  <span className="flex-1">{option}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        {inlineAnswered && (
                          <div
                            className={`p-4 rounded-lg ${inlineSelectedIndex === section.content!.questions![0].correctAnswer
                              ? "bg-green-900/20 border border-green-700"
                              : "bg-orange-900/20 border border-orange-700"
                              }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xl">
                                {inlineSelectedIndex === section.content!.questions![0].correctAnswer ? "🎉" : "💡"}
                              </span>
                              <span
                                className={`font-bold ${inlineSelectedIndex === section.content!.questions![0].correctAnswer
                                  ? "text-green-300"
                                  : "text-orange-300"
                                  }`}
                              >
                                {inlineSelectedIndex === section.content!.questions![0].correctAnswer
                                  ? "Correct!"
                                  : "Not quite right"}
                              </span>
                            </div>
                            {section.content!.questions![0].explanation && (
                              <p
                                className={`text-sm ${inlineSelectedIndex === section.content!.questions![0].correctAnswer
                                  ? "text-green-400"
                                  : "text-orange-400"
                                  }`}
                              >
                                {section.content!.questions![0].explanation}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Story-only Content (no questions) */}
              {(!section.content.questions || section.content.questions.length === 0) && (
                <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                  <div className="w-full max-w-4xl mx-auto px-4">
                    <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                      <div className="mb-3">{renderTypeBadge(section.type)}</div>
                      <div className="prose prose-lg max-w-none prose-invert">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => (
                              <h1 className="text-3xl font-bold text-white mb-6 border-b border-gray-600 pb-2">{children}</h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-2xl font-semibold text-emerald-300 mb-4 mt-8">{children}</h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-xl font-semibold text-teal-300 mb-3 mt-6">{children}</h3>
                            ),
                            p: ({ children }) => (
                              <p className="text-gray-200 text-base leading-7 mb-4">{children}</p>
                            ),
                            strong: ({ children }) => <strong className="text-emerald-300 font-semibold">{children}</strong>,
                            em: ({ children }) => <em className="text-teal-300 italic">{children}</em>,
                            ul: ({ children }) => (
                              <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300 ml-4">{children}</ul>
                            ),
                            li: ({ children }) => <li className="text-gray-200 leading-6 mb-1">{children}</li>,
                            code: ({ node, className, children, ...props }: any) => {
                              const codeString = String(children).replace(/\n$/, '');
                              const isInline = !className;
                              return <CodeBlock className={className} inline={isInline}>{codeString}</CodeBlock>;
                            },
                            pre: ({ children }) => <>{children}</>
                          }}
                        >
                          {section.content.story}
                        </ReactMarkdown>
                      </div>

                      {/* Completion Button */}
                      <div className="mt-8 pt-6 border-t border-gray-600">
                        <div className="flex justify-center">
                          <motion.button
                            onClick={handleMarkAsCompleteClick}
                            disabled={completed || isAuthenticating}
                            className={`px-8 py-4 rounded-lg font-medium transition-all duration-200 ${completed
                              ? "bg-green-600 text-white cursor-default"
                              : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl"
                              }`}
                            whileHover={!completed && !isAuthenticating ? { scale: 1.05 } : {}}
                            whileTap={!completed && !isAuthenticating ? { scale: 0.95 } : {}}
                          >
                            {renderCompletionButtonContent()}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        }

        return (
          <div className="max-w-6xl mx-auto">
            {/* Content based on section type */}
            {section.type === "theory" && renderTheoryContent(content)}

            {section.type === "hands-on" && renderHandsOnContent()}

            {section.type === "code-walkthrough" && renderCodeWalkthroughContent()}

            {/* Default content for other types: show structured theory fallback */}
            {!["theory", "code-walkthrough", "hands-on"].includes(section.type) &&
              renderTheoryContent(content)}

            {/* Completion Button */}
            <div className="mt-12 pt-8 border-t border-slate-600">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-300">
                  Estimated time: {section.estimatedTime}
                </div>

                <motion.button
                  onClick={handleMarkAsCompleteClick}
                  disabled={completed || isAuthenticating}
                  className={`px-8 py-4 rounded-lg font-medium transition-all duration-200 ${completed
                    ? "bg-green-600 text-white cursor-default"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                    }`}
                  whileHover={!completed && !isAuthenticating ? { scale: 1.05 } : {}}
                  whileTap={!completed && !isAuthenticating ? { scale: 0.95 } : {}}
                >
                  {renderCompletionButtonContent()}
                </motion.button>
              </div>
            </div>
          </div>
        );
      }}
    </GitHubAuthHandler>
  );
}
