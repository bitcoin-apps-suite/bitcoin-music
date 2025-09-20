'use client'

import { useState } from 'react'
import { Music, DollarSign, Users, Code, ChevronRight, Trophy, Briefcase, Calendar, Target } from 'lucide-react'

export default function TokenPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #1a1a1a, #0a0a0a)',
      color: '#ffffff'
    }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
        padding: '6rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.1
        }} />
        
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>₿</div>
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            background: 'linear-gradient(to right, #ffffff, #e0e0e0)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            $BMusic Token
          </h1>
          <p style={{ 
            fontSize: '1.5rem', 
            opacity: 0.95,
            marginBottom: '3rem',
            lineHeight: '1.6'
          }}>
            The native utility token powering the Bitcoin Music ecosystem, 
            enabling professional music production and decentralized NFT trading.
          </p>
        </div>
      </section>

      {/* Stats Grid */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem'
        }}>
          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
            padding: '2rem',
            textAlign: 'center',
            transition: 'transform 0.3s ease',
          }}>
            <Music size={48} style={{ color: '#8b5cf6', marginBottom: '1rem' }} />
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>1,000,000,000</div>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Total Supply</div>
          </div>

          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <DollarSign size={48} style={{ color: '#a855f7', marginBottom: '1rem' }} />
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>$0.001</div>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Initial Price</div>
          </div>

          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <Users size={48} style={{ color: '#d946ef', marginBottom: '1rem' }} />
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>49</div>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Dev Tasks Available</div>
          </div>

          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <Code size={48} style={{ color: '#ec4899', marginBottom: '1rem' }} />
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>BSV-20</div>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Token Standard</div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section style={{ 
        background: 'rgba(139, 92, 246, 0.05)', 
        padding: '4rem 2rem',
        borderTop: '1px solid rgba(139, 92, 246, 0.2)',
        borderBottom: '1px solid rgba(139, 92, 246, 0.2)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '3rem', color: '#8b5cf6' }}>
            About $BMusic
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{
              background: 'rgba(26, 26, 26, 0.8)',
              borderRadius: '12px',
              padding: '2rem',
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
              <h3 style={{ color: '#8b5cf6', marginBottom: '1rem', fontSize: '1.5rem' }}>
                Studio Access & Features
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
                $BMusic tokens unlock premium DAW features including advanced virtual instruments, 
                professional effects chains, unlimited track recording, AI-powered mastering, 
                and exclusive sound libraries from top producers.
              </p>
            </div>

            <div style={{
              background: 'rgba(26, 26, 26, 0.8)',
              borderRadius: '12px',
              padding: '2rem',
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
              <h3 style={{ color: '#8b5cf6', marginBottom: '1rem', fontSize: '1.5rem' }}>
                NFT Marketplace Benefits
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
                Hold $BMusic to get reduced marketplace fees, priority NFT minting, 
                early access to exclusive drops, and automatic royalty distribution 
                for your music sales on the blockchain.
              </p>
            </div>

            <div style={{
              background: 'rgba(26, 26, 26, 0.8)',
              borderRadius: '12px',
              padding: '2rem',
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
              <h3 style={{ color: '#8b5cf6', marginBottom: '1rem', fontSize: '1.5rem' }}>
                Artist Revenue Sharing
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
                97.5% of all music NFT sales go directly to artists. The platform takes 
                only a 2.5% fee, ensuring musicians keep the vast majority of their 
                earnings while building sustainable careers.
              </p>
            </div>

            <div style={{
              background: 'rgba(26, 26, 26, 0.8)',
              borderRadius: '12px',
              padding: '2rem',
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}>
              <h3 style={{ color: '#8b5cf6', marginBottom: '1rem', fontSize: '1.5rem' }}>
                Developer Bounties
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
                Developers earn 10,000,000 $BMusic (1% of supply) for each successfully 
                merged PR. With 49 tasks available, developers can earn up to 49% of 
                the total token supply by contributing to the platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tokenomics Table */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '3rem', color: '#8b5cf6' }}>
          Tokenomics
        </h2>
        
        <div style={{
          background: 'rgba(26, 26, 26, 0.8)',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(139, 92, 246, 0.2)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(139, 92, 246, 0.15)' }}>
                <th style={{ padding: '1.5rem', textAlign: 'left', color: '#8b5cf6', fontWeight: '600' }}>
                  Allocation
                </th>
                <th style={{ padding: '1.5rem', textAlign: 'left', color: '#8b5cf6', fontWeight: '600' }}>
                  Percentage
                </th>
                <th style={{ padding: '1.5rem', textAlign: 'left', color: '#8b5cf6', fontWeight: '600' }}>
                  Amount
                </th>
                <th style={{ padding: '1.5rem', textAlign: 'left', color: '#8b5cf6', fontWeight: '600' }}>
                  Purpose
                </th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderTop: '1px solid rgba(139, 92, 246, 0.1)' }}>
                <td style={{ padding: '1.5rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  Platform Reserve
                </td>
                <td style={{ padding: '1.5rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  51%
                </td>
                <td style={{ padding: '1.5rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  510,000,000
                </td>
                <td style={{ padding: '1.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  Bitcoin Software Company LTD treasury
                </td>
              </tr>
              <tr style={{ borderTop: '1px solid rgba(139, 92, 246, 0.1)' }}>
                <td style={{ padding: '1.5rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  Developer Fund
                </td>
                <td style={{ padding: '1.5rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  49%
                </td>
                <td style={{ padding: '1.5rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  490,000,000
                </td>
                <td style={{ padding: '1.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  Developer bounties (10M per task)
                </td>
              </tr>
              <tr style={{ borderTop: '1px solid rgba(139, 92, 246, 0.1)' }}>
                <td style={{ padding: '1.5rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  Artist Revenue
                </td>
                <td style={{ padding: '1.5rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  97.5%
                </td>
                <td style={{ padding: '1.5rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  N/A
                </td>
                <td style={{ padding: '1.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  Of all NFT sales go to artists
                </td>
              </tr>
              <tr style={{ borderTop: '1px solid rgba(139, 92, 246, 0.1)' }}>
                <td style={{ padding: '1.5rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  Platform Fee
                </td>
                <td style={{ padding: '1.5rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  2.5%
                </td>
                <td style={{ padding: '1.5rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  N/A
                </td>
                <td style={{ padding: '1.5rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  Marketplace transaction fee
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Roadmap */}
      <section style={{ 
        background: 'rgba(139, 92, 246, 0.05)', 
        padding: '4rem 2rem',
        borderTop: '1px solid rgba(139, 92, 246, 0.2)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '3rem', color: '#8b5cf6' }}>
            Roadmap
          </h2>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{
              background: 'rgba(26, 26, 26, 0.8)',
              borderRadius: '12px',
              padding: '2rem',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '2rem'
            }}>
              <Calendar size={32} style={{ color: '#8b5cf6', flexShrink: 0 }} />
              <div>
                <h3 style={{ color: '#8b5cf6', marginBottom: '0.5rem' }}>Q1 2025 - Foundation</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Launch $BMusic token • Deploy core DAW features • Release NFT minting • Begin developer bounty program
                </p>
              </div>
            </div>

            <div style={{
              background: 'rgba(26, 26, 26, 0.8)',
              borderRadius: '12px',
              padding: '2rem',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '2rem'
            }}>
              <Trophy size={32} style={{ color: '#a855f7', flexShrink: 0 }} />
              <div>
                <h3 style={{ color: '#a855f7', marginBottom: '0.5rem' }}>Q2 2025 - Enhancement</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  AI mastering tools • Real-time collaboration • VST plugin support • Mobile app development
                </p>
              </div>
            </div>

            <div style={{
              background: 'rgba(26, 26, 26, 0.8)',
              borderRadius: '12px',
              padding: '2rem',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '2rem'
            }}>
              <Briefcase size={32} style={{ color: '#d946ef', flexShrink: 0 }} />
              <div>
                <h3 style={{ color: '#d946ef', marginBottom: '0.5rem' }}>Q3 2025 - Expansion</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Cross-chain bridges • Virtual concert platform • Hardware integration • Label partnerships
                </p>
              </div>
            </div>

            <div style={{
              background: 'rgba(26, 26, 26, 0.8)',
              borderRadius: '12px',
              padding: '2rem',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '2rem'
            }}>
              <Target size={32} style={{ color: '#ec4899', flexShrink: 0 }} />
              <div>
                <h3 style={{ color: '#ec4899', marginBottom: '0.5rem' }}>Q4 2025 - Revolution</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  DAO governance • Global music rights • Spatial audio/VR • AI music generation
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Buttons */}
      <section style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => window.location.href = '/exchange'}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '1rem 2.5rem',
              borderRadius: '12px',
              fontSize: '1.125rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
              boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Buy $BMusic
          </button>
          
          <button
            onClick={() => window.location.href = '/tasks'}
            style={{
              background: 'transparent',
              color: '#8b5cf6',
              border: '2px solid #8b5cf6',
              padding: '1rem 2.5rem',
              borderRadius: '12px',
              fontSize: '1.125rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            View Developer Tasks
          </button>
          
          <button
            onClick={() => window.open('https://whatsonchain.com', '_blank')}
            style={{
              background: 'transparent',
              color: '#8b5cf6',
              border: '2px solid #8b5cf6',
              padding: '1rem 2.5rem',
              borderRadius: '12px',
              fontSize: '1.125rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            View on Explorer
          </button>
        </div>
      </section>
    </div>
  )
}