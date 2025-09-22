'use client'

import { useState, useEffect } from 'react'
import { FileText, Clock, DollarSign, GitBranch, ExternalLink, Users, CheckCircle, AlertCircle } from 'lucide-react'

interface GitHubIssue {
  number: number
  title: string
  body: string
  html_url: string
  state: string
  labels: Array<{ name: string; color: string }>
  assignee?: { login: string; avatar_url: string }
  created_at: string
  updated_at: string
}

interface Contract {
  id: string
  githubIssueNumber: number
  githubIssueUrl: string
  title: string
  description: string
  reward: string
  estimatedHours: number
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  status: 'available' | 'claimed' | 'in_progress' | 'submitted' | 'completed'
  category: string
  skills: string[]
  deliverables: string[]
  assignee?: {
    githubUsername: string
    avatar_url?: string
  }
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [filter, setFilter] = useState<'all' | 'available' | 'in_progress' | 'completed'>('all')

  useEffect(() => {
    fetchContracts()
  }, [])

  const fetchContracts = async () => {
    try {
      const response = await fetch('https://api.github.com/repos/bitcoin-apps-suite/bitcoin-music/issues')
      const issues: GitHubIssue[] = await response.json()
      
      const contractsData = issues.map((issue) => parseIssueToContract(issue))
      setContracts(contractsData)
    } catch (error) {
      console.error('Error fetching contracts:', error)
    } finally {
      setLoading(false)
    }
  }

  const parseIssueToContract = (issue: GitHubIssue): Contract => {
    const body = issue.body || ''
    
    // Extract metadata from issue body
    const priorityMatch = body.match(/\*\*Priority:\*\*\s*(Critical|High|Medium|Low)/i)
    const hoursMatch = body.match(/\*\*Estimated Hours:\*\*\s*(\d+)/i)
    const rewardMatch = body.match(/\*\*Token Reward:\*\*\s*([\d,]+)\s*BMUSIC/i)
    const categoryMatch = body.match(/\*\*Category:\*\*\s*([^\n]+)/i)
    
    // Extract description
    const descMatch = body.match(/##\s*(?:📋\s*)?Description\s*\n([\s\S]*?)(?=##|$)/i)
    
    // Extract skills from requirements
    const requirementsMatch = body.match(/##\s*(?:🎯\s*)?Requirements\s*\n([\s\S]*?)(?=##|$)/i)
    const skills = requirementsMatch 
      ? requirementsMatch[1].split('\n')
          .filter(line => line.trim().startsWith('-'))
          .map(line => line.replace(/^-\s*/, '').trim())
      : []
    
    // Extract deliverables
    const deliverablesMatch = body.match(/##\s*(?:✅\s*)?Acceptance Criteria\s*\n([\s\S]*?)(?=##|$)/i)
    const deliverables = deliverablesMatch
      ? deliverablesMatch[1].split('\n')
          .filter(line => line.trim().startsWith('-'))
          .map(line => line.replace(/^-\s*/, '').trim())
      : []
    
    // Determine status
    let status: Contract['status'] = 'available'
    if (issue.state === 'closed') {
      status = 'completed'
    } else if (issue.assignee) {
      status = 'in_progress'
    }
    
    return {
      id: issue.number.toString(),
      githubIssueNumber: issue.number,
      githubIssueUrl: issue.html_url,
      title: issue.title,
      description: descMatch ? descMatch[1].trim() : '',
      reward: rewardMatch ? `${rewardMatch[1]} BMUSIC` : '1,000 BMUSIC',
      estimatedHours: hoursMatch ? parseInt(hoursMatch[1]) : 8,
      priority: (priorityMatch ? priorityMatch[1] : 'Medium') as Contract['priority'],
      status,
      category: categoryMatch ? categoryMatch[1] : 'Development',
      skills,
      deliverables,
      assignee: issue.assignee ? {
        githubUsername: issue.assignee.login,
        avatar_url: issue.assignee.avatar_url
      } : undefined
    }
  }

  const filteredContracts = contracts.filter(contract => {
    if (filter === 'all') return true
    if (filter === 'available') return contract.status === 'available'
    if (filter === 'in_progress') return contract.status === 'in_progress' || contract.status === 'submitted'
    if (filter === 'completed') return contract.status === 'completed'
    return true
  })

  const stats = {
    available: contracts.filter(c => c.status === 'available').length,
    inProgress: contracts.filter(c => c.status === 'in_progress').length,
    underReview: contracts.filter(c => c.status === 'submitted').length,
    completed: contracts.filter(c => c.status === 'completed').length,
    totalRewards: contracts.reduce((sum, c) => {
      const amount = parseInt(c.reward.replace(/[^0-9]/g, '')) || 0
      return sum + amount
    }, 0)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return '#ff4444'
      case 'High': return '#ff8800'
      case 'Medium': return '#ffbb33'
      case 'Low': return '#00C851'
      default: return '#666'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#00C851'
      case 'claimed': return '#ffbb33'
      case 'in_progress': return '#33b5e5'
      case 'submitted': return '#ff8800'
      case 'completed': return '#666'
      default: return '#999'
    }
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
            Developer Contracts
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.1rem' }}>
            Contribute to Bitcoin Music and earn BMUSIC tokens
          </p>
        </div>

        {/* Stats Dashboard */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <FileText size={20} style={{ color: '#8b5cf6' }} />
              <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Available</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '600', color: '#ffffff' }}>{stats.available}</div>
          </div>

          <div style={{ 
            background: 'linear-gradient(135deg, rgba(51, 181, 229, 0.1), rgba(51, 181, 229, 0.05))',
            border: '1px solid rgba(51, 181, 229, 0.3)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Clock size={20} style={{ color: '#33b5e5' }} />
              <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>In Progress</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '600', color: '#ffffff' }}>{stats.inProgress}</div>
          </div>

          <div style={{ 
            background: 'linear-gradient(135deg, rgba(255, 136, 0, 0.1), rgba(255, 136, 0, 0.05))',
            border: '1px solid rgba(255, 136, 0, 0.3)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <AlertCircle size={20} style={{ color: '#ff8800' }} />
              <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Under Review</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '600', color: '#ffffff' }}>{stats.underReview}</div>
          </div>

          <div style={{ 
            background: 'linear-gradient(135deg, rgba(0, 200, 81, 0.1), rgba(0, 200, 81, 0.05))',
            border: '1px solid rgba(0, 200, 81, 0.3)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <CheckCircle size={20} style={{ color: '#00C851' }} />
              <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Completed</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '600', color: '#ffffff' }}>{stats.completed}</div>
          </div>

          <div style={{ 
            background: 'linear-gradient(135deg, rgba(255, 187, 51, 0.1), rgba(255, 187, 51, 0.05))',
            border: '1px solid rgba(255, 187, 51, 0.3)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <DollarSign size={20} style={{ color: '#ffbb33' }} />
              <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Total Rewards</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#ffffff' }}>
              {stats.totalRewards.toLocaleString()} BMUSIC
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '12px',
          marginBottom: '30px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '10px'
        }}>
          {(['all', 'available', 'in_progress', 'completed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: '8px 16px',
                background: filter === tab 
                  ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                  : 'transparent',
                border: '1px solid',
                borderColor: filter === tab ? '#8b5cf6' : 'rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: filter === tab ? '600' : '400',
                textTransform: 'capitalize'
              }}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Contracts Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255, 255, 255, 0.6)' }}>
            Loading contracts...
          </div>
        ) : filteredContracts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255, 255, 255, 0.6)' }}>
            No contracts found
          </div>
        ) : (
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '20px'
          }}>
            {filteredContracts.map(contract => (
              <div
                key={contract.id}
                onClick={() => setSelectedContract(contract)}
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* Priority Badge */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '4px 8px',
                  background: getPriorityColor(contract.priority),
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#ffffff'
                }}>
                  {contract.priority}
                </div>

                {/* Contract Content */}
                <h3 style={{ 
                  color: '#ffffff', 
                  fontSize: '1.2rem',
                  marginBottom: '12px',
                  paddingRight: '80px'
                }}>
                  {contract.title}
                </h3>

                <p style={{ 
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '14px',
                  marginBottom: '16px',
                  lineHeight: '1.5',
                  height: '60px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {contract.description || 'No description available'}
                </p>

                {/* Contract Meta */}
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '13px' }}>
                      <DollarSign size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      Reward
                    </span>
                    <span style={{ color: '#ffbb33', fontWeight: '600', fontSize: '14px' }}>
                      {contract.reward}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '13px' }}>
                      <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      Est. Time
                    </span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                      {contract.estimatedHours} hours
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '13px' }}>
                      Category
                    </span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                      {contract.category}
                    </span>
                  </div>
                </div>

                {/* Status & Action */}
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    background: getStatusColor(contract.status),
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#ffffff',
                    textTransform: 'capitalize'
                  }}>
                    {contract.status.replace('_', ' ')}
                  </div>

                  {contract.assignee && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {contract.assignee.avatar_url && (
                        <img 
                          src={contract.assignee.avatar_url}
                          alt={contract.assignee.githubUsername}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%'
                          }}
                        />
                      )}
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px' }}>
                        {contract.assignee.githubUsername}
                      </span>
                    </div>
                  )}
                </div>

                {/* GitHub Link */}
                <a
                  href={contract.githubIssueUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '12px',
                    color: '#8b5cf6',
                    fontSize: '13px',
                    textDecoration: 'none'
                  }}
                >
                  <GitBranch size={14} />
                  View on GitHub
                  <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Contract Modal */}
        {selectedContract && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10002,
            padding: '20px'
          }}
          onClick={() => setSelectedContract(null)}>
            <div style={{
              background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              padding: '32px'
            }}
            onClick={(e) => e.stopPropagation()}>
              <h2 style={{ color: '#ffffff', marginBottom: '20px' }}>
                {selectedContract.title}
              </h2>
              
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ color: '#8b5cf6', fontSize: '14px', marginBottom: '8px' }}>Description</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
                  {selectedContract.description || 'No description available'}
                </p>
              </div>

              {selectedContract.skills.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ color: '#8b5cf6', fontSize: '14px', marginBottom: '8px' }}>Required Skills</h3>
                  <ul style={{ color: 'rgba(255, 255, 255, 0.8)', marginLeft: '20px' }}>
                    {selectedContract.skills.map((skill, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{skill}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedContract.deliverables.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ color: '#8b5cf6', fontSize: '14px', marginBottom: '8px' }}>Deliverables</h3>
                  <ul style={{ color: 'rgba(255, 255, 255, 0.8)', marginLeft: '20px' }}>
                    {selectedContract.deliverables.map((deliverable, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{deliverable}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '32px'
              }}>
                <a
                  href={selectedContract.githubIssueUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}
                >
                  <GitBranch size={18} />
                  Claim on GitHub
                </a>

                <button
                  onClick={() => setSelectedContract(null)}
                  style={{
                    padding: '10px 20px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}