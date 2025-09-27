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
  Waves,
  Cable,
  TrendingUp,
  Keyboard
} from 'lucide-react'
import { useAudioEngine } from '@/hooks/useAudioEngine'
import MultiTrackEditor from '@/components/studio/MultiTrackEditor'
import PatternSequencer from '@/components/studio/PatternSequencer'
import ModularRack from '@/components/studio/ModularRack'
import AutomationEditor from '@/components/studio/AutomationEditor'
import AdvancedSynth from '@/components/studio/AdvancedSynth'

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
  const [activeView, setActiveView] = useState<'tracks' | 'patterns' | 'synth' | 'rack' | 'automation'>('tracks')
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

  const exportProject = async () => {
    console.log('Exporting project...')
  }

  const mintAsNFT = async () => {
    console.log('Minting as NFT...')
  }

  const renderMainContent = () => {
    switch (activeView) {
      case 'tracks':
        return <MultiTrackEditor tracks={engineTracks} />
      case 'patterns':
        return selectedTrack ? (
          <PatternSequencer trackId={selectedTrack} />
        ) : (
          <div style={{ 
            height: '400px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'rgba(255, 255, 255, 0.5)'
          }}>
            Select a track to use the pattern sequencer
          </div>
        )
      case 'synth':
        return <AdvancedSynth />
      case 'rack':
        return <ModularRack />
      case 'automation':
        return selectedTrack ? (
          <AutomationEditor trackId={selectedTrack} duration={60} />
        ) : (
          <div style={{ 
            height: '400px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'rgba(255, 255, 255, 0.5)'
          }}>
            Select a track to edit automation
          </div>
        )
      default:
        return <MultiTrackEditor tracks={engineTracks} />
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

        {/* View Tabs */}
        <div className="flex items-center space-x-2 mb-6 glass-morphism rounded-lg p-2">
          {[
            { id: 'tracks', label: 'Tracks', icon: Layers },
            { id: 'patterns', label: 'Patterns', icon: Music },
            { id: 'synth', label: 'Synthesizer', icon: Keyboard },
            { id: 'rack', label: 'Modular Rack', icon: Cable },
            { id: 'automation', label: 'Automation', icon: TrendingUp }
          ].map(view => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeView === view.id
                  ? 'bg-bitcoin-orange text-white'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <view.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{view.label}</span>
            </button>
          ))}
        </div>

        {/* Transport Controls */}
        <div className="glass-morphism rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
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

              <button
                onClick={() => handleAddTrack('audio')}
                className="flex items-center space-x-2 px-3 py-2 bg-bitcoin-orange rounded-lg hover:bg-yellow-600 transition-colors ml-4"
              >
                <Plus className="w-4 h-4 text-white" />
                <span className="text-white text-sm">Add Track</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="glass-morphism rounded-xl p-6">
          {renderMainContent()}
        </div>
      </div>
    </div>
  )
}