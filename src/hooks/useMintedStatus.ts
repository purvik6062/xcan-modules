import { useState, useEffect } from "react";

interface MintedLevel {
  level: number;
  levelKey?: string;
  levelName: string;
  tokenId?: number;
  transactionHash: string;
  metadataUrl: string;
  imageUrl: string;
  mintedAt: Date;
  network: string;
}

export const useMintedStatus = (userAddress: string | null, level?: number) => {
  const [mintedData, setMintedData] = useState<{
    hasMinted: boolean;
    nft: MintedLevel | null;
    nfts: MintedLevel[];
    totalMinted: number;
    isLoading: boolean;
    error: string | null;
  }>({
    hasMinted: false,
    nft: null,
    nfts: [],
    totalMinted: 0,
    isLoading: false,
    error: null,
  });

  const checkMintedStatus = async () => {
    if (!userAddress) {
      setMintedData((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    setMintedData((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const url = level
        ? `/api/minted-nft/check?address=${userAddress}&level=${level}`
        : `/api/minted-nft/check?address=${userAddress}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to check minted status");
      }

      setMintedData({
        hasMinted: data.hasMinted,
        nft: data.nft || null,
        nfts: data.nfts || [],
        totalMinted: data.totalMinted || 0,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error checking minted status:", error);
      setMintedData((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }));
    }
  };

  useEffect(() => {
    checkMintedStatus();
  }, [userAddress, level]);

  return {
    ...mintedData,
    refetch: checkMintedStatus,
  };
};
