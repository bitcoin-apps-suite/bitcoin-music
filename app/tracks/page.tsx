'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Play, 
  Pause, 
  Heart, 
  Share2, 
  Download, 
  MoreVertical,
  Clock,
  TrendingUp,
  Star,
  Music,
  Shuffle,
  Repeat,
  Volume2,
  SkipBack,
  SkipForward,
  List,
  Grid,
  SortAsc,
  Eye,
  Headphones
} from 'lucide-react'

interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: string
  genre: string
  releaseDate: string
  plays: number
  likes: number
  price: number
  isOwned: boolean
  artwork: string
  audioPreview?: string
  bpm?: number
  key?: string
  mood?: string
}

type ViewMode = 'grid' | 'list'
type SortOption = 'newest' | 'popular' | 'title' | 'artist' | 'duration'

export default function TracksPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [sortBy, setSortBy] = useState<SortOption>('popular')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set())
  const [selectedMood, setSelectedMood] = useState('all')

  const genres = [
    'all', 'Electronic', 'Hip Hop', 'Rock', 'Jazz', 'Classical', 'Ambient', 'Pop', 'Techno', 'House', 'R&B', 'Country'
  ]

  const moods = [
    'all', 'Energetic', 'Chill', 'Dark', 'Happy', 'Melancholic', 'Aggressive', 'Peaceful', 'Mysterious'
  ]

  const [tracks] = useState<Track[]>([
    {
      id: '1',
      title: 'Bitcoin Dreams',
      artist: 'CryptoSynth',
      album: 'Digital Gold',
      duration: '3:45',
      genre: 'Electronic',
      releaseDate: '2025-03-15',
      plays: 125420,
      likes: 8934,
      price: 0.001,
      isOwned: false,
      artwork: '/api/placeholder/300/300',
      bpm: 128,
      key: 'A minor',
      mood: 'Energetic'
    },
    {
      id: '2',
      title: 'Blockchain Symphony',
      artist: 'Digital Orchestra',
      album: 'Decentralized Classics',
      duration: '7:23',
      genre: 'Classical',
      releaseDate: '2025-02-28',
      plays: 89234,
      likes: 5672,
      price: 0.0025,
      isOwned: true,
      artwork: '/api/placeholder/300/300',
      bpm: 90,
      key: 'C major',
      mood: 'Peaceful'
    },
    {
      id: '3',
      title: 'Mining Beats',
      artist: 'Hash Rate',
      album: 'Proof of Work',
      duration: '4:12',
      genre: 'Hip Hop',
      releaseDate: '2025-03-20',
      plays: 234567,
      likes: 15623,
      price: 0.0008,
      isOwned: false,
      artwork: '/api/placeholder/300/300',
      bpm: 140,
      key: 'E minor',
      mood: 'Aggressive'
    },
    {
      id: '4',
      title: 'Quantum Echoes',
      artist: 'Neural Networks',
      album: 'AI Compositions',
      duration: '5:30',
      genre: 'Ambient',
      releaseDate: '2025-01-10',
      plays: 67890,
      likes: 3456,
      price: 0.0015,
      isOwned: true,
      artwork: '/api/placeholder/300/300',
      bpm: 70,
      key: 'F major',
      mood: 'Mysterious'
    },
    {
      id: '5',
      title: 'Lightning Network',
      artist: 'Electric Nodes',
      album: 'High Voltage',
      duration: '3:58',
      genre: 'Rock',
      releaseDate: '2025-03-25',
      plays: 156789,
      likes: 9876,
      price: 0.0012,
      isOwned: false,
      artwork: '/api/placeholder/300/300',
      bpm: 160,
      key: 'D major',
      mood: 'Energetic'
    },
    {
      id: '6',
      title: 'Smooth Transactions',
      artist: 'Jazz Validators',
      album: 'Block Time',
      duration: '6:15',
      genre: 'Jazz',
      releaseDate: '2025-02-14',
      plays: 45123,
      likes: 2890,
      price: 0.002,
      isOwned: false,
      artwork: '/api/placeholder/300/300',
      bpm: 110,
      key: 'Bb major',
      mood: 'Chill'
    },
    {
      id: '7',
      title: 'Satoshi Sunset',
      artist: 'Ambient Miners',
      album: 'Digital Landscapes',
      duration: '8:42',
      genre: 'Ambient',
      releaseDate: '2025-01-20',
      plays: 78456,
      likes: 4321,
      price: 0.0018,
      isOwned: true,
      artwork: '/api/placeholder/300/300',
      bpm: 60,
      key: 'G major',
      mood: 'Peaceful'
    },
    {
      id: '8',
      title: 'Crypto Party',
      artist: 'DeFi DJs',
      album: 'Bull Market Bangers',
      duration: '4:33',
      genre: 'Pop',
      releaseDate: '2025-03-18',
      plays: 198765,
      likes: 12345,
      price: 0.0009,
      isOwned: false,
      artwork: '/api/placeholder/300/300',
      bpm: 125,
      key: 'C major',
      mood: 'Happy'
    }
  ])

  const filteredTracks = tracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.album.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGenre = selectedGenre === 'all' || track.genre === selectedGenre
    const matchesMood = selectedMood === 'all' || track.mood === selectedMood
    return matchesSearch && matchesGenre && matchesMood
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      case 'popular':
        return b.plays - a.plays
      case 'title':
        return a.title.localeCompare(b.title)
      case 'artist':
        return a.artist.localeCompare(b.artist)
      case 'duration':
        const aDuration = a.duration.split(':').reduce((acc, time) => (60 * acc) + +time, 0)
        const bDuration = b.duration.split(':').reduce((acc, time) => (60 * acc) + +time, 0)
        return aDuration - bDuration
      default:
        return 0
    }
  })

  const handlePlayPause = (trackId: string) => {
    if (playingId === trackId) {
      setPlayingId(null)
    } else {
      setPlayingId(trackId)
    }
  }

  const handleLike = (trackId: string) => {
    setLikedTracks(prev => {
      const newSet = new Set(prev)
      if (newSet.has(trackId)) {
        newSet.delete(trackId)
      } else {
        newSet.add(trackId)
      }
      return newSet
    })
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div 
      style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
        paddingTop: '60px'
      }}
      className="p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <Music className="w-10 h-10 text-purple-500" />
            Music Catalog
          </h1>
          <p className="text-gray-300 text-lg">
            Discover and collect music from verified artists on Bitcoin Music
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-8">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tracks, artists, or albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-3 bg-white/10 border border-white/20 rounded-lg text-gray-400 hover:text-white hover:bg-white/20 transition-colors"
                title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
              >
                {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
              </button>
              <button className="p-3 bg-white/10 border border-white/20 rounded-lg text-gray-400 hover:text-white hover:bg-white/20 transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              {genres.map(genre => (
                <option key={genre} value={genre} className="bg-gray-900">
                  {genre === 'all' ? 'All Genres' : genre}
                </option>
              ))}
            </select>

            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              {moods.map(mood => (
                <option key={mood} value={mood} className="bg-gray-900">
                  {mood === 'all' ? 'All Moods' : mood}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="popular" className="bg-gray-900">Most Popular</option>
              <option value="newest" className="bg-gray-900">Newest</option>
              <option value="title" className="bg-gray-900">Title A-Z</option>
              <option value="artist" className="bg-gray-900">Artist A-Z</option>
              <option value="duration" className="bg-gray-900">Duration</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">
            Showing {filteredTracks.length} of {tracks.length} tracks
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Play className="w-4 h-4" />
              {tracks.reduce((sum, track) => sum + track.plays, 0).toLocaleString()} total plays
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {tracks.reduce((sum, track) => sum + track.likes, 0).toLocaleString()} total likes
            </span>
          </div>
        </div>

        {/* Tracks Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTracks.map((track) => (
              <div key={track.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden group hover:bg-white/10 transition-all">
                <div className="relative aspect-square bg-gradient-to-br from-purple-600 to-pink-600">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Music className="w-16 h-16 text-white/50" />
                  </div>
                  {track.isOwned && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-green-600 rounded-full text-xs text-white font-medium">
                      Owned
                    </div>
                  )}
                  <button
                    onClick={() => handlePlayPause(track.id)}
                    className="absolute bottom-4 right-4 p-3 bg-black/50 rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    {playingId === track.id ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className="text-white font-medium truncate mb-1">{track.title}</h3>
                  <p className="text-gray-400 text-sm truncate mb-2">{track.artist}</p>
                  <p className="text-gray-500 text-xs truncate mb-3">{track.album}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {track.duration}
                    </span>
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded">
                      {track.genre}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {track.plays.toLocaleString()}
                    </span>
                    <span className="text-purple-400 font-semibold">{track.price} BSV</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLike(track.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          likedTracks.has(track.id)
                            ? 'text-red-500 bg-red-500/20'
                            : 'text-gray-400 hover:text-red-500 hover:bg-red-500/20'
                        }`}
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-white/20 rounded-lg transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                      {track.isOwned ? 'Play' : 'Buy'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-sm text-gray-400 font-medium">
              <div className="col-span-1">#</div>
              <div className="col-span-4">Title</div>
              <div className="col-span-2">Artist</div>
              <div className="col-span-2">Album</div>
              <div className="col-span-1">Duration</div>
              <div className="col-span-1">Plays</div>
              <div className="col-span-1">Actions</div>
            </div>
            
            <div className="divide-y divide-white/10">
              {filteredTracks.map((track, index) => (
                <div key={track.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-white/5 transition-colors group">
                  <div className="col-span-1 flex items-center">
                    <span className="text-gray-400 text-sm group-hover:hidden">{index + 1}</span>
                    <button
                      onClick={() => handlePlayPause(track.id)}
                      className="hidden group-hover:block p-1 text-gray-400 hover:text-white transition-colors"
                    >
                      {playingId === track.id ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Music className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium truncate">{track.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs">
                          {track.genre}
                        </span>
                        {track.isOwned && (
                          <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs">
                            Owned
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-2 flex items-center">
                    <span className="text-gray-300 truncate">{track.artist}</span>
                  </div>
                  
                  <div className="col-span-2 flex items-center">
                    <span className="text-gray-400 truncate">{track.album}</span>
                  </div>
                  
                  <div className="col-span-1 flex items-center">
                    <span className="text-gray-400">{track.duration}</span>
                  </div>
                  
                  <div className="col-span-1 flex items-center">
                    <span className="text-gray-400 text-sm">{track.plays.toLocaleString()}</span>
                  </div>
                  
                  <div className="col-span-1 flex items-center gap-1">
                    <button
                      onClick={() => handleLike(track.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        likedTracks.has(track.id)
                          ? 'text-red-500'
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Load More */}
        {filteredTracks.length > 0 && (
          <div className="flex justify-center mt-8">
            <button className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors">
              Load More Tracks
            </button>
          </div>
        )}
      </div>
    </div>
  )
}