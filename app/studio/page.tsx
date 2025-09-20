'use client'

import { useState, useRef, useEffect } from 'react'
import * as Tone from 'tone'
import WaveSurfer from 'wavesurfer.js'
import { 
  Play, 
  Pause, 
  Square, 
  Mic, 
  Upload, 
  Download,
  Plus,
  Trash2,
  Volume2,
  Sliders,
  Layers,
  Save,
  Share2,
  Music,
  Clock,
  Headphones
} from 'lucide-react'
import MusicSequencer from '@/components/studio/MusicSequencer'
import TrackMixer from '@/components/studio/TrackMixer'
import InstrumentPanel from '@/components/studio/InstrumentPanel'

interface Track {
  id: string
  name: string
  audio?: Blob
  volume: number
  pan: number
  muted: boolean
  solo: boolean
  effects: string[]
}

export default function StudioPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [tracks, setTracks] = useState<Track[]>([])
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null)
  const [bpm, setBpm] = useState(120)
  const [currentTime, setCurrentTime] = useState('00:00:00')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    Tone.Transport.bpm.value = bpm
    return () => {
      Tone.Transport.stop()
      Tone.Transport.cancel()
    }
  }, [bpm])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' })
        addTrack('Recorded Audio', blob)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
  }

  const addTrack = (name: string, audio?: Blob) => {
    const newTrack: Track = {
      id: Date.now().toString(),
      name,
      audio,
      volume: 0,
      pan: 0,
      muted: false,
      solo: false,
      effects: []
    }
    setTracks([...tracks, newTrack])
  }

  const deleteTrack = (id: string) => {
    setTracks(tracks.filter(track => track.id !== id))
  }

  const updateTrack = (id: string, updates: Partial<Track>) => {
    setTracks(tracks.map(track => 
      track.id === id ? { ...track, ...updates } : track
    ))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      addTrack(file.name, file as any)
    }
  }

  const exportProject = async () => {
    console.log('Exporting project...')
  }

  const mintAsNFT = async () => {
    console.log('Minting as NFT...')
  }

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-full mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Music className="w-8 h-8 text-bitcoin-orange" />
            <h1 className="text-3xl font-bold text-white">Music Studio</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 glass-morphism px-4 py-2 rounded-lg">
              <Clock className="w-5 h-5 text-gray-300" />
              <span className="text-white font-mono">{currentTime}</span>
            </div>
            
            <div className="flex items-center space-x-2 glass-morphism px-4 py-2 rounded-lg">
              <span className="text-gray-300">BPM:</span>
              <input
                type="number"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-16 bg-transparent text-white text-center focus:outline-none"
                min="60"
                max="200"
              />
            </div>
            
            <button
              onClick={exportProject}
              className="flex items-center space-x-2 px-4 py-2 glass-morphism rounded-lg hover:bg-white/20 transition-colors"
            >
              <Download className="w-5 h-5 text-gray-300" />
              <span className="text-gray-300">Export</span>
            </button>
            
            <button
              onClick={mintAsNFT}
              className="flex items-center space-x-2 px-4 py-2 bg-bitcoin-orange rounded-lg hover:bg-yellow-600 transition-colors"
            >
              <Share2 className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">Mint NFT</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-morphism rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Transport Controls</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-3 bg-bitcoin-orange rounded-full hover:bg-yellow-600 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsPlaying(false)
                      setCurrentTime('00:00:00')
                    }}
                    className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
                  >
                    <Square className="w-6 h-6 text-white" />
                  </button>
                  
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-3 rounded-full transition-colors ${
                      isRecording 
                        ? 'bg-red-500 animate-pulse hover:bg-red-600' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <Mic className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
              
              <div className="w-full h-32 bg-black/30 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Waveform display</span>
              </div>
            </div>

            <div className="glass-morphism rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Tracks</h2>
                <div className="flex items-center space-x-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Upload className="w-4 h-4 text-gray-300" />
                    <span className="text-gray-300 text-sm">Import</span>
                  </button>
                  
                  <button
                    onClick={() => addTrack(`Track ${tracks.length + 1}`)}
                    className="flex items-center space-x-2 px-3 py-2 bg-bitcoin-orange rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-white" />
                    <span className="text-white text-sm">Add Track</span>
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                {tracks.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    No tracks yet. Add a track to get started.
                  </div>
                ) : (
                  tracks.map((track) => (
                    <div
                      key={track.id}
                      className={`p-4 rounded-lg border transition-all ${
                        selectedTrack === track.id
                          ? 'bg-bitcoin-orange/20 border-bitcoin-orange'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                      onClick={() => setSelectedTrack(track.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Layers className="w-5 h-5 text-gray-300" />
                          <span className="text-white font-medium">{track.name}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              updateTrack(track.id, { muted: !track.muted })
                            }}
                            className={`p-2 rounded-lg transition-colors ${
                              track.muted 
                                ? 'bg-red-500/20 text-red-400' 
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              updateTrack(track.id, { solo: !track.solo })
                            }}
                            className={`p-2 rounded-lg transition-colors ${
                              track.solo 
                                ? 'bg-yellow-500/20 text-yellow-400' 
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                          >
                            <Headphones className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteTrack(track.id)
                            }}
                            className="p-2 bg-white/10 rounded-lg text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {track.audio && (
                        <div className="mt-2 h-12 bg-black/30 rounded-lg flex items-center px-2">
                          <div className="w-full h-1 bg-bitcoin-orange/30 rounded-full">
                            <div className="h-full w-1/3 bg-bitcoin-orange rounded-full" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <MusicSequencer />
          </div>

          <div className="space-y-6">
            <TrackMixer tracks={tracks} onUpdateTrack={updateTrack} />
            <InstrumentPanel />
          </div>
        </div>
      </div>
    </div>
  )
}