'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Users, 
  Music, 
  Play, 
  Heart, 
  Share2, 
  ExternalLink,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  Star,
  Verified,
  User,
  Disc,
  Headphones,
  Eye,
  Grid,
  List,
  Crown,
  Badge,
  Globe
} from 'lucide-react'

interface Artist {
  id: string
  name: string
  handle: string
  bio: string
  avatar: string
  bannerImage: string
  genre: string
  location: string
  joinDate: string
  isVerified: boolean
  isFeatured: boolean
  stats: {
    followers: number
    totalTracks: number
    totalPlays: number
    totalLikes: number
    monthlyListeners: number
  }
  topTracks: {
    id: string
    title: string
    plays: number
    duration: string
  }[]
  socialLinks?: {
    website?: string
    twitter?: string
    instagram?: string
    youtube?: string
  }
  achievements: string[]
}

type ViewMode = 'grid' | 'list'
type SortOption = 'popular' | 'newest' | 'followers' | 'name'

export default function ArtistsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [sortBy, setSortBy] = useState<SortOption>('popular')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const [followedArtists, setFollowedArtists] = useState<Set<string>>(new Set())

  const genres = [
    'all', 'Electronic', 'Hip Hop', 'Rock', 'Jazz', 'Classical', 'Ambient', 'Pop', 'Techno', 'House', 'R&B', 'Country'
  ]

  const [artists] = useState<Artist[]>([
    {
      id: '1',
      name: 'CryptoSynth',
      handle: '@cryptosynth',
      bio: 'Electronic music producer creating the soundtrack to the digital revolution. Pioneering the intersection of blockchain technology and electronic music.',
      avatar: '/api/placeholder/200/200',
      bannerImage: '/api/placeholder/800/300',
      genre: 'Electronic',
      location: 'Los Angeles, CA',
      joinDate: '2023-01-15',
      isVerified: true,
      isFeatured: true,
      stats: {
        followers: 45620,
        totalTracks: 34,
        totalPlays: 1250000,
        totalLikes: 89400,
        monthlyListeners: 125000
      },
      topTracks: [
        { id: '1', title: 'Bitcoin Dreams', plays: 145620, duration: '3:45' },
        { id: '2', title: 'Digital Gold Rush', plays: 98340, duration: '4:12' },
        { id: '3', title: 'Satoshi Sunset', plays: 76890, duration: '5:30' }
      ],
      socialLinks: {
        website: 'https://cryptosynth.com',
        twitter: '@cryptosynth',
        instagram: '@cryptosynth_music'
      },
      achievements: ['Verified Artist', 'Top Electronic Artist 2025', '1M+ Streams']
    },
    {
      id: '2',
      name: 'Hash Rate',
      handle: '@hashrate',
      bio: 'Hip hop artist from the blockchain. Spitting bars about decentralization, digital freedom, and the future of money.',
      avatar: '/api/placeholder/200/200',
      bannerImage: '/api/placeholder/800/300',
      genre: 'Hip Hop',
      location: 'Atlanta, GA',
      joinDate: '2023-03-22',
      isVerified: true,
      isFeatured: true,
      stats: {
        followers: 67890,
        totalTracks: 28,
        totalPlays: 2100000,
        totalLikes: 156000,
        monthlyListeners: 180000
      },
      topTracks: [
        { id: '4', title: 'Mining Beats', plays: 234567, duration: '4:12' },
        { id: '5', title: 'Proof of Bars', plays: 189000, duration: '3:58' },
        { id: '6', title: 'Block Height', plays: 134000, duration: '4:45' }
      ],
      socialLinks: {
        website: 'https://hashrate.music',
        twitter: '@hashrate_music',
        youtube: 'HashRateOfficial'
      },
      achievements: ['Verified Artist', 'Top Hip Hop Artist 2025', '2M+ Streams', 'Grammy Nominated']
    },
    {
      id: '3',
      name: 'Digital Orchestra',
      handle: '@digitalorchestra',
      bio: 'Classical ensemble merging traditional orchestration with blockchain-powered composition. Creating timeless music for the digital age.',
      avatar: '/api/placeholder/200/200',
      bannerImage: '/api/placeholder/800/300',
      genre: 'Classical',
      location: 'Vienna, Austria',
      joinDate: '2023-02-10',
      isVerified: true,
      isFeatured: false,
      stats: {
        followers: 23450,
        totalTracks: 15,
        totalPlays: 890000,
        totalLikes: 45600,
        monthlyListeners: 67000
      },
      topTracks: [
        { id: '7', title: 'Blockchain Symphony', plays: 89234, duration: '7:23' },
        { id: '8', title: 'Decentralized Concerto', plays: 67890, duration: '12:15' },
        { id: '9', title: 'Quantum Variations', plays: 45600, duration: '8:30' }
      ],
      socialLinks: {
        website: 'https://digitalorchestra.art',
        youtube: 'DigitalOrchestraMusic'
      },
      achievements: ['Verified Artist', 'Classical Innovation Award', '500K+ Streams']
    },
    {
      id: '4',
      name: 'Neural Networks',
      handle: '@neuralnetworks',
      bio: 'AI-assisted ambient music composer exploring the boundaries between human creativity and machine intelligence.',
      avatar: '/api/placeholder/200/200',
      bannerImage: '/api/placeholder/800/300',
      genre: 'Ambient',
      location: 'San Francisco, CA',
      joinDate: '2023-05-18',
      isVerified: false,
      isFeatured: false,
      stats: {
        followers: 12890,
        totalTracks: 42,
        totalPlays: 567000,
        totalLikes: 28900,
        monthlyListeners: 45000
      },
      topTracks: [
        { id: '10', title: 'Quantum Echoes', plays: 67890, duration: '5:30' },
        { id: '11', title: 'Digital Consciousness', plays: 54320, duration: '6:45' },
        { id: '12', title: 'Binary Dreams', plays: 43210, duration: '4:20' }
      ],
      socialLinks: {
        website: 'https://neuralnetworks.ai'
      },
      achievements: ['Rising Artist', 'AI Innovation Award']
    },
    {
      id: '5',
      name: 'Electric Nodes',
      handle: '@electricnodes',
      bio: 'High-energy rock band powered by renewable energy and blockchain technology. Electrifying the world one riff at a time.',
      avatar: '/api/placeholder/200/200',
      bannerImage: '/api/placeholder/800/300',
      genre: 'Rock',
      location: 'Nashville, TN',
      joinDate: '2023-04-05',
      isVerified: true,
      isFeatured: true,
      stats: {
        followers: 89340,
        totalTracks: 22,
        totalPlays: 1800000,
        totalLikes: 112000,
        monthlyListeners: 145000
      },
      topTracks: [
        { id: '13', title: 'Lightning Network', plays: 156789, duration: '3:58' },
        { id: '14', title: 'Electric Storm', plays: 134567, duration: '4:25' },
        { id: '15', title: 'Power Grid', plays: 98765, duration: '3:12' }
      ],
      socialLinks: {
        website: 'https://electricnodes.rock',
        twitter: '@electric_nodes',
        instagram: '@electricnodes',
        youtube: 'ElectricNodesOfficial'
      },
      achievements: ['Verified Artist', 'Rock Band of the Year', '1.5M+ Streams', 'Eco-Friendly Award']
    },
    {
      id: '6',
      name: 'Jazz Validators',
      handle: '@jazzvalidators',
      bio: 'Smooth jazz ensemble validating good vibes on the blockchain. Bringing sophistication to the digital music revolution.',
      avatar: '/api/placeholder/200/200',
      bannerImage: '/api/placeholder/800/300',
      genre: 'Jazz',
      location: 'New Orleans, LA',
      joinDate: '2023-06-12',
      isVerified: false,
      isFeatured: false,
      stats: {
        followers: 15670,
        totalTracks: 18,
        totalPlays: 345000,
        totalLikes: 19800,
        monthlyListeners: 28000
      },
      topTracks: [
        { id: '16', title: 'Smooth Transactions', plays: 45123, duration: '6:15' },
        { id: '17', title: 'Blue Coin Blues', plays: 34567, duration: '5:45' },
        { id: '18', title: 'Consensus Rhythm', plays: 28900, duration: '7:20' }
      ],
      socialLinks: {
        website: 'https://jazzvalidators.com'
      },
      achievements: ['Rising Jazz Artist', 'New Orleans Music Award']
    }
  ])

  const filteredArtists = artists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artist.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artist.bio.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGenre = selectedGenre === 'all' || artist.genre === selectedGenre
    const matchesFeatured = !showFeaturedOnly || artist.isFeatured
    return matchesSearch && matchesGenre && matchesFeatured
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.stats.monthlyListeners - a.stats.monthlyListeners
      case 'newest':
        return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
      case 'followers':
        return b.stats.followers - a.stats.followers
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const handleFollow = (artistId: string) => {
    setFollowedArtists(prev => {
      const newSet = new Set(prev)
      if (newSet.has(artistId)) {
        newSet.delete(artistId)
      } else {
        newSet.add(artistId)
      }
      return newSet
    })
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
            <Users className="w-10 h-10 text-purple-500" />
            Artists Directory
          </h1>
          <p className="text-gray-300 text-lg">
            Discover and follow talented artists in the Bitcoin Music community
          </p>
        </div>

        {/* Featured Artists Banner */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Featured Artists</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {artists.filter(artist => artist.isFeatured).slice(0, 4).map((artist) => (
              <div key={artist.id} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <User className="w-8 h-8 text-white" />
                </div>
                <p className="text-white text-sm font-medium truncate">{artist.name}</p>
                <p className="text-gray-400 text-xs">{artist.genre}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-8">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search artists by name, handle, or bio..."
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
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="popular" className="bg-gray-900">Most Popular</option>
              <option value="followers" className="bg-gray-900">Most Followers</option>
              <option value="newest" className="bg-gray-900">Newest</option>
              <option value="name" className="bg-gray-900">Name A-Z</option>
            </select>

            <label className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white cursor-pointer hover:bg-white/20 transition-colors">
              <input
                type="checkbox"
                checked={showFeaturedOnly}
                onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                className="accent-purple-500"
              />
              Featured Only
            </label>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">
            Showing {filteredArtists.length} of {artists.length} artists
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {artists.reduce((sum, artist) => sum + artist.stats.followers, 0).toLocaleString()} total followers
            </span>
            <span className="flex items-center gap-1">
              <Music className="w-4 h-4" />
              {artists.reduce((sum, artist) => sum + artist.stats.totalTracks, 0)} total tracks
            </span>
          </div>
        </div>

        {/* Artists Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtists.map((artist) => (
              <div key={artist.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all">
                {/* Banner */}
                <div className="h-32 bg-gradient-to-r from-purple-600/50 to-pink-600/50 relative">
                  <div className="absolute top-3 right-3 flex gap-1">
                    {artist.isVerified && (
                      <span className="p-1 bg-blue-600 rounded-full">
                        <Verified className="w-4 h-4 text-white" />
                      </span>
                    )}
                    {artist.isFeatured && (
                      <span className="p-1 bg-yellow-600 rounded-full">
                        <Crown className="w-4 h-4 text-white" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Avatar */}
                <div className="relative px-4 -mt-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center border-4 border-gray-900">
                    <User className="w-8 h-8 text-white" />
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-semibold truncate flex items-center gap-2">
                        {artist.name}
                        {artist.isVerified && <Verified className="w-4 h-4 text-blue-400 flex-shrink-0" />}
                      </h3>
                      <p className="text-gray-400 text-sm truncate">{artist.handle}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs">
                          {artist.genre}
                        </span>
                        <span className="flex items-center gap-1 text-gray-500 text-xs">
                          <MapPin className="w-3 h-3" />
                          {artist.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{artist.bio}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4 text-center">
                    <div>
                      <p className="text-white font-semibold">{artist.stats.followers.toLocaleString()}</p>
                      <p className="text-gray-400 text-xs">Followers</p>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{artist.stats.totalTracks}</p>
                      <p className="text-gray-400 text-xs">Tracks</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleFollow(artist.id)}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors mr-2 ${
                        followedArtists.has(artist.id)
                          ? 'bg-gray-600 text-white'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      {followedArtists.has(artist.id) ? 'Following' : 'Follow'}
                    </button>
                    
                    <div className="flex gap-1">
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-white/20 rounded-lg transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                      {artist.socialLinks?.website && (
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/20 rounded-lg transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-sm text-gray-400 font-medium">
              <div className="col-span-4">Artist</div>
              <div className="col-span-2">Genre</div>
              <div className="col-span-2">Followers</div>
              <div className="col-span-2">Tracks</div>
              <div className="col-span-2">Actions</div>
            </div>
            
            <div className="divide-y divide-white/10">
              {filteredArtists.map((artist) => (
                <div key={artist.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-white/5 transition-colors">
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium truncate flex items-center gap-2">
                        {artist.name}
                        {artist.isVerified && <Verified className="w-4 h-4 text-blue-400" />}
                        {artist.isFeatured && <Crown className="w-4 h-4 text-yellow-400" />}
                      </p>
                      <p className="text-gray-400 text-sm truncate">{artist.handle}</p>
                    </div>
                  </div>
                  
                  <div className="col-span-2 flex items-center">
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-sm">
                      {artist.genre}
                    </span>
                  </div>
                  
                  <div className="col-span-2 flex items-center">
                    <span className="text-gray-300">{artist.stats.followers.toLocaleString()}</span>
                  </div>
                  
                  <div className="col-span-2 flex items-center">
                    <span className="text-gray-300">{artist.stats.totalTracks}</span>
                  </div>
                  
                  <div className="col-span-2 flex items-center gap-2">
                    <button
                      onClick={() => handleFollow(artist.id)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        followedArtists.has(artist.id)
                          ? 'bg-gray-600 text-white'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      {followedArtists.has(artist.id) ? 'Following' : 'Follow'}
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-white/20 rounded-lg transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Load More */}
        {filteredArtists.length > 0 && (
          <div className="flex justify-center mt-8">
            <button className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors">
              Load More Artists
            </button>
          </div>
        )}
      </div>
    </div>
  )
}