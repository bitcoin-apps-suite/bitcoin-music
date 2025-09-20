'use client'

import { useState } from 'react'
import { 
  Library, 
  Search, 
  Play, 
  Pause, 
  Heart, 
  Clock, 
  Download,
  MoreVertical,
  Folder,
  Music,
  Radio,
  ListMusic
} from 'lucide-react'

interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: string
  plays: number
  isNFT: boolean
  isFavorite: boolean
}

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeView, setActiveView] = useState<'songs' | 'albums' | 'artists' | 'playlists'>('songs')
  const [playingId, setPlayingId] = useState<string | null>(null)
  
  const [tracks] = useState<Track[]>([
    {
      id: '1',
      title: 'Bitcoin Blues',
      artist: 'Satoshi Sounds',
      album: 'Blockchain Beats',
      duration: '3:45',
      plays: 1234,
      isNFT: true,
      isFavorite: true
    },
    {
      id: '2',
      title: 'Mining Melody',
      artist: 'Hash Rate',
      album: 'Digital Gold',
      duration: '4:12',
      plays: 892,
      isNFT: true,
      isFavorite: false
    },
    {
      id: '3',
      title: 'Decentralized Dreams',
      artist: 'Web3 Collective',
      album: 'Future Finance',
      duration: '5:30',
      plays: 456,
      isNFT: false,
      isFavorite: true
    }
  ])

  const [playlists] = useState([
    { id: '1', name: 'My NFT Collection', tracks: 24, duration: '1h 45m' },
    { id: '2', name: 'Trading Vibes', tracks: 18, duration: '1h 12m' },
    { id: '3', name: 'Chill Blockchain', tracks: 32, duration: '2h 8m' }
  ])

  const filteredTracks = tracks.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.album.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white flex items-center space-x-2">
              <Library className="w-8 h-8 text-bitcoin-orange" />
              <span>Music Library</span>
            </h1>
            <button className="px-4 py-2 bg-bitcoin-orange rounded-lg text-white font-semibold hover:bg-yellow-600 transition-colors">
              Import Music
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search your library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-bitcoin-orange"
            />
          </div>
        </header>

        <div className="flex space-x-2 mb-6">
          {['songs', 'albums', 'artists', 'playlists'].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view as any)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                activeView === view
                  ? 'bg-bitcoin-orange text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {view}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="glass-morphism rounded-xl p-6">
              {activeView === 'songs' && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">All Songs</h2>
                    <span className="text-gray-400">{filteredTracks.length} tracks</span>
                  </div>
                  
                  <div className="space-y-2">
                    {filteredTracks.map((track) => (
                      <div
                        key={track.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-white/10 transition-colors group"
                      >
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => setPlayingId(playingId === track.id ? null : track.id)}
                            className="w-10 h-10 rounded-full bg-bitcoin-orange/20 flex items-center justify-center hover:bg-bitcoin-orange/30 transition-colors"
                          >
                            {playingId === track.id ? (
                              <Pause className="w-4 h-4 text-bitcoin-orange" />
                            ) : (
                              <Play className="w-4 h-4 text-bitcoin-orange" />
                            )}
                          </button>
                          
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-white">{track.title}</span>
                              {track.isNFT && (
                                <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded">
                                  NFT
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-400">
                              {track.artist} • {track.album}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-400">{track.duration}</span>
                          <button className={`p-1 ${track.isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-gray-300'}`}>
                            <Heart className="w-4 h-4" fill={track.isFavorite ? 'currentColor' : 'none'} />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              {activeView === 'playlists' && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">Playlists</h2>
                    <button className="px-3 py-1 bg-bitcoin-orange rounded-lg text-white text-sm hover:bg-yellow-600 transition-colors">
                      New Playlist
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {playlists.map((playlist) => (
                      <div key={playlist.id} className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <ListMusic className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{playlist.name}</h3>
                            <p className="text-sm text-gray-400">
                              {playlist.tracks} tracks • {playlist.duration}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-morphism rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Tracks</span>
                  <span className="text-white font-semibold">{tracks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">NFT Tracks</span>
                  <span className="text-white font-semibold">
                    {tracks.filter(t => t.isNFT).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Plays</span>
                  <span className="text-white font-semibold">
                    {tracks.reduce((sum, t) => sum + t.plays, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Favorites</span>
                  <span className="text-white font-semibold">
                    {tracks.filter(t => t.isFavorite).length}
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-morphism rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recently Played</h3>
              <div className="space-y-3">
                {tracks.slice(0, 3).map((track) => (
                  <div key={track.id} className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <Music className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white truncate">{track.title}</div>
                      <div className="text-xs text-gray-400">{track.artist}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-morphism rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Storage</h3>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">2.3 GB</div>
                  <div className="text-sm text-gray-400">of 10 GB used</div>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full">
                  <div className="w-1/4 h-full bg-bitcoin-orange rounded-full" />
                </div>
                <button className="w-full py-2 bg-white/10 rounded-lg text-gray-300 hover:bg-white/20 transition-colors">
                  Manage Storage
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}