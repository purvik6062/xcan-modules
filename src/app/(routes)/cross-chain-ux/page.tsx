import BridgeSimulator from "@/components/cross-chain/BridgeSimulator";
import BridgeComparator from "@/components/cross-chain/BridgeComparator";
import Link from "next/link";

export default function CrossChainUxPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Page Header */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 border-b border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/learn-cross-chain" className="hover:text-blue-400 transition-colors">
              Cross-Chain Learning
            </Link>
            <span>→</span>
            <span className="text-gray-300">Bridge Simulator</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Cross-Chain Bridge Simulator
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl">
            Visualize and understand how tokens move between Ethereum and Arbitrum
            using different bridge architectures. Explore token transfer mechanisms,
            validation layers, and compare real bridge protocols.
          </p>
        </div>
      </div>

      {/* Simulator Components */}
      <BridgeSimulator />
      <BridgeComparator />
    </div>
  );
}