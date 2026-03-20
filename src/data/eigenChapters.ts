import { Chapter, Section, StoryContent, StoryQuestion } from "./web3BasicsChapters";

export const eigenChapters: Chapter[] = [
    {
        id: "ai-ml-fundamentals",
        title: "AI & Machine Learning Fundamentals",
        description:
            "Start your journey by understanding how Artificial Intelligence and Machine Learning actually work — from basic concepts to Large Language Models. No prior AI knowledge needed!",
        icon: "🧠",
        level: "Beginner",
        points: 10,
        duration: "45 min",
        status: "available",
        badge: {
            title: "AI Apprentice",
            description: "Mastered AI & Machine Learning Fundamentals",
            image: "/badges/ai-apprentice.png",
        },
        sections: [
            {
                id: "welcome-to-ai",
                title: "Welcome to the World of AI",
                type: "theory",
                status: "available",
                estimatedTime: "25 min",
                content: {
                    story: `# Welcome to the World of AI 🧠

> 🎭 **Meet Your Guides:** Throughout this module, you'll learn alongside fictional characters — **Kai** (a curious blockchain developer), **Dr. Jane** (his mentor and professor), **Maya** and **Alex** (fellow students). They'll guide you through complex concepts using real-world analogies and hands-on exploration. Let's begin!

Kai has been hearing about Artificial Intelligence everywhere — in the news, at work, in everyday apps. But what is AI, really? He decides to start from the very basics.

## Chapter 1: What is Artificial Intelligence? 🤖

Kai visits Dr. Jane's office with a simple question: "What actually IS artificial intelligence?"

Dr. Jane smiles. "Let's break it down."

Artificial Intelligence (AI) is:
- Computer systems designed to perform tasks that normally require human intelligence
- Pattern recognition and decision-making at superhuman scale and speed
- Statistical predictions based on data — lots and lots of data
- NOT sentient, conscious, or "thinking" — it's advanced mathematics and engineering

"So AI isn't like the robots in movies?" Kai asks.

"Not at all!" Dr. Jane laughs. "Today's AI is incredibly powerful at specific tasks, but it doesn't 'understand' the way humans do. It finds patterns in data and makes predictions."

## Chapter 2: A Brief History of AI 📜

Dr. Jane draws a timeline on the whiteboard:

The Evolution of AI:
1. **1950s — Rule-Based Systems**: Programmers wrote explicit rules ("IF temperature > 100, THEN alarm"). Computers followed instructions but couldn't learn.
2. **1980s — Expert Systems**: Encoded human expert knowledge into databases. Useful but brittle — couldn't handle situations outside their rules.
3. **2000s — Machine Learning Revolution**: Instead of programming rules, we let computers LEARN rules from data. A paradigm shift!
4. **2010s — Deep Learning Boom**: Neural networks with many layers achieved breakthroughs in image recognition, speech, and language.
5. **2020s — The LLM Era**: Large Language Models (GPT, Claude, Llama) brought AI to the masses. AI became a tool everyone could use through natural conversation.

"Each generation built on the last," Dr. Jane explains. "The biggest leap was when we stopped telling computers WHAT to do and started letting them LEARN what to do."

## Chapter 3: How Machine Learning Works 📊

Dr. Jane uses a simple analogy that clicks:

Imagine Teaching a Child to Recognize Cats:
- You show the child thousands of cat photos (**Training Data**)
- The child's brain notices patterns — pointy ears, whiskers, fur (**Learning**)
- Now the child can recognize cats in photos they've NEVER seen before (**Inference**)
- The more photos they see, the better they get (**More Data = Better Model**)

Machine Learning Works the Same Way:
1. **Training Phase**: Feed the model millions of labeled examples (photos with labels: "cat", "dog", "bird")
2. **Learning Phase**: The model adjusts its internal parameters to find patterns that distinguish cats from dogs
3. **Inference Phase**: The trained model makes predictions on brand new data it's never seen

Key Terminology:
- **Model**: The trained "brain" — a mathematical function with millions/billions of parameters
- **Training Data**: The examples the model learns from
- **Inference**: Using the trained model to make predictions on new data
- **Parameters**: The internal knobs the model adjusts during training (like synapses in a brain)

"Think of it like baking," Kai summarizes. "The recipe (algorithm) stays the same, but the ingredients (data) determine the flavor (predictions)!"

## Chapter 4: Neural Networks — The Building Blocks 🕸️

Dr. Jane introduces the technology behind modern AI:

What is a Neural Network?
- Inspired by the human brain's network of neurons
- Layers of interconnected "nodes" that process information
- Each connection has a "weight" (importance) that adjusts during training

The Structure:
1. **Input Layer**: Receives the raw data (pixels of an image, words of a sentence)
2. **Hidden Layers**: Process and transform the data through mathematical operations. More layers = deeper understanding
3. **Output Layer**: Produces the final prediction (cat/dog, positive/negative, next word)

"Deep Learning" simply means:
- A neural network with MANY hidden layers (sometimes hundreds!)
- Each layer extracts increasingly abstract features
- Layer 1 might detect edges, Layer 5 detects shapes, Layer 20 detects entire objects
- The "depth" allows the network to understand complex patterns

"So when people say 'deep learning AI,' they just mean a neural network with lots of layers?" Kai asks.

"Exactly!" Dr. Jane confirms. "The 'deep' refers to the depth of the network, not some mysterious intelligence."

## Chapter 5: Types of Machine Learning 🎯

Dr. Jane explains the three main approaches:

1. Supervised Learning (Learning with a Teacher):
- The model is given labeled examples: "This IS a cat" / "This is NOT a cat"
- It learns the mapping between inputs and correct outputs
- Example: Email spam detection — trained on emails labeled "spam" or "not spam"
- Most common type in production AI

2. Unsupervised Learning (Learning without Labels):
- The model finds hidden patterns in unlabeled data
- No "correct answers" — just structure discovery
- Example: Customer segmentation — grouping similar customers together
- Useful for exploration and anomaly detection

3. Reinforcement Learning (Learning by Doing):
- The model learns by trial and error, receiving rewards or penalties
- Like training a dog: good behavior → treat, bad behavior → no treat
- Example: Game-playing AI (AlphaGo learned by playing millions of games)
- Powers robotics, recommendation systems, and autonomous systems

"Most AI you interact with daily — search engines, photo filters, voice assistants — uses supervised learning," Dr. Jane notes. "But the cutting edge is moving toward models that can learn with less supervision."

## The Foundation is Set! 🏗️

Kai now has a solid understanding of AI fundamentals: what AI is, how machine learning works, what neural networks are, and the different learning paradigms. Next, he'll explore the technology that's taken the world by storm — Large Language Models.

Let's keep learning! 🧠✨`,
                    questions: [
                        {
                            id: "q1",
                            question: "What is the key difference between traditional rule-based systems and machine learning?",
                            options: [
                                "Rule-based systems are newer and more advanced",
                                "Machine learning lets computers LEARN patterns from data instead of being explicitly programmed with rules",
                                "Rule-based systems use more data than machine learning",
                                "Machine learning requires no data at all",
                            ],
                            correctAnswer: 1,
                            explanation:
                                "The fundamental shift in machine learning is that instead of programmers writing explicit rules, the system learns patterns directly from data. This allows ML to handle complex, nuanced tasks that would be impossible to code manually.",
                            type: "multiple-choice",
                        },
                        {
                            id: "q2",
                            question:
                                "True or False: 'Deep Learning' means AI that has deep, human-like understanding and consciousness.",
                            options: ["True", "False"],
                            correctAnswer: 1,
                            explanation:
                                "False! 'Deep Learning' simply refers to neural networks with many hidden layers (deep architectures). The 'deep' describes the network structure, not any form of consciousness or understanding. These models are sophisticated pattern-matchers, not thinking beings.",
                            type: "true-false",
                        },
                        {
                            id: "q3",
                            question: "In machine learning, what is 'inference'?",
                            options: [
                                "The process of collecting training data",
                                "Using a trained model to make predictions on new, unseen data",
                                "A type of neural network architecture",
                                "The speed at which a model trains",
                            ],
                            correctAnswer: 1,
                            explanation:
                                "Inference is the phase where a trained model is used to make predictions on new data it has never seen before. Training teaches the model patterns; inference is where it applies what it learned.",
                            type: "multiple-choice",
                        },
                    ],
                },
            },
            {
                id: "llms-and-ai-revolution",
                title: "LLMs, Prompts & The AI Revolution",
                type: "theory",
                status: "available",
                estimatedTime: "20 min",
                content: {
                    story: `# LLMs, Prompts & The AI Revolution 💬

With the AI basics under his belt, Kai is ready to explore the technology that's transformed the world: Large Language Models. These are the engines behind ChatGPT, Claude, Gemini, and the AI tools millions of people use every day.

## Chapter 1: What are Large Language Models? 🗣️

Dr. Jane explains the breakthrough:

"Remember how we talked about neural networks learning patterns from data?" she asks. "Now imagine a neural network trained on virtually ALL the text on the internet."

A Large Language Model (LLM) is:
- A massive neural network (billions or trillions of parameters)
- Trained on enormous amounts of text — books, websites, code, conversations
- It learns the statistical patterns of human language
- Given some text (a prompt), it predicts the most likely next words

Popular LLMs:
- **GPT-4 / GPT-4o** (OpenAI) — Powers ChatGPT
- **Claude** (Anthropic) — Known for safety and reasoning
- **Gemini** (Google) — Multimodal capabilities
- **Llama** (Meta) — Open-source family of models
- **Mistral** (Mistral AI) — Efficient open-source models

"So ChatGPT is just predicting the next word?" Kai asks, surprised.

"Essentially, yes!" Dr. Jane confirms. "But when you do next-word prediction with billions of parameters trained on trillions of words, something remarkable emerges — the model develops sophisticated language understanding, reasoning abilities, and creative capabilities."

## Chapter 2: How LLMs Generate Text 📝

Dr. Jane walks through the process:

Step-by-Step Text Generation:
1. **Tokenization**: Your text is broken into "tokens" (words or sub-words). "Artificial Intelligence" might become ["Art", "ificial", " Int", "elligence"]
2. **Encoding**: Each token is converted to a numerical representation (vector) that captures its meaning
3. **Processing**: The tokens flow through dozens of neural network layers, each refining the understanding
4. **Prediction**: The model outputs a probability for every possible next token. "The cat sat on the ___" → "mat" (85%), "floor" (10%), "chair" (3%)...
5. **Selection**: One token is chosen based on settings (more on this below)
6. **Repeat**: The generated token is added to the context, and steps 2-5 repeat for the next token

"It's like autocomplete on your phone," Dr. Jane explains, "but exponentially more sophisticated. Each word choice considers the entire conversation context."

Key Settings That Affect Output:
- **Temperature**: Controls randomness. Low (0.0) = deterministic and focused. High (1.0) = creative and varied.
- **Context Window**: How much text the model can "see" at once. GPT-4 can process ~128,000 tokens (~300 pages!)
- **Max Tokens**: The maximum length of the response
- **Top-P (Nucleus Sampling)**: Another way to control randomness by limiting which tokens are considered

## Chapter 3: Prompt Engineering — Talking to AI 🎨

Kai discovers that HOW you ask matters enormously:

"The prompt is your interface to the AI," Dr. Jane explains. "A well-crafted prompt can get dramatically better results."

Prompt Engineering Basics:
1. **Be Specific**: "Write a poem" → vague. "Write a 4-line haiku about autumn leaves falling in Kyoto" → much better
2. **Provide Context**: "Explain quantum computing" → generic. "Explain quantum computing to a 10-year-old using a cookie analogy" → tailored
3. **Set the Role**: "You are an expert cardiologist. Review these symptoms..." → activates domain knowledge
4. **Give Examples**: Show the AI the format you want. "Here's an example output: [example]. Now do the same for..."
5. **Chain of Thought**: "Think step by step" — encourages the model to reason through problems rather than jumping to answers

"Prompt engineering is becoming a real skill," Kai observes. "It's like learning to ask the right questions!"

## Chapter 4: Beyond Text — Multimodal AI 🎭

Kai learns that modern AI goes far beyond text:

Types of AI Models:
- **Text Generation**: Writing, coding, analysis (GPT-4, Claude)
- **Image Generation**: Creating images from text descriptions (DALL-E, Midjourney, Stable Diffusion)
- **Speech & Audio**: Text-to-speech, speech recognition, music generation
- **Video Generation**: Creating short videos from prompts (Sora, Runway)
- **Code Generation**: Writing and debugging code (GitHub Copilot, Cursor)

Multimodal Models:
- Can process AND generate multiple types of media
- GPT-4o can understand images, text, and audio simultaneously
- Gemini can analyze videos, images, and text together
- The trend is toward unified models that handle everything

"We're living in the most exciting time in AI history," Dr. Jane reflects. "These tools are being democratized — anyone can use them."

## Chapter 5: AI in the Real World Today 🌍

Kai catalogs the impact AI is already having:

Everyday AI Applications:
- **Search Engines**: AI-powered results and summaries (Google AI Overview, Perplexity)
- **Virtual Assistants**: Siri, Alexa, Google Assistant
- **Content Creation**: Writing, design, marketing with AI co-pilots
- **Healthcare**: Medical imaging analysis, drug discovery, diagnostics
- **Finance**: Fraud detection, algorithmic trading, risk assessment
- **Transportation**: Self-driving cars, route optimization, traffic prediction
- **Education**: Personalized tutoring, automated grading, curriculum design

The Scale of AI Today:
- ChatGPT reached 100 million users in just 2 months (fastest adoption ever)
- 77% of companies are using or exploring AI (2025)
- The global AI market is projected to exceed $1 trillion by 2030
- AI is being integrated into virtually every software product

## But There's a Problem... ⚠️

"This all sounds incredible," Kai says. "But I have one nagging question: when I send my data to an AI service, how do I know I can TRUST what happens?"

Dr. Jane nods knowingly. "That's exactly the right question, Kai. And it's the question we'll spend the rest of this module answering — using EigenLayer, Trusted Execution Environments, and blockchain verification."

"AI is powerful. But power without trust is dangerous. Let's learn how to make AI trustworthy."

Welcome to the AI revolution — now let's make it verifiable! 💬✨`,
                    questions: [
                        {
                            id: "q1",
                            question: "How do Large Language Models (LLMs) generate text?",
                            options: [
                                "They search the internet for matching text and copy it",
                                "They predict the most likely next token based on statistical patterns learned during training",
                                "They have a database of pre-written responses for every question",
                                "They use rule-based grammar engines to construct sentences",
                            ],
                            correctAnswer: 1,
                            explanation:
                                "LLMs generate text by predicting the most likely next token (word or sub-word) based on patterns learned from massive training datasets. Each token is generated one at a time, considering all preceding context.",
                            type: "multiple-choice",
                        },
                        {
                            id: "q2",
                            question:
                                "True or False: A higher 'temperature' setting in an LLM makes the output more deterministic and focused.",
                            options: ["True", "False"],
                            correctAnswer: 1,
                            explanation:
                                "False! A higher temperature makes outputs more random and creative. A LOWER temperature (closer to 0) makes outputs more deterministic and focused. Temperature controls the randomness of token selection during generation.",
                            type: "true-false",
                        },
                        {
                            id: "q3",
                            question: "What is 'prompt engineering'?",
                            options: [
                                "Building the physical hardware that runs AI models",
                                "The skill of crafting effective instructions and context to get better results from AI models",
                                "A programming language used to train neural networks",
                                "The process of compressing AI models to run on smaller devices",
                            ],
                            correctAnswer: 1,
                            explanation:
                                "Prompt engineering is the art and skill of crafting effective prompts — including specific instructions, context, examples, and role-setting — to get dramatically better and more useful outputs from AI models.",
                            type: "multiple-choice",
                        },
                    ],
                },
            },
        ],
    },
    {
        id: "eigen-restaking-intro",
        title: "Introduction to Eigen & Restaking",
        description:
            "Discover how EigenLayer revolutionizes blockchain security through restaking and learn about Actively Validated Services (AVS) — the building blocks for verifiable AI.",
        icon: "🔗",
        level: "Beginner",
        points: 10,
        duration: "1.5 hours",
        status: "available",
        badge: {
            title: "Eigen Explorer",
            description: "Mastered Eigen & Restaking Fundamentals",
            image: "/badges/eigen-explorer.png",
        },
        sections: [
            {
                id: "kai-discovers-eigen",
                title: "Kai Discovers EigenLayer",
                type: "theory",
                status: "available",
                estimatedTime: "25 min",
                content: {
                    story: `# Kai Discovers EigenLayer 🔗

> 🎭 **Meet Your Guides:** Throughout this module, you'll learn alongside fictional characters — **Kai** (a curious blockchain developer), **Dr. Jane** (his mentor and professor), **Maya** and **Alex** (fellow students). They'll guide you through complex concepts using real-world analogies and hands-on exploration. Let's begin!

Meet Kai, a blockchain developer who's been wrestling with a big problem: how do you build new decentralized services without spending millions on security?

## Chapter 1: The Security Problem 🤔

Kai has an idea for a new decentralized oracle service. But there's a catch:

Traditional Security Bootstrapping:
- You need to create your own token
- Convince people to buy and stake it
- Build enough economic security to be trustworthy
- This can take years and millions of dollars!

"I have a great service idea," Kai sighs, "but I can't afford to bootstrap security from scratch. Ethereum has $50 billion+ in staked ETH securing it — I wish I could borrow some of that."

## Chapter 2: Enter EigenLayer ✨

Kai's mentor, Dr. Jane, introduces them to EigenLayer:

"What if I told you," Dr. Jane says, "that you could tap into Ethereum's massive security pool without building your own from scratch?"

What is EigenLayer?
- A protocol built on Ethereum that enables **restaking**
- Founded by Sreeram Kannan at the University of Washington
- It allows ETH stakers to re-use (restake) their staked ETH to secure additional services
- Think of it as a **shared security marketplace**

## Chapter 3: Understanding Restaking 🔄

Dr. Jane draws a diagram for Kai:

Traditional Staking (Without EigenLayer):
- You stake 32 ETH to validate Ethereum
- Your ETH only secures one thing: Ethereum
- Like hiring a security guard who only watches one building

Restaking (With EigenLayer):
- You stake 32 ETH to validate Ethereum
- You ALSO opt-in to secure additional services with the same ETH
- Your ETH now secures Ethereum AND other services simultaneously
- Like one security guard watching multiple buildings at once!

"So restakers earn extra rewards for providing extra security?" Kai asks.

"Exactly!" Dr. Jane confirms. "But if they misbehave, they risk getting slashed — losing a portion of their staked ETH. This economic incentive keeps everyone honest."

## Chapter 4: Actively Validated Services (AVS) 🛡️

Dr. Jane explains the key concept:

An AVS (Actively Validated Service) is any service that uses EigenLayer's restaked security:
- Oracle networks (price feeds for DeFi)
- Data availability layers (like EigenDA)
- Bridge protocols (cross-chain communication)
- AI inference services (like EigenAI!)
- TEE committees (trusted execution verification)

"Instead of building security from scratch," Dr. Jane explains, "your oracle service registers as an AVS on EigenLayer. Restakers opt-in to validate your service, and you inherit Ethereum-grade security from day one!"

## Chapter 5: The Ecosystem Vision 🌐

Kai realizes the bigger picture:

The EigenLayer Stack:
1. **Ethereum Layer**: Base security from ETH stakers
2. **EigenLayer Protocol**: Enables restaking and manages operator coordination
3. **Operators**: Run validation tasks for AVSs
4. **AVSs**: Decentralized services that consume security (AI, oracles, bridges, and more)

Key Ecosystem Numbers (2025):
- $17+ billion Total Value Locked (TVL)
- 20+ live AVSs on mainnet
- Thousands of operators validating services

"This changes everything!" Kai exclaims. "New services can launch with Ethereum-level security from day one. And for AI — this could solve the trust problem entirely!"

## The Restaking Revolution 🚀

EigenLayer represents a paradigm shift: from isolated security silos to shared, pooled security. This isn't just about efficiency — it's about enabling an entirely new category of verifiable services, especially AI.

Welcome to the restaking revolution! 🔗✨`,
                    questions: [
                        {
                            id: "q1",
                            question: "What is the core innovation of EigenLayer?",
                            options: [
                                "Creating a new blockchain from scratch",
                                "Allowing staked ETH to secure multiple services simultaneously through restaking",
                                "Replacing Ethereum's proof-of-stake mechanism",
                                "Building a centralized security provider",
                            ],
                            correctAnswer: 1,
                            explanation:
                                "EigenLayer's core innovation is restaking — allowing ETH that's already staked to secure Ethereum to also secure additional services (AVSs), creating shared/pooled security.",
                            type: "multiple-choice",
                        },
                        {
                            id: "q2",
                            question:
                                "True or False: An AVS (Actively Validated Service) must build its own security from scratch.",
                            options: ["True", "False"],
                            correctAnswer: 1,
                            explanation:
                                "False! AVSs leverage EigenLayer's restaked ETH for security, which means they can inherit Ethereum-grade security from day one without bootstrapping their own.",
                            type: "true-false",
                        },
                    ],
                },
            },
            {
                id: "avs-deep-dive",
                title: "How AVS Powers New Services",
                type: "theory",
                status: "available",
                estimatedTime: "20 min",
                content: {
                    story: `# How AVS Powers New Services ⚙️

With restaking understood, Kai dives deeper into how Actively Validated Services actually work — and why they're the key to verifiable AI.

## Chapter 1: The AVS Lifecycle 🔄

Dr. Jane walks Kai through how an AVS operates:

Step 1 — Registration:
- A developer creates a new service (e.g., an AI inference engine)
- They register it as an AVS on EigenLayer
- They define the validation rules: "What does correct behavior look like?"

Step 2 — Operator Opt-In:
- Operators (people running validator nodes) choose which AVSs to support
- They stake (or restake) ETH as collateral
- More operators = more security for the AVS

Step 3 — Task Execution:
- Users submit requests to the AVS (e.g., "Run this AI inference")
- Operators execute the tasks and submit results
- Multiple operators can verify each other's work

Step 4 — Verification & Rewards:
- Results are checked against the validation rules
- Honest operators earn rewards
- Dishonest operators get slashed (lose staked ETH)

## Chapter 2: Types of AVS in the Ecosystem 🌐

Kai discovers the variety of AVSs being built:

Data Availability (EigenDA):
- Stores transaction data off-chain but keeps it verifiable
- Used by Layer 2 rollups to reduce costs
- The first and largest AVS on EigenLayer

Oracle Networks:
- Provide real-world data to smart contracts (prices, weather, events)
- Restaked security makes price feeds more trustworthy
- Example: Decentralized price oracles for DeFi

AI Services (EigenAI & EigenCompute):
- Verifiable AI model inference
- Secure execution in Trusted Execution Environments
- This is where the AI revolution meets blockchain security!

TEE Committees:
- Decentralized networks of Trusted Execution Environments
- Multiple TEE hardware types (Intel SGX, TDX, ARM TrustZone)
- Provide hardware-grade isolation with economic guarantees

## Chapter 3: Why AVS Matters for AI 🤖

Kai has an aha moment:

The AI Trust Problem:
- Traditional AI is a "black box" — you can't verify what happens inside
- Who knows if the model was tampered with?
- Who knows if the prompt was altered before processing?
- Who guarantees the response hasn't been modified?

AVS Solution for AI:
- AI services run as AVSs on EigenLayer
- Multiple operators verify AI outputs
- Economic incentives (slashing) punish dishonest behavior
- Cryptographic proofs ensure integrity
- Result: **Verifiable, trustworthy AI** backed by billions in security

"So EigenLayer doesn't just secure financial services," Kai realizes. "It can secure AI itself — making AI outputs trustworthy and verifiable!"

## The Foundation Is Set 🏗️

Understanding restaking and AVS is the foundation for everything that follows. Next, we'll explore the technology that makes secure AI computation possible: Trusted Execution Environments.

The building blocks are in place! ⚙️✨`,
                    questions: [
                        {
                            id: "q1",
                            question: "What happens to operators who behave dishonestly in an AVS?",
                            options: [
                                "They receive a warning but keep their stake",
                                "Their staked ETH gets slashed (partially lost) as punishment",
                                "They are banned from the internet",
                                "Nothing — the system is trust-based",
                            ],
                            correctAnswer: 1,
                            explanation:
                                "Dishonest operators face slashing — they lose a portion of their staked ETH. This economic penalty is what keeps the system honest and trustworthy.",
                            type: "multiple-choice",
                        },
                        {
                            id: "q2",
                            question:
                                "True or False: EigenLayer's AVS model can only be used for financial services like DeFi.",
                            options: ["True", "False"],
                            correctAnswer: 1,
                            explanation:
                                "False! AVSs can be any decentralized service — including AI inference, data availability, oracle networks, TEE committees, and much more.",
                            type: "true-false",
                        },
                    ],
                },
            },
        ],
    },
    {
        id: "tee-fundamentals",
        title: "Understanding Trusted Execution Environments",
        description:
            "Dive deep into Trusted Execution Environments (TEE) — the hardware security technology that makes confidential AI computation possible. Learn about Intel TDX, attestation, and hardware isolation.",
        icon: "🔐",
        level: "Beginner",
        points: 10,
        duration: "2 hours",
        status: "available",
        badge: {
            title: "TEE Guardian",
            description: "Mastered Trusted Execution Environments",
            image: "/badges/tee-guardian.png",
        },
        sections: [
            {
                id: "maya-tee-discovery",
                title: "Maya's TEE Discovery",
                type: "theory",
                status: "available",
                estimatedTime: "30 min",
                content: {
                    story: `# Maya's TEE Discovery 🔐

Maya, a cybersecurity researcher, has been investigating how to run sensitive AI models without exposing private data. Her quest leads her to a breakthrough technology: Trusted Execution Environments.

## Chapter 1: The Privacy Paradox 🤔

Maya works for a hospital that wants to use AI to diagnose diseases from patient scans. But there's a problem:

The Dilemma:
- The AI model needs access to patient data to make diagnoses
- Patient data is extremely private and regulated (HIPAA, GDPR)
- If the AI runs on a regular server, the server admin could peek at patient data
- Even cloud providers could theoretically access the data

"How do we use AI on sensitive data," Maya wonders, "without ANYONE — not even the server operator — being able to see that data?"

## Chapter 2: What is a TEE? 🏰

Maya's colleague, Dr. Chen, introduces her to TEEs:

"Imagine a sealed room inside a computer," Dr. Chen explains.

A Trusted Execution Environment (TEE) is:
- A hardware-protected area inside a processor
- Code and data inside cannot be seen or tampered with by ANYONE — not even the operating system or server administrator
- It's like a vault built directly into the CPU chip

Real-World Analogy — The Sealed Courtroom:
Think of a courtroom where sensitive evidence is examined:
- The evidence (your data) is locked inside a sealed room
- Only authorized programs can enter and work with it
- Not even the building owner (server admin) has a key
- The room has tamper-proof walls (hardware protection)
- Anyone can verify the room is legitimate (attestation)

## Chapter 3: How TEE Works Under the Hood ⚙️

Dr. Chen draws a technical diagram:

Normal CPU Execution:
- Application runs in user space
- OS has full access to application memory
- Hypervisor can see everything
- Admin can dump memory and see all data

TEE Execution:
- Application runs inside an encrypted enclave/domain
- OS CANNOT access enclave memory — it's encrypted by hardware
- Hypervisor CANNOT see inside — hardware blocks access
- Memory is encrypted with keys only the CPU chip knows
- Even physical attacks (probing memory chips) reveal only encrypted data

"The key insight," Dr. Chen emphasizes, "is that protection happens at the HARDWARE level. No software — no matter how privileged — can break in."

## Chapter 4: Intel's TEE Technologies 🏗️

Maya learns about the main TEE implementations:

Intel SGX (Software Guard Extensions):
- First generation of Intel's TEE technology
- Creates small protected areas called "enclaves"
- Limited memory (usually ~128MB)
- Good for small, focused secure computations

Intel TDX (Trust Domain Extensions) ← The star of our story!
- Next-generation TEE technology
- Creates entire protected virtual machines called "Trust Domains"
- Up to 177 vCPU cores and 756GB RAM!
- Perfect for running large AI models
- Used by EigenCompute for verifiable AI

ARM TrustZone:
- ARM's version of TEE (used in phones and IoT)
- Separates processor into "Secure World" and "Normal World"
- Powers secure boot, biometrics, and mobile payments

"Intel TDX is the game-changer," Maya realizes. "It's big enough to run entire AI models inside a secure enclave!"

## Chapter 5: Attestation — Proving Trust 📜

The most powerful feature of TEEs: cryptographic attestation.

What is Attestation?
- A TEE can generate a cryptographic proof of what's running inside it
- This proof (attestation report) contains: the exact code being executed, the hardware configuration, a signature from the CPU chip itself
- Anyone can verify this proof independently

Think of it like a notarized document:
1. The TEE runs your code inside the secure enclave
2. The CPU generates a signed certificate: "I confirm that code X is running in a genuine TEE, untampered"
3. You can verify this certificate against Intel's public keys
4. If it checks out, you KNOW the code ran securely

"So attestation lets you verify remotely," Maya says excitedly, "that a specific program ran inside a genuine TEE — without trusting the server operator at all!"

## Chapter 6: Why AI Needs TEE 🤖🔐

Maya connects the dots:

Without TEE:
- AI model could be swapped for a cheaper/weaker one
- Input prompts could be logged and sold
- Outputs could be modified before delivery
- No way to prove what actually happened

With TEE:
- AI model runs inside hardware-protected enclave
- Inputs and outputs are encrypted end-to-end
- The exact model version is cryptographically attested
- Tamper-proof audit trail of all operations
- Result: **Confidential, verifiable AI**

"This is the missing piece!" Maya exclaims. "TEE gives us the hardware guarantee that AI computations are private, correct, and verifiable. Combined with EigenLayer's economic security — this is unstoppable!"

## The Hardware Trust Revolution 🚀

TEE technology transforms computing from "trust the operator" to "trust the hardware." When combined with blockchain and economic security, it creates a foundation for truly trustworthy AI systems.

Welcome to the age of hardware-guaranteed trust! 🔐✨`,
                    questions: [
                        {
                            id: "q1",
                            question:
                                "What is the key advantage of running AI models inside a TEE?",
                            options: [
                                "It makes the AI model run faster",
                                "It ensures even the server operator cannot see or tamper with the data and computation",
                                "It reduces the cost of running AI models",
                                "It eliminates the need for GPUs",
                            ],
                            correctAnswer: 1,
                            explanation:
                                "The key advantage is hardware-level isolation: even the server administrator or operating system cannot access the data or code running inside a TEE. This ensures privacy and integrity.",
                            type: "multiple-choice",
                        },
                        {
                            id: "q2",
                            question:
                                "True or False: Attestation allows anyone to cryptographically verify what code is running inside a TEE.",
                            options: ["True", "False"],
                            correctAnswer: 0,
                            explanation:
                                "True! Attestation generates a cryptographic proof signed by the CPU hardware itself, allowing anyone to verify that specific code is running inside a genuine TEE without trusting the operator.",
                            type: "true-false",
                        },
                        {
                            id: "q3",
                            question:
                                "Which Intel technology provides TEE capabilities large enough to run full AI models?",
                            options: [
                                "Intel SGX — limited to small enclaves",
                                "Intel TDX — supports up to 177 vCPUs and 756GB RAM",
                                "Intel Core i9 — consumer processor",
                                "Intel Arc — GPU technology",
                            ],
                            correctAnswer: 1,
                            explanation:
                                "Intel TDX (Trust Domain Extensions) creates entire protected virtual machines with massive resources (up to 177 vCPUs and 756GB RAM), making it ideal for running large AI models securely.",
                            type: "multiple-choice",
                        },
                    ],
                },
            },
            {
                id: "tee-security-deep-dive",
                title: "TEE Security & Attack Resistance",
                type: "theory",
                status: "available",
                estimatedTime: "25 min",
                content: {
                    story: `# TEE Security & Attack Resistance 🛡️

Maya dives deeper into the security guarantees of TEEs and learns about the multi-layered defense that makes them suitable for production AI workloads.

## Chapter 1: Layers of Protection 🧅

Dr. Chen explains TEE security like an onion:

Layer 1 — Memory Encryption:
- All data inside a TEE is encrypted in RAM
- Uses AES encryption with hardware-managed keys
- Even if someone physically probes the memory chips, they see only ciphertext

Layer 2 — Access Control:
- The CPU enforces strict boundaries
- No software outside the TEE (including the OS) can read TEE memory
- Hardware access control cannot be bypassed by software exploits

Layer 3 — Integrity Verification:
- The CPU checks that TEE code hasn't been modified
- Any tampering is detected and the TEE halts execution
- Ensures the code you deployed is the code that runs

Layer 4 — Remote Attestation:
- Cryptographic proof of TEE state sent to verifiers
- Uses certificates rooted in Intel's hardware keys
- Allows remote verification without physical access

## Chapter 2: What TEE Protects Against 🚫

Maya catalogs the attack vectors TEE defends against:

Malicious Server Administrators:
- ❌ Cannot read data in the TEE
- ❌ Cannot modify code in the TEE
- ❌ Cannot extract encryption keys

Compromised Operating System:
- ❌ A hacked OS cannot access TEE memory
- ❌ Root/kernel access doesn't bypass hardware protection
- ❌ Malware cannot inject code into the TEE

Physical Attacks:
- ❌ Cold boot attacks see only encrypted memory
- ❌ Bus probing reveals only ciphertext
- ❌ JTAG debugging is blocked for TEE regions

Cloud Provider Access:
- ❌ Cloud infrastructure team cannot peek inside VMs running in TDX
- ❌ Hypervisor isolation prevents cross-VM data leaks
- ❌ Administrative tools cannot dump TEE memory

## Chapter 3: TEE Committees — Multi-Prover Security 🏛️

Maya learns about EigenLayer's innovation: TEE Committees.

The Single TEE Problem:
- A single TEE vendor (e.g., only Intel) is a single point of trust
- What if Intel's hardware has a vulnerability?
- What if the attestation keys are compromised?

TEE Committees Solution (on EigenLayer):
- Multiple TEEs from DIFFERENT hardware vendors verify the same computation
- Example: Intel TDX + ARM TrustZone + Amazon Nitro
- All must agree on the result
- Even if one vendor's TEE is compromised, the others catch it

"It's like having judges from different countries verify a result," Dr. Chen explains. "Even if one judge is corrupt, the others maintain integrity."

EigenLayer's Economic Backstop:
- On top of multi-hardware verification, restaked ETH provides economic guarantees
- If a TEE committee signs off on a wrong result, operators lose staked ETH
- Hardware trust + economic trust = maximum security

## Chapter 4: TEE in the Real World 🌍

Maya sees TEE already powering critical systems:

Mobile Payments:
- Your phone uses ARM TrustZone for Apple Pay and Google Pay
- Fingerprint and face data is processed inside the TEE
- Even malware on your phone can't steal biometric data

Cloud Confidential Computing:
- Google Cloud Confidential VMs use AMD SEV/Intel TDX
- Microsoft Azure Confidential Computing
- AWS Nitro Enclaves
- Enterprises run sensitive workloads without trusting cloud providers

Blockchain Applications:
- EigenCompute uses Intel TDX for verifiable AI
- Secret Network uses SGX for private smart contracts
- Oasis Network uses TEE for confidential DeFi

"TEE isn't experimental," Maya concludes. "It's already securing billions of dollars in payments and enterprise workloads. Applying it to AI is the natural next step!"

## The Multi-Layer Trust Stack 🏗️

The combination of hardware isolation (TEE) + cryptographic attestation + multi-prover committees + economic security (EigenLayer slashing) creates the most robust trust architecture ever built for AI computation.

This is production-grade security! 🛡️✨`,
                    questions: [
                        {
                            id: "q1",
                            question:
                                "Why does EigenLayer use TEE Committees instead of a single TEE?",
                            options: [
                                "A single TEE is too slow for AI workloads",
                                "TEE Committees use hardware from multiple vendors, so even if one vendor's TEE is compromised, the others maintain integrity",
                                "TEE Committees are cheaper to operate",
                                "A single TEE cannot run in the cloud",
                            ],
                            correctAnswer: 1,
                            explanation:
                                "TEE Committees combine TEEs from different hardware vendors (Intel, ARM, Amazon). If one vendor's hardware has a vulnerability, the others catch discrepancies — eliminating single points of trust.",
                            type: "multiple-choice",
                        },
                        {
                            id: "q2",
                            question:
                                "True or False: A compromised operating system with root access can read data inside a TEE.",
                            options: ["True", "False"],
                            correctAnswer: 1,
                            explanation:
                                "False! TEE protection is enforced at the hardware level. Even with full root/kernel access, the operating system cannot read or modify data inside a TEE — the CPU blocks all unauthorized access.",
                            type: "true-false",
                        },
                    ],
                },
            },
        ],
    },
    {
        id: "ai-trust-problem",
        title: "AI Fundamentals & The Trust Problem",
        description:
            "Understand how AI and machine learning work, then discover the critical trust gap in today's AI systems — and why blockchain verification is the answer.",
        icon: "🤖",
        level: "Beginner",
        points: 15,
        duration: "2.5 hours",
        status: "available",
        badge: {
            title: "AI Investigator",
            description: "Mastered AI Fundamentals and Trust Challenges",
            image: "/badges/ai-investigator.png",
        },
        sections: [
            {
                id: "alex-ai-journey",
                title: "Alex's AI Journey",
                type: "theory",
                status: "available",
                estimatedTime: "30 min",
                content: {
                    story: `# Alex's AI Journey 🤖

Meet Alex, a curious entrepreneur who wants to understand AI before building with it. Join Alex on a journey from the basics of artificial intelligence to the frontier of verifiable AI.

## Chapter 1: What is Artificial Intelligence? 🧠

Alex starts with the fundamentals:

"AI seems like magic," Alex says. "But what is it actually doing?"

Dr. Priya, an AI researcher, explains:

Artificial Intelligence is:
- Computer systems that perform tasks typically requiring human intelligence
- Pattern recognition at superhuman scale and speed
- Statistical predictions based on massive datasets
- NOT sentient, conscious, or "thinking" — it's advanced mathematics

Types of AI Alex Learns About:
1. **Narrow AI (ANI)**: Specialized in one task (today's AI)
   - Example: ChatGPT (text generation), DALL-E (image creation)
2. **General AI (AGI)**: Can do any intellectual task a human can (future goal)
3. **Machine Learning (ML)**: AI that improves by learning from data
4. **Deep Learning**: ML using neural networks with many layers

## Chapter 2: How Machine Learning Works 📊

Dr. Priya uses a simple analogy:

Imagine Teaching a Child to Recognize Cats:
- You show the child thousands of cat photos (Training Data)
- The child's brain builds a mental model of "what makes a cat" (Model Training)
- Now the child can identify cats they've never seen before (Inference)
- The more photos they see, the better they get (More Data = Better Model)

Machine Learning Works the Same Way:
1. **Training**: Feed the model millions of examples
2. **Learning**: The model adjusts internal parameters to find patterns
3. **Inference**: The trained model makes predictions on new data

"So the 'intelligence' is really just sophisticated pattern matching?" Alex asks.

"Exactly!" Dr. Priya confirms. "But at a scale and speed no human brain could match."

## Chapter 3: Large Language Models (LLMs) 💬

Alex explores the AI technology behind tools like ChatGPT:

What is an LLM?
- A machine learning model trained on billions of words of text
- It learns the statistical patterns of human language
- Given a prompt, it predicts the most likely next words
- Models like GPT-4, Claude, and Llama power today's AI revolution

How LLMs Work (Simplified):
1. Training: Read billions of web pages, books, and articles
2. Pattern Learning: Understand grammar, facts, reasoning patterns
3. Text Generation: Given a prompt, generate human-like responses word by word
4. Fine-Tuning: Customize for specific tasks (coding, medical advice, etc.)

Key Parameters:
- Temperature: Controls randomness (low = deterministic, high = creative)
- Context Window: How much text the model can process at once
- Model Size: Billions of parameters (GPT-4 has ~1.7 trillion)

"These models are incredibly powerful," Alex realizes. "But how do I know I can TRUST their outputs?"

## Chapter 4: The AI Trust Crisis ⚠️

Alex discovers the fundamental problem with today's AI:

The Black Box Problem:
- You send a prompt to an AI API
- Something happens inside a server somewhere
- You receive a response
- But you have NO WAY to verify: Was the right model used? Was your prompt modified? Was the response altered? Did the model run correctly?

Real-World Trust Issues:
1. **Model Swapping**: A provider could secretly use a cheaper, less accurate model
2. **Prompt Injection**: Your input could be modified before reaching the model
3. **Output Manipulation**: The response could be censored or altered
4. **Data Logging**: Your private prompts could be logged and sold
5. **No Reproducibility**: The same prompt might give different results with no explanation

"This is a huge problem for businesses!" Alex exclaims. "If I'm building a medical diagnosis tool, I NEED to guarantee the right model was used!"

## The Foundation for Verifiable AI 🏗️

Alex now understands both how AI works and why it needs verification. The next chapter will show how EigenLayer's technology bridges this trust gap.

The AI revolution needs a trust revolution! 🤖✨`,
                    questions: [
                        {
                            id: "q1",
                            question: "What is the 'Black Box Problem' in AI?",
                            options: [
                                "AI models are stored in black-colored servers",
                                "Users cannot verify what model was used, whether inputs were modified, or if outputs were altered",
                                "AI models only work in dark rooms",
                                "Black box AI models are more expensive to run",
                            ],
                            correctAnswer: 1,
                            explanation:
                                "The Black Box Problem means users have no visibility into what happens between sending a prompt and receiving a response — they can't verify the model, the process, or the integrity of the output.",
                            type: "multiple-choice",
                        },
                        {
                            id: "q2",
                            question:
                                "True or False: Large Language Models (LLMs) actually understand and think about the text they generate.",
                            options: ["True", "False"],
                            correctAnswer: 1,
                            explanation:
                                "False! LLMs are sophisticated pattern-matching systems that predict the most likely next words based on statistical patterns learned from training data. They don't truly 'understand' or 'think.'",
                            type: "true-false",
                        },
                    ],
                },
            },
            {
                id: "ai-verification-need",
                title: "Why AI Needs Blockchain Verification",
                type: "theory",
                status: "available",
                estimatedTime: "25 min",
                content: {
                    story: `# Why AI Needs Blockchain Verification 🔍

Alex now understands AI's trust problem. But how do you solve it? The answer lies in combining AI with blockchain — specifically EigenLayer's verification infrastructure.

## Chapter 1: Traditional Solutions Fall Short 🚫

Alex investigates existing approaches to AI trust:

Approach 1 — Trust the Provider:
- "Just trust OpenAI/Google/Anthropic to do the right thing"
- Problem: Companies can change models, log data, or modify outputs without disclosure
- No cryptographic proof — just promises

Approach 2 — Open Source Models:
- "Run the model yourself so you know what's happening"
- Problem: Requires expensive GPU infrastructure ($10K-$100K+/month)
- Not practical for most businesses or individuals

Approach 3 — Auditing:
- "Have third parties audit the AI provider"
- Problem: Audits are point-in-time snapshots; bad behavior can happen between audits
- No real-time verification

"None of these truly solve the problem," Alex concludes. "We need something that provides continuous, cryptographic, real-time proof."

## Chapter 2: Enter Verifiable AI 🛡️

Dr. Priya introduces the solution:

"What if every AI inference came with a cryptographic proof that verified: the exact model that ran, the exact prompt that was processed, that no modifications occurred, and the exact output that was generated?"

Verifiable AI Combines:
1. **Trusted Execution Environments (TEE)**: Hardware guarantees that the computation is private and untampered
2. **Cryptographic Attestation**: Mathematical proof of what ran inside the TEE
3. **Blockchain Verification**: Immutable record of AI operations on-chain
4. **Economic Security**: Staked ETH at risk if operators cheat

The Verification Flow:
1. User sends prompt → encrypted and sent to TEE
2. AI model runs inside TEE → hardware-isolated, untamperable
3. TEE generates attestation → cryptographic proof of correct execution
4. Proof published on-chain → immutable, publicly verifiable
5. Operators staked ETH → economic penalty for any dishonesty

## Chapter 3: Why EigenLayer is the Perfect Platform 🎯

Alex sees why EigenLayer is uniquely positioned:

Problem → EigenLayer Solution:
- Need hardware trust → TEE integration (Intel TDX)
- Need economic incentives → Restaked ETH with slashing
- Need decentralization → Network of independent operators
- Need verification → Cryptographic attestation + on-chain proofs
- Need scalability → AVS model allows infinite services

The Key Insight:
"EigenLayer doesn't just add blockchain to AI," Dr. Priya explains. "It creates a complete trust infrastructure where hardware security (TEE), cryptographic proofs (attestation), economic incentives (restaking), and decentralized verification (operators) ALL work together."

## Chapter 4: The Verifiable AI Stack 📚

Alex visualizes the complete stack:

Layer 1 — Hardware: Intel TDX provides isolated execution
Layer 2 — Computation: AI models run inside TEEs
Layer 3 — Attestation: Cryptographic proofs generated by hardware
Layer 4 — Protocol: EigenLayer manages operators and verification
Layer 5 — Economics: Restaked ETH incentivizes honest behavior
Layer 6 — Application: Developers build verifiable AI apps

"This is the future of AI!" Alex exclaims. "Not just powerful AI, but AI you can actually TRUST and VERIFY."

## Ready for EigenAI 🚀

With this conceptual foundation in place, Alex is ready to dive into EigenLayer's specific AI products: EigenAI for verifiable inference and EigenCompute for secure execution.

Trust + AI = The Future! 🔍✨`,
                    questions: [
                        {
                            id: "q1",
                            question:
                                "What are the four pillars that make EigenLayer's verifiable AI possible?",
                            options: [
                                "Speed, cost, simplicity, and branding",
                                "TEE hardware isolation, cryptographic attestation, blockchain verification, and economic security (restaking)",
                                "Open source code, community governance, social media, and marketing",
                                "GPU acceleration, cloud computing, API endpoints, and dashboards",
                            ],
                            correctAnswer: 1,
                            explanation:
                                "EigenLayer's verifiable AI combines: TEE for hardware-level security, attestation for cryptographic proofs, blockchain for immutable verification records, and restaked ETH for economic incentives against dishonesty.",
                            type: "multiple-choice",
                        },
                        {
                            id: "q2",
                            question:
                                "True or False: Simply open-sourcing an AI model fully solves the trust problem.",
                            options: ["True", "False"],
                            correctAnswer: 1,
                            explanation:
                                "False! While open source allows inspection of the model, it doesn't prove that a specific provider is actually using that model, that inputs weren't modified, or that outputs weren't altered. Cryptographic verification is still needed.",
                            type: "true-false",
                        },
                    ],
                },
            },
            {
                id: "ai-agents-overview",
                title: "The Rise of AI Agents",
                type: "theory",
                status: "available",
                estimatedTime: "20 min",
                content: {
                    story: `# The Rise of AI Agents 🤖🌐

Alex explores the cutting-edge frontier of AI: autonomous agents — and why they need verifiable infrastructure more than any other AI application.

## Chapter 1: What are AI Agents? 🕵️

Alex learns about the next evolution of AI:

Traditional AI (Chatbots):
- You ask a question, it gives an answer
- Single interaction — no memory or continuity
- Passive — waits for your input

AI Agents:
- Autonomous software that can plan, decide, and execute actions
- Can use tools, browse the web, write code, and interact with services
- Operate continuously — work on tasks even when you're away
- Goal-oriented — given an objective, they figure out the steps

"Think of the difference between asking someone for directions versus hiring a personal assistant who plans your entire trip, books hotels, and arranges transportation," Dr. Priya explains.

## Chapter 2: Why Agents Need Verification Even More 🔐

The stakes are higher with autonomous agents:

Agents Can:
- Hold and transfer money (crypto wallets)
- Sign transactions on your behalf
- Make decisions that affect your finances
- Interact with other agents and services

Without Verification:
- How do you know the agent is running the code you deployed?
- How do you know it hasn't been compromised?
- How do you verify its decisions were based on correct data?
- How do you audit what the agent did while you were away?

"If I can't verify a chatbot's single response," Alex realizes, "imagine the risk of an autonomous agent managing my money 24/7 without any proof of correct behavior!"

## Chapter 3: Proofs of Autonomy, Sovereignty & Integrity 📜

Dr. Priya introduces EigenLayer's verification framework for agents:

Proof of Autonomy:
- Cryptographic evidence that the agent is running independently
- No human is secretly controlling or overriding the agent
- The agent's decisions are its own, based on its programming

Proof of Sovereignty:
- The agent has its own cryptographic identity (wallet)
- Its keys are generated inside a TEE — no one else has access
- It can sign transactions that are provably its own

Proof of Integrity:
- Every action the agent takes is attested by TEE hardware
- Immutable audit trail of all decisions stored on-chain
- Anyone can verify the agent's complete history

"These three proofs together," Dr. Priya explains, "create trusted AI agents — agents you can rely on to operate honestly, independently, and verifiably."

## Chapter 4: The Agent Economy 💰

Alex glimpses the future:

Emerging Agent Use Cases:
- **DeFi Trading Agents**: Autonomous trading with verifiable strategies
- **Data Monetization**: Agents that sell data with privacy guarantees
- **Content Creation**: Verified AI-generated content with attribution
- **DevOps Agents**: Autonomous infrastructure management with audit trails
- **Research Agents**: AI assistants that provide verifiable citations

The EigenLayer Advantage:
- Each agent runs inside EigenCompute (TEE-protected)
- Each agent gets its own wallet and cryptographic identity
- All operations are attested and verifiable on-chain
- Restaked ETH backs the integrity of every agent action

"This isn't science fiction," Alex marvels. "These agents are being built RIGHT NOW on EigenLayer's infrastructure!"

## The Agent Revolution Is Here 🚀

AI agents represent the next frontier — and they demand the highest level of trust infrastructure. EigenLayer's combination of TEE, cryptographic proofs, and economic security creates the foundation for an entire economy of trustworthy autonomous agents.

Welcome to the age of verifiable AI agents! 🤖🌐✨`,
                    questions: [
                        {
                            id: "q1",
                            question:
                                "Why do AI agents need verification even more than traditional chatbots?",
                            options: [
                                "AI agents are faster than chatbots",
                                "AI agents can hold money, sign transactions, and make autonomous decisions — much higher stakes than a single chat response",
                                "AI agents use more electricity",
                                "AI agents always give wrong answers",
                            ],
                            correctAnswer: 1,
                            explanation:
                                "AI agents operate autonomously, can hold and transfer funds, sign transactions, and make decisions without human oversight. The higher stakes demand stronger verification guarantees.",
                            type: "multiple-choice",
                        },
                        {
                            id: "q2",
                            question:
                                "True or False: 'Proof of Sovereignty' means the AI agent's cryptographic keys are generated inside a TEE, ensuring no one else has access.",
                            options: ["True", "False"],
                            correctAnswer: 0,
                            explanation:
                                "True! Proof of Sovereignty ensures the agent has its own cryptographic identity with keys generated inside a TEE. No human or external system can access or control these keys.",
                            type: "true-false",
                        },
                    ],
                },
            },
        ],
    },
    {
        id: "eigen-ai-inference",
        title: "EigenAI — Verifiable AI Inference",
        description:
            "Explore EigenAI, EigenLayer's verifiable LLM inference service. Learn how it provides an OpenAI-compatible API with cryptographic proofs that ensure prompts, models, and responses are untampered.",
        icon: "⚡",
        level: "Intermediate",
        points: 15,
        duration: "2 hours",
        status: "available",
        badge: {
            title: "AI Verifier",
            description: "Mastered EigenAI Verifiable Inference",
            image: "/badges/ai-verifier.png",
        },
        sections: [
            {
                id: "eigenai-architecture",
                title: "Inside EigenAI Architecture",
                type: "theory",
                status: "available",
                estimatedTime: "30 min",
                content: {
                    story: `# Inside EigenAI Architecture ⚡

Kai is ready to build with EigenAI — the verifiable LLM inference service. Let's dive into how it works under the hood.

## Chapter 1: What is EigenAI? 🎯

Dr. Jane introduces EigenAI:

"EigenAI is a verifiable Large Language Model (LLM) inference service that provides an OpenAI-compatible API — but with cryptographic guarantees."

EigenAI Key Features:
- **OpenAI-Compatible API**: Drop-in replacement for existing AI integrations
- **Verifiable Inference**: Every response comes with cryptographic proof
- **Deterministic Outputs**: Same prompt + same parameters = same output, every time
- **TEE-Protected**: Models run inside Intel TDX trusted execution environments
- **On-Chain Attestation**: Proofs are verifiable on the blockchain

## Chapter 2: The EigenAI Architecture 🏗️

Dr. Jane draws the system diagram:

Request Flow:
1. **Developer** sends prompt via OpenAI-compatible API
2. **API Gateway** receives and routes the request
3. **TEE Enclave** (Intel TDX) processes the request:
   - Loads the specified AI model
   - Processes the prompt with exact parameters
   - Generates the response
   - Creates an attestation signature
4. **Response** returned with:
   - The AI-generated text
   - Attestation proof (cryptographic signature)
   - Model ID and version used
   - Hash of input prompt
   - Hash of output response

What Makes It Verifiable:
- The TEE ensures the model and prompt were not tampered with
- The attestation proves the exact code that ran
- The hashes allow independent verification
- The on-chain record creates an immutable audit trail

## Chapter 3: Deterministic Inference 🎲➡️🎯

Kai learns about EigenAI's unique feature:

The Reproducibility Problem:
- Traditional AI APIs: Same prompt can give different answers each time
- Why? Temperature, random seeds, and model updates cause variation
- This makes verification impossible — how can you verify a non-reproducible result?

EigenAI's Solution — Deterministic Mode:
- Fixed random seed for each request
- Temperature locked to specific values
- Model version pinned (no silent updates)
- Result: Same request ALWAYS produces the same output

"This is crucial," Dr. Jane explains. "If I claim an AI model gave a specific answer to a specific prompt, anyone can re-run it and get the exact same result. That's what makes it verifiable."

Verification Example:
1. You send: "Is this contract safe?" with model Llama-3.1-8B, temp=0
2. EigenAI returns: "The contract has 3 potential vulnerabilities..." + attestation
3. A verifier re-runs the same prompt with the same parameters
4. They get the EXACT same response
5. The attestation proves it ran inside a genuine TEE
6. Trust established! ✅

## Chapter 4: Supported Models & Capabilities 🧠

Kai explores what's available:

Currently Supported Models:
- Llama 3.1 (8B, 70B parameters)
- Mistral and Mixtral models
- Custom fine-tuned models (coming soon)

API Capabilities:
- Text completion and chat
- System prompts and multi-turn conversations
- Streaming responses
- Function calling
- Embeddings generation

"The beauty of the OpenAI-compatible API," Dr. Jane notes, "is that you can switch from OpenAI to EigenAI with just a URL change. Your existing code works — but now with verification built in."

## The Verifiable AI API 🚀

EigenAI represents a paradigm shift: from "trust the provider" to "verify the computation." Developers get the same powerful AI capabilities they're used to, but with cryptographic proof that everything is legitimate.

Welcome to verifiable inference! ⚡✨`,
                    questions: [
                        {
                            id: "q1",
                            question: "What makes EigenAI's inference 'verifiable'?",
                            options: [
                                "It uses faster GPUs than competitors",
                                "Every response includes a cryptographic attestation proof from the TEE hardware, plus deterministic outputs that can be independently reproduced",
                                "It has a larger AI model than other providers",
                                "It requires users to verify their identity before using the API",
                            ],
                            correctAnswer: 1,
                            explanation:
                                "EigenAI's verifiability comes from TEE attestation (cryptographic proof of untampered execution) + deterministic outputs (same input always produces the same output, allowing independent verification).",
                            type: "multiple-choice",
                        },
                        {
                            id: "q2",
                            question:
                                "True or False: EigenAI requires developers to learn a completely new API to use it.",
                            options: ["True", "False"],
                            correctAnswer: 1,
                            explanation:
                                "False! EigenAI provides an OpenAI-compatible API, so developers can switch from OpenAI to EigenAI with just a URL change. Existing code works with minimal modifications.",
                            type: "true-false",
                        },
                    ],
                },
            },
            {
                id: "eigenai-in-practice",
                title: "Building with EigenAI",
                type: "theory",
                status: "available",
                estimatedTime: "25 min",
                content: {
                    story: `# Building with EigenAI 🛠️

Kai is ready to build a real application using EigenAI. Let's walk through how developers actually integrate verifiable AI into their projects.

## Chapter 1: Getting Started with EigenAI 🚀

Kai sets up his first EigenAI integration:

The Setup Process:
1. Get an API key from EigenCloud
2. Point your existing OpenAI SDK to EigenAI's endpoint
3. Send requests as you normally would
4. Receive responses WITH attestation proofs

Code Comparison:

Traditional OpenAI Call:
- Endpoint: api.openai.com/v1/chat/completions
- Response: Just the AI text

EigenAI Call:
- Endpoint: eigenai.eigencloud.xyz/v1/chat/completions
- Response: AI text + attestation signature + model hash + I/O hashes

"That's it?" Kai is surprised. "I just change the URL?"

"That's the beauty of API compatibility," Dr. Jane confirms.

## Chapter 2: Understanding Attestation Responses 📋

Kai examines what EigenAI returns:

Standard AI Response Fields:
- model: "meta-llama/Llama-3.1-8B-Instruct"
- content: "The analysis shows..."
- usage: tokens used, completion time

EigenAI-Specific Verification Fields:
- attestation_signature: Cryptographic proof from Intel TDX
- model_hash: SHA-256 hash of the exact model weights used
- input_hash: Hash of the prompt (proves prompt wasn't modified)
- output_hash: Hash of the response (proves response wasn't altered)
- tee_report: Full TEE attestation report
- timestamp: When the inference was performed

"With these fields," Dr. Jane explains, "anyone can independently verify that the response is legitimate. The attestation is signed by the TEE hardware itself — it can't be faked."

## Chapter 3: Verification Workflows 🔍

Kai learns how to verify EigenAI responses:

Client-Side Verification:
1. Receive the response and attestation
2. Verify the attestation signature against Intel's public keys
3. Check that the model hash matches the expected model
4. Verify input/output hashes match the actual prompt and response
5. If all checks pass → the response is verified ✅

On-Chain Verification:
1. Submit the attestation to a verification smart contract
2. The contract checks the cryptographic proofs
3. If valid, the verification is recorded on-chain permanently
4. Anyone can query the contract to check verification status

"This creates an immutable audit trail," Dr. Jane adds. "Essential for regulated industries like healthcare and finance."

## Chapter 4: Real-World Use Cases 🌍

Kai discovers where EigenAI is being used:

Financial Analysis:
- Verifiable credit risk assessments
- Auditable trading recommendations
- Regulatory-compliant AI decisions

Healthcare:
- Verifiable diagnostic suggestions
- Auditable medical image analysis
- Patient data stays private (TEE protection)

Legal:
- Verifiable contract analysis
- Auditable legal research summaries
- Chain of custody for AI-generated evidence

Content Authentication:
- Prove AI-generated content is authentic
- Verifiable fact-checking services
- Auditable content moderation decisions

"EigenAI isn't just for crypto," Kai realizes. "Any industry that needs trustworthy AI can benefit from verifiable inference!"

## Build with Confidence 🏗️

EigenAI makes the leap from "AI you hope is correct" to "AI you can PROVE is correct." For developers, it's as simple as changing an API endpoint.

Start building verifiable AI today! 🛠️✨`,
                    questions: [
                        {
                            id: "q1",
                            question:
                                "What extra information does EigenAI return compared to a standard AI API?",
                            options: [
                                "Only the AI-generated text, same as other providers",
                                "Attestation signatures, model hashes, and input/output hashes that enable cryptographic verification",
                                "A list of all other users who asked similar questions",
                                "The AI model's source code and training data",
                            ],
                            correctAnswer: 1,
                            explanation:
                                "EigenAI returns additional verification fields: attestation signature (from TEE hardware), model hash (proves which model ran), and input/output hashes (prove prompt and response integrity).",
                            type: "multiple-choice",
                        },
                        {
                            id: "q2",
                            question:
                                "True or False: EigenAI verification proofs can be recorded on-chain for permanent, immutable audit trails.",
                            options: ["True", "False"],
                            correctAnswer: 0,
                            explanation:
                                "True! EigenAI attestation proofs can be submitted to verification smart contracts on-chain, creating permanent, immutable records that anyone can query — essential for regulated industries.",
                            type: "true-false",
                        },
                    ],
                },
            },
        ],
    },
    {
        id: "eigen-compute",
        title: "EigenCompute — TEE-Powered Execution",
        description:
            "Master EigenCompute, the verifiable off-chain execution platform. Learn how to deploy Docker containers to TEEs using the ecloud CLI, and understand Intel TDX integration.",
        icon: "🖥️",
        level: "Intermediate",
        points: 15,
        duration: "2.5 hours",
        status: "available",
        badge: {
            title: "Compute Commander",
            description: "Mastered EigenCompute & TEE Deployment",
            image: "/badges/compute-commander.png",
        },
        sections: [
            {
                id: "eigencompute-architecture",
                title: "EigenCompute Deep Dive",
                type: "theory",
                status: "available",
                estimatedTime: "30 min",
                content: {
                    story: `# EigenCompute Deep Dive 🖥️

While EigenAI handles verifiable LLM inference, EigenCompute is the broader platform: a verifiable off-chain execution environment where ANY application can run inside a TEE.

## Chapter 1: What is EigenCompute? 🎯

Dr. Jane explains the distinction:

EigenAI vs. EigenCompute:
- **EigenAI**: Specifically for LLM inference (text generation, chat)
- **EigenCompute**: For ANY application — AI agents, data processing, custom models, web servers, and more

Think of it this way:
- EigenAI = A verifiable restaurant (specific menu, specific service)
- EigenCompute = A verifiable kitchen for rent (cook anything you want)

EigenCompute Key Features:
- Deploy ANY Docker container to a Trusted Execution Environment
- Each app gets its own wallet and cryptographic identity
- Hardware attestation for every computation
- Long-running processes (not just single requests)
- Autonomous agent support

## Chapter 2: The EigenCompute Architecture 🏗️

Dr. Jane walks through the system:

Infrastructure Layer:
- Google Cloud Confidential VMs with Intel TDX
- Hardware-isolated Trust Domains for each application
- Encrypted memory and storage for all workloads
- Network isolation between applications

Application Layer:
- Docker containers deployed via the ecloud CLI
- Each container runs inside a separate Trust Domain
- Applications get their own Ethereum wallet (keys generated in TEE)
- Persistent storage available for stateful applications

Verification Layer:
- Every application produces attestation reports
- Reports prove the exact Docker image running
- Cryptographic identity tied to the TEE hardware
- On-chain verification of application integrity

## Chapter 3: Docker to TEE — The Deployment Flow 🐳

Kai follows the deployment process:

Step 1 — Containerize Your Application:
- Package your application as a standard Docker container
- Include all dependencies, models, and configuration
- Build and push the image to a container registry

Step 2 — Deploy with ecloud CLI:
- Install the ecloud command-line tool
- Configure your deployment (resources, networking, secrets)
- Run: ecloud deploy --image your-app:latest
- The CLI handles TEE provisioning automatically

Step 3 — TEE Provisioning:
- EigenCompute allocates a Confidential VM on Google Cloud
- Intel TDX creates an isolated Trust Domain
- Your Docker image is loaded and verified
- A unique cryptographic identity (wallet) is generated inside the TEE

Step 4 — Runtime:
- Your application runs inside the secure enclave
- All computation is hardware-isolated
- Attestation reports are generated continuously
- Your app's wallet can sign transactions autonomously

"The genius is simplicity," Dr. Jane notes. "If you can Docker, you can TEE. No specialized TEE programming required."

## Chapter 4: Cryptographic Identity & Wallets 🔑

Kai discovers a powerful feature:

TEE-Generated Wallets:
- When an app deploys to EigenCompute, the TEE generates a fresh Ethereum wallet
- The private key exists ONLY inside the TEE — no human has it
- The app can sign transactions, hold funds, and interact with smart contracts
- This enables truly autonomous, self-sovereign AI agents

Why This Matters:
- An AI trading agent can hold and manage funds securely
- The agent's actions are provably its own (no human puppet-master)
- The wallet's creation inside TEE is cryptographically attested
- Even the developer cannot access the agent's private key

"This is what makes verifiable AI agents possible," Dr. Jane explains. "Each agent has its own identity that's provably generated in secure hardware."

## The Verifiable Cloud 🚀

EigenCompute is essentially a "verifiable cloud" — any application, running in hardware-secured environments, with cryptographic proof of correct execution. It's the foundation for the next generation of trustworthy applications.

Welcome to the verifiable cloud! 🖥️✨`,
                    questions: [
                        {
                            id: "q1",
                            question: "What is the key difference between EigenAI and EigenCompute?",
                            options: [
                                "EigenAI is free and EigenCompute is paid",
                                "EigenAI is specifically for LLM inference, while EigenCompute can run ANY Docker containerized application in a TEE",
                                "EigenCompute is faster than EigenAI",
                                "EigenAI uses TEE but EigenCompute does not",
                            ],
                            correctAnswer: 1,
                            explanation:
                                "EigenAI is focused on verifiable LLM inference (text generation), while EigenCompute is a broader platform that can run any Docker container application inside a TEE — including AI agents, data processors, and more.",
                            type: "multiple-choice",
                        },
                        {
                            id: "q2",
                            question:
                                "True or False: Applications deployed on EigenCompute require specialized TEE programming knowledge.",
                            options: ["True", "False"],
                            correctAnswer: 1,
                            explanation:
                                "False! EigenCompute accepts standard Docker containers. If you can containerize your application with Docker, you can deploy it to EigenCompute's TEE — no specialized TEE programming required.",
                            type: "true-false",
                        },
                    ],
                },
            },
            {
                id: "ecloud-cli-guide",
                title: "The ecloud CLI & Deployment",
                type: "theory",
                status: "available",
                estimatedTime: "25 min",
                content: {
                    story: `# The ecloud CLI & Deployment 🛠️

Kai gets hands-on with the ecloud CLI — the primary tool for deploying applications to EigenCompute's trusted execution environments.

## Chapter 1: What is ecloud? 🔧

The ecloud CLI is the command-line interface for EigenCompute:

Core Capabilities:
- **Deploy**: Launch Docker containers in TEEs
- **Build**: Create encrypted Docker images for deployment
- **Push**: Upload images to the EigenCompute registry
- **Monitor**: View logs, status, and health of running applications
- **Manage**: Scale, update, and terminate deployments

"Think of ecloud as 'docker + security superpowers,'" Dr. Jane explains. "It takes familiar Docker workflows and adds TEE-grade protection."

## Chapter 2: Building Encrypted Images 🔐

Kai learns about EigenCompute's encrypted image workflow:

Standard Docker Workflow:
1. Write a Dockerfile
2. Build the image: docker build -t my-app .
3. Push to Docker Hub: docker push my-app

EigenCompute Workflow:
1. Write a Dockerfile (same as always!)
2. Build with ecloud: ecloud build -t my-app .
3. Image is ENCRYPTED during build process
4. Push to EigenCompute registry: ecloud push my-app
5. Only TEE hardware can decrypt and run the image

Why Encryption Matters:
- Even if someone downloads your image, they can't see the contents
- Model weights, API keys, and secrets are protected
- The deployment is confidential from registry to runtime
- Only genuine TEE hardware has the decryption keys

## Chapter 3: Deployment Configuration 📋

Kai explores deployment options:

Resource Configuration:
- CPU: Up to 177 vCPUs per Trust Domain
- Memory: Up to 756GB RAM per Trust Domain
- Storage: Persistent encrypted volumes
- Networking: Secure ingress/egress with TLS

Application Configuration:
- Environment variables (encrypted at rest)
- Secret management (keys never leave TEE)
- Health checks and auto-restart
- Logging and monitoring endpoints

Scaling Options:
- Multiple replicas across different TEE instances
- Load balancing with consistent attestation
- Auto-scaling based on demand
- Geographic distribution for latency optimization

## Chapter 4: Monitoring & Attestation 📊

Kai learns about runtime management:

Continuous Monitoring:
- ecloud status: View health of all deployments
- ecloud logs: Stream application logs securely
- ecloud attestation: View latest attestation reports
- ecloud wallet: Check the application's TEE-generated wallet

Attestation Reports Include:
- Docker image hash: Proves which exact image is running
- TEE hardware ID: Proves which physical TEE hosts the app
- Runtime measurements: Proves no code modifications
- Timestamp: When the attestation was generated
- Intel signature: Signed by Intel's attestation service

"The attestation is your proof to the world," Dr. Jane emphasizes. "It's cryptographic evidence that YOUR code is running, untampered, inside genuine Intel TDX hardware."

## Deploy with Confidence 🚀

The ecloud CLI makes TEE deployment as simple as Docker deployment. Package your app, deploy with ecloud, and get hardware-guaranteed security and verifiability.

Start deploying to the verifiable cloud! 🛠️✨`,
                    questions: [
                        {
                            id: "q1",
                            question: "Why does EigenCompute encrypt Docker images during the build process?",
                            options: [
                                "To make the images smaller and faster to download",
                                "To ensure that even if someone downloads the image, they can't see its contents — only genuine TEE hardware can decrypt it",
                                "To add a watermark to the images",
                                "Encryption is optional and not actually used",
                            ],
                            correctAnswer: 1,
                            explanation:
                                "EigenCompute encrypts Docker images so that model weights, secrets, and application code remain confidential. Only genuine TEE hardware has the decryption keys, ensuring end-to-end confidentiality.",
                            type: "multiple-choice",
                        },
                        {
                            id: "q2",
                            question:
                                "True or False: EigenCompute attestation reports include a hash of the Docker image to prove which exact code is running.",
                            options: ["True", "False"],
                            correctAnswer: 0,
                            explanation:
                                "True! Attestation reports include the Docker image hash, TEE hardware ID, runtime measurements, and Intel's signature — providing complete, cryptographic proof of what's running inside the TEE.",
                            type: "true-false",
                        },
                    ],
                },
            },
        ],
    },
    {
        id: "production-ai-pipelines",
        title: "Building Production AI on Eigen",
        description:
            "Learn how to architect, scale, and monitor production-grade AI systems on EigenLayer. Master the patterns for building resilient, secure, and performant AI pipelines.",
        icon: "🏭",
        level: "Advanced",
        points: 20,
        duration: "2.5 hours",
        status: "available",
        badge: {
            title: "Production Engineer",
            description: "Mastered Production AI Architecture",
            image: "/badges/production-engineer.png",
        },
        sections: [
            {
                id: "production-architecture",
                title: "Production AI Architecture",
                type: "theory",
                status: "available",
                estimatedTime: "30 min",
                content: {
                    story: `# Production AI Architecture 🏭

Building a proof-of-concept is one thing. Building a production system that handles real traffic, real money, and real consequences is another. Kai is ready to learn how to architect production-grade AI on EigenLayer.

## Chapter 1: The Production AI Challenge 🎯

Dr. Jane outlines the requirements:

Proof-of-Concept (POC) vs. Production:
- POC: Works on your laptop, handles 10 requests/minute, OK if it fails
- Production: Handles 10,000+ requests/minute, must have 99.9%+ uptime, failures cost real money

Production AI Must Be:
1. **Reliable**: Near-zero downtime, auto-recovery from failures
2. **Scalable**: Handle growing workloads without degradation
3. **Secure**: End-to-end encryption, verifiable execution (TEE)
4. **Observable**: Complete visibility into system health
5. **Compliant**: Meet regulatory requirements (audit trails, data privacy)

## Chapter 2: The Verifiable AI Pipeline Architecture 🏗️

Kai designs a production pipeline:

Layer 1 — API Gateway:
- Rate limiting and authentication
- Request validation and sanitization
- Load balancing across TEE instances
- TLS termination and certificate management

Layer 2 — Queue Management:
- Asynchronous request processing
- Priority queues for different tiers
- Dead letter queues for failed requests
- Backpressure handling during high load

Layer 3 — TEE Execution Cluster:
- Multiple EigenCompute instances running in parallel
- Each instance in its own Intel TDX Trust Domain
- Automatic failover to healthy instances
- Rolling updates without downtime

Layer 4 — Attestation & Verification:
- Every response includes TEE attestation
- Proofs batched and submitted on-chain
- Verification smart contracts validate attestations
- Immutable audit log maintained

Layer 5 — Monitoring & Alerting:
- Real-time health dashboards
- Automated incident response
- Performance metrics collection
- Compliance reporting

## Chapter 3: High Availability Patterns 🔄

Kai learns production resilience strategies:

Active-Active Redundancy:
- Multiple TEE instances running simultaneously
- If one fails, others handle the load instantly
- No single point of failure
- Geographic distribution for low latency

Circuit Breaker Pattern:
- If a TEE instance starts failing, stop sending requests to it
- Redirect traffic to healthy instances
- Periodically check if the failed instance has recovered
- Prevents cascading failures

Graceful Degradation:
- If all TEE instances are overloaded:
  - Queue non-urgent requests
  - Serve cached results where appropriate
  - Communicate delays to users
  - Never compromise security guarantees

"The key principle," Dr. Jane emphasizes, "is that security is never sacrificed for performance. If attestation can't be verified, the response isn't served — period."

## Chapter 4: Data Architecture 📊

Kai learns about managing data in verifiable AI:

Input Data Flow:
1. User prompt → encrypted in transit (TLS)
2. Arrives at TEE → decrypted only inside enclave
3. Processed by AI model → never leaves TEE
4. Result encrypted → sent back to user
5. Prompt data NOT stored (privacy by design)

Attestation Data Flow:
1. TEE generates attestation → signed by hardware
2. Attestation stored temporarily → queued for on-chain submission
3. Batched together → submitted to verification contract
4. Permanently recorded → immutable blockchain record

Model Management:
- Model versions tracked with cryptographic hashes
- Updates deployed via rolling releases
- Old models kept available for reproducibility
- A/B testing with full attestation for both variants

## The Production Mindset 🚀

Production AI on EigenLayer combines traditional DevOps best practices with the unique requirements of verifiable computation. Every architectural decision must balance performance, security, and verifiability.

Build for production, verify everything! 🏭✨`,
                    questions: [
                        {
                            id: "q1",
                            question:
                                "What is the fundamental principle of production AI on EigenLayer?",
                            options: [
                                "Performance is always prioritized over security",
                                "Security and verifiability are never sacrificed for performance — if attestation can't be verified, the response isn't served",
                                "Production systems don't need attestation",
                                "Only one TEE instance is needed for production",
                            ],
                            correctAnswer: 1,
                            explanation:
                                "In production verifiable AI, security is paramount. If an attestation can't be verified, the response is not served. Performance optimizations must never compromise the security guarantees.",
                            type: "multiple-choice",
                        },
                        {
                            id: "q2",
                            question:
                                "True or False: In a verifiable AI pipeline, user prompts are stored permanently for future analysis.",
                            options: ["True", "False"],
                            correctAnswer: 1,
                            explanation:
                                "False! Verifiable AI follows 'privacy by design' — user prompts are processed inside the TEE and NOT stored permanently. Only attestation proofs (which don't contain the actual prompt content) are recorded on-chain.",
                            type: "true-false",
                        },
                    ],
                },
            },
            {
                id: "scaling-monitoring",
                title: "Scaling & Monitoring AI Systems",
                type: "theory",
                status: "available",
                estimatedTime: "25 min",
                content: {
                    story: `# Scaling & Monitoring AI Systems 📈

With the architecture in place, Kai learns how to scale verifiable AI systems to handle production traffic and monitor them effectively.

## Chapter 1: Horizontal Scaling Strategies 📊

Dr. Jane explains how to scale EigenCompute deployments:

Vertical vs. Horizontal Scaling:
- **Vertical**: Bigger machines (up to 177 vCPU, 756GB RAM per TDX domain)
  - Simple but limited by single-machine capacity
- **Horizontal**: More machines running in parallel
  - Unlimited scale, but requires coordination
  - Each instance runs in its own TEE

Horizontal Scaling on EigenCompute:
1. Deploy multiple replicas of your application
2. Each replica has its own TEE and cryptographic identity
3. Load balancer distributes requests across replicas
4. All replicas produce individual attestation proofs

Auto-Scaling:
- Monitor request queue length and latency
- When thresholds are exceeded, spin up new TEE instances
- New instances come with their own attestation
- When demand drops, scale down gracefully

## Chapter 2: Performance Optimization ⚡

Kai learns to optimize without compromising verification:

Request Batching:
- Group similar requests for batch processing
- Reduces per-request overhead
- Each batch still gets full attestation
- Improves throughput by 3-5x

Model Caching:
- Keep frequently used models loaded in TEE memory
- Avoid expensive model load times for each request
- Model integrity verified at load time via hash checks
- Cache invalidation on model updates

Attestation Batching:
- Individual attestations are expensive to submit on-chain
- Batch multiple attestations into a single on-chain transaction
- Use Merkle trees to maintain individual proof verifiability
- Reduces gas costs by 10-50x

Connection Pooling:
- Maintain persistent connections to TEE instances
- Reduce handshake and TLS setup overhead
- Pool management with health checks

## Chapter 3: Monitoring & Observability 🔍

Kai sets up comprehensive monitoring:

Key Metrics to Track:
1. **Inference Latency**: Time from request to response
2. **Attestation Success Rate**: Percentage of successful attestations
3. **TEE Health**: Hardware health, memory usage, CPU utilization
4. **Queue Depth**: Number of pending requests
5. **Error Rate**: Failed requests per minute
6. **Model Performance**: Response quality metrics

Alerting Strategy:
- Critical: TEE hardware failure, attestation failures
- High: Latency spike above 5s, error rate above 1%
- Medium: Queue depth above threshold, capacity above 80%
- Low: Non-urgent maintenance notifications

Compliance Monitoring:
- Automated audit report generation
- Continuous attestation verification
- Data residency compliance checks
- Access log analysis for anomalies

## Chapter 4: Incident Response 🚨

Kai prepares for production incidents:

Common Incident Types:
1. TEE Instance Failure: Auto-failover to healthy instances
2. Model Corruption: Hash mismatch detected, rollback to known-good version
3. High Latency: Scale up, investigate bottlenecks
4. Attestation Failure: Quarantine instance, rotate to backup

Post-Incident Review:
- Full audit trail available via on-chain attestation records
- Root cause analysis using TEE-protected logs
- Improvement action items for architecture
- Update monitoring thresholds based on findings

"The beautiful thing about verifiable AI," Dr. Jane notes, "is that the attestation trail gives you a complete, tamper-proof record for post-incident analysis."

## Scale with Confidence 🚀

Scaling verifiable AI systems requires the same discipline as scaling any production system — plus the additional requirement of maintaining verification integrity at every level.

Scale up, stay verified! 📈✨`,
                    questions: [
                        {
                            id: "q1",
                            question:
                                "How does attestation batching help with production scaling?",
                            options: [
                                "It makes attestation unnecessary",
                                "It groups multiple attestation proofs into a single on-chain transaction using Merkle trees, reducing gas costs by 10-50x while maintaining individual verifiability",
                                "It removes the need for TEE hardware",
                                "It makes the AI model run faster",
                            ],
                            correctAnswer: 1,
                            explanation:
                                "Attestation batching combines multiple proofs into a single on-chain transaction using Merkle trees. This dramatically reduces gas costs while maintaining the ability to individually verify each attestation.",
                            type: "multiple-choice",
                        },
                        {
                            id: "q2",
                            question:
                                "True or False: When auto-scaling EigenCompute, new instances automatically get their own TEE and attestation.",
                            options: ["True", "False"],
                            correctAnswer: 0,
                            explanation:
                                "True! Each new EigenCompute instance is provisioned with its own Intel TDX Trust Domain, cryptographic identity, and produces its own attestation proofs — maintaining full verification at any scale.",
                            type: "true-false",
                        },
                    ],
                },
            },
            {
                id: "cost-optimization",
                title: "Cost & Resource Optimization",
                type: "theory",
                status: "available",
                estimatedTime: "20 min",
                content: {
                    story: `# Cost & Resource Optimization 💰

Building production AI is powerful but can be expensive. Kai learns how to optimize costs while maintaining the security guarantees that make verifiable AI valuable.

## Chapter 1: Understanding the Cost Stack 📊

Dr. Jane breaks down the costs:

Compute Costs:
- TEE-enabled VMs (Intel TDX) cost more than standard VMs
- Typically 10-30% premium for confidential computing
- But: Cost per unit of TRUST is dramatically lower than alternatives

Storage Costs:
- Encrypted persistent volumes for stateful apps
- Attestation data storage (on-chain and off-chain)
- Model weights storage

Network Costs:
- Data transfer in/out of TEE instances
- API gateway traffic
- On-chain transaction fees (gas)

## Chapter 2: Optimization Strategies 🎯

Kai implements cost-saving measures:

Right-Sizing:
- Don't over-provision TEE instances
- Match CPU/memory to actual workload requirements
- Use monitoring data to adjust resource allocation
- Start small, scale based on real usage

Spot & Preemptible Instances:
- Use preemptible TEE instances for batch processing
- Cost savings of 50-80% compared to on-demand
- Combine with persistent instances for critical real-time workloads
- Auto-migration to on-demand if preemptible instance is reclaimed

Smart Attestation:
- Not every request needs on-chain attestation
- Tier 1: Batch on-chain attestation for routine requests
- Tier 2: Immediate on-chain for high-value transactions
- Tier 3: Local verification for testing/development

Model Optimization:
- Use smaller, efficient models when full-size isn't needed
- Quantized models (INT8/INT4) for lower resource usage
- Model distillation: Train smaller models from larger ones
- Right model for the right task

## Chapter 3: Total Cost of Trust 💡

Kai reframes the cost conversation:

Traditional "Trust" Approaches:
- Legal contracts and auditing: $50K-$500K/year
- Insurance for AI decisions: $100K+/year
- Regulatory compliance staff: $200K+/year
- Incident response and liability: Unbounded risk

Verifiable AI Approach:
- TEE compute premium: 10-30% over standard
- On-chain attestation: Pennies per transaction (batched)
- Self-auditing via immutable records: Near-zero
- Liability reduction: Cryptographic proof of correct behavior

"When you factor in the TOTAL cost of trust," Dr. Jane explains, "verifiable AI is often CHEAPER than traditional approaches — and provides STRONGER guarantees."

## Chapter 4: The EigenCloud Vision 🌐

Kai glimpses the roadmap:

EigenCloud:
- A complete verifiable cloud platform
- More than just AI — any workload, any application
- Built on EigenCompute's TEE infrastructure
- Expanding from AI-first to general-purpose computing

What's Coming:
- Multi-region deployment for global coverage
- Enhanced TEE options (AMD SEV, ARM CCA)
- Integrated billing and resource management
- Marketplace for verified applications

"EigenCloud represents the future of cloud computing," Dr. Jane says. "A cloud where every computation is verifiable, every workload is protected, and trust is built into the infrastructure."

## Optimize Smart, Not Cheap 🚀

Cost optimization for verifiable AI isn't about cutting security corners. It's about being smart with resources while maintaining the trust guarantees that make the system valuable. The ROI of verifiable AI is ultimately about the value of TRUST.

Build efficiently, verify everything! 💰✨`,
                    questions: [
                        {
                            id: "q1",
                            question: "How can attestation costs be optimized in production?",
                            options: [
                                "By removing attestation entirely from production",
                                "By tiering attestation: batching routine requests on-chain, providing immediate on-chain for high-value transactions, and using local verification for development",
                                "By running AI outside of TEEs",
                                "By using only one TEE instance",
                            ],
                            correctAnswer: 1,
                            explanation:
                                "Smart attestation tiering balances cost and security: batch on-chain for routine tasks, immediate on-chain for critical ones, and local-only for dev/test environments — without sacrificing security guarantees where they matter.",
                            type: "multiple-choice",
                        },
                        {
                            id: "q2",
                            question:
                                "True or False: TEE-enabled VMs typically cost about the same as standard VMs with no premium.",
                            options: ["True", "False"],
                            correctAnswer: 1,
                            explanation:
                                "False! TEE-enabled VMs (like Intel TDX Confidential VMs) typically have a 10-30% cost premium over standard VMs. However, when considering the total cost of trust (auditing, compliance, liability), verifiable AI is often more cost-effective overall.",
                            type: "true-false",
                        },
                    ],
                },
            },
        ],
    },
    {
        id: "real-world-future",
        title: "Real-World Use Cases & Future",
        description:
            "Explore real-world applications of verifiable AI — from autonomous trading agents to privacy-preserving healthcare. See how EigenCloud is shaping the future of trusted computing.",
        icon: "🌍",
        level: "Advanced",
        points: 20,
        duration: "2 hours",
        status: "available",
        badge: {
            title: "Eigen Visionary",
            description: "Mastered Real-World Verifiable AI Applications",
            image: "/badges/eigen-visionary.png",
        },
        sections: [
            {
                id: "real-world-applications",
                title: "Verifiable AI in Action",
                type: "theory",
                status: "available",
                estimatedTime: "30 min",
                content: {
                    story: `# Verifiable AI in Action 🌍

Kai, Maya, and Alex have mastered the theory. Now let's see how verifiable AI on EigenLayer is being used in the real world — and where it's heading.

## Chapter 1: DeFi Trading Agents 📈

The most immediate use case — autonomous trading powered by verifiable AI:

How It Works:
- AI trading agent runs inside EigenCompute (Intel TDX)
- The agent has its own TEE-generated wallet
- Trading strategies are verifiable via attestation
- Every trade decision is cryptographically attested

Benefits:
- **Transparency**: Anyone can verify the agent's strategy is what's advertised
- **Trust**: No human can secretly override the agent's decisions
- **Audit Trail**: Complete, tamper-proof record of every trade
- **Accountability**: Operators have staked ETH at risk

Real Example — Verifiable Copy Trading:
1. An AI agent analyzes market data using a specific strategy
2. The strategy code runs in a TEE — verifiable via attestation
3. Users can copy the agent's trades, knowing the strategy is legitimate
4. If the agent deviates from the advertised strategy, attestation fails
5. Trust is built through cryptographic proof, not promises

## Chapter 2: Healthcare & Medical AI 🏥

Privacy-preserving AI for healthcare:

The Challenge:
- Medical AI needs access to sensitive patient data
- Regulations (HIPAA, GDPR) strictly limit data handling
- Hospitals need to use AI but can't risk data breaches

The EigenCompute Solution:
- Medical AI model runs inside a TEE
- Patient data enters the TEE encrypted
- Diagnosis is computed inside the secure enclave
- Only the result leaves — patient data NEVER exposed
- Attestation proves the approved model was used

Use Cases:
- **Diagnostic Imaging**: AI analyzes X-rays, MRIs inside TEE
- **Drug Discovery**: Proprietary data processed confidentially
- **Clinical Decision Support**: Verified AI recommendations
- **Genomics**: Sensitive genetic data analyzed privately

## Chapter 3: Content Authentication & Provenance 📝

Fighting misinformation with verifiable AI:

The Problem:
- AI-generated content is everywhere
- Deep fakes and AI-written articles can spread misinformation
- How do you prove content is authentic or AI-generated?

Verifiable AI Solution:
- Content generated through EigenAI includes attestation
- The attestation proves: exact model used, exact prompt given, that the output is unmodified
- Creates a chain of provenance for digital content

Applications:
- **News Verification**: Prove AI summaries are accurate
- **Legal Documentation**: Verifiable AI-assisted legal analysis
- **Academic Research**: AI-aided research with proof of methodology
- **Creative Content**: Authenticated AI-assisted art and writing

## Chapter 4: Decentralized AI Marketplaces 🏪

A new economy built on verifiable AI:

AI Model Marketplace:
- Developers publish AI models to a decentralized marketplace
- Models run in TEEs — no one can steal the model weights
- Users pay per inference, getting verifiable results
- Model creators earn revenue without exposing their IP

Data Marketplace:
- Data owners sell access to private datasets
- Computations run inside TEE — data never leaves the enclave
- AI models train on private data without seeing it
- Results are verifiable, data stays protected

Agent-to-Agent Economy:
- AI agents interact and transact with each other
- Each agent's identity is TEE-verified
- Transactions are trustworthy and auditable
- A new economy where machines do business with machines

## Chapter 5: Supply Chain & IoT 🏭

Verifiable AI for physical world applications:

Supply Chain Tracking:
- AI analyzes supply chain data inside TEEs
- Quality predictions without exposing proprietary logistics data
- Verifiable audit trails for compliance
- Multi-party computation where competitors share insights without revealing secrets

IoT Security:
- Edge AI devices with TEE capabilities
- Sensor data processed confidentially
- Verifiable firmware updates via attestation
- Tamper-proof device identity management

## The Present & Future of Trust 🚀

Verifiable AI isn't a future concept — it's being built and deployed RIGHT NOW on EigenLayer. From trading agents to healthcare to content authentication, the applications are boundless.

The verifiable AI revolution is here! 🌍✨`,
                    questions: [
                        {
                            id: "q1",
                            question:
                                "How does verifiable AI benefit healthcare applications?",
                            options: [
                                "It makes medical equipment cheaper",
                                "Patient data is processed inside a TEE where it's never exposed, while attestation proves the approved AI model was used — satisfying both privacy regulations and accuracy requirements",
                                "It replaces doctors with AI completely",
                                "It stores all patient data on a public blockchain",
                            ],
                            correctAnswer: 1,
                            explanation:
                                "In healthcare, TEEs ensure sensitive patient data is never exposed during AI processing, while attestation proves the approved model was used. This satisfies privacy regulations (HIPAA/GDPR) while enabling powerful AI diagnostics.",
                            type: "multiple-choice",
                        },
                        {
                            id: "q2",
                            question:
                                "True or False: In a decentralized AI marketplace on EigenLayer, model creators can earn revenue without exposing their model weights.",
                            options: ["True", "False"],
                            correctAnswer: 0,
                            explanation:
                                "True! Models run inside TEEs, so users can pay for inferences without ever seeing the model weights. The model creator's intellectual property is protected by hardware isolation while still being monetizable.",
                            type: "true-false",
                        },
                    ],
                },
            },
            {
                id: "future-vision",
                title: "The Future of Verifiable Computing",
                type: "theory",
                status: "available",
                estimatedTime: "25 min",
                content: {
                    story: `# The Future of Verifiable Computing 🔮

As our journey comes to a close, let's look at the bigger picture: how verifiable AI on EigenLayer fits into the future of computing itself.

## Chapter 1: From Trust Assumptions to Trust Proofs 🔄

Dr. Jane reflects on the paradigm shift:

The Old World (Trust Assumptions):
- "Trust this company because they're big and reputable"
- "Trust this cloud because they have certifications"
- "Trust this AI because the provider says it's good"
- All based on promises and reputation

The New World (Trust Proofs):
- "Trust this computation because TEE hardware attests it"
- "Trust this service because billions in staked ETH secure it"
- "Trust this AI because every inference is cryptographically verified"
- All based on mathematics, hardware, and economics

"We're moving from a world of trust assumptions to a world of trust proofs," Dr. Jane says. "That's the real revolution."

## Chapter 2: EigenCloud — The Verifiable Cloud 🌐

The grand vision for EigenLayer's computing platform:

What is EigenCloud?
- A complete cloud computing platform where EVERY computation is verifiable
- Built on EigenCompute's TEE infrastructure
- Not just for AI — any workload, any application
- Competing with AWS, Google Cloud, and Azure — but with verification built in

EigenCloud Features:
- Confidential VMs with full attestation
- Verifiable serverless functions
- Encrypted databases with provable queries
- Verifiable CI/CD pipelines

The Verifiable Stack:
1. Hardware: Intel TDX, AMD SEV, ARM CCA
2. Infrastructure: EigenCompute manages TEE orchestration
3. Platform: EigenCloud provides developer-friendly tools
4. Applications: Verifiable apps built by the community
5. Economics: EigenLayer's restaked security backs everything

## Chapter 3: Convergence of AI, Crypto & Privacy 🤝

Kai sees the three megatrends converging:

AI Trend:
- Models getting more powerful and ubiquitous
- AI making increasingly important decisions
- Trust in AI becoming a critical societal issue

Crypto/Blockchain Trend:
- Decentralized verification infrastructure maturing
- Economic security models proven at scale
- On-chain attestation and proof systems

Privacy Trend:
- Regulations getting stricter (GDPR, AI Act, HIPAA)
- Users demanding data sovereignty
- Confidential computing going mainstream

The Convergence Point:
"EigenLayer sits at the intersection of all three trends," Dr. Jane explains. "It provides the infrastructure where powerful AI runs privately, verifiably, and with economic guarantees. That's not just a product — it's a new paradigm."

## Chapter 4: What You Can Build 🏗️

Alex, Kai, and Maya brainstorm what's possible:

Near-Term (Now):
- Verifiable AI chatbots and assistants
- Privacy-preserving data analytics
- Verifiable smart contract auditing
- Authenticated content generation

Medium-Term (1-2 Years):
- Autonomous AI agent economies
- Decentralized AI training networks
- Verifiable AI governance systems
- Cross-chain AI verification

Long-Term (3-5 Years):
- Fully verifiable cloud computing (EigenCloud)
- AI agents with legal personhood backed by cryptographic identity
- Global verifiable AI infrastructure
- Universal trust layer for all digital interactions

## Chapter 5: Your Journey Continues 🎓

Congratulations on completing the "Secure AI with Eigen" module!

What You've Learned:
1. ✅ EigenLayer's restaking and AVS architecture
2. ✅ Trusted Execution Environments (TEE) and Intel TDX
3. ✅ AI fundamentals and the trust problem
4. ✅ EigenAI for verifiable LLM inference
5. ✅ EigenCompute for TEE-powered applications
6. ✅ Production AI architecture patterns
7. ✅ Real-world applications and future vision

Next Steps:
- Build a verifiable AI application using EigenAI's API
- Deploy a Docker container to EigenCompute
- Join the EigenLayer developer community
- Contribute to the verifiable AI ecosystem

"The future of computing is verifiable," Dr. Jane concludes. "And now YOU have the knowledge to build it."

## Welcome to the Verifiable Future 🚀

You've completed the journey from understanding restaking to building production-grade verifiable AI. The knowledge you've gained puts you at the forefront of the most exciting intersection in technology: AI + blockchain + privacy.

The future is verifiable — and you're ready to build it! 🔮✨`,
                    questions: [
                        {
                            id: "q1",
                            question:
                                "What paradigm shift does EigenLayer represent for computing trust?",
                            options: [
                                "Moving from expensive hardware to cheap hardware",
                                "Moving from trust assumptions (promises and reputation) to trust proofs (mathematics, hardware attestation, and economic security)",
                                "Moving from cloud computing to local computing",
                                "Moving from open source to proprietary software",
                            ],
                            correctAnswer: 1,
                            explanation:
                                "EigenLayer enables a shift from 'trust assumptions' (trusting companies because of their reputation) to 'trust proofs' (trusting computations because of mathematical proofs, hardware attestation, and economic incentives). This is a fundamental paradigm shift.",
                            type: "multiple-choice",
                        },
                        {
                            id: "q2",
                            question:
                                "True or False: EigenCloud aims to be a complete cloud computing platform where every computation is verifiable, competing with traditional cloud providers.",
                            options: ["True", "False"],
                            correctAnswer: 0,
                            explanation:
                                "True! EigenCloud's vision is to provide a complete, verifiable cloud platform — not just for AI, but for any workload. It aims to offer the same capabilities as AWS, Google Cloud, and Azure, but with built-in verification and trust guarantees.",
                            type: "true-false",
                        },
                    ],
                },
            },
        ],
    },
];
