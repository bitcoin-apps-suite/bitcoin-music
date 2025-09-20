'use client'

import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'

interface WaveformDisplayProps {
  trackId: string
  height?: number
  isActive?: boolean
  audioUrl?: string
}

export default function WaveformDisplay({ 
  trackId, 
  height = 80, 
  isActive = true, 
  audioUrl 
}: WaveformDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<WaveSurfer | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize WaveSurfer
    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: isActive ? '#8b5cf6' : 'rgba(139, 92, 246, 0.3)',
      progressColor: isActive ? '#a855f7' : 'rgba(168, 85, 247, 0.3)',
      barWidth: 2,
      barGap: 1,
      height: height - 20, // Leave some padding
      normalize: true,
      backend: 'WebAudio',
      cursorColor: '#ffffff',
      cursorWidth: 1,
      interact: true
    })

    wavesurferRef.current = wavesurfer

    // Event listeners
    wavesurfer.on('ready', () => {
      setIsLoaded(true)
      setError(null)
    })

    wavesurfer.on('error', (err) => {
      console.error('WaveSurfer error:', err)
      setError('Failed to load audio')
      setIsLoaded(false)
    })

    // Load audio if provided
    if (audioUrl) {
      wavesurfer.load(audioUrl)
    } else {
      // Generate a placeholder waveform for empty tracks
      generatePlaceholderWaveform(wavesurfer)
    }

    return () => {
      wavesurfer.destroy()
    }
  }, [trackId, audioUrl, height])

  // Update colors when isActive changes
  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.setOptions({
        waveColor: isActive ? '#8b5cf6' : 'rgba(139, 92, 246, 0.3)',
        progressColor: isActive ? '#a855f7' : 'rgba(168, 85, 247, 0.3)'
      })
    }
  }, [isActive])

  const generatePlaceholderWaveform = (wavesurfer: WaveSurfer) => {
    // Create a simple sine wave for placeholder
    const sampleRate = 44100
    const duration = 10 // 10 seconds
    const samples = sampleRate * duration
    const buffer = new Float32Array(samples)

    for (let i = 0; i < samples; i++) {
      // Generate a simple sine wave with some randomness
      const time = i / sampleRate
      buffer[i] = Math.sin(time * 440 * 2 * Math.PI) * 0.1 * (Math.random() * 0.5 + 0.5)
    }

    // Create AudioBuffer
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const audioBuffer = audioContext.createBuffer(1, samples, sampleRate)
    audioBuffer.getChannelData(0).set(buffer)

    // Load the generated buffer
    // @ts-ignore - loadDecodedBuffer exists but not in types
    wavesurfer.loadDecodedBuffer?.(audioBuffer)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (wavesurferRef.current && isLoaded) {
      const rect = containerRef.current?.getBoundingClientRect()
      if (rect) {
        const x = e.clientX - rect.left
        const progress = x / rect.width
        wavesurferRef.current.seekTo(progress)
      }
    }
  }

  if (error) {
    return (
      <div style={{
        width: '100%',
        height: `${height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(239, 68, 68, 0.7)',
        fontSize: '12px',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px dashed rgba(239, 68, 68, 0.3)'
      }}>
        {error}
      </div>
    )
  }

  return (
    <div style={{
      width: '100%',
      height: `${height}px`,
      position: 'relative',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      padding: '10px'
    }}>
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.5)',
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '12px',
          zIndex: 10
        }}>
          {audioUrl ? 'Loading audio...' : 'Drop audio file or click to upload'}
        </div>
      )}
      
      <div 
        ref={containerRef} 
        onClick={handleClick}
        style={{
          width: '100%',
          height: '100%'
        }}
      />

      {/* Timeline grid overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        background: `repeating-linear-gradient(
          to right,
          transparent 0px,
          transparent 79px,
          rgba(255, 255, 255, 0.1) 80px
        )`
      }} />
    </div>
  )
}