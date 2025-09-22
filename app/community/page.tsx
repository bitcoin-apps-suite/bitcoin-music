'use client'

import { useState } from 'react'
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  TrendingUp,
  Award,
  Music,
  Radio,
  Mic,
  Calendar,
  MapPin,
  Ticket
} from 'lucide-react'

interface Artist {
  id: string
  name: string
  followers: number
  nfts: number
  avatar: string
  isVerified: boolean
}

interface Post {
  id: string
  author: string
  content: string
  likes: number
  comments: number
  shares: number
  timestamp: Date
  type: 'text' | 'music' | 'event'
  musicTitle?: string
}

interface Event {
  id: string
  title: string
  artist: string
  date: Date
  location: string
  price: number
  attendees: number
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'artists' | 'events'>('feed')
  
  const [topArtists] = useState<Artist[]>([
    {
      id: '1',
      name: 'Satoshi Sounds',
      followers: 12500,
      nfts: 24,
      avatar: '',
      isVerified: true
    },
    {
      id: '2',
      name: 'Digital Orchestra',
      followers: 8900,
      nfts: 15,
      avatar: '',
      isVerified: true
    },
    {
      id: '3',
      name: 'Hash Rate',
      followers: 6200,
      nfts: 18,
      avatar: '',
      isVerified: false
    }
  ])

  const [posts] = useState<Post[]>([
    {
      id: '1',
      author: 'Satoshi Sounds',
      content: 'Just dropped my new Bitcoin Blues NFT! Limited edition with only 10,000 shares available. Each holder gets 12% APY dividends!',
      likes: 234,
      comments: 45,
      shares: 12,
      timestamp: new Date(),
      type: 'music',
      musicTitle: 'Bitcoin Blues'
    },
    {
      id: '2',
      author: 'Digital Orchestra',
      content: 'Working on a collaborative symphony with the community. Submit your samples and get credited as co-creator!',
      likes: 189,
      comments: 67,
      shares: 23,
      timestamp: new Date(Date.now() - 3600000),
      type: 'text'
    }
  ])

  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'Blockchain Music Festival',
      artist: 'Various Artists',
      date: new Date('2025-03-15'),
      location: 'Virtual Metaverse',
      price: 0.01,
      attendees: 500
    },
    {
      id: '2',
      title: 'NFT Launch Party',
      artist: 'Satoshi Sounds',
      date: new Date('2025-03-20'),
      location: 'Discord Stage',
      price: 0,
      attendees: 1200
    }
  ])

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center space-x-2">
            <Users className="w-8 h-8 text-bitcoin-orange" />
            <span>Music Community</span>
          </h1>
          <p className="text-gray-400 mt-1">Connect with artists and collectors worldwide</p>
        </header>

        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'feed'
                ? 'bg-bitcoin-orange text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Feed
          </button>
          <button
            onClick={() => setActiveTab('artists')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'artists'
                ? 'bg-bitcoin-orange text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Artists
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'events'
                ? 'bg-bitcoin-orange text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Events
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {activeTab === 'feed' && (
              <div className="space-y-4">
                <div className="glass-morphism rounded-xl p-4">
                  <textarea
                    placeholder="Share your music journey..."
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-bitcoin-orange resize-none"
                    rows={3}
                  />
                  <div className="flex justify-between mt-3">
                    <div className="flex space-x-2">
                      <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                        <Music className="w-5 h-5 text-gray-300" />
                      </button>
                      <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                        <Mic className="w-5 h-5 text-gray-300" />
                      </button>
                    </div>
                    <button className="px-4 py-2 bg-bitcoin-orange rounded-lg text-white font-semibold hover:bg-yellow-600 transition-colors">
                      Post
                    </button>
                  </div>
                </div>

                {posts.map((post) => (
                  <div key={post.id} className="glass-morphism rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-bitcoin-orange/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-bitcoin-orange" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white">{post.author}</span>
                          <span className="text-xs text-gray-400">
                            {new Date(post.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-gray-300 mt-2">{post.content}</p>
                        
                        {post.type === 'music' && post.musicTitle && (
                          <div className="mt-3 p-3 bg-white/5 rounded-lg flex items-center space-x-3">
                            <div className="w-12 h-12 rounded bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                              <Music className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-white">{post.musicTitle}</div>
                              <div className="text-sm text-gray-400">New Release</div>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-6 mt-4">
                          <button className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm">{post.likes}</span>
                          </button>
                          <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm">{post.comments}</span>
                          </button>
                          <button className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors">
                            <Share2 className="w-4 h-4" />
                            <span className="text-sm">{post.shares}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'artists' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topArtists.map((artist) => (
                  <div key={artist.id} className="glass-morphism rounded-xl p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-bitcoin-orange to-yellow-500 flex items-center justify-center">
                          <Mic className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-white">{artist.name}</span>
                            {artist.isVerified && (
                              <Award className="w-4 h-4 text-blue-400" />
                            )}
                          </div>
                          <div className="text-sm text-gray-400">
                            {artist.followers.toLocaleString()} followers
                          </div>
                        </div>
                      </div>
                      <button className="px-3 py-1 bg-bitcoin-orange rounded-lg text-white text-sm hover:bg-yellow-600 transition-colors">
                        Follow
                      </button>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-gray-400">{artist.nfts} NFTs</span>
                      <button className="text-bitcoin-orange hover:text-yellow-500">
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="glass-morphism rounded-xl p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                        <p className="text-gray-400 mt-1">{event.artist}</p>
                        
                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-300">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{event.date.toLocaleDateString()}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{event.attendees} attending</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-semibold text-bitcoin-orange">
                          {event.price === 0 ? 'Free' : `${event.price} BSV`}
                        </div>
                        <button className="mt-2 px-4 py-2 bg-bitcoin-orange rounded-lg text-white text-sm hover:bg-yellow-600 transition-colors">
                          Get Tickets
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="glass-morphism rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Trending Artists</h3>
              <div className="space-y-3">
                {topArtists.slice(0, 3).map((artist, index) => (
                  <div key={artist.id} className="flex items-center space-x-3">
                    <span className="text-bitcoin-orange font-bold">#{index + 1}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-white">{artist.name}</div>
                      <div className="text-xs text-gray-400">
                        {artist.followers.toLocaleString()} followers
                      </div>
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-morphism rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Community Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Artists</span>
                  <span className="text-white font-semibold">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total NFTs</span>
                  <span className="text-white font-semibold">8,901</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Daily Trades</span>
                  <span className="text-white font-semibold">45,678</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Volume</span>
                  <span className="text-white font-semibold">234.5 BSV</span>
                </div>
              </div>
            </div>

            <div className="glass-morphism rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {events.slice(0, 2).map((event) => (
                  <div key={event.id} className="p-3 bg-white/5 rounded-lg">
                    <div className="font-semibold text-white text-sm">{event.title}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {event.date.toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}