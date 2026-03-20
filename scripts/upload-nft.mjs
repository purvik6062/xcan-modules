#!/usr/bin/env node
// ============================================================================
// Generic NFT Image + Metadata → IPFS Upload Script (via Pinata)
//
// Usage:
//   node scripts/upload-nft.mjs --config <path-to-config.json>
//   node scripts/upload-nft.mjs --image <path> --name <name> --description <desc> [options]
//
// Options (CLI mode):
//   --image         Path to the image file (required)
//   --name          NFT name (required)
//   --description   NFT description (required)
//   --module        Module key for useMint.ts output (e.g. "eigen-ai")
//   --network       Blockchain network (default: "Arbitrum Sepolia")
//   --topics        Comma-separated list of topics
//   --platform      Platform name (default: "Xcan")
//
// Config file mode (--config):
//   Supply a JSON file with the shape shown in nft-configs/example.json
//
// The script reads NEXT_PUBLIC_PINATA_JWT (or PINATA_JWT) from your .env file.
// Output is also saved to upload-output.txt automatically.
// Example:
//   node scripts/upload-nft.mjs --config nft-configs/eigen-ai.json
// ============================================================================

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------
// .env loader (lightweight – no external deps)
// ---------------------------------------------------------------------------
function loadEnv() {
    const envPath = path.join(__dirname, "..", ".env");
    if (!fs.existsSync(envPath)) {
        // Fallback for when running from root or elsewhere
        const rootEnv = path.join(process.cwd(), ".env");
        if (fs.existsSync(rootEnv)) {
            // Load root env
        } else {
            return;
        }
    }
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const raw of lines) {
        const line = raw.trim();
        if (!line || line.startsWith("#")) continue;
        const eqIndex = line.indexOf("=");
        if (eqIndex === -1) continue;
        const key = line.slice(0, eqIndex).trim();
        let value = line.slice(eqIndex + 1).trim();
        // Strip surrounding quotes
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        if (!process.env[key]) process.env[key] = value;
    }
}

loadEnv();

// ---------------------------------------------------------------------------
// Resolve Pinata JWT
// ---------------------------------------------------------------------------
const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT || process.env.PINATA_JWT;
if (!PINATA_JWT) {
    console.error("❌ Missing NEXT_PUBLIC_PINATA_JWT or PINATA_JWT in your .env file.");
    process.exit(1);
}

// ---------------------------------------------------------------------------
// CLI argument parser
// ---------------------------------------------------------------------------
function parseArgs() {
    const args = process.argv.slice(2);
    const parsed = {};

    for (let i = 0; i < args.length; i++) {
        if (args[i].startsWith("--")) {
            const key = args[i].slice(2);
            const next = args[i + 1];
            if (next && !next.startsWith("--")) {
                parsed[key] = next;
                i++;
            } else {
                parsed[key] = true;
            }
        }
    }
    return parsed;
}

// ---------------------------------------------------------------------------
// Build config from CLI args or JSON config file
// ---------------------------------------------------------------------------
function buildConfig() {
    const args = parseArgs();

    // Config-file mode
    if (args.config) {
        const configPath = path.resolve(args.config);
        if (!fs.existsSync(configPath)) {
            console.error(`❌ Config file not found: ${configPath}`);
            process.exit(1);
        }
        const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

        // Resolve relative image path from config file location
        if (config.image && !path.isAbsolute(config.image)) {
            config.image = path.resolve(path.dirname(configPath), config.image);
        }
        return validateConfig(config);
    }

    // CLI mode
    const config = {
        image: args.image ? path.resolve(args.image) : undefined,
        name: args.name,
        description: args.description,
        module: args.module || undefined,
        platform: args.platform || "Xcan",
        network: args.network || "Arbitrum Sepolia",
        topics: args.topics ? args.topics.split(",").map((t) => t.trim()) : undefined,
        extraAttributes: undefined,
    };
    return validateConfig(config);
}

function validateConfig(config) {
    const missing = [];
    if (!config.image) missing.push("--image (or image in config)");
    if (!config.name) missing.push("--name (or name in config)");
    if (!config.description) missing.push("--description (or description in config)");
    if (missing.length) {
        console.error(`❌ Missing required fields: ${missing.join(", ")}`);
        console.error("\nUsage:");
        console.error("  node upload-nft.mjs --config <path-to-config.json>");
        console.error('  node upload-nft.mjs --image <path> --name "My NFT" --description "A description"');
        process.exit(1);
    }
    if (!fs.existsSync(config.image)) {
        console.error(`❌ Image file not found: ${config.image}`);
        process.exit(1);
    }

    // Defaults
    config.platform = config.platform || "Xcan";
    config.network = config.network || "Arbitrum Sepolia";

    return config;
}

// ---------------------------------------------------------------------------
// Detect MIME type from extension
// ---------------------------------------------------------------------------
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeMap = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".webp": "image/webp",
    };
    return mimeMap[ext] || "application/octet-stream";
}

// ---------------------------------------------------------------------------
// Upload image to Pinata/IPFS
// ---------------------------------------------------------------------------
async function uploadImageToPinata(config) {
    const imageName = path.basename(config.image);
    console.log(`📸 Step 1: Uploading ${imageName} to IPFS via Pinata...\n`);

    const imageBuffer = fs.readFileSync(config.image);
    const imageBlob = new Blob([imageBuffer], { type: getMimeType(config.image) });

    const formData = new FormData();
    formData.append("file", imageBlob, imageName);
    formData.append(
        "pinataMetadata",
        JSON.stringify({ name: `${config.name} - NFT Image` })
    );
    formData.append("pinataOptions", JSON.stringify({ cidVersion: 0 }));

    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: { Authorization: `Bearer ${PINATA_JWT}` },
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Image upload failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log("✅ Image uploaded successfully!");
    console.log(`   IPFS Hash: ${result.IpfsHash}`);
    console.log(`   Gateway URL: https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`);
    console.log();
    return result.IpfsHash;
}

// ---------------------------------------------------------------------------
// Build NFT metadata object
// ---------------------------------------------------------------------------
function buildMetadata(config, imageIpfsHash) {
    const attributes = [
        { trait_type: "Achievement", value: "Module Completion" },
        { trait_type: "Platform", value: config.platform },
        { trait_type: "Module", value: config.name },
        { trait_type: "Network", value: config.network },
    ];

    if (config.topics && config.topics.length > 0) {
        attributes.push({ trait_type: "Topics", value: config.topics.join(", ") });
    }

    // Merge any extra attributes from config
    if (Array.isArray(config.extraAttributes)) {
        for (const attr of config.extraAttributes) {
            if (attr.trait_type && attr.value) {
                attributes.push(attr);
            }
        }
    }

    return {
        name: config.name,
        description: config.description,
        image: `ipfs://${imageIpfsHash}`,
        attributes,
    };
}

// ---------------------------------------------------------------------------
// Upload metadata JSON to Pinata/IPFS
// ---------------------------------------------------------------------------
async function uploadMetadataToPinata(config, imageIpfsHash) {
    console.log("📋 Step 2: Uploading NFT metadata to IPFS via Pinata...\n");

    const metadata = buildMetadata(config, imageIpfsHash);

    console.log("Metadata being uploaded:");
    console.log(JSON.stringify(metadata, null, 2));
    console.log();

    const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: JSON.stringify({
            pinataContent: metadata,
            pinataMetadata: { name: `${config.name} - NFT Metadata` },
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Metadata upload failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log("✅ Metadata uploaded successfully!");
    console.log(`   IPFS Hash: ${result.IpfsHash}`);
    console.log(`   Gateway URL: https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`);
    console.log();
    return result.IpfsHash;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
    try {
        const config = buildConfig();

        console.log(`\n🚀 NFT IPFS Upload — ${config.name}\n`);
        console.log("=".repeat(50));

        // Step 1: Upload image
        const imageIpfsHash = await uploadImageToPinata(config);

        // Step 2: Upload metadata
        const metadataIpfsHash = await uploadMetadataToPinata(config, imageIpfsHash);

        // Summary
        console.log("=".repeat(50));
        console.log("🎉 ALL DONE! Here are your values for useMint.ts:\n");

        const moduleKey = config.module || config.name.toLowerCase().replace(/\s+/g, "-");
        const output = [
            `"${moduleKey}": {`,
            `  metadataHash: "${metadataIpfsHash}",`,
            `  imageUrl: "https://gateway.pinata.cloud/ipfs/${imageIpfsHash}",`,
            `  name: "${config.name}",`,
            `},`,
        ];
        output.forEach((l) => console.log(l));

        console.log();
        console.log(`Image IPFS Hash:    ${imageIpfsHash}`);
        console.log(`Metadata IPFS Hash: ${metadataIpfsHash}`);

        // Also write to a file for easy reference
        const resultData = {
            module: moduleKey,
            name: config.name,
            imageIpfsHash,
            metadataIpfsHash,
            imageUrl: `https://gateway.pinata.cloud/ipfs/${imageIpfsHash}`,
            metadataUrl: `https://gateway.pinata.cloud/ipfs/${metadataIpfsHash}`,
            timestamp: new Date().toISOString(),
        };
        const outputPath = path.join(process.cwd(), "upload-output.json");
        fs.writeFileSync(outputPath, JSON.stringify(resultData, null, 2));
        console.log(`\n📄 Results saved to ${outputPath}`);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
}

main();
