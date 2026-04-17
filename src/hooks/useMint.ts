import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useSwitchChain,
  usePublicClient,
} from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../utils/contracts";
import toast from "react-hot-toast";
import { XCAN_ABI, XCAN_CONTRACT_ADDRESS } from "@/utils/mintContract";

// Level to NFT image mapping (IPFS gateway URLs)
const LEVEL_NFT_IMAGES = {
  "first-blood":
    "https://gateway.pinata.cloud/ipfs/QmNruJWZFoSBg6n3B5F3ZKHTGMVpiWEj5eTr5ckvWjFvvV",
  "web3-basics":
    "https://gateway.pinata.cloud/ipfs/QmerZ3D4gLKkJDrEZDPShqmXThftcuQb2NULMgBG8BkfTh",
  "stylus-core-concepts":
    "https://gateway.pinata.cloud/ipfs/QmPDvY2NSKrge7MaRsreRAWrYTQzwmE7YR5EETzzqfgyjh",
  "zkp-basics":
    "https://gateway.pinata.cloud/ipfs/QmeGdBuzGsWuvMQXUmZNNr59Xx7JSsUrzCsZeARkW6RYET",
  "zkp-advanced":
    "https://gateway.pinata.cloud/ipfs/QmTQTKYMMdRRaseerqTZdms1fufxyEF4ugfRHU7F7BzfDf",
  "agentic-defi":
    "https://gateway.pinata.cloud/ipfs/QmWPxhyLgQuKHy2mYJT19qj1tAK9RwjiXseyhYxXTqiYez",
  "agentic-wallets":
    "https://gateway.pinata.cloud/ipfs/QmWwHgxJki2bAvp7rffu4btP7xK77UTz1BJrxprmyG5a1V",
  "farcaster-miniapps":
    "https://gateway.pinata.cloud/ipfs/QmWqTMTGwHayDrxUngtr5xrgoCVd56sJdhRASY7wAJAzeN",
};

// Level to metadata IPFS hash mapping
const LEVEL_METADATA_HASHES = {
  "first-blood": "QmP4qxFaQzW8cvWVSwzBAJUYA1TyF9xHVPsy7WYYKap2AC",
  "web3-basics": "QmV8NzexZhbqexqocJgiNBzxV5998mrj9mgGTP2sMWpnnm",
  "stylus-core-concepts": "QmUWNFmQP7V4J2f53HgkHamLEGMA5X8pf5Gkcb5d34Bsev",
  "zkp-basics": "QmSQDsc4fXh2se73UftjVGcWX2ynf3YRw54BGLgTyksh71",
  "zkp-advanced": "Qmf6mU31WonnqUy9YWCsHvcKTAv8vwR16pw1wWyLosAci6",
  "agentic-defi": "QmR5ZhpFZEwkDZ8Usgfcatf4r6R18Lu3fHdSdjhijfr1iR",
  "agentic-wallets": "QmPS6B6GJU6PFee2eoS3zbV2BBL8kzDUHprMz1LLv4dPB1",
  "farcaster-miniapps": "QmbHfr4GsSvxFs1C97QwknU4f1zfVRyUBomGonK9Gsnz4b",
};

// Static per-module certification config. The image is fixed per module;
// the metadata JSON is regenerated on every mint so each NFT gets a unique
// tokenURI (containing issuer wallet + issue timestamp).
type ModuleCertificationConfig = {
  imageIpfsHash: string;
  name: string;
  description: string;
  achievement: string;
  module: string;
  // displayName: string;
};

const MODULE_CERTIFICATION_CONFIG: Record<string, ModuleCertificationConfig> = {
  "web3-basics": {
    imageIpfsHash: "Qma3fkPP63yLiDqH8kCYrmeQi1YGb6acLLaWBbshWmZKSV",
    name: "Xcan: Web3 and Rust Foundations Challenge",
    description:
      "This NFT certifies that the holder has successfully completed the Web3 Basics Challenge on Xcan — a Web3 learning platform by LamprosDAO. Awarded on Arbitrum Sepolia.",
    achievement: "Web3 and Rust Foundations Challenge",
    module: "Web3 and Rust Foundations",
    // displayName: "Web3 & Rust Foundations",
  },
  "stylus-core-concepts": {
    imageIpfsHash: "QmfLEYdtfmxYAwkyaKadFYVEtM1SzCjZEPmqS1C5GNj6Mv",
    name: "Xcan: Stylus Core Concepts Challenge",
    description:
      "This NFT certifies that the holder has successfully completed the Stylus Core Concepts Challenge on Xcan — a Web3 learning platform by LamprosDAO. Awarded on Arbitrum Sepolia.",
    achievement: "Stylus Core Concepts Challenge",
    module: "Stylus Core Concepts",
    // displayName: "Stylus Core Concepts",
  },
  "stylus-foundation": {
    imageIpfsHash: "QmbedGP4Q8gekzotQSqvxPJewWWmsjvWMANM7HjT3SrRyG",
    name: "Xcan: Stylus Foundation Challenge",
    description:
      "This NFT certifies that the holder has successfully completed the Stylus Foundation Challenge on Xcan — a Web3 learning platform by LamprosDAO. Awarded on Arbitrum Sepolia.",
    achievement: "Stylus Foundation Challenge",
    module: "Stylus Foundation",
    // displayName: "Arbitrum Foundation Challenge",
  },
  "arbitrum-orbit": {
    imageIpfsHash: "QmSdDCzy6SYnJpasZbkUiJnCNDeaBBvhuXi6ChexRBTAXs",
    name: "Xcan: Master Arbitrum Orbit Challenge",
    description:
      "This NFT certifies that the holder has successfully completed the Master Arbitrum Orbit Challenge on Xcan — a Web3 learning platform by LamprosDAO. Awarded on Arbitrum Sepolia.",
    achievement: "Master Arbitrum Orbit Challenge",
    module: "Arbitrum Orbit",
    // displayName: "Arbitrum Orbit",
  },
  "defi-arbitrum": {
    imageIpfsHash: "Qma1NZeueDiTgNwuDfc1jQ8LTAsKbxDiemsD6nM5JLUYGf",
    name: "Xcan: Master DeFi on Arbitrum Challenge",
    description:
      "This NFT certifies that the holder has successfully completed the Master DeFi on Arbitrum Challenge on Xcan — a Web3 learning platform by LamprosDAO. Awarded on Arbitrum Sepolia.",
    achievement: "Master DeFi on Arbitrum Challenge",
    module: "DeFi on Arbitrum",
    // displayName: "DeFi on Arbitrum",
  },
  "cross-chain": {
    imageIpfsHash: "QmQiWADBEejFQkJdkA3ApMNgkWYFTQHwAKN57AwCPtw4v2",
    name: "Xcan: Master Cross-Chain Development Challenge",
    description:
      "This NFT certifies that the holder has successfully completed the Master Cross-Chain Development Challenge on Xcan — a Web3 learning platform by LamprosDAO. Awarded on Arbitrum Sepolia.",
    achievement: "Master Cross-Chain Development Challenge",
    module: "Cross-Chain Development",
    // displayName: "Cross-Chain Development",
  },
  "precompiles-overview": {
    imageIpfsHash: "QmWrmaMvm5KE5ZMX4w8QjY6fQoHN3YadhSKn6GSQnbR1vu",
    name: "Xcan: Precompile Playground Challenge",
    description:
      "This NFT certifies that the holder has successfully completed the Precompile Playground Challenge on Xcan — a Web3 learning platform by LamprosDAO. Awarded on Arbitrum Sepolia.",
    achievement: "Precompile Playground Challenge",
    module: "Precompile Playground",
    // displayName: "Precompile Playground",
  },
  "eigen-ai": {
    imageIpfsHash: "QmSiFGneJFZwsmMQez3eTaEQPpSZNpA1jDeQvDx4QUdCrX",
    name: "Xcan: Secure AI with Eigen Challenge",
    description:
      "This NFT certifies that the holder has successfully completed the Secure AI with Eigen Challenge on Xcan — a Web3 learning platform by LamprosDAO. Awarded on Arbitrum Sepolia.",
    achievement: "Secure AI with Eigen Challenge",
    module: "Secure AI with Eigen",
    // displayName: "Secure AI with Eigen",
  },
  "xcan-advocate": {
    imageIpfsHash: "QmQyf8Zde7aGPw1FjEeQrtaWy2ZTSmGiv1fApCq9j4BaB5",
    name: "Xcan: Xcan Advocate",
    description:
      "This NFT certifies that the holder has been recognized as an Xcan Advocate on Xcan — a Web3 learning platform by LamprosDAO. Awarded on Arbitrum Sepolia.",
    achievement: "Xcan Advocate",
    module: "Xcan Advocate",
    // displayName: "Xcan Advocate",
  },
};

// Build a fresh metadata JSON for a certification mint. The wallet address
// and issue timestamp make every minted NFT's tokenURI unique.
const buildCertificationMetadata = (
  config: ModuleCertificationConfig,
  userAddress: string
) => ({
  name: config.name,
  description: config.description,
  image: `ipfs://${config.imageIpfsHash}`,
  external_url: "https://www.xcan.dev/",
  attributes: [
    { trait_type: "Achievement", value: config.achievement },
    { trait_type: "Platform", value: "Xcan" },
    { trait_type: "Issuer", value: "LamprosDAO" },
    { trait_type: "Module", value: config.module },
    { trait_type: "Network", value: "Arbitrum Sepolia" },
    {
      trait_type: "Credential Type",
      value: "Course Completion Certificate",
    },
    { trait_type: "Issued To", value: userAddress },
    {
      display_type: "date",
      trait_type: "Issue Date",
      value: Math.floor(Date.now() / 1000),
    },
  ],
});

export const useMint = () => {
  const { address, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const [isMinting, setIsMinting] = useState(false);
  const [isCertificationMinting, setIsCertificationMinting] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [mintedNFT, setMintedNFT] = useState<{
    transactionHash: string;
    metadataUrl: string;
    imageUrl: string;
    levelName?: string;
    level?: number;
    levelKey?: string;
  } | null>(null);

  const { writeContractAsync } = useWriteContract();
  const { isSuccess: isMined } = useWaitForTransactionReceipt({ hash: txHash });
  const publicClient = usePublicClient();

  const get10xGasFees = async () => {
    try {
      const fees = await publicClient?.estimateFeesPerGas();
      if (!fees) return {};
      return {
        maxFeePerGas: fees.maxFeePerGas ? fees.maxFeePerGas * BigInt(15) : undefined,
        maxPriorityFeePerGas: fees.maxPriorityFeePerGas
          ? fees.maxPriorityFeePerGas * BigInt(15)
          : undefined,
      };
    } catch {
      return {};
    }
  };

  const uploadFileToPinata = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const pinataMetadata = JSON.stringify({
      name: file.name,
    });
    formData.append("pinataMetadata", pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", pinataOptions);

    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Pinata upload failed: ${response.statusText}`);
    }

    return await response.json();
  };

  // Upload JSON to Pinata using REST API
  const uploadJSONToPinata = async (
    jsonData: any,
    pinName: string = "Speedrun Stylus NFT Metadata"
  ) => {
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
        body: JSON.stringify({
          pinataContent: jsonData,
          pinataMetadata: {
            name: pinName,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Pinata JSON upload failed: ${response.statusText}`);
    }

    return await response.json();
  };

  // Upload image to IPFS using Pinata
  const uploadImageToIPFS = async () => {
    try {
      // Fetch the GIF from the public folder
      // const response = await fetch("/speedrun-stylus-nft.png");
      const response = await fetch("/FirstBlood.png");
      if (!response.ok) {
        throw new Error("Failed to fetch GIF");
      }
      const blob = await response.blob();

      // Create a File object for Pinata upload
      // const imageFile = new File([blob], "speedrun-stylus-nft.png", {
      const imageFile = new File([blob], "FirstBlood.png", {
        type: blob.type,
      });

      const imageResult = await uploadFileToPinata(imageFile);

      console.log("Image uploaded to Pinata:", imageResult);

      // Return ipfs:// URL for metadata and https:// for display
      return {
        ipfsUrl: `ipfs://${imageResult.IpfsHash}`,
        gatewayUrl: `https://gateway.pinata.cloud/ipfs/${imageResult.IpfsHash}`,
      };
    } catch (err) {
      console.error("Error uploading image to IPFS:", err);
      throw err;
    }
  };

  // Upload metadata to IPFS using Pinata
  const uploadMetadataToIPFS = async (imageIpfsUrl: string) => {
    try {
      const metadata = {
        name: "Speedrun Stylus: First Blood Challenge",
        description:
          "Awarded for completing the First Challenge on Speedrun Stylus",
        image: imageIpfsUrl, // Use ipfs:// URL in metadata
        attributes: [
          {
            trait_type: "Achievement",
            value: "First Challenge",
          },
          {
            trait_type: "Platform",
            value: "Speedrun Stylus",
          },
          {
            trait_type: "Module",
            value: "Arbitrum Stylus on Xcan",
          },
          {
            trait_type: "Network",
            value: "Arbitrum Sepolia",
          },
        ],
      };

      const metadataResult = await uploadJSONToPinata(metadata);

      console.log("Metadata uploaded to Pinata:", metadataResult);

      // Return both ipfs:// URL for contract and https:// for display
      return {
        ipfsUrl: `ipfs://${metadataResult.IpfsHash}`,
        gatewayUrl: `https://gateway.pinata.cloud/ipfs/${metadataResult.IpfsHash}`,
      };
    } catch (err) {
      console.error("Error uploading metadata to IPFS:", err);
      throw err;
    }
  };

  // Store minted NFT to MongoDB
  const storeMintedNFT = async (
    transactionHash: string,
    metadataUrl: string,
    imageUrl: string,
    githubUsername?: string,
    levelName?: string,
    level?: number,
    levelKey?: string
  ) => {
    try {
      const response = await fetch("/api/minted-nft/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAddress: address,
          transactionHash,
          metadataUrl,
          imageUrl,
          ...(githubUsername ? { githubUsername } : {}),
          ...(levelName ? { levelName } : {}),
          ...(level !== undefined && level !== null ? { level } : {}),
          ...(levelKey ? { levelKey } : {}),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to store minted NFT");
      }

      return await response.json();
    } catch (error) {
      console.error("Error storing minted NFT:", error);
      throw error;
    }
  };

  const handleMint = async (
    githubUsername?: string,
    levelName?: string,
    level?: number,
    levelKey?: string
  ) => {
    if (!address) {
      toast.error("Please connect your wallet.");
      return;
    }

    if (level === undefined || level === null) {
      toast.error("Level information is required for minting.");
      return;
    }

    if (chainId !== 421614) {
      try {
        await switchChainAsync?.({ chainId: 421614 });
      } catch (switchError: any) {
        console.error("Failed to switch network:", switchError);
        toast.error("Please switch your network to Arbitrum Sepolia to mint.");
        return;
      }
    }

    setIsMinting(true);
    try {
      // Get the appropriate metadata hash for the level
      const metadataHash =
        LEVEL_METADATA_HASHES[levelKey as keyof typeof LEVEL_METADATA_HASHES];
      const imageUrl =
        LEVEL_NFT_IMAGES[levelKey as keyof typeof LEVEL_NFT_IMAGES];

      if (!metadataHash || !imageUrl) {
        throw new Error(`No NFT data found for level ${level}`);
      }

      // const imageResult = await uploadImageToIPFS();
      // if (!imageResult) {
      //   throw new Error("Failed to upload image to IPFS");
      // }
      // console.log("imageIpfsUrl", imageResult.ipfsUrl);
      // console.log("imageGatewayUrl", imageResult.gatewayUrl);

      // // Upload metadata to IPFS (using ipfs:// URL for image in metadata)
      // const metadataResult = await uploadMetadataToIPFS(imageResult.ipfsUrl);
      // if (!metadataResult) {
      //   throw new Error("Failed to upload metadata to IPFS");
      // }
      // console.log("metadataIpfsUrl", metadataResult.ipfsUrl);
      // console.log("metadataGatewayUrl", metadataResult.gatewayUrl);

      const gasFees = await get10xGasFees();

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "safeMint",
        args: [address, `ipfs://${metadataHash}`],
        ...gasFees,
      });

      setTxHash(hash);

      // Store minted NFT data in MongoDB
      await storeMintedNFT(
        hash,
        `https://gateway.pinata.cloud/ipfs/${metadataHash}`,
        imageUrl,
        githubUsername,
        levelName,
        level,
        levelKey
      );

      // Set minted NFT data for display
      setMintedNFT({
        transactionHash: hash,
        metadataUrl: `https://gateway.pinata.cloud/ipfs/${metadataHash}`,
        imageUrl: imageUrl,
        levelName,
        level,
        levelKey,
      });

      toast.success("NFT minted successfully!");
    } catch (err) {
      console.error("Minting failed:", err);
      toast.error("Minting failed. Please try again.");
    } finally {
      setIsMinting(false);
    }
  };

  const certificationMint = async (moduleName: string) => {
    if (!address) {
      toast.error("Please connect your wallet.");
      return;
    }

    if (!moduleName) {
      toast.error("Module information is required for minting.");
      return;
    }

    if (chainId !== 421614) {
      try {
        await switchChainAsync?.({ chainId: 421614 });
      } catch (switchError: any) {
        console.error("Failed to switch network:", switchError);
        toast.error("Please switch your network to Arbitrum Sepolia to mint.");
        return;
      }
    }

    setIsCertificationMinting(true);
    try {
      const config = MODULE_CERTIFICATION_CONFIG[moduleName];
      if (!config) {
        throw new Error(`No certification config found for module ${moduleName}`);
      }

      const imageUrl = `https://gateway.pinata.cloud/ipfs/${config.imageIpfsHash}`;

      // Build a unique metadata JSON for this mint (embeds wallet + timestamp)
      // and upload it to IPFS. The image IPFS hash stays static per module.
      const metadata = buildCertificationMetadata(config, address);
      const metadataResult = await uploadJSONToPinata(
        metadata,
        `Xcan Certification - ${config.module} - ${address}`
      );
      const metadataIpfsHash: string = metadataResult.IpfsHash;
      if (!metadataIpfsHash) {
        throw new Error("Failed to upload certification metadata to IPFS");
      }

      const gasFees = await get10xGasFees();

      const hash = await writeContractAsync({
        address: XCAN_CONTRACT_ADDRESS,
        abi: XCAN_ABI,
        functionName: "mintSelf",
        args: [`ipfs://${metadataIpfsHash}`],
        ...gasFees,
      });

      setTxHash(hash);

      const minted = {
        transactionHash: hash,
        metadataUrl: `https://gateway.pinata.cloud/ipfs/${metadataIpfsHash}`,
        imageUrl,
        name: config.module,
      };

      toast.success("NFT minted successfully!");
      return minted;
    } catch (err) {
      console.error("Minting failed:", err);
      toast.error("Minting failed. Please try again.");
      throw err;
    } finally {
      setIsCertificationMinting(false);
    }
  };

  return {
    handleMint,
    certificationMint,
    isMinting,
    isCertificationMinting,
    isMined,
    mintedNFT,
  };
};
