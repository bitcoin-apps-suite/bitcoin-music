'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Volume2, Headphones, Mic, Music, Play, Pause, SkipBack, SkipForward, Circle } from 'lucide-react'

interface Channel {
  id: number
  name: string
  volume: number
  pan: number
  mute: boolean
  solo: boolean
  highEQ: number
  midEQ: number
  lowEQ: number
  auxSend1: number
  auxSend2: number
  type: 'audio' | 'instrument' | 'aux' | 'master'
  color: string
  armed: boolean
}

interface MixingDeskProps {
  onChannelChange?: (channelId: number, channel: Channel) => void
}

export default function MixingDesk({ onChannelChange }: MixingDeskProps) {
  const [channels, setChannels] = useState<Channel[]>([
    { id: 1, name: 'Kick', volume: 75, pan: 0, mute: false, solo: false, highEQ: 0, midEQ: 0, lowEQ: 0, auxSend1: 0, auxSend2: 0, type: 'audio', color: '#ff6b6b', armed: false },
    { id: 2, name: 'Snare', volume: 70, pan: 0, mute: false, solo: false, highEQ: 0, midEQ: 0, lowEQ: 0, auxSend1: 20, auxSend2: 10, type: 'audio', color: '#4ecdc4', armed: false },
    { id: 3, name: 'Hi-Hat', volume: 65, pan: 15, mute: false, solo: false, highEQ: 5, midEQ: 0, lowEQ: -5, auxSend1: 10, auxSend2: 5, type: 'audio', color: '#45b7d1', armed: false },
    { id: 4, name: 'Bass', volume: 80, pan: 0, mute: false, solo: false, highEQ: -5, midEQ: 2, lowEQ: 8, auxSend1: 0, auxSend2: 0, type: 'instrument', color: '#96ceb4', armed: false },
    { id: 5, name: 'Lead', volume: 68, pan: -10, mute: false, solo: false, highEQ: 8, midEQ: 3, lowEQ: -3, auxSend1: 30, auxSend2: 20, type: 'instrument', color: '#dda0dd', armed: true },
    { id: 6, name: 'Pad', volume: 55, pan: 20, mute: false, solo: false, highEQ: 10, midEQ: 0, lowEQ: -5, auxSend1: 40, auxSend2: 35, type: 'instrument', color: '#ffd93d', armed: false },
    { id: 7, name: 'Vocal', volume: 85, pan: 0, mute: false, solo: false, highEQ: 6, midEQ: 4, lowEQ: -2, auxSend1: 25, auxSend2: 15, type: 'audio', color: '#ff9ff3', armed: true },
    { id: 8, name: 'FX', volume: 60, pan: 0, mute: false, solo: false, highEQ: 0, midEQ: 0, lowEQ: 0, auxSend1: 0, auxSend2: 0, type: 'aux', color: '#54a0ff', armed: false },
  ])

  const [masterVolume, setMasterVolume] = useState(85)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [vuLevels, setVuLevels] = useState<{[key: number]: number}>({})

  // Simulate VU meter animation
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setVuLevels(prev => {
          const newLevels: {[key: number]: number} = {}
          channels.forEach(ch => {
            if (!ch.mute) {
              // Simulate audio level with some randomness
              const baseLevel = (ch.volume / 100) * 0.7
              const randomVariation = Math.random() * 0.3
              newLevels[ch.id] = Math.min(1, baseLevel + randomVariation)
            } else {
              newLevels[ch.id] = 0
            }
          })
          return newLevels
        })
      }, 100)
      return () => clearInterval(interval)
    } else {
      setVuLevels({})
    }
  }, [isPlaying, channels])

  const updateChannel = (id: number, updates: Partial<Channel>) => {
    setChannels(prev => prev.map(ch => {
      if (ch.id === id) {
        const updated = { ...ch, ...updates }
        onChannelChange?.(id, updated)
        return updated
      }
      return ch
    }))
  }

  const renderKnob = (value: number, onChange: (value: number) => void, label: string, color: string = '#8b5cf6') => {
    const angle = ((value + 15) / 30) * 270 - 135 // Map -15 to +15 to -135deg to +135deg
    
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: '4px'
      }}>
        <span style={{ 
          fontSize: '10px', 
          color: 'rgba(255, 255, 255, 0.5)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {label}
        </span>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
            border: `2px solid ${color}`,
            position: 'relative',
            cursor: 'pointer',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
          }}
          onMouseDown={(e) => {
            const startY = e.clientY
            const startValue = value
            
            const handleMouseMove = (e: MouseEvent) => {
              const deltaY = startY - e.clientY
              const newValue = Math.max(-15, Math.min(15, startValue + deltaY / 2))
              onChange(newValue)
            }
            
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove)
              document.removeEventListener('mouseup', handleMouseUp)
            }
            
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '2px',
              height: '12px',
              background: color,
              left: '50%',
              top: '4px',
              transformOrigin: 'center 12px',
              transform: `translateX(-50%) rotate(${angle}deg)`
            }}
          />
        </div>
        <span style={{ 
          fontSize: '9px', 
          color: 'rgba(255, 255, 255, 0.3)',
          fontFamily: 'monospace'
        }}>
          {value > 0 ? '+' : ''}{value}
        </span>
      </div>
    )
  }

  const renderFader = (channel: Channel) => {
    const faderHeight = 120
    const handlePosition = faderHeight - (channel.volume / 100) * faderHeight
    
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
      }}>
        {/* VU Meter */}
        <div style={{
          width: '8px',
          height: faderHeight,
          background: 'linear-gradient(to top, #00ff00 0%, #00ff00 60%, #ffff00 85%, #ff0000 100%)',
          borderRadius: '2px',
          position: 'relative',
          opacity: 0.3
        }}>
          <div style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: `${(vuLevels[channel.id] || 0) * 100}%`,
            background: 'inherit',
            opacity: 1,
            transition: 'height 0.05s'
          }} />
        </div>
        
        {/* Fader Track */}
        <div
          style={{
            width: '40px',
            height: faderHeight,
            background: 'linear-gradient(180deg, #1a1a1a, #2a2a2a)',
            borderRadius: '4px',
            position: 'relative',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            cursor: 'pointer'
          }}
          onMouseDown={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const updateVolume = (clientY: number) => {
              const y = clientY - rect.top
              const volume = Math.max(0, Math.min(100, (1 - y / faderHeight) * 100))
              updateChannel(channel.id, { volume })
            }
            
            updateVolume(e.clientY)
            
            const handleMouseMove = (e: MouseEvent) => updateVolume(e.clientY)
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove)
              document.removeEventListener('mouseup', handleMouseUp)
            }
            
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
          }}
        >
          {/* Fader Cap */}
          <div
            style={{
              position: 'absolute',
              width: '36px',
              height: '20px',
              background: `linear-gradient(135deg, ${channel.color}dd, ${channel.color}99)`,
              borderRadius: '3px',
              left: '50%',
              transform: 'translateX(-50%)',
              top: `${handlePosition}px`,
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
              pointerEvents: 'none'
            }}
          >
            <div style={{
              width: '100%',
              height: '2px',
              background: 'rgba(255, 255, 255, 0.5)',
              marginTop: '9px'
            }} />
          </div>
          
          {/* Volume Scale */}
          {[0, -5, -10, -20, -30, -40, -60].map((db, i) => (
            <div
              key={db}
              style={{
                position: 'absolute',
                right: '-25px',
                top: `${i * (faderHeight / 6) - 5}px`,
                fontSize: '8px',
                color: 'rgba(255, 255, 255, 0.3)'
              }}
            >
              {db}
            </div>
          ))}
        </div>
        
        {/* Volume Display */}
        <div style={{
          fontSize: '10px',
          color: channel.color,
          fontFamily: 'monospace',
          fontWeight: 'bold'
        }}>
          {channel.volume}
        </div>
      </div>
    )
  }

  const renderChannelStrip = (channel: Channel) => (
    <div
      key={channel.id}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '80px',
        background: 'linear-gradient(180deg, #1a1a1a, #141414)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        padding: '12px 8px',
        gap: '12px'
      }}
    >
      {/* Channel Name */}
      <input
        type="text"
        value={channel.name}
        onChange={(e) => updateChannel(channel.id, { name: e.target.value })}
        style={{
          background: channel.color + '33',
          border: `1px solid ${channel.color}66`,
          borderRadius: '4px',
          color: '#ffffff',
          fontSize: '11px',
          fontWeight: '600',
          padding: '4px',
          textAlign: 'center',
          outline: 'none'
        }}
      />

      {/* Record Arm */}
      {channel.type !== 'master' && (
        <button
          onClick={() => updateChannel(channel.id, { armed: !channel.armed })}
          style={{
            padding: '4px',
            background: channel.armed ? '#ff3333' : 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            color: '#ffffff',
            fontSize: '10px',
            cursor: 'pointer',
            animation: channel.armed ? 'pulse 1s infinite' : 'none'
          }}
        >
          <Circle size={12} fill={channel.armed ? '#ffffff' : 'transparent'} />
          REC
        </button>
      )}

      {/* EQ Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '8px 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        {renderKnob(channel.highEQ, (v) => updateChannel(channel.id, { highEQ: v }), 'HIGH', '#ff6b6b')}
        {renderKnob(channel.midEQ, (v) => updateChannel(channel.id, { midEQ: v }), 'MID', '#4ecdc4')}
        {renderKnob(channel.lowEQ, (v) => updateChannel(channel.id, { lowEQ: v }), 'LOW', '#45b7d1')}
      </div>

      {/* Aux Sends */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {renderKnob(channel.auxSend1, (v) => updateChannel(channel.id, { auxSend1: v }), 'AUX1', '#ffd93d')}
        {renderKnob(channel.auxSend2, (v) => updateChannel(channel.id, { auxSend2: v }), 'AUX2', '#ff9ff3')}
      </div>

      {/* Pan */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px'
      }}>
        <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.5)' }}>PAN</span>
        <input
          type="range"
          min="-50"
          max="50"
          value={channel.pan}
          onChange={(e) => updateChannel(channel.id, { pan: parseInt(e.target.value) })}
          style={{
            width: '60px',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.1)',
            outline: 'none',
            cursor: 'pointer'
          }}
        />
        <span style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.3)' }}>
          {channel.pan === 0 ? 'C' : channel.pan < 0 ? `L${Math.abs(channel.pan)}` : `R${channel.pan}`}
        </span>
      </div>

      {/* Mute/Solo */}
      <div style={{ display: 'flex', gap: '4px' }}>
        <button
          onClick={() => updateChannel(channel.id, { mute: !channel.mute })}
          style={{
            flex: 1,
            padding: '6px',
            background: channel.mute ? '#ff3333' : 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            color: '#ffffff',
            fontSize: '10px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          M
        </button>
        <button
          onClick={() => updateChannel(channel.id, { solo: !channel.solo })}
          style={{
            flex: 1,
            padding: '6px',
            background: channel.solo ? '#ffd93d' : 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            color: channel.solo ? '#000' : '#ffffff',
            fontSize: '10px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          S
        </button>
      </div>

      {/* Fader */}
      {renderFader(channel)}
    </div>
  )

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(180deg, #0a0a0a, #1a1a1a)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      overflow: 'auto'
    }}>
      {/* Transport Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <button
          onClick={() => console.log('Previous')}
          style={{
            padding: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <SkipBack size={20} />
        </button>
        
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            padding: '12px',
            background: isPlaying 
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            border: 'none',
            borderRadius: '50%',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)'
          }}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        
        <button
          onClick={() => console.log('Next')}
          style={{
            padding: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <SkipForward size={20} />
        </button>

        <button
          onClick={() => setIsRecording(!isRecording)}
          style={{
            padding: '8px 16px',
            background: isRecording ? '#ff3333' : 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: isRecording ? 'pulse 1s infinite' : 'none'
          }}
        >
          <Circle size={16} fill={isRecording ? '#ffffff' : 'transparent'} />
          REC
        </button>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
            BPM: <strong style={{ color: '#8b5cf6' }}>128</strong>
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
            Time: <strong style={{ color: '#8b5cf6' }}>00:00:00</strong>
          </span>
        </div>
      </div>

      {/* Mixing Channels */}
      <div style={{
        flex: 1,
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '20px'
      }}>
        {/* Channel Strips */}
        {channels.map(channel => renderChannelStrip(channel))}

        {/* Master Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          width: '120px',
          background: 'linear-gradient(180deg, #2a1a3a, #1a0a2a)',
          border: '2px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '4px',
          padding: '12px',
          gap: '12px',
          marginLeft: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            borderRadius: '4px',
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: '700',
            padding: '8px',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Master
          </div>

          {/* Master EQ */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: '12px 0',
            borderTop: '1px solid rgba(139, 92, 246, 0.2)',
            borderBottom: '1px solid rgba(139, 92, 246, 0.2)'
          }}>
            {renderKnob(0, () => {}, 'COMP', '#8b5cf6')}
            {renderKnob(0, () => {}, 'LIMIT', '#8b5cf6')}
          </div>

          {/* Master Volume */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            flex: 1
          }}>
            <span style={{ 
              fontSize: '10px', 
              color: 'rgba(255, 255, 255, 0.5)',
              textTransform: 'uppercase'
            }}>
              Output
            </span>
            
            <div style={{
              width: '60px',
              height: '200px',
              background: 'linear-gradient(180deg, #1a1a1a, #2a2a2a)',
              borderRadius: '4px',
              position: 'relative',
              border: '2px solid rgba(139, 92, 246, 0.5)',
              cursor: 'pointer'
            }}
            onMouseDown={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const updateMaster = (clientY: number) => {
                const y = clientY - rect.top
                const volume = Math.max(0, Math.min(100, (1 - y / 200) * 100))
                setMasterVolume(volume)
              }
              
              updateMaster(e.clientY)
              
              const handleMouseMove = (e: MouseEvent) => updateMaster(e.clientY)
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
              }
              
              document.addEventListener('mousemove', handleMouseMove)
              document.addEventListener('mouseup', handleMouseUp)
            }}>
              {/* Master Fader */}
              <div
                style={{
                  position: 'absolute',
                  width: '50px',
                  height: '30px',
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  borderRadius: '4px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  top: `${200 - (masterVolume / 100) * 200}px`,
                  border: '2px solid rgba(255, 255, 255, 0.5)',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.5)',
                  pointerEvents: 'none'
                }}
              >
                <div style={{
                  width: '100%',
                  height: '2px',
                  background: 'rgba(255, 255, 255, 0.8)',
                  marginTop: '14px'
                }} />
              </div>
            </div>
            
            <div style={{
              fontSize: '14px',
              color: '#8b5cf6',
              fontFamily: 'monospace',
              fontWeight: 'bold'
            }}>
              {masterVolume}%
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: #8b5cf6;
          border-radius: 50%;
          cursor: pointer;
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: #8b5cf6;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}