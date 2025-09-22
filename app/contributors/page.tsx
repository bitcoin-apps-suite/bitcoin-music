'use client'

import { useState, useEffect } from 'react'
import { Github, Users, Award, DollarSign, GitPullRequest, Code, Star, Zap } from 'lucide-react'

interface Contributor {
  login: string
  avatar_url: string
  contributions: number
  html_url: string
}

interface CompletedTask {
  task: string
  allocation: number
  category: string
}

export default function ContributorsPage() {
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [activeTab, setActiveTab] = useState<'contributions' | 'tokenomics' | 'leaderboard'>('contributions')
  const [loading, setLoading] = useState(true)

  // Completed tasks by @b0ase - total 7.5% allocation for initial platform build
  const completedTasksByFounder: CompletedTask[] = [
    { task: 'Initial Next.js app setup & configuration', allocation: 0.2, category: 'Infrastructure' },
    { task: 'Music studio DAW interface foundation', allocation: 0.5, category: 'Core Feature' },
    { task: 'HandCash authentication integration', allocation: 0.4, category: 'Authentication' },
    { task: 'BSV blockchain storage service setup', allocation: 0.3, category: 'Blockchain' },
    { task: 'Music NFT tokenization system design', allocation: 0.4, category: 'NFT' },
    { task: 'Music marketplace foundation', allocation: 0.3, category: 'Marketplace' },
    { task: 'Taskbar navigation system', allocation: 0.2, category: 'UI/UX' },
    { task: 'GitHub OAuth authentication', allocation: 0.3, category: 'Authentication' },
    { task: 'Developer hub & contracts system', allocation: 0.6, category: 'Developer Tools' },
    { task: 'Music versioning with Ordinals concept', allocation: 0.4, category: 'Blockchain' },
    { task: 'Landing page & features marketing', allocation: 0.2, category: 'Marketing' },
    { task: 'Token page & BMUSIC tokenomics', allocation: 0.3, category: 'Tokenomics' },
    { task: 'Contributors page & task system', allocation: 0.5, category: 'Developer Tools' },
    { task: 'Smart contract integration planning', allocation: 0.4, category: 'Blockchain' },
    { task: 'Proof of concept banner', allocation: 0.1, category: 'UI/UX' },
    { task: 'Mobile responsive design', allocation: 0.3, category: 'UI/UX' },
    { task: 'Audio file handling system', allocation: 0.3, category: 'Core Feature' },
    { task: 'Storage options (IPFS, Cloud) setup', allocation: 0.4, category: 'Infrastructure' },
    { task: 'Social media integrations planning', allocation: 0.3, category: 'Social' },
    { task: 'API documentation structure', allocation: 0.2, category: 'Documentation' },
    { task: 'Testing & initial bug fixes', allocation: 0.5, category: 'Quality' },
    { task: 'Vercel deployment configuration', allocation: 0.3, category: 'Infrastructure' }
  ]

  const TOTAL_TOKENS = 1000000000 // 1 billion BMUSIC tokens
  const FOUNDER_ALLOCATION = 7.5 // 7.5% for initial build
  const AVAILABLE_FOR_TASKS = 67.5 // Additional 67.5% available for development tasks
  const RESERVED_FOR_OPERATIONS = 25 // 25% reserved for operations, marketing, liquidity

  useEffect(() => {
    fetchContributors()
  }, [])

  const fetchContributors = async () => {
    try {
      const response = await fetch('https://api.github.com/repos/bitcoin-apps-suite/bitcoin-music/contributors')
      const data = await response.json()
      setContributors(data)
    } catch (error) {
      console.error('Error fetching contributors:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateTokenAllocation = () => {
    const founderTokens = (FOUNDER_ALLOCATION / 100) * TOTAL_TOKENS
    const availableTokens = (AVAILABLE_FOR_TASKS / 100) * TOTAL_TOKENS
    const reservedTokens = (RESERVED_FOR_OPERATIONS / 100) * TOTAL_TOKENS
    
    return {
      founder: founderTokens,
      available: availableTokens,
      reserved: reservedTokens,
      distributed: founderTokens, // Only founder allocation distributed so far
      remaining: availableTokens
    }
  }

  const tokenStats = calculateTokenAllocation()

  const formatTokenAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`
    }
    return amount.toLocaleString()
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Infrastructure': '#3b82f6',
      'Core Feature': '#8b5cf6',
      'Authentication': '#10b981',
      'Blockchain': '#f59e0b',
      'NFT': '#ef4444',
      'Marketplace': '#ec4899',
      'UI/UX': '#06b6d4',
      'Developer Tools': '#6366f1',
      'Marketing': '#84cc16',
      'Tokenomics': '#f97316',
      'Social': '#a855f7',
      'Documentation': '#14b8a6',
      'Quality': '#64748b'
    }
    return colors[category] || '#666'
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
      paddingTop: '60px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '300', 
            color: '#ffffff',
            marginBottom: '10px'
          }}>
            Contributors & Token Distribution
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.1rem' }}>
            Building Bitcoin Music together with BMUSIC token incentives
          </p>
          <p style={{ 
            color: '#8b5cf6', 
            fontSize: '0.9rem', 
            marginTop: '10px',
            fontWeight: '600',
            letterSpacing: '0.5px'
          }}>
            The Bitcoin Corporation LTD. • UK Company No. 16735102
          </p>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '12px',
          marginBottom: '40px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '10px'
        }}>
          {(['contributions', 'tokenomics', 'leaderboard'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 16px',
                background: activeTab === tab 
                  ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                  : 'transparent',
                border: '1px solid',
                borderColor: activeTab === tab ? '#8b5cf6' : 'rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === tab ? '600' : '400',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Contributions Tab */}
        {activeTab === 'contributions' && (
          <div>
            {/* Founder Contributions */}
            <div style={{ marginBottom: '60px' }}>
              <h2 style={{ 
                color: '#8b5cf6',
                fontSize: '1.8rem',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Award size={28} />
                Initial Platform Build
              </h2>
              
              <div style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px'
              }}>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '20px'
                }}>
                  <img 
                    src="https://avatars.githubusercontent.com/u/4478411?v=4"
                    alt="b0ase"
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      border: '2px solid #8b5cf6'
                    }}
                  />
                  <div>
                    <h3 style={{ color: '#ffffff', margin: 0, fontSize: '1.2rem' }}>@b0ase</h3>
                    <p style={{ color: 'rgba(255, 255, 255, 0.6)', margin: '4px 0' }}>Founder & Lead Developer</p>
                    <div style={{ 
                      display: 'flex', 
                      gap: '16px',
                      fontSize: '14px',
                      marginTop: '8px'
                    }}>
                      <span style={{ color: '#8b5cf6' }}>
                        {formatTokenAmount(tokenStats.founder)} BMUSIC ({FOUNDER_ALLOCATION}%)
                      </span>
                      <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        22 commits
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '24px' }}>
                  <h4 style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px' }}>
                    Completed Tasks ({completedTasksByFounder.length} items)
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {completedTasksByFounder.map((item, idx) => (
                      <div 
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px',
                          background: 'rgba(0, 0, 0, 0.2)',
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 255, 255, 0.05)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            padding: '4px 8px',
                            background: getCategoryColor(item.category),
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: '600',
                            color: '#ffffff',
                            opacity: 0.9
                          }}>
                            {item.category}
                          </div>
                          <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                            {item.task}
                          </span>
                        </div>
                        <span style={{ 
                          color: '#ffbb33',
                          fontWeight: '600',
                          fontSize: '13px'
                        }}>
                          {item.allocation}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* GitHub Contributors */}
            <div>
              <h2 style={{ 
                color: '#8b5cf6',
                fontSize: '1.8rem',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Github size={28} />
                GitHub Contributors
              </h2>
              
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255, 255, 255, 0.6)' }}>
                  Loading contributors...
                </div>
              ) : (
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '20px'
                }}>
                  {contributors.map(contributor => (
                    <div
                      key={contributor.login}
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.2)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <img 
                        src={contributor.avatar_url}
                        alt={contributor.login}
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <a 
                          href={contributor.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#ffffff',
                            textDecoration: 'none',
                            fontSize: '16px',
                            fontWeight: '600'
                          }}
                        >
                          @{contributor.login}
                        </a>
                        <div style={{ 
                          display: 'flex',
                          gap: '12px',
                          marginTop: '8px',
                          fontSize: '13px',
                          color: 'rgba(255, 255, 255, 0.6)'
                        }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <GitPullRequest size={14} />
                            {contributor.contributions} commits
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tokenomics Tab */}
        {activeTab === 'tokenomics' && (
          <div>
            <h2 style={{ 
              color: '#8b5cf6',
              fontSize: '1.8rem',
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <DollarSign size={28} />
              BMUSIC Token Distribution
            </h2>

            {/* Token Stats */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '40px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '12px',
                padding: '24px'
              }}>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '8px' }}>
                  Total Supply
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '600', color: '#ffffff' }}>
                  {formatTokenAmount(TOTAL_TOKENS)}
                </div>
                <div style={{ fontSize: '12px', color: '#8b5cf6', marginTop: '4px' }}>
                  BMUSIC Tokens
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                padding: '24px'
              }}>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '8px' }}>
                  Distributed
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '600', color: '#ffffff' }}>
                  {formatTokenAmount(tokenStats.distributed)}
                </div>
                <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>
                  {FOUNDER_ALLOCATION}% Allocated
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(251, 191, 36, 0.05))',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                borderRadius: '12px',
                padding: '24px'
              }}>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '8px' }}>
                  Available for Tasks
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '600', color: '#ffffff' }}>
                  {formatTokenAmount(tokenStats.available)}
                </div>
                <div style={{ fontSize: '12px', color: '#fbbf24', marginTop: '4px' }}>
                  {AVAILABLE_FOR_TASKS}% for Development
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                padding: '24px'
              }}>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '8px' }}>
                  Reserved
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '600', color: '#ffffff' }}>
                  {formatTokenAmount(tokenStats.reserved)}
                </div>
                <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
                  {RESERVED_FOR_OPERATIONS}% Operations
                </div>
              </div>
            </div>

            {/* Distribution Breakdown */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '32px'
            }}>
              <h3 style={{ color: '#ffffff', marginBottom: '24px' }}>Distribution Breakdown</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Founder Allocation */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '200px', color: 'rgba(255, 255, 255, 0.8)' }}>
                    Initial Platform Build
                  </div>
                  <div style={{ flex: 1, height: '32px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${FOUNDER_ALLOCATION}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #8b5cf6, #7c3aed)',
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: '12px'
                    }}>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>
                        {FOUNDER_ALLOCATION}%
                      </span>
                    </div>
                  </div>
                  <div style={{ width: '120px', textAlign: 'right', color: '#8b5cf6', fontWeight: '600' }}>
                    {formatTokenAmount(tokenStats.founder)}
                  </div>
                </div>

                {/* Development Tasks */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '200px', color: 'rgba(255, 255, 255, 0.8)' }}>
                    Development Tasks
                  </div>
                  <div style={{ flex: 1, height: '32px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${AVAILABLE_FOR_TASKS}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: '12px'
                    }}>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>
                        {AVAILABLE_FOR_TASKS}%
                      </span>
                    </div>
                  </div>
                  <div style={{ width: '120px', textAlign: 'right', color: '#fbbf24', fontWeight: '600' }}>
                    {formatTokenAmount(tokenStats.available)}
                  </div>
                </div>

                {/* Reserved */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '200px', color: 'rgba(255, 255, 255, 0.8)' }}>
                    Operations & Liquidity
                  </div>
                  <div style={{ flex: 1, height: '32px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${RESERVED_FOR_OPERATIONS}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #ef4444, #dc2626)',
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: '12px'
                    }}>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#ffffff' }}>
                        {RESERVED_FOR_OPERATIONS}%
                      </span>
                    </div>
                  </div>
                  <div style={{ width: '120px', textAlign: 'right', color: '#ef4444', fontWeight: '600' }}>
                    {formatTokenAmount(tokenStats.reserved)}
                  </div>
                </div>
              </div>
            </div>

            {/* Token Utility */}
            <div style={{ marginTop: '40px' }}>
              <h3 style={{ color: '#ffffff', marginBottom: '24px' }}>BMUSIC Token Utility</h3>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px'
              }}>
                {[
                  { icon: <Zap size={24} />, title: 'Task Rewards', desc: 'Earn BMUSIC for completing development tasks' },
                  { icon: <Star size={24} />, title: 'Music Shares', desc: 'Buy shares in music NFTs with BMUSIC' },
                  { icon: <DollarSign size={24} />, title: 'Revenue Dividends', desc: 'Receive dividends from music streaming revenue' },
                  { icon: <Users size={24} />, title: 'Governance', desc: 'Vote on platform decisions and features' },
                  { icon: <Code size={24} />, title: 'API Access', desc: 'Use BMUSIC for premium API features' },
                  { icon: <Award size={24} />, title: 'Artist Rewards', desc: 'Artists earn BMUSIC from plays and sales' }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '20px',
                      display: 'flex',
                      gap: '16px'
                    }}
                  >
                    <div style={{ color: '#8b5cf6' }}>{item.icon}</div>
                    <div>
                      <h4 style={{ color: '#ffffff', margin: '0 0 8px 0', fontSize: '16px' }}>
                        {item.title}
                      </h4>
                      <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px', margin: 0 }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div>
            <h2 style={{ 
              color: '#8b5cf6',
              fontSize: '1.8rem',
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Award size={28} />
              Developer Leaderboard
            </h2>

            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255, 255, 255, 0.6)', fontWeight: '600' }}>
                      Rank
                    </th>
                    <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255, 255, 255, 0.6)', fontWeight: '600' }}>
                      Developer
                    </th>
                    <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255, 255, 255, 0.6)', fontWeight: '600' }}>
                      Tasks Completed
                    </th>
                    <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255, 255, 255, 0.6)', fontWeight: '600' }}>
                      BMUSIC Earned
                    </th>
                    <th style={{ padding: '16px', textAlign: 'left', color: 'rgba(255, 255, 255, 0.6)', fontWeight: '600' }}>
                      % of Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '20px 16px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        color: '#000'
                      }}>
                        1
                      </div>
                    </td>
                    <td style={{ padding: '20px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src="https://avatars.githubusercontent.com/u/4478411?v=4"
                          alt="b0ase"
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: '2px solid #ffd700'
                          }}
                        />
                        <div>
                          <div style={{ color: '#ffffff', fontWeight: '600' }}>@b0ase</div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px' }}>Founder</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '20px 16px', color: 'rgba(255, 255, 255, 0.8)' }}>
                      {completedTasksByFounder.length}
                    </td>
                    <td style={{ padding: '20px 16px', color: '#ffd700', fontWeight: '600' }}>
                      {formatTokenAmount(tokenStats.founder)}
                    </td>
                    <td style={{ padding: '20px 16px', color: 'rgba(255, 255, 255, 0.6)' }}>
                      {FOUNDER_ALLOCATION}%
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={5} style={{ 
                      padding: '40px', 
                      textAlign: 'center',
                      color: 'rgba(255, 255, 255, 0.5)'
                    }}>
                      More contributors will appear here as tasks are completed
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Call to Action */}
            <div style={{
              marginTop: '40px',
              padding: '32px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#ffffff', marginBottom: '16px' }}>
                Start Contributing Today
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '24px' }}>
                Join the Bitcoin Music development team and earn BMUSIC tokens for your contributions
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <a
                  href="/tasks"
                  style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}
                >
                  View Available Tasks
                </a>
                <a
                  href="/contracts"
                  style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}
                >
                  Browse Contracts
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}