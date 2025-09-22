#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

const criticalBlockchainTasks = [
  {
    title: "Save Music to BSV Blockchain Button",
    priority: "CRITICAL",
    hours: 40,
    reward: "10,000,000",
    category: "Blockchain Core",
    description: "Implement the actual 'Save to Blockchain' button that inscribes music files as NFTs on BSV blockchain. This is THE core feature - users create music and save it permanently on-chain.",
    requirements: [
      "BSV blockchain expertise",
      "NFT inscription knowledge", 
      "Transaction handling",
      "UI/UX implementation"
    ],
    acceptanceCriteria: [
      "One-click save to blockchain",
      "Transaction confirmation UI",
      "Error handling",
      "Fee estimation display",
      "Success notification with transaction ID"
    ]
  },
  {
    title: "Music NFT Encryption & Pay-to-Unlock System",
    priority: "CRITICAL",
    hours: 60,
    reward: "12,500,000",
    category: "Blockchain Core",
    description: "Encrypt music NFTs so only preview is free. Listeners must pay micropayments to unlock full track. This implements the core revenue model.",
    requirements: [
      "Encryption implementation",
      "Micropayment processing",
      "Preview generation",
      "Unlock mechanism"
    ],
    acceptanceCriteria: [
      "30-second preview available free",
      "Encrypted full track on-chain",
      "Payment unlocks decryption key",
      "Instant unlock after payment",
      "Revenue tracking per unlock"
    ]
  },
  {
    title: "Streaming Revenue Distribution Architecture",
    priority: "CRITICAL",
    hours: 80,
    reward: "12,500,000",
    category: "Blockchain Core",
    description: "Build the complete micropayment streaming system where listeners pay per play, revenue flows to smart contract, and dividends auto-distribute to shareholders.",
    requirements: [
      "Smart contract development",
      "Micropayment architecture",
      "Real-time payment processing",
      "Dividend calculation logic"
    ],
    acceptanceCriteria: [
      "Pay-per-stream implementation (1 satoshi/play)",
      "Automatic revenue collection",
      "Real-time dividend distribution",
      "Shareholder payment tracking",
      "Revenue analytics dashboard"
    ]
  },
  {
    title: "Share Issuance Against Music NFTs",
    priority: "CRITICAL",
    hours: 50,
    reward: "10,000,000",
    category: "Blockchain Core",
    description: "When user saves music to blockchain, automatically issue 1M shares as tokens. These shares receive dividends from streaming revenue.",
    requirements: [
      "Token issuance on BSV",
      "Smart contract integration",
      "Share distribution logic",
      "UI for share management"
    ],
    acceptanceCriteria: [
      "Automatic 1M share issuance on NFT mint",
      "Share ownership tracking",
      "Transfer capability",
      "Dividend rights attached",
      "Share explorer interface"
    ]
  },
  {
    title: "Music NFT Ownership Transfer System",
    priority: "CRITICAL",
    hours: 40,
    reward: "7,500,000",
    category: "Blockchain Core",
    description: "Enable transfer of music NFT ownership on BSV blockchain. Original creator can sell the master NFT while shareholders keep their shares.",
    requirements: [
      "NFT transfer protocol",
      "Ownership verification",
      "Smart contract updates",
      "UI for transfers"
    ],
    acceptanceCriteria: [
      "Transfer NFT between wallets",
      "Maintain share distribution",
      "Update ownership records",
      "Transfer history tracking",
      "Escrow for safe transfers"
    ]
  },
  {
    title: "On-chain Music Metadata Storage",
    priority: "CRITICAL",
    hours: 30,
    reward: "5,000,000",
    category: "Blockchain Core",
    description: "Store all music metadata on-chain: title, artist, genre, BPM, key, creation date, collaborators, etc. Make it queryable.",
    requirements: [
      "Metadata schema design",
      "On-chain storage optimization",
      "Query system implementation",
      "Indexing solution"
    ],
    acceptanceCriteria: [
      "Complete metadata on-chain",
      "Efficient storage format",
      "Fast query capability",
      "Search by any field",
      "Metadata update mechanism"
    ]
  },
  {
    title: "Shareholder Dividend Claiming Interface",
    priority: "CRITICAL",
    hours: 40,
    reward: "7,500,000",
    category: "Blockchain Core",
    description: "Build interface where shareholders can view accumulated dividends, claim to wallet, track history, and see revenue analytics.",
    requirements: [
      "Dividend tracking system",
      "Claim mechanism",
      "Wallet integration",
      "Analytics dashboard"
    ],
    acceptanceCriteria: [
      "Real-time dividend balance",
      "One-click claim to wallet",
      "Historical dividend chart",
      "Revenue source breakdown",
      "Tax reporting export"
    ]
  },
  {
    title: "Music NFT Minting Interface",
    priority: "CRITICAL",
    hours: 50,
    reward: "10,000,000",
    category: "Blockchain Core",
    description: "Complete UI/UX for minting process: preview, share distribution, streaming price, encryption level, fee payment, confirmation.",
    requirements: [
      "UI/UX design expertise",
      "Multi-step form handling",
      "Preview player integration",
      "Fee calculation"
    ],
    acceptanceCriteria: [
      "Step-by-step minting wizard",
      "Audio preview before mint",
      "Customizable parameters",
      "Fee estimation and payment",
      "Transaction status tracking"
    ]
  },
  {
    title: "BSV Multi-Wallet Support",
    priority: "HIGH",
    hours: 30,
    reward: "5,000,000",
    category: "Blockchain Core",
    description: "Support multiple BSV wallets beyond HandCash: MoneyButton, DotWallet, RelayX, etc. for broader user adoption.",
    requirements: [
      "Multiple wallet APIs",
      "Unified interface design",
      "Authentication handling",
      "Transaction routing"
    ],
    acceptanceCriteria: [
      "Support 5+ BSV wallets",
      "Seamless wallet switching",
      "Unified transaction flow",
      "Balance aggregation",
      "Wallet preference storage"
    ]
  },
  {
    title: "Music Rights Management Smart Contracts",
    priority: "CRITICAL",
    hours: 60,
    reward: "10,000,000",
    category: "Blockchain Core",
    description: "Smart contracts to manage collaboration splits, producer royalties, sample clearances, remix permissions - all on-chain and automatic.",
    requirements: [
      "Complex smart contract logic",
      "Rights management expertise",
      "Multi-party agreements",
      "Automated execution"
    ],
    acceptanceCriteria: [
      "Collaboration split contracts",
      "Automatic royalty distribution",
      "Sample clearance registry",
      "Remix permission system",
      "Dispute resolution mechanism"
    ]
  }
];

function createIssue(task, index) {
  const issueBody = `## 📋 Description
${task.description}

## 📊 Task Details
**Priority:** ${task.priority}
**Category:** ${task.category}
**Estimated Hours:** ${task.hours}
**Token Reward:** ${task.reward} BMUSIC

## 🎯 Requirements
${task.requirements.map(r => `- ${r}`).join('\n')}

## ✅ Acceptance Criteria
${task.acceptanceCriteria.map(c => `- ${c}`).join('\n')}

## 💰 Reward Structure
- **Token Allocation:** ${task.reward} BMUSIC tokens upon successful completion
- **Payment Method:** BSV wallet via HandCash
- **Review Process:** Code review and testing required before reward distribution

## 📝 How to Claim This Task
1. Comment on this issue to express interest
2. Fork the repository and create a feature branch
3. Implement the requirements following acceptance criteria
4. Submit a pull request referencing this issue
5. Pass code review and testing
6. Receive token reward upon merge

---
*This is a CRITICAL blockchain infrastructure task for Bitcoin Music. These features are essential for the platform's core functionality.*`;

  const title = `[CRITICAL BLOCKCHAIN] ${task.title}`;
  
  try {
    const tempFile = `/tmp/issue-${Date.now()}.md`;
    fs.writeFileSync(tempFile, issueBody);
    
    const command = `gh issue create --title "${title}" --body-file "${tempFile}"`;
    
    console.log(`Creating issue #${index + 1}: ${title}`);
    execSync(command, { stdio: 'inherit' });
    
    fs.unlinkSync(tempFile);
    
    if (index < criticalBlockchainTasks.length - 1) {
      execSync('sleep 2');
    }
  } catch (error) {
    console.error(`Failed to create issue: ${title}`, error);
  }
}

async function main() {
  console.log('Creating CRITICAL Blockchain NFT Infrastructure Issues...\n');
  console.log('These are the MOST IMPORTANT features for Bitcoin Music!\n');
  
  // Check if gh CLI is authenticated
  try {
    execSync('gh auth status', { stdio: 'pipe' });
  } catch (error) {
    console.error('GitHub CLI is not authenticated. Please run: gh auth login');
    process.exit(1);
  }
  
  console.log(`Creating ${criticalBlockchainTasks.length} critical blockchain issues...\n`);
  
  for (let i = 0; i < criticalBlockchainTasks.length; i++) {
    createIssue(criticalBlockchainTasks[i], i);
  }
  
  console.log('\n✅ All critical blockchain issues created successfully!');
  console.log('\nThese features are ESSENTIAL for Bitcoin Music to function as a blockchain music platform!');
}

main().catch(console.error);