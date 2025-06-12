import { Challenge } from "../types/challenge";

// Mocked challenge data with Stylus Core Concepts challenges
export const challengesData: Record<string, Challenge> = {
  "l1-fee-calculation": {
    id: 1,
    title: "L1 Fee Calculation",
    level: "Beginner",
    description:
      "Calculate L1 fee for a transaction using current base fee per gas",
    category: "Gas",
    points: 10,
    precompileUsed: "ArbGasInfo",
    instructions: `
        # L1 Fee Calculation Challenge
        
        In this challenge, you need to retrieve L1 gas pricing information from the ArbGasInfo precompile and calculate the transaction fee.
        
        ## Task
        
        Create a function called \`calculateL1Fee\` that:
        1. Connects to the ArbGasInfo precompile on Arbitrum Sepolia
        2. Retrieves current gas prices information
        3. Returns the L1 data cost component
        
        ## Example
        
        \`\`\`js
        // This should return the current L1 data fee in wei
        calculateL1Fee() 
        \`\`\`
        
        ## Notes
        
        - Use the ethers.js library which is already imported for you
        - The ArbGasInfo precompile is located at: 0x000000000000000000000000000000000000006c
        - Use the 'getPricesInWei()' function to get gas price information
        - Remember that getPricesInWei() returns multiple values, you need to extract the L1 data cost
      `,
    testCases: [
      {
        input: [],
        expectedOutput: { type: "bigint" }, // We'll check if the result is a BigInt
        description: "Should return the L1 data cost as a BigInt",
      },
    ],
    startingCode: `import { ethers } from 'ethers';
  
  async function calculateL1Fee() {
    // Write your code here
    // 1. Connect to the Arbitrum Sepolia provider
    // 2. Create a contract instance for ArbGasInfo
    // 3. Call getPricesInWei() and return the L1 data cost 
    
  }
  
calculateL1Fee();`,
    solution: `import { ethers } from 'ethers';
  
  async function calculateL1Fee() {
    // Connect to Arbitrum Sepolia
    const provider = new ethers.JsonRpcProvider("https://sepolia-rollup.arbitrum.io/rpc");
    
    // ArbGasInfo precompile address
    const arbGasInfoAddress = "0x000000000000000000000000000000000000006c";
    
    // Define ABI for ArbGasInfo
    const arbGasInfoAbi = [
      "function getPricesInWei() view returns (uint256, uint256, uint256, uint256, uint256, uint256)"
    ];
    
    // Create contract instance
    const arbGasInfo = new ethers.Contract(arbGasInfoAddress, arbGasInfoAbi, provider);
    
    // Get prices - index 1 is the L1 data cost
    const prices = await arbGasInfo.getPricesInWei();
    
    // Return the L1 data cost component
    return prices[1];
  }
  
calculateL1Fee();`,
    hints: [
      'First, create a provider that connects to Arbitrum Sepolia network using `new ethers.JsonRpcProvider("https://sepolia-rollup.arbitrum.io/rpc")`.',
      "The ArbGasInfo precompile is at address 0x000000000000000000000000000000000000006c. You'll need to create a contract instance to interact with it.",
      "To call the contract, you need to define the correct ABI. The `getPricesInWei()` function returns 6 values, all of type uint256.",
      "When you call `getPricesInWei()`, it returns an array of values. The L1 data cost is at index 1 (the second item in the array).",
      "Make sure your function actually returns the value. Just calling the function without returning won't work in the tests.",
    ],
  },
  "block-number-check": {
    id: 2,
    title: "Block Number Check",
    level: "Beginner",
    description: "Retrieve the current Arbitrum block number",
    category: "System",
    points: 15,
    precompileUsed: "ArbSys",
    instructions: `
        # Block Number Check Challenge
        
        In this challenge, you'll learn how to access Arbitrum's current block number using the ArbSys precompile.
        
        ## Task
        
        Create a function called \`getCurrentBlockNumber\` that:
        1. Connects to the ArbSys precompile on Arbitrum Sepolia
        2. Calls the appropriate method to get the current Arbitrum block number
        3. Returns the block number
        
        ## Example
        
        \`\`\`js
        // This should return the current Arbitrum block number
        getCurrentBlockNumber() 
        \`\`\`
        
        ## Notes
        
        - Use the ethers.js library which is already imported for you
        - The ArbSys precompile is located at: 0x0000000000000000000000000000000000000064
        - Unlike Ethereum's eth_blockNumber JSON-RPC call, Arbitrum has its own block number function
      `,
    testCases: [
      {
        input: [],
        expectedOutput: { type: "bigint" }, // We'll check if the result is a BigInt
        description:
          "Should return the current Arbitrum block number as a BigInt",
      },
    ],
    startingCode: `import { ethers } from 'ethers';
  
  async function getCurrentBlockNumber() {
    // Write your code here
    // 1. Connect to the Arbitrum Sepolia provider
    // 2. Create a contract instance for ArbSys
    // 3. Call the appropriate method to get the Arbitrum block number
    
  }
  
getCurrentBlockNumber();`,
    solution: `import { ethers } from 'ethers';
  
  async function getCurrentBlockNumber() {
    // Connect to Arbitrum Sepolia
    const provider = new ethers.JsonRpcProvider("https://sepolia-rollup.arbitrum.io/rpc");
    
    // ArbSys precompile address
    const arbSysAddress = "0x0000000000000000000000000000000000000064";
    
    // Define ABI for ArbSys
    const arbSysAbi = [
      "function arbBlockNumber() view returns (uint256)"
    ];
    
    // Create contract instance
    const arbSys = new ethers.Contract(arbSysAddress, arbSysAbi, provider);
    
    // Call arbBlockNumber to get the current Arbitrum block number
    const blockNumber = await arbSys.arbBlockNumber();
    
    return blockNumber;
  }
  
getCurrentBlockNumber();`,
  },
  "chain-id-verification": {
    id: 3,
    title: "Chain ID Verification",
    level: "Beginner",
    description: "Verify the Chain ID of Arbitrum Sepolia",
    category: "System",
    points: 15,
    precompileUsed: "ArbSys",
    instructions: `
        # Chain ID Verification Challenge
        
        In this challenge, you'll retrieve the Arbitrum Sepolia chain ID using the ArbSys precompile.
        
        ## Task
        
        Create a function called \`getChainId\` that:
        1. Connects to the ArbSys precompile on Arbitrum Sepolia
        2. Calls the appropriate method to get the chain ID
        3. Returns the chain ID
        
        ## Example
        
        \`\`\`js
        // This should return Arbitrum Sepolia's chain ID
        getChainId() 
        \`\`\`
        
        ## Notes
        
        - Use the ethers.js library which is already imported for you
        - The ArbSys precompile is located at: 0x0000000000000000000000000000000000000064
        - While you could use provider.getChainId(), for this challenge please use the ArbSys precompile method
      `,
    testCases: [
      {
        input: [],
        expectedOutput: { value: BigInt(421614) }, // Arbitrum Sepolia chain ID
        description: "Should return the Arbitrum Sepolia chain ID (421614)",
      },
    ],
    startingCode: `import { ethers } from 'ethers';
  
  async function getChainId() {
    // Write your code here
    // 1. Connect to the Arbitrum Sepolia provider
    // 2. Create a contract instance for ArbSys
    // 3. Call the appropriate method to get the chain ID
    
  }
  
getChainId();`,
    solution: `import { ethers } from 'ethers';
  
  async function getChainId() {
    // Connect to Arbitrum Sepolia
    const provider = new ethers.JsonRpcProvider("https://sepolia-rollup.arbitrum.io/rpc");
    
    // ArbSys precompile address
    const arbSysAddress = "0x0000000000000000000000000000000000000064";
    
    // Define ABI for ArbSys
    const arbSysAbi = [
      "function arbChainID() view returns (uint256)"
    ];
    
    // Create contract instance
    const arbSys = new ethers.Contract(arbSysAddress, arbSysAbi, provider);
    
    // Call arbChainID to get the chain ID
    const chainId = await arbSys.arbChainID();
    
    return chainId;
  }
  
getChainId();`,
  },
  "gas-price-components": {
    id: 4,
    title: "Gas Price Components",
    level: "Intermediate",
    description: "Break down the components of gas pricing on Arbitrum",
    category: "Gas",
    points: 25,
    precompileUsed: "ArbGasInfo",
    instructions: `
        # Gas Price Components Challenge
        
        In this challenge, you'll analyze the different components that make up the gas price on Arbitrum.
        
        ## Task
        
        Create a function called \`getGasPriceComponents\` that:
        1. Connects to the ArbGasInfo precompile on Arbitrum Sepolia
        2. Retrieves the gas price components
        3. Returns an object containing:
           - l2TransactionFee: The L2 transaction cost in wei
           - l1DataFee: The L1 data cost in wei
           - storageFee: The L2 storage cost in wei
           - totalFee: The sum of all fees
        
        ## Example
        
        \`\`\`js
        // This should return an object with the gas price components
        getGasPriceComponents() 
        \`\`\`
        
        ## Notes
        
        - Use the ethers.js library which is already imported for you
        - The ArbGasInfo precompile is located at: 0x000000000000000000000000000000000000006c
        - Use the 'getPricesInWei()' function to get gas price information
        - The result should be an object with BigInt values
      `,
    testCases: [
      {
        input: [],
        expectedOutput: {
          type: "object",
          hasProperties: [
            "l2TransactionFee",
            "l1DataFee",
            "storageFee",
            "totalFee",
          ],
        },
        description: "Should return an object with gas price components",
      },
    ],
    startingCode: `import { ethers } from 'ethers';
  
  async function getGasPriceComponents() {
    // Write your code here
    // 1. Connect to the Arbitrum Sepolia provider
    // 2. Create a contract instance for ArbGasInfo
    // 3. Call getPricesInWei() and format the result as required
    
  }
  
getGasPriceComponents();`,
    solution: `import { ethers } from 'ethers';
  
  async function getGasPriceComponents() {
    // Connect to Arbitrum Sepolia
    const provider = new ethers.JsonRpcProvider("https://sepolia-rollup.arbitrum.io/rpc");
    
    // ArbGasInfo precompile address
    const arbGasInfoAddress = "0x000000000000000000000000000000000000006c";
    
    // Define ABI for ArbGasInfo
    const arbGasInfoAbi = [
      "function getPricesInWei() view returns (uint256, uint256, uint256, uint256, uint256, uint256)"
    ];
    
    // Create contract instance
    const arbGasInfo = new ethers.Contract(arbGasInfoAddress, arbGasInfoAbi, provider);
    
    // Get gas price components
    const prices = await arbGasInfo.getPricesInWei();
    
    // Format the result as required
    return {
      l2TransactionFee: prices[0],
      l1DataFee: prices[1],
      storageFee: prices[2],
      totalFee: prices[0] + prices[1] + prices[2]
    };
  }
  
getGasPriceComponents();`,
  },
  "arbos-version": {
    id: 5,
    title: "ArbOS Version",
    level: "Intermediate",
    description: "Get the current ArbOS version running on Arbitrum Sepolia",
    category: "System",
    points: 25,
    precompileUsed: "ArbSys",
    instructions: `
        # ArbOS Version Challenge
        
        In this challenge, you'll access the version of ArbOS running on Arbitrum Sepolia.
        
        ## Task
        
        Create a function called \`getArbOSVersion\` that:
        1. Connects to the ArbSys precompile on Arbitrum Sepolia
        2. Calls the appropriate method to get the ArbOS version
        3. Returns the version as a BigInt
        
        ## Example
        
        \`\`\`js
        // This should return the current ArbOS version
        getArbOSVersion() 
        \`\`\`
        
        ## Notes
        
        - Use the ethers.js library which is already imported for you
        - The ArbSys precompile is located at: 0x0000000000000000000000000000000000000064
        - Arbitrum provides a specific method to check the ArbOS version
      `,
    testCases: [
      {
        input: [],
        expectedOutput: { type: "bigint" },
        description: "Should return the ArbOS version as a BigInt",
      },
    ],
    startingCode: `import { ethers } from 'ethers';
  
  async function getArbOSVersion() {
    // Write your code here
    // 1. Connect to the Arbitrum Sepolia provider
    // 2. Create a contract instance for ArbSys
    // 3. Call the appropriate method to get the ArbOS version
    
  }
  
getArbOSVersion();`,
    solution: `import { ethers } from 'ethers';
  
  async function getArbOSVersion() {
    // Connect to Arbitrum Sepolia
    const provider = new ethers.JsonRpcProvider("https://sepolia-rollup.arbitrum.io/rpc");
    
    // ArbSys precompile address
    const arbSysAddress = "0x0000000000000000000000000000000000000064";
    
    // Define ABI for ArbSys
    const arbSysAbi = [
      "function arbOSVersion() view returns (uint256)"
    ];
    
    // Create contract instance
    const arbSys = new ethers.Contract(arbSysAddress, arbSysAbi, provider);
    
    // Call arbOSVersion to get the current ArbOS version
    const version = await arbSys.arbOSVersion();
    
    return version;
  }
  
getArbOSVersion();`,
  },
  "l2-to-l1-message": {
    id: 7,
    title: "L2-to-L1 Message Sending",
    level: "Intermediate",
    description: "Send a message from L2 to L1 using ArbSys",
    category: "Messaging",
    points: 30,
    precompileUsed: "ArbSys",
    instructions: `
        # L2-to-L1 Message Sending Challenge
        
        In this challenge, you'll learn how to send a message from Arbitrum (L2) to Ethereum (L1) using ArbSys.
        
        ## Task
        
        Create a function called \`sendL2ToL1Message\` that:
        1. Connects to the ArbSys precompile on Arbitrum Sepolia
        2. Takes a message string as input
        3. Converts the string to bytes
        4. Sends the message to L1 using the appropriate ArbSys method
        5. Returns the transaction receipt
        
        ## Example
        
        \`\`\`js
        // This should send a message to L1 and return the receipt
        await sendL2ToL1Message("Hello from Arbitrum!") 
        \`\`\`
        
        ## Notes
        
        - Use the ethers.js library which is already imported for you
        - The ArbSys precompile is located at: 0x0000000000000000000000000000000000000064
        - For this exercise, you'll need to use a wallet with funds on Arbitrum Sepolia
        - The target L1 address can be any valid Ethereum address
      `,
    testCases: [
      {
        input: ["Hello from Arbitrum!"],
        expectedOutput: { type: "object" }, // We'll check if it's an object
        description: "Should return a transaction receipt object",
      },
    ],
    startingCode: `import { ethers } from 'ethers';
  
  async function sendL2ToL1Message(message) {
    // Write your code here
    // 1. Connect to the Arbitrum Sepolia provider with a private key
    // 2. Create a contract instance for ArbSys with a signer
    // 3. Convert message string to bytes
    // 4. Send the message to L1 and return the receipt
    
    // For demo purposes, you can use this private key (DO NOT USE IN PRODUCTION)
    const privateKey = "0xYourPrivateKey"; // Replace with a test private key
    
  }
  
sendL2ToL1Message();`,
    solution: `import { ethers } from 'ethers';
  
  async function sendL2ToL1Message(message) {
    // Connect to Arbitrum Sepolia
    const provider = new ethers.JsonRpcProvider("https://sepolia-rollup.arbitrum.io/rpc");
    
    // For demo purposes only (DO NOT USE IN PRODUCTION)
    const privateKey = "0xYourPrivateKey"; // Replace with a test private key
    const wallet = new ethers.Wallet(privateKey, provider);
    
    // ArbSys precompile address
    const arbSysAddress = "0x0000000000000000000000000000000000000064";
    
    // Define ABI for ArbSys
    const arbSysAbi = [
      "function sendTxToL1(address destAddr, bytes calldata calldataForL1) payable returns (uint256)"
    ];
    
    // Create contract instance with signer
    const arbSys = new ethers.Contract(arbSysAddress, arbSysAbi, wallet);
    
    // Target address on L1 (can be any address)
    const targetL1Address = "0xYourTargetL1Address"; // Replace with L1 destination
    
    // Convert message to bytes
    const messageBytes = ethers.toUtf8Bytes(message);
    
    // Send transaction to L1
    const tx = await arbSys.sendTxToL1(targetL1Address, messageBytes);
    
    // Wait for transaction to be confirmed
    const receipt = await tx.wait();
    
    return receipt;
  }
  
sendL2ToL1Message();`,
  },
};

// Create a list of challenge previews for the listing page
export const challengePreviews = Object.entries(challengesData).map(
  ([slug, challenge]) => ({
    id: challenge.id,
    title: challenge.title,
    level: challenge.level,
    description: challenge.description,
    slug,
    category: challenge.category,
    points: challenge.points,
    precompileUsed: challenge.precompileUsed,
  })
);
