export interface MintedNFT {
  //   _id?: string;
  userAddress: string;
  mintedLevels: {
    level: number;
    levelName: string;
    tokenId?: number;
    transactionHash: string;
    metadataUrl: string;
    imageUrl: string;
    mintedAt: Date;
    network: string;
  }[];
  githubUsername?: string;
  totalMinted: number;
  lastMintedAt: Date;
}