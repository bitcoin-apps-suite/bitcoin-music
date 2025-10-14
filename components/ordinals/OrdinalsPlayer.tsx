'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Shuffle,
  Download,
  ExternalLink,
  Heart,
  Share2,
  Music,
  Hash,
  Clock,
  HardDrive
} from 'lucide-react'
import { OrdinalsMusic } from '@/lib/ordinals/indexer'

interface OrdinalsPlayerProps {
  playlist: OrdinalsMusic[]
  currentTrackIndex: number
  onTrackChange: (index: number) => void
  isMinimized?: boolean
  onToggleMinimize?: () => void
}

interface PlaybackState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  isRepeat: boolean
  isShuffle: boolean
  isLoading: boolean
}

export default function OrdinalsPlayer({ 
  playlist, 
  currentTrackIndex, 
  onTrackChange,
  isMinimized = false,
  onToggleMinimize
}: OrdinalsPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playback, setPlayback] = useState<PlaybackState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    isRepeat: false,
    isShuffle: false,
    isLoading: false
  })
  
  const [isLiked, setIsLiked] = useState(false)
  const currentTrack = playlist[currentTrackIndex]

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      setPlayback(prev => ({ ...prev, isLoading: true }))
      audioRef.current.src = currentTrack.inscription.contentUrl
      audioRef.current.load()
    }
  }, [currentTrack])

  const togglePlay = () => {
    if (audioRef.current) {
      if (playback.isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
    }
  }

  const skipToNext = () => {
    if (playback.isShuffle) {
      const randomIndex = Math.floor(Math.random() * playlist.length)
      onTrackChange(randomIndex)
    } else {
      const nextIndex = (currentTrackIndex + 1) % playlist.length
      onTrackChange(nextIndex)
    }
  }

  const skipToPrevious = () => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0
    } else {
      const prevIndex = currentTrackIndex === 0 ? playlist.length - 1 : currentTrackIndex - 1
      onTrackChange(prevIndex)
    }
  }

  const handleTimeSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setPlayback(prev => ({ ...prev, currentTime: time }))
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = Number(e.target.value)
    if (audioRef.current) {
      audioRef.current.volume = volume
      setPlayback(prev => ({ ...prev, volume, isMuted: volume === 0 }))
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !playback.isMuted
      setPlayback(prev => ({ ...prev, isMuted: !prev.isMuted }))
    }
  }

  const toggleRepeat = () => {
    setPlayback(prev => ({ ...prev, isRepeat: !prev.isRepeat }))
  }

  const toggleShuffle = () => {
    setPlayback(prev => ({ ...prev, isShuffle: !prev.isShuffle }))
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  if (!currentTrack) return null

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="glass-morphism p-3 rounded-lg shadow-lg max-w-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white text-sm font-medium truncate">
                {currentTrack.metadata?.title || `Ordinal #${currentTrack.inscription.number}`}
              </h4>
              <p className="text-gray-400 text-xs truncate">
                {currentTrack.metadata?.artist || 'Unknown Artist'}
              </p>
            </div>
            <button
              onClick={togglePlay}
              className="p-2 bg-bitcoin-orange rounded-full hover:bg-yellow-600 transition-colors"
            >
              {playback.isPlaying ? (
                <Pause className="w-4 h-4 text-white" />
              ) : (
                <Play className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="glass-morphism border-t border-white/20">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/10">
          <div 
            className="h-full bg-bitcoin-orange transition-all duration-100"
            style={{ width: `${playback.duration ? (playback.currentTime / playback.duration) * 100 : 0}%` }}
          />
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between">
            {/* Track Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Music className="w-8 h-8 text-white/70" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold truncate">
                  {currentTrack.metadata?.title || `Ordinal #${currentTrack.inscription.number}`}
                </h3>
                <p className="text-gray-400 text-sm truncate">
                  {currentTrack.metadata?.artist || 'Unknown Artist'}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    {currentTrack.inscription.number}
                  </span>
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3" />
                    {formatFileSize(currentTrack.size)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(currentTrack.inscription.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex flex-col items-center gap-2 mx-8">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleShuffle}
                  className={`p-2 rounded-full transition-colors ${
                    playback.isShuffle 
                      ? 'text-bitcoin-orange bg-bitcoin-orange/20' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Shuffle className="w-4 h-4" />
                </button>
                
                <button
                  onClick={skipToPrevious}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                
                <button
                  onClick={togglePlay}
                  className="p-3 bg-bitcoin-orange rounded-full hover:bg-yellow-600 transition-colors"
                  disabled={playback.isLoading}
                >
                  {playback.isLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : playback.isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white" />
                  )}
                </button>
                
                <button
                  onClick={skipToNext}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
                
                <button
                  onClick={toggleRepeat}
                  className={`p-2 rounded-full transition-colors ${
                    playback.isRepeat 
                      ? 'text-bitcoin-orange bg-bitcoin-orange/20' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Repeat className="w-4 h-4" />
                </button>
              </div>

              {/* Time and Seek */}
              <div className="flex items-center gap-2 w-full max-w-lg">
                <span className="text-xs text-gray-400 w-10">
                  {formatTime(playback.currentTime)}
                </span>
                <input
                  type="range"
                  min="0"
                  max={playback.duration || 0}
                  value={playback.currentTime}
                  onChange={handleTimeSeek}
                  className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #f7931a 0%, #f7931a ${playback.duration ? (playback.currentTime / playback.duration) * 100 : 0}%, rgba(255,255,255,0.2) ${playback.duration ? (playback.currentTime / playback.duration) * 100 : 0}%, rgba(255,255,255,0.2) 100%)`
                  }}
                />
                <span className="text-xs text-gray-400 w-10">
                  {formatTime(playback.duration)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full transition-colors ${
                  isLiked 
                    ? 'text-red-500 bg-red-500/20' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Heart className="w-4 h-4" />
              </button>
              
              <a
                href={currentTrack.inscription.contentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Download className="w-4 h-4" />
              </a>
              
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
              
              <a
                href={`https://whatsonchain.com/tx/${currentTrack.txid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* Volume */}
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={toggleMute}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  {playback.isMuted || playback.volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={playback.isMuted ? 0 : playback.volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onLoadStart={() => setPlayback(prev => ({ ...prev, isLoading: true }))}
        onCanPlay={() => setPlayback(prev => ({ ...prev, isLoading: false }))}
        onPlay={() => setPlayback(prev => ({ ...prev, isPlaying: true }))}
        onPause={() => setPlayback(prev => ({ ...prev, isPlaying: false }))}
        onTimeUpdate={(e) => {
          const audio = e.target as HTMLAudioElement
          setPlayback(prev => ({ ...prev, currentTime: audio.currentTime }))
        }}
        onDurationChange={(e) => {
          const audio = e.target as HTMLAudioElement
          setPlayback(prev => ({ ...prev, duration: audio.duration }))
        }}
        onEnded={() => {
          if (playback.isRepeat) {
            audioRef.current?.play()
          } else {
            skipToNext()
          }
        }}
        onError={() => {
          console.error('Audio playback error')
          setPlayback(prev => ({ ...prev, isPlaying: false, isLoading: false }))
        }}
      />
    </div>
  )
}