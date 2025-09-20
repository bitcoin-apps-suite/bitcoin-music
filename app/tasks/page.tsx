'use client'

import { useState } from 'react'
import './TasksPage.css'
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
    <div className="tasks-page">
      <div className="tasks-container">
        {/* Hero Section */}
        <section className="tasks-hero">
          <h1><span style={{color: '#ffffff'}}>Bitcoin Music</span> Development <span style={{color: '#ffffff'}}>Tasks</span></h1>
          <p className="tasks-tagline">
            Earn ownership in the future of decentralized music production
          </p>
          <div className="tasks-badge">49 TASKS AVAILABLE</div>
        </section>

        {/* Stats Section */}
        <section className="tasks-section">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Tasks</h3>
              <p className="stat-value">{stats.total}</p>
              <p className="stat-label">Development opportunities</p>
            </div>
            <div className="stat-card">
              <h3>Available</h3>
              <p className="stat-value">{stats.open}</p>
              <p className="stat-label">Open for claiming</p>
            </div>
            <div className="stat-card">
              <h3>In Progress</h3>
              <p className="stat-value">{stats.claimed}</p>
              <p className="stat-label">Currently claimed</p>
            </div>
            <div className="stat-card">
              <h3>Completed</h3>
              <p className="stat-value">{stats.completed}</p>
              <p className="stat-label">Successfully merged</p>
            </div>
          </div>

          {/* Token Info */}
          <div className="token-info-card">
            <div className="token-info-content">
              <div className="token-info-item">
                <Coins className="token-info-icon" />
                <div className="token-info-value">{stats.tokensAvailable.toLocaleString()}</div>
                <div className="token-info-label">$BMusic Tokens Available</div>
              </div>
              <div className="token-info-item">
                <Trophy className="token-info-icon" />
                <div className="token-info-value">{stats.percentageAvailable.toFixed(1)}%</div>
                <div className="token-info-label">Total Equity Available</div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="filters-section">
          <div className="filters-container">
            <div className="filter-group">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              >
                All Categories
              </button>
              <button
                onClick={() => setSelectedCategory('daw')}
                className={`filter-btn ${selectedCategory === 'daw' ? 'active' : ''}`}
              >
                <Music className="w-4 h-4" />
                DAW
              </button>
              <button
                onClick={() => setSelectedCategory('blockchain')}
                className={`filter-btn ${selectedCategory === 'blockchain' ? 'active' : ''}`}
              >
                <Database className="w-4 h-4" />
                Blockchain
              </button>
              <button
                onClick={() => setSelectedCategory('marketplace')}
                className={`filter-btn ${selectedCategory === 'marketplace' ? 'active' : ''}`}
              >
                <ShoppingCart className="w-4 h-4" />
                Marketplace
              </button>
              <button
                onClick={() => setSelectedCategory('ui')}
                className={`filter-btn ${selectedCategory === 'ui' ? 'active' : ''}`}
              >
                <Palette className="w-4 h-4" />
                UI/UX
              </button>
            </div>
            
            <div className="filter-group">
              <button
                onClick={() => setSelectedPriority('all')}
                className={`filter-btn ${selectedPriority === 'all' ? 'active' : ''}`}
              >
                All Priorities
              </button>
              <button
                onClick={() => setSelectedPriority('HIGH')}
                className={`filter-btn priority-high ${selectedPriority === 'HIGH' ? 'active' : ''}`}
              >
                High
              </button>
              <button
                onClick={() => setSelectedPriority('MEDIUM')}
                className={`filter-btn priority-medium ${selectedPriority === 'MEDIUM' ? 'active' : ''}`}
              >
                Medium
              </button>
              <button
                onClick={() => setSelectedPriority('LOW')}
                className={`filter-btn priority-low ${selectedPriority === 'LOW' ? 'active' : ''}`}
              >
                Low
              </button>
            </div>
          </div>
        </section>

        {/* Task Grid Section */}
        <section className="tasks-section">
          <h2>Available Development Tasks</h2>
          <div className="task-grid">
            {filteredTasks.map((task) => {
              const Icon = categoryIcons[task.category]
              
              return (
                <div key={task.id} className="task-card">
                  <div className="task-card-header">
                    <div className="task-category">
                      <div className="task-category-icon">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="task-meta">
                        <div className="task-id">{task.id}</div>
                        <div className={`task-priority priority-${task.priority.toLowerCase()}`}>
                          {task.priority} PRIORITY
                        </div>
                      </div>
                    </div>
                    {task.status === 'open' && (
                      <Zap className="task-status-icon status-open" />
                    )}
                    {task.status === 'claimed' && (
                      <Clock className="task-status-icon status-claimed" />
                    )}
                    {task.status === 'completed' && (
                      <CheckCircle className="task-status-icon status-completed" />
                    )}
                  </div>
                  
                  <h3 className="task-title">{task.title}</h3>
                  <p className="task-description">{task.description}</p>
                  
                  <div className="task-footer">
                    {task.status === 'open' && (
                      <>
                        <div className="task-reward">
                          <Coins className="task-reward-icon" />
                          <span className="task-reward-text">10M $BMusic</span>
                        </div>
                        <a
                          href={`https://github.com/bitcoin-apps-suite/bitcoin-music/issues/new?title=${encodeURIComponent(task.id + ': ' + task.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="task-action-btn"
                        >
                          Claim Task
                          <ChevronRight className="task-action-icon" />
                        </a>
                      </>
                    )}
                    
                    {task.status === 'claimed' && task.claimedBy && (
                      <div className="task-status-text status-claimed-text">
                        In progress by {task.claimedBy}
                      </div>
                    )}
                    
                    {task.status === 'completed' && task.completedBy && (
                      <div className="task-footer">
                        <span className="task-status-text status-completed-text">
                          Completed by {task.completedBy}
                        </span>
                        {task.prLink && (
                          <a
                            href={task.prLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="task-pr-link"
                          >
                            <GitPullRequest className="w-4 h-4" />
                            View PR
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* How to Contribute Section */}
        <section className="contribute-section">
          <h2>How to Earn $BMusic Tokens</h2>
          <div className="contribute-steps">
            <div className="contribute-step">
              <div className="step-icon">
                <Code className="w-8 h-8" />
              </div>
              <h3 className="step-title">1. Choose a Task</h3>
              <p className="step-description">Select an open task that matches your skills</p>
            </div>
            
            <div className="contribute-step">
              <div className="step-icon">
                <Github className="w-8 h-8" />
              </div>
              <h3 className="step-title">2. Claim on GitHub</h3>
              <p className="step-description">Comment on the issue to claim the task</p>
            </div>
            
            <div className="contribute-step">
              <div className="step-icon">
                <GitPullRequest className="w-8 h-8" />
              </div>
              <h3 className="step-title">3. Submit PR</h3>
              <p className="step-description">Complete the task and submit a pull request</p>
            </div>
            
            <div className="contribute-step">
              <div className="step-icon">
                <Coins className="w-8 h-8" />
              </div>
              <h3 className="step-title">4. Earn Tokens</h3>
              <p className="step-description">Receive 10M $BMusic tokens when merged</p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="contact-section">
            <h3 className="contact-title">Get Involved</h3>
            <div className="contact-links">
              <a
                href="https://github.com/bitcoin-apps-suite/bitcoin-music"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                <Github className="contact-icon" />
                GitHub Repo
              </a>
              <a
                href="https://discord.gg/bitcoinmusic"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                <MessageCircle className="contact-icon" />
                Join Discord
              </a>
              <a
                href="https://twitter.com/bitcoinmusic"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                <Twitter className="contact-icon" />
                Follow Updates
              </a>
              <a
                href="mailto:dev@bitcoin-music.app"
                className="contact-link"
              >
                <Mail className="contact-icon" />
                Contact Team
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}