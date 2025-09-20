'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Music,
  Coins, 
  TrendingUp, 
  Users, 
  Lock, 
  Unlock,
  Award,
  BarChart3,
  PieChart,
  Shield,
  Rocket,
  Code,
  Zap,
  Globe,
  Gift,
  ArrowUpRight,
  CheckCircle,
  Timer,
  Wallet,
  Building
} from 'lucide-react'

export default function TokenPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'tokenomics' | 'utility' | 'roadmap'>('overview')

  const stats = [
    { label: 'Total Supply', value: '1,000,000,000', icon: Coins, color: 'from-yellow-500 to-orange-500' },
    { label: 'Developer Allocation', value: '49%', icon: Code, color: 'from-purple-500 to-pink-500' },
    { label: 'Per Task Reward', value: '10,000,000', icon: Gift, color: 'from-green-500 to-teal-500' },
    { label: 'Platform Reserve', value: '51%', icon: Lock, color: 'from-blue-500 to-indigo-500' }
  ]

  const tokenAllocation = [
    { category: 'Platform Reserve', percentage: 51, color: '#8b5cf6', description: 'Bitcoin Software Company LTD' },
    { category: 'Developer Bounties', percentage: 49, color: '#f59e0b', description: '49 tasks × 1% each' },
  ]

  const utilityFeatures = [
    {
      title: 'Studio Access',
      description: 'Unlock premium instruments, effects, and advanced DAW features',
      icon: Music,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'NFT Minting',
      description: 'Create and mint music NFTs with reduced or zero fees',
      icon: Award,
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Trading Benefits',
      description: 'Reduced fees on Bitcoin-Exchange for music NFT trading',
      icon: TrendingUp,
      gradient: 'from-green-500 to-teal-500'
    },
    {
      title: 'Governance Rights',
      description: 'Vote on platform features, artist grants, and treasury allocation',
      icon: Shield,
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      title: 'Revenue Sharing',
      description: 'Earn from platform fees, NFT sales, and subscription revenue',
      icon: PieChart,
      gradient: 'from-red-500 to-pink-500'
    },
    {
      title: 'Staking Rewards',
      description: 'Stake $BMusic to earn additional tokens and exclusive benefits',
      icon: Lock,
      gradient: 'from-indigo-500 to-purple-500'
    }
  ]

  const roadmapPhases = [
    {
      phase: 'Phase 1',
      title: 'Foundation',
      timeline: 'Q1 2025',
      status: 'active',
      items: [
        'Launch $BMusic token on BSV',
        'Core DAW development',
        'Developer bounty program',
        'HandCash integration'
      ]
    },
    {
      phase: 'Phase 2',
      title: 'Production Tools',
      timeline: 'Q2 2025',
      status: 'upcoming',
      items: [
        'Virtual instruments suite',
        'Professional effects library',
        'NFT minting system',
        'Token distribution mechanism'
      ]
    },
    {
      phase: 'Phase 3',
      title: 'Marketplace',
      timeline: 'Q3 2025',
      status: 'upcoming',
      items: [
        'Bitcoin-Exchange integration',
        'Music NFT marketplace',
        'Revenue sharing system',
        'Mobile applications'
      ]
    },
    {
      phase: 'Phase 4',
      title: 'Advanced Features',
      timeline: 'Q4 2025',
      status: 'upcoming',
      items: [
        'AI mixing assistant',
        'VST plugin support',
        'Live streaming platform',
        'DAO governance launch'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-pink-600/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500 rounded-full filter blur-[128px] opacity-20" />
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-pink-500 rounded-full filter blur-[128px] opacity-20" />
        </div>
        
        <div className="container mx-auto px-6 py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 bg-opacity-20 backdrop-blur-sm">
                <Music className="w-16 h-16 text-white" />
              </div>
            </div>
            
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              $BMusic Token
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              The native utility token powering the Bitcoin Music ecosystem. Create, produce, tokenize, 
              and trade music on the blockchain while earning rewards for your contributions.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20 blur-xl transition duration-500`} />
                    <div className="relative bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
                      <Icon className="w-8 h-8 mb-3 text-purple-400 mx-auto" />
                      <div className="text-2xl font-bold mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-purple-500/30">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8 overflow-x-auto">
            {(['overview', 'tokenomics', 'utility', 'roadmap'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 capitalize font-medium transition-colors relative ${
                  activeTab === tab 
                    ? 'text-purple-400' 
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-6 py-16">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-16"
          >
            {/* About Section */}
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Revolutionizing Music Creation
                </h2>
                <p className="text-gray-300 mb-4">
                  $BMusic is the utility token at the heart of Bitcoin Music, a decentralized Digital Audio 
                  Workstation (DAW) and NFT marketplace built on Bitcoin SV blockchain.
                </p>
                <p className="text-gray-300 mb-4">
                  Our mission is to empower musicians with complete ownership of their creative work while 
                  providing professional-grade production tools accessible to everyone.
                </p>
                <p className="text-gray-300">
                  By combining cutting-edge audio technology with blockchain innovation, we're creating a 
                  platform where artists can create, monetize, and trade their music directly with fans, 
                  eliminating intermediaries and maximizing creator revenue.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8">
                <h3 className="text-xl font-semibold mb-6">Token Quick Facts</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Token Symbol</span>
                    <span className="font-semibold">$BMusic</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Blockchain</span>
                    <span className="font-semibold">Bitcoin SV (BSV)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Token Standard</span>
                    <span className="font-semibold">BSV20</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Supply</span>
                    <span className="font-semibold">1,000,000,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Initial Price</span>
                    <span className="font-semibold">$0.001 USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Launch Date</span>
                    <span className="font-semibold">Q1 2025</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Why $BMusic?
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
                  <Zap className="w-10 h-10 text-yellow-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Instant Transactions</h3>
                  <p className="text-gray-400 text-sm">
                    Lightning-fast BSV blockchain ensures instant payments and NFT transfers
                  </p>
                </div>
                <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
                  <Globe className="w-10 h-10 text-blue-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Global Access</h3>
                  <p className="text-gray-400 text-sm">
                    Borderless platform connecting musicians and fans worldwide
                  </p>
                </div>
                <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
                  <Shield className="w-10 h-10 text-green-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Secure & Transparent</h3>
                  <p className="text-gray-400 text-sm">
                    Immutable blockchain records ensure transparent royalty distribution
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'tokenomics' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-16"
          >
            {/* Token Distribution */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Token Distribution
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8">
                  <h3 className="text-xl font-semibold mb-6">Allocation Breakdown</h3>
                  <div className="space-y-4">
                    {tokenAllocation.map((item) => (
                      <div key={item.category}>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-300">{item.category}</span>
                          <span className="font-semibold">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-3 mb-2">
                          <div
                            className="h-3 rounded-full transition-all duration-500"
                            style={{
                              width: `${item.percentage}%`,
                              backgroundColor: item.color
                            }}
                          />
                        </div>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8">
                  <h3 className="text-xl font-semibold mb-6">Developer Rewards</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Code className="w-5 h-5 text-purple-400" />
                      <div>
                        <div className="font-semibold">49 Development Tasks</div>
                        <div className="text-sm text-gray-400">Each task worth 1% of total supply</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Gift className="w-5 h-5 text-yellow-400" />
                      <div>
                        <div className="font-semibold">10,000,000 $BMusic per Task</div>
                        <div className="text-sm text-gray-400">Paid upon PR merge</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Rocket className="w-5 h-5 text-green-400" />
                      <div>
                        <div className="font-semibold">Immediate Distribution</div>
                        <div className="text-sm text-gray-400">Tokens sent directly to contributor</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Economic Model */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Economic Model
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
                  <BarChart3 className="w-8 h-8 text-purple-400 mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Transaction Fees</h3>
                  <p className="text-gray-400 text-sm mb-3">2.5% fee on all NFT sales and trades</p>
                  <div className="text-xs text-gray-500">Revenue flows to token holders</div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-6">
                  <Wallet className="w-8 h-8 text-yellow-400 mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Staking Rewards</h3>
                  <p className="text-gray-400 text-sm mb-3">Up to 12% APY for staking $BMusic</p>
                  <div className="text-xs text-gray-500">Rewards from platform revenue</div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 backdrop-blur-sm border border-green-500/30 rounded-xl p-6">
                  <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Burn Mechanism</h3>
                  <p className="text-gray-400 text-sm mb-3">25% of fees burned quarterly</p>
                  <div className="text-xs text-gray-500">Deflationary tokenomics</div>
                </div>
              </div>
            </div>

            {/* Vesting Schedule */}
            <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8">
              <h3 className="text-xl font-semibold mb-6">Platform Reserve Vesting</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-purple-500/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-purple-400" />
                    <span>Initial Lock</span>
                  </div>
                  <span className="font-semibold">6 months</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-500/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Timer className="w-5 h-5 text-yellow-400" />
                    <span>Vesting Period</span>
                  </div>
                  <span className="font-semibold">24 months linear</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-500/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-blue-400" />
                    <span>Company Reserve</span>
                  </div>
                  <span className="font-semibold">10% unlocked at TGE</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'utility' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-16"
          >
            <div>
              <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Token Utility
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {utilityFeatures.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative group"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 blur-xl transition duration-500`} />
                      <div className="relative bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 h-full">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.gradient} bg-opacity-20 inline-block mb-4`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                        <p className="text-gray-400 text-sm">{feature.description}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Use Cases */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Platform Benefits
              </h2>
              
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-purple-400">For Musicians</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                        <div>
                          <div className="font-medium">Free DAW Access</div>
                          <div className="text-sm text-gray-400">Professional tools without subscription</div>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                        <div>
                          <div className="font-medium">Direct Monetization</div>
                          <div className="text-sm text-gray-400">Sell music NFTs directly to fans</div>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                        <div>
                          <div className="font-medium">Instant Payments</div>
                          <div className="text-sm text-gray-400">No waiting for royalty distributions</div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-pink-400">For Collectors</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                        <div>
                          <div className="font-medium">Exclusive Music</div>
                          <div className="text-sm text-gray-400">Access rare and limited edition tracks</div>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                        <div>
                          <div className="font-medium">Revenue Sharing</div>
                          <div className="text-sm text-gray-400">Earn from music streaming and sales</div>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                        <div>
                          <div className="font-medium">Trading Opportunities</div>
                          <div className="text-sm text-gray-400">Trade music NFTs on secondary market</div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'roadmap' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Development Roadmap
            </h2>
            
            <div className="space-y-8">
              {roadmapPhases.map((phase, index) => (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex gap-8 ${
                    phase.status === 'active' ? 'opacity-100' : 'opacity-60'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg ${
                      phase.status === 'active' 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gray-800 text-gray-400 border-2 border-gray-700'
                    }`}>
                      {index + 1}
                    </div>
                    {index < roadmapPhases.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-800 mt-4" />
                    )}
                  </div>
                  
                  <div className="flex-1 pb-12">
                    <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold">{phase.title}</h3>
                          <p className="text-sm text-gray-400">{phase.timeline}</p>
                        </div>
                        {phase.status === 'active' && (
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                            In Progress
                          </span>
                        )}
                      </div>
                      
                      <ul className="space-y-2">
                        {phase.items.map((item) => (
                          <li key={item} className="flex items-center gap-3">
                            <CheckCircle className="w-4 h-4 text-purple-400" />
                            <span className="text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border-t border-purple-500/30">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Join the Music Revolution
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Be part of the future of decentralized music creation. Contribute to development, 
              create amazing music, or collect exclusive NFTs.
            </p>
            
            <div className="flex justify-center gap-4 flex-wrap">
              <a
                href="/tasks"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:opacity-90 transition flex items-center gap-2"
              >
                Start Contributing
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/bitcoin-apps-suite/bitcoin-music"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-black/50 border border-purple-500/50 rounded-lg font-semibold hover:bg-purple-500/10 transition flex items-center gap-2"
              >
                View on GitHub
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}