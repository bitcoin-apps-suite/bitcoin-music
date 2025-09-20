'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Clock, 
  Heart, 
  ShoppingCart,
  Play,
  Pause,
  Share2,
  MoreVertical,
  DollarSign,
  Users,
  Music
} from 'lucide-react'

interface MusicNFT {
  id: string
  title: string
  artist: string
  coverArt: string
  price: number
  shares: number
  availableShares: number
  genre: string
  duration: string
  plays: number
  likes: number
  dividendRate: number
  audioPreview?: string
}

export default function MarketplacePage() {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [sortBy, setSortBy] = useState<'price' | 'trending' | 'newest'>('trending')
  const [playingId, setPlayingId] = useState<string | null>(null)
  
  const [nfts] = useState<MusicNFT[]>([
    {
      id: '1',
      title: 'Bitcoin Blues',
      artist: 'Satoshi Sounds',
      coverArt: '/api/placeholder/300/300',
      price: 0.001,
      shares: 10000,
      availableShares: 3500,
      genre: 'Electronic',
      duration: '3:45',
      plays: 15420,
      likes: 892,
      dividendRate: 12.5,
      audioPreview: 'preview1.mp3'
    },
    {
      id: '2',
      title: 'Blockchain Symphony',
      artist: 'Digital Orchestra',
      coverArt: '/api/placeholder/300/300',
      price: 0.0025,
      shares: 5000,
      availableShares: 1200,
      genre: 'Classical',
      duration: '7:23',
      plays: 8930,
      likes: 456,
      dividendRate: 8.3,
      audioPreview: 'preview2.mp3'
    },
    {
      id: '3',
      title: 'Mining Beats',
      artist: 'Hash Rate',
      coverArt: '/api/placeholder/300/300',
      price: 0.0008,
      shares: 20000,
      availableShares: 12000,
      genre: 'Hip Hop',
      duration: '4:12',
      plays: 32100,
      likes: 2103,
      dividendRate: 15.7,
      audioPreview: 'preview3.mp3'
    },
    {
      id: '4',
      title: 'Decentralized Dreams',
      artist: 'Web3 Collective',
      coverArt: '/api/placeholder/300/300',
      price: 0.0015,
      shares: 8000,
      availableShares: 4000,
      genre: 'Ambient',
      duration: '5:30',
      plays: 5670,
      likes: 234,
      dividendRate: 6.9,
      audioPreview: 'preview4.mp3'
    }
  ])

  const genres = ['all', 'Electronic', 'Hip Hop', 'Classical', 'Rock', 'Jazz', 'Ambient', 'Pop']

  const filteredNFTs = nfts.filter(nft => {
    const matchesSearch = nft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         nft.artist.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGenre = selectedGenre === 'all' || nft.genre === selectedGenre
    return matchesSearch && matchesGenre
  })

  const handlePlayPause = (id: string) => {
    if (playingId === id) {
      setPlayingId(null)
    } else {
      setPlayingId(id)
    }
  }

  const handlePurchase = async (nft: MusicNFT, shareAmount: number) => {
    console.log(`Purchasing ${shareAmount} shares of ${nft.title}`)
  }

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Music NFT Marketplace</h1>
          <p className="text-gray-300">Discover, collect, and trade music NFTs with fractional ownership</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search songs, artists, or albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-bitcoin-orange"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-bitcoin-orange"
            >
              {genres.map(genre => (
                <option key={genre} value={genre} className="bg-gray-900">
                  {genre === 'all' ? 'All Genres' : genre}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-bitcoin-orange"
            >
              <option value="trending" className="bg-gray-900">Trending</option>
              <option value="newest" className="bg-gray-900">Newest</option>
              <option value="price" className="bg-gray-900">Price</option>
            </select>
            
            <button className="p-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNFTs.map((nft) => (
            <div key={nft.id} className="glass-morphism rounded-xl overflow-hidden group hover:scale-105 transition-transform">
              <div className="relative aspect-square bg-gradient-to-br from-purple-600 to-pink-600">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Music className="w-20 h-20 text-white/50" />
                </div>
                <button
                  onClick={() => handlePlayPause(nft.id)}
                  className="absolute bottom-4 right-4 p-3 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                >
                  {playingId === nft.id ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white truncate">{nft.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{nft.artist}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-300 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {nft.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {nft.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Play className="w-4 h-4" />
                    {nft.plays.toLocaleString()}
                  </span>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Price per share:</span>
                    <span className="text-bitcoin-orange font-semibold">{nft.price} BSV</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Available:</span>
                    <span className="text-white">{nft.availableShares.toLocaleString()} / {nft.shares.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Dividend:</span>
                    <span className="text-green-400">{nft.dividendRate}% APY</span>
                  </div>
                </div>
                
                <div className="w-full bg-white/10 rounded-full h-2 mb-3">
                  <div 
                    className="bg-bitcoin-orange h-full rounded-full"
                    style={{ width: `${((nft.shares - nft.availableShares) / nft.shares) * 100}%` }}
                  />
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => handlePurchase(nft, 1)}
                    className="flex-1 py-2 bg-bitcoin-orange text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Buy Shares
                  </button>
                  <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                    <Share2 className="w-5 h-5 text-gray-300" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}