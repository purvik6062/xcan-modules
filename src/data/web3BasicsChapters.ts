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
    title: "Web3 Access & Network Basics",
    description:
      "Learn how wallets, addresses, and networks work in practical Web3 usage. Explore native tokens, transaction flow, and core participation rules without relying on centralized platforms.",
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

This journey from Web1 to Web3 is like humanity's transition from feudalism to democracy - it's about giving power back to the people!

## Network Fuel and Transaction Flow ⚙️

Every blockchain network needs a native unit that keeps activity moving. Users pay small fees in that unit so transactions can be processed and finalized.

On Ethereum and many Ethereum-based environments, activity often relies on ETH as the payment token for execution costs. Even when users interact with different applications, settlement still depends on network rules and validators.

A transaction lifecycle usually includes:
- A wallet signs the transaction
- The network checks validity
- Validators include it in a block
- Finalized state appears on chain

## Keys, Addresses, and Safe Sharing 🔑

Wallet usage depends on two different concepts: a secret signer and a public destination.

The secret signer authorizes actions and must stay private. The destination identifier can be shared openly when receiving assets.

Cryptographic systems used in common wallets are designed with one-way properties. This lets software derive public-facing data from secret material while resisting reverse reconstruction in practical settings.

Safe transfers depend on sending to the correct destination and protecting signing credentials from exposure.`,
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
            {
              id: "q3",
              question:
                "Which asset is commonly used to pay transaction execution costs on Ethereum and many Ethereum-based networks?",
              options: ["BTC", "ETH", "USDC", "SOL"],
              correctAnswer: 1,
              explanation:
                "ETH is the common native asset used for transaction execution on Ethereum and many Ethereum-based environments.",
              type: "multiple-choice",
            },
            {
              id: "q4",
              question:
                "What minimum share of network influence is usually referenced in a majority attack discussion?",
              options: ["25%", "33%", "51%", "75%"],
              correctAnswer: 2,
              explanation:
                "A 51% majority is the commonly cited threshold for controlling consensus outcomes in many discussions.",
              type: "multiple-choice",
            },
            {
              id: "q5",
              question:
                "Which statement about public and private keys is correct?",
              options: [
                "A private key can be directly derived from a public key",
                "Public and private keys are unrelated random values",
                "A public key is derived from a private key using one-way cryptography",
                "Both keys can be safely shared in public chats",
              ],
              correctAnswer: 2,
              explanation:
                "Public keys are derived from private keys through one-way cryptographic functions.",
              type: "multiple-choice",
            },
            {
              id: "q6",
              question:
                "To receive cryptocurrency from another user, what information is typically required?",
              options: [
                "Recipient's private key",
                "Recipient's seed phrase",
                "Recipient's wallet address/public key",
                "Recipient's exchange login password",
              ],
              correctAnswer: 2,
              explanation:
                "Only the public receiving destination (wallet address/public key) is needed to send funds.",
              type: "multiple-choice",
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

Welcome to the wallet revolution! 👛✨

## Decentralization and Participation 🌍

Distributed systems trade off between several desired properties. Engineering decisions often optimize for one axis while adding tooling to support another.

Community participation is possible because anyone can verify public state and interact through open interfaces, but protocol design still requires compromise among speed, safety, and broad distribution of control.

Practical participation includes:
- Using self-custodial wallets
- Verifying transaction status on explorers
- Comparing protocol risks before interacting

These habits reduce reliance on opaque intermediaries.`,
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
            {
              id: "q3",
              question:
                "Which option is NOT one of the commonly discussed blockchain trilemma dimensions?",
              options: [
                "Scalability",
                "Security",
                "Decentralization",
                "Marketing reach",
              ],
              correctAnswer: 3,
              explanation:
                "The classic trilemma focuses on scalability, security, and decentralization.",
              type: "multiple-choice",
            },
            {
              id: "q4",
              question:
                "Which behavior best reflects permissionless participation?",
              options: [
                "Waiting for bank approval to create a wallet",
                "Using open protocols directly with a compatible wallet",
                "Submitting passport scans before viewing a block explorer",
                "Requesting validator permission to read transaction history",
              ],
              correctAnswer: 1,
              explanation:
                "Permissionless systems allow direct interaction through open protocols and wallets.",
              type: "multiple-choice",
            },
          ],
        },
      },
    ],
  },
  {
    id: "blockchain-cryptography",
    title: "Consensus and Cryptography Essentials",
    description:
      "Understand how consensus, cryptography, and validation logic protect blockchain systems. Learn practical security boundaries and how attack assumptions are modeled.",
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

Welcome to the age of digital truth! 🧱✨

## One-Way Cryptography in Practice 🔐

Public-key systems rely on asymmetric math. A secret value produces a public counterpart that can be shared widely.

Security comes from computational asymmetry: forward operations are practical, reverse operations are infeasible with current methods.

This property allows open receiving addresses, public verification, and private authorization without exposing signing authority.

## Trust and Verification Rules ✅

Blockchains replace centralized approval with shared verification rules. Nodes independently validate signatures, balances, and protocol constraints.

Because many parties verify the same data, users do not rely on a single institution to maintain correctness. Trust shifts from organization reputation to transparent computation and open state checks.

In practice, users still need caution: verify contracts, validate addresses, and understand protocol risks before signing.`,
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
            {
              id: "q3",
              question:
                "What is the main role of a nonce in a Proof-of-Work block?",
              options: [
                "It permanently stores the list of transactions in the block",
                "It is the wallet address of the miner who created the block",
                "It is a number miners adjust repeatedly until the block hash meets the difficulty target",
                "It links one block to the next block in the chain",
              ],
              correctAnswer: 2,
              explanation:
                "Miners increment the nonce to change the block hash output until it satisfies the required difficulty target.",
              type: "multiple-choice",
            },
            {
              id: "q4",
              question:
                "You delete a wallet app and buy a new phone. Your seed phrase is safely written down. What is true?",
              options: [
                "Your funds are permanently lost because the app is deleted",
                "You can restore full access by re-entering your seed phrase in any compatible wallet app",
                "You must contact the blockchain network to recover your balance",
                "Your wallet address changes when you reinstall the app",
              ],
              correctAnswer: 1,
              explanation:
                "The seed phrase controls the keys. Reinstalling any compatible wallet and entering the seed phrase fully restores access.",
              type: "multiple-choice",
            },
            {
              id: "q5",
              question:
                "If someone only knows your public address, what can they generally do?",
              options: [
                "Sign transactions from your wallet",
                "View and send assets to that address",
                "Extract your seed phrase instantly",
                "Reset your private key",
              ],
              correctAnswer: 1,
              explanation:
                "Public addresses are meant for receiving and visibility, not authorization.",
              type: "multiple-choice",
            },
            {
              id: "q6",
              question:
                "What best describes blockchain verification in a decentralized design?",
              options: [
                "A single authority approves all state changes",
                "Independent nodes apply shared protocol rules to validate changes",
                "Only exchange operators can verify balances",
                "Verification is optional and done after settlement",
              ],
              correctAnswer: 1,
              explanation:
                "Decentralized systems rely on many independent verifiers using common rules.",
              type: "multiple-choice",
            },
            {
              id: "q7",
              question:
                "Which action most improves user-side transaction safety?",
              options: [
                "Signing first and checking details later",
                "Relying only on social media comments",
                "Verifying contract and address details before signing",
                "Using a shared private key for team speed",
              ],
              correctAnswer: 2,
              explanation:
                "Pre-signature verification is a core operational safety habit.",
              type: "multiple-choice",
            },
          ],
        },
      },
    ],
  },
  {
    id: "digital-assets-defi",
    title: "Digital Assets, Layer 2, and DeFi",
    description:
      "Explore digital asset mechanics, Layer 2 execution models, and DeFi market behavior. Learn how users trade, transfer, and manage value across modern Web3 systems.",
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
          story: `# Digital Assets in Motion 💱

Digital assets behave differently depending on network design, liquidity depth, and execution environment.

Users interact with:
- Base-layer settlement networks
- Application-specific token ecosystems
- Bridges and rollups for scaled execution

Price behavior can come from market depth, participant demand, and protocol-level mechanics. This means users should treat each asset by utility and risk profile, not by ticker popularity alone.`,
          questions: [
            {
              id: "q1",
              question:
                "Which statement best captures a key property of many cryptocurrencies compared with standard bank balances?",
              options: [
                "They can be freely duplicated without network checks",
                "They depend on digitally verifiable scarcity rules",
                "They always have fixed prices by law",
                "They cannot move across borders",
              ],
              correctAnswer: 1,
              explanation:
                "Network consensus and cryptographic accounting enable digital scarcity and ownership tracking.",
              type: "multiple-choice",
            },
            {
              id: "q2",
              question:
                "What is the best reason many users choose stable-value tokens?",
              options: [
                "Guaranteed profits regardless of market conditions",
                "Reduced exposure to high short-term volatility",
                "Permanent immunity from all protocol risks",
                "Mandatory acceptance in all countries",
              ],
              correctAnswer: 1,
              explanation:
                "Stable-value tokens are often used to reduce day-to-day price swings compared to volatile assets.",
              type: "multiple-choice",
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
          story: `# Layer 2 and Asset Ownership Paths 🛣️

Asset ownership records can span multiple execution layers. Some systems execute transactions away from a base chain and periodically settle proofs or state updates back to it.

This model can improve throughput and cost characteristics, but users should understand where finality and security assumptions originate.

In ecosystem conversations, "built on top" often means dependence on the parent chain's settlement or security model, even if day-to-day interaction happens elsewhere.`,
          questions: [
            {
              id: "q1",
              question:
                "Which statement best describes how many Layer 2 networks relate to a base chain?",
              options: [
                "They are completely detached systems with no settlement relationship",
                "They are execution layers that can anchor results to a base chain",
                "They are private databases that never post data on-chain",
                "They replace cryptography with centralized signatures only",
              ],
              correctAnswer: 1,
              explanation:
                "Layer 2 systems generally execute separately while maintaining settlement/security links to a base layer.",
              type: "multiple-choice",
            },
            {
              id: "q2",
              question:
                "You own an NFT. The marketplace website that displayed it shuts down permanently. What happens to your ownership?",
              options: [
                "The NFT and your ownership are deleted along with the website",
                "The blockchain record of your ownership remains intact regardless of the website",
                "You must re-mint the NFT to prove ownership again",
                "Ownership automatically transfers back to the original creator",
              ],
              correctAnswer: 1,
              explanation:
                "NFT ownership is recorded on-chain and is not dependent on any single website or marketplace remaining online.",
              type: "multiple-choice",
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
          story: `# DeFi Liquidity and Market Mechanics 🔄

DeFi markets frequently use liquidity pools instead of traditional order books. Pool reserves and formulas influence quoted swap prices as trades move balances.

Participants can trade without centralized matching engines, but outcomes still depend on liquidity depth, slippage, and smart contract behavior.

Good practice includes:
- Checking pool depth before large swaps
- Comparing execution routes
- Reviewing protocol and smart contract risk`,
          questions: [
            {
              id: "q1",
              question: "What best describes a blockchain transaction?",
              options: [
                "A private chat message between two validators",
                "A signed state change request recorded on-chain after validation",
                "A local wallet note that never reaches the network",
                "A database update controlled by one company server",
              ],
              correctAnswer: 1,
              explanation:
                "A blockchain transaction is a signed request (such as sending assets) that updates network state once validated and included on-chain.",
              type: "multiple-choice",
            },
            {
              id: "q2",
              question:
                "A Web2 platform shuts down and deletes all user data. In a Web3 model, what most likely differs?",
              options: [
                "Web3 platforms can also delete user data since they control the servers",
                "User-controlled wallets and on-chain assets remain accessible regardless of any single platform shutting down",
                "Web3 platforms require government approval before shutting down",
                "Users in Web3 must request data backups before a platform shuts down",
              ],
              correctAnswer: 1,
              explanation:
                "In Web3, assets and identity are held in user-controlled wallets on-chain, not on a company's server, so no single platform can erase them.",
              type: "multiple-choice",
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
              question:
                "In Rust, variables are immutable by default. How do you make a variable mutable?",
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
              question:
                "What keyword makes a function or struct visible outside its module in Rust?",
              options: ["export", "public", "pub", "open"],
              correctAnswer: 2,
              explanation:
                "'pub' is the Rust visibility modifier. Without it, items are private to their module by default.",
              type: "multiple-choice",
            },
            {
              id: "q4",
              question:
                'What does the following code print?\n\n```rust\nstruct Dog { name: String }\nimpl Dog {\n  fn bark(&self) { println!("{} says Woof", self.name); }\n}\nlet d = Dog { name: String::from("Rex") };\nd.bark();\n```',
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
              question:
                'What does this code print?\n\n```rust\nlet x = Some(10);\nmatch x {\n  Some(v) => println!("{}", v * 2),\n  None    => println!("nothing"),\n}\n```',
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
              question:
                'What does this code print?\n\n```rust\nstruct Counter { count: i32 }\nimpl Counter {\n  fn value(&self) -> i32 { self.count }\n  fn inc(&mut self)  { self.count += 1; }\n}\nlet mut c = Counter { count: 0 };\nc.inc();\nc.inc();\nprintln!("{}", c.value());\n```',
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
          story: `# Understanding Ownership 🔐\n\nOwnership is Rust's model for memory safety without a garbage collector. The rules:\n1) Each value has a single owner.\n2) When the owner goes out of scope, the value is dropped.\n3) You can borrow references to a value (immutable or mutable), subject to rules.\n\n## Moves and Clones\nAssignments move ownership by default.\n\n\`\`\`rust\nlet s1 = String::from("hello");\nlet s2 = s1; // move: s1 no longer usable\n// println!("{}", s1); // compile error\nlet s3 = s2.clone(); // deep copy\n\`\`\`\n\n## Borrowing\n- Any number of immutable references (\`&T\`) OR exactly one mutable reference (\`&mut T\`) in a scope.\n- Prevents data races at compile time.\n\n\`\`\`rust\nlet mut name = String::from("Maya");\nlet r1 = &name;\nlet r2 = &name;\nprintln!("{} {}", r1, r2); // OK: multiple immutable borrows\n// let r3 = &mut name; // not allowed while r1/r2 in use\n\`\`\`\n\n## `,
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
          story: `# impl, self, trait, pub — Putting It All Together 🧠\n\n## impl — Attach Methods to a Struct\n\`impl\` is how you give a struct its own functions (methods). Without \`impl\`, a struct is just a bag of data.\n\n\`\`\`rust\nstruct Rect {\n  width:  i32,\n  height: i32,\n}\n\nimpl Rect {\n  fn area(&self) -> i32 {\n    self.width * self.height\n  }\n}\n\nfn main() {\n  let r = Rect { width: 10, height: 20 };\n  println!(\"{}\", r.area()); // 200\n}\n\`\`\`\n\n## self — The Three Receiver Types\n- \`&self\`: Read-only borrow - struct stays alive\n- \`&mut self\`: Mutable borrow - can change fields\n- \`self\`: Takes ownership - struct is consumed\n\n\`\`\`rust\nstruct Rect { width: i32, height: i32 }\nimpl Rect {\n  fn area(&self) -> i32        { self.width * self.height }   // read\n  fn double_width(&mut self)   { self.width *= 2; }            // write\n}\n\nlet mut r = Rect { width: 5, height: 4 };\nprintln!(\"{}\", r.area()); // 20\nr.double_width();\nprintln!(\"{}\", r.area()); // 40\n\`\`\`\n\n## trait — Shared Behaviour\nA \`trait\` lists method names that many types can implement — like an interface.\n\n\`\`\`rust\ntrait Shape {\n  fn area(&self) -> f64;\n  fn name(&self) -> &str;\n}\n\nstruct Circle { radius: f64 }\nstruct Square { side: f64 }\n\nimpl Shape for Circle {\n  fn area(&self) -> f64  { 3.14 * self.radius * self.radius }\n  fn name(&self) -> &str { \"Circle\" }\n}\n\nimpl Shape for Square {\n  fn area(&self) -> f64  { self.side * self.side }\n  fn name(&self) -> &str { \"Square\" }\n}\n\nfn print_area(s: &dyn Shape) {\n  println!(\"{}: area = {}\", s.name(), s.area());\n}\n\nprint_area(&Circle { radius: 3.0 }); // Circle: area = 28.26\nprint_area(&Square { side: 4.0 });   // Square: area = 16\n\`\`\`\n\n## pub — Visibility Control\nBy default everything is **private** in Rust. Use \`pub\` to make it accessible from outside the module.\n\n\`\`\`rust\nmod bank {\n  pub struct Account {\n    pub owner: String,     // publicly readable\n        balance: f64,      // private — cannot be accessed outside mod\n  }\n\n  impl Account {\n    pub fn new(owner: &str) -> Self {\n      Account { owner: owner.to_string(), balance: 0.0 }\n    }\n    pub fn deposit(&mut self, amount: f64) {\n      self.balance += amount; // internal access is fine\n    }\n    pub fn balance(&self) -> f64 { self.balance }\n  }\n}\n\nuse bank::Account;\nlet mut acc = Account::new(\"Maya\");\nacc.deposit(100.0);\nprintln!(\"{} has \${}\", acc.owner, acc.balance()); // Maya has $100\n\`\`\`\n\n## Memory Safety Without a Garbage Collector\nRust does NOT use a GC. Values are dropped automatically when the owner goes out of scope. This gives you both safety and predictable performance.\n\n\`\`\`rust\nlet s1 = String::from(\"rust\");\nlet s2 = s1;          // ownership moves to s2, s1 is invalid\nlet s3 = s2.clone();  // explicit deep copy — both s2 and s3 are valid\n\`\`\``,
          questions: [
            {
              id: "q1",
              question:
                'What does the following code print?\n\n```rust\nstruct Rect { width: i32, height: i32 }\n\nimpl Rect {\n    fn area(&self) -> i32 { self.width * self.height }\n}\n\nfn main() {\n    let r = Rect { width: 10, height: 20 };\n    println!("{}", r.area());\n    println!("{}", r.width);\n}\n```',
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
              question:
                'What does the following code print?\n\n```rust\nstruct Rect { width: i32, height: i32 }\nimpl Rect {\n  fn area(self) -> i32 { self.width * self.height }\n}\nlet r = Rect { width: 10, height: 20 };\nprintln!("{}", r.area());\nprintln!("{}", r.width);\n```',
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
              question:
                "Which code correctly defines and calls a mutating method?\n\n```rust\nstruct Rect { width: i32, height: i32 }\nimpl Rect {\n  fn double_width(&mut self) { self.width *= 2; }\n}\n```",
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
              question:
                "How does Rust provide memory safety without a garbage collector?",
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
              question:
                "A struct field is declared WITHOUT pub inside a mod. What happens if you try to access it from outside the mod?",
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
      question:
        "Which asset is commonly used to pay transaction execution costs on Ethereum and many Ethereum-based networks?",
      options: ["BTC", "ETH", "USDC", "SOL"],
      correctAnswer: 1,
      explanation:
        "ETH is the common native asset used for transaction execution on Ethereum and many Ethereum-based environments.",
    },
    {
      id: "q2",
      question:
        "What minimum share of network influence is usually referenced in a majority attack discussion?",
      options: ["25%", "33%", "51%", "75%"],
      correctAnswer: 2,
      explanation:
        "A 51% majority is the commonly cited threshold for controlling consensus outcomes in many discussions.",
    },
    {
      id: "q3",
      question: "Which statement about public and private keys is correct?",
      options: [
        "A private key can be directly derived from a public key",
        "Public and private keys are unrelated random values",
        "A public key is derived from a private key using one-way cryptography",
        "Both keys can be safely shared in public chats",
      ],
      correctAnswer: 2,
      explanation:
        "Public keys are derived from private keys through one-way cryptographic functions.",
    },
    {
      id: "q4",
      question:
        "To receive cryptocurrency from another user, what information is typically required?",
      options: [
        "Recipient's private key",
        "Recipient's seed phrase",
        "Recipient's wallet address/public key",
        "Recipient's exchange login password",
      ],
      correctAnswer: 2,
      explanation:
        "Only the public receiving destination (wallet address/public key) is needed to send funds.",
    },
    {
      id: "q5",
      question:
        "Which option is NOT one of the commonly discussed blockchain trilemma dimensions?",
      options: [
        "Scalability",
        "Security",
        "Decentralization",
        "Marketing reach",
      ],
      correctAnswer: 3,
      explanation:
        "The classic trilemma focuses on scalability, security, and decentralization.",
    },
    {
      id: "q6",
      question: "Which behavior best reflects permissionless participation?",
      options: [
        "Waiting for bank approval to create a wallet",
        "Using open protocols directly with a compatible wallet",
        "Submitting passport scans before viewing a block explorer",
        "Requesting validator permission to read transaction history",
      ],
      correctAnswer: 1,
      explanation:
        "Permissionless systems allow direct interaction through open protocols and wallets.",
    },
  ],
  "blockchain-cryptography": [
    {
      id: "q1",
      question: "What is the main role of a nonce in a Proof-of-Work block?",
      options: [
        "It permanently stores the list of transactions in the block",
        "It is the wallet address of the miner who created the block",
        "It is a number miners adjust repeatedly until the block hash meets the difficulty target",
        "It links one block to the next block in the chain",
      ],
      correctAnswer: 2,
      explanation:
        "Miners increment the nonce to change the block hash output until it satisfies the required difficulty target.",
    },
    {
      id: "q2",
      question:
        "In Proof of Stake, what primarily determines which participant gets to produce the next block?",
      options: [
        "The raw computing power used to solve a mathematical puzzle",
        "The amount of cryptocurrency locked as stake/collateral",
        "The geographic location of the validator node",
        "The number of transactions the validator has sent before",
      ],
      correctAnswer: 1,
      explanation:
        "Proof of Stake selects validators based on staked collateral rather than computation power.",
    },
    {
      id: "q3",
      question:
        "You delete a wallet app and buy a new phone. Your seed phrase is safely written down. What is true?",
      options: [
        "Your funds are permanently lost because the app is deleted",
        "You can restore full access by re-entering your seed phrase in any compatible wallet app",
        "You must contact the blockchain network to recover your balance",
        "Your wallet address changes when you reinstall the app",
      ],
      correctAnswer: 1,
      explanation:
        "The seed phrase controls the keys. Reinstalling any compatible wallet and entering the seed phrase fully restores access.",
    },
    {
      id: "q4",
      question:
        "If someone only knows your public address, what can they generally do?",
      options: [
        "Sign transactions from your wallet",
        "View and send assets to that address",
        "Extract your seed phrase instantly",
        "Reset your private key",
      ],
      correctAnswer: 1,
      explanation:
        "Public addresses are meant for receiving and visibility, not authorization.",
    },
    {
      id: "q5",
      question:
        "What best describes blockchain verification in a decentralized design?",
      options: [
        "A single authority approves all state changes",
        "Independent nodes apply shared protocol rules to validate changes",
        "Only exchange operators can verify balances",
        "Verification is optional and done after settlement",
      ],
      correctAnswer: 1,
      explanation:
        "Decentralized systems rely on many independent verifiers using common rules.",
    },
    {
      id: "q6",
      question: "Which action most improves user-side transaction safety?",
      options: [
        "Signing first and checking details later",
        "Relying only on social media comments",
        "Verifying contract and address details before signing",
        "Using a shared private key for team speed",
      ],
      correctAnswer: 2,
      explanation:
        "Pre-signature verification is a core operational safety habit.",
    },
  ],
  "digital-assets-defi": [
    {
      id: "q1",
      question:
        "Which statement best captures a key property of many cryptocurrencies compared with standard bank balances?",
      options: [
        "They can be freely duplicated without network checks",
        "They depend on digitally verifiable scarcity rules",
        "They always have fixed prices by law",
        "They cannot move across borders",
      ],
      correctAnswer: 1,
      explanation:
        "Network consensus and cryptographic accounting enable digital scarcity and ownership tracking.",
    },
    {
      id: "q2",
      question:
        "What is the best reason many users choose stable-value tokens?",
      options: [
        "Guaranteed profits regardless of market conditions",
        "Reduced exposure to high short-term volatility",
        "Permanent immunity from all protocol risks",
        "Mandatory acceptance in all countries",
      ],
      correctAnswer: 1,
      explanation:
        "Stable-value tokens are often used to reduce day-to-day price swings compared to volatile assets.",
    },
    {
      id: "q3",
      question:
        "Which statement best describes how many Layer 2 networks relate to a base chain?",
      options: [
        "They are completely detached systems with no settlement relationship",
        "They are execution layers that can anchor results to a base chain",
        "They are private databases that never post data on-chain",
        "They replace cryptography with centralized signatures only",
      ],
      correctAnswer: 1,
      explanation:
        "Layer 2 systems generally execute separately while maintaining settlement/security links to a base layer.",
    },
    {
      id: "q4",
      question:
        "You own an NFT. The marketplace website that displayed it shuts down permanently. What happens to your ownership?",
      options: [
        "The NFT and your ownership are deleted along with the website",
        "The blockchain record of your ownership remains intact regardless of the website",
        "You must re-mint the NFT to prove ownership again",
        "Ownership automatically transfers back to the original creator",
      ],
      correctAnswer: 1,
      explanation:
        "NFT ownership is recorded on-chain and is not dependent on any single website or marketplace remaining online.",
    },
    {
      id: "q5",
      question: "What best describes a blockchain transaction?",
      options: [
        "A private chat message between two validators",
        "A signed state change request recorded on-chain after validation",
        "A local wallet note that never reaches the network",
        "A database update controlled by one company server",
      ],
      correctAnswer: 1,
      explanation:
        "A blockchain transaction is a signed request (such as sending assets) that updates network state once validated and included on-chain.",
    },
    {
      id: "q6",
      question:
        "A Web2 platform shuts down and deletes all user data. In a Web3 model, what most likely differs?",
      options: [
        "Web3 platforms can also delete user data since they control the servers",
        "User-controlled wallets and on-chain assets remain accessible regardless of any single platform shutting down",
        "Web3 platforms require government approval before shutting down",
        "Users in Web3 must request data backups before a platform shuts down",
      ],
      correctAnswer: 1,
      explanation:
        "In Web3, assets and identity are held in user-controlled wallets on-chain, not on a company's server, so no single platform can erase them.",
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
