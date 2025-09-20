'use client'

import { useState, useEffect } from 'react'
import { 
  Play, 
  Pause, 
  Square, 
  SkipBack,
  SkipForward,
  Repeat,
  Volume2,
  Mic,
  Layers,
  Settings,
  Save,
  Download,
  Upload,
  Music,
  Sliders,
  Radio,
  Plus,
  FolderOpen
} from 'lucide-react'
import { useAudioEngine } from '@/hooks/useAudioEngine'
import MultiTrackEditor from '@/components/studio/MultiTrackEditor'
import MixerPanel from '@/components/studio/MixerPanel'
import PianoRoll from '@/components/studio/PianoRoll'
import { FileManager } from '@/components/studio/FileManager'
import MixingDesk from '@/components/MixingDesk'

type StudioView = 'arrange' | 'mixer' | 'piano' | 'mixing'

export default function StudioInterface() {
  const {
    isPlaying,
    isRecording,
    bpm,
    position,
    tracks,
    play,
    pause,
    stop,
    startRecording,
    stopRecording,
    setBPM,
    createTrack
  } = useAudioEngine()

  const [currentView, setCurrentView] = useState<StudioView>('arrange')
  const [volume, setVolume] = useState(75)
  const [loop, setLoop] = useState(false)
  const [projectName, setProjectName] = useState('Untitled Project')
  const [isEditingName, setIsEditingName] = useState(false)
  const [showFileManager, setShowFileManager] = useState(false)
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null)

  // Format position time for display
  const formatTime = (position: string) => {
    try {
      const parts = position.split(':')
      if (parts.length >= 3) {
        const minutes = parseInt(parts[0])
        const seconds = parseInt(parts[1])
        const beats = parseInt(parts[2])
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${beats.toString().padStart(2, '0')}`
      }
      return position
    } catch {
      return '00:00:00'
    }
  }

  const handlePlayPause = async () => {
    if (isPlaying) {
      pause()
    } else {
      await play()
    }
  }

  const handleRecord = async () => {
    if (isRecording) {
      const blob = await stopRecording()
      if (blob) {
        setRecordingBlob(blob)
        // You could automatically create a new track with this recording
        console.log('Recording complete, blob size:', blob.size)
      }
    } else {
      await startRecording()
    }
  }

  const handleStop = () => {
    stop()
  }

  const handleCreateTrack = () => {
    const trackId = createTrack(`Track ${tracks.length + 1}`)
    console.log('Created track:', trackId)
  }

  const downloadRecording = () => {
    if (recordingBlob) {
      const url = URL.createObjectURL(recordingBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${projectName}_recording.wav`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const renderContent = () => {
    switch (currentView) {
      case 'mixing':
        return <MixingDesk />
      case 'mixer':
        return <MixerPanel tracks={tracks} />
      case 'piano':
        return <PianoRoll />
      default:
        return <MultiTrackEditor tracks={tracks} />
    }
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#0a0a0a'
    }}>
      {/* Top Toolbar */}
      <div style={{
        height: '48px',
        background: 'linear-gradient(180deg, #1a1a1a 0%, #141414 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px'
      }}>
        {/* Left: Project Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Music size={20} style={{ color: '#8b5cf6' }} />
          {isEditingName ? (
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsEditingName(false)
                }
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(139, 92, 246, 0.5)',
                borderRadius: '4px',
                padding: '4px 8px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                outline: 'none'
              }}
              autoFocus
            />
          ) : (
            <h2 
              onClick={() => setIsEditingName(true)}
              style={{
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '4px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {projectName}
            </h2>
          )}
        </div>

        {/* Center: View Selector */}
        <div style={{
          display: 'flex',
          gap: '4px',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '4px',
          borderRadius: '6px'
        }}>
          {[
            { id: 'arrange', icon: <Layers size={16} />, label: 'Arrange' },
            { id: 'mixing', icon: <Sliders size={16} />, label: 'Mixing Desk' },
            { id: 'mixer', icon: <Volume2 size={16} />, label: 'Mixer' },
            { id: 'piano', icon: <Radio size={16} />, label: 'Piano Roll' }
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setCurrentView(view.id as StudioView)}
              style={{
                padding: '6px 12px',
                background: currentView === view.id ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                border: 'none',
                borderRadius: '4px',
                color: currentView === view.id ? '#8b5cf6' : '#ffffff',
                fontSize: '12px',
                fontWeight: currentView === view.id ? '600' : '400',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
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

        {/* Right: Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleCreateTrack}
            style={{
              padding: '6px 10px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              color: '#ffffff',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
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
            <Plus size={14} />
            <span>Track</span>
          </button>
          <button
            onClick={() => setShowFileManager(!showFileManager)}
            style={{
              padding: '6px 10px',
              background: showFileManager ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
              border: '1px solid ' + (showFileManager ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 255, 255, 0.2)'),
              borderRadius: '4px',
              color: showFileManager ? '#8b5cf6' : '#ffffff',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = showFileManager ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 255, 255, 0.05)'
              e.currentTarget.style.borderColor = showFileManager ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255, 255, 255, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = showFileManager ? 'rgba(139, 92, 246, 0.2)' : 'transparent'
              e.currentTarget.style.borderColor = showFileManager ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 255, 255, 0.2)'
            }}
          >
            <FolderOpen size={14} />
            <span>Files</span>
          </button>
          {recordingBlob && (
            <button
              onClick={downloadRecording}
              style={{
                padding: '6px 10px',
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '4px',
                color: '#8b5cf6',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
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
              <Download size={14} />
              <span>Export</span>
            </button>
          )}
        </div>
      </div>

      {/* Transport Controls */}
      <div style={{
        height: '64px',
        background: 'linear-gradient(180deg, #141414 0%, #0f0f0f 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        padding: '0 24px'
      }}>
        {/* Transport Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => stop()}
            style={{
              width: '36px',
              height: '36px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <SkipBack size={18} />
          </button>

          <button
            onClick={handlePlayPause}
            style={{
              width: '48px',
              height: '48px',
              background: isPlaying 
                ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)'
                : 'rgba(255, 255, 255, 0.05)',
              border: isPlaying
                ? '2px solid rgba(139, 92, 246, 0.5)'
                : '2px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!isPlaying) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              }
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              if (!isPlaying) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
              }
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '2px' }} />}
          </button>

          <button
            onClick={handleStop}
            style={{
              width: '36px',
              height: '36px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <Square size={16} />
          </button>

          <button
            onClick={handleRecord}
            style={{
              width: '36px',
              height: '36px',
              background: isRecording
                ? 'rgba(239, 68, 68, 0.2)'
                : 'rgba(255, 255, 255, 0.05)',
              border: isRecording
                ? '1px solid rgba(239, 68, 68, 0.5)'
                : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              color: isRecording ? '#ef4444' : '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              animation: isRecording ? 'pulse 2s infinite' : 'none'
            }}
            onMouseEnter={(e) => {
              if (!isRecording) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              }
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              if (!isRecording) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
              }
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: isRecording ? '#ef4444' : '#ffffff'
            }} />
          </button>

          <button
            onClick={() => setLoop(!loop)}
            style={{
              width: '36px',
              height: '36px',
              background: loop
                ? 'rgba(139, 92, 246, 0.2)'
                : 'rgba(255, 255, 255, 0.05)',
              border: loop
                ? '1px solid rgba(139, 92, 246, 0.5)'
                : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              color: loop ? '#8b5cf6' : '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <Repeat size={18} />
          </button>
        </div>

        {/* Time Display */}
        <div style={{
          padding: '8px 16px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '18px',
          fontWeight: '600',
          color: '#8b5cf6',
          minWidth: '120px',
          textAlign: 'center'
        }}>
          {formatTime(position)}
        </div>

        {/* BPM Control */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '4px'
        }}>
          <span style={{ color: '#ffffff', fontSize: '12px', opacity: 0.7 }}>BPM</span>
          <input
            type="number"
            value={bpm}
            onChange={(e) => setBPM(Number(e.target.value))}
            min="60"
            max="200"
            style={{
              width: '50px',
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'center',
              outline: 'none'
            }}
          />
        </div>

        {/* Volume Control */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '4px'
        }}>
          <Volume2 size={16} style={{ color: '#ffffff', opacity: 0.7 }} />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            style={{
              width: '100px',
              accentColor: '#8b5cf6'
            }}
          />
          <span style={{ color: '#ffffff', fontSize: '12px', minWidth: '30px' }}>
            {volume}%
          </span>
        </div>

        {/* Track Count */}
        <div style={{
          padding: '8px 12px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '4px',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.7)'
        }}>
          {tracks.length} tracks
        </div>
      </div>

      {/* Main Content Area with File Manager Sidebar */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Main Content */}
        <div style={{
          flex: 1,
          overflow: 'hidden'
        }}>
          {renderContent()}
        </div>
        
        {/* File Manager Sidebar */}
        {showFileManager && (
          <div style={{
            width: '280px',
            background: '#0f0f0f',
            borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '16px',
            overflowY: 'auto'
          }}>
            <FileManager />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}