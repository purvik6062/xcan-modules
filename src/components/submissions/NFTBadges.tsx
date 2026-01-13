import React from "react";

interface NFTBadge {
  transactionHash: string;
  levelName?: string;
  level?: number;
  mintedAt?: Date;
}

interface NFTBadgesProps {
  nfts: NFTBadge[];
  className?: string;
}

export function NFTBadges({ nfts, className = "" }: NFTBadgesProps) {
  if (!nfts || nfts.length === 0) {
    return <span className="text-gray-500 text-sm">No NFTs claimed</span>;
  }

  const getTransactionUrl = (txHash: string) => {
    return `https://sepolia.arbiscan.io/tx/${txHash}`;
  };

  const shortenHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {nfts.map((nft, index) => (
        <a
          key={nft.transactionHash}
          href={getTransactionUrl(nft.transactionHash)}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 hover:from-emerald-500/30 hover:to-blue-500/30 border border-emerald-500/30 rounded-lg text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-all duration-200 transform hover:scale-105"
          title={`NFT ${nft.level || index + 1}: ${nft.levelName || 'Arbitrum Stylus'} - Click to view on Arbiscan`}
        >
          {/* NFT Icon */}
          <svg
            className="w-3 h-3 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          
          {/* Level badge */}
          <span className="font-bold">
            {/* {nft.level ? `L${nft.level}` : `#${index + 1}`} */}
            L{nft.level}
          </span>
          
          {/* External link icon */}
          <svg
            className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>

          {/* Tooltip with full hash */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
            {shortenHash(nft.transactionHash)}
          </div>
        </a>
      ))}
      
      {/* {nfts.length > 1 && (
        <div className="flex items-center text-xs text-gray-400 ml-1">
          <span className="px-2 py-1 bg-gray-700/50 rounded">
            {nfts.length} NFTs
          </span>
        </div>
      )} */}
    </div>
  );
}