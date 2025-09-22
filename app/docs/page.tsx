'use client'

import { useState } from 'react'
import { 
  Book, 
  Code, 
  Download, 
  Play, 
  Terminal, 
  FileText, 
  Zap, 
  ChevronRight,
  Copy,
  ExternalLink,
  Star,
  Github
} from 'lucide-react'

interface CodeSnippet {
  id: string
  title: string
  language: string
  code: string
}

interface GuideSection {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  badge?: string
}

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<'getting-started' | 'api' | 'sdk' | 'examples'>('getting-started')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const guideSections: GuideSection[] = [
    {
      id: 'quick-start',
      title: 'Quick Start',
      description: 'Get up and running with Bitcoin Music in minutes',
      icon: <Zap className="w-6 h-6" />,
      badge: 'Popular'
    },
    {
      id: 'minting',
      title: 'Minting Music NFTs',
      description: 'Learn how to mint and tokenize your music',
      icon: <Play className="w-6 h-6" />
    },
    {
      id: 'fractional',
      title: 'Fractional Ownership',
      description: 'Understanding fractional shares and royalties',
      icon: <FileText className="w-6 h-6" />
    },
    {
      id: 'api-integration',
      title: 'API Integration',
      description: 'Integrate Bitcoin Music into your application',
      icon: <Code className="w-6 h-6" />
    }
  ]

  const codeSnippets: CodeSnippet[] = [
    {
      id: 'init',
      title: 'Initialize SDK',
      language: 'javascript',
      code: `import { BitcoinMusic } from '@bitcoin-music/sdk'

const client = new BitcoinMusic({
  network: 'mainnet', // or 'testnet'
  apiKey: 'your-api-key'
})

// Connect wallet
await client.wallet.connect()`
    },
    {
      id: 'mint',
      title: 'Mint Music NFT',
      language: 'javascript',
      code: `const metadata = {
  title: 'My Song',
  artist: 'Artist Name',
  duration: 180, // seconds
  genre: 'Electronic',
  artwork: 'ipfs://QmHash...',
  audio: 'ipfs://QmHash...'
}

const nft = await client.nft.mint({
  metadata,
  totalShares: 10000,
  pricePerShare: 0.001 // BSV
})`
    },
    {
      id: 'trade',
      title: 'Trade Shares',
      language: 'javascript',
      code: `// Buy shares
const purchase = await client.marketplace.buyShares({
  nftId: 'nft_123',
  shares: 100,
  maxPrice: 0.001
})

// Sell shares
const sale = await client.marketplace.sellShares({
  nftId: 'nft_123',
  shares: 50,
  minPrice: 0.0012
})`
    },
    {
      id: 'royalties',
      title: 'Claim Royalties',
      language: 'javascript',
      code: `// Get royalty information
const royalties = await client.royalties.getEarnings({
  address: 'user-wallet-address'
})

// Claim pending royalties
const claim = await client.royalties.claim({
  nftIds: ['nft_123', 'nft_456']
})`
    }
  ]

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div 
      style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
        paddingTop: '60px'
      }}
      className="p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <Book className="w-10 h-10 text-purple-500" />
            Documentation
          </h1>
          <p className="text-gray-300 text-lg">
            Everything you need to build on Bitcoin Music platform
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1 mb-8 bg-white/5 p-1 rounded-lg">
          {[
            { id: 'getting-started', label: 'Getting Started', icon: <Zap className="w-4 h-4" /> },
            { id: 'api', label: 'API Reference', icon: <Code className="w-4 h-4" /> },
            { id: 'sdk', label: 'SDK Documentation', icon: <Terminal className="w-4 h-4" /> },
            { id: 'examples', label: 'Examples', icon: <FileText className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 sticky top-20">
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <div className="space-y-3">
                <a href="#installation" className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors">
                  <Download className="w-4 h-4" />
                  Installation
                </a>
                <a href="#authentication" className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors">
                  <FileText className="w-4 h-4" />
                  Authentication
                </a>
                <a href="#endpoints" className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors">
                  <Code className="w-4 h-4" />
                  API Endpoints
                </a>
                <a href="#examples" className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors">
                  <Play className="w-4 h-4" />
                  Code Examples
                </a>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <h4 className="text-white font-medium mb-3">Resources</h4>
                <div className="space-y-2">
                  <a href="#" className="flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors">
                    <Github className="w-4 h-4" />
                    GitHub Repository
                  </a>
                  <a href="#" className="flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    API Status
                  </a>
                  <a href="#" className="flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors">
                    <Star className="w-4 h-4" />
                    Changelog
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'getting-started' && (
              <div className="space-y-8">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Getting Started</h2>
                  <p className="text-gray-300 mb-6">
                    Welcome to Bitcoin Music! This guide will help you get started with our platform for creating, trading, and monetizing music NFTs.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {guideSections.map((section) => (
                      <div key={section.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className="text-purple-400 mt-1">
                            {section.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-white font-medium">{section.title}</h3>
                              {section.badge && (
                                <span className="px-2 py-1 bg-purple-600 text-xs text-white rounded-full">
                                  {section.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm">{section.description}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Installation</h3>
                  <div className="bg-black/50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">npm</span>
                      <button
                        onClick={() => copyToClipboard('npm install @bitcoin-music/sdk', 'npm')}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {copiedCode === 'npm' ? 'Copied!' : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <code className="text-green-400 font-mono">npm install @bitcoin-music/sdk</code>
                  </div>
                  <div className="bg-black/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">yarn</span>
                      <button
                        onClick={() => copyToClipboard('yarn add @bitcoin-music/sdk', 'yarn')}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {copiedCode === 'yarn' ? 'Copied!' : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <code className="text-green-400 font-mono">yarn add @bitcoin-music/sdk</code>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-8">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">API Reference</h2>
                  <p className="text-gray-300 mb-6">
                    Complete reference for the Bitcoin Music REST API
                  </p>

                  <div className="space-y-6">
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Base URL</h3>
                      <code className="bg-black/50 px-3 py-1 rounded text-green-400">
                        https://api.bitcoinmusic.com/v1
                      </code>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { method: 'GET', endpoint: '/nfts', description: 'List all music NFTs' },
                        { method: 'POST', endpoint: '/nfts', description: 'Create new music NFT' },
                        { method: 'GET', endpoint: '/marketplace', description: 'Get marketplace data' },
                        { method: 'POST', endpoint: '/trades', description: 'Execute trade transaction' },
                        { method: 'GET', endpoint: '/royalties', description: 'Get royalty information' },
                        { method: 'POST', endpoint: '/royalties/claim', description: 'Claim royalty payments' }
                      ].map((endpoint, index) => (
                        <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-mono ${
                              endpoint.method === 'GET' ? 'bg-green-600' : 'bg-blue-600'
                            } text-white`}>
                              {endpoint.method}
                            </span>
                            <code className="text-purple-400 font-mono">{endpoint.endpoint}</code>
                          </div>
                          <p className="text-gray-400 text-sm">{endpoint.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sdk' && (
              <div className="space-y-8">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">SDK Documentation</h2>
                  <p className="text-gray-300 mb-6">
                    Official JavaScript/TypeScript SDK for Bitcoin Music platform
                  </p>

                  <div className="space-y-6">
                    {codeSnippets.map((snippet) => (
                      <div key={snippet.id} className="bg-black/30 border border-white/10 rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                          <h3 className="text-white font-medium">{snippet.title}</h3>
                          <button
                            onClick={() => copyToClipboard(snippet.code, snippet.id)}
                            className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded text-sm text-gray-400 hover:text-white transition-colors"
                          >
                            {copiedCode === snippet.id ? 'Copied!' : <Copy className="w-4 h-4" />}
                            Copy
                          </button>
                        </div>
                        <pre className="p-4 overflow-x-auto">
                          <code className="text-green-400 font-mono text-sm whitespace-pre">
                            {snippet.code}
                          </code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'examples' && (
              <div className="space-y-8">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Code Examples</h2>
                  <p className="text-gray-300 mb-6">
                    Real-world examples and use cases for Bitcoin Music integration
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        title: 'Music Player Integration',
                        description: 'Build a music player with NFT playback',
                        language: 'React',
                        complexity: 'Beginner'
                      },
                      {
                        title: 'Royalty Dashboard',
                        description: 'Create a dashboard for tracking earnings',
                        language: 'Vue.js',
                        complexity: 'Intermediate'
                      },
                      {
                        title: 'Trading Bot',
                        description: 'Automated trading strategies',
                        language: 'Node.js',
                        complexity: 'Advanced'
                      },
                      {
                        title: 'Mobile App',
                        description: 'React Native mobile application',
                        language: 'React Native',
                        complexity: 'Intermediate'
                      }
                    ].map((example, index) => (
                      <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer">
                        <h3 className="text-white font-medium mb-2">{example.title}</h3>
                        <p className="text-gray-400 text-sm mb-3">{example.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-1 bg-purple-600/20 text-purple-400 text-xs rounded">
                            {example.language}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded ${
                            example.complexity === 'Beginner' ? 'bg-green-600/20 text-green-400' :
                            example.complexity === 'Intermediate' ? 'bg-yellow-600/20 text-yellow-400' :
                            'bg-red-600/20 text-red-400'
                          }`}>
                            {example.complexity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}