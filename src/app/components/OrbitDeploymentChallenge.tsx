"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface OrbitDeploymentChallengeProps {
  onComplete: () => void;
}

export default function OrbitDeploymentChallenge({
  onComplete,
}: OrbitDeploymentChallengeProps) {
  const [step, setStep] = useState(1);
  const [deploymentResult, setDeploymentResult] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState(false);

  const deploymentCode = `import { createPublicClient, http } from 'viem';
import { prepareChainConfig, createRollupPrepareDeploymentParamsConfig, createRollup } from '@arbitrum/orbit-sdk';
import { privateKeyToAccount } from 'viem/accounts';
import dotenv from 'dotenv';
import { arbitrumSepolia } from 'viem/chains';

dotenv.config({ path: '../.env' });

// Validate required environment variables
const requiredEnvVars = [
    'DEPLOYER_PRIVATE_KEY',
    'BATCH_POSTER_ADDRESS', 
    'VALIDATOR_ADDRESS'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
        console.error(\`  - \${varName}\`);
    });
    console.error('\\n💡 Please create a .env file in the project root with the required variables.');
    process.exit(1);
}

async function deployRollup() {
    const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY;
    const parentChain = arbitrumSepolia;
    const BATCH_POSTER = process.env.BATCH_POSTER_ADDRESS;
    const VALIDATOR = process.env.VALIDATOR_ADDRESS;

    console.log('🔍 Debugging addresses:');
    console.log('  BATCH_POSTER:', BATCH_POSTER);
    console.log('  VALIDATOR:', VALIDATOR);
    
    // Step 1: Prepare Chain Configuration
    const chainConfig = prepareChainConfig({
        chainId: 123456,
        arbitrum: {
            InitialChainOwner: "0xBc0435FB4f37345a420fbD09e5700f3A72fd0534",
            DataAvailabilityCommittee: false, // Rollup chain
        }
    });

    const deployer = privateKeyToAccount(deployerPrivateKey);

    const parentChainPublicClient = createPublicClient({
        chain: parentChain,
        transport: http(),
    });

    console.log('⚙️ Preparing rollup configuration...');

    // Step 2: Prepare Deployment Parameters
    const createRollupConfig = await createRollupPrepareDeploymentParamsConfig(parentChainPublicClient, {
        chainId: 123456,
        owner: "0xBc0435FB4f37345a420fbD09e5700f3A72fd0534",
        chainConfig: chainConfig
    });

    console.log('🚀 Creating rollup...');

    // Step 3: Deploy the Rollup
    const createRollupResults = await createRollup({
        params: {
            config: createRollupConfig,
            batchPoster: BATCH_POSTER,
            validators: [VALIDATOR],
            maxDataSize: 104857, // Default max data size for Orbit chains
            deployFactoriesToL2: true, // Deploy factories via retryable tickets
        }, 
        account: deployer,
        parentChainPublicClient
    });

    console.log('✅ Rollup created successfully!');
    console.log('Transaction Hash:', createRollupResults.transactionReceipt.transactionHash);
    console.log('Core Contracts:', createRollupResults.coreContracts);
    
    return createRollupResults;
}

// Export for use
export default deployRollup;`;

  const envTemplate = `# Environment Variables for Orbit Chain Deployment
# Copy this file to .env and fill in your values

# Private key of the account that will deploy the chain (with sufficient ETH)
DEPLOYER_PRIVATE_KEY=0x... # Your private key here

# Address that will post batches to L2 (can be same as deployer for testing)
BATCH_POSTER_ADDRESS=0x... # Your batch poster address

# Address that will validate the chain (can be same as deployer for testing)  
VALIDATOR_ADDRESS=0x... # Your validator address`;

  const handleStepComplete = (stepNumber: number) => {
    if (stepNumber === step) {
      setStep(step + 1);
      if (stepNumber === 4) {
        setIsCompleted(true);
        onComplete();
      }
    }
  };

  const steps = [
    {
      title: "Environment Setup",
      description: "Set up your environment variables and install dependencies",
      content: (
        <div className="space-y-4">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold mb-2">
              Required Environment Variables:
            </h4>
            <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
              {envTemplate}
            </pre>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              📝 Instructions:
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700 dark:text-blue-300">
              <li>Create a new project folder for your Orbit deployment</li>
              <li>
                Run{" "}
                <code className="bg-blue-200 dark:bg-blue-800 px-1 rounded">
                  npm init -y
                </code>
              </li>
              <li>
                Install dependencies:{" "}
                <code className="bg-blue-200 dark:bg-blue-800 px-1 rounded">
                  npm install @arbitrum/orbit-sdk viem dotenv
                </code>
              </li>
              <li>
                Create a{" "}
                <code className="bg-blue-200 dark:bg-blue-800 px-1 rounded">
                  .env
                </code>{" "}
                file with the variables above
              </li>
              <li>
                Make sure your deployer account has ETH on Arbitrum Sepolia
              </li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      title: "Chain Configuration",
      description: "Understand the chain configuration parameters",
      content: (
        <div className="space-y-4">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
              🔧 Configuration Parameters:
            </h4>
            <ul className="space-y-2 text-sm text-emerald-700 dark:text-emerald-300">
              <li>
                <strong>chainId:</strong> 123456 - Unique identifier for your
                chain
              </li>
              <li>
                <strong>InitialChainOwner:</strong> Address that will own and
                govern the chain
              </li>
              <li>
                <strong>DataAvailabilityCommittee:</strong> false - Deploy as
                Rollup (full data on L1)
              </li>
              <li>
                <strong>batchPoster:</strong> Address responsible for posting
                transaction batches
              </li>
              <li>
                <strong>validators:</strong> Addresses that can validate chain
                state
              </li>
            </ul>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              ⚠️ Important Notes:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
              <li>Choose a unique chainId not used by other networks</li>
              <li>
                The deployer must have sufficient ETH for deployment costs
              </li>
              <li>
                Batch poster and validator can be the same address for testing
              </li>
              <li>
                Keep your private keys secure and never commit them to version
                control
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Deploy the Chain",
      description: "Execute the deployment script to create your Orbit chain",
      content: (
        <div className="space-y-4">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Deployment Script:</h4>
            <pre className="text-xs overflow-x-auto whitespace-pre-wrap max-h-96">
              {deploymentCode}
            </pre>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
              🚀 Deployment Steps:
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-purple-700 dark:text-purple-300">
              <li>
                Create a new file{" "}
                <code className="bg-purple-200 dark:bg-purple-800 px-1 rounded">
                  deploy.js
                </code>
              </li>
              <li>Copy the deployment script into the file</li>
              <li>
                Run{" "}
                <code className="bg-purple-200 dark:bg-purple-800 px-1 rounded">
                  node deploy.js
                </code>
              </li>
              <li>
                Wait for the deployment to complete (this may take several
                minutes)
              </li>
              <li>
                Save the transaction hash and contract addresses from the output
              </li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      title: "Verify Deployment",
      description: "Confirm your chain is deployed and accessible",
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              ✅ Verification Checklist:
            </h4>
            <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Deployment transaction was successful</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Core contracts addresses were returned</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Chain ID matches your configuration (123456)</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>
                  Batch poster and validator addresses are set correctly
                </span>
              </li>
            </ul>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              📋 Record Your Deployment:
            </h4>
            <textarea
              value={deploymentResult}
              onChange={(e) => setDeploymentResult(e.target.value)}
              placeholder="Paste your deployment transaction hash and contract addresses here..."
              className="w-full h-24 p-3 border rounded-lg resize-none"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          🚀 Deploy Your First Orbit Chain
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Follow this step-by-step guide to deploy your own Arbitrum Orbit chain
          to Arbitrum Sepolia.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                index + 1 <= step
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500"
              }`}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  index + 1 < step
                    ? "bg-emerald-600"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Current Step */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8"
      >
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Step {step}: {steps[step - 1].title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {steps[step - 1].description}
          </p>
        </div>

        {steps[step - 1].content}

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              step === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            }`}
          >
            ← Previous
          </button>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Step {step} of {steps.length}
          </div>

          <button
            onClick={() => handleStepComplete(step)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-all duration-200"
          >
            {step === steps.length ? "Complete Challenge" : "Next →"}
          </button>
        </div>
      </motion.div>

      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white text-center"
        >
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
          <p>
            You've successfully deployed your first Arbitrum Orbit chain! You
            now have your own Layer 3 blockchain running on Arbitrum Sepolia.
          </p>
        </motion.div>
      )}
    </div>
  );
}
