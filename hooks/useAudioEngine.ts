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
      interval = setInterval(async () => {
        const newState = await audioEngine.getState()
        setState(newState)
      }, 100)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [state.isPlaying, audioEngine])

  // Initial state update
  useEffect(() => {
    audioEngine.getState().then(setState)
  }, [audioEngine])

  const play = useCallback(async () => {
    await audioEngine.play()
    const newState = await audioEngine.getState()
    setState(newState)
  }, [audioEngine])

  const pause = useCallback(async () => {
    await audioEngine.pause()
    const newState = await audioEngine.getState()
    setState(newState)
  }, [audioEngine])

  const stop = useCallback(async () => {
    await audioEngine.stop()
    const newState = await audioEngine.getState()
    setState(newState)
  }, [audioEngine])

  const startRecording = useCallback(async () => {
    await audioEngine.startRecording()
    const newState = await audioEngine.getState()
    setState(newState)
  }, [audioEngine])

  const stopRecording = useCallback(async () => {
    const blob = await audioEngine.stopRecording()
    const newState = await audioEngine.getState()
    setState(newState)
    return blob
  }, [audioEngine])

  const setBPM = useCallback(async (bpm: number) => {
    await audioEngine.setBPM(bpm)
    const newState = await audioEngine.getState()
    setState(newState)
  }, [audioEngine])

  const createTrack = useCallback(async (name: string, type: 'audio' | 'midi' | 'drum' = 'audio') => {
    const trackId = await audioEngine.createTrack(name, type)
    const newState = await audioEngine.getState()
    setState(newState)
    return trackId
  }, [audioEngine])

  const setTrackVolume = useCallback(async (trackId: string, volume: number) => {
    audioEngine.setTrackVolume(trackId, volume)
    const newState = await audioEngine.getState()
    setState(newState)
  }, [audioEngine])

  const setTrackMute = useCallback(async (trackId: string, muted: boolean) => {
    audioEngine.setTrackMute(trackId, muted)
    const newState = await audioEngine.getState()
    setState(newState)
  }, [audioEngine])

  const setTrackSolo = useCallback(async (trackId: string, solo: boolean) => {
    audioEngine.setTrackSolo(trackId, solo)
    const newState = await audioEngine.getState()
    setState(newState)
  }, [audioEngine])

  const playNote = useCallback(async (trackId: string, note: string, duration: string = '8n') => {
    await audioEngine.playNote(trackId, note, duration)
  }, [audioEngine])

  const loadAudioToTrack = useCallback(async (trackId: string, audioUrl: string) => {
    await audioEngine.loadAudioToTrack(trackId, audioUrl)
    const newState = await audioEngine.getState()
    setState(newState)
  }, [audioEngine])

  const addEffect = useCallback(async (trackId: string, effectType: 'reverb' | 'delay' | 'distortion' | 'filter') => {
    await audioEngine.addEffect(trackId, effectType)
    const newState = await audioEngine.getState()
    setState(newState)
  }, [audioEngine])

  const deleteTrack = useCallback(async (trackId: string) => {
    audioEngine.deleteTrack(trackId)
    const newState = await audioEngine.getState()
    setState(newState)
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
    deleteTrack,
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