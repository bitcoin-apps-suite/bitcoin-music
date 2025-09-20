'use client'

import { useState, useRef } from 'react'
import { Music, Play, Square } from 'lucide-react'
import { useAudioEngine } from '@/hooks/useAudioEngine'

const NOTES = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
]

const OCTAVES = [6, 5, 4, 3, 2, 1] // Top to bottom

export default function PianoRoll() {
  const { tracks, playNote, createTrack } = useAudioEngine()
  const [selectedTrack, setSelectedTrack] = useState<string>('')
  const [isPlaying, setIsPlaying] = useState<string | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // Find first MIDI track or create one
  const midiTracks = tracks.filter(track => 
    track.name.toLowerCase().includes('midi') || 
    track.name.toLowerCase().includes('synth')
  )
  const defaultTrack = midiTracks[0]?.id || ''

  const playNoteOnTrack = (note: string, octave: number) => {
    const fullNote = `${note}${octave}`
    const trackId = selectedTrack || defaultTrack
    
    if (trackId) {
      playNote(trackId, fullNote, '8n')
      setIsPlaying(fullNote)
      setTimeout(() => setIsPlaying(null), 200)
    }
  }

  const createMidiTrack = async () => {
    const trackId = await createTrack('MIDI Synth', 'midi')
    setSelectedTrack(trackId)
  }

  const isBlackKey = (note: string) => note.includes('#')

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
          <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>No tracks available</h3>
          <p style={{ fontSize: '14px', marginBottom: '16px' }}>Create a MIDI track to use the piano roll</p>
          <button
            onClick={createMidiTrack}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
              border: 'none',
              borderRadius: '6px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Create MIDI Track
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#0a0a0a',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        height: '60px',
        background: 'linear-gradient(180deg, #1a1a1a 0%, #141414 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Music size={20} style={{ color: '#8b5cf6' }} />
          <h2 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>
            Piano Roll Editor
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            value={selectedTrack}
            onChange={(e) => setSelectedTrack(e.target.value)}
            style={{
              padding: '6px 12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              color: '#ffffff',
              fontSize: '13px',
              outline: 'none'
            }}
          >
            <option value="">Select Track</option>
            {tracks.map((track) => (
              <option key={track.id} value={track.id}>
                {track.name}
              </option>
            ))}
          </select>

          <button
            onClick={createMidiTrack}
            style={{
              padding: '6px 12px',
              background: 'rgba(139, 92, 246, 0.2)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '4px',
              color: '#8b5cf6',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Music size={14} />
            Add MIDI
          </button>
        </div>
      </div>

      {/* Piano Roll Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden'
      }}>
        {/* Piano Keys */}
        <div style={{
          width: '120px',
          background: '#141414',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {OCTAVES.map((octave) =>
            NOTES.slice().reverse().map((note) => {
              const fullNote = `${note}${octave}`
              const isBlack = isBlackKey(note)
              const isActive = isPlaying === fullNote

              return (
                <button
                  key={fullNote}
                  onMouseDown={() => playNoteOnTrack(note, octave)}
                  style={{
                    height: '20px',
                    background: isActive
                      ? '#8b5cf6'
                      : isBlack
                      ? '#2a2a2a'
                      : '#ffffff',
                    border: '1px solid rgba(0, 0, 0, 0.2)',
                    borderRight: 'none',
                    color: isBlack || isActive ? '#ffffff' : '#000000',
                    fontSize: '11px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: '8px',
                    transition: 'all 0.1s',
                    userSelect: 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = isBlack ? '#3a3a3a' : '#f0f0f0'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = isBlack ? '#2a2a2a' : '#ffffff'
                    }
                  }}
                >
                  {note === 'C' ? fullNote : ''}
                </button>
              )
            })
          )}
        </div>

        {/* Note Grid */}
        <div 
          ref={gridRef}
          style={{
            flex: 1,
            background: '#0f0f0f',
            position: 'relative',
            overflow: 'auto'
          }}
        >
          {/* Grid Lines */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              repeating-linear-gradient(
                to bottom,
                transparent 0px,
                transparent 19px,
                rgba(255, 255, 255, 0.05) 20px
              ),
              repeating-linear-gradient(
                to right,
                transparent 0px,
                transparent 39px,
                rgba(255, 255, 255, 0.1) 40px
              )
            `,
            pointerEvents: 'none'
          }} />

          {/* Note Rows */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: `${OCTAVES.length * NOTES.length * 20}px`,
            minWidth: '800px'
          }}>
            {OCTAVES.map((octave) =>
              NOTES.slice().reverse().map((note) => {
                const isBlack = isBlackKey(note)
                return (
                  <div
                    key={`${note}${octave}`}
                    style={{
                      height: '20px',
                      background: isBlack ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      position: 'relative',
                      cursor: 'crosshair'
                    }}
                    onClick={(e) => {
                      // Future: Add note at clicked position
                      console.log(`Add note ${note}${octave} at position`, e.clientX)
                    }}
                  />
                )
              })
            )}
          </div>

          {/* Timeline Header */}
          <div style={{
            position: 'sticky',
            top: 0,
            height: '30px',
            background: 'linear-gradient(180deg, #1a1a1a 0%, #141414 100%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.6)',
            zIndex: 10
          }}>
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} style={{
                width: '40px',
                borderLeft: i === 0 ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                paddingLeft: '4px',
                height: '100%',
                display: 'flex',
                alignItems: 'center'
              }}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div style={{
        height: '40px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '20px',
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.5)'
      }}>
        Click piano keys to play notes • Click grid to add notes (coming soon) • 
        {selectedTrack ? `Playing on: ${tracks.find(t => t.id === selectedTrack)?.name}` : 'Select a track to play notes'}
      </div>
    </div>
  )
}