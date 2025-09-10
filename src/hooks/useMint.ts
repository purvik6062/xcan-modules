import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../utils/contracts";
import toast from "react-hot-toast";

// Level to NFT image mapping (IPFS gateway URLs)
const LEVEL_NFT_IMAGES = {
  "web3-basics":
    "https://gateway.pinata.cloud/ipfs/QmerZ3D4gLKkJDrEZDPShqmXThftcuQb2NULMgBG8BkfTh",
  "core-stylus":
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
  "web3-basics": "QmV8NzexZhbqexqocJgiNBzxV5998mrj9mgGTP2sMWpnnm",
  "core-stylus": "QmUWNFmQP7V4J2f53HgkHamLEGMA5X8pf5Gkcb5d34Bsev",
  "zkp-basics": "QmSQDsc4fXh2se73UftjVGcWX2ynf3YRw54BGLgTyksh71",
  "zkp-advanced": "Qmf6mU31WonnqUy9YWCsHvcKTAv8vwR16pw1wWyLosAci6",
  "agentic-defi": "QmR5ZhpFZEwkDZ8Usgfcatf4r6R18Lu3fHdSdjhijfr1iR",
  "agentic-wallets": "QmPS6B6GJU6PFee2eoS3zbV2BBL8kzDUHprMz1LLv4dPB1",
  "farcaster-miniapps": "QmbHfr4GsSvxFs1C97QwknU4f1zfVRyUBomGonK9Gsnz4b",
};

const modulesHashes = {
  "web3-basics": {
    metadataHash: "QmdGYhDPfFXhqNT9jx6KucHJZDMk9BNYVffS3yM4Bcw61L",
    imageUrl:
      "https://gateway.pinata.cloud/ipfs/QmcyiBHVJtZwzhiF83iWvDouHqbTN2r3RkP7vkXVRxWwdG",
    name: "Web3 Basics",
  },
  "core-stylus": {
    metadataHash: "Qmb9CirahKamo1bhbfjbSvnvokGoqDTMGxrSnYfssrsR8R",
    imageUrl:
      "https://gateway.pinata.cloud/ipfs/QmfFbkTHYhGw8goQL3eZENcD2Kh6niAV4JHmKjtD9QuKL6",
    name: "Stylus Core Concepts",
  },
};

export const useMint = () => {
  const { address } = useAccount();
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
  const uploadJSONToPinata = async (jsonData: any) => {
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
            name: "Speedrun Stylus NFT Metadata",
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
      const response = await fetch("/images/Web3Basics.png");
      if (!response.ok) {
        throw new Error("Failed to fetch GIF");
      }
      const blob = await response.blob();

      // Create a File object for Pinata upload
      // const imageFile = new File([blob], "speedrun-stylus-nft.png", {
      const imageFile = new File([blob], "Web3Basics.png", {
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
        name: "Xcan Modules: Web3 Basics Challenge",
        description:
          "Awarded for completing the Web3 Basics Challenge on Xcan",
        image: imageIpfsUrl, // Use ipfs:// URL in metadata
        attributes: [
          {
            trait_type: "Achievement",
            value: "Web3 Basics Challenge",
          },
          {
            trait_type: "Platform",
            value: "Xcan",
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
          ...(level ? { level } : {}),
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

    if (!level) {
      toast.error("Level information is required for minting.");
      return;
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

      // Mint NFT using the ipfs:// URL for metadata
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "safeMint",
        args: [address, `ipfs://${metadataHash}`],
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
      toast.error("Level information is required for minting.");
      return;
    }

    setIsCertificationMinting(true);
    try {
      const metadataIpfsHash = modulesHashes[moduleName as keyof typeof modulesHashes].metadataHash;
      const imageUrl = modulesHashes[moduleName as keyof typeof modulesHashes].imageUrl;
      const name = modulesHashes[moduleName as keyof typeof modulesHashes].name;

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

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "safeMint",
        args: [address, `ipfs://${metadataIpfsHash}`],
      });

      setTxHash(hash);

      const minted = {
        transactionHash: hash,
        metadataUrl: `https://gateway.pinata.cloud/ipfs/${metadataIpfsHash}`,
        imageUrl: imageUrl,
        name: name,
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

  return { handleMint, certificationMint, isMinting, isCertificationMinting, isMined, mintedNFT };
};
