'use client'

import { useState, useEffect } from 'react'
import { 
  Music, 
  Headphones, 
  Mic, 
  Play, 
  DollarSign, 
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Users,
  Star,
  Check,
  ArrowRight,
  Volume2,
  Radio,
  Disc,
  Download,
  Upload,
  Lock,
  Unlock,
  Award,
  BarChart3
} from 'lucide-react'
import BitcoinMusicLogo from '@/components/BitcoinMusicLogo'

export default function BitcoinMusicPage() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: <Music size={24} />,
      title: 'Create & Produce',
      description: 'Professional DAW with multi-track recording, MIDI sequencing, and virtual instruments'
    },
    {
      icon: <Shield size={24} />,
      title: 'Mint Music NFTs',
      description: 'Turn your tracks into NFTs on Bitcoin BSV blockchain with proof of ownership'
    },
    {
      icon: <DollarSign size={24} />,
      title: 'Earn Royalties',
      description: 'Automatic royalty distribution to token holders through smart contracts'
    },
    {
      icon: <TrendingUp size={24} />,
      title: 'Trade on Exchange',
      description: 'Buy and sell music tokens, trade shares in tracks, albums, and artists'
    },
    {
      icon: <Users size={24} />,
      title: 'Collaborate',
      description: 'Work with producers, artists, and musicians worldwide in real-time'
    },
    {
      icon: <Globe size={24} />,
      title: 'Global Distribution',
      description: 'Instant worldwide distribution with no intermediaries or gatekeepers'
    }
  ]

  const pricingPlans = [
    {
      name: 'Free',
      price: '0',
      features: [
        '3 tracks per month',
        'Basic mixing tools',
        'Export to MP3',
        'Community support',
        'Public tracks only'
      ],
      color: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'rgba(255, 255, 255, 0.2)'
    },
    {
      name: 'Artist',
      price: '9.99',
      features: [
        'Unlimited tracks',
        'Professional mixing desk',
        'All export formats',
        'NFT minting',
        'Royalty management',
        'Private tracks',
        'Priority support'
      ],
      color: 'rgba(139, 92, 246, 0.2)',
      borderColor: 'rgba(139, 92, 246, 0.5)',
      recommended: true
    },
    {
      name: 'Studio',
      price: '29.99',
      features: [
        'Everything in Artist',
        'Multi-user collaboration',
        'Advanced mastering',
        'Bulk NFT minting',
        'Custom smart contracts',
        'API access',
        'White-label options',
        '24/7 phone support'
      ],
      color: 'rgba(255, 215, 0, 0.1)',
      borderColor: 'rgba(255, 215, 0, 0.3)'
    }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
      color: '#ffffff',
      overflowX: 'hidden'
    }}>
      {/* Hero Section */}
      <section style={{
        padding: '80px 20px',
        textAlign: 'center',
        position: 'relative',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.8s ease-out'
      }}>
        {/* Animated Background */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          animation: 'pulse 4s ease-in-out infinite',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: '40px' }}>
            <BitcoinMusicLogo size={120} />
          </div>
          
          <h1 style={{
            fontSize: '64px',
            fontWeight: '700',
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-2px',
            lineHeight: '1.1'
          }}>
            Bitcoin Music Studio
          </h1>
          
          <p style={{
            fontSize: '24px',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px',
            lineHeight: '1.5'
          }}>
            Create, mint, and trade music on the blockchain. 
            The future of music is decentralized.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                padding: '16px 32px',
                fontSize: '18px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                border: 'none',
                borderRadius: '12px',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Play size={20} />
              Launch Studio
            </button>
            
            <button
              onClick={() => window.location.href = '/marketplace'}
              style={{
                padding: '16px 32px',
                fontSize: '18px',
                fontWeight: '600',
                background: 'transparent',
                border: '2px solid rgba(139, 92, 246, 0.5)',
                borderRadius: '12px',
                color: '#a78bfa',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)'
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.8)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)'
              }}
            >
              Browse Marketplace
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(180deg, transparent, rgba(139, 92, 246, 0.05), transparent)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '48px',
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: '60px',
            color: '#ffffff'
          }}>
            Everything Musicians Need
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  padding: '32px',
                  background: activeFeature === index 
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1))'
                    : 'rgba(255, 255, 255, 0.03)',
                  border: activeFeature === index
                    ? '2px solid rgba(139, 92, 246, 0.5)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: activeFeature === index ? 'scale(1.02)' : 'scale(1)',
                }}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  marginBottom: '12px',
                  color: '#ffffff'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: '1.6'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Studio Features */}
      <section style={{
        padding: '80px 20px',
        background: 'rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '60px',
            alignItems: 'center'
          }}>
            <div>
              <h2 style={{
                fontSize: '42px',
                fontWeight: '600',
                marginBottom: '32px',
                background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Professional Studio Tools
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {[
                  { icon: <Headphones />, text: '32-channel mixing desk with EQ and effects' },
                  { icon: <Mic />, text: 'Multi-track recording with virtual instruments' },
                  { icon: <Radio />, text: 'MIDI sequencer and piano roll editor' },
                  { icon: <Volume2 />, text: 'Real-time audio processing and mastering' },
                  { icon: <Disc />, text: 'Export to all major formats (WAV, FLAC, MP3)' }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'rgba(139, 92, 246, 0.2)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#8b5cf6'
                    }}>
                      {item.icon}
                    </div>
                    <span style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.9)' }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{
              padding: '40px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))',
              borderRadius: '20px',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent)',
                borderRadius: '50%'
              }} />
              
              <h3 style={{
                fontSize: '28px',
                fontWeight: '600',
                marginBottom: '24px',
                color: '#ffffff'
              }}>
                Mixing Desk
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px',
                marginBottom: '24px'
              }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{
                    height: '120px',
                    background: 'linear-gradient(180deg, #1a1a1a, #2a2a2a)',
                    borderRadius: '8px',
                    padding: '8px',
                    border: '1px solid rgba(139, 92, 246, 0.2)'
                  }}>
                    <div style={{
                      width: '100%',
                      height: '80px',
                      background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.3), rgba(139, 92, 246, 0.1))',
                      borderRadius: '4px',
                      marginBottom: '8px'
                    }} />
                    <div style={{
                      display: 'flex',
                      gap: '4px',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '50%'
                      }} />
                      <div style={{
                        width: '20px',
                        height: '20px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '50%'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
              
              <p style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.6)',
                textAlign: 'center'
              }}>
                Professional-grade mixing console with full EQ and effects
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blockchain Features */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(180deg, transparent, rgba(139, 92, 246, 0.03), transparent)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '42px',
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: '60px',
            color: '#ffffff'
          }}>
            Powered by Bitcoin BSV
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px'
          }}>
            {[
              {
                icon: <Lock size={32} />,
                title: 'Immutable Ownership',
                description: 'Your music is permanently recorded on the blockchain with cryptographic proof'
              },
              {
                icon: <Zap size={32} />,
                title: 'Instant Transactions',
                description: 'Near-zero fees and instant settlement for all music trades and royalties'
              },
              {
                icon: <Shield size={32} />,
                title: 'No Intermediaries',
                description: 'Direct artist-to-fan relationships without record labels or distributors'
              },
              {
                icon: <BarChart3 size={32} />,
                title: 'Transparent Royalties',
                description: 'Smart contracts automatically distribute royalties to all stakeholders'
              }
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  textAlign: 'center',
                  padding: '32px 24px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'transform 0.3s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1))',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  color: '#8b5cf6'
                }}>
                  {item.icon}
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '12px',
                  color: '#ffffff'
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  lineHeight: '1.6'
                }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{
        padding: '80px 20px',
        background: 'rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '42px',
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: '20px',
            color: '#ffffff'
          }}>
            Choose Your Plan
          </h2>
          
          <p style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: 'center',
            marginBottom: '60px'
          }}>
            Start free, upgrade anytime. All plans include blockchain features.
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px'
          }}>
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                style={{
                  padding: '40px 32px',
                  background: plan.color,
                  border: `2px solid ${plan.borderColor}`,
                  borderRadius: '20px',
                  position: 'relative',
                  transition: 'transform 0.3s',
                  transform: plan.recommended ? 'scale(1.05)' : 'scale(1)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = plan.recommended ? 'scale(1.05)' : 'scale(1)'}
              >
                {plan.recommended && (
                  <div style={{
                    position: 'absolute',
                    top: '-16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '6px 20px',
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#ffffff'
                  }}>
                    RECOMMENDED
                  </div>
                )}
                
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#ffffff'
                }}>
                  {plan.name}
                </h3>
                
                <div style={{
                  fontSize: '48px',
                  fontWeight: '700',
                  marginBottom: '24px',
                  color: plan.recommended ? '#8b5cf6' : '#ffffff'
                }}>
                  ${plan.price}
                  <span style={{
                    fontSize: '18px',
                    fontWeight: '400',
                    color: 'rgba(255, 255, 255, 0.6)'
                  }}>
                    /month
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  marginBottom: '32px'
                }}>
                  {plan.features.map((feature, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <Check size={16} style={{ color: '#8b5cf6', flexShrink: 0 }} />
                      <span style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.8)'
                      }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                
                <button
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: plan.recommended
                      ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                      : 'rgba(255, 255, 255, 0.1)',
                    border: plan.recommended
                      ? 'none'
                      : '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(180deg, transparent, rgba(139, 92, 246, 0.05), transparent)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '42px',
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: '60px',
            color: '#ffffff'
          }}>
            Artists Love Bitcoin Music
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '32px'
          }}>
            {[
              {
                name: 'Sarah Chen',
                role: 'Electronic Producer',
                rating: 5,
                comment: 'Finally, I own my music and get paid instantly. No more waiting months for royalties!'
              },
              {
                name: 'Marcus Johnson',
                role: 'Hip-Hop Artist',
                rating: 5,
                comment: 'The mixing desk rivals any professional studio. Creating beats has never been easier.'
              },
              {
                name: 'Luna Martinez',
                role: 'Singer-Songwriter',
                rating: 5,
                comment: 'I minted my first album as NFTs and sold out in 24 hours. Game changer!'
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                style={{
                  padding: '32px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div style={{
                  display: 'flex',
                  gap: '4px',
                  marginBottom: '16px'
                }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} fill="#ffd93d" color="#ffd93d" />
                  ))}
                </div>
                
                <p style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '20px',
                  fontStyle: 'italic',
                  lineHeight: '1.6'
                }}>
                  "{testimonial.comment}"
                </p>
                
                <div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#ffffff'
                  }}>
                    {testimonial.name}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.5)'
                  }}>
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '100px 20px',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '48px',
            fontWeight: '700',
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Start Creating Today
          </h2>
          
          <p style={{
            fontSize: '20px',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            Join thousands of artists building the future of music on Bitcoin.
            No credit card required.
          </p>
          
          <button
            onClick={() => window.location.href = '/'}
            style={{
              padding: '20px 48px',
              fontSize: '20px',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 12px 40px rgba(139, 92, 246, 0.5)',
              transition: 'transform 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Music size={24} />
            Launch Bitcoin Music Studio
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '32px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BitcoinMusicLogo size={32} />
            <span style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff' }}>
              Bitcoin Music
            </span>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '32px',
            flexWrap: 'wrap'
          }}>
            {['Features', 'Pricing', 'Documentation', 'Support', 'Blog'].map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
              >
                {link}
              </a>
            ))}
          </div>
          
          <div style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.5)'
          }}>
            © 2025 Bitcoin Music. Built on BSV.
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}