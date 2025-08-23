export interface Chapter {
  id: string;
  title: string;
  description: string;
  icon: string;
  level: "Beginner" | "Intermediate" | "Advanced";
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
    | "web-evolution"
    | "wallet-fundamentals"
    | "crypto-basics"
    | "blockchain-core"
    | "ledger-principles"
    | "key-security"
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
    id: "evolution-of-the-web",
    title: "Evolution of the Web",
    description:
      "Discover the journey from Web1 to Web3 through an engaging story that explains how the internet evolved from static pages to a decentralized future.",
    icon: "🌐",
    level: "Beginner",
    duration: "40",
    status: "available",
    badge: {
      title: "Web Explorer",
      description: "Understood the Evolution of the Web",
      image: "/badges/web-explorer.png",
    },
    sections: [
      {
        id: "web1-to-web3-story",
        title: "The Web's Evolution Story",
        type: "web-evolution",
        status: "available",
        estimatedTime: "20 min",
        content: {
          story: `# The Web's Evolution Story 🌐

Imagine the internet as a growing city. Let's take a journey through time to see how this digital city evolved...

## Chapter 1: Web1 - The Library Era (1990s-2000s) 📚

In the early days, the internet was like a massive digital library. Picture yourself walking into this library:

**Static Information**  
Every book (website) was already written and placed on the shelf. You could read them, but you couldn't add your own notes or change anything.

**One-Way Communication**  
Just like in a traditional library, you could only consume information. The librarian (website owner) put content on the shelves, and you could only read it.

**Simple Websites**  
These were like pamphlets - basic HTML pages with text, some images, and simple links.

**Examples**: Early websites like the first Amazon (just a book catalog), early news sites, personal homepage with basic information.

*The internet was READ-ONLY.*

---

## Chapter 2: Web2 - The Interactive City (2000s-Present) 🏙️

Then something magical happened! Our digital library transformed into a bustling interactive city:

**Social Platforms**  
Suddenly, you could write on walls (Facebook posts), share pictures (Instagram), and have conversations with people worldwide.

**User-Generated Content**  
Instead of just reading books, you could now write your own stories, create videos, and share them with everyone.

**Interactive Applications**  
The city got restaurants (food delivery apps), banks (online banking), entertainment centers (Netflix), and shopping malls (e-commerce).

**Data Collection**  
But here's the catch - in this city, everything you do is watched and recorded by big corporations who own most of the buildings.

**Examples**: Facebook, YouTube, Twitter, Amazon, Google - platforms where users create content but companies control the data.

*The internet became READ-WRITE, but centralized.*

---

## Chapter 3: Web3 - The Decentralized Nation (Present-Future) 🏛️

Now imagine our city evolving into something even more revolutionary - a decentralized nation where:

**You Own Your Data**  
Instead of corporations owning your information, you carry your own digital passport (wallet) that contains your identity, money, and assets.

**No Central Authority**  
There's no single mayor or government controlling everything. Instead, communities govern themselves using transparent rules (smart contracts).

**Digital Ownership**  
You can truly own digital items (NFTs), participate in governing protocols (DAOs), and even own pieces of the infrastructure itself.

**Interoperability**  
Your digital assets and identity work everywhere in this nation, not just in one company's territory.

**Key Features**:
- **Decentralization**: No single point of control
- **Ownership**: Users own their data and digital assets
- **Transparency**: All transactions are public and verifiable
- **Permissionless**: Anyone can participate without asking permission

*The internet becomes READ-WRITE-OWN, and decentralized.*

---

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
    ],
  },
  {
    id: "public-private-keys",
    title: "Public & Private Keys",
    description:
      "Follow Kai's cybersecurity adventure to understand how public and private keys work. Learn the cryptographic magic that keeps your digital assets secure in Web3.",
    icon: "🔐",
    level: "Beginner",
    duration: "1 hour",
    status: "available",
    badge: {
      title: "Crypto Guardian",
      description: "Mastered Cryptographic Key Security",
      image: "/badges/crypto-guardian.png",
    },
    sections: [
      {
        id: "kais-key-adventure",
        title: "Kai's Cryptographic Adventure",
        type: "key-security",
        status: "available",
        estimatedTime: "30 min",
        content: {
          story: `# Kai's Cryptographic Adventure 🔐

Meet Kai, a cybersecurity enthusiast who's about to discover the mathematical magic that protects the entire Web3 world - public and private key cryptography!

## Chapter 1: The Ancient Mailbox Problem 📬

Kai works for a digital communication company and faces an ancient problem:

"How can two people send secret messages to each other over the internet, when anyone could be listening?"

Kai's mentor, Dr. Cipher, smiles mysteriously: "Let me tell you about the most beautiful mathematical discovery that makes Web3 possible!"

## Chapter 2: The Magic Box Analogy 📦

Dr. Cipher starts with a simple story:

"Imagine you have a magical box with two keys:
- **Public Key (Bronze Key)**: Anyone can have a copy of this key
- **Private Key (Golden Key)**: Only YOU have this key, and you NEVER share it"

**The Magic Rules:**
1. Anyone can use the Bronze Key to LOCK the box
2. Only the Golden Key can UNLOCK the box
3. The Bronze and Golden keys are mathematically connected
4. It's impossible to figure out the Golden Key from the Bronze Key

## Chapter 3: Kai's First Secure Message 💌

Dr. Cipher demonstrates:

**Scenario**: Alice wants to send Kai a secret message

1. **Kai shares his Bronze Key (Public Key)** with everyone, including Alice
2. **Alice writes her secret message** and puts it in the magical box
3. **Alice locks the box** using Kai's Bronze Key (Public Key)
4. **Alice sends the locked box** to Kai over the internet
5. **Only Kai can unlock it** using his Golden Key (Private Key)

"Even if a hacker intercepts the locked box, they can't open it without Kai's Golden Key!" Dr. Cipher explains.

## Chapter 4: The Digital Signature Discovery ✍️

Kai learns about an even cooler feature:

**Digital Signatures - Proving Identity:**

**Scenario**: Kai wants to prove a message really came from him

1. **Kai writes a message** 
2. **Kai uses his Golden Key (Private Key)** to create a "digital signature"
3. **Anyone can use Kai's Bronze Key (Public Key)** to verify the signature
4. **If the signature is valid**, it proves the message came from Kai

"It's like having a magical signature that can't be forged!" Kai realizes.

## Chapter 5: Real-World Cryptography 🌐

Dr. Cipher reveals the actual technology:

**How It Really Works:**
- Keys are actually very large numbers (256 bits for Bitcoin)
- Your Private Key might look like: '5KJvsngHeMpm884wtkJNzQGaCErckhHJBGFsvd3VyK5qMZXj3hS'
- Your Public Key is derived from your Private Key using complex math
- The math is designed so it's easy to go Private → Public, but impossible to go Public → Private

**Key Sizes:**
- A 256-bit private key has 2^256 possible combinations
- That's more combinations than there are atoms in the observable universe!
- Even all computers in the world working together couldn't guess your private key

## Chapter 6: Kai's Web3 Wallet Adventure 👛

Kai sets up their first Web3 wallet and discovers:

**Your Wallet Address:**
- Generated from your Public Key
- Like your house address - you can share it with anyone
- People can send you cryptocurrency to this address
- Example: '0x742d35Cc6e4C8C8B4F8b7B8C8e4C8C8B4F8b7B8C'

**Your Private Key:**
- Controls your entire wallet
- Never share this with anyone!
- If lost, your funds are gone forever
- If someone gets it, they control your wallet

## Chapter 7: The Transaction Magic ✨

Kai learns how cryptocurrency transactions work:

**Sending Cryptocurrency:**
1. **Kai wants to send** 1 ETH to Alice
2. **Kai creates a transaction** saying "Send 1 ETH from Kai's address to Alice's address"
3. **Kai signs the transaction** with their Private Key
4. **The network verifies** the signature using Kai's Public Key
5. **If valid**, the transaction is processed

**Security**: Even though the transaction is public, only Kai could have created that signature!

## Chapter 8: Security Best Practices 🛡️

Dr. Cipher teaches Kai essential security:

**Private Key Protection:**
- **Never share** your private key with anyone
- **Never store** it in plain text on your computer
- **Never enter** it on suspicious websites
- **Use hardware wallets** for large amounts
- **Keep multiple backups** in secure locations

**Common Scams to Avoid:**
- "Customer support" asking for your seed phrase
- Fake websites asking you to "validate" your wallet
- Social media DMs offering free cryptocurrency
- Emails claiming your wallet is compromised

## Chapter 9: The Multisig Solution 🔒

Kai discovers advanced security:

**Multisignature (Multisig) Wallets:**
- Require multiple private keys to authorize transactions
- Like a bank vault that needs 3 out of 5 keys to open
- Perfect for organizations or high-value storage
- Even if one key is compromised, funds stay safe

## Chapter 10: Kai's Realization 💡

"I understand now!" Kai exclaims. "Public and private key cryptography isn't just about Web3 - it's the foundation of all internet security!"

**Applications Everywhere:**
- **HTTPS websites** use this technology
- **Email encryption** protects private communications
- **Digital certificates** verify website authenticity
- **Cryptocurrency** enables trustless value transfer
- **Digital identity** proves who you are online

## Chapter 11: The Future of Digital Sovereignty 🚀

Dr. Cipher shares the bigger picture:

"What you've learned, Kai, is the mathematical foundation of digital sovereignty. For the first time in history, individuals can truly own and control digital assets without relying on institutions."

**The Cryptographic Revolution:**
- **Self-Sovereignty**: You control your own digital identity
- **Permissionless**: No one can stop you from participating
- **Trustless**: Math replaces the need to trust institutions
- **Global**: Works the same way anywhere in the world

## Kai's New Mission 🌟

Armed with this knowledge, Kai becomes a guardian of digital security, helping others understand that:

"Your private key is your digital sovereignty. Protect it like your life depends on it - because in the digital world, it does!"

Welcome to the cryptographic age! 🔐✨`,
          questions: [
            {
              id: "q1",
              question:
                "What's the relationship between public and private keys?",
              options: [
                "They're completely independent and unrelated",
                "The public key is derived from the private key, but you can't reverse-engineer the private key from the public key",
                "The private key is derived from the public key",
                "They're the same key used in different ways",
              ],
              correctAnswer: 1,
              explanation:
                "The public key is mathematically derived from the private key using one-way cryptographic functions. It's computationally impossible to reverse-engineer the private key from the public key.",
              type: "multiple-choice",
            },
            {
              id: "q2",
              question:
                "True or False: If someone has your public key, they can steal your cryptocurrency.",
              options: ["True", "False"],
              correctAnswer: 1,
              explanation:
                "False! Your public key (and wallet address derived from it) is meant to be shared publicly. Only your private key can authorize transactions and access your funds.",
              type: "true-false",
            },
          ],
        },
      },
    ],
  },
  {
    id: "digital-wallets",
    title: "Digital Wallets",
    description:
      "Learn about digital wallets through the story of Maya's first Web3 adventure - understand how wallets work, why they're important, and how they're different from traditional bank accounts.",
    icon: "👛",
    level: "Beginner",
    duration: "45 minutes",
    status: "available",
    badge: {
      title: "Wallet Master",
      description: "Mastered Digital Wallet Concepts",
      image: "/badges/wallet-master.png",
    },
    sections: [
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

**Traditional Bank Account vs Digital Wallet:**

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

**What a Digital Wallet Actually Contains:**
1. **Cryptocurrency** (like digital cash)
2. **NFTs** (unique digital collectibles)
3. **Identity credentials** (proving who you are)
4. **Access tokens** (keys to enter different Web3 applications)
5. **Transaction history** (all publicly viewable but pseudonymous)

**The Seed Phrase - Maya's Master Key:**
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

- **Connect to DeFi protocols** (like decentralized banks)
- **Buy and sell NFTs** (digital art and collectibles)
- **Participate in DAOs** (decentralized organizations)
- **Access exclusive communities** (token-gated experiences)
- **Play blockchain games** (where she truly owns in-game items)

## Chapter 6: Maya's Realization 💡

After a week of exploring, Maya realizes her digital wallet isn't just about money - it's her:
- **Digital identity**
- **Proof of membership** in various communities
- **Portfolio** of digital assets
- **Key** to the entire Web3 ecosystem

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
    id: "cryptocurrency",
    title: "Cryptocurrency",
    description:
      "Join Sam on their journey to understand cryptocurrency - from digital scarcity to global payments. Learn how crypto works, why it matters, and how it's changing the world of money.",
    icon: "💰",
    level: "Beginner",
    duration: "1 hour",
    status: "available",
    badge: {
      title: "Crypto Pioneer",
      description: "Understood Cryptocurrency Fundamentals",
      image: "/badges/crypto-pioneer.png",
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

- **High Fees**: Credit card companies take 3-5% of every sale
- **Slow Transfers**: International payments take 3-7 business days
- **Currency Conversion**: Losing money on exchange rates
- **Accessibility**: Some customers can't access traditional banking
- **Chargebacks**: Buyers can reverse payments months later

"There has to be a better way," Sam thinks after losing $50 in fees on a $200 sale to Japan.

## Chapter 2: The Digital Money Revolution 💡

Sam's friend Rio introduces them to cryptocurrency:

"Imagine money that's..."
- **Digital**: Exists only in cyberspace, no physical form
- **Borderless**: Works the same whether you're sending to your neighbor or someone in another continent
- **Programmable**: Can be programmed to do smart things automatically
- **Scarce**: Unlike traditional money, you can't just print more
- **Transparent**: Every transaction is publicly recorded

## Chapter 3: Understanding Digital Scarcity 🎯

Rio explains a mind-bending concept:

**Traditional Digital Items (NOT scarce):**
- You can copy a digital photo infinite times
- Each copy is identical to the original
- No way to prove which copy is "original"

**Cryptocurrency (DIGITALLY SCARCE):**
- Each coin is unique and can't be duplicated
- You can't "copy-paste" Bitcoin like you would a photo
- The network keeps track of who owns what
- This creates digital scarcity for the first time in history!

"It's like having digital gold," Rio explains, "but better because you can send it instantly anywhere in the world."

## Chapter 4: Sam's First Bitcoin Transaction ⚡

Rio helps Sam set up a wallet and sends them $10 worth of Bitcoin. Sam watches in amazement:

1. **Transaction starts** at 2:15 PM
2. **Network confirms** the transaction within 10 minutes
3. **Sam receives** the Bitcoin directly in their wallet
4. **Total cost**: About $0.50 in network fees
5. **No middleman**: No bank, no credit card company, just direct transfer

"This is revolutionary!" Sam realizes. "I could have received this payment from anywhere in the world, at any time, in the same way!"

## Chapter 5: Types of Cryptocurrency 🌈

Sam learns there are different types of cryptocurrency, each with different purposes:

**Bitcoin (BTC) - Digital Gold 🥇**
- The first and most well-known cryptocurrency
- Limited supply: Only 21 million will ever exist
- Primarily used as a store of value
- Like digital gold that you can send anywhere

**Ethereum (ETH) - Digital Oil ⛽**
- Not just money, but fuel for a world computer
- Powers smart contracts and applications
- Platform for building decentralized apps
- Like owning shares in the internet's infrastructure

**Stablecoins (USDC, USDT) - Digital Dollars 💵**
- Cryptocurrencies pegged to real-world currencies
- $1 stablecoin = $1 USD (approximately)
- Combines crypto benefits with stable value
- Perfect for payments and saving without volatility

## Chapter 6: The Global Impact 🌍

Sam discovers cryptocurrency's global implications:

**Financial Inclusion:**
- 1.7 billion people worldwide are unbanked
- But many have smartphones and can access crypto
- Cryptocurrency provides financial services to everyone

**Economic Freedom:**
- People in countries with unstable currencies use crypto to protect savings
- Activists can receive donations without government interference
- Artists like Sam can sell globally without permission

**Innovation:**
- Programmable money enables new types of applications
- Decentralized finance (DeFi) recreates banking without banks
- New economic models become possible

## Chapter 7: Sam's Business Transformation 📈

Three months later, Sam's business has transformed:

- **30% of customers** now pay with cryptocurrency
- **90% lower fees** compared to credit cards
- **Instant payments** from anywhere in the world
- **No chargebacks** - payments are final
- **New customer base** from countries with limited banking

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
    ],
  },
  {
    id: "blocks-and-blockchain",
    title: "Blocks & Blockchain",
    description:
      "Follow Luna's detective story to understand how blocks work and why blockchain is like an unbreakable chain of truth. Discover the technology that makes Web3 possible.",
    icon: "🧱",
    level: "Beginner",
    duration: "1 hour",
    status: "available",
    badge: {
      title: "Blockchain Detective",
      description: "Solved the Blockchain Mystery",
      image: "/badges/blockchain-detective.png",
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

**What's in a Block?**
Marcus shows Luna that each block contains:

1. **Transaction Data**: Records of what happened (like "Alice sent 5 coins to Bob")
2. **Timestamp**: Exactly when these transactions occurred
3. **Hash**: A unique fingerprint of all the data in the block
4. **Previous Block Hash**: A link to the block before it
5. **Nonce**: A special number that makes the block valid

"Think of each block as a sealed evidence box in your detective cases," Marcus explains.

## Chapter 3: The Chain of Truth ⛓️

Luna learns how blocks connect to form a chain:

**Block 1 (Genesis Block):**
- Contains: First transactions
- Hash: ABC123 (unique fingerprint)
- Previous Hash: 000000 (it's the first block)

**Block 2:**
- Contains: Next set of transactions  
- Hash: DEF456
- Previous Hash: ABC123 (links to Block 1)

**Block 3:**
- Contains: More transactions
- Hash: GHI789
- Previous Hash: DEF456 (links to Block 2)

"It's like a chain where each link is locked to the previous one," Luna realizes. "If someone tries to change Block 1, its hash changes, which breaks the connection to Block 2!"

## Chapter 4: The Tamper-Proof Investigation 🔒

Marcus demonstrates why blockchain is tamper-proof:

**Scenario**: A bad actor tries to change a transaction in Block 1

1. **They change the data** in Block 1
2. **Block 1's hash changes** (because content changed)
3. **Block 2's "previous hash" no longer matches** Block 1's new hash
4. **The chain is broken!** Everyone notices the tampering
5. **The network rejects** the invalid chain

"It's like trying to change evidence in a case," Luna understands, "but every other detective in the world has the original evidence and will immediately notice your tampering!"

## Chapter 5: The Global Network of Detectives 🌍

Luna discovers the most brilliant part:

**Decentralized Verification:**
- Thousands of computers (nodes) around the world each keep a complete copy
- When a new block is proposed, all nodes verify it independently
- A block is only accepted when the majority agrees it's valid
- If someone tries to cheat, their version is outnumbered and rejected

"It's like having thousands of honest detectives cross-checking every piece of evidence," Luna marvels.

## Chapter 6: Mining - The Security Guards 💎

Marcus explains who creates new blocks:

**Miners are like security guards who:**
- Collect pending transactions
- Solve a difficult mathematical puzzle (proof of work)
- The first to solve it gets to create the next block
- They're rewarded with cryptocurrency for their work
- This process secures the entire network

"They're like security guards who get paid to make sure no one tampers with the evidence!" Luna exclaims.

## Chapter 7: Real-World Applications 🌟

Luna realizes blockchain's detective superpowers work for many things:

**Financial Transactions:**
- Every Bitcoin transaction is permanently recorded
- No one can spend the same Bitcoin twice
- All transactions are publicly verifiable

**Supply Chain Tracking:**
- Track products from farm to table
- Verify authenticity of luxury goods
- Ensure ethical sourcing

**Digital Identity:**
- Prove ownership of digital assets
- Verify credentials and certificates
- Create tamper-proof records

**Voting Systems:**
- Create transparent, verifiable elections
- Prevent vote tampering
- Maintain voter privacy while ensuring integrity

## Chapter 8: Luna's Breakthrough 💡

"I get it now!" Luna exclaims. "Blockchain isn't just about cryptocurrency - it's about creating digital truth in a world where information can be easily copied and changed!"

**The Blockchain Breakthrough:**
- **Immutable**: Once recorded, data can't be changed
- **Transparent**: Everyone can verify the information
- **Decentralized**: No single point of failure or control
- **Trustless**: You don't need to trust any individual or institution

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
    id: "distributed-ledgers",
    title: "Distributed Ledgers",
    description:
      "Join the village of Consensia to understand how distributed ledgers work. See how a community can maintain perfect records together without a central authority.",
    icon: "📋",
    level: "Beginner",
    duration: "45 minutes",
    status: "available",
    badge: {
      title: "Ledger Keeper",
      description: "Mastered Distributed Ledger Concepts",
      image: "/badges/ledger-keeper.png",
    },
    sections: [
      {
        id: "village-of-consensia",
        title: "The Village of Consensia",
        type: "ledger-principles",
        status: "available",
        estimatedTime: "25 min",
        content: {
          story: `# The Village of Consensia 📋

Welcome to the magical village of Consensia, where we'll discover how distributed ledgers work through the story of a community that learned to trust mathematics instead of politicians!

## Chapter 1: The Old System's Problems 🏛️

Once upon a time, Consensia had a traditional banking system:

**The Central Bank Problem:**
- One bank controlled all the village's financial records
- The bank could change records without anyone knowing
- If the bank's building burned down, all records were lost
- The bank charged high fees for every transaction
- Some villagers couldn't access banking services

Villagers often wondered: "What if the bank makes mistakes? What if it gets corrupted? What if it disappears?"

## Chapter 2: Elder Sofia's Revolutionary Idea 💡

Elder Sofia, the village's wisest resident, proposed a radical solution:

"What if EVERYONE in the village kept the SAME copy of ALL financial records?"

The villagers laughed: "That's impossible! How could we all agree on what's true?"

Sofia smiled: "Let me show you the magic of distributed consensus!"

## Chapter 3: The Great Ledger Experiment 📚

Sofia helped the village create a new system:

**The Distributed Ledger:**
- Every household keeps an identical copy of the village's financial ledger
- When someone wants to make a transaction, they announce it to everyone
- The majority must agree before the transaction is recorded
- Everyone updates their ledger with the agreed-upon transaction

**Example Transaction:**
1. Baker Tom announces: "I'm paying 5 gold coins to Farmer Alice for wheat"
2. Everyone checks: "Does Tom actually have 5 gold coins?"
3. Majority confirms: "Yes, Tom has 12 coins, so he can spend 5"
4. Everyone records: "Tom: 12-5=7 coins, Alice: 8+5=13 coins"

## Chapter 4: The Consensus Mechanism 🤝

The villagers needed rules for agreement:

**The Consensus Rules:**
- **Majority Rule**: At least 51% of villagers must agree
- **Proof Requirement**: Every transaction needs valid proof
- **Transparency**: All ledgers are open for anyone to verify
- **Immutability**: Once recorded and agreed upon, records can't be changed

**When Disagreements Happen:**
- Village Smith claims he paid Village Taylor 3 coins
- But Taylor says she never received payment
- Everyone checks their ledgers: no such transaction was ever recorded
- Majority rules: the payment didn't happen
- Smith's false claim is rejected

## Chapter 5: The Security Discovery 🛡️

The villagers discovered amazing security benefits:

**Attack Resistance:**
- If a thief breaks into one house and changes a ledger, it doesn't matter
- 999 other houses still have the correct records
- The thief would need to break into 500+ houses simultaneously
- This is practically impossible!

**No Single Point of Failure:**
- If the old bank burned down, all records were lost
- Now if 100 houses burn down, 900 still have complete records
- The system keeps working as long as the majority survives

## Chapter 6: Different Types of Distributed Ledgers 🌐

Sofia taught about different consensus mechanisms:

**Proof of Work (Mining Villages):**
- Villagers compete to solve puzzles to validate transactions
- Winner gets rewards and the right to add the next page to the ledger
- Used by Bitcoin

**Proof of Stake (Democratic Villages):**
- Villagers with more "stake" in the community have more voting power
- More energy efficient than competition-based systems
- Used by Ethereum 2.0

**Federated Consensus (Alliance Villages):**
- A group of trusted village leaders make consensus decisions
- Faster but less decentralized
- Used by some business blockchain networks

## Chapter 7: Real-World Applications 🏢

The villagers realized this could work beyond money:

**Land Registry:**
- Record who owns which property
- Prevent fraudulent land sales
- Transparent property history

**Voting Records:**
- Transparent, tamper-proof elections
- Every vote is recorded and verifiable
- No ballot stuffing or manipulation

**Supply Chain Tracking:**
- Track goods from producer to consumer
- Verify organic certification
- Prevent counterfeiting

**Medical Records:**
- Secure, shared medical histories
- Patients control who accesses their data
- Prevent medical fraud

## Chapter 8: The Transformation 🚀

Five years later, Consensia had transformed:

**Before Distributed Ledgers:**
- High fees and slow transactions
- Fear of corruption and errors
- Exclusion of some community members
- Single point of failure

**After Distributed Ledgers:**
- Near-zero fees and fast transactions
- Mathematical certainty instead of trust
- Everyone can participate equally
- Robust system with no single point of failure

## Chapter 9: Sofia's Final Wisdom 🧙‍♀️

Elder Sofia gathered the villagers one last time:

"We've learned that distributed ledgers aren't just about technology - they're about reimagining how communities can organize themselves. Instead of trusting individuals or institutions, we now trust mathematics and collective consensus."

**The Core Principles:**
- **Decentralization**: No single point of control
- **Transparency**: Everyone can verify everything
- **Consensus**: Majority agreement determines truth
- **Immutability**: Agreed-upon history can't be rewritten
- **Inclusion**: Anyone can participate

## The Village's Legacy 🌟

The village of Consensia became a model for the world, showing that communities could govern themselves through transparent, mathematical consensus rather than trusting centralized authorities.

Their story spread far and wide, inspiring the creation of Bitcoin, Ethereum, and thousands of other distributed ledger systems that now power the global Web3 revolution!

Welcome to the distributed future! 📋✨`,
          questions: [
            {
              id: "q1",
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
              type: "multiple-choice",
            },
            {
              id: "q2",
              question:
                "True or False: In a distributed ledger, if someone changes their copy of the ledger, it automatically changes everyone else's copy too.",
              options: ["True", "False"],
              correctAnswer: 1,
              explanation:
                "False! Each copy is independent. If someone changes their copy, it will disagree with the majority. The consensus mechanism ensures only valid changes agreed upon by the majority are accepted.",
              type: "true-false",
            },
          ],
        },
      },
    ],
  },
  {
    id: "nfts-digital-ownership",
    title: "NFTs & Digital Ownership",
    description:
      "Join Artist Zara's journey into the world of NFTs. Discover how blockchain enables true digital ownership and why NFTs are more than just expensive pictures.",
    icon: "🎨",
    level: "Beginner",
    duration: "1 hour",
    status: "available",
    badge: {
      title: "NFT Creator",
      description: "Understood NFTs and Digital Ownership",
      image: "/badges/nft-creator.png",
    },
    sections: [
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

**The Copy-Paste Problem:**
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

**NFT = Non-Fungible Token**
- **Non-Fungible**: Unique and irreplaceable (unlike Bitcoin, where 1 BTC = 1 BTC)
- **Token**: A digital certificate stored on the blockchain

**What an NFT Really Is:**
- A unique digital certificate of ownership
- Stored permanently on the blockchain
- Contains metadata pointing to the digital asset
- Proves authenticity and ownership history
- Can be transferred to new owners

"Think of an NFT like a certificate of authenticity for a painting," Jordan explains, "except this certificate is stored on an unbreakable, global ledger that everyone can verify."

## Chapter 4: The Lightbulb Moment 💡

Zara suddenly understands:

"So when people 'buy' my NFT, they're not buying the image itself - they're buying a blockchain certificate that proves they own the ORIGINAL version of my digital creation!"

**Analogies That Click:**
- **Trading Cards**: Anyone can print a photo of a rare Pokemon card, but only one person owns the REAL card
- **Autographed Photos**: You can copy a photo of a celebrity, but only one person owns the photo they actually signed
- **Concert Tickets**: You can photocopy a ticket, but only the real ticket gets you into the venue

## Chapter 5: Zara's First NFT Creation 🚀

Jordan helps Zara create her first NFT:

**The Minting Process:**
1. **Zara uploads** her digital artwork to IPFS (decentralized storage)
2. **She creates metadata** describing the artwork
3. **She mints an NFT** on Ethereum, creating a unique token ID
4. **The blockchain records** Zara as the original creator
5. **The NFT is now tradeable** on marketplaces like OpenSea

**What's Recorded on the Blockchain:**
- Token ID: #4521
- Creator: Zara's wallet address
- Current Owner: Zara's wallet address
- Metadata: Link to artwork and description
- Creation Date: Permanently timestamped

## Chapter 6: The Value Discovery 💎

Zara learns about different types of value in NFTs:

**Provable Scarcity:**
- Only ONE official NFT exists for her artwork
- The blockchain proves it's the original
- Collectors value being the "official" owner

**Creator Royalties:**
- Zara sets a 10% royalty on her NFT
- Every time it's resold, she earns 10% automatically
- Passive income from her art forever!

**Community and Status:**
- Owning certain NFTs grants access to exclusive communities
- Some NFTs work like membership cards
- Social status from owning rare or prestigious pieces

**Utility NFTs:**
- Some NFTs provide real-world benefits
- Concert tickets, game items, membership passes
- Not just art - functional digital assets

## Chapter 7: Beyond Art - The NFT Ecosystem 🌐

Jordan shows Zara the broader NFT world:

**Profile Picture Projects (PFPs):**
- Collections like CryptoPunks and Bored Apes
- Used as digital identity and status symbols
- Community membership and social signaling

**Gaming NFTs:**
- In-game items that players truly own
- Can be traded outside the game
- Items persist even if the game shuts down

**Utility NFTs:**
- Event tickets that can't be counterfeited
- Membership passes for exclusive clubs
- Certificates and credentials

**Real Estate NFTs:**
- Virtual land in metaverse worlds
- Can be developed, rented, or sold
- New frontier of digital property

## Chapter 8: The Technical Magic 🔧

Zara learns how NFTs actually work:

**Smart Contracts:**
- NFTs are created by smart contracts
- Contracts define the rules (royalties, transferability, etc.)
- Automatically execute when conditions are met

**Metadata Standards:**
- ERC-721: The most common NFT standard
- ERC-1155: Allows multiple copies (like trading card sets)
- Standards ensure compatibility across platforms

**Storage Solutions:**
- IPFS: Decentralized storage for artwork
- Arweave: Permanent storage guaranteed
- On-chain: Data stored directly on blockchain (expensive but permanent)

## Chapter 9: Zara's Success Story 📈

Six months later, Zara's NFT journey has transformed her career:

**Financial Success:**
- Sold her first NFT for 2 ETH ($3,000)
- Earned $5,000 in royalties from secondary sales
- Building a collector base willing to pay premium prices

**Creative Freedom:**
- No gallery taking 50% commission
- Direct relationship with collectors
- Global reach - collectors from around the world

**Community Building:**
- 10,000 Twitter followers interested in her work
- Exclusive Discord for NFT holders
- Collaborating with other NFT artists

## Chapter 10: Addressing the Critics 🤔

Zara learns to address common NFT criticisms:

**"But I can just right-click save!"**
- "You can photograph the Mona Lisa, but you don't own it"
- "Ownership isn't about preventing copying - it's about provable authenticity"

**"NFTs are bad for the environment!"**
- "Many NFTs now use eco-friendly blockchains like Polygon"
- "Ethereum switched to Proof of Stake, reducing energy by 99%"

**"It's all speculation and money laundering!"**
- "Like any new market, there's speculation, but also real utility"
- "Focus on creators building genuine communities and utility"

## Chapter 11: The Future of Digital Ownership 🔮

Jordan shares the bigger vision:

"NFTs are just the beginning. We're creating the infrastructure for true digital ownership in a world where everything is becoming digital."

**Future Applications:**
- **Digital Identity**: Your online identity as an NFT you control
- **Academic Credentials**: Degrees and certificates as verifiable NFTs
- **Medical Records**: Secure, portable health data you own
- **Property Deeds**: Real estate ownership on the blockchain
- **Intellectual Property**: Patents and copyrights as NFTs

## Chapter 12: Zara's New Mission 🌟

Empowered by her understanding, Zara becomes an NFT educator:

"NFTs aren't about expensive JPEGs," she tells other artists. "They're about creators finally having digital sovereignty - the ability to create, own, and monetize digital assets without intermediaries."

**Key Lessons:**
- **Digital Scarcity**: Blockchain creates scarcity in the digital world
- **Provable Ownership**: Mathematically verifiable ownership
- **Creator Empowerment**: Direct creator-to-collector relationships
- **Programmable Royalties**: Artists earn from secondary sales forever
- **Community Building**: NFTs enable new forms of community and membership

## The Digital Renaissance 🎭

Zara's journey represents the beginning of a digital renaissance where creators can thrive in the digital economy, collectors can truly own digital assets, and communities can form around shared ownership and values.

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
                "True! One of the revolutionary features of NFTs is programmable royalties - creators can set a percentage they'll receive from all future sales of their NFT automatically.",
              type: "true-false",
            },
          ],
        },
      },
    ],
  },
  {
    id: "defi-swapping",
    title: "DeFi & Token Swapping",
    description:
      "Follow merchant Max's trading adventure to understand how DeFi and automated market makers work. Learn how anyone can swap tokens without traditional exchanges.",
    icon: "🔄",
    level: "Beginner",
    duration: "1 hour",
    status: "available",
    badge: {
      title: "DeFi Trader",
      description: "Mastered DeFi and Token Swapping",
      image: "/badges/defi-trader.png",
    },
    sections: [
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

**Traditional Trading Problems:**
- **Bank Hours**: Can only trade during business hours
- **Geographic Limits**: Different exchanges in different countries
- **High Fees**: Banks and exchanges take large cuts
- **Slow Settlements**: International transfers take days
- **Account Requirements**: Extensive KYC and minimum balances
- **Middleman Control**: Banks can freeze accounts or block transactions

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

**Traditional Exchanges (Order Books):**
- **Buyers** place buy orders: "I'll buy 100 tokens at $10 each"
- **Sellers** place sell orders: "I'll sell 100 tokens at $10.50 each"
- **Matching Engine** pairs buyers and sellers
- **Requires Market Makers** to provide liquidity
- **Centralized** - the exchange controls everything

**Automated Market Makers (AMMs):**
- **Liquidity Pools** contain pairs of tokens (like ETH/USDC)
- **Mathematical Formula** determines price automatically
- **Anyone Can Trade** by swapping tokens with the pool
- **No Order Books** - just math!
- **Decentralized** - runs on smart contracts

## Chapter 4: Max's First AMM Experience 🏊‍♀️

Riley shows Max how AMMs work with a simple example:

**The ETH/USDC Pool:**
- Pool contains: 100 ETH and 200,000 USDC
- Current price: 1 ETH = 2,000 USDC
- **Formula**: ETH × USDC = Constant (100 × 200,000 = 20,000,000)

**Max wants to buy 10 ETH:**
1. Max deposits 22,000 USDC into the pool
2. Pool now has: 100 ETH and 222,000 USDC
3. Math keeps the constant: ETH = 20,000,000 ÷ 222,000 = 90.09 ETH
4. Max receives: 100 - 90.09 = 9.91 ETH
5. New pool state: 90.09 ETH and 222,000 USDC

"The price automatically adjusts based on supply and demand!" Max marvels.

## Chapter 5: The Liquidity Provider Discovery 💧

Max learns about the people who make AMMs possible:

**Liquidity Providers (LPs):**
- Deposit equal values of both tokens into pools
- Example: $10,000 worth of ETH + $10,000 worth of USDC
- Receive LP tokens representing their pool ownership
- Earn fees from every trade (usually 0.3%)
- Can withdraw their funds plus earned fees anytime

**Max's Calculation:**
"If this pool generates $100,000 in daily trading fees, and I own 1% of the pool, I earn $300 per day just by providing liquidity!"

## Chapter 6: Advanced DeFi Concepts 🔬

Riley introduces Max to the broader DeFi ecosystem:

**Yield Farming:**
- Stake LP tokens in "farms" for additional rewards
- Earn extra tokens on top of trading fees
- Sometimes earn 100%+ APY (but with risk!)

**Impermanent Loss:**
- When token prices change dramatically, LPs might lose money
- Called "impermanent" because it disappears if prices return
- Risk vs reward consideration for LPs

**Flash Loans:**
- Borrow millions instantly without collateral
- Must repay within the same transaction
- Used for arbitrage and complex DeFi strategies

**Governance Tokens:**
- Tokens that let holders vote on protocol changes
- Decentralized governance of DeFi protocols
- Community-owned financial infrastructure

## Chapter 7: Max's Real-World DeFi Trade 🌍

Max decides to try their first DeFi trade:

**The Trade Setup:**
- Max has 1000 USDC and wants to swap for ETH
- Uses Uniswap, a popular decentralized exchange
- Connects their Web3 wallet to the protocol

**The Transaction Process:**
1. **Max approves** USDC spending on Uniswap smart contract
2. **Sets slippage tolerance** (0.5% - how much price can change)
3. **Reviews the swap**: 1000 USDC → ~0.5 ETH (at current prices)
4. **Confirms transaction** and pays gas fee (~$20)
5. **Smart contract executes** the swap automatically
6. **ETH appears** in Max's wallet within 2 minutes

"No human intervention, no account approval, no business hours - just pure mathematics!" Max realizes.

## Chapter 8: Arbitrage Opportunities 📈

Max discovers profit opportunities:

**Cross-Exchange Arbitrage:**
- ETH costs $2000 on Uniswap but $2020 on SushiSwap
- Buy on Uniswap, sell on SushiSwap, profit $20 per ETH
- Minus gas fees and slippage, but still profitable
- Automated bots usually capture these quickly

**Triangle Arbitrage:**
- Trade through multiple pairs to exploit price differences
- Example: USDC → ETH → BTC → USDC with a net profit
- Requires sophisticated tools and fast execution

## Chapter 9: Risk Management 🛡️

Riley teaches Max about DeFi risks:

**Smart Contract Risk:**
- Code bugs can lead to loss of funds
- Only use audited protocols with proven track records
- Never invest more than you can afford to lose

**Impermanent Loss:**
- Providing liquidity can be less profitable than just holding
- More pronounced with volatile token pairs
- Consider stable pairs for steady income

**Rug Pulls:**
- Malicious developers drain liquidity pools
- Research projects thoroughly before investing
- Stick to established protocols with locked liquidity

**Gas Fee Volatility:**
- Ethereum gas fees can spike during high demand
- Use Layer 2 solutions like Arbitrum for cheaper trades
- Time transactions during low network usage

## Chapter 10: Max's DeFi Portfolio Strategy 📊

Six months later, Max has built a diversified DeFi strategy:

**Conservative Allocation (60%):**
- USDC/ETH liquidity provision on Uniswap
- Steady 15% APY from trading fees
- Low impermanent loss risk

**Growth Allocation (30%):**
- Yield farming with governance token rewards
- Higher risk but 40-60% APY potential
- Active management required

**Speculation Allocation (10%):**
- New protocol tokens and experimental strategies
- High risk, high reward
- Money Max can afford to lose completely

## Chapter 11: The Broader DeFi Revolution 🚀

Max realizes DeFi's transformative potential:

**Financial Inclusion:**
- Anyone with internet can access sophisticated financial tools
- No geographic restrictions or minimum balances
- Particularly powerful in countries with limited banking

**Innovation Speed:**
- New financial products launch weekly
- Community-driven development
- Faster innovation than traditional finance

**Transparency:**
- All transactions publicly verifiable
- Open-source code anyone can audit
- No hidden fees or opaque processes

**Composability:**
- DeFi protocols work together like LEGO blocks
- Complex strategies by combining simple primitives
- Innovation through composition

## Chapter 12: Max's New Mission 🌟

Empowered by DeFi knowledge, Max becomes an educator:

"DeFi isn't just about making money," Max tells other entrepreneurs. "It's about creating a parallel financial system that's open, transparent, and accessible to everyone on Earth."

**Key Insights:**
- **Automation**: Smart contracts eliminate human intermediaries
- **Global Access**: 24/7 availability regardless of location
- **Transparency**: All transactions and rules are public
- **Innovation**: Permissionless innovation drives rapid development
- **Community Ownership**: Users own and govern the protocols

## The DeFi Revolution 💫

Max's journey illustrates how DeFi is rebuilding the financial system from the ground up - creating markets that never close, banks that can't discriminate, and financial tools that work for everyone.

The revolution isn't just technological - it's about democratizing access to sophisticated financial instruments that were previously only available to institutions and the wealthy.

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
];

// Quiz questions for each chapter
export const quizQuestions: { [chapterId: string]: Quiz[] } = {
  "evolution-of-the-web": [
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
  ],
  "digital-wallets": [
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
    },
    {
      id: "q2",
      question: "What can you store in a digital wallet?",
      options: [
        "Only cryptocurrency",
        "Only NFTs and digital art",
        "Cryptocurrency, NFTs, identity credentials, and access tokens",
        "Only identity documents",
      ],
      correctAnswer: 2,
      explanation:
        "Digital wallets can store various digital assets including cryptocurrency, NFTs, identity credentials, access tokens, and transaction history.",
    },
  ],
  cryptocurrency: [
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
      question: "What are stablecoins designed for?",
      options: [
        "Maximum price volatility",
        "Only for institutions to use",
        "Maintaining stable value relative to real-world currencies",
        "Only for trading on exchanges",
      ],
      correctAnswer: 2,
      explanation:
        "Stablecoins like USDC are designed to maintain stable value (usually $1 USD = 1 stablecoin) to provide crypto benefits without price volatility.",
    },
  ],
  "blocks-and-blockchain": [
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
      question: "What makes blockchain tamper-proof?",
      options: [
        "It's stored on a single secure server",
        "Each block is cryptographically linked to the previous block, and changes break the chain",
        "Only governments can access it",
        "It requires passwords to access",
      ],
      correctAnswer: 1,
      explanation:
        "Blockchain is tamper-proof because each block contains the hash of the previous block, creating a chain where any change to old data breaks the cryptographic links.",
    },
  ],
  "distributed-ledgers": [
    {
      id: "q1",
      question: "What is the main advantage of a distributed ledger?",
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
      id: "q2",
      question: "How do distributed ledgers reach consensus?",
      options: [
        "A central authority decides what's true",
        "The majority of network participants must agree on changes",
        "Changes are made randomly",
        "Only the original creator can make changes",
      ],
      correctAnswer: 1,
      explanation:
        "Distributed ledgers use consensus mechanisms where the majority of network participants must agree on changes before they're accepted and recorded.",
    },
  ],
  "public-private-keys": [
    {
      id: "q1",
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
      id: "q2",
      question: "What should you do with your private key?",
      options: [
        "Share it with customer support when you have problems",
        "Post it online so others can verify your identity",
        "Never share it with anyone and keep it extremely secure",
        "Only share it with family members",
      ],
      correctAnswer: 2,
      explanation:
        "Your private key should never be shared with anyone. It's like the master key to all your digital assets - if someone gets it, they control your wallet completely.",
    },
  ],
  "nfts-digital-ownership": [
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
    },
    {
      id: "q2",
      question: "What's one major benefit of NFTs for creators?",
      options: [
        "They prevent anyone from copying their work",
        "They guarantee high sale prices",
        "They can receive automatic royalties from future sales",
        "They make their work uncopyable",
      ],
      correctAnswer: 2,
      explanation:
        "One revolutionary feature of NFTs is programmable royalties - creators can set a percentage they'll receive from all future sales of their NFT automatically.",
    },
  ],
  "defi-swapping": [
    {
      id: "q1",
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
      id: "q2",
      question: "What is a major advantage of DeFi over traditional finance?",
      options: [
        "It's only available to wealthy investors",
        "It requires bank approval for all transactions",
        "It's permissionless and accessible 24/7 globally",
        "It's controlled by government regulations",
      ],
      correctAnswer: 2,
      explanation:
        "DeFi is permissionless (no approval needed) and operates 24/7 globally, making sophisticated financial tools accessible to anyone with an internet connection.",
    },
  ],
};
