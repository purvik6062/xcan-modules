"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Section } from "../data/defiChapters";
import { getTheoryContent, TheoryContent } from "../data/defiContent";
import CodeEditor from "./CodeEditor";

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

  const handleComplete = () => {
    setCompleted(true);
    onComplete();
  };

  // Get comprehensive theory content
  const theoryContent = getTheoryContent(chapterId, section.id);

  // Fallback content for sections without comprehensive content
  const getFallbackContent = () => {
    const safeTitle = section.title || "DeFi Concept";
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

  const renderTheoryContent = (content: TheoryContent) => {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Content Header */}
        <div className="mb-8">
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
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <h3 className="text-2xl font-bold mb-2">
                {content.sections[currentSubSection].title}
              </h3>
            </div>

            <div className="p-8">
              <div className="prose prose-lg prose-invert max-w-none">
                <div className="text-gray-300 whitespace-pre-line leading-relaxed text-base">
                  {content.sections[currentSubSection].content}
                </div>
              </div>

              {/* Code Example */}
              {content.sections[currentSubSection].codeExample && (
                <div className="mt-8">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-4">
                      Code Example
                    </h4>
                    <div className="h-64">
                      <CodeEditor
                        defaultValue={
                          content.sections[currentSubSection].codeExample
                        }
                        language="javascript"
                        readOnly={true}
                        height="100%"
                      />
                    </div>
                  </div>
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
            <div className="bg-purple-900/20 rounded-xl p-6 mb-8 border border-purple-700">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📚</span>
                <h4 className="text-xl font-bold text-purple-100">
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
                    className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-purple-700 hover:border-purple-500 transition-colors duration-200"
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
      <div className="bg-purple-900/20 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">💻</span>
          <h3 className="text-xl font-bold text-purple-100">
            Code Walkthrough
          </h3>
        </div>
        <div className="text-purple-200 mb-6">
          <p>
            Detailed code walkthroughs with interactive examples are being
            developed to help you understand the technical implementation.
          </p>
        </div>

        {/* Interactive code example for demonstration */}
        <div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-white font-medium mb-4">
              Interactive Code Walkthrough
            </h4>
            <p className="text-gray-300 text-sm mb-4">
              Example demonstrating how to interact with DeFi protocols using
              ethers.js
            </p>
            <div className="h-80">
              <CodeEditor
                defaultValue={`// Example DeFi interaction
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
                language="javascript"
                readOnly={true}
                height="100%"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
            onClick={handleComplete}
            disabled={completed}
            className={`px-8 py-4 rounded-lg font-medium transition-all duration-200 ${completed
              ? "bg-green-600 text-white cursor-default"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
              }`}
            whileHover={!completed ? { scale: 1.05 } : {}}
            whileTap={!completed ? { scale: 0.95 } : {}}
          >
            {completed ? (
              <span className="flex items-center gap-2">
                <span>✓</span>
                Section Complete!
              </span>
            ) : (
              <span className="hover:cursor-pointer flex items-center gap-2">
                <span>📝</span>
                Mark as Complete
              </span>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
