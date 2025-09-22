#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function parseTasksFromMarkdown() {
  const content = fs.readFileSync(path.join(process.cwd(), 'TASKS_FOR_GITHUB_ISSUES.md'), 'utf-8');
  const tasks = [];
  
  const taskSections = content.split(/---/g);
  
  taskSections.forEach(section => {
    const titleMatch = section.match(/###\s+\d+\.\s+(.+)/);
    if (!titleMatch) return;
    
    const title = titleMatch[1];
    const priorityMatch = section.match(/\*\*Priority:\*\*\s+(\w+)/);
    const hoursMatch = section.match(/\*\*Estimated Hours:\*\*\s+(\d+)/);
    const rewardMatch = section.match(/\*\*Token Reward:\*\*\s+([\d,]+)\s+BMUSIC/);
    const categoryMatch = section.match(/\*\*Category:\*\*\s+(.+)/);
    
    // Extract description
    const descMatch = section.match(/\*\*📋 Description\*\*\s*\n(.+?)(?=\n\*\*|$)/s);
    const description = descMatch ? descMatch[1].trim() : '';
    
    // Extract requirements
    const reqMatch = section.match(/\*\*🎯 Requirements\*\*\s*\n((?:- .+\n?)+)/);
    const requirements = reqMatch 
      ? reqMatch[1].split('\n').filter(l => l.startsWith('- ')).map(l => l.substring(2))
      : [];
    
    // Extract acceptance criteria
    const accMatch = section.match(/\*\*✅ Acceptance Criteria\*\*\s*\n((?:- .+\n?)+)/);
    const acceptanceCriteria = accMatch 
      ? accMatch[1].split('\n').filter(l => l.startsWith('- ')).map(l => l.substring(2))
      : [];
    
    if (title && priorityMatch && hoursMatch && rewardMatch && categoryMatch) {
      tasks.push({
        title,
        priority: priorityMatch[1],
        estimatedHours: parseInt(hoursMatch[1]),
        tokenReward: rewardMatch[1],
        category: categoryMatch[1],
        description,
        requirements,
        acceptanceCriteria
      });
    }
  });
  
  return tasks;
}

function createGitHubIssue(task, index) {
  const issueBody = `## 📋 Description
${task.description}

## 📊 Task Details
**Priority:** ${task.priority}
**Category:** ${task.category}
**Estimated Hours:** ${task.estimatedHours}
**Token Reward:** ${task.tokenReward} BMUSIC

## 🎯 Requirements
${task.requirements.map(r => `- ${r}`).join('\n')}

## ✅ Acceptance Criteria
${task.acceptanceCriteria.map(c => `- ${c}`).join('\n')}

## 💰 Reward Structure
- **Token Allocation:** ${task.tokenReward} BMUSIC tokens upon successful completion
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
*This task is part of the Bitcoin Music development bounty program. Total development allocation: 675M BMUSIC tokens.*`;

  const title = `[BOUNTY] ${task.title}`;
  
  try {
    // Write body to temporary file to avoid shell escaping issues
    const tempFile = `/tmp/issue-body-${Date.now()}.md`;
    fs.writeFileSync(tempFile, issueBody);
    
    // Create issue using gh CLI with body from file - without labels for now
    const command = `gh issue create --title "${title}" --body-file "${tempFile}"`;
    
    console.log(`Creating issue #${index + 1}: ${title}`);
    execSync(command, { stdio: 'inherit' });
    
    // Clean up temp file
    fs.unlinkSync(tempFile);
    
    // Add a small delay to avoid rate limiting
    if (index < 36) { // Don't sleep after the last issue
      execSync('sleep 2');
    }
  } catch (error) {
    console.error(`Failed to create issue: ${title}`, error);
  }
}

async function main() {
  console.log('Parsing tasks from TASKS_FOR_GITHUB_ISSUES.md...');
  const tasks = parseTasksFromMarkdown();
  console.log(`Found ${tasks.length} tasks to create as GitHub issues\n`);
  
  // Check if gh CLI is installed and authenticated
  try {
    execSync('gh auth status', { stdio: 'pipe' });
  } catch (error) {
    console.error('GitHub CLI is not authenticated. Please run: gh auth login');
    process.exit(1);
  }
  
  // Check current repo
  try {
    const repo = execSync('gh repo view --json name,owner', { encoding: 'utf-8' });
    const repoData = JSON.parse(repo);
    console.log(`Creating issues in repository: ${repoData.owner.login}/${repoData.name}\n`);
  } catch (error) {
    console.error('Not in a GitHub repository or repository not found');
    process.exit(1);
  }
  
  // Prompt user for confirmation
  console.log('⚠️  WARNING: This will create 37 GitHub issues in your repository.');
  console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');
  execSync('sleep 5');
  
  // Create issues
  for (let i = 0; i < tasks.length; i++) {
    createGitHubIssue(tasks[i], i);
  }
  
  console.log('\n✅ All issues created successfully!');
}

main().catch(console.error);