'use client'

import { useState, useEffect, useCallback } from 'react'
import AudioEngine, { AudioEngineState } from '@/lib/audio/AudioEngine'

export function useAudioEngine() {
  const [audioEngine] = useState(() => AudioEngine.getInstance())
  const [state, setState] = useState<AudioEngineState>({
    isPlaying: false,
    isRecording: false,
    bpm: 120,
    position: '0:0:0',
    tracks: []
  })

  // Update state every 100ms when playing
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (state.isPlaying) {
      interval = setInterval(() => {
        setState(audioEngine.getState())
      }, 100)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [state.isPlaying, audioEngine])

  // Initial state update
  useEffect(() => {
    setState(audioEngine.getState())
  }, [audioEngine])

  const play = useCallback(async () => {
    await audioEngine.play()
    setState(audioEngine.getState())
  }, [audioEngine])

  const pause = useCallback(() => {
    audioEngine.pause()
    setState(audioEngine.getState())
  }, [audioEngine])

  const stop = useCallback(() => {
    audioEngine.stop()
    setState(audioEngine.getState())
  }, [audioEngine])

  const startRecording = useCallback(async () => {
    await audioEngine.startRecording()
    setState(audioEngine.getState())
  }, [audioEngine])

  const stopRecording = useCallback(async () => {
    const blob = await audioEngine.stopRecording()
    setState(audioEngine.getState())
    return blob
  }, [audioEngine])

  const setBPM = useCallback((bpm: number) => {
    audioEngine.setBPM(bpm)
    setState(audioEngine.getState())
  }, [audioEngine])

  const createTrack = useCallback((name: string, type: 'audio' | 'midi' | 'drum' = 'audio') => {
    const trackId = audioEngine.createTrack(name, type)
    setState(audioEngine.getState())
    return trackId
  }, [audioEngine])

  const setTrackVolume = useCallback((trackId: string, volume: number) => {
    audioEngine.setTrackVolume(trackId, volume)
    setState(audioEngine.getState())
  }, [audioEngine])

  const setTrackMute = useCallback((trackId: string, muted: boolean) => {
    audioEngine.setTrackMute(trackId, muted)
    setState(audioEngine.getState())
  }, [audioEngine])

  const setTrackSolo = useCallback((trackId: string, solo: boolean) => {
    audioEngine.setTrackSolo(trackId, solo)
    setState(audioEngine.getState())
  }, [audioEngine])

  const playNote = useCallback((trackId: string, note: string, duration: string = '8n') => {
    audioEngine.playNote(trackId, note, duration)
  }, [audioEngine])

  const loadAudioToTrack = useCallback(async (trackId: string, audioUrl: string) => {
    await audioEngine.loadAudioToTrack(trackId, audioUrl)
    setState(audioEngine.getState())
  }, [audioEngine])

  const addEffect = useCallback((trackId: string, effectType: 'reverb' | 'delay' | 'distortion' | 'filter') => {
    audioEngine.addEffect(trackId, effectType)
    setState(audioEngine.getState())
  }, [audioEngine])

  return {
    // State
    ...state,
    
    // Transport controls
    play,
    pause,
    stop,
    startRecording,
    stopRecording,
    setBPM,
    
    // Track management
    createTrack,
    setTrackVolume,
    setTrackMute,
    setTrackSolo,
    loadAudioToTrack,
    
    // MIDI
    playNote,
    
    // Effects
    addEffect,
    
    // Raw engine access for advanced features
    audioEngine
  }
}