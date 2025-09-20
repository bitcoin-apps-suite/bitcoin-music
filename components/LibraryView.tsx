'use client'

import { useState } from 'react'
import { Search, Filter, Music, Clock, Heart, Download, Play, MoreVertical, FolderOpen } from 'lucide-react'

export default function LibraryView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const musicFiles = [
    { id: 1, name: 'Summer Beat.wav', type: 'Audio', size: '12.4 MB', modified: '2 hours ago', duration: '3:24' },
    { id: 2, name: 'Trap Loop.mid', type: 'MIDI', size: '24 KB', modified: '1 day ago', duration: '0:32' },
    { id: 3, name: 'Vocals Take 3.mp3', type: 'Audio', size: '8.2 MB', modified: '3 days ago', duration: '2:15' },
    { id: 4, name: 'Project Alpha.bms', type: 'Project', size: '45.6 MB', modified: '1 week ago', duration: '5:12' },
    { id: 5, name: 'Bass Line.wav', type: 'Audio', size: '6.8 MB', modified: '2 weeks ago', duration: '1:45' },
  ]

  const categories = [
    { id: 'all', label: 'All Files', count: 234 },
    { id: 'projects', label: 'Projects', count: 12 },
    { id: 'audio', label: 'Audio Files', count: 156 },
    { id: 'midi', label: 'MIDI', count: 45 },
    { id: 'samples', label: 'Samples', count: 89 },
    { id: 'presets', label: 'Presets', count: 34 }
  ]

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#0a0a0a'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h1 style={{ color: '#ffffff', fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
          Music Library
        </h1>

        {/* Search and Filter Bar */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 255, 255, 0.5)'
            }} />
            <input
              type="text"
              placeholder="Search your library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 10px 10px 40px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
          <button style={{
            padding: '10px 20px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Filter size={18} />
            Filters
          </button>
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '8px 16px',
                background: selectedCategory === cat.id 
                  ? 'rgba(139, 92, 246, 0.2)' 
                  : 'rgba(255, 255, 255, 0.05)',
                border: selectedCategory === cat.id
                  ? '1px solid rgba(139, 92, 246, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                color: selectedCategory === cat.id ? '#8b5cf6' : '#ffffff',
                fontSize: '13px',
                fontWeight: selectedCategory === cat.id ? '600' : '400',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <span>{cat.label}</span>
              <span style={{ 
                fontSize: '11px', 
                opacity: 0.7,
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '2px 6px',
                borderRadius: '10px'
              }}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* File List */}
      <div style={{
        flex: 1,
        overflowY: 'auto'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '40px 1fr 100px 100px 120px 80px 40px',
          padding: '12px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.6)',
          fontWeight: '600'
        }}>
          <div></div>
          <div>Name</div>
          <div>Type</div>
          <div>Size</div>
          <div>Modified</div>
          <div>Duration</div>
          <div></div>
        </div>

        {/* File Rows */}
        {musicFiles.map((file) => (
          <div
            key={file.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '40px 1fr 100px 100px 120px 80px 40px',
              padding: '12px 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              fontSize: '13px',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#8b5cf6',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  console.log('Play:', file.name)
                }}
              >
                <Play size={16} />
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: file.type === 'Project' 
                  ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)'
                  : 'rgba(139, 92, 246, 0.2)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {file.type === 'Project' ? <FolderOpen size={16} /> : <Music size={16} />}
              </div>
              <span style={{ fontWeight: '500' }}>{file.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ 
                padding: '4px 8px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '4px',
                fontSize: '11px'
              }}>
                {file.type}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', opacity: 0.7 }}>
              {file.size}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', opacity: 0.7 }}>
              {file.modified}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', opacity: 0.7 }}>
              {file.duration}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  console.log('More options:', file.name)
                }}
              >
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Status Bar */}
      <div style={{
        padding: '12px 20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.6)'
      }}>
        <span>{musicFiles.length} items</span>
        <span>234.5 MB total</span>
      </div>
    </div>
  )
}