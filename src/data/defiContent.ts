// DeFi Theory Content System
// This module provides comprehensive educational content for all theory sections
// in the DeFi learning path, organized by chapter and section ID

export interface TheoryContent {
  title: string;
  introduction: string;
  sections: TheorySection[];
  keyTakeaways: string[];
  additionalResources?: Resource[];
  visualElements?: VisualElement[];
}

export interface TheorySection {
  id: string;
  title: string;
  content: string;
  codeExample?: string;
  diagrams?: string[];
  interactiveElements?: InteractiveElement[];
}

export interface Resource {
  title: string;
  url: string;
  type: "article" | "documentation" | "video" | "tool";
}

export interface VisualElement {
  type: "diagram" | "chart" | "infographic" | "comparison";
  title: string;
  description: string;
  data?: any;
}

export interface InteractiveElement {
  type: "calculator" | "simulator" | "quiz" | "exercise";
  title: string;
  description: string;
  component: string;
}

export const defiTheoryContent: {
  [chapterId: string]: { [sectionId: string]: TheoryContent };
} = {
  "intro-to-defi": {
    "what-is-defi": {
      title: "Understanding Decentralized Finance (DeFi)",
      introduction:
        "Decentralized Finance represents a revolutionary shift from traditional, centralized financial systems to peer-to-peer finance enabled by blockchain technology. Let's explore what makes DeFi transformative.",
      sections: [
        {
          id: "definition",
          title: "What is DeFi?",
          content: `DeFi (Decentralized Finance) refers to a financial ecosystem built on blockchain technology that eliminates the need for traditional financial intermediaries like banks, brokerages, or exchanges.

Key Characteristics:
• Decentralized: No single point of control or failure
• Permissionless: Open to anyone with an internet connection
• Transparent: All transactions are publicly verifiable on the blockchain
• Composable: DeFi protocols can be combined like building blocks
• Global: Accessible 24/7 from anywhere in the world

Unlike traditional finance, DeFi operates through smart contracts - self-executing contracts with terms directly written into code.`,
        },
        {
          id: "traditional-vs-defi",
          title: "Traditional Finance vs DeFi",
          content: `Traditional Finance (TradFi):
• Centralized institutions control access and operations
• Limited operating hours (9 AM - 5 PM, weekdays only)
• Geographical restrictions and compliance requirements
• High fees due to multiple intermediaries
• Slower settlement times (days for international transfers)
• Limited transparency in operations

Decentralized Finance (DeFi):
• No central authority required
• Operates 24/7/365
• Global accessibility
• Lower fees through disintermediation
• Near-instant settlement
• Complete transparency through blockchain`,
        },
        {
          id: "core-principles",
          title: "Core Principles of DeFi",
          content: `1. Self-Custody: Users maintain full control of their assets
2. Transparency: All code and transactions are publicly auditable
3. Interoperability: Different protocols can seamlessly interact
4. Innovation: Rapid development and deployment of new features
5. Financial Inclusion: Banking services for the unbanked
6. Programmable Money: Smart contracts enable complex financial logic`,
        },
      ],
      keyTakeaways: [
        "DeFi eliminates traditional financial intermediaries through blockchain technology",
        "Smart contracts automate financial processes without human intervention",
        "DeFi operates 24/7 globally with complete transparency",
        "Users maintain custody of their assets while accessing financial services",
        "Composability allows building complex financial products from simple building blocks",
      ],
      additionalResources: [
        {
          title: "DeFi Pulse - DeFi Rankings",
          url: "https://defipulse.com/",
          type: "tool",
        },
        {
          title: "Ethereum.org DeFi Guide",
          url: "https://ethereum.org/en/defi/",
          type: "documentation",
        },
      ],
    },
    "centralized-vs-decentralized": {
      title: "Centralized vs Decentralized Finance: A Deep Comparison",
      introduction:
        "Understanding the fundamental differences between centralized and decentralized finance is crucial for grasping the revolutionary potential of DeFi.",
      sections: [
        {
          id: "architecture",
          title: "Architectural Differences",
          content: `Centralized Finance Architecture:
• Client-Server Model: Central servers manage all operations
• Single Points of Failure: If the central system fails, everything stops
• Hierarchical Structure: Multiple layers of management and control
• Closed Source: Proprietary systems with limited transparency

Decentralized Finance Architecture:
• Peer-to-Peer Network: Distributed across thousands of nodes
• Fault Tolerant: System continues operating even if some nodes fail
• Flat Structure: Direct interaction between users and protocols
• Open Source: Code is publicly available and auditable`,
          codeExample: `// Traditional Finance API Call
const bankTransfer = await bankAPI.transfer({
  from: "account123",
  to: "account456", 
  amount: 1000,
  authorization: "bearer_token"
});

// DeFi Smart Contract Interaction
const defiTransfer = await tokenContract.transfer(
  "0x742...d4f", // recipient address
  ethers.utils.parseEther("1000") // amount in wei
);`,
        },
        {
          id: "control",
          title: "Control and Ownership",
          content: `Centralized Control:
• Banks and institutions hold custody of user funds
• Users must trust third parties with their assets
• Account freezing and restrictions are common
• Limited control over transaction fees and timing

Decentralized Control:
• Users maintain full custody through private keys
• No need to trust third parties with assets
• Censorship resistance - transactions cannot be blocked
• Users control gas fees and transaction priority`,
        },
        {
          id: "accessibility",
          title: "Accessibility and Inclusion",
          content: `Traditional Finance Barriers:
• Credit checks and identity verification required
• Minimum balance requirements
• Geographic restrictions (not available in all countries)
• Banking hours and business day limitations
• Complex onboarding processes

DeFi Accessibility:
• No credit checks or minimum requirements
• Only internet connection and crypto wallet needed
• Available globally 24/7
• Instant access to financial services
• Pseudonymous participation possible`,
        },
      ],
      keyTakeaways: [
        "Centralized finance relies on trusted intermediaries, while DeFi operates trustlessly",
        "DeFi provides 24/7 global access without geographic or credit restrictions",
        "Users maintain full control and custody of their assets in DeFi",
        "Decentralized systems are more resilient but require users to be responsible for security",
        "DeFi offers financial inclusion to billions without access to traditional banking",
      ],
    },
    "arbitrum-in-defi": {
      title: "Arbitrum's Role in the DeFi Ecosystem",
      introduction:
        "Arbitrum is a Layer 2 scaling solution that enhances Ethereum's capabilities, making DeFi more accessible and cost-effective. Let's explore how Arbitrum transforms the DeFi experience.",
      sections: [
        {
          id: "scaling-solution",
          title: "Understanding Layer 2 Scaling",
          content: `The Scaling Problem:
Ethereum, while secure and decentralized, faces limitations:
• High gas fees during network congestion
• Limited transaction throughput (~15 TPS)
• Slow confirmation times during peak usage

Layer 2 Solutions:
Layer 2 networks process transactions off-chain while inheriting Ethereum's security:
• Optimistic Rollups (like Arbitrum)
• ZK-Rollups
• State Channels
• Sidechains

Arbitrum's Optimistic Rollup:
• Assumes transactions are valid by default
• Uses fraud proofs to challenge invalid transactions
• Bundles hundreds of transactions into single Ethereum transaction
• Reduces costs by 90%+ while maintaining security`,
        },
        {
          id: "arbitrum-advantages",
          title: "Arbitrum's DeFi Advantages",
          content: `Cost Efficiency:
• Gas fees typically 90-95% lower than Ethereum mainnet
• Makes small transactions economically viable
• Enables micro-transactions and frequent rebalancing

Speed and Throughput:
• Near-instant transaction confirmation
• Higher transaction throughput
• Better user experience for DeFi applications

Ethereum Compatibility:
• Full EVM compatibility - existing contracts work without modification
• Same developer tools and infrastructure
• Seamless user experience with familiar wallets

Security Inheritance:
• Secured by Ethereum's validator network
• No additional trust assumptions required
• Maintains decentralization principles`,
          codeExample: `// Same contract works on both Ethereum and Arbitrum
pragma solidity ^0.8.0;

contract DeFiProtocol {
    function deposit() external payable {
        // This exact code works on both networks
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
    
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount);
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }
}`,
        },
        {
          id: "defi-ecosystem",
          title: "Arbitrum's DeFi Ecosystem",
          content: `Major DeFi Protocols on Arbitrum:

Decentralized Exchanges:
• Uniswap V3 - Leading AMM with concentrated liquidity
• SushiSwap - Multi-feature DEX with farming rewards
• Balancer - Weighted pool AMM for portfolio management
• Curve - Specialized for stablecoin trading

Arbitrum-Native Protocols:
• GMX - Decentralized perpetual exchange with real yield
• Camelot - Native DEX with innovative tokenomics
• Radiant Capital - Cross-chain lending protocol
• Plutus - Liquid staking and yield optimization

Lending and Borrowing:
• Aave - Multi-collateral lending protocol
• Compound - Algorithmic money markets
• Radiant - Cross-chain lending with omnichain yields

Yield Optimization:
• Beefy Finance - Automated vault strategies
• Yearn Finance - Yield aggregation protocol
• Convex - Boosted Curve yields`,
        },
      ],
      keyTakeaways: [
        "Arbitrum reduces DeFi transaction costs by 90%+ while maintaining Ethereum security",
        "Layer 2 scaling enables new DeFi use cases previously uneconomical on mainnet",
        "Full EVM compatibility means existing Ethereum DeFi protocols work seamlessly",
        "Arbitrum has developed a thriving native DeFi ecosystem alongside migrated protocols",
        "The combination of low fees and high speed creates superior DeFi user experience",
      ],
      additionalResources: [
        {
          title: "Arbitrum Portal",
          url: "https://portal.arbitrum.one/",
          type: "tool",
        },
        {
          title: "DefiLlama Arbitrum",
          url: "https://defillama.com/chain/Arbitrum",
          type: "tool",
        },
      ],
    },
  },
  // Additional content for updated sections
  "intro-to-defi-extra": {
    "setup-wallet": {
      title: "Wallet Setup & Network Switching",
      introduction:
        "Learn the purpose of wallets, seed phrases, and how to switch to Arbitrum safely.",
      sections: [
        {
          id: "wallet-basics",
          title: "Wallet Basics",
          content: `A wallet stores your keys and signs transactions. Keep your seed phrase offline and never share it. To use Arbitrum, add the network in your wallet with the correct RPC and chain ID.`
        },
        {
          id: "network-switch",
          title: "Network Switching",
          content: `Most wallets allow adding custom networks. After adding Arbitrum, switching networks changes where your transactions are broadcast and where balances are queried.`
        }
      ],
      keyTakeaways: [
        "Seed phrases control funds—store them securely",
        "Adding Arbitrum enables low-fee DeFi on L2",
        "Network switching determines which chain you are interacting with"
      ]
    },
    "bridge-assets": {
      title: "Bridging Concepts (L1 → L2)",
      introduction:
        "Understand the high-level flow of moving assets from Ethereum to Arbitrum.",
      sections: [
        {
          id: "flow",
          title: "Deposit Flow",
          content: `Deposits lock assets on L1 and credit equivalent tokens on L2. Withdrawals reverse the process and include a challenge period on optimistic rollups.`
        }
      ],
      keyTakeaways: [
        "Deposits are fast; withdrawals include a challenge window",
        "Approve and deposit are separate steps for ERC-20 tokens",
        "Always verify official bridge URLs"
      ]
    },
    "smart-contract-interaction": {
      title: "Reading and Writing to Contracts",
      introduction:
        "A gentle conceptual view of contract interaction without coding.",
      sections: [
        {
          id: "abi",
          title: "ABI & Methods",
          content: `An ABI describes contract functions. Wallets and libraries use it to encode calls like transfer() or balanceOf().`
        }
      ],
      keyTakeaways: [
        "ABI defines how to call contract methods",
        "Transactions modify state; calls read state",
        "Always confirm contract addresses from trusted sources"
      ]
    },
    "send-tokens-example": {
      title: "Token Transfer Code Examples",
      introduction:
        "Learn how token transfers work on Arbitrum through practical code examples and understand the underlying mechanisms.",
      sections: [
        {
          id: "erc20-transfer",
          title: "ERC-20 Token Transfer",
          content: `Understanding ERC-20 transfers is fundamental to DeFi.

Key Components:
- Balance Check: Ensures sender has sufficient tokens
- State Update: Updates both sender and recipient balances
- Event Emission: Logs the transfer for transparency
- Return Value: Confirms successful execution

Arbitrum Benefits:
- Lower gas costs make small transfers economical
- Faster confirmation times improve user experience
- Same security as Ethereum mainnet`,
          codeExample: `// Basic ERC-20 transfer function
function transfer(address to, uint256 amount) public returns (bool) {
    require(balanceOf[msg.sender] >= amount, "Insufficient balance");
    balanceOf[msg.sender] -= amount;
    balanceOf[to] += amount;
    emit Transfer(msg.sender, to, amount);
    return true;
}

// Example: Transfer USDC on Arbitrum
// 1. Check allowance first
uint256 allowance = usdc.allowance(user, spender);
require(allowance >= amount, "Insufficient allowance");

// 2. Execute transfer
bool success = usdc.transferFrom(user, recipient, amount);
require(success, "Transfer failed");`
        },
        {
          id: "transfer-from",
          title: "TransferFrom Pattern",
          content: `The transferFrom pattern enables third-party token transfers, essential for DeFi protocols.

Use Cases:
- DEX trading (swapping tokens)
- Lending protocols (collateral deposits)
- Yield farming (stake tokens)
- Automated strategies`,
          codeExample: `function transferFrom(address from, address to, uint256 amount) public returns (bool) {
    require(balanceOf[from] >= amount, "Insufficient balance");
    require(allowance[from][msg.sender] >= amount, "Insufficient allowance");
    
    balanceOf[from] -= amount;
    balanceOf[to] += amount;
    allowance[from][msg.sender] -= amount;
    
    emit Transfer(from, to, amount);
    return true;
}

// Example: DEX swap using transferFrom
// 1. User approves DEX to spend tokens
usdc.approve(uniswapRouter, swapAmount);

// 2. DEX executes swap
uniswapRouter.swapExactTokensForTokens(
    swapAmount,
    minAmountOut,
    path,
    user,
    deadline
);`
        }
      ],
      keyTakeaways: [
        "ERC-20 transfers require balance and allowance checks",
        "transferFrom enables third-party token management",
        "Arbitrum reduces gas costs for token operations",
        "Always verify transfer success with return values"
      ]
    }
  },

  "decentralized-exchanges": {
    "amm-vs-orderbook": {
      title: "Automated Market Makers vs Order Book Exchanges",
      introduction:
        "Understanding the fundamental difference between AMMs and traditional order book exchanges is crucial for DeFi trading success.",
      sections: [
        {
          id: "orderbook-model",
          title: "Traditional Order Book Model",
          content: `How Order Books Work:
• Buyers place bids (buy orders) at specific prices
• Sellers place asks (sell orders) at specific prices
• Trades execute when bid and ask prices match
• Market makers provide liquidity by placing orders

Advantages:
• Precise price discovery
• No slippage for limit orders
• Advanced order types (stop-loss, trailing stops)
• Suitable for large trades with minimal price impact

Disadvantages:
• Requires active market makers for liquidity
• Can have large bid-ask spreads in illiquid markets
• Complex for casual users
• Vulnerable to front-running and MEV attacks`,
        },
        {
          id: "amm-model",
          title: "Automated Market Maker Model",
          content: `How AMMs Work:
• Liquidity pools contain paired tokens (e.g., ETH/USDC)
• Mathematical formulas determine prices automatically
• Traders swap directly against the pool
• Liquidity providers earn fees from trading volume

Common AMM Formulas:
• Constant Product: x × y = k (Uniswap V2)
• Constant Mean: (x^w1 × y^w2) = k (Balancer)
• Concentrated Liquidity: Price ranges (Uniswap V3)
• Stable Curve: Optimized for similar assets (Curve)

Advantages:
• Always available liquidity (no empty order books)
• Simple user interface - just swap
• Passive income for liquidity providers
• Resistant to market manipulation

Disadvantages:
• Price slippage on large trades
• Impermanent loss for liquidity providers
• Less precise price discovery
• MEV extraction opportunities`,
          codeExample: `// Uniswap V2 Constant Product Formula
// x * y = k (where k remains constant)

function getAmountOut(
    uint amountIn,
    uint reserveIn, 
    uint reserveOut
) public pure returns (uint amountOut) {
    uint amountInWithFee = amountIn * 997; // 0.3% fee
    uint numerator = amountInWithFee * reserveOut;
    uint denominator = reserveIn * 1000 + amountInWithFee;
    amountOut = numerator / denominator;
}`,
        },
        {
          id: "comparison",
          title: "Detailed Comparison",
          content: `Liquidity Provision:
• Order Books: Professional market makers required
• AMMs: Anyone can provide liquidity and earn fees

Price Discovery:
• Order Books: Efficient price discovery through order matching
• AMMs: Price discovery through arbitrage trading

Capital Efficiency:
• Order Books: High efficiency - capital only used when orders match
• AMMs: Lower efficiency - capital sits in pools even when not trading

User Experience:
• Order Books: Complex interfaces, multiple order types
• AMMs: Simple swap interface, instant execution

Gas Costs:
• Order Books: High gas costs for order placement/cancellation
• AMMs: Single transaction for swaps, more gas efficient

Suitable Use Cases:
• Order Books: High-frequency trading, large institutional trades
• AMMs: Casual trading, long-tail assets, 24/7 liquidity`,
        },
      ],
      keyTakeaways: [
        "AMMs provide constant liquidity through mathematical formulas rather than order matching",
        "Order books offer precise price discovery but require active market makers",
        "AMMs are more accessible for casual users and liquidity providers",
        "Each model has trade-offs between efficiency, simplicity, and capital requirements",
        "Modern DeFi often combines both models for optimal trading experiences",
      ],
    },
    "uniswap-sushiswap": {
      title: "Uniswap & SushiSwap on Arbitrum",
      introduction:
        "Explore how the two largest AMM protocols operate on Arbitrum, their unique features, and how they enhance the DeFi trading experience.",
      sections: [
        {
          id: "uniswap-v3",
          title: "Uniswap V3: Concentrated Liquidity",
          content: `Revolutionary Concentrated Liquidity:
Unlike V2's full-range liquidity, V3 allows liquidity providers to concentrate capital in specific price ranges:

• Active Liquidity Management: Choose price ranges where you want to provide liquidity
• Capital Efficiency: Up to 4000x more efficient than V2
• Higher Fee Earning: More trading volume flows through your positions
• Flexible Strategies: Different ranges for different market conditions

Key Features on Arbitrum:
• Multiple fee tiers: 0.01%, 0.05%, 0.3%, 1%
• NFT positions representing unique liquidity positions
• Advanced position management tools
• Integration with yield farming protocols

Fee Tier Selection:
• 0.01%: Stablecoin pairs (USDC/USDT)
• 0.05%: Major pairs with high correlation (ETH/WETH)
• 0.3%: Standard pairs (ETH/USDC)
• 1%: Exotic or highly volatile pairs`,
          codeExample: `// Uniswap V3 Position Management
interface IUniswapV3Pool {
    function mint(
        address recipient,
        int24 tickLower,
        int24 tickUpper,
        uint128 amount,
        bytes calldata data
    ) external returns (uint256 amount0, uint256 amount1);
    
    function burn(
        int24 tickLower,
        int24 tickUpper,
        uint128 amount
    ) external returns (uint256 amount0, uint256 amount1);
}`,
        },
        {
          id: "sushiswap-features",
          title: "SushiSwap: Multi-Feature DeFi Hub",
          content: `Beyond Simple AMM:
SushiSwap has evolved into a comprehensive DeFi platform:

Core AMM Features:
• Constant product AMM similar to Uniswap V2
• Multiple pool types and fee structures
• Cross-chain bridge integration
• Limit order functionality

Additional DeFi Services:
• Kashi Lending: Isolated lending markets
• BentoBox: Optimized token vault system
• Miso: Token launch platform
• Shoyu: NFT marketplace integration

Arbitrum-Specific Benefits:
• Lower gas costs enable more frequent rebalancing
• Cross-chain swaps with reduced bridge fees
• Enhanced yield farming opportunities
• Integration with Arbitrum-native protocols`,
        },
        {
          id: "arbitrum-advantages",
          title: "Why These Protocols Excel on Arbitrum",
          content: `Cost Reduction Impact:
• Uniswap V3 position management becomes economical
• Frequent rebalancing and compounding possible
• Small trades now profitable after fees
• Advanced strategies accessible to retail users

Enhanced Functionality:
• Real-time arbitrage opportunities
• MEV protection through lower latency
• Cross-chain yield opportunities
• Integration with native Arbitrum protocols

Liquidity Incentives:
• Arbitrum Foundation grants and incentives
• Protocol-specific reward programs
• Reduced costs increase LP profitability
• Growing ecosystem attracts more capital

Developer Benefits:
• Same codebase works with lower deployment costs
• Faster iteration and testing cycles
• Better user experience drives adoption
• Access to Arbitrum-specific infrastructure`,
        },
      ],
      keyTakeaways: [
        "Uniswap V3's concentrated liquidity offers up to 4000x capital efficiency improvements",
        "SushiSwap provides a comprehensive DeFi ecosystem beyond just token swapping",
        "Arbitrum's low fees make advanced strategies economically viable for all users",
        "Both protocols benefit from Arbitrum's speed and cost reductions",
        "The combination creates opportunities for sophisticated DeFi strategies",
      ],
    },
    "arbitrum-native-dexs": {
      title: "Arbitrum-Native DEXs: GMX & Camelot",
      introduction:
        "Discover the innovative DEX protocols built specifically for Arbitrum, offering unique features impossible on higher-fee networks.",
      sections: [
        {
          id: "gmx-protocol",
          title: "GMX: Decentralized Perpetual Exchange",
          content: `Revolutionary Perpetual Trading:
GMX pioneered a new model for decentralized derivatives:

Multi-Asset Pool (GLP):
• Single pool backing all trades
• Contains ETH, BTC, USDC, USDT, and other major assets
• Liquidity providers earn from trading fees and spread
• Real asset backing (not synthetic)

Zero Price Impact Trading:
• Trades execute at oracle prices
• No slippage regardless of size
• Up to 50x leverage available
• Minimal liquidation risk from price manipulation

Unique Features:
• Real yield distribution to $GMX stakers
• GLP auto-rebalancing based on trader demand
• Anti-MEV design with oracle pricing
• Cross-margin positions across multiple assets

Tokenomics:
• $GMX: Governance and fee sharing token
• $GLP: Liquidity provider token representing pool share
• $esGMX: Escrowed rewards for long-term alignment`,
          codeExample: `// GMX Position Opening
interface IGMXRouter {
    function createIncreasePosition(
        address[] memory _path,
        address _indexToken,
        uint256 _amountIn,
        uint256 _minOut,
        uint256 _sizeDelta,
        bool _isLong,
        uint256 _acceptablePrice,
        uint256 _executionFee,
        bytes32 _referralCode
    ) external payable;
}`,
        },
        {
          id: "camelot-dex",
          title: "Camelot: The Native Arbitrum DEX",
          content: `Built for Arbitrum Ecosystem:
Camelot was designed from the ground up for Arbitrum:

Innovative AMM Design:
• Algebra-based concentrated liquidity
• Dynamic fees based on volatility
• Multiple pool types for different use cases
• Optimized for Arbitrum's specific characteristics

Ecosystem Integration:
• Deep integration with Arbitrum projects
• Native support for Arbitrum tokens
• Partnerships with major protocols
• Strategic positioning in the ecosystem

Unique Features:
• Spade Pools: Boosted yield farming
• Round Table: Governance mechanism
• xGRAIL: Revenue sharing token
• Nitro Pools: High-yield farming opportunities

Community-Driven:
• Arbitrum-native governance
• Community treasury management
• Ecosystem partnerships and integrations
• Focus on sustainable tokenomics`,
        },
        {
          id: "native-advantages",
          title: "Advantages of Native Protocols",
          content: `Arbitrum-Specific Optimization:
• Designed for low-fee environment
• Optimized smart contracts for Arbitrum VM
• Integration with Arbitrum infrastructure
• Access to ecosystem incentives and grants

Innovation Opportunities:
• Features impossible on high-fee networks
• Real-time rebalancing and optimization
• Complex multi-step strategies
• Micro-transaction enabled services

Community and Governance:
• Aligned with Arbitrum ecosystem goals
• Native community participation
• Direct relationships with Arbitrum Foundation
• Ecosystem-wide collaborations

Sustainable Economics:
• Fee structures optimized for layer 2
• Sustainable yield generation models
• Real value creation rather than token emissions
• Long-term ecosystem alignment`,
        },
      ],
      keyTakeaways: [
        "GMX revolutionizes perpetual trading with real asset backing and zero price impact",
        "Camelot provides native Arbitrum optimization with innovative AMM features",
        "Native protocols can implement features impossible on high-fee networks",
        "Both protocols focus on real yield and sustainable tokenomics",
        "Native development allows for deeper ecosystem integration and innovation",
      ],
    },
    "arbitrage-challenge": {
      title: "Understanding AMM Arbitrage",
      introduction:
        "Learn how price discrepancies between AMM pools create risk-free arbitrage opportunities that keep DeFi markets efficient.",
      sections: [
        {
          id: "concept",
          title: "Why Arbitrage Exists",
          content: `When two pools quote different prices for the same pair (e.g., ETH/USDC), arbitrageurs buy from the cheaper pool and sell to the expensive one. This trading brings prices back in line.\n\nKey Ideas:\n• AMM price depends on pool balances (x*y=k)\n• External markets (CEXes/other AMMs) move faster\n• Arbitrage aligns AMM price with the market`
        },
        {
          id: "formula",
          title: "Constant Product Refresher",
          content: `In Uniswap V2, price is reserveOut/reserveIn after fees. Large trades shift reserves and thus the price.\n\nCode Sketch:\n\`\`\`solidity\nfunction getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) public pure returns (uint amountOut) {\n  uint amountInWithFee = amountIn * 997;\n  uint numerator = amountInWithFee * reserveOut;\n  uint denominator = reserveIn * 1000 + amountInWithFee;\n  return numerator / denominator;\n}\n\`\`\``
        }
      ],
      keyTakeaways: [
        "Arbitrage keeps AMMs in sync with external prices",
        "Price impact and fees determine profitability",
        "Efficient markets rely on arbitrage participants"
      ]
    },
    "token-swapping": {
      title: "Token Swapping Concepts & Code",
      introduction:
        "Learn how token swapping works on DEXs through code examples and understand the mechanics behind automated market makers.",
      sections: [
        {
          id: "swap-mechanics",
          title: "How Token Swaps Work",
          content: `Token swapping on DEXs involves several key steps:

Key Parameters:
- amountIn: Exact input amount
- amountOutMin: Minimum output (slippage protection)
- path: Token swap route (e.g., [USDC, WETH, ARB])
- to: Recipient address
- deadline: Transaction expiration time`,
          codeExample: `// Uniswap V2 swap function
function swapExactTokensForTokens(
    uint amountIn,
    uint amountOutMin,
    address[] calldata path,
    address to,
    uint deadline
) external returns (uint[] memory amounts) {
    amounts = UniswapV2Library.getAmountsOut(factory, amountIn, path);
    require(amounts[amounts.length - 1] >= amountOutMin, 'UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT');
    
    TransferHelper.safeTransferFrom(
        path[0], msg.sender, UniswapV2Library.pairFor(factory, path[0], path[1]), amounts[0]
    );
    _swap(amounts, path, to);
}

// Example: Swap USDC for ARB on Arbitrum
address[] memory path = new address[](3);
path[0] = USDC;  // Input token
path[1] = WETH;  // Intermediate token
path[2] = ARB;   // Output token

uint256 amountIn = 1000 * 106; // 1000 USDC (6 decimals)
uint256 amountOutMin = 0; // Accept any output (not recommended)

uniswapRouter.swapExactTokensForTokens(
    amountIn,
    amountOutMin,
    path,
    msg.sender,
    block.timestamp + 300 // 5 minute deadline
);`
        },
        {
          id: "slippage-protection",
          title: "Slippage Protection",
          content: `Slippage occurs when the actual output differs from expected due to price movements.

Slippage Factors:
- Trade Size: Larger trades cause more slippage
- Liquidity Depth: More liquidity = less slippage
- Price Volatility: High volatility increases slippage
- MEV: Front-running can worsen slippage`,
          codeExample: `// Calculate minimum output with slippage tolerance
uint256 expectedOutput = getAmountOut(amountIn, reserveIn, reserveOut);
uint256 slippageTolerance = 500; // 5% (500 basis points)
uint256 minOutput = expectedOutput * (10000 - slippageTolerance) / 10000;

require(actualOutput >= minOutput, "Slippage too high");

// Safe swap with slippage protection
function safeSwap(
    uint256 amountIn,
    uint256 maxSlippageBps
) external {
    uint256[] memory amounts = router.getAmountsOut(amountIn, path);
    uint256 expectedOut = amounts[amounts.length - 1];
    uint256 minOut = expectedOut * (10000 - maxSlippageBps) / 10000;
    
    router.swapExactTokensForTokens(
        amountIn,
        minOut,
        path,
        msg.sender,
        deadline
    );
}`
        }
      ],
      keyTakeaways: [
        "Token swaps use mathematical formulas to determine prices",
        "Slippage protection prevents excessive price impact",
        "Path optimization can reduce fees and slippage",
        "Deadlines prevent stale transactions"
      ]
    },
    "liquidity-provision": {
      title: "Liquidity Provision Concepts & Code",
      introduction:
        "Understand how liquidity provision works in AMMs and learn the code patterns behind providing liquidity to earn fees.",
      sections: [
        {
          id: "add-liquidity",
          title: "Adding Liquidity to Pools",
          content: `Liquidity providers deposit equal value of both tokens to earn trading fees.

Key Concepts:
- Equal Value: Both tokens must have equal USD value
- LP Tokens: Receipt tokens representing pool share
- Fee Earning: Earn 0.3% of trading volume (Uniswap V2)
- Impermanent Loss: Risk of value loss due to price changes`,
          codeExample: `function addLiquidity(
    address tokenA,
    address tokenB,
    uint amountADesired,
    uint amountBDesired,
    uint amountAMin,
    uint amountBMin,
    address to,
    uint deadline
) external returns (uint amountA, uint amountB, uint liquidity) {
    (amountA, amountB) = _addLiquidity(tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin);
    address pair = UniswapV2Library.pairFor(factory, tokenA, tokenB);
    TransferHelper.safeTransferFrom(tokenA, msg.sender, pair, amountA);
    TransferHelper.safeTransferFrom(tokenB, msg.sender, pair, amountB);
    liquidity = IUniswapV2Pair(pair).mint(to);
}

// Example: Add USDC/ETH liquidity
uint256 usdcAmount = 1000 * 106; // 1000 USDC
uint256 ethAmount = 0.5 * 1018;  // 0.5 ETH

// Calculate optimal amounts
(uint256 amountA, uint256 amountB) = router.addLiquidity(
    USDC,
    WETH,
    usdcAmount,
    ethAmount,
    0, // Accept any amount (not recommended)
    0, // Accept any amount (not recommended)
    msg.sender,
    block.timestamp + 300
);`
        },
        {
          id: "remove-liquidity",
          title: "Removing Liquidity",
          content: `Liquidity can be removed by burning LP tokens.

Considerations:
- Current Ratio: Tokens returned based on current pool ratio
- Fees Earned: Accumulated fees are included in withdrawal
- Gas Costs: Consider gas vs. accumulated fees
- Timing: Market conditions affect withdrawal value`,
          codeExample: `function removeLiquidity(
    address tokenA,
    address tokenB,
    uint liquidity,
    uint amountAMin,
    uint amountBMin,
    address to,
    uint deadline
) public returns (uint amountA, uint amountB) {
    address pair = UniswapV2Library.pairFor(factory, tokenA, tokenB);
    IUniswapV2Pair(pair).transferFrom(msg.sender, pair, liquidity);
    (uint amount0, uint amount1) = IUniswapV2Pair(pair).burn(to);
    (address token0,) = UniswapV2Library.sortTokens(tokenA, tokenB);
    (amountA, amountB) = tokenA == token0 ? (amount0, amount1) : (amount1, amount0);
    require(amountA >= amountAMin, 'UniswapV2Router: INSUFFICIENT_A_AMOUNT');
    require(amountB >= amountBMin, 'UniswapV2Router: INSUFFICIENT_B_AMOUNT');
}

// Example: Remove liquidity
uint256 lpTokens = 100 * 1018; // 100 LP tokens

(uint256 amountA, uint256 amountB) = router.removeLiquidity(
    USDC,
    WETH,
    lpTokens,
    0, // Accept any amount
    0, // Accept any amount
    msg.sender,
    block.timestamp + 300
);`
        }
      ],
      keyTakeaways: [
        "Liquidity provision requires equal value of both tokens",
        "LP tokens represent ownership share in the pool",
        "Fees are earned proportionally to liquidity provided",
        "Impermanent loss is a key risk to consider"
      ]
    },
    "uniswap-smart-contracts": {
      title: "Uniswap Contract Integration Examples",
      introduction:
        "Learn how to integrate with Uniswap smart contracts in your applications and understand the key interfaces.",
      sections: [
        {
          id: "router-interface",
          title: "Router Interface",
          content: `The Router contract provides high-level functions for swapping and liquidity management.

Key Functions:
- addLiquidity: Add liquidity to a pool
- removeLiquidity: Remove liquidity from a pool
- swapExactTokensForTokens: Swap exact input for tokens
- swapTokensForExactTokens: Swap tokens for exact output`,
          codeExample: `interface IUniswapV2Router02 {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);
    
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);
    
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
}

// Example: Complete swap integration
contract SwapContract {
    IUniswapV2Router02 public router;
    address public WETH;
    
    constructor(address _router) {
        router = IUniswapV2Router02(_router);
        WETH = router.WETH();
    }
    
    function swapTokens(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut
    ) external {
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenIn).approve(address(router), amountIn);
        
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;
        
        router.swapExactTokensForTokens(
            amountIn,
            minAmountOut,
            path,
            msg.sender,
            block.timestamp + 300
        );
    }
}`
        },
        {
          id: "factory-interface",
          title: "Factory Interface",
          content: `The Factory contract creates and manages trading pairs.

Key Functions:
- getPair: Get existing pair address
- createPair: Create new trading pair
- allPairs: Get all pairs by index
- allPairsLength: Total number of pairs`,
          codeExample: `interface IUniswapV2Factory {
    function getPair(address tokenA, address tokenB) external view returns (address pair);
    function createPair(address tokenA, address tokenB) external returns (address pair);
    function allPairs(uint) external view returns (address pair);
    function allPairsLength() external view returns (uint);
}

// Example: Check if pair exists and create if needed
function ensurePairExists(address tokenA, address tokenB) external {
    address pair = factory.getPair(tokenA, tokenB);
    if (pair == address(0)) {
        // Pair doesn't exist, create it
        factory.createPair(tokenA, tokenB);
    }
}`
        }
      ],
      keyTakeaways: [
        "Router provides high-level swap and liquidity functions",
        "Factory manages pair creation and discovery",
        "Always check pair existence before operations",
        "Approve tokens before calling router functions"
      ]
    }
  },

  "vaults-yield-aggregation": {
    "what-are-vaults": {
      title: "Understanding Yield Vaults in DeFi",
      introduction:
        "Yield vaults are automated smart contracts that optimize returns by implementing sophisticated strategies across multiple DeFi protocols.",
      sections: [
        {
          id: "vault-basics",
          title: "What Are Yield Vaults?",
          content: `Definition:
Yield vaults are smart contracts that pool user funds and automatically execute yield-generating strategies to maximize returns while minimizing risk and complexity for users.

Key Components:
• Strategy Contract: Implements the yield-generating logic
• Vault Contract: Manages user deposits and withdrawals
• Governance: Oversees strategy approval and parameters
• Fee Structure: Compensation for protocol and strategists

How Vaults Work:
1. Users deposit tokens into the vault
2. Vault issues shares representing ownership
3. Strategy deploys funds across multiple protocols
4. Yields are automatically harvested and compounded
5. Users can withdraw their share of the pool anytime

Benefits:
• Automation: No manual position management
• Optimization: Professional strategy management
• Gas Efficiency: Shared costs across users
• Diversification: Complex multi-protocol strategies
• Compounding: Automatic reward reinvestment`,
        },
        {
          id: "vault-types",
          title: "Types of Yield Vaults",
          content: `Single-Asset Vaults:
• Deposit one token type (ETH, USDC)
• Strategies: lending, staking, liquidity provision
• Lower complexity and risk
• Examples: Aave lending, staking vaults

LP Token Vaults:
• Deposit liquidity provider tokens
• Often involve farming additional rewards
• Higher yields but impermanent loss risk
• Examples: Uniswap LP farming

Stable Coin Vaults:
• Focus on USD-pegged assets
• Lower volatility, steady yields
• Popular for risk-averse farming

Multi-Strategy Vaults:
• Combine multiple yield sources
• Dynamic allocation based on conditions
• Higher complexity, better risk-adjusted returns`,
          codeExample: `// Simple Vault Interface
interface IYieldVault {
    function deposit(uint256 _amount) external returns (uint256 shares);
    function withdraw(uint256 _shares) external returns (uint256 amount);
    function pricePerShare() external view returns (uint256);
    function totalAssets() external view returns (uint256);
    function harvest() external;
}`,
        },
      ],
      keyTakeaways: [
        "Yield vaults automate complex DeFi strategies for passive income",
        "Different vault types cater to various risk preferences",
        "Vaults provide gas efficiency and professional management",
        "Smart contract risks must be carefully evaluated",
        "Automation trades control for convenience and optimization",
      ],
    },
    "yield-strategies": {
      title: "Automated Yield Strategies in DeFi",
      introduction:
        "Explore sophisticated strategies that yield vaults implement, from simple lending to complex multi-protocol arbitrage.",
      sections: [
        {
          id: "basic-strategies",
          title: "Fundamental Yield Strategies",
          content: `Lending Strategies:
• Deploy to lending protocols (Aave, Compound)
• Earn interest from borrowers
• Auto-compound reward tokens
• Risk: Protocol risk, rate volatility

Liquidity Provision:
• Provide liquidity to DEX pools
• Earn trading fees from swaps
• Often with farming rewards
• Risk: Impermanent loss, depegging

Staking Strategies:
• Stake governance tokens for rewards
• Liquid staking for additional yield
• Lock tokens for boosted rewards
• Risk: Slashing, token volatility`,
        },
        {
          id: "advanced-strategies",
          title: "Advanced Multi-Protocol Strategies",
          content: `Delta-Neutral Strategies:
• Long spot + short perpetual position
• Earn funding rates while hedging
• Combined with LP or lending yields
• Risk: Funding changes, liquidation

Leveraged Yield Farming:
• Borrow assets to increase size
• Multiply yields through leverage
• Recursive lending for efficiency
• Risk: Liquidation, rate changes

Algorithmic Rebalancing:
• Dynamic allocation based on yields
• Automated protocol migration
• Risk-adjusted optimization
• ML integration for predictions`,
          codeExample: `// Delta-Neutral Strategy
contract DeltaNeutralVault {
    function executeStrategy() external {
        uint256 lpTokens = provideLiquidity(token0, token1, amount);
        openShortPosition(lpTokens * lpPrice);
        harvestLPFees();
        harvestFundingPayments();
        rebalancePosition();
    }
}`,
        },
      ],
      keyTakeaways: [
        "Strategies range from simple lending to complex arbitrage",
        "Advanced strategies offer higher returns with additional risks",
        "Automation enables gas-efficient complex strategy execution",
        "Risk management crucial for sustainable yields",
        "Innovation continues pushing DeFi yield boundaries",
      ],
    },
    "arbitrum-vault-platforms": {
      title: "Major Vault Platforms on Arbitrum",
      introduction:
        "Discover leading yield aggregation platforms on Arbitrum, each with unique approaches to automated yield generation.",
      sections: [
        {
          id: "yearn-finance",
          title: "Yearn Finance: The Yield Pioneer",
          content: `Yearn's Evolution:
From simple yield optimization to comprehensive ecosystem:

Key Features:
• V2 Vaults with sophisticated automation
• Open-source strategy framework
• YFI governance token control
• Integrated insurance options

Arbitrum Benefits:
• Lower gas enables frequent harvesting
• Smaller minimums increase accessibility
• Cross-chain strategy opportunities
• Native protocol integration`,
        },
        {
          id: "beefy-finance",
          title: "Beefy Finance: Multi-Chain Optimization",
          content: `Beefy's Approach:
Auto-compounding yield farms across chains:

Core Strengths:
• Maximized yields through auto-compounding
• Multi-chain consistent experience
• Community-driven development
• Safety-first audit processes

Arbitrum Advantages:
• More frequent compounding
• Arbitrum-native token support
• Major DEX and farm integration
• Cross-chain yield optimization`,
        },
      ],
      keyTakeaways: [
        "Yearn pioneered yield aggregation with continued innovation",
        "Beefy focuses on auto-compounding across multiple chains",
        "Native platforms offer Arbitrum-optimized strategies",
        "Each platform has different risk profiles and focuses",
        "Low-fee environment enables sophisticated operations",
      ],
    },
    "vault-smart-contracts": {
      title: "Vault Contracts: Roles & Interfaces",
      introduction:
        "Understand the separation of concerns between vaults (accounting) and strategies (execution).",
      sections: [
        {
          id: "roles",
          title: "Vault vs Strategy",
          content: `Vaults track deposits and shares. Strategies interact with external protocols. Separation improves safety and upgradability.`
        },
        {
          id: "interface",
          title: "Minimal Vault Interface",
          content: `\`\`\`solidity\ninterface IVault {\n  function deposit(uint256 amount) external returns (uint256 shares);\n  function withdraw(uint256 shares) external returns (uint256 amount);\n  function totalAssets() external view returns (uint256);\n}\n\`\`\``
        }
      ],
      keyTakeaways: [
        "Vaults manage accounting; strategies handle yield",
        "Interfaces enable composability",
        "Clear roles reduce security risk"
      ]
    },
    "vault-simulator": {
      title: "Vault Strategy Simulator (Concept)",
      introduction:
        "Simulate how different strategies perform under changing market conditions to understand risk/return trade-offs.",
      sections: [
        {
          id: "inputs",
          title: "Simulation Inputs",
          content: `APY assumptions, volatility, fee model, compounding frequency, token price drift.`
        },
        {
          id: "outputs",
          title: "What To Measure",
          content: `Net APY, drawdowns, Sharpe ratio, gas-adjusted yield.`
        }
      ],
      keyTakeaways: [
        "Simulations help compare strategies before deploying capital",
        "Always stress-test for volatility and fees"
      ]
    },
    "vault-deposits": {
      title: "Vault Deposit Concepts & Code",
      introduction:
        "Learn how vault deposits work through code examples and understand the mechanisms behind yield vault interactions.",
      sections: [
        {
          id: "deposit-mechanics",
          title: "How Vault Deposits Work",
          content: `Vault deposits involve depositing tokens and receiving vault shares.

Key Components:
- Asset Transfer: Tokens moved from user to vault
- Share Calculation: Shares represent ownership percentage
- State Updates: Total assets and user balance updated
- Event Emission: Transaction logged for transparency`,
          codeExample: `// Basic vault deposit function
function deposit(uint256 amount) external {
    require(amount > 0, "Amount must be greater than 0");
    
    // Transfer tokens from user to vault
    IERC20(asset).transferFrom(msg.sender, address(this), amount);
    
    // Calculate shares to mint
    uint256 shares = convertToShares(amount);
    
    // Mint shares to user
    _mint(msg.sender, shares);
    
    // Update total assets
    totalAssets += amount;
    
    emit Deposit(msg.sender, amount, shares);
}

// Example: Deposit USDC into yield vault
uint256 depositAmount = 1000 * 106; // 1000 USDC

// 1. Approve vault to spend USDC
usdc.approve(vaultAddress, depositAmount);

// 2. Deposit and receive shares
uint256 shares = vault.deposit(depositAmount, msg.sender);

// 3. Check share balance
uint256 userShares = vault.balanceOf(msg.sender);`
        },
        {
          id: "share-calculation",
          title: "Share Calculation Logic",
          content: `Shares represent proportional ownership of vault assets.

Share Mechanics:
- First Deposit: 1 asset = 1 share
- Subsequent Deposits: Shares based on current ratio
- Withdrawals: Assets based on share percentage
- Yield Accrual: Shares remain constant, assets increase`,
          codeExample: `function convertToShares(uint256 assets) public view returns (uint256) {
    uint256 supply = totalSupply();
    if (supply == 0) {
        return assets; // First deposit: 1:1 ratio
    }
    return (assets * supply) / totalAssets;
}

function convertToAssets(uint256 shares) public view returns (uint256) {
    uint256 supply = totalSupply();
    if (supply == 0) {
        return 0;
    }
    return (shares * totalAssets) / supply;
}

// Example: Understanding share calculations
// Initial deposit: 1000 USDC = 1000 shares (1:1)
uint256 initialShares = vault.deposit(1000e6, user);

// Later deposit: 1000 USDC = 800 shares (due to yield growth)
// Total assets: 2500 USDC, Total shares: 1800
uint256 laterShares = vault.deposit(1000e6, user2);

// Withdrawal: 900 shares = 1250 USDC (900/1800 * 2500)
uint256 assets = vault.withdraw(900, user, user);`
        }
      ],
      keyTakeaways: [
        "Vault deposits convert assets to shares representing ownership",
        "Share calculations maintain proportional ownership",
        "First deposits typically have 1:1 asset-to-share ratio",
        "Yield growth increases asset value per share"
      ]
    },
    "yield-monitoring": {
      title: "Vault Performance Monitoring Concepts",
      introduction:
        "Understand how to monitor vault performance and track yield metrics through code examples and practical monitoring techniques.",
      sections: [
        {
          id: "performance-metrics",
          title: "Key Performance Metrics",
          content: `Monitoring vault performance requires tracking several key metrics.

Key Metrics:
- Total Assets: Current value of all assets in vault
- Price Per Share: Asset value per vault share
- APY: Annual percentage yield
- TVL: Total value locked in vault`,
          codeExample: `// Vault performance tracking
contract VaultMonitor {
    struct PerformanceData {
        uint256 totalAssets;
        uint256 totalShares;
        uint256 pricePerShare;
        uint256 apy;
        uint256 timestamp;
    }
    
    mapping(uint256 => PerformanceData) public performanceHistory;
    uint256 public currentSnapshot;
    
    function updatePerformance() external {
        uint256 assets = totalAssets();
        uint256 shares = totalSupply();
        uint256 price = convertToAssets(1e18); // Price per share
        
        performanceHistory[currentSnapshot] = PerformanceData({
            totalAssets: assets,
            totalShares: shares,
            pricePerShare: price,
            apy: calculateAPY(),
            timestamp: block.timestamp
        });
        
        currentSnapshot++;
    }
}

// Example: Calculate vault performance
function getVaultStats(address vault) external view returns (
    uint256 totalAssets,
    uint256 totalShares,
    uint256 pricePerShare,
    uint256 apy
) {
    totalAssets = IVault(vault).totalAssets();
    totalShares = IVault(vault).totalSupply();
    pricePerShare = IVault(vault).convertToAssets(1e18);
    apy = calculateAPY(vault);
}`
        },
        {
          id: "yield-tracking",
          title: "Yield Tracking and Compounding",
          content: `Yield tracking involves monitoring how vault strategies generate returns.

Yield Sources:
- Lending Rewards: Interest from lending protocols
- Trading Fees: Fees from liquidity provision
- Staking Rewards: Rewards from staking activities
- Compounding: Reinvesting earned rewards`,
          codeExample: `// Yield tracking implementation
function trackYield() external {
    uint256 previousAssets = lastRecordedAssets;
    uint256 currentAssets = totalAssets();
    
    if (previousAssets > 0) {
        uint256 yieldGenerated = currentAssets - previousAssets;
        uint256 yieldPercentage = (yieldGenerated * 10000) / previousAssets;
        
        // Update yield tracking
        totalYieldGenerated += yieldGenerated;
        averageYieldRate = calculateAverageYield();
        
        emit YieldGenerated(yieldGenerated, yieldPercentage);
    }
    
    lastRecordedAssets = currentAssets;
    lastYieldCheck = block.timestamp;
}

// Example: Monitor yield over time
function calculateYieldMetrics() external view returns (
    uint256 dailyYield,
    uint256 weeklyYield,
    uint256 monthlyYield
) {
    uint256 currentPrice = vault.convertToAssets(1e18);
    uint256 price24hAgo = getHistoricalPrice(block.timestamp - 1 days);
    uint256 price7dAgo = getHistoricalPrice(block.timestamp - 7 days);
    uint256 price30dAgo = getHistoricalPrice(block.timestamp - 30 days);
    
    dailyYield = ((currentPrice - price24hAgo) * 10000) / price24hAgo;
    weeklyYield = ((currentPrice - price7dAgo) * 10000) / price7dAgo;
    monthlyYield = ((currentPrice - price30dAgo) * 10000) / price30dAgo;
}`
        }
      ],
      keyTakeaways: [
        "Monitor key metrics like total assets, price per share, and APY",
        "Yield tracking helps understand vault performance over time",
        "Compounding effects can significantly impact long-term returns",
        "Regular monitoring helps identify optimal entry/exit points"
      ]
    }
  },

  "risks-security": {
    "impermanent-loss": {
      title: "Understanding Impermanent Loss in DeFi",
      introduction:
        "Impermanent loss is a critical concept in DeFi. Learn what it is, why it happens, and how to manage it effectively.",
      sections: [
        {
          id: "what-is-il",
          title: "What is Impermanent Loss?",
          content: `Definition:
Impermanent loss is the temporary loss experienced by liquidity providers due to volatility in a trading pair, representing the difference between holding tokens versus providing liquidity.

Why "Impermanent"?
• Loss only realized when withdrawing
• Disappears if prices return to original ratios
• Rarely happens in practice
• Can become permanent

Key Mechanics:
• Occurs when token prices diverge
• More divergence = more loss
• Affects all AMM liquidity providers
• Cannot be avoided, only managed`,
        },
        {
          id: "il-mechanics",
          title: "How Impermanent Loss Works",
          content: `Example:
Start: 1 ETH + 2000 USDC (ETH = $2000)

ETH doubles to $4000:
• LP: 0.707 ETH + 2828 USDC = $5656
• Hold: 1 ETH + 2000 USDC = $6000
• Loss: $344 (5.72%)

ETH halves to $1000:
• LP: 1.414 ETH + 1414 USDC = $2828
• Hold: 1 ETH + 2000 USDC = $3000
• Loss: $172 (5.72%)

Insights:
• Same loss % regardless of direction
• Larger moves = larger losses
• Non-linear relationship`,
          codeExample: `// Impermanent Loss Calculation
function calculateIL(uint256 priceRatio) public pure returns (uint256) {
    // IL = (2 * sqrt(ratio)) / (1 + ratio) - 1
    uint256 sqrtRatio = sqrt(priceRatio * 1e18) / 1e9;
    uint256 numerator = 2 * sqrtRatio;
    uint256 denominator = 1e18 + priceRatio;
    return numerator * 1e18 / denominator - 1e18;
}`,
        },
      ],
      keyTakeaways: [
        "IL occurs when LP token prices diverge from initial ratio",
        "2x price change equals 5.72% impermanent loss",
        "Trading fees can offset IL over time",
        "Strategic pool selection minimizes IL impact",
        "Understanding IL crucial for successful LP",
      ],
    },
    "common-defi-risks": {
      title: "Common DeFi Risks and Attack Vectors",
      introduction:
        "The DeFi ecosystem faces numerous risks. Understanding these is crucial for safe participation.",
      sections: [
        {
          id: "smart-contract-risks",
          title: "Smart Contract Vulnerabilities",
          content: `Common Vulnerabilities:
• Reentrancy: Exploiting function calls before state updates
• Integer Issues: Math errors in calculations
• Access Control: Improper permissions
• Logic Errors: Flawed business logic

Historical Examples:
• The DAO (2016): $60M reentrancy attack
• bZx (2020): Flash loan manipulation
• Cream Finance (2021): Oracle manipulation
• Poly Network (2021): $611M largest hack

Mitigation:
• Comprehensive multi-firm audits
• Formal verification of critical functions
• Bug bounty programs
• Gradual rollouts with limits`,
        },
        {
          id: "oracle-attacks",
          title: "Oracle Manipulation Attacks",
          content: `Attack Pattern:
• Manipulate price feeds used by protocols
• Combined with flash loans for efficiency
• Exploit arbitrage during distortions
• Target low-liquidity assets

Flash Loan Attack Steps:
1. Borrow large amounts without collateral
2. Manipulate oracle prices via trades
3. Exploit price discrepancies
4. Repay loan, keep profits

Defense Mechanisms:
• Time-weighted average pricing (TWAP)
• Multiple oracle aggregation
• Circuit breakers for extreme moves
• Minimum liquidity requirements`,
          codeExample: `// Secure Oracle Implementation
contract SecureProtocol {
    IPriceOracle[] oracles;
    
    function secureFunction() external {
        uint256 twapPrice = getTWAPPrice();
        uint256 aggregatedPrice = getAggregatedPrice();
        
        require(abs(twapPrice - aggregatedPrice) < tolerance, "Price anomaly");
        // Safe to proceed
    }
}`,
        },
      ],
      keyTakeaways: [
        "Smart contract bugs remain primary risk vector",
        "Oracle manipulation creates systemic risks",
        "Multiple security layers essential",
        "Continuous monitoring required",
        "Risk mitigation requires comprehensive approach",
      ],
    },
    "smart-contract-audits": {
      title: "Smart Contract Audits and Security Best Practices",
      introduction:
        "Learn to evaluate smart contract security through audit reports and security frameworks.",
      sections: [
        {
          id: "audit-process",
          title: "The Audit Process",
          content: `Methodology:
• Automated Analysis: Vulnerability scanners
• Manual Review: Line-by-line examination
• Business Logic: Intended vs actual behavior
• Test Coverage: Comprehensive scenarios
• Documentation: Specification alignment

Phases:
1. Scoping and objectives
2. Automated and manual testing
3. Finding documentation
4. Developer remediation
5. Final verification

Severity Levels:
• Critical: Immediate fund risk
• High: Significant security impact
• Medium: Moderate risk
• Low: Minor optimizations`,
        },
        {
          id: "reading-audits",
          title: "Evaluating Audit Reports",
          content: `Report Components:
• Executive summary with key findings
• Scope definition and limitations
• Methodology and tools used
• Detailed vulnerability descriptions
• Remediation recommendations
• Status of issue resolution

Red Flags:
• Unresolved critical/high issues
• Rushed timelines or limited scope
• Missing business logic review
• No post-deployment monitoring

Due Diligence:
• Multiple audits from different firms
• Public report availability
• Open-source code verification
• Active bug bounty programs`,
          codeExample: `// Reentrancy Fix Example
// BEFORE (Vulnerable)
function withdraw() external {
    uint256 amount = balances[msg.sender];
    (bool success,) = msg.sender.call{value: amount}("");
    balances[msg.sender] = 0; // ⚠️ After external call
}

// AFTER (Secure)
function withdraw() external {
    uint256 amount = balances[msg.sender];
    balances[msg.sender] = 0; // ✅ Before external call
    (bool success,) = msg.sender.call{value: amount}("");
}`,
        },
      ],
      keyTakeaways: [
        "Audits involve automated and manual analysis",
        "Multiple audits provide better assurance",
        "Understanding reports helps assess risks",
        "Unresolved critical findings are red flags",
        "Ongoing security practices matter",
      ],
    },
    "secure-coding-practices": {
      title: "Security Best Practices",
      introduction:
        "Practical checklist for building safer DeFi contracts.",
      sections: [
        { id: "patterns", title: "Core Patterns", content: `Checks-effects-interactions; pull over push payments; access control with roles; pause mechanisms; limit external calls.` },
        { id: "testing", title: "Testing & Monitoring", content: `Fuzzing, invariant tests, coverage, on-chain monitors, alerting.` }
      ],
      keyTakeaways: [
        "Adopt proven security patterns",
        "Invest in testing and monitoring",
        "Prefer simplicity over complex logic"
      ]
    },
    "vulnerability-hunt": {
      title: "Finding Vulnerabilities: A Methodology",
      introduction:
        "A structured approach to reviewing unfamiliar contracts.",
      sections: [
        { id: "map", title: "Map The System", content: `Identify external dependencies, privileged roles, upgrade paths, fee flows.` },
        { id: "attack-surface", title: "Attack Surface", content: `Reentrancy points, price oracles, unchecked calls, math assumptions.` }
      ],
      keyTakeaways: [
        "System mapping guides code review",
        "Focus on external calls and arithmetic",
        "Check upgradeability and roles"
      ]
    },
    "contract-analysis": {
      title: "Smart Contract Vulnerability Analysis",
      introduction:
        "Learn how to analyze smart contracts for vulnerabilities through code examples and systematic analysis techniques.",
      sections: [
        {
          id: "vulnerability-patterns",
          title: "Common Vulnerability Patterns",
          content: `Understanding common vulnerability patterns helps in systematic contract analysis.

Common Patterns:
- Reentrancy: External calls before state updates
- Integer Overflow: Unchecked arithmetic operations
- Access Control: Missing or incorrect permission checks
- Logic Errors: Flawed business logic implementation`,
          codeExample: `// Example: Reentrancy vulnerability
contract VulnerableContract {
    mapping(address => uint256) public balances;
    
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        // Vulnerable: External call before state update
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        // State update after external call
        balances[msg.sender] -= amount;
    }
}

// Example: Fixed reentrancy vulnerability
contract SecureContract {
    mapping(address => uint256) public balances;
    bool private locked;
    
    modifier noReentrancy() {
        require(!locked, "Reentrancy detected");
        locked = true;
        _;
        locked = false;
    }
    
    function withdraw(uint256 amount) external noReentrancy {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        // State update before external call
        balances[msg.sender] -= amount;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
}`
        },
        {
          id: "analysis-methodology",
          title: "Systematic Analysis Methodology",
          content: `A structured approach to contract analysis.

Analysis Steps:
1. Code Review: Manual inspection of contract logic
2. Pattern Matching: Automated detection of known patterns
3. State Analysis: Understanding state transitions
4. External Dependencies: Analyzing external calls
5. Economic Analysis: Understanding tokenomics and incentives`,
          codeExample: `// Analysis checklist implementation
contract ContractAnalyzer {
    struct AnalysisResult {
        bool hasReentrancy;
        bool hasOverflow;
        bool hasAccessControl;
        bool hasLogicErrors;
        uint256 riskScore;
    }
    
    function analyzeContract(address contractAddr) external view returns (AnalysisResult memory) {
        AnalysisResult memory result;
        
        // Check for reentrancy patterns
        result.hasReentrancy = checkReentrancy(contractAddr);
        
        // Check for integer overflow
        result.hasOverflow = checkOverflow(contractAddr);
        
        // Check access control
        result.hasAccessControl = checkAccessControl(contractAddr);
        
        // Calculate risk score
        result.riskScore = calculateRiskScore(result);
        
        return result;
    }
}

// Example: Automated vulnerability detection
function checkReentrancy(address contractAddr) internal view returns (bool) {
    // Check if external calls happen before state updates
    // This is a simplified example - real analysis is more complex
    bytes memory code = getCode(contractAddr);
    
    // Look for patterns like: call -> state update
    // This would require more sophisticated analysis
    return false; // Placeholder
}`
        }
      ],
      keyTakeaways: [
        "Systematic analysis helps identify vulnerabilities systematically",
        "Common patterns include reentrancy, overflow, and access control issues",
        "Automated tools complement manual analysis",
        "Economic analysis is crucial for understanding attack vectors"
      ]
    },
    "defi-hack-case-studies": {
      title: "Case Studies: Major DeFi Hacks",
      introduction:
        "Learn from real-world DeFi hacks through detailed case studies and understand the lessons learned from each incident.",
      sections: [
        {
          id: "the-dao-hack",
          title: "The DAO Hack (2016)",
          content: `The DAO hack was one of the first major DeFi incidents.

What Happened:
- Attacker exploited reentrancy vulnerability
- Stole 3.6 million ETH (worth $60M at the time)
- Led to Ethereum hard fork (Ethereum Classic split)

Lessons Learned:
- External calls before state updates are dangerous
- Need for comprehensive testing and auditing
- Importance of emergency pause mechanisms`,
          codeExample: `// Vulnerable DAO code pattern
function splitDAO(uint256 proposalID, address newCurator) external {
    // ... validation code ...
    
    // Vulnerable: External call before state update
    if (!newCurator.call.value(0)()) {
        throw;
    }
    
    // State update after external call
    balances[msg.sender] = 0;
    withdrawRewardFor(msg.sender);
}

// Example: How the attack worked
contract Attacker {
    function attack() external {
        // 1. Call splitDAO
        dao.splitDAO(proposalId, address(this));
        
        // 2. In the fallback function, call splitDAO again
        // This exploits the reentrancy vulnerability
    }
    
    fallback() external payable {
        if (gasleft() > 100000) {
            dao.splitDAO(proposalId, address(this));
        }
    }
}`
        },
        {
          id: "poly-network-hack",
          title: "Poly Network Hack (2021)",
          content: `The largest DeFi hack in history.

What Happened:
- Attacker stole $611 million across multiple chains
- Exploited vulnerability in cross-chain bridge
- Attacker returned most funds after being identified

Technical Details:
- Vulnerability in multi-signature verification
- Attacker could forge signatures
- Cross-chain message validation bypass

Key Lessons:
- Multi-signature systems need careful implementation
- Cross-chain bridges are high-risk components
- Transparency can help recover funds`,
          codeExample: `// Example: Multi-sig vulnerability pattern
contract MultiSigWallet {
    mapping(bytes32 => bool) public executed;
    
    function executeTransaction(
        address to,
        uint256 value,
        bytes calldata data,
        bytes[] calldata signatures
    ) external {
        bytes32 txHash = getTransactionHash(to, value, data);
        require(!executed[txHash], "Transaction already executed");
        
        // Vulnerable: Insufficient signature validation
        require(validateSignatures(txHash, signatures), "Invalid signatures");
        
        executed[txHash] = true;
        (bool success, ) = to.call{value: value}(data);
        require(success, "Transaction failed");
    }
}`
        }
      ],
      keyTakeaways: [
        "Reentrancy attacks exploit external calls before state updates",
        "Multi-signature systems need robust validation",
        "Cross-chain bridges are high-risk components",
        "Emergency response plans are crucial for DeFi protocols"
      ]
    }
  },

  "ai-defi": {
    "ai-in-defi-overview": {
      title: "AI in DeFi: Use Cases",
      introduction:
        "Explore how ML enhances DeFi across risk, execution and analytics.",
      sections: [
        { id: "risk", title: "Risk Scoring", content: `Predict protocol risk using anomaly detection and on-chain metrics.

Core metrics: TVL volatility, contract upgrade frequency, admin key usage, oracle dispersion, historical incident density.

Approach: Unsupervised (isolation forest) to flag outliers; supervised labeling via incident datasets for protocol-level risk.` },
        { id: "execution", title: "Execution Optimization", content: `Use reinforcement learning for order routing and slippage control.

Policy constraints: gas budget, venue availability, sandwich-risk heuristics, max slippage bps.

Reward design: after-fee PnL with turnover penalty and adverse selection penalty.` },
        { id: "data-quality", title: "Data Quality & Bias", content: `Handle survivorship bias, look-ahead bias, and stale oracle edges.

Safeguards: time-align features to t-1, TWAP sensitive feeds, drop illiquid minutes, enforce schema versioning in feature store.` },
        { id: "monitoring", title: "Model Monitoring", content: `Track live drift and performance with shadow-mode deployments.

KPIs: AUC/accuracy for direction; realized slippage vs expected; turnover vs budget; drawdown and exposure caps.` , codeExample: `# Sketch: drift checks
import pandas as pd

def psi(expected: pd.Series, actual: pd.Series, bins=10):
    q = expected.quantile([i/bins for i in range(bins+1)])
    e = pd.cut(expected, q, include_lowest=True).value_counts(normalize=True)
    a = pd.cut(actual,   q, include_lowest=True).value_counts(normalize=True)
    return ((a - e) * (a.add(1e-9)/e.add(1e-9)).apply(lambda x: (0 if x<=0 else (a.index.size * 0 + 1))*0).add(0)).sum()` }
      ],
      keyTakeaways: [
        "AI augments—not replaces—DeFi primitives",
        "Robustness > raw accuracy in adversarial markets",
        "Strict time alignment prevents information leakage"
      ]
    },
    "portfolio-management-ai": {
      title: "AI-Powered Portfolio Management",
      introduction:
        "From rule-based rebalancing to predictive allocation.",
      sections: [
        { id: "signals", title: "Signals", content: `On-chain flows, volatility, funding rates, yields.` },
        { id: "constraints", title: "Constraints", content: `Risk budgets, slippage, gas costs.` },
        { id: "policy", title: "Policy Design", content: `Position sizing with Kelly-like caps; max drawdown stops; turnover control.` },
        { id: "code", title: "Pandas Backtest Template", content: `Practical template below.`, codeExample: `# Simple moving-average policy (illustrative)
import pandas as pd

def signal(df: pd.DataFrame) -> pd.Series:
    fast = df['price'].rolling(10).mean()
    slow = df['price'].rolling(50).mean()
    return (fast > slow).astype(int) - (fast < slow).astype(int)

def backtest(df: pd.DataFrame, fee_bps=5) -> pd.DataFrame:
    sig = signal(df).shift(1).fillna(0)
    ret = df['price'].pct_change().fillna(0)
    gross = sig * ret
    turn = sig.diff().abs().fillna(0)
    fee = turn * (fee_bps/1e4)
    net = gross - fee
    eq = (1+net).cumprod()
    return pd.DataFrame({'net': net, 'equity': eq})` },
        { id: "risk-parity", title: "Risk Parity Overlay", content: `Normalize position sizes by inverse volatility to stabilize risk contribution.`, codeExample: `# Volatility targeting overlay
import numpy as np

def vol_target_weights(ret: pd.Series, target_vol=0.2):
    rolling = ret.rolling(50).std().replace(0, np.nan).fillna(method='bfill')
    w = (target_vol / (rolling * np.sqrt(252))).clip(-1, 1)
    return w` }
      ],
      keyTakeaways: ["Combine predictive signals with strict risk controls"]
    },
    "predictive-trading": {
      title: "Predictive Trading & Liquidation Protection",
      introduction:
        "Forecast moves and anticipate liquidation cascades.",
      sections: [
        { id: "features", title: "Features", content: `Orderbook imbalance, perp funding, AMM skew, oracle spreads.` },
        { id: "xgb", title: "XGBoost Template", content: `Gradient-boost tree for direction classification.`, codeExample: `# Minimal XGBoost template
import xgboost as xgb
import pandas as pd

def train(df: pd.DataFrame):
    X = df[['imb', 'skew', 'funding']]
    y = (df['ret1h'] > 0).astype(int)
    dtrain = xgb.DMatrix(X, label=y)
    params = {'max_depth': 3, 'eta': 0.1, 'objective': 'binary:logistic', 'eval_metric': 'auc'}
    booster = xgb.train(params, dtrain, num_boost_round=200)
    return booster` },
        { id: "liquidation-buffer", title: "Liquidation Buffering", content: `Estimate liquidation distance and size positions to maintain buffer under volatility stress.`, codeExample: `# Buffer estimation sketch
import numpy as np

def liquidation_distance(price, entry, lev, maint_margin=0.06):
    # illustrative calc; varies by venue
    return (1 - (1/lev) + maint_margin) * entry` }
      ],
      keyTakeaways: ["Models must handle regime shifts and outliers"]
    },
    "ai-tools-practice": {
      title: "Using AI Tools for DeFi Analysis",
      introduction:
        "How to leverage notebooks and APIs to study DeFi data.",
      sections: [
        { id: "stack", title: "Analysis Stack", content: `Dune/Flipside for data; Python notebooks for modeling; on-chain APIs for live metrics.` },
        { id: "feature-store", title: "Feature Store", content: `Persist computed features (TWAP, LP skew) with versioning to avoid leakage.` },
        { id: "eval", title: "Evaluation Harness", content: `Standardize backtest metrics and reports for apples-to-apples comparisons.`, codeExample: `# Metrics harness
def metrics(net: pd.Series):
    eq = (1+net).cumprod()
    dd = (eq/eq.cummax()-1).min()
    sharpe = net.mean()/net.std()*np.sqrt(252)
    return dict(dd=float(dd), sharpe=float(sharpe))` }
      ],
      keyTakeaways: ["Prefer reproducible notebooks and open datasets"]
    },
    "price-prediction-model": {
      title: "Price Prediction Models (Concept)",
      introduction:
        "Understand modeling steps without building or running code.",
      sections: [
        { id: "workflow", title: "Workflow", content: `Data ingestion → Feature engineering → Model selection → Validation → Monitoring.` },
        { id: "validation", title: "Validation", content: `Walk-forward, time-series split, and live shadow modes to control overfitting.` },
        { id: "robustness", title: "Robustness Checks", content: `Sensitivity analysis, ablation studies, stress scenarios, and regime filtering.` }
      ],
      keyTakeaways: ["Avoid overfitting; emphasize validation"]
    },
    "trading-bot-challenge": {
      title: "Trading Bots: Architecture & Limits",
      introduction:
        "Design considerations and realistic expectations.",
      sections: [
        { id: "architecture", title: "Architecture", content: `Signals, risk engine, execution adapter, monitoring.` },
        { id: "bot-template", title: "Bot Template (Read-only)", content: `Skeleton bot loop.`, codeExample: `# Pseudo bot loop
class Bot:
    def __init__(self, ex):
        self.ex = ex
    def tick(self):
        sig = self.signal()
        if sig > 0: self.ex.buy()
        elif sig < 0: self.ex.sell()
        else: pass
    def signal(self):
        return 0` },
        { id: "limits", title: "Limits & Safety", content: `Circuit breakers, per-trade caps, max daily loss, and kill-switches are mandatory in adversarial environments.` }
      ],
      keyTakeaways: ["Safety limits and circuit breakers are essential"]
    },
    "ai-defi-quiz": {
      title: "AI & DeFi Mastery Quiz",
      introduction: "Answer all questions to complete the chapter.",
      sections: [
        { id: "quiz", title: "Comprehensive Quiz", content: `Tough quiz for AI & DeFi.` }
      ],
      keyTakeaways: ["Understand risk, validation, and practical implementation"]
    }
  }
  ,
  "build-defi-app": {
    "development-environment": {
      title: "Setting Up Development Environment",
      introduction: "Configure a clean, reproducible stack for Arbitrum dApp development.",
      sections: [
        { id: "tools", title: "Tools & Versions", content: `Node LTS, pnpm/npm, Hardhat/Foundry, TypeScript, dotenv. Pin versions to avoid drift.` },
        { id: "hardhat-init", title: "Hardhat Project Init", content: `Scaffold a minimal Hardhat project with Ethers and TypeChain.`, codeExample: `# Commands (reference)
pnpm dlx hardhat --yes
pnpm add --save-dev @nomicfoundation/hardhat-toolbox dotenv typechain @typechain/ethers-v5
pnpm add ethers` },
        { id: "networks", title: "Arbitrum Networks", content: `Add Arbitrum One / Sepolia configs with RPC and chain IDs.`, codeExample: `// hardhat.config.ts (excerpt)
import dotenv from 'dotenv';
dotenv.config();

export default {
  networks: {
    arbitrumSepolia: {
      url: process.env.ARB_SEPOLIA_RPC!,
      accounts: [process.env.PRIVATE_KEY!],
      chainId: 421614
    }
  }
}` }
      ],
      keyTakeaways: ["Version pinning prevents build drift", "Configure Arbitrum networks early"]
    },
    "solidity-defi-basics": {
      title: "Solidity for DeFi Development",
      introduction: "Essential interfaces and patterns you will reuse across DeFi.",
      sections: [
        { id: "erc20", title: "ERC-20 Essentials", content: `approve/allowance/transferFrom underpin DeFi flows.` , codeExample: `interface IERC20 {
  function balanceOf(address) external view returns (uint);
  function approve(address spender, uint amount) external returns (bool);
  function transfer(address to, uint amount) external returns (bool);
  function transferFrom(address from, address to, uint amount) external returns (bool);
}` },
        { id: "safetransfer", title: "Safe Transfers", content: `Always check return values; prefer SafeERC20 wrappers when writing real code.` },
        { id: "reentrancy", title: "Reentrancy Guard", content: `Checks-effects-interactions and guards for state safety.`, codeExample: `modifier nonReentrant(){require(!_lock,"locked");_lock=true;_;_lock=false;}` }
      ],
      keyTakeaways: ["ERC-20 patterns power approvals and transfers", "Apply checks-effects-interactions"]
    },
    "smart-contract-deployment": {
      title: "Deployment Concepts & Code Examples",
      introduction: "Deploy to Arbitrum testnets safely with environment separation.",
      sections: [
        { id: "scripts", title: "Deploy Script", content: `Minimal deploy script pattern with constructor args.`, codeExample: `// scripts/deploy.ts
import { ethers } from 'hardhat';

async function main(){
  const Token = await ethers.getContractFactory('MyToken');
  const token = await Token.deploy('MyToken','MTK');
  await token.deployed();
  console.log('Token at', token.address);
}
main();` },
        { id: "envs", title: "Environments", content: `Separate .env for local/test/staging with distinct RPCs and keys.` }
      ],
      keyTakeaways: ["Keep deploy scripts minimal and idempotent", "Isolate secrets in .env"]
    },
    "frontend-integration": {
      title: "Frontend Integration Concepts & Code",
      introduction: "Connect wallet, read state, and prepare safe write flows.",
      sections: [
        { id: "connect", title: "Wallet Connect + Network", content: `Detect and request Arbitrum network.` , codeExample: `// connect.ts (snippet)
import { ethers } from 'ethers';
export async function getProvider(){
  const anyWin = window as any;
  const provider = new ethers.BrowserProvider(anyWin.ethereum);
  const network = await provider.getNetwork();
  return { provider, network };
}` },
        { id: "read", title: "Read Path", content: `Use read-only calls for balances and metadata.` , codeExample: `// read.ts
export async function balanceOf(provider, token, user){
  const erc20 = new ethers.Contract(token, IERC20_ABI, provider);
  return await erc20.balanceOf(user);
}` },
        { id: "write", title: "Write Path (Safe)", content: `Prompt approvals explicitly and surface gas/nonce guidance.` }
      ],
      keyTakeaways: ["Separate read and write flows", "Always show network and address context"]
    },
    "contract-interaction": {
      title: "Smart Contract & Frontend Integration",
      introduction: "Map UI actions to contract calls with clear states and errors.",
      sections: [
        { id: "states", title: "UI States", content: `idle → approving → pending → success/error; disable buttons accordingly.` },
        { id: "errors", title: "Error Handling", content: `Handle user rejection, insufficient funds, and RPC rate limits gracefully.` },
        { id: "code", title: "Approve + Transfer Pattern", content: `A common two-step pattern in DeFi UIs.`, codeExample: `// ui-actions.ts
export async function approve(erc20, spender, amount){
  const tx = await erc20.approve(spender, amount);
  await tx.wait();
}
export async function transferFrom(router, amount, path){
  const tx = await router.swapExactTokensForTokens(amount,0,path,user,Date.now()/1000+300);
  await tx.wait();
}` }
      ],
      keyTakeaways: ["Explicit user flows reduce mistakes", "Surface confirmations and receipts"]
    },
    "dex-integration": {
      title: "Integrating with DEX Protocols (Concept)",
      introduction: "Plan a DEX swap integration with approvals, paths, and slippage controls.",
      sections: [
        { id: "pathing", title: "Routing & Paths", content: `Prefer deep-liquidity routes; fetch quotes before committing.` },
        { id: "slip", title: "Slippage & Deadlines", content: `Protect users with minOut and short deadlines.`, codeExample: `// swap-helpers.ts
export function calcMinOut(expectedOut, slippageBps){
  return expectedOut * (10000 - slippageBps) / 10000;
}` },
        { id: "approvals", title: "Approvals", content: `Request minimal allowances; reset nonces on stuck txs.` }
      ],
      keyTakeaways: ["Quote first, then guard execution", "Minimize approvals scope"]
    },
    "capstone-project": {
      title: "Capstone: Putting It All Together",
      introduction: "Design a minimal Arbitrum token swapper dApp end-to-end (read-only templates).",
      sections: [
        { id: "arch", title: "Architecture", content: `Contracts: ERC-20 interactions only; Frontend: connect/read/approve/swap; Backend: optional quotes caching.` },
        { id: "checklist", title: "Build Checklist", content: `Network config, ABI wiring, allowance UX, slippage input, receipt display, error toasts.` },
        { id: "template", title: "Glue Code Template", content: `Tie together provider, contract ABI, and UI actions.`, codeExample: `// glue.ts (illustrative)
export async function init(){ /* provider, signer, contracts */ }
export async function quote(){ /* fetch expectedOut */ }
export async function swap(){ /* approve if needed, then swap with minOut */ }` }
      ],
      keyTakeaways: ["Keep UX explicit and safe", "Start minimal, then iterate"]
    }
  }
};

// Export utility functions for content access
export function getTheoryContent(
  chapterId: string,
  sectionId: string
): TheoryContent | null {
  return defiTheoryContent[chapterId]?.[sectionId] || null;
}

export function getChapterSections(chapterId: string): string[] {
  return Object.keys(defiTheoryContent[chapterId] || {});
}

export function getAllTheoryChapters(): string[] {
  return Object.keys(defiTheoryContent);
}
