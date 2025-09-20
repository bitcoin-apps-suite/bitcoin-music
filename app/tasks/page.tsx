'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Music, 
  Code, 
  Coins, 
  GitPullRequest, 
  CheckCircle,
  Clock,
  Trophy,
  Users,
  Zap,
  Database,
  ShoppingCart,
  Palette,
  Github,
  MessageCircle,
  Twitter,
  Mail,
  ChevronRight
} from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  category: 'daw' | 'blockchain' | 'marketplace' | 'ui'
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  status: 'open' | 'claimed' | 'completed'
  claimedBy?: string
  completedBy?: string
  prLink?: string
}

const tasks: Task[] = [
  // Core DAW Development
  { id: 'TASK-001', title: 'Core Tone.js audio engine', description: 'Implement core Tone.js audio engine with transport controls', category: 'daw', priority: 'HIGH', status: 'open' },
  { id: 'TASK-002', title: 'Multi-track timeline', description: 'Create multi-track timeline with zoom and scroll functionality', category: 'daw', priority: 'HIGH', status: 'open' },
  { id: 'TASK-003', title: 'Track mixer controls', description: 'Build track mixer with volume, pan, mute, and solo controls', category: 'daw', priority: 'HIGH', status: 'open' },
  { id: 'TASK-004', title: 'Audio recording', description: 'Implement audio recording via MediaRecorder API', category: 'daw', priority: 'HIGH', status: 'open' },
  { id: 'TASK-005', title: 'MIDI recording', description: 'Add MIDI recording and piano roll editor', category: 'daw', priority: 'HIGH', status: 'open' },
  { id: 'TASK-006', title: 'Waveform visualization', description: 'Create waveform visualization component using WaveSurfer.js', category: 'daw', priority: 'HIGH', status: 'open' },
  { id: 'TASK-007', title: 'Audio file import', description: 'Implement audio file import (WAV, MP3, FLAC, OGG)', category: 'daw', priority: 'HIGH', status: 'open' },
  { id: 'TASK-008', title: 'Audio export system', description: 'Build audio export system with multiple format support', category: 'daw', priority: 'HIGH', status: 'open' },
  
  // Virtual Instruments
  { id: 'TASK-009', title: 'Subtractive synthesizer', description: 'Create polyphonic subtractive synthesizer with ADSR', category: 'daw', priority: 'HIGH', status: 'open' },
  { id: 'TASK-010', title: 'FM synthesis', description: 'Build FM synthesis instrument with operators', category: 'daw', priority: 'HIGH', status: 'open' },
  { id: 'TASK-011', title: 'Wavetable synthesizer', description: 'Implement wavetable synthesizer with custom waveforms', category: 'daw', priority: 'HIGH', status: 'open' },
  { id: 'TASK-012', title: 'Sample player', description: 'Create multi-sample instrument player', category: 'daw', priority: 'HIGH', status: 'open' },
  { id: 'TASK-013', title: 'Drum machine', description: 'Build drum machine with 16-step sequencer', category: 'daw', priority: 'HIGH', status: 'open' },
  { id: 'TASK-014', title: 'Piano instrument', description: 'Add piano/keyboard instrument with velocity sensitivity', category: 'daw', priority: 'HIGH', status: 'open' },
  
  // Audio Effects
  { id: 'TASK-015', title: 'Dynamics suite', description: 'Implement dynamics suite (compressor, limiter, gate)', category: 'daw', priority: 'MEDIUM', status: 'open' },
  { id: 'TASK-016', title: 'EQ system', description: 'Create EQ system (parametric, graphic, filters)', category: 'daw', priority: 'MEDIUM', status: 'open' },
  { id: 'TASK-017', title: 'Reverb and delay', description: 'Build reverb and delay effects with presets', category: 'daw', priority: 'MEDIUM', status: 'open' },
  { id: 'TASK-018', title: 'Modulation effects', description: 'Add modulation effects (chorus, flanger, phaser)', category: 'daw', priority: 'MEDIUM', status: 'open' },
  { id: 'TASK-019', title: 'Distortion effects', description: 'Implement distortion and saturation effects', category: 'daw', priority: 'MEDIUM', status: 'open' },
  { id: 'TASK-020', title: 'Automation system', description: 'Create automation system for all parameters', category: 'daw', priority: 'MEDIUM', status: 'open' },
  
  // Blockchain Integration
  { id: 'TASK-021', title: 'NFT container format', description: 'Design and implement .nft container format for music', category: 'blockchain', priority: 'HIGH', status: 'open' },
  { id: 'TASK-022', title: 'NFT minting interface', description: 'Create NFT minting interface with metadata input', category: 'blockchain', priority: 'HIGH', status: 'open' },
  { id: 'TASK-023', title: 'Preview generation', description: 'Build preview generation system with watermarking', category: 'blockchain', priority: 'HIGH', status: 'open' },
  { id: 'TASK-024', title: 'IPFS/Arweave upload', description: 'Implement IPFS/Arweave upload for audio storage', category: 'blockchain', priority: 'HIGH', status: 'open' },
  { id: 'TASK-025', title: 'Batch minting', description: 'Add batch minting for multiple tracks', category: 'blockchain', priority: 'HIGH', status: 'open' },
  { id: 'TASK-026', title: 'NFT gallery', description: 'Create NFT gallery view for user\'s collection', category: 'blockchain', priority: 'HIGH', status: 'open' },
  
  // Token System
  { id: 'TASK-027', title: 'Fungible token creation', description: 'Implement fungible token (.ft) creation for revenue shares', category: 'blockchain', priority: 'HIGH', status: 'open' },
  { id: 'TASK-028', title: 'Token distribution UI', description: 'Build token distribution calculator and UI', category: 'blockchain', priority: 'HIGH', status: 'open' },
  { id: 'TASK-029', title: 'Royalty distribution', description: 'Create automatic royalty distribution system', category: 'blockchain', priority: 'HIGH', status: 'open' },
  { id: 'TASK-030', title: 'Staking mechanism', description: 'Add staking mechanism for $BMusic tokens', category: 'blockchain', priority: 'HIGH', status: 'open' },
  { id: 'TASK-031', title: 'Governance voting', description: 'Implement governance voting for token holders', category: 'blockchain', priority: 'HIGH', status: 'open' },
  
  // HandCash Integration
  { id: 'TASK-032', title: 'HandCash OAuth', description: 'Complete HandCash OAuth authentication flow', category: 'blockchain', priority: 'HIGH', status: 'open' },
  { id: 'TASK-033', title: 'HandCash payments', description: 'Implement HandCash payment processing', category: 'blockchain', priority: 'HIGH', status: 'open' },
  { id: 'TASK-034', title: 'HandCash profiles', description: 'Add HandCash profile integration', category: 'blockchain', priority: 'HIGH', status: 'open' },
  { id: 'TASK-035', title: 'Transaction history', description: 'Create transaction history viewer', category: 'blockchain', priority: 'HIGH', status: 'open' },
  
  // Marketplace Features
  { id: 'TASK-036', title: 'Exchange API', description: 'Connect to Bitcoin-Exchange API', category: 'marketplace', priority: 'MEDIUM', status: 'open' },
  { id: 'TASK-037', title: 'Order book trading', description: 'Implement order book display and trading', category: 'marketplace', priority: 'MEDIUM', status: 'open' },
  { id: 'TASK-038', title: 'Price charts', description: 'Create price charts and market data views', category: 'marketplace', priority: 'MEDIUM', status: 'open' },
  { id: 'TASK-039', title: 'Portfolio tracking', description: 'Build portfolio tracking dashboard', category: 'marketplace', priority: 'MEDIUM', status: 'open' },
  { id: 'TASK-040', title: 'Music discovery', description: 'Create music discovery page with filters', category: 'marketplace', priority: 'MEDIUM', status: 'open' },
  { id: 'TASK-041', title: 'Preview streaming', description: 'Implement preview streaming system', category: 'marketplace', priority: 'MEDIUM', status: 'open' },
  { id: 'TASK-042', title: 'Auction system', description: 'Build auction system for exclusive releases', category: 'marketplace', priority: 'MEDIUM', status: 'open' },
  { id: 'TASK-043', title: 'Offer system', description: 'Add direct offer and negotiation system', category: 'marketplace', priority: 'MEDIUM', status: 'open' },
  
  // UI/UX Development
  { id: 'TASK-044', title: 'DAW layout', description: 'Design and implement responsive DAW layout', category: 'ui', priority: 'HIGH', status: 'open' },
  { id: 'TASK-045', title: 'Theme system', description: 'Create dark/light theme toggle system', category: 'ui', priority: 'HIGH', status: 'open' },
  { id: 'TASK-046', title: 'Keyboard shortcuts', description: 'Build keyboard shortcut system', category: 'ui', priority: 'HIGH', status: 'open' },
  { id: 'TASK-047', title: 'Drag and drop', description: 'Implement drag-and-drop for tracks and effects', category: 'ui', priority: 'HIGH', status: 'open' },
  { id: 'TASK-048', title: 'Mobile interface', description: 'Create touch-optimized mobile interface', category: 'ui', priority: 'HIGH', status: 'open' },
  { id: 'TASK-049', title: 'Help system', description: 'Build comprehensive help system and tutorials', category: 'ui', priority: 'LOW', status: 'open' },
]

const categoryIcons = {
  daw: Music,
  blockchain: Database,
  marketplace: ShoppingCart,
  ui: Palette
}

const categoryColors = {
  daw: 'from-purple-500 to-pink-500',
  blockchain: 'from-yellow-500 to-orange-500',
  marketplace: 'from-green-500 to-teal-500',
  ui: 'from-blue-500 to-indigo-500'
}

const priorityColors = {
  HIGH: 'text-red-400',
  MEDIUM: 'text-yellow-400',
  LOW: 'text-green-400'
}

export default function TasksPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'daw' | 'blockchain' | 'marketplace' | 'ui'>('all')
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'HIGH' | 'MEDIUM' | 'LOW'>('all')
  
  const filteredTasks = tasks.filter(task => {
    const categoryMatch = selectedCategory === 'all' || task.category === selectedCategory
    const priorityMatch = selectedPriority === 'all' || task.priority === selectedPriority
    return categoryMatch && priorityMatch
  })
  
  const stats = {
    total: tasks.length,
    open: tasks.filter(t => t.status === 'open').length,
    claimed: tasks.filter(t => t.status === 'claimed').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    tokensAvailable: tasks.filter(t => t.status === 'open').length * 10000000,
    percentageAvailable: (tasks.filter(t => t.status === 'open').length / tasks.length) * 49
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 text-white">
      {/* Header */}
      <div className="relative overflow-hidden bg-black/50 border-b border-purple-500/30">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10" />
        <div className="container mx-auto px-6 py-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Bitcoin Music Development Tasks
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Earn 1% equity (10,000,000 $BMusic tokens) for each completed task
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
                <div className="text-3xl font-bold text-purple-400">{stats.total}</div>
                <div className="text-gray-400 mt-2">Total Tasks</div>
              </div>
              <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-xl p-6">
                <div className="text-3xl font-bold text-green-400">{stats.open}</div>
                <div className="text-gray-400 mt-2">Available</div>
              </div>
              <div className="bg-black/50 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-6">
                <div className="text-3xl font-bold text-yellow-400">{stats.claimed}</div>
                <div className="text-gray-400 mt-2">In Progress</div>
              </div>
              <div className="bg-black/50 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6">
                <div className="text-3xl font-bold text-blue-400">{stats.completed}</div>
                <div className="text-gray-400 mt-2">Completed</div>
              </div>
            </div>
            
            {/* Token Info */}
            <div className="mt-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8">
              <div className="flex items-center justify-center gap-8 flex-wrap">
                <div>
                  <Coins className="w-8 h-8 text-yellow-400 mb-2 mx-auto" />
                  <div className="text-2xl font-bold text-yellow-400">{stats.tokensAvailable.toLocaleString()}</div>
                  <div className="text-gray-300">$BMusic Tokens Available</div>
                </div>
                <div>
                  <Trophy className="w-8 h-8 text-purple-400 mb-2 mx-auto" />
                  <div className="text-2xl font-bold text-purple-400">{stats.percentageAvailable.toFixed(1)}%</div>
                  <div className="text-gray-300">Total Equity Available</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg transition ${
                selectedCategory === 'all'
                  ? 'bg-purple-500 text-white'
                  : 'bg-black/50 text-gray-400 hover:bg-purple-500/20'
              }`}
            >
              All Categories
            </button>
            <button
              onClick={() => setSelectedCategory('daw')}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                selectedCategory === 'daw'
                  ? 'bg-purple-500 text-white'
                  : 'bg-black/50 text-gray-400 hover:bg-purple-500/20'
              }`}
            >
              <Music className="w-4 h-4" />
              DAW
            </button>
            <button
              onClick={() => setSelectedCategory('blockchain')}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                selectedCategory === 'blockchain'
                  ? 'bg-purple-500 text-white'
                  : 'bg-black/50 text-gray-400 hover:bg-purple-500/20'
              }`}
            >
              <Database className="w-4 h-4" />
              Blockchain
            </button>
            <button
              onClick={() => setSelectedCategory('marketplace')}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                selectedCategory === 'marketplace'
                  ? 'bg-purple-500 text-white'
                  : 'bg-black/50 text-gray-400 hover:bg-purple-500/20'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              Marketplace
            </button>
            <button
              onClick={() => setSelectedCategory('ui')}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                selectedCategory === 'ui'
                  ? 'bg-purple-500 text-white'
                  : 'bg-black/50 text-gray-400 hover:bg-purple-500/20'
              }`}
            >
              <Palette className="w-4 h-4" />
              UI/UX
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedPriority('all')}
              className={`px-4 py-2 rounded-lg transition ${
                selectedPriority === 'all'
                  ? 'bg-purple-500 text-white'
                  : 'bg-black/50 text-gray-400 hover:bg-purple-500/20'
              }`}
            >
              All Priorities
            </button>
            <button
              onClick={() => setSelectedPriority('HIGH')}
              className={`px-4 py-2 rounded-lg transition ${
                selectedPriority === 'HIGH'
                  ? 'bg-red-500 text-white'
                  : 'bg-black/50 text-gray-400 hover:bg-red-500/20'
              }`}
            >
              High
            </button>
            <button
              onClick={() => setSelectedPriority('MEDIUM')}
              className={`px-4 py-2 rounded-lg transition ${
                selectedPriority === 'MEDIUM'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-black/50 text-gray-400 hover:bg-yellow-500/20'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => setSelectedPriority('LOW')}
              className={`px-4 py-2 rounded-lg transition ${
                selectedPriority === 'LOW'
                  ? 'bg-green-500 text-white'
                  : 'bg-black/50 text-gray-400 hover:bg-green-500/20'
              }`}
            >
              Low
            </button>
          </div>
        </div>
      </div>

      {/* Task Grid */}
      <div className="container mx-auto px-6 pb-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task, index) => {
            const Icon = categoryIcons[task.category]
            const gradientColor = categoryColors[task.category]
            const priorityColor = priorityColors[task.priority]
            
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition duration-500 -z-10"
                  style={{
                    backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                    '--tw-gradient-from': task.category === 'daw' ? '#a855f7' : 
                                         task.category === 'blockchain' ? '#eab308' :
                                         task.category === 'marketplace' ? '#10b981' : '#3b82f6',
                    '--tw-gradient-to': task.category === 'daw' ? '#ec4899' : 
                                        task.category === 'blockchain' ? '#f97316' :
                                        task.category === 'marketplace' ? '#14b8a6' : '#6366f1',
                  } as React.CSSProperties}
                />
                
                <div className="bg-black/80 backdrop-blur-sm border border-gray-800 hover:border-purple-500/50 rounded-xl p-6 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${gradientColor} bg-opacity-20`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">{task.id}</div>
                        <div className={`text-xs font-semibold ${priorityColor}`}>
                          {task.priority} PRIORITY
                        </div>
                      </div>
                    </div>
                    {task.status === 'open' && (
                      <Zap className="w-5 h-5 text-green-400" />
                    )}
                    {task.status === 'claimed' && (
                      <Clock className="w-5 h-5 text-yellow-400" />
                    )}
                    {task.status === 'completed' && (
                      <CheckCircle className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{task.description}</p>
                  
                  {task.status === 'open' && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-yellow-400">
                        <Coins className="w-4 h-4" />
                        <span className="text-sm font-semibold">10M $BMusic</span>
                      </div>
                      <a
                        href={`https://github.com/bitcoin-apps-suite/bitcoin-music/issues/new?title=${encodeURIComponent(task.id + ': ' + task.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition text-sm font-semibold"
                      >
                        Claim Task
                        <ChevronRight className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                  
                  {task.status === 'claimed' && task.claimedBy && (
                    <div className="text-sm text-yellow-400">
                      In progress by {task.claimedBy}
                    </div>
                  )}
                  
                  {task.status === 'completed' && task.completedBy && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-400">
                        Completed by {task.completedBy}
                      </span>
                      {task.prLink && (
                        <a
                          href={task.prLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        >
                          <GitPullRequest className="w-4 h-4" />
                          View PR
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* How to Contribute Section */}
      <div className="bg-black/50 border-t border-purple-500/30">
        <div className="container mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            How to Earn $BMusic Tokens
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Code className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2">1. Choose a Task</h3>
              <p className="text-gray-400 text-sm">Select an open task that matches your skills</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                <Github className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2">2. Claim on GitHub</h3>
              <p className="text-gray-400 text-sm">Comment on the issue to claim the task</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                <GitPullRequest className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2">3. Submit PR</h3>
              <p className="text-gray-400 text-sm">Complete the task and submit a pull request</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                <Coins className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2">4. Earn Tokens</h3>
              <p className="text-gray-400 text-sm">Receive 10M $BMusic tokens when merged</p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8">
            <h3 className="text-xl font-semibold mb-6 text-center">Get Involved</h3>
            <div className="flex justify-center gap-6 flex-wrap">
              <a
                href="https://github.com/bitcoin-apps-suite/bitcoin-music"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-black/50 hover:bg-purple-500/20 border border-gray-800 hover:border-purple-500/50 rounded-lg transition"
              >
                <Github className="w-5 h-5" />
                GitHub Repo
              </a>
              <a
                href="https://discord.gg/bitcoinmusic"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-black/50 hover:bg-purple-500/20 border border-gray-800 hover:border-purple-500/50 rounded-lg transition"
              >
                <MessageCircle className="w-5 h-5" />
                Join Discord
              </a>
              <a
                href="https://twitter.com/bitcoinmusic"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-black/50 hover:bg-purple-500/20 border border-gray-800 hover:border-purple-500/50 rounded-lg transition"
              >
                <Twitter className="w-5 h-5" />
                Follow Updates
              </a>
              <a
                href="mailto:dev@bitcoin-music.app"
                className="flex items-center gap-2 px-6 py-3 bg-black/50 hover:bg-purple-500/20 border border-gray-800 hover:border-purple-500/50 rounded-lg transition"
              >
                <Mail className="w-5 h-5" />
                Contact Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}