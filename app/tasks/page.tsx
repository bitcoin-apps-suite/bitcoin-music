'use client'

import { useState, useEffect } from 'react'
import { Terminal, Clock, Tag, GitBranch, ExternalLink, Star, ChevronDown } from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  estimatedHours: number
  reward: string
  skills: string[]
  githubIssueNumber: number
  githubIssueUrl: string
  status: 'open' | 'assigned' | 'completed'
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [expandedTask, setExpandedTask] = useState<string | null>(null)

  // Sample tasks - in production, these would come from GitHub issues
  const sampleTasks: Task[] = [
    {
      id: '1',
      title: 'Implement Audio Waveform Visualization',
      description: 'Create a React component that visualizes audio waveforms in real-time using Web Audio API',
      difficulty: 'Intermediate',
      category: 'Frontend',
      estimatedHours: 12,
      reward: '3,000 BMUSIC',
      skills: ['React', 'TypeScript', 'Web Audio API', 'Canvas'],
      githubIssueNumber: 1,
      githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-music/issues/1',
      status: 'open'
    },
    {
      id: '2',
      title: 'Add MIDI Import/Export Functionality',
      description: 'Implement the ability to import and export MIDI files in the music studio',
      difficulty: 'Advanced',
      category: 'Audio',
      estimatedHours: 20,
      reward: '5,000 BMUSIC',
      skills: ['MIDI', 'File Processing', 'TypeScript', 'Audio Programming'],
      githubIssueNumber: 2,
      githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-music/issues/2',
      status: 'open'
    },
    {
      id: '3',
      title: 'Create Documentation Pages',
      description: 'Write comprehensive documentation for the Bitcoin Music API and SDK',
      difficulty: 'Beginner',
      category: 'Documentation',
      estimatedHours: 8,
      reward: '1,500 BMUSIC',
      skills: ['Technical Writing', 'Markdown', 'API Documentation'],
      githubIssueNumber: 3,
      githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-music/issues/3',
      status: 'open'
    },
    {
      id: '4',
      title: 'Implement BSV Payment Integration',
      description: 'Integrate BSV blockchain for music NFT purchases and royalty payments',
      difficulty: 'Advanced',
      category: 'Blockchain',
      estimatedHours: 30,
      reward: '10,000 BMUSIC',
      skills: ['BSV', 'Blockchain', 'Smart Contracts', 'TypeScript'],
      githubIssueNumber: 4,
      githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-music/issues/4',
      status: 'assigned'
    },
    {
      id: '5',
      title: 'Design Music Player UI Components',
      description: 'Create reusable UI components for the music player interface',
      difficulty: 'Beginner',
      category: 'Design',
      estimatedHours: 6,
      reward: '1,000 BMUSIC',
      skills: ['React', 'CSS', 'UI/UX Design'],
      githubIssueNumber: 5,
      githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-music/issues/5',
      status: 'open'
    },
    {
      id: '6',
      title: 'Optimize Audio Processing Performance',
      description: 'Improve the performance of real-time audio processing in the DAW',
      difficulty: 'Advanced',
      category: 'Performance',
      estimatedHours: 25,
      reward: '7,500 BMUSIC',
      skills: ['Web Audio API', 'Performance Optimization', 'Profiling', 'TypeScript'],
      githubIssueNumber: 6,
      githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-music/issues/6',
      status: 'open'
    }
  ]

  useEffect(() => {
    // Simulate loading tasks
    setTimeout(() => {
      setTasks(sampleTasks)
      setLoading(false)
    }, 1000)
  }, [])

  const categories = ['all', 'Frontend', 'Backend', 'Audio', 'Blockchain', 'Documentation', 'Design', 'Performance']
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced']

  const filteredTasks = tasks.filter(task => {
    const categoryMatch = selectedCategory === 'all' || task.category === selectedCategory
    const difficultyMatch = selectedDifficulty === 'all' || task.difficulty === selectedDifficulty
    return categoryMatch && difficultyMatch
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#00C851'
      case 'Intermediate': return '#ffbb33'
      case 'Advanced': return '#ff4444'
      default: return '#666'
    }
  }

  const getDifficultyStars = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 1
      case 'Intermediate': return 2
      case 'Advanced': return 3
      default: return 1
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
            Developer Tasks
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.1rem' }}>
            Pick a task that matches your skills and start contributing
          </p>
        </div>

        {/* Filters */}
        <div style={{ 
          display: 'flex',
          gap: '20px',
          marginBottom: '40px',
          flexWrap: 'wrap'
        }}>
          <div>
            <label style={{ 
              display: 'block',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '14px',
              marginBottom: '8px'
            }}>
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '10px 40px 10px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '14px',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center',
                backgroundSize: '20px'
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat} style={{ background: '#1a1a1a' }}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '14px',
              marginBottom: '8px'
            }}>
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              style={{
                padding: '10px 40px 10px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '14px',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center',
                backgroundSize: '20px'
              }}
            >
              {difficulties.map(diff => (
                <option key={diff} value={diff} style={{ background: '#1a1a1a' }}>
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tasks List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255, 255, 255, 0.6)' }}>
            Loading tasks...
          </div>
        ) : filteredTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255, 255, 255, 0.6)' }}>
            No tasks found matching your criteria
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredTasks.map(task => (
              <div
                key={task.id}
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}
              >
                <div
                  onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                  style={{
                    padding: '24px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h3 style={{ 
                          color: '#ffffff',
                          fontSize: '1.2rem',
                          margin: 0
                        }}>
                          {task.title}
                        </h3>
                        <div style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          background: getDifficultyColor(task.difficulty),
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '600',
                          color: '#ffffff'
                        }}>
                          {task.difficulty}
                        </div>
                        {task.status === 'assigned' && (
                          <div style={{
                            display: 'inline-block',
                            padding: '4px 8px',
                            background: '#33b5e5',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '600',
                            color: '#ffffff'
                          }}>
                            Assigned
                          </div>
                        )}
                      </div>
                      
                      <p style={{ 
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '14px',
                        marginBottom: '12px'
                      }}>
                        {task.description}
                      </p>

                      <div style={{ 
                        display: 'flex',
                        gap: '24px',
                        fontSize: '13px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Tag size={14} style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                          <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{task.category}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={14} style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                          <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{task.estimatedHours} hours</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: '#ffbb33', fontWeight: '600' }}>{task.reward}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(3)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill={i < getDifficultyStars(task.difficulty) ? '#ffbb33' : 'transparent'}
                            style={{ 
                              color: i < getDifficultyStars(task.difficulty) ? '#ffbb33' : 'rgba(255, 255, 255, 0.2)'
                            }}
                          />
                        ))}
                      </div>
                      <ChevronDown 
                        size={20} 
                        style={{ 
                          color: 'rgba(255, 255, 255, 0.5)',
                          transform: expandedTask === task.id ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {expandedTask === task.id && (
                  <div style={{
                    padding: '0 24px 24px 24px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <div style={{ marginTop: '20px' }}>
                      <h4 style={{ 
                        color: '#8b5cf6',
                        fontSize: '14px',
                        marginBottom: '12px'
                      }}>
                        Required Skills
                      </h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {task.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            style={{
                              padding: '6px 12px',
                              background: 'rgba(139, 92, 246, 0.1)',
                              border: '1px solid rgba(139, 92, 246, 0.3)',
                              borderRadius: '16px',
                              fontSize: '13px',
                              color: 'rgba(255, 255, 255, 0.8)'
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '24px'
                    }}>
                      <a
                        href={task.githubIssueUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 20px',
                          background: task.status === 'assigned' 
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                          borderRadius: '8px',
                          color: '#ffffff',
                          textDecoration: 'none',
                          fontWeight: '600',
                          opacity: task.status === 'assigned' ? 0.5 : 1,
                          cursor: task.status === 'assigned' ? 'not-allowed' : 'pointer'
                        }}
                        onClick={(e) => {
                          if (task.status === 'assigned') {
                            e.preventDefault()
                          }
                        }}
                      >
                        <GitBranch size={18} />
                        {task.status === 'assigned' ? 'Already Assigned' : 'Start Task'}
                        <ExternalLink size={14} />
                      </a>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '13px'
                      }}>
                        <Terminal size={16} />
                        Issue #{task.githubIssueNumber}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div style={{
          marginTop: '60px',
          padding: '30px',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '12px'
        }}>
          <h3 style={{ color: '#ffffff', marginBottom: '16px' }}>How to Get Started</h3>
          <ol style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.8', marginLeft: '20px' }}>
            <li>Browse through the available tasks and find one that matches your skillset</li>
            <li>Click on "Start Task" to view the issue on GitHub</li>
            <li>Comment on the GitHub issue to claim the task</li>
            <li>Fork the repository and create a new branch for your work</li>
            <li>Submit a pull request when you're done</li>
            <li>Receive BMUSIC tokens upon successful merge</li>
          </ol>
        </div>
      </div>
    </div>
  )
}