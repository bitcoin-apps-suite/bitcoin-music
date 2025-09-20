'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Music, 
  Store, 
  Library, 
  TrendingUp,
  Plus,
  Upload,
  FolderOpen,
  Clock,
  Star,
  Radio,
  Mic,
  Users,
  Settings,
  HardDrive,
  User,
  LogOut,
  ChevronRight,
  ChevronDown,
  Search
} from 'lucide-react'

interface MusicSidebarProps {
  currentView: string
  onViewChange: (view: 'studio' | 'marketplace' | 'library' | 'exchange') => void
  onAuthRequired: () => void
}

export default function MusicSidebar({ currentView, onViewChange, onAuthRequired }: MusicSidebarProps) {
  const { data: session } = useSession()
  const [expandedSections, setExpandedSections] = useState<string[]>(['studio', 'library'])
  const [searchQuery, setSearchQuery] = useState('')
  const [storageUsed, setStorageUsed] = useState(0)
  const [storageTotal] = useState(10737418240) // 10GB in bytes

  useEffect(() => {
    // Load storage info from localStorage
    const savedProjects = localStorage.getItem('musicProjects')
    if (savedProjects) {
      const size = new Blob([savedProjects]).size
      setStorageUsed(size)
    }
  }, [])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const studioCategories = [
    { icon: <FolderOpen size={16} />, label: 'All Projects', count: 12 },
    { icon: <Clock size={16} />, label: 'Recent', count: 5 },
    { icon: <Mic size={16} />, label: 'Recordings', count: 8 },
    { icon: <Music size={16} />, label: 'Tracks', count: 24 },
    { icon: <Radio size={16} />, label: 'Samples', count: 156 },
    { icon: <Star size={16} />, label: 'NFT Masters', count: 3 }
  ]

  const libraryCategories = [
    { icon: <Music size={16} />, label: 'My Music', count: 89 },
    { icon: <Star size={16} />, label: 'Favorites', count: 23 },
    { icon: <Clock size={16} />, label: 'Recently Added', count: 15 },
    { icon: <Users size={16} />, label: 'Shared with Me', count: 7 }
  ]

  const viewButtons = [
    { id: 'studio', icon: <Music size={18} />, label: 'Studio' },
    { id: 'marketplace', icon: <Store size={18} />, label: 'Marketplace' },
    { id: 'library', icon: <Library size={18} />, label: 'Library' },
    { id: 'exchange', icon: <TrendingUp size={18} />, label: 'Exchange' }
  ]

  return (
    <div style={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      color: '#ffffff',
      fontSize: '13px'
    }}>
      {/* User Profile Section */}
      {session ? (
        <div style={{
          padding: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                {session.user?.name || session.user?.email?.split('@')[0] || 'Producer'}
              </div>
              <div style={{ fontSize: '11px', opacity: 0.6 }}>
                Free Plan
              </div>
            </div>
            <button
              onClick={() => console.log('Settings')}
              style={{
                padding: '4px',
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                opacity: 0.6,
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
            >
              <Settings size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          padding: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <button
            onClick={onAuthRequired}
            style={{
              width: '100%',
              padding: '10px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
              border: 'none',
              borderRadius: '6px',
              color: '#ffffff',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Sign In to Continue
          </button>
        </div>
      )}

      {/* View Mode Buttons */}
      <div style={{
        padding: '12px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px'
      }}>
        {viewButtons.map((view) => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id as any)}
            style={{
              padding: '8px',
              background: currentView === view.id 
                ? 'rgba(139, 92, 246, 0.2)' 
                : 'transparent',
              border: currentView === view.id
                ? '1px solid rgba(139, 92, 246, 0.5)'
                : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              color: currentView === view.id ? '#8b5cf6' : '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: currentView === view.id ? '600' : '400',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (currentView !== view.id) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
              }
            }}
            onMouseLeave={(e) => {
              if (currentView !== view.id) {
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            {view.icon}
            <span>{view.label}</span>
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={{
        padding: '12px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        gap: '8px'
      }}>
        <button
          onClick={() => console.log('New project')}
          style={{
            flex: 1,
            padding: '8px',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '6px',
            color: '#8b5cf6',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)'
            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)'
            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)'
          }}
        >
          <Plus size={16} />
          <span>New Project</span>
        </button>
        <button
          onClick={() => document.getElementById('audio-upload')?.click()}
          style={{
            padding: '8px 12px',
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
          }}
        >
          <Upload size={16} />
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ padding: '12px' }}>
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={16} style={{
            position: 'absolute',
            left: '10px',
            opacity: 0.5
          }} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 8px 8px 32px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              color: '#ffffff',
              fontSize: '12px',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
            }}
          />
        </div>
      </div>

      {/* Content Categories */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0 12px'
      }}>
        {/* Studio Section */}
        {(currentView === 'studio' || currentView === 'library') && (
          <div style={{ marginBottom: '16px' }}>
            <button
              onClick={() => toggleSection('studio')}
              style={{
                width: '100%',
                padding: '8px 0',
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                opacity: 0.7
              }}
            >
              {expandedSections.includes('studio') ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              Studio Projects
            </button>
            {expandedSections.includes('studio') && (
              <div style={{ marginTop: '8px' }}>
                {studioCategories.map((cat, index) => (
                  <button
                    key={index}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      background: 'transparent',
                      border: 'none',
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      borderRadius: '4px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {cat.icon}
                      <span>{cat.label}</span>
                    </div>
                    <span style={{ opacity: 0.5, fontSize: '11px' }}>{cat.count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Library Section */}
        {currentView === 'library' && (
          <div style={{ marginBottom: '16px' }}>
            <button
              onClick={() => toggleSection('library')}
              style={{
                width: '100%',
                padding: '8px 0',
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                opacity: 0.7
              }}
            >
              {expandedSections.includes('library') ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              Music Library
            </button>
            {expandedSections.includes('library') && (
              <div style={{ marginTop: '8px' }}>
                {libraryCategories.map((cat, index) => (
                  <button
                    key={index}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      background: 'transparent',
                      border: 'none',
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      borderRadius: '4px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {cat.icon}
                      <span>{cat.label}</span>
                    </div>
                    <span style={{ opacity: 0.5, fontSize: '11px' }}>{cat.count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Storage Info */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        fontSize: '11px'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HardDrive size={12} />
            <span>Storage</span>
          </div>
          <span style={{ opacity: 0.6 }}>
            {formatBytes(storageUsed)} / {formatBytes(storageTotal)}
          </span>
        </div>
        <div style={{
          height: '4px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${(storageUsed / storageTotal) * 100}%`,
            background: 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%)',
            transition: 'width 0.3s'
          }} />
        </div>
      </div>

      {/* Hidden file input */}
      <input
        id="audio-upload"
        type="file"
        accept="audio/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            console.log('Uploading:', file.name)
          }
        }}
      />
    </div>
  )
}