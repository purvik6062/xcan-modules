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
• **Decentralized**: No single point of control or failure
• **Permissionless**: Open to anyone with an internet connection
• **Transparent**: All transactions are publicly verifiable on the blockchain
• **Composable**: DeFi protocols can be combined like building blocks
• **Global**: Accessible 24/7 from anywhere in the world

Unlike traditional finance, DeFi operates through smart contracts - self-executing contracts with terms directly written into code.`,
        },
        {
          id: "traditional-vs-defi",
          title: "Traditional Finance vs DeFi",
          content: `**Traditional Finance (TradFi):**
• Centralized institutions control access and operations
• Limited operating hours (9 AM - 5 PM, weekdays only)
• Geographical restrictions and compliance requirements
• High fees due to multiple intermediaries
• Slower settlement times (days for international transfers)
• Limited transparency in operations

**Decentralized Finance (DeFi):**
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
          content: `1. **Self-Custody**: Users maintain full control of their assets
2. **Transparency**: All code and transactions are publicly auditable
3. **Interoperability**: Different protocols can seamlessly interact
4. **Innovation**: Rapid development and deployment of new features
5. **Financial Inclusion**: Banking services for the unbanked
6. **Programmable Money**: Smart contracts enable complex financial logic`,
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
          content: `**Centralized Finance Architecture:**
• Client-Server Model: Central servers manage all operations
• Single Points of Failure: If the central system fails, everything stops
• Hierarchical Structure: Multiple layers of management and control
• Closed Source: Proprietary systems with limited transparency

**Decentralized Finance Architecture:**
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
          content: `**Centralized Control:**
• Banks and institutions hold custody of user funds
• Users must trust third parties with their assets
• Account freezing and restrictions are common
• Limited control over transaction fees and timing

**Decentralized Control:**
• Users maintain full custody through private keys
• No need to trust third parties with assets
• Censorship resistance - transactions cannot be blocked
• Users control gas fees and transaction priority`,
        },
        {
          id: "accessibility",
          title: "Accessibility and Inclusion",
          content: `**Traditional Finance Barriers:**
• Credit checks and identity verification required
• Minimum balance requirements
• Geographic restrictions (not available in all countries)
• Banking hours and business day limitations
• Complex onboarding processes

**DeFi Accessibility:**
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
          content: `**The Scaling Problem:**
Ethereum, while secure and decentralized, faces limitations:
• High gas fees during network congestion
• Limited transaction throughput (~15 TPS)
• Slow confirmation times during peak usage

**Layer 2 Solutions:**
Layer 2 networks process transactions off-chain while inheriting Ethereum's security:
• Optimistic Rollups (like Arbitrum)
• ZK-Rollups
• State Channels
• Sidechains

**Arbitrum's Optimistic Rollup:**
• Assumes transactions are valid by default
• Uses fraud proofs to challenge invalid transactions
• Bundles hundreds of transactions into single Ethereum transaction
• Reduces costs by 90%+ while maintaining security`,
        },
        {
          id: "arbitrum-advantages",
          title: "Arbitrum's DeFi Advantages",
          content: `**Cost Efficiency:**
• Gas fees typically 90-95% lower than Ethereum mainnet
• Makes small transactions economically viable
• Enables micro-transactions and frequent rebalancing

**Speed and Throughput:**
• Near-instant transaction confirmation
• Higher transaction throughput
• Better user experience for DeFi applications

**Ethereum Compatibility:**
• Full EVM compatibility - existing contracts work without modification
• Same developer tools and infrastructure
• Seamless user experience with familiar wallets

**Security Inheritance:**
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
          content: `**Major DeFi Protocols on Arbitrum:**

**Decentralized Exchanges:**
• Uniswap V3 - Leading AMM with concentrated liquidity
• SushiSwap - Multi-feature DEX with farming rewards
• Balancer - Weighted pool AMM for portfolio management
• Curve - Specialized for stablecoin trading

**Arbitrum-Native Protocols:**
• GMX - Decentralized perpetual exchange with real yield
• Camelot - Native DEX with innovative tokenomics
• Radiant Capital - Cross-chain lending protocol
• Plutus - Liquid staking and yield optimization

**Lending and Borrowing:**
• Aave - Multi-collateral lending protocol
• Compound - Algorithmic money markets
• Radiant - Cross-chain lending with omnichain yields

**Yield Optimization:**
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

  "decentralized-exchanges": {
    "amm-vs-orderbook": {
      title: "Automated Market Makers vs Order Book Exchanges",
      introduction:
        "Understanding the fundamental difference between AMMs and traditional order book exchanges is crucial for DeFi trading success.",
      sections: [
        {
          id: "orderbook-model",
          title: "Traditional Order Book Model",
          content: `**How Order Books Work:**
• Buyers place bids (buy orders) at specific prices
• Sellers place asks (sell orders) at specific prices
• Trades execute when bid and ask prices match
• Market makers provide liquidity by placing orders

**Advantages:**
• Precise price discovery
• No slippage for limit orders
• Advanced order types (stop-loss, trailing stops)
• Suitable for large trades with minimal price impact

**Disadvantages:**
• Requires active market makers for liquidity
• Can have large bid-ask spreads in illiquid markets
• Complex for casual users
• Vulnerable to front-running and MEV attacks`,
        },
        {
          id: "amm-model",
          title: "Automated Market Maker Model",
          content: `**How AMMs Work:**
• Liquidity pools contain paired tokens (e.g., ETH/USDC)
• Mathematical formulas determine prices automatically
• Traders swap directly against the pool
• Liquidity providers earn fees from trading volume

**Common AMM Formulas:**
• Constant Product: x × y = k (Uniswap V2)
• Constant Mean: (x^w1 × y^w2) = k (Balancer)
• Concentrated Liquidity: Price ranges (Uniswap V3)
• Stable Curve: Optimized for similar assets (Curve)

**Advantages:**
• Always available liquidity (no empty order books)
• Simple user interface - just swap
• Passive income for liquidity providers
• Resistant to market manipulation

**Disadvantages:**
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
          content: `**Liquidity Provision:**
• Order Books: Professional market makers required
• AMMs: Anyone can provide liquidity and earn fees

**Price Discovery:**
• Order Books: Efficient price discovery through order matching
• AMMs: Price discovery through arbitrage trading

**Capital Efficiency:**
• Order Books: High efficiency - capital only used when orders match
• AMMs: Lower efficiency - capital sits in pools even when not trading

**User Experience:**
• Order Books: Complex interfaces, multiple order types
• AMMs: Simple swap interface, instant execution

**Gas Costs:**
• Order Books: High gas costs for order placement/cancellation
• AMMs: Single transaction for swaps, more gas efficient

**Suitable Use Cases:**
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
          content: `**Revolutionary Concentrated Liquidity:**
Unlike V2's full-range liquidity, V3 allows liquidity providers to concentrate capital in specific price ranges:

• **Active Liquidity Management**: Choose price ranges where you want to provide liquidity
• **Capital Efficiency**: Up to 4000x more efficient than V2
• **Higher Fee Earning**: More trading volume flows through your positions
• **Flexible Strategies**: Different ranges for different market conditions

**Key Features on Arbitrum:**
• Multiple fee tiers: 0.01%, 0.05%, 0.3%, 1%
• NFT positions representing unique liquidity positions
• Advanced position management tools
• Integration with yield farming protocols

**Fee Tier Selection:**
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
          content: `**Beyond Simple AMM:**
SushiSwap has evolved into a comprehensive DeFi platform:

**Core AMM Features:**
• Constant product AMM similar to Uniswap V2
• Multiple pool types and fee structures
• Cross-chain bridge integration
• Limit order functionality

**Additional DeFi Services:**
• **Kashi Lending**: Isolated lending markets
• **BentoBox**: Optimized token vault system
• **Miso**: Token launch platform
• **Shoyu**: NFT marketplace integration

**Arbitrum-Specific Benefits:**
• Lower gas costs enable more frequent rebalancing
• Cross-chain swaps with reduced bridge fees
• Enhanced yield farming opportunities
• Integration with Arbitrum-native protocols`,
        },
        {
          id: "arbitrum-advantages",
          title: "Why These Protocols Excel on Arbitrum",
          content: `**Cost Reduction Impact:**
• Uniswap V3 position management becomes economical
• Frequent rebalancing and compounding possible
• Small trades now profitable after fees
• Advanced strategies accessible to retail users

**Enhanced Functionality:**
• Real-time arbitrage opportunities
• MEV protection through lower latency
• Cross-chain yield opportunities
• Integration with native Arbitrum protocols

**Liquidity Incentives:**
• Arbitrum Foundation grants and incentives
• Protocol-specific reward programs
• Reduced costs increase LP profitability
• Growing ecosystem attracts more capital

**Developer Benefits:**
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
          content: `**Revolutionary Perpetual Trading:**
GMX pioneered a new model for decentralized derivatives:

**Multi-Asset Pool (GLP):**
• Single pool backing all trades
• Contains ETH, BTC, USDC, USDT, and other major assets
• Liquidity providers earn from trading fees and spread
• Real asset backing (not synthetic)

**Zero Price Impact Trading:**
• Trades execute at oracle prices
• No slippage regardless of size
• Up to 50x leverage available
• Minimal liquidation risk from price manipulation

**Unique Features:**
• Real yield distribution to $GMX stakers
• GLP auto-rebalancing based on trader demand
• Anti-MEV design with oracle pricing
• Cross-margin positions across multiple assets

**Tokenomics:**
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
          content: `**Built for Arbitrum Ecosystem:**
Camelot was designed from the ground up for Arbitrum:

**Innovative AMM Design:**
• Algebra-based concentrated liquidity
• Dynamic fees based on volatility
• Multiple pool types for different use cases
• Optimized for Arbitrum's specific characteristics

**Ecosystem Integration:**
• Deep integration with Arbitrum projects
• Native support for Arbitrum tokens
• Partnerships with major protocols
• Strategic positioning in the ecosystem

**Unique Features:**
• **Spade Pools**: Boosted yield farming
• **Round Table**: Governance mechanism
• **xGRAIL**: Revenue sharing token
• **Nitro Pools**: High-yield farming opportunities

**Community-Driven:**
• Arbitrum-native governance
• Community treasury management
• Ecosystem partnerships and integrations
• Focus on sustainable tokenomics`,
        },
        {
          id: "native-advantages",
          title: "Advantages of Native Protocols",
          content: `**Arbitrum-Specific Optimization:**
• Designed for low-fee environment
• Optimized smart contracts for Arbitrum VM
• Integration with Arbitrum infrastructure
• Access to ecosystem incentives and grants

**Innovation Opportunities:**
• Features impossible on high-fee networks
• Real-time rebalancing and optimization
• Complex multi-step strategies
• Micro-transaction enabled services

**Community and Governance:**
• Aligned with Arbitrum ecosystem goals
• Native community participation
• Direct relationships with Arbitrum Foundation
• Ecosystem-wide collaborations

**Sustainable Economics:**
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
          content: `**Definition:**
Yield vaults are smart contracts that pool user funds and automatically execute yield-generating strategies to maximize returns while minimizing risk and complexity for users.

**Key Components:**
• **Strategy Contract**: Implements the yield-generating logic
• **Vault Contract**: Manages user deposits and withdrawals
• **Governance**: Oversees strategy approval and parameters
• **Fee Structure**: Compensation for protocol and strategists

**How Vaults Work:**
1. Users deposit tokens into the vault
2. Vault issues shares representing ownership
3. Strategy deploys funds across multiple protocols
4. Yields are automatically harvested and compounded
5. Users can withdraw their share of the pool anytime

**Benefits:**
• **Automation**: No manual position management
• **Optimization**: Professional strategy management
• **Gas Efficiency**: Shared costs across users
• **Diversification**: Complex multi-protocol strategies
• **Compounding**: Automatic reward reinvestment`,
        },
        {
          id: "vault-types",
          title: "Types of Yield Vaults",
          content: `**Single-Asset Vaults:**
• Deposit one token type (ETH, USDC)
• Strategies: lending, staking, liquidity provision
• Lower complexity and risk
• Examples: Aave lending, staking vaults

**LP Token Vaults:**
• Deposit liquidity provider tokens
• Often involve farming additional rewards
• Higher yields but impermanent loss risk
• Examples: Uniswap LP farming

**Stable Coin Vaults:**
• Focus on USD-pegged assets
• Lower volatility, steady yields
• Popular for risk-averse farming

**Multi-Strategy Vaults:**
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
          content: `**Lending Strategies:**
• Deploy to lending protocols (Aave, Compound)
• Earn interest from borrowers
• Auto-compound reward tokens
• Risk: Protocol risk, rate volatility

**Liquidity Provision:**
• Provide liquidity to DEX pools
• Earn trading fees from swaps
• Often with farming rewards
• Risk: Impermanent loss, depegging

**Staking Strategies:**
• Stake governance tokens for rewards
• Liquid staking for additional yield
• Lock tokens for boosted rewards
• Risk: Slashing, token volatility`,
        },
        {
          id: "advanced-strategies",
          title: "Advanced Multi-Protocol Strategies",
          content: `**Delta-Neutral Strategies:**
• Long spot + short perpetual position
• Earn funding rates while hedging
• Combined with LP or lending yields
• Risk: Funding changes, liquidation

**Leveraged Yield Farming:**
• Borrow assets to increase size
• Multiply yields through leverage
• Recursive lending for efficiency
• Risk: Liquidation, rate changes

**Algorithmic Rebalancing:**
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
          content: `**Yearn's Evolution:**
From simple yield optimization to comprehensive ecosystem:

**Key Features:**
• V2 Vaults with sophisticated automation
• Open-source strategy framework
• YFI governance token control
• Integrated insurance options

**Arbitrum Benefits:**
• Lower gas enables frequent harvesting
• Smaller minimums increase accessibility
• Cross-chain strategy opportunities
• Native protocol integration`,
        },
        {
          id: "beefy-finance",
          title: "Beefy Finance: Multi-Chain Optimization",
          content: `**Beefy's Approach:**
Auto-compounding yield farms across chains:

**Core Strengths:**
• Maximized yields through auto-compounding
• Multi-chain consistent experience
• Community-driven development
• Safety-first audit processes

**Arbitrum Advantages:**
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
          content: `**Definition:**
Impermanent loss is the temporary loss experienced by liquidity providers due to volatility in a trading pair, representing the difference between holding tokens versus providing liquidity.

**Why "Impermanent"?**
• Loss only realized when withdrawing
• Disappears if prices return to original ratios
• Rarely happens in practice
• Can become permanent

**Key Mechanics:**
• Occurs when token prices diverge
• More divergence = more loss
• Affects all AMM liquidity providers
• Cannot be avoided, only managed`,
        },
        {
          id: "il-mechanics",
          title: "How Impermanent Loss Works",
          content: `**Example:**
Start: 1 ETH + 2000 USDC (ETH = $2000)

**ETH doubles to $4000:**
• LP: 0.707 ETH + 2828 USDC = $5656
• Hold: 1 ETH + 2000 USDC = $6000
• Loss: $344 (5.72%)

**ETH halves to $1000:**
• LP: 1.414 ETH + 1414 USDC = $2828
• Hold: 1 ETH + 2000 USDC = $3000
• Loss: $172 (5.72%)

**Insights:**
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
          content: `**Common Vulnerabilities:**
• **Reentrancy**: Exploiting function calls before state updates
• **Integer Issues**: Math errors in calculations
• **Access Control**: Improper permissions
• **Logic Errors**: Flawed business logic

**Historical Examples:**
• The DAO (2016): $60M reentrancy attack
• bZx (2020): Flash loan manipulation
• Cream Finance (2021): Oracle manipulation
• Poly Network (2021): $611M largest hack

**Mitigation:**
• Comprehensive multi-firm audits
• Formal verification of critical functions
• Bug bounty programs
• Gradual rollouts with limits`,
        },
        {
          id: "oracle-attacks",
          title: "Oracle Manipulation Attacks",
          content: `**Attack Pattern:**
• Manipulate price feeds used by protocols
• Combined with flash loans for efficiency
• Exploit arbitrage during distortions
• Target low-liquidity assets

**Flash Loan Attack Steps:**
1. Borrow large amounts without collateral
2. Manipulate oracle prices via trades
3. Exploit price discrepancies
4. Repay loan, keep profits

**Defense Mechanisms:**
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
          content: `**Methodology:**
• **Automated Analysis**: Vulnerability scanners
• **Manual Review**: Line-by-line examination
• **Business Logic**: Intended vs actual behavior
• **Test Coverage**: Comprehensive scenarios
• **Documentation**: Specification alignment

**Phases:**
1. Scoping and objectives
2. Automated and manual testing
3. Finding documentation
4. Developer remediation
5. Final verification

**Severity Levels:**
• Critical: Immediate fund risk
• High: Significant security impact
• Medium: Moderate risk
• Low: Minor optimizations`,
        },
        {
          id: "reading-audits",
          title: "Evaluating Audit Reports",
          content: `**Report Components:**
• Executive summary with key findings
• Scope definition and limitations
• Methodology and tools used
• Detailed vulnerability descriptions
• Remediation recommendations
• Status of issue resolution

**Red Flags:**
• Unresolved critical/high issues
• Rushed timelines or limited scope
• Missing business logic review
• No post-deployment monitoring

**Due Diligence:**
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
  },
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
