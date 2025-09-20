# Contributing to Bitcoin Music

## 🎯 Earn $BMusic Tokens for Your Contributions!

Welcome to Bitcoin Music! We're building the future of decentralized music creation and monetization, and we want YOU to be part of it. Every successfully merged pull request that completes a task earns **10,000,000 $BMusic tokens** (1% of total supply).

## 💰 Token Distribution Program

### Equity Structure
- **Total Supply**: 1,000,000,000 $BMusic tokens
- **Developer Allocation**: 490,000,000 tokens (49%)
- **Per Task Reward**: 10,000,000 tokens (1%)
- **Available Tasks**: 49 tasks

### Token Vesting
- **Small PRs (<100 lines)**: Immediate distribution
- **Medium PRs (100-500 lines)**: 50% immediate, 50% after 30 days
- **Large PRs (>500 lines)**: 33% immediate, 67% vested over 90 days

## 🚀 Getting Started

### 1. Choose Your Task
Browse available tasks at [/tasks](https://bitcoin-music.vercel.app/tasks) or in [TODO.md](./TODO.md)

Task Categories:
- **DAW Development**: Audio engine, instruments, effects
- **Blockchain Integration**: NFT minting, token systems, HandCash
- **Marketplace Features**: Exchange integration, trading, discovery
- **UI/UX Development**: Interface design, mobile optimization

### 2. Set Up Your Development Environment

```bash
# Fork the repository
git clone https://github.com/YOUR_USERNAME/bitcoin-music.git
cd bitcoin-music

# Install dependencies
npm install

# Create a feature branch
git checkout -b feature/TASK-XXX-description

# Start development server
npm run dev
```

### 3. Development Guidelines

#### Code Standards
- **Language**: TypeScript with strict mode
- **Style**: Prettier configuration (run `npm run format`)
- **Components**: React functional components with hooks
- **State**: Zustand for global state management
- **Styling**: Tailwind CSS utility classes

#### File Structure
```
src/
├── components/     # Reusable UI components
├── lib/           # Utilities and services
├── app/           # Next.js app router pages
├── styles/        # Global styles
└── types/         # TypeScript type definitions
```

#### Naming Conventions
- **Components**: PascalCase (e.g., `AudioEngine.tsx`)
- **Utilities**: camelCase (e.g., `formatTime.ts`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `MAX_TRACKS`)
- **Types/Interfaces**: PascalCase with 'I' prefix for interfaces

### 4. Testing Requirements

All code must include tests:

```typescript
// Example test file: AudioEngine.test.tsx
import { render, screen } from '@testing-library/react'
import { AudioEngine } from './AudioEngine'

describe('AudioEngine', () => {
  it('should initialize with correct default values', () => {
    // Test implementation
  })
  
  it('should handle play/pause correctly', () => {
    // Test implementation
  })
})
```

**Coverage Requirements**:
- Minimum 80% code coverage
- All critical paths must be tested
- Edge cases documented and tested

### 5. Documentation

Update relevant documentation:
- **Code Comments**: JSDoc for public APIs
- **README**: Update if adding new features
- **API Docs**: Document new endpoints
- **User Guide**: Update for user-facing features

## 📋 Pull Request Process

### 1. PR Template

```markdown
## Description
Brief description of what this PR accomplishes

## Task Completed
TASK-XXX: [Task description from TODO.md]

## Changes Made
- Bullet point list of specific changes
- Technical decisions and rationale
- Dependencies added (if any)

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests passing
- [ ] Manual testing completed
- [ ] Performance impact assessed

## Screenshots
[Add screenshots for UI changes]

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests passing with >80% coverage
- [ ] Documentation updated
- [ ] No console errors/warnings
- [ ] Responsive design implemented
- [ ] Security best practices followed
```

### 2. Review Process

1. **Automated Checks**: GitHub Actions run tests and linting
2. **Code Review**: At least one maintainer reviews the code
3. **Security Review**: Automated security scanning
4. **Performance Check**: Ensure no significant performance degradation
5. **Final Approval**: Merge and token distribution

### 3. Token Distribution

Once your PR is merged:
1. GitHub Action triggers token distribution
2. Tokens sent to your BSV address (provided in PR)
3. Transaction ID posted as comment on PR
4. Your contribution added to [CONTRIBUTORS.md](./CONTRIBUTORS.md)

## 🛠️ Technical Guidelines

### Audio Development
- Use Tone.js for all audio processing
- Maintain <10ms latency for real-time effects
- Support 44.1kHz, 48kHz, and 96kHz sample rates
- Implement non-destructive editing

### Blockchain Integration
- Use BSV SDK for all blockchain operations
- Follow BSV20 token standard
- Implement proper error handling for failed transactions
- Cache blockchain data appropriately

### Performance
- Lazy load components where possible
- Use React.memo for expensive components
- Implement virtual scrolling for large lists
- Optimize bundle size (<500KB initial load)

### Security
- Never expose private keys
- Validate all user input
- Use HTTPS for all external requests
- Implement rate limiting on API endpoints
- Follow OWASP guidelines

## 🐛 Bug Reports

Found a bug? Help us fix it!

### Bug Report Template
```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: 
- OS: 
- Version:

## Screenshots
[If applicable]

## Possible Solution
[Optional: Suggest a fix]
```

## 💡 Feature Requests

Have an idea? We'd love to hear it!

### Feature Request Template
```markdown
## Feature Description
Clear description of the feature

## Problem It Solves
Why this feature is needed

## Proposed Solution
How it could work

## Alternatives Considered
Other approaches

## Additional Context
Mockups, examples, etc.
```

## 🤝 Community

### Communication Channels
- **GitHub Discussions**: Technical discussions
- **Discord**: [Join our server](https://discord.gg/bitcoinmusic)
- **Twitter**: [@BitcoinMusic](https://twitter.com/bitcoinmusic)
- **Email**: dev@bitcoin-music.app

### Code of Conduct
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive criticism
- Celebrate successes together
- No spam, harassment, or discrimination

## 📚 Resources

### Documentation
- [PRD.md](./PRD.md) - Product Requirements
- [EPIC.md](./EPIC.md) - Development Epic
- [TODO.md](./TODO.md) - Task List
- [README.md](./README.md) - Project Overview

### Learning Resources
- [Tone.js Documentation](https://tonejs.github.io)
- [Next.js Tutorial](https://nextjs.org/learn)
- [BSV Developer Docs](https://docs.bitcoinsv.io)
- [Web Audio API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

### Example PRs
- [Example: Adding Synthesizer](https://github.com/bitcoin-apps-suite/bitcoin-music/pull/1)
- [Example: NFT Minting UI](https://github.com/bitcoin-apps-suite/bitcoin-music/pull/2)
- [Example: HandCash Integration](https://github.com/bitcoin-apps-suite/bitcoin-music/pull/3)

## 🏆 Recognition

### Contributor Levels
- **Bronze** (1-2 PRs): Listed in CONTRIBUTORS.md
- **Silver** (3-5 PRs): Special Discord role + NFT badge
- **Gold** (6-10 PRs): Early access to features + advisory role
- **Platinum** (10+ PRs): Core team consideration + special rewards

### Hall of Fame
Top contributors are featured on our website and receive special recognition at launch events.

## ⚖️ Legal

### Contributor License Agreement
By submitting a PR, you agree that:
1. Your contribution is original work
2. You grant us the right to use your contribution
3. You understand token distribution is subject to terms
4. You comply with all applicable laws

### Token Terms
- Tokens are utility tokens, not securities
- No guarantee of value or liquidity
- Distribution subject to regulatory compliance
- Tax obligations are your responsibility

## 🙏 Thank You!

Your contributions make Bitcoin Music possible. Together, we're revolutionizing how music is created, owned, and monetized. Every line of code brings us closer to a decentralized future where artists have complete control over their work.

**Start contributing today and earn your stake in the future of music!**

---

*Questions? Reach out on [Discord](https://discord.gg/bitcoinmusic) or email dev@bitcoin-music.app*