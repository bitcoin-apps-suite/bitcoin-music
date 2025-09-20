'use client'

import { useState } from 'react'
import { 
  Volume2, 
  VolumeX, 
  Headphones, 
  Music,
  Sliders,
  RotateCcw,
  Zap,
  Filter,
  Waves
} from 'lucide-react'
import { Track } from '@/lib/audio/AudioEngine'
import { useAudioEngine } from '@/hooks/useAudioEngine'

interface MixerPanelProps {
  tracks: Track[]
}

interface ChannelStripProps {
  track: Track
  onVolumeChange: (trackId: string, volume: number) => void
  onMuteToggle: (trackId: string, muted: boolean) => void
  onSoloToggle: (trackId: string, solo: boolean) => void
  onAddEffect: (trackId: string, effectType: 'reverb' | 'delay' | 'distortion' | 'filter') => void | Promise<void>
}

function ChannelStrip({ 
  track, 
  onVolumeChange, 
  onMuteToggle, 
  onSoloToggle, 
  onAddEffect 
}: ChannelStripProps) {
  const [highEQ, setHighEQ] = useState(0)
  const [midEQ, setMidEQ] = useState(0)
  const [lowEQ, setLowEQ] = useState(0)
  const [pan, setPan] = useState(0)

  const volumePercent = Math.min(100, Math.max(0, (track.volume + 60) / 0.6))

  return (
    <div style={{
      width: '80px',
      height: '100%',
      background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      padding: '12px 8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginRight: '8px'
    }}>
      {/* Track Name */}
      <div style={{
        textAlign: 'center',
        marginBottom: '8px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 8px'
        }}>
          <Music size={16} style={{ color: '#ffffff' }} />
        </div>
        <div style={{
          color: '#ffffff',
          fontSize: '10px',
          fontWeight: '600',
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {track.name}
        </div>
      </div>

      {/* Effects Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{
          fontSize: '9px',
          color: 'rgba(255, 255, 255, 0.5)',
          textAlign: 'center',
          marginBottom: '4px'
        }}>
          EFFECTS
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {(['reverb', 'delay', 'distortion', 'filter'] as const).map((effect) => (
            <button
              key={effect}
              onClick={() => onAddEffect(track.id, effect)}
              style={{
                padding: '2px 4px',
                background: track.effects.some(e => e.name.toLowerCase().includes(effect)) 
                  ? 'rgba(139, 92, 246, 0.3)' 
                  : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '2px',
                color: '#ffffff',
                fontSize: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!track.effects.some(e => e.name.toLowerCase().includes(effect))) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                }
              }}
              onMouseLeave={(e) => {
                if (!track.effects.some(e => e.name.toLowerCase().includes(effect))) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                }
              }}
            >
              {effect.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* EQ Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{
          fontSize: '9px',
          color: 'rgba(255, 255, 255, 0.5)',
          textAlign: 'center'
        }}>
          EQ
        </div>
        
        {/* High */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '8px', color: 'rgba(255, 255, 255, 0.6)' }}>HI</span>
          <input
            type="range"
            min="-12"
            max="12"
            step="0.1"
            value={highEQ}
            onChange={(e) => setHighEQ(Number(e.target.value))}
            style={{
              width: '50px',
              height: '4px',
              accentColor: '#8b5cf6',
              transform: 'rotate(-90deg)'
            }}
          />
          <span style={{ fontSize: '7px', color: 'rgba(255, 255, 255, 0.4)' }}>
            {highEQ > 0 ? '+' : ''}{highEQ.toFixed(1)}
          </span>
        </div>

        {/* Mid */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '8px', color: 'rgba(255, 255, 255, 0.6)' }}>MD</span>
          <input
            type="range"
            min="-12"
            max="12"
            step="0.1"
            value={midEQ}
            onChange={(e) => setMidEQ(Number(e.target.value))}
            style={{
              width: '50px',
              height: '4px',
              accentColor: '#8b5cf6',
              transform: 'rotate(-90deg)'
            }}
          />
          <span style={{ fontSize: '7px', color: 'rgba(255, 255, 255, 0.4)' }}>
            {midEQ > 0 ? '+' : ''}{midEQ.toFixed(1)}
          </span>
        </div>

        {/* Low */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '8px', color: 'rgba(255, 255, 255, 0.6)' }}>LO</span>
          <input
            type="range"
            min="-12"
            max="12"
            step="0.1"
            value={lowEQ}
            onChange={(e) => setLowEQ(Number(e.target.value))}
            style={{
              width: '50px',
              height: '4px',
              accentColor: '#8b5cf6',
              transform: 'rotate(-90deg)'
            }}
          />
          <span style={{ fontSize: '7px', color: 'rgba(255, 255, 255, 0.4)' }}>
            {lowEQ > 0 ? '+' : ''}{lowEQ.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Pan */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <span style={{ fontSize: '8px', color: 'rgba(255, 255, 255, 0.6)' }}>PAN</span>
        <input
          type="range"
          min="-100"
          max="100"
          value={pan}
          onChange={(e) => setPan(Number(e.target.value))}
          style={{
            width: '60px',
            height: '4px',
            accentColor: '#8b5cf6'
          }}
        />
        <span style={{ fontSize: '7px', color: 'rgba(255, 255, 255, 0.4)' }}>
          {pan === 0 ? 'C' : pan > 0 ? `R${pan}` : `L${Math.abs(pan)}`}
        </span>
      </div>

      {/* Volume Fader */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: '8px',
        minHeight: '200px'
      }}>
        <span style={{ fontSize: '8px', color: 'rgba(255, 255, 255, 0.6)' }}>VOLUME</span>
        
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <input
            type="range"
            min="0"
            max="100"
            value={volumePercent}
            onChange={(e) => onVolumeChange(track.id, Number(e.target.value))}
            style={{
              width: '150px',
              height: '6px',
              accentColor: track.muted ? '#666666' : '#8b5cf6',
              transform: 'rotate(-90deg)',
              opacity: track.muted ? 0.5 : 1
            }}
          />
        </div>

        <span style={{ 
          fontSize: '7px', 
          color: track.muted ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.6)',
          fontFamily: 'monospace'
        }}>
          {track.volume > -60 ? `${track.volume.toFixed(1)}dB` : '-∞'}
        </span>
      </div>

      {/* Mute/Solo Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <button
          onClick={() => onMuteToggle(track.id, !track.muted)}
          style={{
            width: '100%',
            height: '24px',
            background: track.muted ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
            border: track.muted ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            color: '#ffffff',
            fontSize: '10px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!track.muted) {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)'
            }
          }}
          onMouseLeave={(e) => {
            if (!track.muted) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
            }
          }}
        >
          MUTE
        </button>

        <button
          onClick={() => onSoloToggle(track.id, !track.solo)}
          style={{
            width: '100%',
            height: '24px',
            background: track.solo ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)',
            border: track.solo ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            color: '#ffffff',
            fontSize: '10px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!track.solo) {
              e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)'
              e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.5)'
            }
          }}
          onMouseLeave={(e) => {
            if (!track.solo) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
            }
          }}
        >
          SOLO
        </button>
      </div>
    </div>
  )
}

export default function MixerPanel({ tracks }: MixerPanelProps) {
  const { setTrackVolume, setTrackMute, setTrackSolo, addEffect } = useAudioEngine()

  const handleVolumeChange = (trackId: string, volume: number) => {
    const dbValue = volume === 0 ? -60 : (volume - 100) * 0.6
    setTrackVolume(trackId, dbValue)
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
        <Sliders size={64} />
        <div>
          <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>No tracks to mix</h3>
          <p style={{ fontSize: '14px' }}>Create some tracks to start mixing</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#0a0a0a',
      padding: '20px',
      overflowX: 'auto'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 style={{
          color: '#ffffff',
          fontSize: '18px',
          fontWeight: '600',
          margin: '0 0 8px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Sliders size={20} />
          Mixer
        </h2>
        <p style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '13px',
          margin: 0
        }}>
          {tracks.length} channel{tracks.length !== 1 ? 's' : ''} • Professional mixing console
        </p>
      </div>

      {/* Mixer Channels */}
      <div style={{
        display: 'flex',
        gap: '0',
        overflowX: 'auto',
        paddingBottom: '20px',
        minHeight: '600px'
      }}>
        {tracks.map((track) => (
          <ChannelStrip
            key={track.id}
            track={track}
            onVolumeChange={handleVolumeChange}
            onMuteToggle={setTrackMute}
            onSoloToggle={setTrackSolo}
            onAddEffect={addEffect}
          />
        ))}

        {/* Master Channel */}
        <div style={{
          width: '80px',
          height: '100%',
          background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)',
          border: '2px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '8px',
          padding: '12px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginLeft: '16px'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 8px'
            }}>
              <Volume2 size={16} style={{ color: '#ffffff' }} />
            </div>
            <div style={{
              color: '#f59e0b',
              fontSize: '10px',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              MASTER
            </div>
          </div>

          <div style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: '8px',
            minHeight: '200px'
          }}>
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="75"
                style={{
                  width: '150px',
                  height: '8px',
                  accentColor: '#f59e0b',
                  transform: 'rotate(-90deg)'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}