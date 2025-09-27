'use client'

import { useState, useEffect } from 'react'
import { Volume2, Waves } from 'lucide-react'
import { getTone } from '@/lib/audio/ToneWrapper'

interface SynthPreset {
  id: string
  name: string
  oscillator: {
    type: string
    detune: number
  }
  envelope: {
    attack: number
    decay: number
    sustain: number
    release: number
  }
  filter: {
    frequency: number
    Q: number
  }
}

const PRESETS: SynthPreset[] = [
  {
    id: 'default',
    name: 'Default',
    oscillator: { type: 'sine', detune: 0 },
    envelope: { attack: 0.1, decay: 0.2, sustain: 0.6, release: 0.8 },
    filter: { frequency: 1000, Q: 1 }
  },
  {
    id: 'pad',
    name: 'Warm Pad',
    oscillator: { type: 'sine', detune: -12 },
    envelope: { attack: 1.2, decay: 0.8, sustain: 0.7, release: 2.0 },
    filter: { frequency: 800, Q: 2 }
  },
  {
    id: 'lead',
    name: 'Analog Lead',
    oscillator: { type: 'sawtooth', detune: -7 },
    envelope: { attack: 0.02, decay: 0.3, sustain: 0.4, release: 0.5 },
    filter: { frequency: 1500, Q: 5 }
  }
]

export default function AdvancedSynth() {
  const [currentPreset, setCurrentPreset] = useState<SynthPreset>(PRESETS[0])
  const [synth, setSynth] = useState<any>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [octave, setOctave] = useState(4)
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())
  
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const keyboardKeys = ['a', 'w', 's', 'e', 'd', 'f', 't', 'g', 'y', 'h', 'u', 'j']

  useEffect(() => {
    initializeSynth()
    return () => {
      if (synth && synth.dispose) {
        synth.dispose()
      }
    }
  }, [])

  useEffect(() => {
    if (synth && currentPreset) {
      updateSynthParameters()
    }
  }, [currentPreset])

  const initializeSynth = async () => {
    const Tone = await getTone()
    if (!Tone) return

    try {
      const newSynth = new Tone.PolySynth({
        oscillator: currentPreset.oscillator,
        envelope: currentPreset.envelope
      }).toDestination()
      
      setSynth(newSynth)
      setIsInitialized(true)
    } catch (error) {
      console.error('Failed to initialize synth:', error)
    }
  }

  const updateSynthParameters = () => {
    if (!synth) return
    
    try {
      synth.set({
        oscillator: currentPreset.oscillator,
        envelope: currentPreset.envelope
      })
    } catch (error) {
      console.error('Failed to update synth parameters:', error)
    }
  }

  const playNote = (note: string) => {
    if (!synth || !isInitialized) return
    try {
      synth.triggerAttack(note)
    } catch (error) {
      console.error('Failed to play note:', error)
    }
  }

  const stopNote = (note: string) => {
    if (!synth || !isInitialized) return
    try {
      synth.triggerRelease(note)
    } catch (error) {
      console.error('Failed to stop note:', error)
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    const keyIndex = keyboardKeys.indexOf(event.key.toLowerCase())
    if (keyIndex === -1 || pressedKeys.has(event.key)) return

    const note = `${notes[keyIndex]}${octave}`
    setPressedKeys(prev => {
      const newSet = new Set(Array.from(prev))
      newSet.add(event.key)
      return newSet
    })
    playNote(note)
  }

  const handleKeyUp = (event: KeyboardEvent) => {
    const keyIndex = keyboardKeys.indexOf(event.key.toLowerCase())
    if (keyIndex === -1) return

    const note = `${notes[keyIndex]}${octave}`
    setPressedKeys(prev => {
      const newSet = new Set(Array.from(prev))
      newSet.delete(event.key)
      return newSet
    })
    stopNote(note)
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [octave, pressedKeys, synth])

  return (
    <div style={{
      width: '100%',
      background: 'linear-gradient(180deg, #1a1a1a 0%, #141414 100%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      padding: '16px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        <h3 style={{
          color: '#ffffff',
          fontSize: '16px',
          fontWeight: '600',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Waves size={20} />
          Advanced Synthesizer
        </h3>

        {/* Preset Selection */}
        <select
          value={currentPreset.id}
          onChange={(e) => {
            const preset = PRESETS.find(p => p.id === e.target.value)
            if (preset) setCurrentPreset(preset)
          }}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            color: '#ffffff',
            padding: '4px 8px',
            fontSize: '12px'
          }}
        >
          {PRESETS.map(preset => (
            <option key={preset.id} value={preset.id} style={{ background: '#1a1a1a' }}>
              {preset.name}
            </option>
          ))}
        </select>
      </div>

      {/* Parameters */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '16px'
      }}>
        {/* Envelope */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '6px',
          padding: '12px'
        }}>
          <h4 style={{ color: '#ffffff', fontSize: '12px', fontWeight: '600', margin: '0 0 8px' }}>
            Envelope (ADSR)
          </h4>
          {Object.entries(currentPreset.envelope).map(([param, value]) => (
            <div key={param} style={{ marginBottom: '6px' }}>
              <label style={{
                display: 'block',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '10px',
                marginBottom: '2px'
              }}>
                {param.charAt(0).toUpperCase() + param.slice(1)}: {value.toFixed(2)}s
              </label>
              <input
                type="range"
                min="0.01"
                max={param === 'attack' || param === 'release' ? 3 : 1}
                step="0.01"
                value={value}
                onChange={(e) => {
                  setCurrentPreset(prev => ({
                    ...prev,
                    envelope: {
                      ...prev.envelope,
                      [param]: Number(e.target.value)
                    }
                  }))
                }}
                style={{
                  width: '100%',
                  height: '4px',
                  accentColor: '#8b5cf6'
                }}
              />
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '6px',
          padding: '12px'
        }}>
          <h4 style={{ color: '#ffffff', fontSize: '12px', fontWeight: '600', margin: '0 0 8px' }}>
            Filter
          </h4>
          <div style={{ marginBottom: '6px' }}>
            <label style={{
              display: 'block',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '10px',
              marginBottom: '2px'
            }}>
              Cutoff: {currentPreset.filter.frequency}Hz
            </label>
            <input
              type="range"
              min="20"
              max="8000"
              value={currentPreset.filter.frequency}
              onChange={(e) => {
                setCurrentPreset(prev => ({
                  ...prev,
                  filter: {
                    ...prev.filter,
                    frequency: Number(e.target.value)
                  }
                }))
              }}
              style={{
                width: '100%',
                height: '4px',
                accentColor: '#8b5cf6'
              }}
            />
          </div>
          <div>
            <label style={{
              display: 'block',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '10px',
              marginBottom: '2px'
            }}>
              Resonance: {currentPreset.filter.Q.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={currentPreset.filter.Q}
              onChange={(e) => {
                setCurrentPreset(prev => ({
                  ...prev,
                  filter: {
                    ...prev.filter,
                    Q: Number(e.target.value)
                  }
                }))
              }}
              style={{
                width: '100%',
                height: '4px',
                accentColor: '#8b5cf6'
              }}
            />
          </div>
        </div>
      </div>

      {/* Virtual Keyboard */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '6px',
        padding: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h4 style={{ color: '#ffffff', fontSize: '12px', fontWeight: '600', margin: 0 }}>
            Virtual Keyboard
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)' }}>Octave:</label>
            <select
              value={octave}
              onChange={(e) => setOctave(Number(e.target.value))}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '3px',
                color: '#ffffff',
                padding: '2px 6px',
                fontSize: '10px'
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7].map(oct => (
                <option key={oct} value={oct} style={{ background: '#1a1a1a' }}>C{oct}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
          {notes.map((note, index) => {
            const isSharp = note.includes('#')
            const keyPressed = pressedKeys.has(keyboardKeys[index])
            
            return (
              <button
                key={note}
                onMouseDown={() => playNote(`${note}${octave}`)}
                onMouseUp={() => stopNote(`${note}${octave}`)}
                onMouseLeave={() => stopNote(`${note}${octave}`)}
                style={{
                  width: isSharp ? '20px' : '30px',
                  height: isSharp ? '60px' : '80px',
                  background: isSharp 
                    ? keyPressed ? '#8b5cf6' : 'linear-gradient(180deg, #333 0%, #111 100%)'
                    : keyPressed ? '#a855f7' : 'linear-gradient(180deg, #f8f8f8 0%, #e0e0e0 100%)',
                  border: isSharp ? '1px solid #555' : '1px solid #ccc',
                  borderRadius: '0 0 4px 4px',
                  cursor: 'pointer',
                  color: isSharp ? '#ffffff' : '#000000',
                  fontSize: '9px',
                  fontWeight: '500',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingBottom: '4px',
                  marginLeft: isSharp ? '-10px' : '0',
                  marginRight: isSharp ? '-10px' : '0',
                  zIndex: isSharp ? 2 : 1,
                  position: 'relative' as const,
                  userSelect: 'none'
                }}
              >
                <span>{note}</span>
                <span style={{ fontSize: '8px', opacity: 0.6 }}>
                  {keyboardKeys[index]}
                </span>
              </button>
            )
          })}
        </div>
        
        <div style={{ 
          marginTop: '8px', 
          textAlign: 'center', 
          fontSize: '10px', 
          color: 'rgba(255, 255, 255, 0.5)' 
        }}>
          Use keyboard keys or click to play • Status: {isInitialized ? 'Ready' : 'Initializing...'}
        </div>
      </div>
    </div>
  )
}