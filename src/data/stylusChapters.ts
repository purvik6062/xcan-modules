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
    | "stylus-intro"
    | "stylus-setup"
    | "stylus-constructor"
    | "stylus-storage"
    | "stylus-mapping"
    | "stylus-arrays"
    | "stylus-functions"
    | "stylus-selector"
    | "stylus-events"
    | "stylus-errors"
    | "stylus-call"
    | "stylus-vm"
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

export const stylusChapters: Chapter[] = [
  {
    id: "stylus-foundations",
    title: "Stylus Foundations",
    description:
      "Discover what Stylus is and why it's revolutionary. Learn about WASM, MultiVM, and set up your development environment.",
    icon: "🦀",
    level: "Beginner",
    points: 15,
    duration: "2 hours",
    status: "available",
    badge: {
      title: "Stylus Pioneer",
      description: "Mastered Stylus Foundations",
      image: "/badges/stylus-pioneer.png",
    },
    sections: [
      {
        id: "stylus-gentle-introduction",
        title: "Introduction to Stylus",
        type: "stylus-intro",
        status: "available",
        estimatedTime: "30 min",
        content: {
          story: `# Introduction to Stylus 🦀

## What is Stylus?

Stylus is an upgrade to Arbitrum Nitro that introduces a **second, coequal WASM virtual machine** alongside the EVM. This enables **MultiVM** - you can write smart contracts in Rust, C, C++, and other WASM-compatible languages!

### Key Benefits

**10-100x Performance Gains**
- Memory operations: 100-500x cheaper
- Compute tasks: 10-100x faster
- Lower gas costs for complex operations

**Full Interoperability**
- Solidity contracts can call Rust programs
- Rust programs can call Solidity contracts
- Seamless cross-language communication

**Modern Language Features**
- Use Rust's powerful type system
- Access to Cargo ecosystem (100,000+ crates)
- Battle-tested LLVM compiler optimizations

## MultiVM Paradigm

Traditional blockchains force you into one language. Stylus breaks this limitation:

\`\`\`
EVM (Solidity) ←→ WASM VM (Rust, C, C++)
      ↕                    ↕
  Both fully interoperable!
\`\`\`

### Real-World Use Cases

**1. ZK Proof Verification**
Verify zero-knowledge proofs on-chain at a fraction of the cost.

**2. Advanced DeFi**
Build sophisticated AMMs with custom pricing curves that were previously too expensive.

**3. Onchain Games**
Run complex game logic and physics simulations directly on-chain.

**4. Generative Art & AI**
Execute compute-intensive algorithms for true onchain creation.`,
          questions: [
            {
              id: "q1",
              question: "What is the main innovation that Stylus brings?",
              options: [
                "A faster EVM",
                "A second WASM VM coequal with the EVM",
                "A new blockchain",
                "Lower fees for all contracts",
              ],
              correctAnswer: 1,
              explanation:
                "Stylus introduces a second, coequal WASM virtual machine (MultiVM) that runs alongside the EVM, enabling contracts in multiple languages.",
              type: "multiple-choice",
            },
            {
              id: "q2",
              question:
                "True or False: Solidity contracts can call Rust programs in Stylus.",
              options: ["True", "False"],
              correctAnswer: 0,
              explanation:
                "True! Stylus provides full interoperability - Solidity and Rust programs can call each other seamlessly.",
              type: "true-false",
            },
          ],
        },
      },
      {
        id: "stylus-setup",
        title: "Development Environment Setup",
        type: "stylus-setup",
        status: "available",
        estimatedTime: "25 min",
        content: {
          story: `# Setting Up Stylus Development 🛠️

## Installation Steps

### 1. Install Rust

\`\`\`bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustc --version
cargo --version
\`\`\`

### 2. Install Stylus CLI

\`\`\`bash
cargo install --force cargo-stylus
cargo stylus --version
\`\`\`

### 3. Add WASM Target

\`\`\`bash
rustup target add wasm32-unknown-unknown
\`\`\`

## Create Your First Project

\`\`\`bash
cargo stylus new my-stylus-project
cd my-stylus-project
\`\`\`

## Project Structure

\`\`\`
my-stylus-project/
├── Cargo.toml    # Dependencies & config
└── src/
    └── lib.rs    # Your contract code
\`\`\`

## Key Dependencies

\`\`\`toml
[dependencies]
stylus-sdk = "0.9.0"
alloy-primitives = "0.8.20"
alloy-sol-types = "0.8.20"
mini-alloc = "0.9.0"
\`\`\`

## Build & Deploy

\`\`\`bash
# Check compatibility
cargo stylus check

# Export ABI
cargo stylus export-abi

# Deploy
cargo stylus deploy --private-key-path=.env
\`\`\``,
          questions: [
            {
              id: "q1",
              question: "What tool manages Rust projects?",
              options: ["rustc", "cargo", "npm", "stylus"],
              correctAnswer: 1,
              explanation:
                "Cargo is Rust's package manager and build tool, similar to npm for JavaScript.",
              type: "multiple-choice",
            },
            {
              id: "q2",
              question: "True or False: You need to add the wasm32-unknown-unknown target.",
              options: ["True", "False"],
              correctAnswer: 0,
              explanation:
                "True! Stylus contracts compile to WASM, so you need the wasm32-unknown-unknown target.",
              type: "true-false",
            },
          ],
        },
      },
    ],
  },
  {
    id: "storage-fundamentals",
    title: "Storage & Constructors",
    description:
      "Master contract initialization with constructors and learn how to manage persistent storage in Stylus contracts.",
    icon: "💾",
    level: "Beginner",
    points: 20,
    duration: "2 hours",
    status: "available",
    sections: [
      {
        id: "stylus-constructors",
        title: "Constructors in Stylus",
        type: "stylus-constructor",
        status: "available",
        estimatedTime: "30 min",
        content: {
          story: `# Stylus Constructors 🏗️

## What are Constructors?

Constructors run **once** during deployment to initialize your contract state atomically: deploy → activate → initialize in one transaction.

## Basic Constructor

\`\`\`rust
sol_storage! {
    #[entrypoint]
    pub struct Counter {
        address owner;
        uint256 number;
    }
}

#[public]
impl Counter {
    #[constructor]
    pub fn constructor(&mut self, initial: U256) {
        let owner = self.vm().tx_origin();
        self.owner.set(owner);
        self.number.set(initial);
    }
}
\`\`\`

## Key Rules

**1. Must use #[constructor] annotation**
\`\`\`rust
#[constructor]  // Required!
pub fn constructor(&mut self) {}
\`\`\`

**2. Use tx_origin() not msg_sender()**
\`\`\`rust
// ❌ Wrong: returns factory address
let owner = self.vm().msg_sender();

// ✅ Correct: returns actual deployer
let owner = self.vm().tx_origin();
\`\`\`

**3. Can return Result for validation**
\`\`\`rust
#[constructor]
pub fn constructor(&mut self, rate: U256) -> Result<(), Vec<u8>> {
    if rate > U256::from(10000) {
        return Err("Rate too high".into());
    }
    self.rate.set(rate);
    Ok(())
}
\`\`\`

**4. Runs only once - protected by sentinel**
Stylus writes a sentinel value to prevent re-initialization attacks.`,
          questions: [
            {
              id: "q1",
              question: "Why use tx_origin() instead of msg_sender() in constructors?",
              options: [
                "msg_sender() doesn't work",
                "Stylus uses a factory, so msg_sender() returns the factory address",
                "tx_origin() is faster",
                "It's just a convention",
              ],
              correctAnswer: 1,
              explanation:
                "Stylus uses a factory contract for deployment. In constructors, msg_sender() returns the factory's address, while tx_origin() returns the actual deployer.",
              type: "multiple-choice",
            },
            {
              id: "q2",
              question: "True or False: Constructors can run multiple times.",
              options: ["True", "False"],
              correctAnswer: 1,
              explanation:
                "False! Stylus uses a sentinel value to ensure constructors run exactly once, preventing re-initialization.",
              type: "true-false",
            },
          ],
        },
      },
      {
        id: "stylus-storage",
        title: "Storage Basics",
        type: "stylus-storage",
        status: "available",
        estimatedTime: "25 min",
        content: {
          story: `# Storage in Stylus 💾

## Defining Storage

Use the \`sol_storage!\` macro with Solidity-style syntax:

\`\`\`rust
sol_storage! {
    #[entrypoint]
    pub struct MyContract {
        uint256 count;
        address owner;
        bool is_active;
    }
}
\`\`\`

## Reading & Writing

\`\`\`rust
#[public]
impl MyContract {
    // Read
    pub fn get_count(&self) -> U256 {
        self.count.get()
    }
    
    // Write
    pub fn set_count(&mut self, new_count: U256) {
        self.count.set(new_count);
    }
    
    // Modify
    pub fn increment(&mut self) {
        let current = self.count.get();
        self.count.set(current + 1);
    }
}
\`\`\`

## Storage Types

\`\`\`rust
sol_storage! {
    #[entrypoint]
    pub struct Types {
        uint256 number;          // Numbers
        address user;            // Addresses
        bool flag;               // Booleans
        string message;          // Strings
        bytes32 hash;            // Fixed bytes
    }
}
\`\`\``,
          questions: [
            {
              id: "q1",
              question: "What macro defines storage layout in Stylus?",
              options: ["storage!", "sol_storage!", "define!", "contract!"],
              correctAnswer: 1,
              explanation:
                "sol_storage! is the macro that defines storage using Solidity-style syntax in Stylus.",
              type: "multiple-choice",
            },
            {
              id: "q2",
              question: "True or False: Use &mut self for state-modifying functions.",
              options: ["True", "False"],
              correctAnswer: 0,
              explanation:
                "True! Functions that modify state require &mut self, while read-only functions use &self.",
              type: "true-false",
            },
          ],
        },
      },
    ],
  },
  {
    id: "mappings-arrays",
    title: "Mappings & Data Structures",
    description:
      "Learn to use mappings for efficient key-value storage and arrays for ordered collections in Stylus.",
    icon: "🗺️",
    level: "Intermediate",
    points: 20,
    duration: "2.5 hours",
    status: "available",
    sections: [
      {
        id: "stylus-mappings",
        title: "Working with Mappings",
        type: "stylus-mapping",
        status: "available",
        estimatedTime: "35 min",
        content: {
          story: `# Mappings in Stylus 🗺️

## Basic Mapping

\`\`\`rust
sol_storage! {
    #[entrypoint]
    pub struct Balances {
        mapping(address => uint256) balances;
    }
}

#[public]
impl Balances {
    // Read
    pub fn balance_of(&self, user: Address) -> U256 {
        self.balances.get(user)
    }
    
    // Write
    pub fn set_balance(&mut self, user: Address, amount: U256) {
        self.balances.setter(user).set(amount);
    }
}
\`\`\`

## Nested Mappings

For complex relationships like ERC20 allowances:

\`\`\`rust
sol_storage! {
    pub struct Token {
        // owner => spender => amount
        mapping(address => mapping(address => uint256)) allowances;
    }
}

#[public]
impl Token {
    pub fn approve(&mut self, spender: Address, amount: U256) {
        let owner = self.vm().msg_sender();
        self.allowances
            .setter(owner)
            .setter(spender)
            .set(amount);
    }
    
    pub fn allowance(&self, owner: Address, spender: Address) -> U256 {
        self.allowances.getter(owner).get(spender)
    }
}
\`\`\`

## Key Points

**Default Values**: Unset keys return zero (0, false, empty)
**No Iteration**: Cannot loop over mapping keys
**O(1) Lookup**: Constant-time access`,
          questions: [
            {
              id: "q1",
              question: "What do unset mapping keys return?",
              options: ["null", "error", "zero value", "undefined"],
              correctAnswer: 2,
              explanation:
                "Mappings return the zero value for unset keys (0 for uint256, false for bool, etc.).",
              type: "multiple-choice",
            },
            {
              id: "q2",
              question: "True or False: You can iterate over mapping keys.",
              options: ["True", "False"],
              correctAnswer: 1,
              explanation:
                "False! Mappings don't support iteration. Keep a separate array if you need to iterate.",
              type: "true-false",
            },
          ],
        },
      },
      {
        id: "stylus-arrays",
        title: "Arrays & Vectors",
        type: "stylus-arrays",
        status: "available",
        estimatedTime: "30 min",
        content: {
          story: `# Arrays in Stylus 📊

## Dynamic Arrays (Vec)

\`\`\`rust
sol_storage! {
    #[entrypoint]
    pub struct List {
        Vec<uint256> numbers;
        Vec<address> users;
    }
}

#[public]
impl List {
    // Add element
    pub fn add_number(&mut self, num: U256) {
        self.numbers.push(num);
    }
    
    // Get element
    pub fn get_number(&self, index: U256) -> Result<U256, Vec<u8>> {
        let idx = index.as_usize();
        self.numbers.get(idx)
            .ok_or("Index out of bounds".into())
    }
    
    // Get length
    pub fn length(&self) -> U256 {
        U256::from(self.numbers.len())
    }
}
\`\`\`

## Tracking Keys Pattern

Use arrays to track mapping keys:

\`\`\`rust
sol_storage! {
    pub struct Registry {
        mapping(address => uint256) values;
        Vec<address> registered;
        mapping(address => bool) is_registered;
    }
}

#[public]
impl Registry {
    pub fn register(&mut self, value: U256) {
        let sender = self.vm().msg_sender();
        
        // First time?
        if !self.is_registered.get(sender) {
            self.registered.push(sender);
            self.is_registered.setter(sender).set(true);
        }
        
        self.values.setter(sender).set(value);
    }
}
\`\`\``,
          questions: [
            {
              id: "q1",
              question: "How do you add an element to a Vec?",
              options: ["add()", "push()", "append()", "insert()"],
              correctAnswer: 1,
              explanation:
                "Use push() to add elements to the end of a Vec in Stylus.",
              type: "multiple-choice",
            },
            {
              id: "q2",
              question: "True or False: Arrays can track mapping keys for iteration.",
              options: ["True", "False"],
              correctAnswer: 0,
              explanation:
                "True! Keep a separate Vec of keys to enable iteration over mappings.",
              type: "true-false",
            },
          ],
        },
      },
    ],
  },
  {
    id: "functions-selectors",
    title: "Functions & Selectors",
    description:
      "Master function definitions, visibility, and understand function selectors for contract interactions.",
    icon: "⚙️",
    level: "Intermediate",
    points: 20,
    duration: "2 hours",
    status: "available",
    sections: [
      {
        id: "stylus-functions",
        title: "Function Fundamentals",
        type: "stylus-functions",
        status: "available",
        estimatedTime: "30 min",
        content: {
          story: `# Functions in Stylus ⚙️

## Function Types

**Public Functions**
\`\`\`rust
#[public]
impl Counter {
    // External: callable by anyone
    pub fn increment(&mut self) {
        let count = self.count.get();
        self.count.set(count + 1);
    }
    
    // View: read-only
    pub fn get_count(&self) -> U256 {
        self.count.get()
    }
}
\`\`\`

**Internal Functions**
\`\`\`rust
impl Counter {
    // Private: only callable within contract
    fn _validate(&self, value: U256) -> bool {
        value > U256::ZERO
    }
    
    pub fn set_count(&mut self, value: U256) -> Result<(), Vec<u8>> {
        if !self._validate(value) {
            return Err("Invalid value".into());
        }
        self.count.set(value);
        Ok(())
    }
}
\`\`\`

## Function Modifiers

**Payable Functions**
\`\`\`rust
#[payable]
pub fn deposit(&mut self) {
    let amount = self.vm().msg_value();
    let sender = self.vm().msg_sender();
    // Handle deposit
}
\`\`\`

## Return Values

\`\`\`rust
// Single return
pub fn get_owner(&self) -> Address {
    self.owner.get()
}

// Result for error handling
pub fn transfer(&mut self, to: Address, amount: U256) -> Result<(), Vec<u8>> {
    if amount == U256::ZERO {
        return Err("Amount must be positive".into());
    }
    Ok(())
}
\`\`\``,
          questions: [
            {
              id: "q1",
              question: "What annotation makes functions externally callable?",
              options: ["#[external]", "#[public]", "#[visible]", "#[open]"],
              correctAnswer: 1,
              explanation:
                "#[public] annotation marks an impl block's functions as externally callable.",
              type: "multiple-choice",
            },
            {
              id: "q2",
              question: "True or False: View functions use &mut self.",
              options: ["True", "False"],
              correctAnswer: 1,
              explanation:
                "False! View functions only read state, so they use &self (not &mut self).",
              type: "true-false",
            },
          ],
        },
      },
      {
        id: "stylus-selector",
        title: "Function Selectors",
        type: "stylus-selector",
        status: "available",
        estimatedTime: "25 min",
        content: {
          story: `# Function Selectors 🎯

## What are Selectors?

Function selectors are the first 4 bytes of the keccak256 hash of the function signature. They're used to route calls to the correct function.

## Selector Calculation

\`\`\`rust
// Function signature
transfer(address,uint256)

// Keccak256 hash
keccak256("transfer(address,uint256)")
= 0xa9059cbb2ab09eb219583f4a59a5d0623ade346d962bcd4e46b11da047c9049b

// First 4 bytes (selector)
0xa9059cbb
\`\`\`

## Using Selectors in Stylus

\`\`\`rust
use stylus_sdk::call::Call;

#[public]
impl MyContract {
    pub fn call_external(&mut self, target: Address) -> Result<(), Vec<u8>> {
        // Call with explicit selector
        let selector = &[0xa9, 0x05, 0x9c, 0xbb]; // transfer selector
        let data = vec![/* encoded params */];
        
        Call::new()
            .call(target, selector, &data)?;
        
        Ok(())
    }
}
\`\`\`

## Fallback Function

Handle calls to non-existent functions:

\`\`\`rust
#[public]
impl Contract {
    #[fallback]
    pub fn fallback(&self) -> Result<(), Vec<u8>> {
        Err("Function not found".into())
    }
}
\`\`\``,
          questions: [
            {
              id: "q1",
              question: "How many bytes is a function selector?",
              options: ["2 bytes", "4 bytes", "8 bytes", "32 bytes"],
              correctAnswer: 1,
              explanation:
                "Function selectors are the first 4 bytes of the keccak256 hash of the function signature.",
              type: "multiple-choice",
            },
            {
              id: "q2",
              question: "True or False: Fallback functions handle calls to non-existent functions.",
              options: ["True", "False"],
              correctAnswer: 0,
              explanation:
                "True! Fallback functions are called when a contract receives a call that doesn't match any function selector.",
              type: "true-false",
            },
          ],
        },
      },
    ],
  },
  {
    id: "events-errors",
    title: "Events & Error Handling",
    description:
      "Learn to emit events for transparency and handle errors gracefully in your Stylus contracts.",
    icon: "📡",
    level: "Intermediate",
    points: 20,
    duration: "2 hours",
    status: "available",
    sections: [
      {
        id: "stylus-events",
        title: "Events & Logging",
        type: "stylus-events",
        status: "available",
        estimatedTime: "30 min",
        content: {
          story: `# Events in Stylus 📡

## Declaring Events

Use the \`sol!\` macro to declare events:

\`\`\`rust
use alloy_sol_types::sol;

sol! {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}
\`\`\`

## Emitting Events

\`\`\`rust
use stylus_sdk::evm;

#[public]
impl Token {
    pub fn transfer(&mut self, to: Address, amount: U256) -> Result<(), Vec<u8>> {
        let from = self.vm().msg_sender();
        
        // Transfer logic...
        
        // Emit event
        evm::log(Transfer {
            from,
            to,
            value: amount,
        });
        
        Ok(())
    }
}
\`\`\`

## Indexed Parameters

Up to **3 parameters** can be indexed for efficient filtering:

\`\`\`rust
sol! {
    // ✅ Valid: 3 indexed
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 value
    );
}
\`\`\``,
          questions: [
            {
              id: "q1",
              question: "How many parameters can be indexed in an event?",
              options: ["1", "2", "3", "Unlimited"],
              correctAnswer: 2,
              explanation:
                "Events can have a maximum of 3 indexed parameters for efficient filtering.",
              type: "multiple-choice",
            },
            {
              id: "q2",
              question: "True or False: Events are stored on-chain and can be queried.",
              options: ["True", "False"],
              correctAnswer: 0,
              explanation:
                "True! Events are logged on-chain and can be queried by frontends and indexers.",
              type: "true-false",
            },
          ],
        },
      },
      {
        id: "stylus-errors",
        title: "Error Handling",
        type: "stylus-errors",
        status: "available",
        estimatedTime: "25 min",
        content: {
          story: `# Error Handling in Stylus 🛡️

## Custom Errors

Define custom errors with parameters:

\`\`\`rust
sol! {
    error InsufficientBalance(uint256 requested, uint256 available);
    error Unauthorized(address caller);
    error InvalidAmount();
}
\`\`\`

## Error Enum

\`\`\`rust
use stylus_sdk::stylus_proc::SolidityError;

#[derive(SolidityError)]
pub enum TokenError {
    InsufficientBalance(InsufficientBalance),
    Unauthorized(Unauthorized),
    InvalidAmount(InvalidAmount),
}
\`\`\`

## Using Errors

\`\`\`rust
#[public]
impl Token {
    pub fn transfer(&mut self, to: Address, amount: U256) 
        -> Result<(), TokenError> 
    {
        let from = self.vm().msg_sender();
        let balance = self.balances.get(from);
        
        // Validate
        if balance < amount {
            return Err(TokenError::InsufficientBalance(
                InsufficientBalance {
                    requested: amount,
                    available: balance,
                }
            ));
        }
        
        // Transfer
        self.balances.setter(from).set(balance - amount);
        let to_balance = self.balances.get(to);
        self.balances.setter(to).set(to_balance + amount);
        
        Ok(())
    }
}
\`\`\`

## Simple Error Messages

\`\`\`rust
pub fn withdraw(&mut self, amount: U256) -> Result<(), Vec<u8>> {
    if amount == U256::ZERO {
        return Err("Amount must be positive".into());
    }
    Ok(())
}
\`\`\``,
          questions: [
            {
              id: "q1",
              question: "What derive macro is used for custom error types?",
              options: ["#[Error]", "#[SolidityError]", "#[CustomError]", "#[Revert]"],
              correctAnswer: 1,
              explanation:
                "#[derive(SolidityError)] creates custom error types compatible with Solidity.",
              type: "multiple-choice",
            },
            {
              id: "q2",
              question: "True or False: Errors can include parameters for debugging.",
              options: ["True", "False"],
              correctAnswer: 0,
              explanation:
                "True! Custom errors can include parameters to provide detailed information about failures.",
              type: "true-false",
            },
          ],
        },
      },
    ],
  },
  {
    id: "advanced-interactions",
    title: "Advanced Contract Interactions",
    description:
      "Master contract-to-contract calls, VM affordances, and advanced patterns for building complex dApps.",
    icon: "🔗",
    level: "Advanced",
    points: 25,
    duration: "2.5 hours",
    status: "available",
    sections: [
      {
        id: "stylus-call",
        title: "Contract Calls",
        type: "stylus-call",
        status: "available",
        estimatedTime: "35 min",
        content: {
          story: `# Contract Calls in Stylus 🔗

## Calling Other Contracts

Use the \`Call\` API to interact with external contracts:

\`\`\`rust
use stylus_sdk::call::Call;

#[public]
impl MyContract {
    pub fn call_external(&mut self, target: Address, value: U256) 
        -> Result<Vec<u8>, Vec<u8>> 
    {
        let data = vec![/* ABI-encoded call data */];
        
        Call::new()
            .value(value)  // Send ETH
            .call(target, &data)
    }
}
\`\`\`

## Type-Safe Interface Calls

Define interfaces for type-safe calls:

\`\`\`rust
sol! {
    interface IERC20 {
        function transfer(address to, uint256 amount) external returns (bool);
        function balanceOf(address account) external view returns (uint256);
    }
}

#[public]
impl Bridge {
    pub fn transfer_tokens(&mut self, token: Address, to: Address, amount: U256)
        -> Result<(), Vec<u8>>
    {
        let erc20 = IERC20::new(token);
        let result = erc20.transfer(self, to, amount)?;
        
        if !result {
            return Err("Transfer failed".into());
        }
        
        Ok(())
    }
}
\`\`\`

## Delegate Calls

For proxy patterns:

\`\`\`rust
pub fn delegate_call(&mut self, implementation: Address, data: Vec<u8>)
    -> Result<Vec<u8>, Vec<u8>>
{
    Call::new_delegate()
        .call(implementation, &data)
}
\`\`\``,
          questions: [
            {
              id: "q1",
              question: "Which call type is used for proxy patterns?",
              options: ["call()", "delegate_call()", "static_call()", "transfer()"],
              correctAnswer: 1,
              explanation:
                "delegate_call() executes code in the context of the calling contract, essential for proxy patterns.",
              type: "multiple-choice",
            },
            {
              id: "q2",
              question: "True or False: Static calls can modify state.",
              options: ["True", "False"],
              correctAnswer: 1,
              explanation:
                "False! Static calls are read-only and cannot modify state.",
              type: "true-false",
            },
          ],
        },
      },
      {
        id: "stylus-vm",
        title: "VM Affordances",
        type: "stylus-vm",
        status: "available",
        estimatedTime: "30 min",
        content: {
          story: `# VM Affordances in Stylus 🎛️

## Accessing Blockchain Data

The \`vm()\` method provides access to blockchain context:

\`\`\`rust
#[public]
impl Contract {
    pub fn get_context(&self) -> (Address, U256, U256, U256) {
        let vm = self.vm();
        
        (
            vm.msg_sender(),      // Caller address
            vm.msg_value(),       // ETH sent
            vm.block_timestamp(), // Current time
            vm.block_number()     // Current block
        )
    }
}
\`\`\`

## Common VM Methods

\`\`\`rust
// Caller info
let caller = self.vm().msg_sender();
let value = self.vm().msg_value();

// Block info
let block_num = self.vm().block_number();
let timestamp = self.vm().block_timestamp();

// Chain info
let chain_id = self.vm().chain_id();

// Transaction info
let tx_origin = self.vm().tx_origin();
\`\`\`

## Transferring ETH

\`\`\`rust
pub fn withdraw(&mut self, amount: U256) -> Result<(), Vec<u8>> {
    let user = self.vm().msg_sender();
    let balance = self.balances.get(user);
    
    if balance < amount {
        return Err("Insufficient balance".into());
    }
    
    // Update balance
    self.balances.setter(user).set(balance - amount);
    
    // Transfer ETH
    Call::new()
        .value(amount)
        .call(user, &[])?;
    
    Ok(())
}
\`\`\``,
          questions: [
            {
              id: "q1",
              question: "Which method returns the transaction sender?",
              options: ["vm().sender()", "vm().msg_sender()", "vm().caller()", "vm().from()"],
              correctAnswer: 1,
              explanation:
                "vm().msg_sender() returns the address of the caller (transaction sender).",
              type: "multiple-choice",
            },
            {
              id: "q2",
              question: "True or False: vm().block_timestamp() returns the current block time.",
              options: ["True", "False"],
              correctAnswer: 0,
              explanation:
                "True! vm().block_timestamp() returns the timestamp of the current block.",
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
  "stylus-foundations": [
    {
      id: "q1",
      question: "What is the main innovation that Stylus brings?",
      options: [
        "A faster EVM",
        "A second WASM VM coequal with the EVM",
        "A new blockchain",
        "Lower fees for all contracts",
      ],
      correctAnswer: 1,
      explanation:
        "Stylus introduces a second, coequal WASM virtual machine (MultiVM) that runs alongside the EVM.",
    },
    {
      id: "q2",
      question: "Which languages can be used to write Stylus contracts?",
      options: [
        "Only Solidity",
        "Only Rust",
        "Rust, C, C++, and other WASM-compatible languages",
        "JavaScript and Python",
      ],
      correctAnswer: 2,
      explanation:
        "Stylus supports any language that compiles to WASM, with strong support for Rust, C, and C++.",
    },
    {
      id: "q3",
      question: "What tool manages Rust projects?",
      options: ["rustc", "cargo", "npm", "stylus"],
      correctAnswer: 1,
      explanation:
        "Cargo is Rust's package manager and build tool.",
    },
    {
      id: "q4",
      question: "True or False: You need the wasm32-unknown-unknown target.",
      options: ["True", "False"],
      correctAnswer: 0,
      explanation:
        "True! Stylus contracts compile to WASM, so you need this target.",
    },
  ],
  "storage-fundamentals": [
    {
      id: "q1",
      question: "Why use tx_origin() in constructors?",
      options: [
        "msg_sender() doesn't work",
        "Stylus uses a factory, so msg_sender() returns the factory address",
        "tx_origin() is faster",
        "It's just a convention",
      ],
      correctAnswer: 1,
      explanation:
        "Stylus uses a factory contract. In constructors, msg_sender() returns the factory's address.",
    },
    {
      id: "q2",
      question: "Can constructors run multiple times?",
      options: ["Yes", "No", "Only if you call them", "Depends on the contract"],
      correctAnswer: 1,
      explanation:
        "No! Stylus uses a sentinel value to ensure constructors run exactly once.",
    },
    {
      id: "q3",
      question: "What macro defines storage layout?",
      options: ["storage!", "sol_storage!", "define!", "contract!"],
      correctAnswer: 1,
      explanation:
        "sol_storage! defines storage using Solidity-style syntax.",
    },
    {
      id: "q4",
      question: "True or False: Use &mut self for state-modifying functions.",
      options: ["True", "False"],
      correctAnswer: 0,
      explanation:
        "True! Functions that modify state require &mut self.",
    },
  ],
  "mappings-arrays": [
    {
      id: "q1",
      question: "What do unset mapping keys return?",
      options: ["null", "error", "zero value", "undefined"],
      correctAnswer: 2,
      explanation:
        "Mappings return the zero value for unset keys.",
    },
    {
      id: "q2",
      question: "Can you iterate over mapping keys?",
      options: ["Yes", "No", "Only with special syntax", "Yes but it's expensive"],
      correctAnswer: 1,
      explanation:
        "No! Mappings don't support iteration. Keep a separate array if needed.",
    },
    {
      id: "q3",
      question: "How do you add an element to a Vec?",
      options: ["add()", "push()", "append()", "insert()"],
      correctAnswer: 1,
      explanation:
        "Use push() to add elements to the end of a Vec.",
    },
    {
      id: "q4",
      question: "True or False: Arrays can track mapping keys for iteration.",
      options: ["True", "False"],
      correctAnswer: 0,
      explanation:
        "True! Keep a separate Vec of keys to enable iteration over mappings.",
    },
  ],
  "functions-selectors": [
    {
      id: "q1",
      question: "What annotation makes functions externally callable?",
      options: ["#[external]", "#[public]", "#[visible]", "#[open]"],
      correctAnswer: 1,
      explanation:
        "#[public] marks an impl block's functions as externally callable.",
    },
    {
      id: "q2",
      question: "Do view functions use &mut self?",
      options: ["Yes", "No", "Sometimes", "Depends"],
      correctAnswer: 1,
      explanation:
        "No! View functions only read state, so they use &self.",
    },
    {
      id: "q3",
      question: "How many bytes is a function selector?",
      options: ["2 bytes", "4 bytes", "8 bytes", "32 bytes"],
      correctAnswer: 1,
      explanation:
        "Function selectors are the first 4 bytes of the keccak256 hash.",
    },
    {
      id: "q4",
      question: "True or False: Fallback functions handle calls to non-existent functions.",
      options: ["True", "False"],
      correctAnswer: 0,
      explanation:
        "True! Fallback functions catch calls that don't match any function selector.",
    },
  ],
  "events-errors": [
    {
      id: "q1",
      question: "How many parameters can be indexed in an event?",
      options: ["1", "2", "3", "Unlimited"],
      correctAnswer: 2,
      explanation:
        "Events can have a maximum of 3 indexed parameters.",
    },
    {
      id: "q2",
      question: "Are events stored on-chain?",
      options: ["Yes", "No", "Only sometimes", "Depends on gas"],
      correctAnswer: 0,
      explanation:
        "Yes! Events are logged on-chain and can be queried.",
    },
    {
      id: "q3",
      question: "What derive macro is used for custom error types?",
      options: ["#[Error]", "#[SolidityError]", "#[CustomError]", "#[Revert]"],
      correctAnswer: 1,
      explanation:
        "#[derive(SolidityError)] creates custom error types.",
    },
    {
      id: "q4",
      question: "True or False: Errors can include parameters for debugging.",
      options: ["True", "False"],
      correctAnswer: 0,
      explanation:
        "True! Custom errors can include parameters to provide details.",
    },
  ],
  "advanced-interactions": [
    {
      id: "q1",
      question: "Which call type is used for proxy patterns?",
      options: ["call()", "delegate_call()", "static_call()", "transfer()"],
      correctAnswer: 1,
      explanation:
        "delegate_call() executes code in the context of the calling contract.",
    },
    {
      id: "q2",
      question: "Can static calls modify state?",
      options: ["Yes", "No", "Only with permission", "Depends"],
      correctAnswer: 1,
      explanation:
        "No! Static calls are read-only and cannot modify state.",
    },
    {
      id: "q3",
      question: "Which method returns the transaction sender?",
      options: ["vm().sender()", "vm().msg_sender()", "vm().caller()", "vm().from()"],
      correctAnswer: 1,
      explanation:
        "vm().msg_sender() returns the address of the caller.",
    },
    {
      id: "q4",
      question: "True or False: vm().block_timestamp() returns the current block time.",
      options: ["True", "False"],
      correctAnswer: 0,
      explanation:
        "True! vm().block_timestamp() returns the timestamp of the current block.",
    },
  ],
};
