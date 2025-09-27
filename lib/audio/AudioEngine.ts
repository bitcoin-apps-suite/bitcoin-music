'use client'

import { getTone, initializeTone } from './ToneWrapper'

export interface Track {
  id: string
  name: string
  volume: number
  muted: boolean
  solo: boolean
  instrument: any | null
  effects: any[]
  channel: any
}

export interface AudioEngineState {
  isPlaying: boolean
  isRecording: boolean
  bpm: number
  position: string
  tracks: Track[]
}

class AudioEngine {
  private static instance: AudioEngine
  private initialized = false
  private tracks: Map<string, Track> = new Map()
  private mainOut: any = null
  private recorder: any = null
  private metronome: any = null
  private masterCompressor: any = null
  private masterLimiter: any = null
  private mediaRecorder: MediaRecorder | null = null
  private recordedChunks: Blob[] = []
  
  constructor() {
    // Constructor will initialize Tone.js dynamically
  }

  static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine()
    }
    return AudioEngine.instance
  }

  async initialize() {
    if (this.initialized) return

    try {
      // Initialize Tone.js
      const initialized = await initializeTone()
      if (!initialized) {
        console.warn('Running without Tone.js audio engine')
        this.initialized = true
        return
      }

      const Tone = await getTone()
      if (!Tone) {
        this.initialized = true
        return
      }

      // Set up master chain
      this.masterCompressor = new Tone.Compressor(-20, 10)
      this.masterLimiter = new Tone.Limiter(-3)
      this.mainOut = Tone.Destination
      
      // Connect master chain
      this.masterCompressor.connect(this.masterLimiter)
      this.masterLimiter.connect(this.mainOut)

      // Initialize transport
      Tone.Transport.bpm.value = 120
      
      // Set up metronome
      this.metronome = new Tone.Oscillator(800, 'sine').toDestination()
      this.metronome.volume.value = -10
      this.metronome.stop() // Start stopped

      this.initialized = true
      console.log('Tone.js audio engine initialized')
    } catch (error) {
      console.error('Failed to initialize audio:', error)
      this.initialized = true
    }
  }

  // Transport Controls
  async play() {
    await this.initialize()
    const Tone = await getTone()
    if (Tone && Tone.Transport) {
      await Tone.Transport.start()
      console.log('Transport started')
    }
    return true
  }

  async pause() {
    const Tone = await getTone()
    if (Tone && Tone.Transport) {
      Tone.Transport.pause()
      console.log('Transport paused')
    }
  }

  async stop() {
    const Tone = await getTone()
    if (Tone && Tone.Transport) {
      Tone.Transport.stop()
      Tone.Transport.position = 0
      console.log('Transport stopped')
    }
  }

  async startRecording() {
    await this.initialize()
    
    try {
      const Tone = await getTone()
      // Use Web Audio API MediaRecorder
      if (Tone && Tone.context) {
        const dest = Tone.context.createMediaStreamDestination()
        this.mainOut.connect(dest)
        
        this.recordedChunks = []
        this.mediaRecorder = new MediaRecorder(dest.stream)
        
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.recordedChunks.push(event.data)
          }
        }
        
        this.mediaRecorder.start()
        console.log('Recording started')
      }
    } catch (error) {
      console.error('Failed to start recording:', error)
    }
    
    this.play()
  }

  async stopRecording(): Promise<Blob | null> {
    this.stop()
    
    return new Promise((resolve) => {
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.recordedChunks, { type: 'audio/wav' })
          this.recordedChunks = []
          console.log('Recording stopped')
          resolve(blob)
        }
        this.mediaRecorder.stop()
      } else {
        resolve(null)
      }
    })
  }

  // Track Management
  async createTrack(name: string, type: 'audio' | 'midi' | 'drum' = 'audio'): Promise<string> {
    const id = `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    let channel = null
    let instrument = null
    
    const Tone = await getTone()
    if (Tone) {
      // Create channel strip (using Gain and Panner nodes)
      const gainNode = new Tone.Gain(1)
      const panNode = new Tone.Panner(0)
      gainNode.connect(panNode)
      channel = {
        gain: gainNode,
        panner: panNode,
        connect: (destination: any) => panNode.connect(destination),
        disconnect: () => {
          gainNode.disconnect()
          panNode.disconnect()
        },
        dispose: () => {
          gainNode.dispose()
          panNode.dispose()
        },
        set volume(value: number) {
          gainNode.gain.value = Tone.dbToGain(value)
        },
        get volume() {
          return Tone.gainToDb(gainNode.gain.value)
        },
        set pan(value: number) {
          panNode.pan.value = value
        },
        get pan() {
          return panNode.pan.value
        },
        set mute(value: boolean) {
          gainNode.mute = value
        },
        get mute() {
          return gainNode.mute
        }
      }
      
      // Create instrument based on type
      if (type === 'midi') {
        instrument = new Tone.PolySynth({
          oscillator: { type: 'sine' },
          envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 1 }
        })
        instrument.connect(channel.gain)
      } else if (type === 'drum') {
        instrument = new Tone.Sampler({
          urls: {
            C4: 'https://tonejs.github.io/audio/drum-samples/kick.mp3',
            D4: 'https://tonejs.github.io/audio/drum-samples/snare.mp3',
            E4: 'https://tonejs.github.io/audio/drum-samples/hihat-closed.mp3'
          }
        })
        instrument.connect(channel.gain)
      }
      
      if (this.masterCompressor) {
        channel.connect(this.masterCompressor)
      }
    }

    const track: Track = {
      id,
      name,
      volume: 0,
      muted: false,
      solo: false,
      instrument,
      effects: [],
      channel
    }

    this.tracks.set(id, track)
    console.log(`Created ${type} track "${name}" with id ${id}`)
    return id
  }

  getTrack(id: string): Track | undefined {
    return this.tracks.get(id)
  }

  getAllTracks(): Track[] {
    return Array.from(this.tracks.values())
  }

  deleteTrack(id: string) {
    const track = this.tracks.get(id)
    if (track) {
      // Dispose of track resources
      if (track.instrument && track.instrument.dispose) {
        track.instrument.dispose()
      }
      if (track.channel && track.channel.dispose) {
        track.channel.dispose()
      }
      track.effects.forEach(effect => {
        if (effect && effect.dispose) effect.dispose()
      })
      
      this.tracks.delete(id)
      console.log(`Deleted track ${id}`)
    }
  }

  // Track Controls
  setTrackVolume(trackId: string, volume: number) {
    const track = this.tracks.get(trackId)
    if (track) {
      track.volume = volume
      if (track.channel) {
        track.channel.volume = volume
      }
      console.log(`Set track ${trackId} volume to ${volume}dB`)
    }
  }

  setTrackMute(trackId: string, muted: boolean) {
    const track = this.tracks.get(trackId)
    if (track) {
      track.muted = muted
      if (track.channel) {
        track.channel.mute = muted
      }
      console.log(`${muted ? 'Muted' : 'Unmuted'} track ${trackId}`)
    }
  }

  setTrackSolo(trackId: string, solo: boolean) {
    const track = this.tracks.get(trackId)
    if (track) {
      track.solo = solo
      
      // Handle solo logic
      const hasSoloedTracks = Array.from(this.tracks.values()).some(t => t.solo)
      
      this.tracks.forEach((t) => {
        if (t.channel) {
          if (hasSoloedTracks) {
            t.channel.mute = !t.solo
          } else {
            t.channel.mute = t.muted
          }
        }
      })
      
      console.log(`${solo ? 'Soloed' : 'Unsoloed'} track ${trackId}`)
    }
  }

  // Audio Loading
  async loadAudioToTrack(trackId: string, audioUrl: string) {
    const track = this.tracks.get(trackId)
    const Tone = await getTone()
    if (track && Tone) {
      try {
        const player = new Tone.Player(audioUrl)
        await player.load()
        if (track.channel) {
          player.connect(track.channel.gain)
        }
        track.instrument = player
        console.log(`Loaded audio to track ${trackId}`)
      } catch (error) {
        console.error(`Failed to load audio to track ${trackId}:`, error)
      }
    }
  }

  // MIDI Playback
  async playNote(trackId: string, note: string, duration: string = '8n', time?: number) {
    const track = this.tracks.get(trackId)
    const Tone = await getTone()
    if (track && track.instrument && Tone) {
      const playTime = time !== undefined ? time : Tone.now()
      
      if (track.instrument.triggerAttackRelease) {
        track.instrument.triggerAttackRelease(note, duration, playTime)
      } else if (track.instrument.start) {
        track.instrument.start(playTime)
      }
      
      console.log(`Playing note ${note} on track ${trackId}`)
    }
  }

  // Effects
  async addEffect(trackId: string, effectType: 'reverb' | 'delay' | 'distortion' | 'filter') {
    const track = this.tracks.get(trackId)
    const Tone = await getTone()
    if (!track || !Tone) return

    let effect = null
    
    switch (effectType) {
      case 'reverb':
        effect = new Tone.Reverb(2)
        break
      case 'delay':
        effect = new Tone.Delay(0.25)
        break
      case 'distortion':
        effect = new Tone.Distortion(0.4)
        break
      case 'filter':
        effect = new Tone.Filter(350, 'lowpass')
        break
    }
    
    if (effect && track.channel && this.masterCompressor) {
      // Insert effect in channel chain
      track.channel.panner.disconnect()
      track.channel.panner.connect(effect)
      effect.connect(this.masterCompressor)
      track.effects.push(effect)
      console.log(`Added ${effectType} effect to track ${trackId}`)
    }
  }

  // Transport Control
  async setBPM(bpm: number) {
    const Tone = await getTone()
    if (Tone && Tone.Transport) {
      Tone.Transport.bpm.value = bpm
    }
    console.log(`Set BPM to ${bpm}`)
  }

  async getBPM(): Promise<number> {
    const Tone = await getTone()
    if (Tone && Tone.Transport) {
      return Tone.Transport.bpm.value
    }
    return 120
  }

  async getPosition(): Promise<string> {
    const Tone = await getTone()
    if (Tone && Tone.Transport) {
      return Tone.Transport.position.toString()
    }
    return '0:0:0'
  }

  async setPosition(position: string) {
    const Tone = await getTone()
    if (Tone && Tone.Transport) {
      Tone.Transport.position = position
    }
    console.log(`Set position to ${position}`)
  }

  // Loop Control
  async setLoop(start: string, end: string) {
    const Tone = await getTone()
    if (Tone && Tone.Transport) {
      Tone.Transport.loop = true
      Tone.Transport.loopStart = start
      Tone.Transport.loopEnd = end
    }
    console.log(`Set loop from ${start} to ${end}`)
  }

  async disableLoop() {
    const Tone = await getTone()
    if (Tone && Tone.Transport) {
      Tone.Transport.loop = false
    }
    console.log('Disabled loop')
  }

  // Metronome
  async toggleMetronome(enabled: boolean) {
    const Tone = await getTone()
    if (!Tone || !this.metronome) return
    
    if (enabled) {
      // Create a loop for metronome clicks
      const loop = new Tone.Loop((time: number) => {
        this.metronome.start(time).stop(time + 0.1)
      }, '4n')
      loop.start(0)
    } else {
      // Stop metronome
      if (this.metronome) {
        this.metronome.stop()
      }
    }
    
    console.log(`Metronome ${enabled ? 'enabled' : 'disabled'}`)
  }

  // State
  async getState(): Promise<AudioEngineState> {
    const Tone = await getTone()
    const isPlaying = Tone && Tone.Transport ? Tone.Transport.state === 'started' : false
    const isRecording = this.mediaRecorder ? this.mediaRecorder.state === 'recording' : false
    
    return {
      isPlaying,
      isRecording,
      bpm: await this.getBPM(),
      position: await this.getPosition(),
      tracks: this.getAllTracks()
    }
  }

  // Cleanup
  async dispose() {
    const Tone = await getTone()
    if (Tone) {
      // Stop transport
      if (Tone.Transport) {
        Tone.Transport.stop()
        Tone.Transport.cancel()
      }
      
      // Dispose all tracks
      this.tracks.forEach(track => {
        if (track.instrument && track.instrument.dispose) track.instrument.dispose()
        if (track.channel && track.channel.dispose) track.channel.dispose()
        track.effects.forEach(effect => {
          if (effect && effect.dispose) effect.dispose()
        })
      })
      
      // Dispose master chain
      if (this.masterCompressor && this.masterCompressor.dispose) this.masterCompressor.dispose()
      if (this.masterLimiter && this.masterLimiter.dispose) this.masterLimiter.dispose()
      if (this.metronome && this.metronome.dispose) this.metronome.dispose()
    }
    
    this.tracks.clear()
    this.initialized = false
    console.log('Audio engine disposed')
  }
}

export default AudioEngine