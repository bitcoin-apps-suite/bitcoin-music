'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Volume2, 
  VolumeX, 
  Headphones, 
  MoreVertical, 
  Upload,
  Trash2,
  Edit3,
  Mic,
  Music
} from 'lucide-react'
import { Track } from '@/lib/audio/AudioEngine'
import { useAudioEngine } from '@/hooks/useAudioEngine'
import WaveformDisplay from './WaveformDisplay'

interface MultiTrackEditorProps {
  tracks: Track[]
}

export default function MultiTrackEditor({ tracks }: MultiTrackEditorProps) {
  const { setTrackVolume, setTrackMute, setTrackSolo, loadAudioToTrack } = useAudioEngine()
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingTrackId, setUploadingTrackId] = useState<string | null>(null)

  const handleVolumeChange = (trackId: string, volume: number) => {
    // Convert from 0-100 range to -60 to 0 dB range
    const dbValue = volume === 0 ? -60 : (volume - 100) * 0.6
    setTrackVolume(trackId, dbValue)
  }

  const handleFileUpload = async (trackId: string, file: File) => {
    setUploadingTrackId(trackId)
    try {
      const url = URL.createObjectURL(file)
      await loadAudioToTrack(trackId, url)
      console.log(`Loaded ${file.name} to track ${trackId}`)
    } catch (error) {
      console.error('Error loading audio:', error)
    } finally {
      setUploadingTrackId(null)
    }
  }

  const openFileDialog = (trackId: string) => {
    setSelectedTrack(trackId)
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && selectedTrack) {
      handleFileUpload(selectedTrack, file)
    }
    // Reset input
    event.target.value = ''
  }

  if (tracks.length === 0) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255, 255, 255, 0.4)',
        textAlign: 'center',
        gap: '16px'
      }}>
        <Music size={64} />
        <div>
          <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>No tracks yet</h3>
          <p style={{ fontSize: '14px' }}>Click the &quot;+ Track&quot; button to create your first track</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#0a0a0a'
    }}>
      {/* Timeline Header */}
      <div style={{
        height: '40px',
        background: 'linear-gradient(180deg, #1a1a1a 0%, #141414 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '200px', // Space for track controls
        fontSize: '11px',
        color: 'rgba(255, 255, 255, 0.6)'
      }}>
        {/* Time markers */}
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} style={{
            width: '80px',
            borderLeft: i === 0 ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
            paddingLeft: '8px',
            height: '100%',
            display: 'flex',
            alignItems: 'center'
          }}>
            {i}:00
          </div>
        ))}
      </div>

      {/* Tracks Container */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'auto'
      }}>
        {tracks.map((track, index) => (
          <div key={track.id} style={{
            height: '80px',
            display: 'flex',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
          }}>
            {/* Track Controls */}
            <div style={{
              width: '200px',
              background: 'linear-gradient(90deg, #1a1a1a 0%, #161616 100%)',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {/* Track Name & Type */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Music size={12} style={{ color: '#ffffff' }} />
                  </div>
                  <span style={{
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: '500',
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {track.name}
                  </span>
                </div>
                <button style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  padding: '2px'
                }}>
                  <MoreVertical size={14} />
                </button>
              </div>

              {/* Controls Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Mute */}
                <button
                  onClick={() => setTrackMute(track.id, !track.muted)}
                  style={{
                    width: '24px',
                    height: '20px',
                    background: track.muted ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '3px',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  M
                </button>

                {/* Solo */}
                <button
                  onClick={() => setTrackSolo(track.id, !track.solo)}
                  style={{
                    width: '24px',
                    height: '20px',
                    background: track.solo ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '3px',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  S
                </button>

                {/* Volume Slider */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <VolumeX size={10} style={{ color: 'rgba(255, 255, 255, 0.4)' }} />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={Math.min(100, Math.max(0, (track.volume + 60) / 0.6))}
                    onChange={(e) => handleVolumeChange(track.id, Number(e.target.value))}
                    style={{
                      flex: 1,
                      height: '4px',
                      accentColor: '#8b5cf6',
                      opacity: track.muted ? 0.3 : 1
                    }}
                  />
                  <Volume2 size={10} style={{ color: 'rgba(255, 255, 255, 0.4)' }} />
                </div>

                {/* Upload Button */}
                <button
                  onClick={() => openFileDialog(track.id)}
                  disabled={uploadingTrackId === track.id}
                  style={{
                    width: '20px',
                    height: '20px',
                    background: 'rgba(139, 92, 246, 0.2)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '3px',
                    color: '#8b5cf6',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: uploadingTrackId === track.id ? 0.5 : 1,
                    transition: 'all 0.2s'
                  }}
                  title="Upload audio file"
                >
                  <Upload size={10} />
                </button>
              </div>
            </div>

            {/* Waveform Area */}
            <div style={{
              flex: 1,
              position: 'relative',
              background: '#0a0a0a'
            }}>
              <WaveformDisplay 
                trackId={track.id} 
                height={80}
                isActive={!track.muted && (tracks.some(t => t.solo) ? track.solo : true)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  )
}