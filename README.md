# Bitcoin Music 🎵

A revolutionary decentralized Digital Audio Workstation (DAW) and NFT marketplace built on Bitcoin SV blockchain. Create, produce, tokenize, and trade music as blockchain assets with professional-grade audio tools and Web3 monetization.

**Developed by The Bitcoin Corporation LTD.**  
*UK Registered Company No. 16735102*

![Bitcoin Music Logo](public/bitcoin-music-logo.jpg)

## 🌟 Overview

Bitcoin Music is part of the **Bitcoin Apps Suite (BAPS)** ecosystem - a comprehensive collection of blockchain-powered applications where every app has its own token ($BMusic) creating a sustainable economic model for creators and users. This professional DAW combines cutting-edge audio production capabilities with blockchain technology, enabling musicians to:

- **Create & Produce**: Full-featured DAW with virtual instruments, effects, and recording
- **Tokenize**: Convert tracks, stems, and samples into tradeable NFT assets
- **Monetize**: Issue fungible tokens (.ft) as revenue shares in music sales
- **Trade**: List music NFTs on the integrated Bitcoin-Exchange marketplace
- **Collaborate**: Share projects and split royalties automatically via smart contracts

## 🚀 Features

### Core DAW Functionality
- **Multi-track Recording**: Up to 32 simultaneous audio/MIDI tracks
- **Virtual Instruments**: Built-in synthesizers, samplers, and drum machines
- **Audio Effects**: Professional effects chain (reverb, delay, compression, EQ, etc.)
- **MIDI Support**: Full MIDI recording, editing, and playback
- **Waveform Editor**: Visual audio editing with precision tools
- **Mixer Console**: Professional mixing interface with automation
- **Real-time Audio Engine**: Powered by Tone.js for low-latency performance

### Blockchain Integration
- **NFT Minting**: Package audio files as `.nft` containers on BSV blockchain
- **Revenue Tokenization**: Issue `.ft` (fungible tokens) representing shares in music revenue
- **On-chain Storage**: Permanent, immutable storage of master recordings
- **HandCash Wallet**: Seamless authentication and payments via HandCash
- **Smart Royalties**: Automated royalty distribution to collaborators
- **Proof of Creation**: Cryptographic timestamps for copyright protection

### Music NFT Features
- **Track NFTs**: Mint complete songs as unique digital assets
- **Stem NFTs**: Sell individual instrument tracks for remixing
- **Sample Packs**: Create tradeable collections of sounds and loops  
- **Album NFTs**: Bundle multiple tracks with artwork and metadata
- **Limited Editions**: Create scarcity with numbered releases
- **Unlockable Content**: Bonus materials for NFT holders

### Trading & Marketplace
- **Bitcoin-Exchange Integration**: List music NFTs on the central BAPS exchange
- **P2P Trading**: Direct artist-to-fan transactions without intermediaries
- **Revenue Shares**: Sell percentage ownership in future streaming/sales revenue
- **Auction System**: Time-based auctions for rare releases
- **Secondary Market**: Royalties on all resales
- **Global Distribution**: Instant worldwide access via blockchain

## 💎 $BMusic Token

The $BMusic token powers the Bitcoin Music ecosystem:

- **Studio Access**: Unlock premium instruments and effects
- **Storage Rights**: Pay for blockchain storage of audio files
- **Trading Fees**: Reduced fees for NFT marketplace transactions
- **Governance**: Vote on platform features and artist grants
- **Staking Rewards**: Earn from platform revenue sharing
- **Artist Support**: Fund emerging artists through DAO treasury

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Audio Engine**: Tone.js, Web Audio API, WaveSurfer.js
- **3D Graphics**: Three.js, React Three Fiber
- **Blockchain**: Bitcoin SV (BSV) SDK, HandCash Connect
- **State Management**: Zustand
- **Styling**: Tailwind CSS v3
- **Authentication**: NextAuth.js with Google/HandCash OAuth
- **File Processing**: JSZip for NFT containers
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm
- HandCash wallet account (get one at https://handcash.io)
- HandCash App credentials (from https://dashboard.handcash.io)
- Modern browser with Web Audio API support

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/bitcoin-apps-suite/bitcoin-music.git
cd bitcoin-music
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the root directory:
```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3007
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# HandCash Configuration
HANDCASH_APP_ID=your-handcash-app-id
HANDCASH_APP_SECRET=your-handcash-secret
HANDCASH_REDIRECT_URL=http://localhost:3007/auth/handcash/callback

# BSV Network
REACT_APP_NETWORK=mainnet  # or 'testnet'

# Exchange URL
REACT_APP_EXCHANGE_URL=https://exchange.bitcoin-wallet.app
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3007](http://localhost:3007) in your browser.

## 📂 Project Structure

```
bitcoin-music/
├── app/                      # Next.js App Router
│   ├── api/                 # API routes
│   │   ├── auth/           # NextAuth endpoints
│   │   └── music/          # Music NFT endpoints
│   ├── studio/             # DAW interface pages
│   ├── marketplace/        # NFT marketplace
│   ├── layout.tsx          # Root layout
│   └── page.tsx           # Landing page
├── components/              # React components
│   ├── AudioEngine/        # Core audio components
│   ├── DAW/               # DAW interface components
│   ├── NFT/               # NFT minting/trading
│   ├── Taskbar.tsx        # Navigation taskbar
│   └── Providers.tsx      # Context providers
├── lib/                     # Utilities and services
│   ├── audio/             # Audio processing
│   ├── blockchain/        # BSV integration
│   └── nft/              # NFT container logic
├── public/                  # Static assets
└── styles/                 # Global styles
```

## 🎛️ DAW Usage

### Getting Started with Music Production

1. **Create Project**: Click "New Project" to start a blank session
2. **Add Tracks**: Use the "+" button to add audio or MIDI tracks
3. **Record Audio**: Click the record button and select input source
4. **Add Virtual Instruments**: Drag instruments from the sidebar to MIDI tracks
5. **Apply Effects**: Add effects to tracks via the mixer channel strips
6. **Mix & Master**: Use the mixer for levels, panning, and automation
7. **Export**: Render your project as WAV, MP3, or blockchain NFT

### Keyboard Shortcuts

- `Space` - Play/Pause
- `R` - Start/Stop Recording
- `S` - Solo selected track
- `M` - Mute selected track
- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Shift + Z` - Redo
- `Ctrl/Cmd + S` - Save project
- `Delete` - Delete selected item

## 🎨 NFT Creation

### Minting Music NFTs

1. **Complete Your Track**: Finish mixing and mastering
2. **Click "Mint NFT"**: Opens the tokenization modal
3. **Set Metadata**:
   - Title, artist, album, genre
   - Cover artwork (image upload)
   - Description and credits
4. **Choose Token Type**:
   - **Unique NFT**: One-of-a-kind collectible
   - **Limited Edition**: Set supply (e.g., 100 copies)
   - **Revenue Share**: Issue .ft tokens for royalty splitting
5. **Set Pricing**:
   - Fixed price in BSV
   - Auction with reserve price
   - Free with optional tips
6. **Mint to Blockchain**: Confirm HandCash transaction
7. **List on Exchange**: Automatically listed on Bitcoin-Exchange

### NFT Container Structure

Music NFTs use the `.nft` container format (ZIP archive):
```
track.nft
├── manifest.json          # Metadata and blockchain info
├── audio/
│   ├── master.wav        # High-quality master
│   ├── preview.mp3       # Streaming preview
│   └── stems/           # Individual tracks (optional)
├── artwork/
│   └── cover.jpg        # Album artwork
├── metadata.json         # Extended metadata
├── royalties.json        # Revenue split configuration
└── signatures.json       # Cryptographic proofs
```

## 🏪 Marketplace Integration

### Trading Music NFTs

The Bitcoin Music marketplace integrates with the central Bitcoin-Exchange:

1. **Browse Collections**: Discover new music by genre, artist, or trend
2. **Preview Tracks**: Stream watermarked previews before purchase
3. **Purchase NFTs**: Buy with BSV via HandCash wallet
4. **Resell NFTs**: List your collection with automatic royalties to creators
5. **Track Earnings**: Dashboard showing sales, streams, and royalty income

### Revenue Models

- **Direct Sales**: One-time purchase of music NFTs
- **Streaming Royalties**: Earn from platform plays
- **Sync Licensing**: License music for media use
- **Remix Rights**: Sell stems for derivative works
- **Subscription Tiers**: Recurring revenue from fan clubs
- **Tips & Donations**: Direct fan support

## 🔧 Available Scripts

- `npm run dev` - Start development server on port 3007
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🚢 Deployment

### Vercel Deployment (Recommended)
```bash
npm run build
vercel --prod
```

The app auto-deploys to [bitcoin-music.vercel.app](https://bitcoin-music.vercel.app) on push to main.

### Docker Deployment
```bash
docker build -t bitcoin-music .
docker run -p 3007:3007 bitcoin-music
```

## 🔐 Security & Privacy

### Audio Protection
- **Watermarking**: Preview streams include audio watermarks
- **Encryption**: Master files encrypted in NFT containers
- **Access Control**: Token-gated content for NFT holders
- **DRM Options**: Optional copy protection for downloads

### Blockchain Security
- **Non-Custodial**: Users control private keys via HandCash
- **Immutable Records**: Permanent proof of creation date
- **Transparent Royalties**: All splits recorded on-chain
- **Decentralized Storage**: No single point of failure

## 🤝 Contributing

We welcome contributions from developers and musicians!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Rewards
Successfully merged PRs earn $BMusic tokens! Rewards based on:
- Feature impact and complexity
- Code quality and documentation
- Bug fixes and optimizations
- Creative audio tools and instruments

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Tone.js** team for the incredible Web Audio framework
- **Bitcoin SV** community for scalable blockchain infrastructure
- **HandCash** for seamless wallet integration
- **Three.js** for stunning 3D visualizations
- All contributing musicians and developers

## 🔮 Roadmap

### Q1 2025
- [ ] Launch $BMusic token on BSV blockchain
- [ ] Deploy to Bitcoin-Exchange marketplace
- [ ] Mobile app (iOS/Android) development
- [ ] Advanced MIDI editing tools

### Q2 2025
- [ ] AI-powered mixing assistant
- [ ] Collaborative real-time sessions
- [ ] VST plugin support
- [ ] Live streaming integration

### Q3 2025
- [ ] Decentralized music distribution network
- [ ] Cross-chain NFT bridges
- [ ] Virtual concert platform
- [ ] DAO governance implementation

### Q4 2025
- [ ] Machine learning sample generation
- [ ] Spatial audio and VR support
- [ ] Hardware controller integration
- [ ] Global music rights management

## 📧 Contact & Support

- **GitHub**: [github.com/bitcoin-apps-suite/bitcoin-music](https://github.com/bitcoin-apps-suite/bitcoin-music)
- **Twitter**: [@BitcoinMusic](https://twitter.com/bitcoinmusic) (Coming Soon)
- **Discord**: [discord.gg/bitcoinmusic](https://discord.gg/bitcoinmusic) (Coming Soon)
- **Email**: support@bitcoin-music.app

## 🎵 Join the Revolution

Bitcoin Music is transforming how music is created, owned, and monetized. By combining professional audio production tools with blockchain technology, we're empowering artists to maintain control of their work while connecting directly with fans globally.

**Start creating your musical legacy on the blockchain today!**

---

**Part of the Bitcoin Apps Suite** | **Powered by Bitcoin SV** | **Built for Musicians, by Musicians**

*"Your Music, Your Rights, Your Revenue"*