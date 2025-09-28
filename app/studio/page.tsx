'use client'

import { useState, useRef, useEffect } from 'react'
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
  Headphones,
  Settings,
  Waves,
  Keyboard,
  Cable,
  TrendingUp
} from 'lucide-react'
import { useAudioEngine } from '@/hooks/useAudioEngine'
import MultiTrackEditor from '@/components/studio/MultiTrackEditor'
import PatternSequencer from '@/components/studio/PatternSequencer'
import ModularRack from '@/components/studio/ModularRack'
import AutomationEditor from '@/components/studio/AutomationEditor'
import AdvancedSynth from '@/components/studio/AdvancedSynth'
import TrackMixer from '@/components/studio/TrackMixer'

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
  const [activeView, setActiveView] = useState<'classic' | 'multitrack' | 'patterns' | 'synth' | 'rack' | 'automation'>('classic')
  const [showAdvancedPanel, setShowAdvancedPanel] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  
  const { 
    tracks: engineTracks, 
    createTrack, 
    deleteTrack: removeTrack,
    play,
    stop,
    pause,
    startRecording: startEngineRecording,
    stopRecording: stopEngineRecording,
    setBPM
  } = useAudioEngine()

  useEffect(() => {
    setBPM(bpm)
  }, [bpm, setBPM])

  const handlePlay = async () => {
    if (isPlaying) {
      await pause()
      setIsPlaying(false)
    } else {
      await play()
      setIsPlaying(true)
    }
  }

  const handleStop = async () => {
    await stop()
    setIsPlaying(false)
    setCurrentTime('00:00:00')
  }

  const handleRecord = async () => {
    if (isRecording) {
      await stopEngineRecording()
      setIsRecording(false)
    } else {
      await startEngineRecording()
      setIsRecording(true)
    }
  }

  const handleAddTrack = async (type: 'audio' | 'midi' | 'drum' = 'audio') => {
    const trackId = await createTrack(`Track ${engineTracks.length + 1}`, type)
    console.log('Created track:', trackId)
  }

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

  const renderMainContent = () => {
    if (activeView === 'classic') {
      // Original UI
      return (
        <>
          <div className="glass-morphism rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Transport Controls</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePlay}
                  className="p-3 bg-bitcoin-orange rounded-full hover:bg-yellow-600 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white" />
                  )}
                </button>
                
                <button
                  onClick={handleStop}
                  className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
                >
                  <Square className="w-6 h-6 text-white" />
                </button>
                
                <button
                  onClick={handleRecord}
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
                  onClick={() => handleAddTrack('audio')}
                  className="flex items-center space-x-2 px-3 py-2 bg-bitcoin-orange rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span className="text-white text-sm">Add Track</span>
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              {engineTracks.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No tracks yet. Add a track to get started.
                </div>
              ) : (
                engineTracks.map((track) => (
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
                            removeTrack(track.id)
                          }}
                          className="p-2 bg-white/10 rounded-lg text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </>
      )
    }
    
    // New DAW views
    switch (activeView) {
      case 'multitrack':
        return (
          <div className="glass-morphism rounded-xl p-6">
            <MultiTrackEditor tracks={engineTracks} />
          </div>
        )
      case 'patterns':
        return (
          <div className="glass-morphism rounded-xl p-6">
            {selectedTrack ? (
              <PatternSequencer trackId={selectedTrack} />
            ) : (
              <div className="text-center py-8 text-gray-400">
                Select a track to use the pattern sequencer
              </div>
            )}
          </div>
        )
      case 'synth':
        return (
          <div className="glass-morphism rounded-xl p-6">
            <AdvancedSynth />
          </div>
        )
      case 'rack':
        return (
          <div className="glass-morphism rounded-xl p-6">
            <ModularRack />
          </div>
        )
      case 'automation':
        return (
          <div className="glass-morphism rounded-xl p-6">
            {selectedTrack ? (
              <AutomationEditor trackId={selectedTrack} duration={60} />
            ) : (
              <div className="text-center py-8 text-gray-400">
                Select a track to edit automation
              </div>
            )}
          </div>
        )
      default:
        return null
    }
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

        {/* View Selector - Subtle integration */}
        <div className="flex items-center space-x-2 mb-6 glass-morphism rounded-lg p-1">
          <button
            onClick={() => setActiveView('classic')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              activeView === 'classic'
                ? 'bg-bitcoin-orange text-white'
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            <Music className="w-4 h-4" />
            <span className="text-sm">Classic</span>
          </button>
          
          <div className="h-5 w-px bg-white/20" />
          
          <button
            onClick={() => setActiveView('multitrack')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              activeView === 'multitrack'
                ? 'bg-bitcoin-orange text-white'
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="text-sm">Multitrack</span>
          </button>
          
          <button
            onClick={() => setActiveView('patterns')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              activeView === 'patterns'
                ? 'bg-bitcoin-orange text-white'
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            <Waves className="w-4 h-4" />
            <span className="text-sm">Patterns</span>
          </button>
          
          <button
            onClick={() => setActiveView('synth')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              activeView === 'synth'
                ? 'bg-bitcoin-orange text-white'
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            <Keyboard className="w-4 h-4" />
            <span className="text-sm">Synthesizer</span>
          </button>
          
          <button
            onClick={() => setActiveView('rack')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              activeView === 'rack'
                ? 'bg-bitcoin-orange text-white'
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            <Cable className="w-4 h-4" />
            <span className="text-sm">Modular</span>
          </button>
          
          <button
            onClick={() => setActiveView('automation')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              activeView === 'automation'
                ? 'bg-bitcoin-orange text-white'
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Automation</span>
          </button>
          
          <div className="flex-1" />
          
          <button
            onClick={() => setShowAdvancedPanel(!showAdvancedPanel)}
            className="p-2 text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {renderMainContent()}
          </div>

          <div className="space-y-6">
            {/* Track mixer */}
            <TrackMixer tracks={tracks} onUpdateTrack={updateTrack} />
            
            {/* Advanced controls panel */}
            {showAdvancedPanel && (
              <div className="glass-morphism rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Advanced Controls</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleAddTrack('midi')}
                    className="w-full flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Keyboard className="w-4 h-4 text-gray-300" />
                    <span className="text-gray-300 text-sm">Add MIDI Track</span>
                  </button>
                  
                  <button
                    onClick={() => handleAddTrack('drum')}
                    className="w-full flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Music className="w-4 h-4 text-gray-300" />
                    <span className="text-gray-300 text-sm">Add Drum Track</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}