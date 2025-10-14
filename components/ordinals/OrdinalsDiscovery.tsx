'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Search, 
  Filter, 
  Play, 
  Pause, 
  Download, 
  ExternalLink, 
  Clock,
  Music,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Hash,
  Calendar,
  HardDrive
} from 'lucide-react'
import { ordinalsIndexer, OrdinalsMusic, OrdinalsSearchParams } from '@/lib/ordinals/indexer'

interface PlaybackState {
  currentTrack: OrdinalsMusic | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
}

export default function OrdinalsDiscovery() {
  const [ordinals, setOrdinals] = useState<OrdinalsMusic[]>([])
  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useState<OrdinalsSearchParams>({
    contentType: 'audio/*',
    limit: 50,
    offset: 0,
    sort: 'newest'
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [stats, setStats] = useState({
    totalMusic: 0,
    totalSize: 0,
    contentTypes: {} as Record<string, number>
  })
  const [playback, setPlayback] = useState<PlaybackState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false
  })

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    loadOrdinals()
    loadStats()
  }, [])

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery !== (searchParams.search || '')) {
        handleSearch()
      }
    }, 500)

    return () => clearTimeout(delayedSearch)
  }, [searchQuery])

  const loadOrdinals = async () => {
    setLoading(true)
    try {
      const results = await ordinalsIndexer.searchMusicOrdinals({
        ...searchParams,
        search: searchQuery
      })
      setOrdinals(results)
    } catch (error) {
      console.error('Error loading ordinals:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const ordinalsStats = await ordinalsIndexer.getOrdinalsStats()
      setStats(ordinalsStats)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const handleSearch = () => {
    setSearchParams(prev => ({ ...prev, search: searchQuery, offset: 0 }))
    loadOrdinals()
  }

  const handleSortChange = (sort: 'newest' | 'oldest' | 'largest' | 'smallest') => {
    setSearchParams(prev => ({ ...prev, sort, offset: 0 }))
    loadOrdinals()
  }

  const handleContentTypeChange = (contentType: string) => {
    setSearchParams(prev => ({ ...prev, contentType, offset: 0 }))
    loadOrdinals()
  }

  const loadMore = () => {
    setSearchParams(prev => ({ ...prev, offset: (prev.offset || 0) + (prev.limit || 50) }))
    loadOrdinals()
  }

  const playTrack = (track: OrdinalsMusic) => {
    if (audioRef.current) {
      if (playback.currentTrack?.inscription.id === track.inscription.id) {
        // Toggle play/pause for current track
        if (playback.isPlaying) {
          audioRef.current.pause()
          setPlayback(prev => ({ ...prev, isPlaying: false }))
        } else {
          audioRef.current.play()
          setPlayback(prev => ({ ...prev, isPlaying: true }))
        }
      } else {
        // Play new track
        audioRef.current.src = track.inscription.contentUrl
        audioRef.current.play()
        setPlayback(prev => ({
          ...prev,
          currentTrack: track,
          isPlaying: true,
          currentTime: 0
        }))
      }
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !playback.isMuted
      setPlayback(prev => ({ ...prev, isMuted: !prev.isMuted }))
    }
  }

  const handleVolumeChange = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume
      setPlayback(prev => ({ ...prev, volume }))
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const contentTypes = [
    { value: 'audio/*', label: 'All Audio' },
    { value: 'audio/mpeg', label: 'MP3' },
    { value: 'audio/wav', label: 'WAV' },
    { value: 'audio/ogg', label: 'OGG' },
    { value: 'video/mp4', label: 'MP4' }
  ]

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">BSV Ordinals Music Discovery</h1>
          <p className="text-gray-300 mb-4">
            Discover music inscribed on the Bitcoin SV blockchain as ordinals
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="glass-morphism p-4 rounded-lg">
              <div className="flex items-center gap-2 text-bitcoin-orange mb-1">
                <Music className="w-5 h-5" />
                <span className="font-semibold">Total Music</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.totalMusic.toLocaleString()}</p>
            </div>
            <div className="glass-morphism p-4 rounded-lg">
              <div className="flex items-center gap-2 text-bitcoin-orange mb-1">
                <HardDrive className="w-5 h-5" />
                <span className="font-semibold">Total Size</span>
              </div>
              <p className="text-2xl font-bold text-white">{formatFileSize(stats.totalSize)}</p>
            </div>
            <div className="glass-morphism p-4 rounded-lg">
              <div className="flex items-center gap-2 text-bitcoin-orange mb-1">
                <Hash className="w-5 h-5" />
                <span className="font-semibold">Content Types</span>
              </div>
              <p className="text-2xl font-bold text-white">{Object.keys(stats.contentTypes).length}</p>
            </div>
          </div>
        </header>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search music ordinals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-bitcoin-orange"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={searchParams.contentType}
              onChange={(e) => handleContentTypeChange(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-bitcoin-orange"
            >
              {contentTypes.map(type => (
                <option key={type.value} value={type.value} className="bg-gray-900">
                  {type.label}
                </option>
              ))}
            </select>
            
            <select
              value={searchParams.sort}
              onChange={(e) => handleSortChange(e.target.value as any)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-bitcoin-orange"
            >
              <option value="newest" className="bg-gray-900">Newest</option>
              <option value="oldest" className="bg-gray-900">Oldest</option>
              <option value="largest" className="bg-gray-900">Largest</option>
              <option value="smallest" className="bg-gray-900">Smallest</option>
            </select>
          </div>
        </div>

        {/* Music Player */}
        {playback.currentTrack && (
          <div className="glass-morphism p-4 rounded-lg mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">
                    {playback.currentTrack.metadata?.title || `Ordinal #${playback.currentTrack.inscription.number}`}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {playback.currentTrack.metadata?.artist || 'Unknown Artist'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  {playback.isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={playback.volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-20"
                />
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-bitcoin-orange border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-400">Loading ordinals music...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {ordinals.map((ordinal) => (
                <div key={ordinal.inscription.id} className="glass-morphism rounded-xl overflow-hidden group hover:scale-105 transition-transform">
                  <div className="relative aspect-square bg-gradient-to-br from-purple-600 to-pink-600">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Music className="w-20 h-20 text-white/50" />
                    </div>
                    <button
                      onClick={() => playTrack(ordinal)}
                      className="absolute bottom-4 right-4 p-3 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                    >
                      {playback.currentTrack?.inscription.id === ordinal.inscription.id && playback.isPlaying ? (
                        <Pause className="w-5 h-5 text-white" />
                      ) : (
                        <Play className="w-5 h-5 text-white" />
                      )}
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white truncate">
                      {ordinal.metadata?.title || `Ordinal #${ordinal.inscription.number}`}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">
                      {ordinal.metadata?.artist || 'Unknown Artist'}
                    </p>
                    
                    <div className="space-y-2 text-sm text-gray-300 mb-3">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="text-bitcoin-orange">{ordinal.inscription.contentType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Size:</span>
                        <span>{formatFileSize(ordinal.size)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Number:</span>
                        <span>#{ordinal.inscription.number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span>{new Date(ordinal.inscription.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => playTrack(ordinal)}
                        className="flex-1 py-2 bg-bitcoin-orange text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
                      >
                        {playback.currentTrack?.inscription.id === ordinal.inscription.id && playback.isPlaying ? 'Pause' : 'Play'}
                      </button>
                      <a
                        href={ordinal.inscription.contentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                      >
                        <ExternalLink className="w-5 h-5 text-gray-300" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {ordinals.length > 0 && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  className="px-6 py-3 bg-bitcoin-orange text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Load More
                </button>
              </div>
            )}

            {ordinals.length === 0 && !loading && (
              <div className="text-center py-12">
                <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No music ordinals found</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => {
          const audio = e.target as HTMLAudioElement
          setPlayback(prev => ({ ...prev, currentTime: audio.currentTime }))
        }}
        onDurationChange={(e) => {
          const audio = e.target as HTMLAudioElement
          setPlayback(prev => ({ ...prev, duration: audio.duration }))
        }}
        onEnded={() => {
          setPlayback(prev => ({ ...prev, isPlaying: false, currentTime: 0 }))
        }}
        onError={() => {
          console.error('Audio playback error')
          setPlayback(prev => ({ ...prev, isPlaying: false }))
        }}
      />
    </div>
  )
}