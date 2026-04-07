export interface Chapter {
  id: string;
  title: string;
  description: string;
  icon: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  points: number;
  duration: string;
  status: "available" | "coming-soon";
  sections: Section[];
  badge?: {
    title: string;
    description: string;
    image: string;
  };
}

export interface Section {
  id: string;
  title: string;
  type:
    | "web3-evolution"
    | "wallet-fundamentals"
    | "blockchain-core"
    | "crypto-basics"
    | "nft-ownership"
    | "defi-trading"
    | "theory"
    | "quiz";
  status: "available" | "coming-soon";
  content?: StoryContent;
  estimatedTime: string;
}

export interface StoryContent {
  story: string;
  questions: StoryQuestion[];
}

export interface StoryQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  type: "multiple-choice" | "true-false";
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const web3BasicsChapters: Chapter[] = [
  {
    id: "web3-foundations",
    title: "Web3 Foundations",
    description:
      "Discover the evolution from Web1 to Web3 and learn about digital wallets - your gateway to the decentralized internet. Understand how Web3 empowers users with true ownership.",
    icon: "🌐",
    level: "Beginner",
    points: 10,
    duration: "1.5 hours",
    status: "available",
    badge: {
      title: "Web3 Pioneer",
      description: "Mastered Web3 Foundations",
      image: "/badges/web3-pioneer.png",
    },
    sections: [
      {
        id: "web1-to-web3-story",
        title: "The Web's Evolution Story",
        type: "web3-evolution",
        status: "available",
        estimatedTime: "20 min",
        content: {
          story: `# The Web's Evolution Story 🌐

Imagine the internet as a growing city. Let's take a journey through time to see how this digital city evolved...

## Chapter 1: Web1 - The Library Era (1990s-2000s) 📚

In the early days, the internet was like a massive digital library. Picture yourself walking into this library:

- Static Information: Every book (website) was already written and placed on the shelf. You could read them, but you couldn't add your own notes or change anything.
- One-Way Communication: Just like in a traditional library, you could only consume information. The librarian (website owner) put content on the shelves, and you could only read it.
- Simple Websites: These were like pamphlets - basic HTML pages with text, some images, and simple links.

Examples: Early websites like the first Amazon (just a book catalog), early news sites, personal homepage with basic information.

*The internet was READ-ONLY.*

## Chapter 2: Web2 - The Interactive City (2000s-Present) 🏙️

Then something magical happened! Our digital library transformed into a bustling interactive city:

- Social Platforms: Suddenly, you could write on walls (Facebook posts), share pictures (Instagram), and have conversations with people worldwide.
- User-Generated Content: Instead of just reading books, you could now write your own stories, create videos, and share them with everyone.
- Interactive Applications: The city got restaurants (food delivery apps), banks (online banking), entertainment centers (Netflix), and shopping malls (e-commerce).
- Data Collection: But here's the catch - in this city, everything you do is watched and recorded by big corporations who own most of the buildings.

Examples: Facebook, YouTube, Twitter, Amazon, Google - platforms where users create content but companies control the data.

*The internet became READ-WRITE, but centralized.*

## Chapter 3: Web3 - The Decentralized Nation (Present-Future) 🏛️

Now imagine our city evolving into something even more revolutionary - a decentralized nation where:

- You Own Your Data: Instead of corporations owning your information, you carry your own digital passport (wallet) that contains your identity, money, and assets.
- No Central Authority: There's no single mayor or government controlling everything. Instead, communities govern themselves using transparent rules (smart contracts).
- Digital Ownership: You can truly own digital items (NFTs), participate in governing protocols (DAOs), and even own pieces of the infrastructure itself.
- Interoperability: Your digital assets and identity work everywhere in this nation, not just in one company's territory.

Key Features:
- Decentralization: No single point of control
- Ownership: Users own their data and digital assets
- Transparency: All transactions are public and verifiable
- Permissionless: Anyone can participate without asking permission

*The internet becomes READ-WRITE-OWN, and decentralized.*

## The Future is Bright ✨

Web3 represents a fundamental shift from extractive platforms to community-owned networks. Instead of working for Big Tech companies for free (by providing data), users can now own and benefit from the platforms they help build.

This journey from Web1 to Web3 is like humanity's transition from feudalism to democracy - it's about giving power back to the people!`,
          questions: [
            {
              id: "q1",
              question: "What was the main characteristic of Web1?",
              options: [
                "Users could interact and create content",
                "Websites were static and read-only",
                "Users owned their data",
                "Everything was decentralized",
              ],
              correctAnswer: 1,
              explanation:
                "Web1 was characterized by static, read-only websites where users could only consume information, like reading books in a library.",
              type: "multiple-choice",
            },
            {
              id: "q2",
              question:
                "True or False: In Web3, users truly own their data and digital assets.",
              options: ["True", "False"],
              correctAnswer: 0,
              explanation:
                "True! Web3's core principle is user ownership - users control their data, identity, and digital assets through wallets and decentralized protocols.",
              type: "true-false",
            },
          ],
        },
      },
      {
        id: "mayas-wallet-journey",
        title: "Maya's First Digital Wallet",
        type: "wallet-fundamentals",
        status: "available",
        estimatedTime: "25 min",
        content: {
          story: `# Maya's First Digital Wallet Adventure 👛

Meet Maya, a college student who just heard about this thing called "Web3" and digital wallets. Let's follow her journey!

## Chapter 1: Maya's Confusion 🤔

Maya has always used her traditional bank account and credit cards. When her tech-savvy friend Alex mentions "digital wallets," Maya imagines some kind of digital version of her physical wallet.

"It's not just storing money," Alex explains, "it's like having a magical keychain that unlocks your entire digital identity!"

## Chapter 2: Understanding the Magic 🗝️

Alex sits down with Maya to explain:

Traditional Bank Account vs Digital Wallet:

*Traditional Bank Account:*
- The bank holds your money
- You need permission to access it
- Limited to one currency (dollars, euros, etc.)
- Bank controls your account and can freeze it
- You trust the bank to keep records

*Digital Wallet:*
- YOU hold your own "keys" (like having your own personal vault)
- No permission needed - you're always in control
- Can hold multiple cryptocurrencies and digital assets
- No single entity can freeze or control it
- Everything is recorded on a public, transparent ledger

## Chapter 3: Maya's First Wallet 🎒

Alex helps Maya create her first wallet. She's amazed to discover:

What a Digital Wallet Actually Contains:
1. Cryptocurrency (like digital cash)
2. NFTs (unique digital collectibles)
3. Identity credentials (proving who you are)
4. Access tokens (keys to enter different Web3 applications)
5. Transaction history (all publicly viewable but pseudonymous)

The Seed Phrase - Maya's Master Key:
Maya learns about her "seed phrase" - 12 special words that are like the master key to her entire digital life. Alex emphasizes: "These words ARE your wallet. Lose them, and you lose everything. Share them, and someone else controls your wallet."

## Chapter 4: Maya's First Transaction 💸

Alex sends Maya her first cryptocurrency - 0.01 ETH (Ethereum). Maya watches in wonder as:

1. Alex initiates the transaction from his wallet
2. The transaction goes to a network of computers around the world
3. These computers verify the transaction is valid
4. Within minutes, the ETH appears in Maya's wallet
5. Both can see the transaction recorded forever on the blockchain

"No bank, no fees, no waiting days - just direct peer-to-peer transfer!" Alex explains.

## Chapter 5: Maya Explores the Web3 World 🌍

With her new wallet, Maya can now:

- Connect to DeFi protocols (like decentralized banks)
- Buy and sell NFTs (digital art and collectibles)
- Participate in DAOs (decentralized organizations)
- Access exclusive communities (token-gated experiences)
- Play blockchain games (where she truly owns in-game items)

## Chapter 6: Maya's Realization 💡

After a week of exploring, Maya realizes her digital wallet isn't just about money - it's her:
- Digital identity
- Proof of membership in various communities
- Portfolio of digital assets
- Key to the entire Web3 ecosystem

"It's like having a magical passport that works everywhere in the digital world," Maya tells her other friends, "and the best part? I'M in control, not some big corporation!"

## The Wallet Revolution 🚀

Maya's journey represents millions of people discovering that digital wallets aren't just about storing cryptocurrency - they're about digital sovereignty, true ownership, and participating in a new internet where users control their own data and assets.

Welcome to the wallet revolution! 👛✨`,
          questions: [
            {
              id: "q1",
              question:
                "What's the main difference between a traditional bank account and a digital wallet?",
              options: [
                "Digital wallets can only store one type of currency",
                "With digital wallets, you control your own keys and assets",
                "Banks offer better security than digital wallets",
                "Digital wallets require permission from authorities to use",
              ],
              correctAnswer: 1,
              explanation:
                "The key difference is self-custody: with digital wallets, you control your own private keys and assets, while banks control your traditional accounts.",
              type: "multiple-choice",
            },
            {
              id: "q2",
              question:
                "True or False: A seed phrase is just a backup - you can always recover your wallet without it.",
              options: ["True", "False"],
              correctAnswer: 1,
              explanation:
                "False! Your seed phrase IS your wallet. If you lose it and don't have other recovery methods, you permanently lose access to your funds and assets.",
              type: "true-false",
            },
          ],
        },
      },
    ],
  },
  {
    id: "blockchain-cryptography",
    title: "Blockchain & Cryptography",
    description:
      "Dive deep into the technology that powers Web3. Understand how blocks form unbreakable chains, how distributed ledgers create trust without authorities, and how cryptographic keys secure your digital assets.",
    icon: "🔐",
    level: "Beginner",
    points: 10,
      duration: "2.5 hours",
    status: "available",
    badge: {
      title: "Crypto Guardian",
      description: "Mastered Blockchain and Cryptography",
      image: "/badges/crypto-guardian.png",
    },
    sections: [
      {
        id: "lunas-blockchain-mystery",
        title: "Luna's Blockchain Detective Story",
        type: "blockchain-core",
        status: "available",
        estimatedTime: "35 min",
        content: {
          story: `# Luna's Blockchain Detective Story 🔍

Luna is a curious investigator who loves solving puzzles. Today, she's about to uncover the mystery of how blockchain creates unbreakable digital truth!

## Chapter 1: The Mystery Begins 🕵️‍♀️

Luna receives a mysterious case: "How can digital information be trusted when it's so easy to copy and change things online?"

Her friend Marcus, a blockchain developer, grins: "Let me show you the most elegant solution ever invented - the blockchain!"

## Chapter 2: Understanding Blocks 📦

Marcus starts with a simple analogy:

"Imagine a magical notebook where:
- Each page is a 'block'
- Once something is written on a page, it can NEVER be erased or changed
- Each page is connected to the previous page in an unbreakable way
- Everyone in the world has an identical copy of this notebook"

What's in a Block?
Marcus shows Luna that each block contains:

1. Transaction Data: Records of what happened (like "Alice sent 5 coins to Bob")
2. Timestamp: Exactly when these transactions occurred
3. Hash: A unique fingerprint of all the data in the block
4. Previous Block Hash: A link to the block before it
5. Nonce: A special number that makes the block valid

"Think of each block as a sealed evidence box in your detective cases," Marcus explains.

## Chapter 3: The Chain of Truth ⛓️

Luna learns how blocks connect to form a chain:

Block 1 (Genesis Block):
- Contains: First transactions
- Hash: ABC123 (unique fingerprint)
- Previous Hash: 000000 (it's the first block)

Block 2:
- Contains: Next set of transactions  
- Hash: DEF456
- Previous Hash: ABC123 (links to Block 1)

Block 3:
- Contains: More transactions
- Hash: GHI789
- Previous Hash: DEF456 (links to Block 2)

"It's like a chain where each link is locked to the previous one," Luna realizes. "If someone tries to change Block 1, its hash changes, which breaks the connection to Block 2!"

## Chapter 4: The Tamper-Proof Investigation 🔒

Marcus demonstrates why blockchain is tamper-proof:

Scenario: A bad actor tries to change a transaction in Block 1

1. They change the data in Block 1
2. Block 1's hash changes (because content changed)
3. Block 2's "previous hash" no longer matches Block 1's new hash
4. The chain is broken! Everyone notices the tampering
5. The network rejects the invalid chain

"It's like trying to change evidence in a case," Luna understands, "but every other detective in the world has the original evidence and will immediately notice your tampering!"

## Chapter 5: The Global Network of Detectives 🌍

Luna discovers the most brilliant part:

Decentralized Verification:
- Thousands of computers (nodes) around the world each keep a complete copy
- When a new block is proposed, all nodes verify it independently
- A block is only accepted when the majority agrees it's valid
- If someone tries to cheat, their version is outnumbered and rejected

"It's like having thousands of honest detectives cross-checking every piece of evidence," Luna marvels.

## Chapter 6: Mining - The Security Guards 💎

Marcus explains who creates new blocks:

Miners are like security guards who:
- Collect pending transactions
- Solve a difficult mathematical puzzle (proof of work)
- The first to solve it gets to create the next block
- They're rewarded with cryptocurrency for their work
- This process secures the entire network

"They're like security guards who get paid to make sure no one tampers with the evidence!" Luna exclaims.

## Chapter 7: Real-World Applications 🌟

Luna realizes blockchain's detective superpowers work for many things:

Financial Transactions:
- Every Bitcoin transaction is permanently recorded
- No one can spend the same Bitcoin twice
- All transactions are publicly verifiable

Supply Chain Tracking:
- Track products from farm to table
- Verify authenticity of luxury goods
- Ensure ethical sourcing

Digital Identity:
- Prove ownership of digital assets
- Verify credentials and certificates
- Create tamper-proof records

Voting Systems:
- Create transparent, verifiable elections
- Prevent vote tampering
- Maintain voter privacy while ensuring integrity

## Chapter 8: Luna's Breakthrough 💡

"I get it now!" Luna exclaims. "Blockchain isn't just about cryptocurrency - it's about creating digital truth in a world where information can be easily copied and changed!"

The Blockchain Breakthrough:
- Immutable: Once recorded, data can't be changed
- Transparent: Everyone can verify the information
- Decentralized: No single point of failure or control
- Trustless: You don't need to trust any individual or institution

## The Great Discovery 🚀

Luna has solved the greatest mystery of the digital age: how to create trust without a central authority. Blockchain isn't just a technology - it's a new foundation for digital civilization!

"Every block is a piece of unbreakable truth," Luna concludes, "and every chain is a timeline of trust that no one can rewrite!"

Welcome to the age of digital truth! 🧱✨`,
          questions: [
            {
              id: "q1",
              question:
                "What happens if someone tries to change data in an old block?",
              options: [
                "The change is automatically accepted by the network",
                "The block's hash changes, breaking the chain and alerting the network",
                "Only the block creator can make changes",
                "The change is hidden from other users",
              ],
              correctAnswer: 1,
              explanation:
                "When data in a block changes, its hash (fingerprint) changes too, which breaks the connection to the next block. This tampering is immediately detected by the network.",
              type: "multiple-choice",
            },
            {
              id: "q2",
              question:
                "True or False: Blockchain requires trusting a central authority to verify transactions.",
              options: ["True", "False"],
              correctAnswer: 1,
              explanation:
                "False! Blockchain is 'trustless' - it uses cryptography and consensus among many independent nodes to verify transactions, eliminating the need for a central authority.",
              type: "true-false",
            },
          ],
        },
      },
    ],
  },
  {
    id: "digital-assets-defi",
    title: "Digital Assets & DeFi",
    description:
      "Explore the world of digital assets and decentralized finance. Learn about cryptocurrency, NFTs, and DeFi protocols through engaging stories about Sam, Zara, and Max.",
    icon: "💎",
    level: "Intermediate",
    points: 15,
    duration: "3 hours",
    status: "available",
    badge: {
      title: "DeFi Master",
      description: "Mastered Digital Assets and DeFi",
      image: "/badges/defi-master.png",
    },
    sections: [
      {
        id: "sams-crypto-discovery",
        title: "Sam's Cryptocurrency Discovery",
        type: "crypto-basics",
        status: "available",
        estimatedTime: "30 min",
        content: {
          story: `# Sam's Cryptocurrency Discovery 💰

Sam runs a small online art business and has always struggled with international payments. Let's see how discovering cryptocurrency changes everything!

## Chapter 1: Sam's Payment Problems 😤

Sam creates digital art and sells it worldwide. Their current payment struggles:

- High Fees: Credit card companies take 3-5% of every sale
- Slow Transfers: International payments take 3-7 business days
- Currency Conversion: Losing money on exchange rates
- Accessibility: Some customers can't access traditional banking
- Chargebacks: Buyers can reverse payments months later

"There has to be a better way," Sam thinks after losing $50 in fees on a $200 sale to Japan.

## Chapter 2: The Digital Money Revolution 💡

Sam's friend Rio introduces them to cryptocurrency:

"Imagine money that's..."
- Digital: Exists only in cyberspace, no physical form
- Borderless: Works the same whether you're sending to your neighbor or someone in another continent
- Programmable: Can be programmed to do smart things automatically
- Scarce: Unlike traditional money, you can't just print more
- Transparent: Every transaction is publicly recorded

## Chapter 3: Understanding Digital Scarcity 🎯

Rio explains a mind-bending concept:

Traditional Digital Items (NOT scarce):
- You can copy a digital photo infinite times
- Each copy is identical to the original
- No way to prove which copy is "original"

Cryptocurrency (DIGITALLY SCARCE):
- Each coin is unique and can't be duplicated
- You can't "copy-paste" Bitcoin like you would a photo
- The network keeps track of who owns what
- This creates digital scarcity for the first time in history!

"It's like having digital gold," Rio explains, "but better because you can send it instantly anywhere in the world."

## Chapter 4: Sam's First Bitcoin Transaction ⚡

Rio helps Sam set up a wallet and sends them $10 worth of Bitcoin. Sam watches in amazement:

1. Transaction starts at 2:15 PM
2. Network confirms the transaction within 10 minutes
3. Sam receives the Bitcoin directly in their wallet
4. Total cost: About $0.50 in network fees
5. No middleman: No bank, no credit card company, just direct transfer

"This is revolutionary!" Sam realizes. "I could have received this payment from anywhere in the world, at any time, in the same way!"

## Chapter 5: Types of Cryptocurrency 🌈

Sam learns there are different types of cryptocurrency, each with different purposes:

Bitcoin (BTC) - Digital Gold 🥇
- The first and most well-known cryptocurrency
- Limited supply: Only 21 million will ever exist
- Primarily used as a store of value
- Like digital gold that you can send anywhere

Ethereum (ETH) - Digital Oil ⛽
- Not just money, but fuel for a world computer
- Powers smart contracts and applications
- Platform for building decentralized apps
- Like owning shares in the internet's infrastructure

Stablecoins (USDC, USDT) - Digital Dollars 💵
- Cryptocurrencies pegged to real-world currencies
- $1 stablecoin = $1 USD (approximately)
- Combines crypto benefits with stable value
- Perfect for payments and saving without volatility

## Chapter 6: The Global Impact 🌍

Sam discovers cryptocurrency's global implications:

Financial Inclusion:
- 1.7 billion people worldwide are unbanked
- But many have smartphones and can access crypto
- Cryptocurrency provides financial services to everyone

Economic Freedom:
- People in countries with unstable currencies use crypto to protect savings
- Activists can receive donations without government interference
- Artists like Sam can sell globally without permission

Innovation:
- Programmable money enables new types of applications
- Decentralized finance (DeFi) recreates banking without banks
- New economic models become possible

## Chapter 7: Sam's Business Transformation 📈

Three months later, Sam's business has transformed:

- 30% of customers now pay with cryptocurrency
- 90% lower fees compared to credit cards
- Instant payments from anywhere in the world
- No chargebacks - payments are final
- New customer base from countries with limited banking

"Cryptocurrency isn't just about money," Sam tells other artists, "it's about economic freedom and connecting directly with customers worldwide!"

## The Money Revolution 🚀

Sam's journey illustrates how cryptocurrency represents the biggest innovation in money since the invention of banking. It's creating a global, inclusive, programmable financial system that works for everyone.

Welcome to the future of money! 💰✨`,
          questions: [
            {
              id: "q1",
              question:
                "What makes cryptocurrency different from traditional digital money like your bank account balance?",
              options: [
                "Cryptocurrency is only used for illegal activities",
                "Cryptocurrency is digitally scarce and can't be copied or duplicated",
                "Cryptocurrency is always more expensive to use",
                "Cryptocurrency can only be used online",
              ],
              correctAnswer: 1,
              explanation:
                "The key innovation is digital scarcity - cryptocurrencies can't be copied or duplicated like other digital files, creating true digital ownership.",
              type: "multiple-choice",
            },
            {
              id: "q2",
              question:
                "True or False: Stablecoins are designed to maintain a stable value relative to real-world currencies.",
              options: ["True", "False"],
              correctAnswer: 0,
              explanation:
                "True! Stablecoins like USDC are pegged to traditional currencies (like $1 USD = 1 USDC) to provide crypto benefits without price volatility.",
              type: "true-false",
            },
          ],
        },
      },
      {
        id: "zaras-nft-journey",
        title: "Zara's NFT Creation Journey",
        type: "nft-ownership",
        status: "available",
        estimatedTime: "35 min",
        content: {
          story: `# Zara's NFT Creation Journey 🎨

Meet Zara, a talented digital artist who's been struggling with a fundamental problem in the digital world - proving ownership of her creations. Let's follow her journey into NFTs!

## Chapter 1: The Digital Artist's Dilemma 😔

Zara creates beautiful digital art, but faces frustrating challenges:

The Copy-Paste Problem:
- Anyone can right-click and save her artwork
- People share her art without credit or payment
- No way to prove she's the original creator
- Digital art has no scarcity - infinite copies exist
- How can digital art have value if anyone can copy it?

"I love creating digital art," Zara sighs, "but I can't make a living when everyone just copies my work for free!"

## Chapter 2: Zara Meets NFT Expert Jordan 💡

At an art gallery, Zara meets Jordan, an NFT collector and educator:

"What if I told you," Jordan says, "that blockchain technology can create digital scarcity and provable ownership for the first time in history?"

Zara is skeptical: "But people can still copy my digital art!"

Jordan smiles: "You're thinking about this wrong. Let me explain what NFTs ACTUALLY are..."

## Chapter 3: Understanding NFTs 🧩

Jordan breaks it down:

NFT = Non-Fungible Token
- Non-Fungible: Unique and irreplaceable (unlike Bitcoin, where 1 BTC = 1 BTC)
- Token: A digital certificate stored on the blockchain

What an NFT Really Is:
- A unique digital certificate of ownership
- Stored permanently on the blockchain
- Contains metadata pointing to the digital asset
- Proves authenticity and ownership history
- Can be transferred to new owners

"Think of an NFT like a certificate of authenticity for a painting," Jordan explains, "except this certificate is stored on an unbreakable, global ledger that everyone can verify."

## Chapter 4: The Lightbulb Moment 💡

Zara suddenly understands:

"So when people 'buy' my NFT, they're not buying the image itself - they're buying a blockchain certificate that proves they own the ORIGINAL version of my digital creation!"

Analogies That Click:
- Trading Cards: Anyone can print a photo of a rare Pokemon card, but only one person owns the REAL card
- Autographed Photos: You can copy a celebrity signed photo, but only one person owns the photo they actually signed
- Concert Tickets: You can photocopy a ticket, but only the real ticket gets you into the venue

## Chapter 5: Zara's First NFT Creation 🚀

Jordan helps Zara create her first NFT:

The Minting Process:
1. Zara uploads her digital artwork to IPFS (decentralized storage)
2. She creates metadata describing the artwork
3. She mints an NFT on Ethereum, creating a unique token ID
4. The blockchain records Zara as the original creator
5. The NFT is now tradeable on marketplaces like OpenSea

What's Recorded on the Blockchain:
- Token ID: #4521
- Creator: Zara's wallet address
- Current Owner: Zara's wallet address
- Metadata: Link to artwork and description
- Creation Date: Permanently timestamped

Welcome to the age of digital ownership! 🎨✨`,
          questions: [
            {
              id: "q1",
              question: "What does an NFT actually represent?",
              options: [
                "The digital artwork file itself",
                "A blockchain certificate of ownership and authenticity",
                "A way to prevent people from copying digital art",
                "A type of cryptocurrency",
              ],
              correctAnswer: 1,
              explanation:
                "An NFT is a blockchain certificate that proves ownership and authenticity of a digital asset. People can still copy the image, but only one person owns the official NFT certificate.",
              type: "multiple-choice",
            },
            {
              id: "q2",
              question:
                "True or False: When an NFT is resold, the original creator can automatically receive royalties.",
              options: ["True", "False"],
              correctAnswer: 0,
              explanation:
                "True! One of the revolutionary features of NFTs is programmable royalties - creators can set a percentage they'll receive from all future sales of their NFT.",
              type: "true-false",
            },
          ],
        },
      },
      {
        id: "maxs-trading-adventure",
        title: "Max's DeFi Trading Adventure",
        type: "defi-trading",
        status: "available",
        estimatedTime: "35 min",
        content: {
          story: `# Max's DeFi Trading Adventure 🔄

Meet Max, a global merchant who's tired of the limitations of traditional financial systems. Let's follow their journey into the revolutionary world of DeFi (Decentralized Finance)!

## Chapter 1: Max's Trading Frustrations 😤

Max runs an international trading business and faces daily challenges:

Traditional Trading Problems:
- Bank Hours: Can only trade during business hours
- Geographic Limits: Different exchanges in different countries
- High Fees: Banks and exchanges take large cuts
- Slow Settlements: International transfers take days
- Account Requirements: Extensive KYC and minimum balances
- Middleman Control: Banks can freeze accounts or block transactions

"There has to be a better way," Max thinks, "especially for digital assets like cryptocurrency!"

## Chapter 2: Discovery of DeFi 🌟

Max's tech-savvy friend Riley introduces them to DeFi:

"What if I told you there's a financial system that:
- Never closes (24/7/365)
- Works anywhere in the world
- Has no account requirements
- Settles transactions in minutes
- Charges minimal fees
- Can't be controlled by any single entity?"

Max is skeptical: "That sounds too good to be true!"

Riley grins: "Welcome to Decentralized Finance - DeFi!"

## Chapter 3: Understanding Traditional Exchanges vs AMMs 📊

Riley explains the fundamental difference:

Traditional Exchanges (Order Books):
- Buyers place buy orders: "I'll buy 100 tokens at $10 each"
- Sellers place sell orders: "I'll sell 100 tokens at $10.50 each"
- Matching Engine pairs buyers and sellers
- Requires Market Makers to provide liquidity
- Centralized - the exchange controls everything

Automated Market Makers (AMMs):
- Liquidity Pools contain pairs of tokens (like ETH/USDC)
- Mathematical Formula determines price automatically
- Anyone Can Trade by swapping tokens with the pool
- No Order Books - just math!
- Decentralized - runs on smart contracts

Welcome to the future of finance! 🔄✨`,
          questions: [
            {
              id: "q1",
              question:
                "How do Automated Market Makers (AMMs) determine token prices?",
              options: [
                "Prices are set by the exchange operators",
                "Through order books matching buyers and sellers",
                "Using mathematical formulas based on token ratios in liquidity pools",
                "Prices are fixed and never change",
              ],
              correctAnswer: 2,
              explanation:
                "AMMs use mathematical formulas (like x × y = k) based on the ratio of tokens in liquidity pools to automatically determine prices as trades occur.",
              type: "multiple-choice",
            },
            {
              id: "q2",
              question:
                "True or False: In DeFi, you need permission from a bank or financial institution to trade tokens.",
              options: ["True", "False"],
              correctAnswer: 1,
              explanation:
                "False! DeFi is permissionless - anyone with a Web3 wallet can interact with DeFi protocols directly without needing approval from any institution.",
              type: "true-false",
            },
          ],
        },
      },
    ],
  },
  {
    id: "rust-fundamentals",
    title: "Rust Fundamentals",
    description:
      "Master the basics of Rust programming language. Learn about Rust syntax, data types, control flow, and pattern matching through practical examples and exercises.",
    icon: "🦀",
    level: "Beginner",
    points: 10,
    duration: "45 mins",
    status: "available",
    badge: {
      title: "Rust Explorer",
      description: "Mastered Rust Fundamentals",
      image: "/badges/rust-explorer.png",
    },
    sections: [
      {
        id: "rust-basics-intro",
        title: "Getting Started with Rust",
        type: "theory",
        status: "available",
        estimatedTime: "30 min",
        content: {
          story: `# Getting Started with Rust 🦀\n\nRust is a systems programming language focused on performance, reliability, and productivity. It gives you low-level control like C/C++ but prevents entire classes of bugs at compile time.\n\n## Why Rust?\n- **Memory Safety without GC**: Rust eliminates data races and use-after-free with its ownership rules instead of a garbage collector.\n- **Zero-Cost Abstractions**: High-level code compiles down to efficient machine code.\n- **Great Tooling**: Cargo (package manager), rustc (compiler), rustfmt, and Clippy make development smooth.\n- **Fearless Concurrency**: Compile-time checks prevent data races across threads.\n\n## Install and Create a Project\n- Install with rustup (manages toolchains).\n- New binary crate: \`cargo new hello-rust\`\n- Build & run: \`cargo run\`\n\n\`\`\`rust\nfn main() {\n  println!(\"Hello, Rust!\");\n}\n\`\`\`\n\n## Variables and Mutability\n- Variables are **immutable by default**. Use \`mut\` to allow changes.\n\n\`\`\`rust\nlet x = 5;         // immutable\nlet mut y = 10;    // mutable\ny += 2;\nprintln!(\"x = {x}, y = {y}\");\n\`\`\`\n\n## Functions\nDeclare with \`fn\`. The last expression (no \`;\`) is the return value.\n\n\`\`\`rust\nfn add(a: i32, b: i32) -> i32 {\n  a + b\n}\nprintln!(\"{}\", add(2, 3)); // prints 5\n\`\`\`\n\n## pub — Making Things Public\nBy default everything in Rust is **private**. Use \`pub\` to expose items to other modules.\n\n\`\`\`rust\nmod greetings {\n  pub fn hello() {\n    println!(\"Hello!\");\n  }\n  fn secret() { /* only visible inside this mod */ }\n}\n\nfn main() {\n  greetings::hello();  // works — pub\n  // greetings::secret(); // error — private\n}\n\`\`\`\n\n## impl — Adding Methods to Structs\nUse \`impl\` to attach functions (methods) to a struct. Methods that take \`self\`, \`&self\`, or \`&mut self\` operate on an instance of the struct.\n\n\`\`\`rust\nstruct Dog {\n  name: String,\n}\n\nimpl Dog {\n  fn bark(&self) {\n    println!(\"{} says: Woof!\", self.name);\n  }\n}\n\nfn main() {\n  let d = Dog { name: String::from(\"Rex\") };\n  d.bark(); // Rex says: Woof!\n}\n\`\`\`\n\n## trait — Shared Behaviour\nA \`trait\` defines behaviour (like an interface). Any type can implement a trait.\n\n\`\`\`rust\ntrait Speak {\n  fn speak(&self);\n}\n\nstruct Cat;\nimpl Speak for Cat {\n  fn speak(&self) { println!(\"Meow!\"); }\n}\n\nlet c = Cat;\nc.speak(); // Meow!\n\`\`\`\n\nThese fundamentals prepare you to explore Rust's type system and ownership model next.`,
          questions: [
            {
              id: "q1",
              question: "What is a primary design goal of Rust?",
              options: [
                "Managed runtime with garbage collection",
                "Systems programming with memory safety",
                "Dynamic typing for rapid prototyping",
                "Interpretation rather than compilation",
              ],
              correctAnswer: 1,
              explanation:
                "Rust targets systems programming with strong compile-time guarantees for memory safety and performance.",
              type: "multiple-choice",
            },
            {
              id: "q2",
              question: "In Rust, variables are immutable by default. How do you make a variable mutable?",
              options: [
                "Add the 'var' keyword",
                "Add the 'mut' keyword",
                "Declare it globally",
                "Use a pointer",
              ],
              correctAnswer: 1,
              explanation:
                "Use 'let mut x = ...' to make a variable mutable. Without 'mut', the compiler prevents re-assignment.",
              type: "multiple-choice",
            },
            {
              id: "q3",
              question: "What keyword makes a function or struct visible outside its module in Rust?",
              options: ["export", "public", "pub", "open"],
              correctAnswer: 2,
              explanation:
                "'pub' is the Rust visibility modifier. Without it, items are private to their module by default.",
              type: "multiple-choice",
            },
            {
              id: "q4",
              question: "What does the following code print?\n\n```rust\nstruct Dog { name: String }\nimpl Dog {\n  fn bark(&self) { println!(\"{} says Woof\", self.name); }\n}\nlet d = Dog { name: String::from(\"Rex\") };\nd.bark();\n```",
              options: [
                "Compile error",
                "Rex says Woof",
                "Dog says Woof",
                "Woof Rex",
              ],
              correctAnswer: 1,
              explanation:
                "impl Dog attaches the bark method. &self borrows the Dog, so self.name is 'Rex'. The output is 'Rex says Woof'.",
              type: "multiple-choice",
            },
            {
              id: "q5",
              question: "In Rust, what is a trait most similar to?",
              options: [
                "A class with data fields",
                "An interface that defines shared behaviour",
                "A variable type",
                "A loop construct",
              ],
              correctAnswer: 1,
              explanation:
                "A trait defines a set of method signatures (behaviour) that types can implement — similar to interfaces in other languages.",
              type: "multiple-choice",
            },
          ],
        },
      },
      {
        id: "rust-data-types",
        title: "Rust Data Types",
        type: "theory",
        status: "available",
        estimatedTime: "25 min",
        content: {
          story: `# Rust Data Types 🔤\n\nRust has a rich, static type system with primitive and compound types. Choosing the right type yields safer, faster code.\n\n## Primitives\n- Integers: i8..i128, u8..u128, and isize/usize (pointer-sized). Choose signed/unsigned and width appropriately.\n- Floating-Point: f32, f64 (IEEE-754). Prefer f64 unless memory is tight.\n- Bool: true/false.\n- Char: Unicode scalar value (4 bytes).\n\n## Compound\n- Tuples: Fixed-length, heterogenous. Great for lightweight returns.\n- Arrays: Fixed-length, homogenous, stack-allocated.\n- Slices: Views into arrays/vectors ([T]) without owning data.\n- Vectors (Vec<T>): Growable arrays on the heap.\n\n\`\`\`rust\nlet tup: (i32, bool) = (42, true);\nlet arr: [i32; 3] = [1, 2, 3];\nlet slice: &[i32] = &arr[0..2];\nlet mut v: Vec<i32> = vec![1, 2, 3];\nv.push(4);\n\`\`\`\n\n## Strings\n- &str: Borrowed string slice; usually string literals or views into a String.\n- String: Owned, growable UTF-8 buffer.\n\nConversions are common:\n\n\`\`\`rust\nlet s: String = "hi".to_string();\nlet r: &str = &s;\n\`\`\`\n\n## Enums and Structs\n- Structs model data with named fields; enums model alternatives (sum types).\n\n\`\`\`rust\nstruct User { id: u64, name: String }\nenum Direction { North, South, East, West }\n\`\`\`\n\nPick types that communicate intent clearly and minimize invalid states.`,
          questions: [
            {
              id: "q1",
              question:
                "Which type represents an owned, growable UTF-8 string?",
              options: ["&str", "String", "char", "[u8]"],
              correctAnswer: 1,
              explanation:
                "'String' owns its data and can grow; '&str' is a borrowed slice.",
              type: "multiple-choice",
            },
            {
              id: "q2",
              question: "What describes a tuple in Rust?",
              options: [
                "Growable, homogenous",
                "Fixed-length, heterogenous",
                "Growable, heterogenous",
                "Fixed-length, homogenous only",
              ],
              correctAnswer: 1,
              explanation:
                "Tuples have fixed length and can mix different types.",
              type: "multiple-choice",
            },
            {
              id: "q3",
              question:
                "Which list correctly contains only Rust's scalar types?",
              options: [
                "i32, f64, bool, char",
                "Tuple, Array, Vector, Slice",
                "String, &str, Vec<T>, Option<T>",
                "struct, enum, trait, impl",
              ],
              correctAnswer: 0,
              explanation:
                "Rust's scalar types are integers (e.g., i32), floating-point (e.g., f64), booleans (bool), and characters (char). Tuples/arrays are compound; String, Vec, and Option are library/container types.",
              type: "multiple-choice",
            },
          ],
        },
      },
      {
        id: "rust-control-flow",
        title: "Control Flow & Pattern Matching",
        type: "theory",
        status: "available",
        estimatedTime: "35 min",
        content: {
          story: `# Control Flow & Pattern Matching 🔀\n\nRust provides expressive control structures and powerful pattern matching to write concise and safe logic.\n\n## if / else\n\`\`\`rust\nlet score = 87;\nlet grade = if score >= 90 { \"A\" } else if score >= 80 { \"B\" } else { \"C\" };\n\`\`\`\n\n## Loops\n\`\`\`rust\nfor x in 0..3 { println!(\"{}\", x); } // prints 0, 1, 2\n\`\`\`\n\n## Pattern Matching with match\n\`match\` checks all cases — the compiler will error if you miss one.\n\n\`\`\`rust\nlet number = 3;\nmatch number {\n  1 => println!(\"one\"),\n  2 => println!(\"two\"),\n  3 => println!(\"three\"),\n  _ => println!(\"something else\"),\n}\n// prints \"three\"\n\`\`\`\n\n## Option<T> — No More Null!\nIn many languages a variable can be \`null\`, which causes crashes. Rust uses \`Option<T>\` instead:\n- \`Some(value)\` — there IS a value\n- \`None\` — there is NO value\n\nThink of it like a box:\n- \`Some(5)\` → the box has a number 5 inside\n- \`None\` → the box is empty\n\n\`\`\`rust\nlet age: Option<i32> = Some(25);\nlet nothing: Option<i32> = None;\n\`\`\`\n\n## Reading from an Option\nUse \`match\` to safely handle both cases:\n\n\`\`\`rust\nlet age = Some(25);\nmatch age {\n  Some(v) => println!(\"Age is {}\", v),\n  None    => println!(\"No age provided\"),\n}\n// prints \"Age is 25\"\n\`\`\`\n\n## Shortcut: if let\nWhen you only care about the \`Some\` case:\n\n\`\`\`rust\nlet age = Some(25);\nif let Some(v) = age {\n  println!(\"Age: {}\", v);\n}\n// prints \"Age: 25\"\n\`\`\`\n\n## self in Methods\n\`self\` is how a method refers to its own struct. There are three flavours:\n- \`&self\` → read only (borrow)\n- \`&mut self\` → read and write (mutable borrow)\n- \`self\` → take ownership (struct is consumed!)\n\n\`\`\`rust\nstruct Counter { count: i32 }\nimpl Counter {\n  fn value(&self) -> i32 { self.count }        // read\n  fn inc(&mut self)   { self.count += 1; }      // write\n}\nlet mut c = Counter { count: 0 };\nc.inc();\nprintln!(\"{}\", c.value()); // prints 1\n\`\`\`\n\nThese tools make complex branching and data decomposition explicit and safe.`,
          questions: [
            {
              id: "q1",
              question: "What does Option<T> represent in Rust?",
              options: [
                "A number that can be negative",
                "A value that is either present (Some) or absent (None)",
                "An error type",
                "A list of values",
              ],
              correctAnswer: 1,
              explanation:
                "Option<T> replaces null — Some(T) means a value exists, None means it doesn't. This forces you to handle both cases.",
              type: "multiple-choice",
            },
            {
              id: "q2",
              question: "What does this code print?\n\n```rust\nlet x = Some(10);\nmatch x {\n  Some(v) => println!(\"{}\", v * 2),\n  None    => println!(\"nothing\"),\n}\n```",
              options: ["nothing", "10", "20", "Compile error"],
              correctAnswer: 2,
              explanation:
                "x is Some(10), so the Some(v) arm matches with v = 10. v * 2 = 20 is printed.",
              type: "multiple-choice",
            },
            {
              id: "q3",
              question: "What does &self mean in a Rust method?",
              options: [
                "The method takes ownership of the struct",
                "The method can modify the struct",
                "The method borrows the struct read-only",
                "The method is static",
              ],
              correctAnswer: 2,
              explanation:
                "&self is an immutable borrow — the method can read the struct's data but not modify it, and the caller keeps ownership.",
              type: "multiple-choice",
            },
            {
              id: "q4",
              question: "What does this code print?\n\n```rust\nstruct Counter { count: i32 }\nimpl Counter {\n  fn value(&self) -> i32 { self.count }\n  fn inc(&mut self)  { self.count += 1; }\n}\nlet mut c = Counter { count: 0 };\nc.inc();\nc.inc();\nprintln!(\"{}\", c.value());\n```",
              options: ["0", "1", "2", "Compile error"],
              correctAnswer: 2,
              explanation:
                "inc() is called twice, each time adding 1 to count. After two calls count = 2, so value() returns 2.",
              type: "multiple-choice",
            },
          ],
        },
      },
    ],
  },
  {
    id: "rust-ownership-memory",
    title: "Rust Ownership & Memory",
    description:
      "Understand Rust's unique approach to memory management. Learn about ownership, borrowing, and lifetimes - the concepts that make Rust both safe and fast.",
    icon: "🔐",
    level: "Intermediate",
    points: 15,
    duration: "2.5 hours",
    status: "available",
    badge: {
      title: "Memory Master",
      description: "Mastered Rust Ownership and Memory Management",
      image: "/badges/memory-master.png",
    },
    sections: [
      {
        id: "rust-ownership",
        title: "Understanding Ownership",
        type: "theory",
        status: "available",
        estimatedTime: "45 min",
        content: {
          story: `# Understanding Ownership 🔐\n\nOwnership is Rust's model for memory safety without a garbage collector. The rules:\n1) Each value has a single owner.\n2) When the owner goes out of scope, the value is dropped.\n3) You can borrow references to a value (immutable or mutable), subject to rules.\n\n## Moves and Clones\nAssignments move ownership by default.\n\n\`\`\`rust\nlet s1 = String::from("hello");\nlet s2 = s1; // move: s1 no longer usable\n// println!("{}", s1); // compile error\nlet s3 = s2.clone(); // deep copy\n\`\`\`\n\n## Borrowing\n- Any number of immutable references (\`&T\`) OR exactly one mutable reference (\`&mut T\`) in a scope.\n- Prevents data races at compile time.\n\n\`\`\`rust\nlet mut name = String::from("Maya");\nlet r1 = &name;\nlet r2 = &name;\nprintln!("{} {}", r1, r2); // OK: multiple immutable borrows\n// let r3 = &mut name; // not allowed while r1/r2 in use\n\`\`\`\n\n## Slices\nBorrowed views into collections (like strings or arrays) that do not take ownership.\n\n\`\`\`rust\nfn first_word(s: &str) -> &str {\n  for (i, c) in s.char_indices() {\n    if c == ' ' { return &s[..i]; }\n  }\n  s\n}\n\`\`\`\n\nOwnership makes resource management explicit and safe, enabling predictable performance.`,
          questions: [
            {
              id: "q1",
              question: "What happens when a value's owner goes out of scope?",
              options: [
                "The value leaks",
                "A GC reclaims it later",
                "The value is automatically dropped",
                "Nothing",
              ],
              correctAnswer: 2,
              explanation:
                "Rust deterministically drops values when their owner leaves scope.",
              type: "multiple-choice",
            },
            {
              id: "q2",
              question:
                "Which borrowing combination in a single scope is allowed?",
              options: [
                "Two mutable references",
                "One mutable and one immutable reference",
                "Many immutable references",
                "Mutable references across threads without Sync",
              ],
              correctAnswer: 2,
              explanation:
                "You may have many immutable borrows or exactly one mutable borrow.",
              type: "multiple-choice",
            },
          ],
        },
      },
      {
        id: "rust-ownership-move-shadowing",
        title: "Ownership Moves & Shadowing",
        type: "theory",
        status: "available",
        estimatedTime: "30 min",
        content: {
          story: `# Ownership Moves & Shadowing 🔐\n\nRust enforces memory safety through ownership rules and allows ergonomic value transformation via shadowing.\n\n## Ownership Moves\n- Each value has a single owner. Assigning or passing ownership *moves* it to a new owner. The previous binding becomes invalid.\n\n\`\`\`rust\nlet s1 = String::from("rust");\nlet s2 = s1;          // move: ownership of the String goes to s2\n// println!("{}", s1); // error: s1 is no longer valid here\n\nlet s3 = s2.clone();  // deep copy; s2 and s3 both own independent Strings\nprintln!("{} {}", s2, s3);\n\`\`\`\n\nMoves prevent double-frees and data races by ensuring exactly one owner at a time.\n\n## Shadowing\n- Shadowing creates a new binding with the same name, leaving prior bindings inaccessible (and allowing type changes).\n\n\`\`\`rust\nlet x = 5;            // x: i32\nlet x = x + 1;        // new x: i32 (6) shadows the old x\nlet x = "six".len();  // new x: usize; type can change with shadowing\nprintln!("{}", x);   // prints 3\n\`\`\`\n\nShadowing differs from mutability: it rebinds a name rather than mutating an existing value.`,
          questions: [
            {
              id: "q1",
              question:
                "After 'let s2 = s1;' where s1 is a String, what is true?",
              options: [
                "Both s1 and s2 are valid and point to the same String",
                "s1 is moved and no longer valid; s2 owns the String",
                "s1 is copied; both own separate deep copies",
                "The compiler inserts a clone automatically",
              ],
              correctAnswer: 1,
              explanation:
                "Assigning a String moves ownership to s2, invalidating s1. Use .clone() for a deep copy.",
              type: "multiple-choice",
            },
            {
              id: "q2",
              question:
                "What does shadowing allow that 'mut' does not necessarily allow?",
              options: [
                "Changing the type of the binding",
                "Mutating data behind an immutable reference",
                "Creating multiple mutable aliases",
                "Borrowing across threads without Sync",
              ],
              correctAnswer: 0,
              explanation:
                "Shadowing creates a new binding (even with a different type), while 'mut' keeps the same binding and type.",
              type: "multiple-choice",
            },
          ],
        },
      },
    ],
  },
  {
    id: "rust-advanced-concepts",
    title: "Rust Advanced Concepts",
    description:
      "Master advanced Rust concepts including error handling and macros. Learn how to write robust, maintainable Rust code for blockchain applications.",
    icon: "⚡",
    level: "Advanced",
    points: 20,
    duration: "3 hours",
    status: "available",
    badge: {
      title: "Rust Wizard",
      description: "Mastered Advanced Rust Concepts",
      image: "/badges/rust-wizard.png",
    },
    sections: [
      {
        id: "rust-advanced-references-structs",
        title: "impl, self, trait, pub — Putting It All Together",
        type: "theory",
        status: "available",
        estimatedTime: "45 min",
        content: {
          story: `# impl, self, trait, pub — Putting It All Together 🧠\n\n## impl — Attach Methods to a Struct\n\`impl\` is how you give a struct its own functions (methods). Without \`impl\`, a struct is just a bag of data.\n\n\`\`\`rust\nstruct Rect {\n  width:  i32,\n  height: i32,\n}\n\nimpl Rect {\n  fn area(&self) -> i32 {\n    self.width * self.height\n  }\n}\n\nfn main() {\n  let r = Rect { width: 10, height: 20 };\n  println!(\"{}\", r.area()); // 200\n}\n\`\`\`\n\n## self — The Three Receiver Types\n| Receiver | What it means |\n|---|---|\n| \`&self\` | Read-only borrow — struct stays alive |\n| \`&mut self\` | Mutable borrow — can change fields |\n| \`self\` | Takes ownership — struct is consumed |\n\n\`\`\`rust\nstruct Rect { width: i32, height: i32 }\nimpl Rect {\n  fn area(&self) -> i32        { self.width * self.height }   // read\n  fn double_width(&mut self)   { self.width *= 2; }            // write\n}\n\nlet mut r = Rect { width: 5, height: 4 };\nprintln!(\"{}\", r.area()); // 20\nr.double_width();\nprintln!(\"{}\", r.area()); // 40\n\`\`\`\n\n## trait — Shared Behaviour\nA \`trait\` lists method names that many types can implement — like an interface.\n\n\`\`\`rust\ntrait Shape {\n  fn area(&self) -> f64;\n  fn name(&self) -> &str;\n}\n\nstruct Circle { radius: f64 }\nstruct Square { side: f64 }\n\nimpl Shape for Circle {\n  fn area(&self) -> f64  { 3.14 * self.radius * self.radius }\n  fn name(&self) -> &str { \"Circle\" }\n}\n\nimpl Shape for Square {\n  fn area(&self) -> f64  { self.side * self.side }\n  fn name(&self) -> &str { \"Square\" }\n}\n\nfn print_area(s: &dyn Shape) {\n  println!(\"{}: area = {}\", s.name(), s.area());\n}\n\nprint_area(&Circle { radius: 3.0 }); // Circle: area = 28.26\nprint_area(&Square { side: 4.0 });   // Square: area = 16\n\`\`\`\n\n## pub — Visibility Control\nBy default everything is **private** in Rust. Use \`pub\` to make it accessible from outside the module.\n\n\`\`\`rust\nmod bank {\n  pub struct Account {\n    pub owner: String,     // publicly readable\n        balance: f64,      // private — cannot be accessed outside mod\n  }\n\n  impl Account {\n    pub fn new(owner: &str) -> Self {\n      Account { owner: owner.to_string(), balance: 0.0 }\n    }\n    pub fn deposit(&mut self, amount: f64) {\n      self.balance += amount; // internal access is fine\n    }\n    pub fn balance(&self) -> f64 { self.balance }\n  }\n}\n\nuse bank::Account;\nlet mut acc = Account::new(\"Maya\");\nacc.deposit(100.0);\nprintln!(\"{} has \${}\", acc.owner, acc.balance()); // Maya has $100\n\`\`\`\n\n## Memory Safety Without a Garbage Collector\nRust does NOT use a GC. Values are dropped automatically when the owner goes out of scope. This gives you both safety and predictable performance.\n\n\`\`\`rust\nlet s1 = String::from(\"rust\");\nlet s2 = s1;          // ownership moves to s2, s1 is invalid\nlet s3 = s2.clone();  // explicit deep copy — both s2 and s3 are valid\n\`\`\``,
          questions: [
            {
              id: "q1",
              question: "What does the following code print?\n\n```rust\nstruct Rect { width: i32, height: i32 }\nimpl Rect {\n  fn area(&self) -> i32 { self.width * self.height }\n}\nlet r = Rect { width: 10, height: 20 };\nprintln!(\"{}\", r.area());\nprintln!(\"{}\", r.width);\n```",
              options: [
                "200, then compile error",
                "200\n10",
                "Compile error — r is moved",
                "20",
              ],
              correctAnswer: 1,
              explanation:
                "area() uses &self (borrow), so r is NOT moved. Both println calls work: area() = 200, r.width = 10.",
              type: "multiple-choice",
            },
            {
              id: "q2",
              question: "What does the following code print?\n\n```rust\nstruct Rect { width: i32, height: i32 }\nimpl Rect {\n  fn area(self) -> i32 { self.width * self.height }\n}\nlet r = Rect { width: 10, height: 20 };\nprintln!(\"{}\", r.area());\nprintln!(\"{}\", r.width);\n```",
              options: [
                "200\n10",
                "200 then compile error — r was moved",
                "Compile error before any output",
                "10",
              ],
              correctAnswer: 1,
              explanation:
                "area(self) takes ownership of r. The first println works (200), but then r is invalid — Rust errors at r.width.",
              type: "multiple-choice",
            },
            {
              id: "q3",
              question: "Which code correctly defines and calls a mutating method?\n\n```rust\nstruct Rect { width: i32, height: i32 }\nimpl Rect {\n  fn double_width(&mut self) { self.width *= 2; }\n}\n```",
              options: [
                "let r = Rect { width: 10, height: 20 }; r.double_width();",
                "let mut r = Rect { width: 10, height: 20 }; r.double_width();",
                "Rect::double_width();",
                "let r = &mut Rect { width: 10, height: 20 }; Rect::double_width(r);",
              ],
              correctAnswer: 1,
              explanation:
                "&mut self requires the variable to be declared 'mut'. Only 'let mut r = ...' allows calling double_width().",
              type: "multiple-choice",
            },
            {
              id: "q4",
              question: "How does Rust provide memory safety without a garbage collector?",
              options: [
                "Background garbage collector",
                "Reference counting everywhere by default",
                "Ownership and borrowing rules checked at compile time",
                "Manual malloc/free by the programmer",
              ],
              correctAnswer: 2,
              explanation:
                "Rust's borrow checker enforces ownership and borrowing rules at compile time — no runtime GC needed.",
              type: "multiple-choice",
            },
            {
              id: "q5",
              question: "A struct field is declared WITHOUT pub inside a mod. What happens if you try to access it from outside the mod?",
              options: [
                "It works fine",
                "You get a runtime panic",
                "You get a compile-time error — field is private",
                "It returns None",
              ],
              correctAnswer: 2,
              explanation:
                "Rust's default visibility is private. Only fields/functions marked pub can be accessed from outside their module.",
              type: "multiple-choice",
            },
          ],
        },
      },
    ],
  },
];


// Quiz questions for each chapter
export const quizQuestions: { [chapterId: string]: Quiz[] } = {
  "web3-foundations": [
    {
      id: "q1",
      question: "What was the main characteristic of Web1?",
      options: [
        "Users could interact and create content",
        "Websites were static and read-only",
        "Users owned their data",
        "Everything was decentralized",
      ],
      correctAnswer: 1,
      explanation:
        "Web1 was characterized by static, read-only websites where users could only consume information, like reading books in a library.",
    },
    {
      id: "q2",
      question: "What is the key innovation of Web3?",
      options: [
        "Faster internet speeds",
        "Better graphics and user interfaces",
        "User ownership of data and digital assets",
        "More social media platforms",
      ],
      correctAnswer: 2,
      explanation:
        "Web3's key innovation is giving users true ownership of their data, digital assets, and identity, rather than having them controlled by corporations.",
    },
    {
      id: "q3",
      question:
        "What's the main difference between a traditional bank account and a digital wallet?",
      options: [
        "Digital wallets can only store one type of currency",
        "With digital wallets, you control your own keys and assets",
        "Banks offer better security than digital wallets",
        "Digital wallets require permission from authorities to use",
      ],
      correctAnswer: 1,
      explanation:
        "The key difference is self-custody: with digital wallets, you control your own private keys and assets, while banks control your traditional accounts.",
    },
    {
      id: "q4",
      question:
        "True or False: A seed phrase is just a backup - you can always recover your wallet without it.",
      options: ["True", "False"],
      correctAnswer: 1,
      explanation:
        "False! Your seed phrase IS your wallet. If you lose it and don't have other recovery methods, you permanently lose access to your funds and assets.",
    },
  ],
  "blockchain-cryptography": [
    {
      id: "q1",
      question: "What happens if someone tries to change data in an old block?",
      options: [
        "The change is automatically accepted by the network",
        "The block's hash changes, breaking the chain and alerting the network",
        "Only the block creator can make changes",
        "The change is hidden from other users",
      ],
      correctAnswer: 1,
      explanation:
        "When data in a block changes, its hash (fingerprint) changes too, which breaks the connection to the next block. This tampering is immediately detected by the network.",
    },
    {
      id: "q2",
      question:
        "What is the main advantage of a distributed ledger compared to a central database?",
      options: [
        "It's faster and cheaper to operate",
        "It eliminates single points of failure and removes the need to trust central authorities",
        "It uses less computer storage space",
        "It can only be used for cryptocurrency",
      ],
      correctAnswer: 1,
      explanation:
        "The main advantage is eliminating single points of failure and central authorities - everyone has a copy of the ledger, so no single entity can manipulate records or cause system-wide failure.",
    },
    {
      id: "q3",
      question: "What's the relationship between public and private keys?",
      options: [
        "They're completely independent and unrelated",
        "The public key is derived from the private key, but you can't reverse-engineer the private key from the public key",
        "The private key is derived from the public key",
        "They're the same key used in different ways",
      ],
      correctAnswer: 1,
      explanation:
        "The public key is mathematically derived from the private key using one-way cryptographic functions. It's computationally impossible to reverse-engineer the private key from the public key.",
    },
    {
      id: "q4",
      question:
        "True or False: If someone has your public key, they can steal your cryptocurrency.",
      options: ["True", "False"],
      correctAnswer: 1,
      explanation:
        "False! Your public key (and wallet address derived from it) is meant to be shared publicly. Only your private key can authorize transactions and access your funds.",
    },
  ],
  "digital-assets-defi": [
    {
      id: "q1",
      question:
        "What makes cryptocurrency different from traditional digital money?",
      options: [
        "Cryptocurrency is only used for illegal activities",
        "Cryptocurrency is digitally scarce and can't be copied or duplicated",
        "Cryptocurrency is always more expensive to use",
        "Cryptocurrency can only be used online",
      ],
      correctAnswer: 1,
      explanation:
        "The key innovation is digital scarcity - cryptocurrencies can't be copied or duplicated like other digital files, creating true digital ownership.",
    },
    {
      id: "q2",
      question: "What does an NFT actually represent?",
      options: [
        "The digital artwork file itself",
        "A blockchain certificate of ownership and authenticity",
        "A way to prevent people from copying digital art",
        "A type of cryptocurrency",
      ],
      correctAnswer: 1,
      explanation:
        "An NFT is a blockchain certificate that proves ownership and authenticity of a digital asset. People can still copy the image, but only one person owns the official NFT certificate.",
    },
    {
      id: "q3",
      question: "How do Automated Market Makers (AMMs) determine token prices?",
      options: [
        "Prices are set by the exchange operators",
        "Through order books matching buyers and sellers",
        "Using mathematical formulas based on token ratios in liquidity pools",
        "Prices are fixed and never change",
      ],
      correctAnswer: 2,
      explanation:
        "AMMs use mathematical formulas (like x × y = k) based on the ratio of tokens in liquidity pools to automatically determine prices as trades occur.",
    },
    {
      id: "q4",
      question:
        "True or False: In DeFi, you need permission from a bank or financial institution to trade tokens.",
      options: ["True", "False"],
      correctAnswer: 1,
      explanation:
        "False! DeFi is permissionless - anyone with a Web3 wallet can interact with DeFi protocols directly without needing approval from any institution.",
    },
  ],
  "rust-fundamentals": [
    {
      id: "q1",
      question: "What is Rust primarily designed for?",
      options: [
        "Web development only",
        "Systems programming with memory safety",
        "Mobile app development",
        "Data science applications",
      ],
      correctAnswer: 1,
      explanation:
        "Rust is designed for systems programming with a focus on memory safety, performance, and concurrency.",
    },
    {
      id: "q2",
      question: "In Rust, variables are ____ by default.",
      options: ["mutable", "immutable", "global", "dynamic"],
      correctAnswer: 1,
      explanation:
        "Variables are immutable by default; use 'mut' for mutability.",
    },
    {
      id: "q3",
      question: "Which tool manages Rust projects and dependencies?",
      options: ["npm", "pip", "cargo", "make"],
      correctAnswer: 2,
      explanation:
        "Cargo initializes, builds, tests, and publishes Rust crates.",
    },
    {
      id: "q4",
      question: "Which string type is an owned, growable buffer?",
      options: ["&str", "String", "char", "[u8]"],
      correctAnswer: 1,
      explanation:
        "'String' owns its data and can grow; '&str' is a borrowed slice.",
    },
  ],
  "rust-ownership-memory": [
    {
      id: "q1",
      question: "What happens when an owner goes out of scope?",
      options: [
        "Nothing",
        "Value leaks",
        "Value is dropped",
        "GC collects later",
      ],
      correctAnswer: 2,
      explanation:
        "Values are dropped deterministically when their owner leaves scope.",
    },
    {
      id: "q2",
      question: "Which borrowing set is valid within a scope?",
      options: [
        "Two mutable references",
        "One mutable and one immutable",
        "Many immutable references",
        "Mutable references across threads without Sync",
      ],
      correctAnswer: 2,
      explanation:
        "You may have many immutable borrows or exactly one mutable borrow.",
    },
    {
      id: "q3",
      question: "What does cloning generally imply in Rust?",
      options: [
        "Moving ownership",
        "Deep copy for types implementing Clone",
        "No runtime cost",
        "Unsafe behavior",
      ],
      correctAnswer: 1,
      explanation: "Clone performs a deep copy when a type implements Clone.",
    },
    {
      id: "q4",
      question: "Lifetimes primarily prevent which issue?",
      options: [
        "Integer overflow",
        "Dangling references/use-after-free",
        "Double free at runtime",
        "Stack overflow",
      ],
      correctAnswer: 1,
      explanation:
        "They ensure references are valid for their required duration.",
    },
  ],
  "rust-advanced-concepts": [
    {
      id: "q1",
      question: "What does the '?' operator do with a Result?",
      options: [
        "Converts Err to Ok",
        "Early-returns Err or unwraps Ok",
        "Panics on Err",
        "Logs and continues",
      ],
      correctAnswer: 1,
      explanation:
        "It propagates errors by early-returning Err, otherwise yields the Ok value.",
    },
    {
      id: "q2",
      question: "Which type encodes an optional value?",
      options: ["Result", "Option", "Any", "Either"],
      correctAnswer: 1,
      explanation: "Option<T> represents Some(T) or None.",
    },
    {
      id: "q3",
      question: "Macros in Rust are primarily for...",
      options: [
        "Runtime dynamic dispatch",
        "Compile-time code generation",
        "Manual memory management",
        "Thread scheduling",
      ],
      correctAnswer: 1,
      explanation:
        "Macros generate code at compile time to reduce boilerplate.",
    },
    {
      id: "q4",
      question: "Which is a declarative macro mechanism?",
      options: ["proc_macro", "macro_rules!", "build.rs", "serde"],
      correctAnswer: 1,
      explanation: "macro_rules! defines pattern-based declarative macros.",
    },
  ],
};
