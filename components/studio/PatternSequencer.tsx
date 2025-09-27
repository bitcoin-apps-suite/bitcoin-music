'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Square, RotateCcw, Volume2 } from 'lucide-react'
import { Scale, Chord } from 'tonal'
import { useAudioEngine } from '@/hooks/useAudioEngine'

interface Pattern {
  id: string
  name: string
  steps: boolean[]
  notes: string[]
  velocity: number[]
  length: number
}

interface PatternSequencerProps {
  trackId: string
  scale?: string
  rootNote?: string
}

export default function PatternSequencer({ 
  trackId, 
  scale = 'major', 
  rootNote = 'C4' 
}: PatternSequencerProps) {
  const { playNote } = useAudioEngine()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [pattern, setPattern] = useState<Pattern>({
    id: 'pattern_1',
    name: 'Pattern 1',
    steps: new Array(16).fill(false),
    notes: new Array(16).fill(rootNote),
    velocity: new Array(16).fill(127),
    length: 16
  })
  const [selectedNote, setSelectedNote] = useState(rootNote)
  const [bpm, setBpm] = useState(120)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Generate scale notes for selection
  const scaleNotes = Scale.get(`${rootNote.slice(0, -1)} ${scale}`).notes.map((note, index) => {
    const octave = parseInt(rootNote.slice(-1))
    return `${note}${index > 6 ? octave + 1 : octave}`
  })

  // Start/stop pattern playback
  const togglePlayback = () => {
    if (isPlaying) {
      stopPlayback()
    } else {
      startPlayback()
    }
  }

  const startPlayback = () => {
    const stepDuration = (60 / bpm / 4) * 1000 // 16th notes in ms
    
    intervalRef.current = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = (prev + 1) % pattern.length
        
        // Play note if step is active
        if (pattern.steps[prev]) {
          const note = pattern.notes[prev]
          const velocity = pattern.velocity[prev] / 127
          playNote(trackId, note, '16n')
        }
        
        return nextStep
      })
    }, stepDuration)
    
    setIsPlaying(true)
  }

  const stopPlayback = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsPlaying(false)
    setCurrentStep(0)
  }

  const toggleStep = (stepIndex: number) => {
    setPattern(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => 
        i === stepIndex ? !step : step
      ),
      notes: prev.notes.map((note, i) => 
        i === stepIndex ? selectedNote : note
      )
    }))
  }

  const setStepVelocity = (stepIndex: number, velocity: number) => {
    setPattern(prev => ({
      ...prev,
      velocity: prev.velocity.map((vel, i) => 
        i === stepIndex ? velocity : vel
      )
    }))
  }

  const clearPattern = () => {
    setPattern(prev => ({
      ...prev,
      steps: new Array(16).fill(false),
      velocity: new Array(16).fill(127)
    }))
  }

  const randomizePattern = () => {
    setPattern(prev => ({
      ...prev,
      steps: new Array(16).fill(false).map(() => Math.random() > 0.7),
      notes: new Array(16).fill(false).map(() => 
        scaleNotes[Math.floor(Math.random() * scaleNotes.length)]
      ),
      velocity: new Array(16).fill(false).map(() => 
        Math.floor(Math.random() * 64) + 64
      )
    }))
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

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
          fontSize: '14px',
          fontWeight: '600',
          margin: 0
        }}>
          Pattern Sequencer - {pattern.name}
        </h3>

        {/* Transport Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={togglePlayback}
            style={{
              width: '32px',
              height: '32px',
              background: isPlaying ? '#ef4444' : '#22c55e',
              border: 'none',
              borderRadius: '4px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>

          <button
            onClick={stopPlayback}
            style={{
              width: '32px',
              height: '32px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '4px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Square size={16} />
          </button>

          <button
            onClick={clearPattern}
            style={{
              width: '32px',
              height: '32px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '4px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Clear Pattern"
          >
            <RotateCcw size={16} />
          </button>

          <button
            onClick={randomizePattern}
            style={{
              padding: '8px 12px',
              background: 'rgba(139, 92, 246, 0.2)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '4px',
              color: '#8b5cf6',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Randomize
          </button>
        </div>
      </div>

      {/* Pattern Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '16px'
      }}>
        {/* BPM */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
            BPM:
          </label>
          <input
            type="number"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            min="60"
            max="200"
            style={{
              width: '60px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              color: '#ffffff',
              padding: '4px 8px',
              fontSize: '12px'
            }}
          />
        </div>

        {/* Scale Selection */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
            Note:
          </label>
          <select
            value={selectedNote}
            onChange={(e) => setSelectedNote(e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              color: '#ffffff',
              padding: '4px 8px',
              fontSize: '12px'
            }}
          >
            {scaleNotes.map(note => (
              <option key={note} value={note} style={{ background: '#1a1a1a' }}>
                {note}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Step Sequencer Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(16, 1fr)',
        gap: '4px',
        marginBottom: '16px'
      }}>
        {pattern.steps.map((isActive, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {/* Step Button */}
            <button
              onClick={() => toggleStep(index)}
              style={{
                width: '32px',
                height: '32px',
                background: isActive 
                  ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)'
                  : currentStep === index 
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(255, 255, 255, 0.1)',
                border: currentStep === index ? '2px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '10px',
                fontWeight: '600',
                transition: 'all 0.1s'
              }}
            >
              {index + 1}
            </button>

            {/* Velocity Slider (only visible when step is active) */}
            {isActive && (
              <input
                type="range"
                min="1"
                max="127"
                value={pattern.velocity[index]}
                onChange={(e) => setStepVelocity(index, Number(e.target.value))}
                style={{
                  width: '32px',
                  height: '8px',
                  accentColor: '#8b5cf6',
                  transform: 'rotate(270deg)',
                  transformOrigin: 'center'
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Beat Indicators */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '4px',
        marginTop: '8px'
      }}>
        {[1, 2, 3, 4].map(beat => (
          <div key={beat} style={{
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '10px',
            fontWeight: '600'
          }}>
            Beat {beat}
          </div>
        ))}
      </div>
    </div>
  )
}