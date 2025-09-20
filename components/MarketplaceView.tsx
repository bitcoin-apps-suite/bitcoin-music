'use client'

import { useState } from 'react'
import { Search, Filter, Grid, List, TrendingUp, Music, DollarSign, Clock, Star } from 'lucide-react'

export default function MarketplaceView() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')

  const featuredNFTs = [
    { id: 1, title: 'Summer Vibes EP', artist: 'DJ Crypto', price: '0.5 BSV', plays: '12.3k', rating: 4.8 },
    { id: 2, title: 'Blockchain Blues', artist: 'The Miners', price: '0.3 BSV', plays: '8.7k', rating: 4.6 },
    { id: 3, title: 'Digital Dreams', artist: 'Synth Master', price: '0.8 BSV', plays: '15.2k', rating: 4.9 },
    { id: 4, title: 'Crypto Beats Vol.1', artist: 'Beat Maker', price: '0.4 BSV', plays: '6.5k', rating: 4.5 },
  ]

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#0a0a0a'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h1 style={{ color: '#ffffff', fontSize: '24px', fontWeight: '600' }}>
            Music NFT Marketplace
          </h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '8px',
                background: viewMode === 'grid' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                color: viewMode === 'grid' ? '#8b5cf6' : '#ffffff',
                cursor: 'pointer'
              }}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '8px',
                background: viewMode === 'list' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                color: viewMode === 'list' ? '#8b5cf6' : '#ffffff',
                cursor: 'pointer'
              }}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 255, 255, 0.5)'
            }} />
            <input
              type="text"
              placeholder="Search music NFTs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 10px 10px 40px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
          <button style={{
            padding: '10px 20px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Filter size={18} />
            Filters
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{
        padding: '16px 20px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        gap: '32px'
      }}>
        {[
          { icon: <Music size={16} />, label: 'Total NFTs', value: '1,234' },
          { icon: <DollarSign size={16} />, label: '24h Volume', value: '456 BSV' },
          { icon: <TrendingUp size={16} />, label: 'Floor Price', value: '0.1 BSV' },
          { icon: <Clock size={16} />, label: 'Latest Drop', value: '2 hours ago' }
        ].map((stat, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ color: '#8b5cf6' }}>{stat.icon}</div>
            <div>
              <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '11px' }}>{stat.label}</div>
              <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600' }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: '20px',
        overflowY: 'auto'
      }}>
        <h2 style={{ color: '#ffffff', fontSize: '18px', marginBottom: '16px' }}>Featured Music NFTs</h2>
        
        {viewMode === 'grid' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {featuredNFTs.map((nft) => (
              <div key={nft.id} style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}>
                <div style={{
                  width: '100%',
                  height: '150px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                  borderRadius: '6px',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Music size={48} style={{ color: 'rgba(255, 255, 255, 0.3)' }} />
                </div>
                <h3 style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                  {nft.title}
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', marginBottom: '8px' }}>
                  by {nft.artist}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#8b5cf6', fontSize: '16px', fontWeight: '600' }}>{nft.price}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '11px' }}>{nft.plays}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Star size={12} style={{ color: '#f59e0b' }} />
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '11px' }}>{nft.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {featuredNFTs.map((nft) => (
              <div key={nft.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Music size={24} style={{ color: 'rgba(255, 255, 255, 0.3)' }} />
                  </div>
                  <div>
                    <h3 style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600' }}>{nft.title}</h3>
                    <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>by {nft.artist}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>{nft.plays} plays</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={14} style={{ color: '#f59e0b' }} />
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>{nft.rating}</span>
                  </div>
                  <span style={{ color: '#8b5cf6', fontSize: '16px', fontWeight: '600', minWidth: '80px', textAlign: 'right' }}>
                    {nft.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}