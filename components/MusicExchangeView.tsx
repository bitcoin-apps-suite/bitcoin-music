'use client'

import React, { useState, useEffect } from 'react'
import { Music, Disc, Album, Radio, Upload, TrendingUp, Star, DollarSign, Users, Play, Download } from 'lucide-react'

interface MusicListing {
  rank: number
  title: string
  artist: string
  artistHandle: string
  artistType: 'human' | 'ai'
  releaseDate: string
  duration: number // in seconds
  genre: string
  plays: number
  downloads: number
  sharesAvailable: number
  totalShares: number
  revenue: number
  dividendPerShare: number
  volume24h: number
  currentPrice: number
  priceChange24h: number
  marketCap: number
  contentType: 'track' | 'album' | 'mix' | 'jungle' | 'sample'
  category: string
  tags: string[]
  txId: string
  trending?: boolean
  isNft?: boolean
  nftId?: string
  nftOrigin?: string
  marketUrl?: string
  royaltyPercentage?: number
  fileFormat?: string
  bitrate?: string
  bpm?: number
}

interface ArtistListing {
  rank: number
  name: string
  handle: string
  artistType: 'human' | 'ai'
  category?: 'all' | 'producers' | 'djs' | 'singers' | 'rappers' | 'bands' | 'composers' | 'beatmakers'
  joinDate: string
  totalTracks: number
  totalListeners: number
  totalRevenue: number
  avgRating: number
  sharesAvailable: number
  totalShares: number
  currentPrice: number
  priceChange24h: number
  marketCap: number
  verified: boolean
  trending?: boolean
  genres?: string[]
}

export default function MusicExchangeView() {
  const [artistType, setArtistType] = useState<'human' | 'ai'>('human')
  const [activeView, setActiveView] = useState<'tracks' | 'albums' | 'mixes' | 'jungles' | 'samples' | 'artists'>('tracks')
  const [activeMarket, setActiveMarket] = useState<string>('All')
  const [artistCategory, setArtistCategory] = useState<'all' | 'producers' | 'djs' | 'singers' | 'rappers' | 'bands' | 'composers' | 'beatmakers'>('all')
  const [sortBy, setSortBy] = useState<'rank' | 'revenue' | 'volume' | 'price' | 'plays'>('rank')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMusic, setSelectedMusic] = useState<MusicListing | null>(null)
  const [selectedArtist, setSelectedArtist] = useState<ArtistListing | null>(null)
  const [musicListings, setMusicListings] = useState<MusicListing[]>([])
  const [artistListings, setArtistListings] = useState<ArtistListing[]>([])
  const [showImportModal, setShowImportModal] = useState(false)

  const trackCategories = ['All', 'Electronic', 'Hip-Hop', 'Rock', 'Pop', 'Jazz', 'Classical', 'R&B', 'Reggae', 'Country']
  const albumCategories = ['All', 'Studio', 'Live', 'Compilation', 'EP', 'Single', 'Remix', 'Greatest Hits']
  const mixCategories = ['All', 'DJ Set', 'Live Mix', 'Radio Show', 'Podcast', 'Mashup', 'Megamix']
  const jungleCategories = ['All', 'Drum & Bass', 'Breakbeat', 'Ragga', 'Jump Up', 'Liquid', 'Neurofunk']
  const sampleCategories = ['All', 'Loops', 'One-Shots', 'Stems', 'Vocals', 'Drums', 'Bass', 'Synths', 'FX']
  
  const artistCategories = [
    { value: 'all', label: 'All', emoji: '🌍' },
    { value: 'producers', label: 'Producers', emoji: '🎛️' },
    { value: 'djs', label: 'DJs', emoji: '🎧' },
    { value: 'singers', label: 'Singers', emoji: '🎤' },
    { value: 'rappers', label: 'Rappers', emoji: '🎙️' },
    { value: 'bands', label: 'Bands', emoji: '🎸' },
    { value: 'composers', label: 'Composers', emoji: '🎼' },
    { value: 'beatmakers', label: 'Beatmakers', emoji: '🥁' }
  ] as const

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Generate mock data for music listings
  useEffect(() => {
    const mockTracks: MusicListing[] = [
      {
        rank: 1,
        title: "Neon Dreams",
        artist: "CyberWave",
        artistHandle: "$cyberwave",
        artistType: "human",
        releaseDate: "2025-01-15",
        duration: 234,
        genre: "Electronic",
        plays: 1250000,
        downloads: 85000,
        sharesAvailable: 50,
        totalShares: 1000,
        revenue: 425000.00,
        dividendPerShare: 42.50,
        volume24h: 850000,
        currentPrice: 125.00,
        priceChange24h: 45.2,
        marketCap: 125000,
        contentType: "track",
        category: "Electronic",
        tags: ["synthwave", "retrowave", "electronic"],
        trending: true,
        txId: "track1a2b3c4...",
        fileFormat: "FLAC",
        bitrate: "1411 kbps",
        bpm: 128
      },
      {
        rank: 2,
        title: "Midnight Cipher",
        artist: "DJ Shadow Protocol",
        artistHandle: "$shadowprotocol",
        artistType: "human",
        releaseDate: "2025-01-14",
        duration: 312,
        genre: "Hip-Hop",
        plays: 980000,
        downloads: 62000,
        sharesAvailable: 120,
        totalShares: 1500,
        revenue: 310000.00,
        dividendPerShare: 31.00,
        volume24h: 620000,
        currentPrice: 95.00,
        priceChange24h: 22.4,
        marketCap: 142500,
        contentType: "track",
        category: "Hip-Hop",
        tags: ["underground", "boom bap", "instrumental"],
        trending: true,
        txId: "track2b3c4d5...",
        fileFormat: "WAV",
        bitrate: "1411 kbps",
        bpm: 90
      },
      {
        rank: 3,
        title: "Electric Jungle",
        artist: "Bassline Rebels",
        artistHandle: "$basslinerebels",
        artistType: "human",
        releaseDate: "2025-01-13",
        duration: 420,
        genre: "Drum & Bass",
        plays: 780000,
        downloads: 45000,
        sharesAvailable: 200,
        totalShares: 2000,
        revenue: 225000.00,
        dividendPerShare: 22.50,
        volume24h: 450000,
        currentPrice: 78.00,
        priceChange24h: 15.8,
        marketCap: 156000,
        contentType: "track",
        category: "Electronic",
        tags: ["dnb", "jungle", "amen break"],
        txId: "track3c4d5e6...",
        fileFormat: "MP3",
        bitrate: "320 kbps",
        bpm: 174
      },
      // NFT Track Example
      {
        rank: 4,
        title: "Genesis Beat (Limited Edition)",
        artist: "Satoshi Sound",
        artistHandle: "$satoshisound",
        artistType: "human",
        releaseDate: "2025-01-12",
        duration: 180,
        genre: "Electronic",
        plays: 450000,
        downloads: 1000,
        sharesAvailable: 10,
        totalShares: 100,
        revenue: 980000.00,
        dividendPerShare: 980.00,
        volume24h: 1250000,
        currentPrice: 5000.00,
        priceChange24h: 125.4,
        marketCap: 500000,
        contentType: "track",
        category: "Electronic",
        tags: ["nft", "exclusive", "genesis"],
        trending: true,
        txId: "nft1a2b3c4...",
        isNft: true,
        nftId: "nft_genesis_beat_001",
        nftOrigin: "HandCash Items",
        marketUrl: "https://market.handcash.io/items/nft_genesis_beat_001",
        royaltyPercentage: 10,
        fileFormat: "FLAC",
        bitrate: "1411 kbps",
        bpm: 140
      },
      {
        rank: 5,
        title: "Sunset Boulevard",
        artist: "Velvet Dreams",
        artistHandle: "$velvetdreams",
        artistType: "human",
        releaseDate: "2025-01-11",
        duration: 195,
        genre: "Pop",
        plays: 2100000,
        downloads: 125000,
        sharesAvailable: 75,
        totalShares: 1200,
        revenue: 625000.00,
        dividendPerShare: 62.50,
        volume24h: 980000,
        currentPrice: 165.00,
        priceChange24h: 32.1,
        marketCap: 198000,
        contentType: "track",
        category: "Pop",
        tags: ["pop", "summer", "radio"],
        trending: true,
        txId: "track5e6f7g8...",
        fileFormat: "AAC",
        bitrate: "256 kbps",
        bpm: 120
      }
    ]

    const mockAlbums: MusicListing[] = [
      {
        rank: 1,
        title: "Digital Renaissance",
        artist: "Neural Network",
        artistHandle: "$neuralnet",
        artistType: "ai",
        releaseDate: "2025-01-10",
        duration: 3600,
        genre: "Electronic",
        plays: 520000,
        downloads: 32000,
        sharesAvailable: 30,
        totalShares: 500,
        revenue: 780000.00,
        dividendPerShare: 156.00,
        volume24h: 1450000,
        currentPrice: 450.00,
        priceChange24h: 68.3,
        marketCap: 225000,
        contentType: "album",
        category: "Studio",
        tags: ["ai-generated", "concept", "electronic"],
        trending: true,
        txId: "album1a2b3c...",
        fileFormat: "FLAC",
        bitrate: "1411 kbps"
      },
      {
        rank: 2,
        title: "Live at Crypto Arena",
        artist: "The Blockchain Band",
        artistHandle: "$blockchainband",
        artistType: "human",
        releaseDate: "2025-01-08",
        duration: 5400,
        genre: "Rock",
        plays: 380000,
        downloads: 22000,
        sharesAvailable: 90,
        totalShares: 800,
        revenue: 440000.00,
        dividendPerShare: 55.00,
        volume24h: 820000,
        currentPrice: 285.00,
        priceChange24h: 24.7,
        marketCap: 228000,
        contentType: "album",
        category: "Live",
        tags: ["live", "concert", "rock"],
        txId: "album2b3c4d...",
        fileFormat: "WAV",
        bitrate: "1411 kbps"
      }
    ]

    const mockMixes: MusicListing[] = [
      {
        rank: 1,
        title: "Summer Sessions 2025",
        artist: "DJ Crypto",
        artistHandle: "$djcrypto",
        artistType: "human",
        releaseDate: "2025-01-15",
        duration: 7200,
        genre: "House",
        plays: 680000,
        downloads: 42000,
        sharesAvailable: 150,
        totalShares: 1000,
        revenue: 210000.00,
        dividendPerShare: 21.00,
        volume24h: 380000,
        currentPrice: 88.00,
        priceChange24h: 18.9,
        marketCap: 88000,
        contentType: "mix",
        category: "DJ Set",
        tags: ["house", "summer", "beach"],
        trending: true,
        txId: "mix1a2b3c4...",
        fileFormat: "MP3",
        bitrate: "320 kbps",
        bpm: 124
      }
    ]

    const mockJungles: MusicListing[] = [
      {
        rank: 1,
        title: "Amen Break Revolution",
        artist: "Jungle Massive",
        artistHandle: "$junglemassive",
        artistType: "human",
        releaseDate: "2025-01-14",
        duration: 360,
        genre: "Jungle",
        plays: 450000,
        downloads: 28000,
        sharesAvailable: 80,
        totalShares: 600,
        revenue: 140000.00,
        dividendPerShare: 23.33,
        volume24h: 280000,
        currentPrice: 115.00,
        priceChange24h: 35.2,
        marketCap: 69000,
        contentType: "jungle",
        category: "Drum & Bass",
        tags: ["jungle", "breakbeat", "oldskool"],
        trending: true,
        txId: "jungle1a2b3...",
        fileFormat: "WAV",
        bitrate: "1411 kbps",
        bpm: 160
      }
    ]

    const mockSamples: MusicListing[] = [
      {
        rank: 1,
        title: "808 Kit Pro",
        artist: "Beat Laboratory",
        artistHandle: "$beatlab",
        artistType: "human",
        releaseDate: "2025-01-13",
        duration: 0,
        genre: "Hip-Hop",
        plays: 890000,
        downloads: 125000,
        sharesAvailable: 200,
        totalShares: 2000,
        revenue: 625000.00,
        dividendPerShare: 31.25,
        volume24h: 450000,
        currentPrice: 45.00,
        priceChange24h: 12.5,
        marketCap: 90000,
        contentType: "sample",
        category: "Drums",
        tags: ["808", "drums", "hip-hop"],
        trending: true,
        txId: "sample1a2b3...",
        fileFormat: "WAV",
        bitrate: "1411 kbps"
      }
    ]

    const mockArtists: ArtistListing[] = [
      {
        rank: 1,
        name: "CyberWave",
        handle: "$cyberwave",
        artistType: "human",
        category: "producers",
        joinDate: "2025-01-15",
        totalTracks: 42,
        totalListeners: 2500000,
        totalRevenue: 1890000.00,
        avgRating: 4.8,
        sharesAvailable: 25,
        totalShares: 5000,
        currentPrice: 785.00,
        priceChange24h: 42.3,
        marketCap: 3925000,
        verified: true,
        trending: true,
        genres: ["Electronic", "Synthwave", "Techno"]
      },
      {
        rank: 2,
        name: "Neural Network",
        handle: "$neuralnet",
        artistType: "ai",
        category: "producers",
        joinDate: "2025-06-01",
        totalTracks: 128,
        totalListeners: 1800000,
        totalRevenue: 980000.00,
        avgRating: 4.5,
        sharesAvailable: 150,
        totalShares: 3000,
        currentPrice: 425.00,
        priceChange24h: 28.7,
        marketCap: 1275000,
        verified: true,
        trending: true,
        genres: ["Electronic", "Ambient", "Experimental"]
      },
      {
        rank: 3,
        name: "DJ Shadow Protocol",
        handle: "$shadowprotocol",
        artistType: "human",
        category: "djs",
        joinDate: "2023-11-20",
        totalTracks: 35,
        totalListeners: 1450000,
        totalRevenue: 725000.00,
        avgRating: 4.7,
        sharesAvailable: 80,
        totalShares: 2000,
        currentPrice: 365.00,
        priceChange24h: 15.4,
        marketCap: 730000,
        verified: true,
        trending: false,
        genres: ["Hip-Hop", "Trap", "Electronic"]
      },
      {
        rank: 4,
        name: "Velvet Dreams",
        handle: "$velvetdreams",
        artistType: "human",
        category: "singers",
        joinDate: "2025-03-10",
        totalTracks: 18,
        totalListeners: 3200000,
        totalRevenue: 1450000.00,
        avgRating: 4.9,
        sharesAvailable: 45,
        totalShares: 2500,
        currentPrice: 580.00,
        priceChange24h: 52.8,
        marketCap: 1450000,
        verified: true,
        trending: true,
        genres: ["Pop", "R&B", "Soul"]
      },
      {
        rank: 5,
        name: "The Blockchain Band",
        handle: "$blockchainband",
        artistType: "human",
        category: "bands",
        joinDate: "2023-09-15",
        totalTracks: 52,
        totalListeners: 980000,
        totalRevenue: 520000.00,
        avgRating: 4.6,
        sharesAvailable: 120,
        totalShares: 1500,
        currentPrice: 285.00,
        priceChange24h: -8.2,
        marketCap: 427500,
        verified: true,
        trending: false,
        genres: ["Rock", "Alternative", "Indie"]
      }
    ]

    // Set data based on active view
    if (activeView === 'artists') {
      let filteredArtists = mockArtists.filter(a => a.artistType === artistType)
      
      if (artistCategory !== 'all') {
        filteredArtists = filteredArtists.filter(a => a.category === artistCategory)
      }
      
      setArtistListings(filteredArtists)
    } else {
      let contentData: MusicListing[] = []
      
      switch (activeView) {
        case 'tracks':
          contentData = mockTracks
          break
        case 'albums':
          contentData = mockAlbums
          break
        case 'mixes':
          contentData = mockMixes
          break
        case 'jungles':
          contentData = mockJungles
          break
        case 'samples':
          contentData = mockSamples
          break
        default:
          contentData = mockTracks
      }
      
      if (activeMarket !== 'All') {
        contentData = contentData.filter(item => item.category === activeMarket)
      }
      
      const filteredMusic = contentData.filter(m => m.artistType === artistType)
      setMusicListings(filteredMusic)
    }
  }, [activeView, artistType, activeMarket, artistCategory])

  const filteredMusic = musicListings
    .filter(music => 
      searchQuery === '' || 
      music.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      music.artist.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch(sortBy) {
        case 'revenue': return b.revenue - a.revenue
        case 'volume': return b.volume24h - a.volume24h
        case 'price': return b.currentPrice - a.currentPrice
        case 'plays': return b.plays - a.plays
        default: return a.rank - b.rank
      }
    })

  const filteredArtists = artistListings
    .filter(artist => 
      searchQuery === '' || 
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.handle.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const handleImportMusic = () => {
    setShowImportModal(true)
  }

  const handleNftPurchase = (music: MusicListing) => {
    if (music.marketUrl) {
      window.open(music.marketUrl, '_blank')
    }
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#0a0a0a',
      color: '#ffffff'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Music size={24} />
            <span style={{ color: '#8b5cf6' }}>Bitcoin Music</span>
            <span>Exchange</span>
          </h1>
          
          {/* Artist Type Toggle */}
          <div style={{
            display: 'flex',
            gap: '4px',
            padding: '4px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px'
          }}>
            <button
              onClick={() => setArtistType('human')}
              style={{
                padding: '8px 16px',
                background: artistType === 'human' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                border: artistType === 'human' ? '1px solid rgba(139, 92, 246, 0.5)' : '1px solid transparent',
                borderRadius: '6px',
                color: artistType === 'human' ? '#8b5cf6' : '#ffffff',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Human Artists"
            >
              👤 Human
            </button>
            <button
              onClick={() => setArtistType('ai')}
              style={{
                padding: '8px 16px',
                background: artistType === 'ai' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                border: artistType === 'ai' ? '1px solid rgba(139, 92, 246, 0.5)' : '1px solid transparent',
                borderRadius: '6px',
                color: artistType === 'ai' ? '#8b5cf6' : '#ffffff',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="AI Artists"
            >
              🤖 AI
            </button>
          </div>
        </div>

        {/* Import Button */}
        <button
          onClick={handleImportMusic}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            border: 'none',
            borderRadius: '8px',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Upload size={16} />
          Import Music
        </button>
      </div>

      {/* View Tabs */}
      <div style={{
        display: 'flex',
        gap: '4px',
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {[
          { value: 'tracks', label: 'Tracks', icon: <Music size={16} /> },
          { value: 'albums', label: 'Albums', icon: <Album size={16} /> },
          { value: 'mixes', label: 'Mixes', icon: <Disc size={16} /> },
          { value: 'jungles', label: 'Jungles', icon: <Radio size={16} /> },
          { value: 'samples', label: 'Samples', icon: <Disc size={16} /> },
          { value: 'artists', label: 'Artists', icon: <Users size={16} /> }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setActiveView(tab.value as any)
              setActiveMarket('All')
            }}
            style={{
              padding: '10px 20px',
              background: activeView === tab.value 
                ? 'rgba(139, 92, 246, 0.2)' 
                : 'rgba(255, 255, 255, 0.05)',
              border: activeView === tab.value
                ? '1px solid rgba(139, 92, 246, 0.5)'
                : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              color: activeView === tab.value ? '#8b5cf6' : '#ffffff',
              fontSize: '14px',
              fontWeight: activeView === tab.value ? '600' : '400',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category Tabs */}
      {activeView !== 'artists' && (
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          overflowX: 'auto'
        }}>
          {(activeView === 'tracks' ? trackCategories :
            activeView === 'albums' ? albumCategories :
            activeView === 'mixes' ? mixCategories :
            activeView === 'jungles' ? jungleCategories :
            sampleCategories).map(category => (
            <button
              key={category}
              onClick={() => setActiveMarket(category)}
              style={{
                padding: '8px 16px',
                background: activeMarket === category 
                  ? 'rgba(139, 92, 246, 0.15)'
                  : 'transparent',
                border: '1px solid',
                borderColor: activeMarket === category
                  ? 'rgba(139, 92, 246, 0.4)'
                  : 'rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                color: activeMarket === category ? '#8b5cf6' : 'rgba(255, 255, 255, 0.7)',
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Artist Category Tabs */}
      {activeView === 'artists' && (
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          overflowX: 'auto'
        }}>
          {artistCategories.map(category => (
            <button
              key={category.value}
              onClick={() => setArtistCategory(category.value as any)}
              style={{
                padding: '8px 16px',
                background: artistCategory === category.value 
                  ? 'rgba(139, 92, 246, 0.15)'
                  : 'transparent',
                border: '1px solid',
                borderColor: artistCategory === category.value
                  ? 'rgba(139, 92, 246, 0.4)'
                  : 'rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                color: artistCategory === category.value ? '#8b5cf6' : 'rgba(255, 255, 255, 0.7)',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              <span>{category.emoji}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Controls */}
      <div style={{
        padding: '16px 20px',
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder={activeView === 'artists' ? "Search artists..." : `Search ${activeView}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            padding: '10px 16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: '#ffffff',
            fontSize: '14px',
            outline: 'none'
          }}
        />
        {activeView !== 'artists' && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              padding: '10px 16px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="rank">Rank</option>
            <option value="revenue">Revenue</option>
            <option value="volume">24h Volume</option>
            <option value="price">Price</option>
            <option value="plays">Plays</option>
          </select>
        )}
      </div>

      {/* Table */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        padding: '0 20px 20px'
      }}>
        {activeView !== 'artists' ? (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>#</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>Title</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>Artist</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>Duration</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>Plays</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>Shares</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>Revenue</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>Price</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>Market Cap</th>
                <th style={{ textAlign: 'center', padding: '12px 8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMusic.map((music) => (
                <tr
                  key={music.txId}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  onClick={() => setSelectedMusic(music)}
                >
                  <td style={{ padding: '16px 8px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(139, 92, 246, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      {music.rank}
                    </div>
                  </td>
                  <td style={{ padding: '16px 8px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                        {music.title}
                        {music.trending && <span style={{ marginLeft: '8px', fontSize: '12px' }}>🔥</span>}
                        {music.isNft && (
                          <span style={{
                            marginLeft: '8px',
                            padding: '2px 6px',
                            background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: '600'
                          }}>
                            NFT
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                        {music.genre} • {music.fileFormat} • {music.bitrate}
                        {music.bpm && ` • ${music.bpm} BPM`}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 8px' }}>
                    <div>
                      <div style={{ fontSize: '14px' }}>{music.artist}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>{music.artistHandle}</div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 8px', fontSize: '14px' }}>
                    {music.duration > 0 ? formatDuration(music.duration) : '-'}
                  </td>
                  <td style={{ padding: '16px 8px' }}>
                    <div>
                      <div style={{ fontSize: '14px' }}>{(music.plays / 1000).toFixed(1)}k</div>
                      <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                        <Download size={10} style={{ display: 'inline', marginRight: '4px' }} />
                        {(music.downloads / 1000).toFixed(1)}k
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 8px' }}>
                    <div style={{ fontSize: '12px' }}>
                      <span style={{ color: '#8b5cf6' }}>{music.sharesAvailable}</span>
                      <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}> / {music.totalShares}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 8px', fontSize: '14px' }}>
                    ${music.revenue.toLocaleString()}
                  </td>
                  <td style={{ padding: '16px 8px' }}>
                    <div>
                      <div style={{ fontSize: '14px' }}>${music.currentPrice.toFixed(2)}</div>
                      <div style={{ 
                        fontSize: '12px', 
                        color: music.priceChange24h >= 0 ? '#10b981' : '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}>
                        {music.priceChange24h >= 0 ? <TrendingUp size={12} /> : ''}
                        {music.priceChange24h >= 0 ? '+' : ''}{music.priceChange24h.toFixed(1)}%
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 8px', fontSize: '14px' }}>
                    ${(music.marketCap / 1000).toFixed(1)}k
                  </td>
                  <td style={{ padding: '16px 8px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                        style={{
                          padding: '6px 12px',
                          background: 'rgba(139, 92, 246, 0.2)',
                          border: '1px solid rgba(139, 92, 246, 0.5)',
                          borderRadius: '4px',
                          color: '#8b5cf6',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Play size={12} />
                        Play
                      </button>
                      {music.isNft ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleNftPurchase(music)
                          }}
                          style={{
                            padding: '6px 12px',
                            background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#ffffff',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          Buy NFT
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(16, 185, 129, 0.2)',
                            border: '1px solid rgba(16, 185, 129, 0.5)',
                            borderRadius: '4px',
                            color: '#10b981',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Buy FT
                        </button>
                      )}
                    </div>
                    {music.royaltyPercentage && (
                      <div style={{ 
                        textAlign: 'center', 
                        marginTop: '4px',
                        fontSize: '11px',
                        color: 'rgba(255, 255, 255, 0.5)'
                      }}>
                        {music.royaltyPercentage}% royalty
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>#</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>Artist</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>Genres</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>Tracks</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>Listeners</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>Revenue</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>Rating</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>Shares</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>Price</th>
                <th style={{ textAlign: 'center', padding: '12px 8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArtists.map((artist) => (
                <tr
                  key={artist.handle}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  onClick={() => setSelectedArtist(artist)}
                >
                  <td style={{ padding: '16px 8px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(139, 92, 246, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      {artist.rank}
                    </div>
                  </td>
                  <td style={{ padding: '16px 8px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                        {artist.name}
                        {artist.verified && (
                          <span style={{
                            marginLeft: '6px',
                            color: '#3b82f6',
                            fontSize: '12px'
                          }}>✓</span>
                        )}
                        {artist.trending && <span style={{ marginLeft: '8px', fontSize: '12px' }}>🔥</span>}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>{artist.handle}</div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 8px' }}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {artist.genres?.map(genre => (
                        <span
                          key={genre}
                          style={{
                            padding: '2px 8px',
                            background: 'rgba(139, 92, 246, 0.1)',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            borderRadius: '12px',
                            fontSize: '11px',
                            color: 'rgba(255, 255, 255, 0.8)'
                          }}
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '16px 8px', fontSize: '14px' }}>{artist.totalTracks}</td>
                  <td style={{ padding: '16px 8px', fontSize: '14px' }}>
                    {(artist.totalListeners / 1000000).toFixed(1)}M
                  </td>
                  <td style={{ padding: '16px 8px', fontSize: '14px' }}>
                    ${artist.totalRevenue.toLocaleString()}
                  </td>
                  <td style={{ padding: '16px 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={14} style={{ color: '#fbbf24' }} />
                      <span style={{ fontSize: '14px' }}>{artist.avgRating}/5.0</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 8px' }}>
                    <div style={{ fontSize: '12px' }}>
                      <span style={{ color: '#8b5cf6' }}>{artist.sharesAvailable}</span>
                      <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}> / {artist.totalShares}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 8px' }}>
                    <div>
                      <div style={{ fontSize: '14px' }}>${artist.currentPrice.toFixed(2)}</div>
                      <div style={{ 
                        fontSize: '12px', 
                        color: artist.priceChange24h >= 0 ? '#10b981' : '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}>
                        {artist.priceChange24h >= 0 ? <TrendingUp size={12} /> : ''}
                        {artist.priceChange24h >= 0 ? '+' : ''}{artist.priceChange24h.toFixed(1)}%
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 8px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                        style={{
                          padding: '6px 12px',
                          background: 'rgba(139, 92, 246, 0.2)',
                          border: '1px solid rgba(139, 92, 246, 0.5)',
                          borderRadius: '4px',
                          color: '#8b5cf6',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        View
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                        style={{
                          padding: '6px 12px',
                          background: 'rgba(16, 185, 129, 0.2)',
                          border: '1px solid rgba(16, 185, 129, 0.5)',
                          borderRadius: '4px',
                          color: '#10b981',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Buy
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Import Modal Placeholder */}
      {showImportModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#1a1a1a',
            borderRadius: '12px',
            padding: '24px',
            width: '500px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h2 style={{ marginBottom: '20px', fontSize: '20px' }}>Import Music Files</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '20px' }}>
              Upload your music files to create NFTs and list fungible tokens (FT) for royalty distribution.
            </p>
            <div style={{
              border: '2px dashed rgba(139, 92, 246, 0.3)',
              borderRadius: '8px',
              padding: '40px',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <Upload size={48} style={{ color: 'rgba(139, 92, 246, 0.5)', marginBottom: '12px' }} />
              <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Drop files here or click to browse
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '12px', marginTop: '8px' }}>
                Supported formats: MP3, WAV, FLAC, AAC
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowImportModal(false)}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Import & Create NFT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}