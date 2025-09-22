'use client';

import React from 'react';
import './marketing.css';

const MarketingPage: React.FC = () => {
  return (
    <div className="marketing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-grid"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-logo">
            <span className="bitcoin-symbol">♪</span>
          </div>
          
          <h1 className="hero-title">
            <span className="title-bitcoin">Bitcoin</span>
            <span className="title-email">Music</span>
          </h1>
          
          <p className="hero-subtitle">
            The world's first blockchain-powered music platform with native Bitcoin payments, 
            NFT ownership, and decentralized royalty distribution.
          </p>
          
          <div className="hero-buttons">
            <button className="cta-primary">
              <span>Launch Studio</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="cta-secondary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Watch Demo</span>
            </button>
          </div>
          
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-number">100%</div>
              <div className="stat-label">Artist Royalties</div>
            </div>
            <div className="stat">
              <div className="stat-number">$0.001</div>
              <div className="stat-label">Per Stream</div>
            </div>
            <div className="stat">
              <div className="stat-number">32-Channel</div>
              <div className="stat-label">Pro Mixing Desk</div>
            </div>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="app-preview">
            <div className="app-window">
              <div className="window-header">
                <div className="window-controls">
                  <div className="control close"></div>
                  <div className="control minimize"></div>
                  <div className="control maximize"></div>
                </div>
                <div className="window-title">Bitcoin Music Studio</div>
              </div>
              <div className="window-content">
                <div className="mock-sidebar">
                  <div className="mock-nav-item active">🎵 Tracks <span className="badge">234</span></div>
                  <div className="mock-nav-item">💿 Albums</div>
                  <div className="mock-nav-item">🎛️ Mixes <span className="badge">12</span></div>
                  <div className="mock-nav-item">🎼 Samples</div>
                </div>
                <div className="mock-email-list">
                  <div className="mock-email">
                    <div className="email-avatar"></div>
                    <div className="email-content">
                      <div className="email-from">Electric Dreams</div>
                      <div className="email-subject">Synthwave Paradise - Album</div>
                      <div className="email-preview">8 tracks • 42:30 • Electronic/Synthwave...</div>
                    </div>
                    <div className="email-meta">
                      <div className="email-time">2.3K plays</div>
                      <div className="bitcoin-payment">₿ 0.025</div>
                    </div>
                  </div>
                  <div className="mock-email">
                    <div className="email-avatar"></div>
                    <div className="email-content">
                      <div className="email-from">Midnight Beats</div>
                      <div className="email-subject">Lo-Fi Dreams Collection</div>
                      <div className="email-preview">Perfect for studying and relaxation...</div>
                    </div>
                    <div className="email-meta">
                      <div className="email-time">5.7K plays</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              Revolutionary Music Infrastructure
            </h2>
            <p className="section-subtitle">
              Built on Bitcoin blockchain technology for transparent royalties, NFT ownership, and direct artist payments.
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon bitcoin">
                <span>₿</span>
              </div>
              <h3 className="feature-title">Instant Royalty Payments</h3>
              <p className="feature-description">
                Artists receive Bitcoin payments instantly for every stream. 
                No middlemen, no delays, no minimum thresholds.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon studio">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="feature-title">32-Channel Digital Console</h3>
              <p className="feature-description">
                Industry-standard mixing with motorized faders, 4-band parametric EQ per channel, 
                8 aux sends, 16 buses, and full automation support. SSL-quality preamps and converters.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon security">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="feature-title">NFT Music Ownership</h3>
              <p className="feature-description">
                Own your music as NFTs on the blockchain. 
                True digital ownership with verifiable scarcity and authenticity.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon blockchain">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="feature-title">Immutable Metadata</h3>
              <p className="feature-description">
                Store music metadata permanently on Bitcoin. 
                Credits, splits, and rights secured forever on-chain.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon spam">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="feature-title">Real-Time Collaboration</h3>
              <p className="feature-description">
                Collaborate with artists worldwide in real-time. 
                Split royalties automatically based on contribution.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon decentralized">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="feature-title">AI-Powered Studio Mixing</h3>
              <p className="feature-description">
                Professional 32-channel digital mixing console with AI mastering. 
                Features motorized faders, parametric EQ, compressors, reverb, delay, 
                sidechain compression, and studio-grade VST plugin support.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon integration">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="feature-title">Fungible Token Royalties</h3>
              <p className="feature-description">
                Issue fungible tokens for royalty shares. 
                Fans can invest directly in their favorite artists' success.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon effects">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="feature-title">Studio Effects Rack</h3>
              <p className="feature-description">
                Built-in Neve-inspired compressors, Lexicon-quality reverbs, tape delay emulation, 
                vintage analog warmth, multi-band dynamics, and over 200 premium VST3 plugins included.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon mastering">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="feature-title">AI Mastering Suite</h3>
              <p className="feature-description">
                LUFS-targeted loudness optimization, intelligent spectral balancing, 
                stereo field enhancement, and reference track matching. Export in 24-bit/96kHz or DSD.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-container">
          <h2 className="section-title">Trusted by Artists</h2>
          
          <div className="testimonials-grid">
            <div className="testimonial">
              <div className="testimonial-content">
                "Bitcoin Music has revolutionized how I distribute my music. 
                I finally get paid instantly and fairly for every single stream."
              </div>
              <div className="testimonial-author">
                <div className="author-avatar"></div>
                <div className="author-info">
                  <div className="author-name">DJ Crypto</div>
                  <div className="author-title">Electronic Music Producer</div>
                </div>
              </div>
            </div>
            
            <div className="testimonial">
              <div className="testimonial-content">
                "The NFT ownership model lets my fans truly own a piece of my art. 
                It's created a whole new relationship with my audience."
              </div>
              <div className="testimonial-author">
                <div className="author-avatar"></div>
                <div className="author-info">
                  <div className="author-name">Luna Waves</div>
                  <div className="author-title">Indie Artist</div>
                </div>
              </div>
            </div>
            
            <div className="testimonial">
              <div className="testimonial-content">
                "The 32-channel mixing console is absolutely incredible! Motorized faders, 
                built-in effects, and AI mastering - it's better than my $50K studio setup."
              </div>
              <div className="testimonial-author">
                <div className="author-avatar"></div>
                <div className="author-info">
                  <div className="author-name">Beat Master Mike</div>
                  <div className="author-title">Hip-Hop Producer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">
            Ready to Revolutionize Your Music?
          </h2>
          <p className="cta-subtitle">
            Join the future of decentralized music. Connect your Bitcoin wallet and start earning instant royalties, 
            creating NFT collections, and collaborating with artists worldwide.
          </p>
          
          <div className="cta-buttons">
            <button className="cta-primary large">
              <span>Launch Bitcoin Music</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="cta-features">
            <div className="cta-feature">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Free to start</span>
            </div>
            <div className="cta-feature">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Keep 100% royalties</span>
            </div>
            <div className="cta-feature">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Professional studio tools</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="bitcoin-symbol">♪</span>
              <span className="brand-text">
                <span className="brand-bitcoin">Bitcoin</span>
                <span className="brand-email">Music</span>
              </span>
            </div>
            <p className="footer-tagline">
              Decentralized • Royalty-Free • Unstoppable
            </p>
          </div>
          
          <div className="footer-links">
            <div className="link-group">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#studio">Studio</a>
              <a href="#api">API</a>
            </div>
            
            <div className="link-group">
              <h4>Artists</h4>
              <a href="#upload">Upload Music</a>
              <a href="#royalties">Royalties</a>
              <a href="#nfts">NFT Collections</a>
              <a href="#analytics">Analytics</a>
            </div>
            
            <div className="link-group">
              <h4>Resources</h4>
              <a href="#docs">Documentation</a>
              <a href="#tutorials">Tutorials</a>
              <a href="#community">Community</a>
              <a href="#blog">Blog</a>
            </div>
            
            <div className="link-group">
              <h4>Legal</h4>
              <a href="#privacy">Privacy</a>
              <a href="#terms">Terms</a>
              <a href="#licensing">Licensing</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            © 2025 Bitcoin Music - The Bitcoin Corporation LTD. Built on Bitcoin blockchain technology.
          </div>
          <div className="footer-social">
            <a href="#" className="social-link">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="#" className="social-link">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="#" className="social-link">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarketingPage;