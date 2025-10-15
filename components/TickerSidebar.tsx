import React, { useState, useEffect } from 'react';
import './TickerSidebar.css';

interface MusicTokenPrice {
  symbol: string;
  name: string;
  price: number;
  price_usd: number;
  change24h: number;
  changePercent: number;
  change_24h: number;
  change_percent_24h: number;
  volume_24h: number;
  last_updated: Date;
  source: string;
  contractId?: string;
  liquidity?: number;
  streams?: number;
  category?: string;
  isArtist?: boolean;
  isTrack?: boolean;
}

interface TickerSidebarProps {
  currentArtist?: string;
  currentTrack?: {
    symbol: string;
    name: string;
  };
  onCollapsedChange?: (collapsed: boolean) => void;
}

const TickerSidebar: React.FC<TickerSidebarProps> = ({
  currentArtist,
  currentTrack,
  onCollapsedChange
}) => {
  const [prices, setPrices] = useState<MusicTokenPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Generate trending music tokens
    const generateTrendingMusic = (): MusicTokenPrice[] => {
      const artists = [
        { base: 'BBEAT', name: 'Bitcoin Beats', category: 'Electronic', basePrice: 0.025, volatility: 0.4 },
        { base: 'BRAP', name: 'Bitcoin Rap', category: 'Hip-Hop', basePrice: 0.018, volatility: 0.35 },
        { base: 'BROCK', name: 'Bitcoin Rock', category: 'Rock', basePrice: 0.012, volatility: 0.25 },
        { base: 'BJAZZ', name: 'Bitcoin Jazz', category: 'Jazz', basePrice: 0.008, volatility: 0.2 },
        { base: 'BPOP', name: 'Bitcoin Pop', category: 'Pop', basePrice: 0.032, volatility: 0.45 }
      ];

      const tracks = [
        { base: 'SATOSHI', name: 'Satoshi\'s Symphony', category: 'Classical', basePrice: 0.006, volatility: 0.3 },
        { base: 'MOON', name: 'To The Moon', category: 'Electronic', basePrice: 0.015, volatility: 0.5 },
        { base: 'HODL', name: 'HODL Anthem', category: 'Anthem', basePrice: 0.022, volatility: 0.4 },
        { base: 'HASH', name: 'Hash Power', category: 'Techno', basePrice: 0.009, volatility: 0.35 },
        { base: 'BLOCK', name: 'Blockchain Blues', category: 'Blues', basePrice: 0.007, volatility: 0.25 },
        { base: 'MINE', name: 'Mining Melody', category: 'Ambient', basePrice: 0.011, volatility: 0.3 }
      ];

      // Generate artist tokens
      const artistTokens = artists.map((artist, index) => {
        const contractNum = Math.floor(Math.random() * 9000) + 1000;
        const contractId = `${Math.random().toString(36).substring(2, 5)}_${contractNum}`;
        
        const liquidityMultiplier = Math.random() * 2 + 0.5;
        const basePrice = artist.basePrice * liquidityMultiplier;
        const change = (Math.random() - 0.5) * basePrice * artist.volatility;
        const liquidity = Math.floor(Math.random() * 150000 * liquidityMultiplier) + 10000;
        const streams = Math.floor(liquidity * 50 + Math.random() * 100000);
        
        return {
          symbol: `${artist.base}_${contractId}`,
          name: artist.name,
          category: artist.category,
          contractId: contractId,
          price: basePrice,
          price_usd: basePrice,
          change24h: change,
          changePercent: (change / basePrice) * 100,
          change_24h: change,
          change_percent_24h: (change / basePrice) * 100,
          volume_24h: liquidity,
          liquidity: liquidity,
          streams: streams,
          last_updated: new Date(),
          source: 'Music Streaming',
          isArtist: true,
          isTrack: false
        };
      });

      // Generate track tokens
      const trackTokens = tracks.map((track, index) => {
        const contractNum = Math.floor(Math.random() * 9000) + 1000;
        const contractId = `${Math.random().toString(36).substring(2, 5)}_${contractNum}`;
        
        const liquidityMultiplier = Math.random() * 1.5 + 0.3;
        const basePrice = track.basePrice * liquidityMultiplier;
        const change = (Math.random() - 0.5) * basePrice * track.volatility;
        const liquidity = Math.floor(Math.random() * 75000 * liquidityMultiplier) + 5000;
        const streams = Math.floor(liquidity * 100 + Math.random() * 200000);
        
        return {
          symbol: `${track.base}_${contractId}`,
          name: track.name,
          category: track.category,
          contractId: contractId,
          price: basePrice,
          price_usd: basePrice,
          change24h: change,
          changePercent: (change / basePrice) * 100,
          change_24h: change,
          change_percent_24h: (change / basePrice) * 100,
          volume_24h: liquidity,
          liquidity: liquidity,
          streams: streams,
          last_updated: new Date(),
          source: 'Music Streaming',
          isArtist: false,
          isTrack: true
        };
      });

      // Add core BSV token
      const bsvToken: MusicTokenPrice = {
        symbol: 'BSV',
        name: 'Bitcoin SV',
        price: 45.67,
        price_usd: 45.67,
        change24h: 2.34,
        changePercent: 5.4,
        change_24h: 2.34,
        change_percent_24h: 5.4,
        volume_24h: 25000000,
        liquidity: 25000000,
        streams: 0,
        last_updated: new Date(),
        source: 'Exchange',
        isArtist: true,
        isTrack: false,
        category: 'Core'
      };

      // Add BMUSIC token
      const bmusicToken: MusicTokenPrice = {
        symbol: 'BMUSIC',
        name: 'Bitcoin Music',
        price: 0.00234,
        price_usd: 0.00234,
        change24h: 0.00019,
        changePercent: 8.8,
        change_24h: 0.00019,
        change_percent_24h: 8.8,
        volume_24h: 45000,
        liquidity: 45000,
        streams: 2500000,
        last_updated: new Date(),
        source: 'Music Platform',
        isArtist: true,
        isTrack: false,
        category: 'Platform'
      };

      // Add user's HandCash token
      const userToken: MusicTokenPrice = {
        symbol: 'B0ASE',
        name: '@b0ase',
        price: 0.00156,
        price_usd: 0.00156,
        change24h: 0.00012,
        changePercent: 8.33,
        change_24h: 0.00012,
        change_percent_24h: 8.33,
        volume_24h: 15000,
        liquidity: 15000,
        streams: 125000,
        last_updated: new Date(),
        source: 'HandCash',
        isArtist: true,
        isTrack: false,
        category: 'Creator'
      };

      // Combine tokens in specific order: BSV, BMUSIC, user token, then artist tokens, then tracks
      const coreTokens = [bsvToken, bmusicToken, userToken];
      const sortedArtists = artistTokens.sort((a, b) => (b.liquidity || 0) - (a.liquidity || 0));
      const sortedTracks = trackTokens.sort((a, b) => (b.streams || 0) - (a.streams || 0));
      
      return [...coreTokens, ...sortedArtists, ...sortedTracks];
    };

    const musicTokens = generateTrendingMusic();
    setPrices(musicTokens);
    setLastUpdate(new Date());
    setIsLoading(false);

    // Update prices every 30 seconds
    const interval = setInterval(() => {
      setPrices(prev => prev.map(token => {
        const volatilityFactor = token.isArtist ? 0.02 : 0.03; // Tracks more volatile
        const change = (Math.random() - 0.5) * token.price * volatilityFactor;
        return {
          ...token,
          price: Math.max(0.000001, token.price + change),
          price_usd: Math.max(0.000001, token.price + change),
          change24h: change,
          changePercent: (change / token.price) * 100
        };
      }));
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, [currentArtist, currentTrack]);

  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (price >= 1) {
      return `$${price.toFixed(2)}`;
    } else if (price >= 0.01) {
      return `$${price.toFixed(4)}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const formatVolume = (volume?: number): string => {
    if (!volume) return 'N/A';
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `$${(volume / 1000).toFixed(1)}K`;
    }
    return `$${volume.toFixed(0)}`;
  };

  const formatStreams = (streams?: number): string => {
    if (!streams) return 'N/A';
    if (streams >= 1000000) {
      return `${(streams / 1000000).toFixed(1)}M plays`;
    } else if (streams >= 1000) {
      return `${(streams / 1000).toFixed(1)}K plays`;
    }
    return `${streams} plays`;
  };

  const formatLiquidity = (liquidity?: number): string => {
    if (!liquidity) return 'Low';
    if (liquidity >= 100000) return 'Very High';
    if (liquidity >= 50000) return 'High';
    if (liquidity >= 10000) return 'Medium';
    if (liquidity >= 5000) return 'Fair';
    return 'Low';
  };

  const getLiquidityColor = (liquidity?: number): string => {
    if (!liquidity) return '#666';
    if (liquidity >= 100000) return '#4CAF50';
    if (liquidity >= 50000) return '#8BC34A';
    if (liquidity >= 10000) return '#FFC107';
    if (liquidity >= 5000) return '#FF9800';
    return '#f44336';
  };

  return (
    <div className={`ticker-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="ticker-header">
        <h3>🎵 Music Market</h3>
        <div className="ticker-header-controls">
          <button 
            className="ticker-toggle"
            onClick={() => {
              const newCollapsed = !isCollapsed;
              setIsCollapsed(newCollapsed);
              onCollapsedChange?.(newCollapsed);
            }}
            title={isCollapsed ? 'Expand ticker' : 'Collapse ticker'}
          >
            {isCollapsed ? '←' : '→'}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {isLoading ? (
            <div className="ticker-loading">Loading music tokens...</div>
          ) : (
            <div className="ticker-list">
              {prices.map((token, index) => {
                // Add divider after user token (third core token) before other artists
                const showArtistDivider = token.symbol === 'B0ASE' && 
                  index < prices.length - 1 && 
                  prices[index + 1].category !== 'Core' && 
                  prices[index + 1].category !== 'Platform' && 
                  prices[index + 1].category !== 'Creator';
                
                // Add divider after last artist token before tracks
                const showTrackDivider = token.isArtist && 
                  index < prices.length - 1 && 
                  !prices[index + 1].isArtist;
                
                return (
                  <React.Fragment key={token.symbol}>
                    <div className={`ticker-item ${token.isArtist ? 'artist' : ''} ${token.isTrack ? 'track' : ''}`}>
                      <div className="ticker-symbol-row">
                        <span className="ticker-symbol">${token.symbol}</span>
                        <span className={`ticker-change ${token.change24h >= 0 ? 'positive' : 'negative'}`}>
                          {token.change24h >= 0 ? '↑' : '↓'} {Math.abs(token.changePercent).toFixed(2)}%
                        </span>
                      </div>
                      
                      <div className="ticker-name">
                        {token.name}
                        {token.category && (
                          <span className="ticker-category"> • {token.category}</span>
                        )}
                      </div>
                      
                      <div className="ticker-price-row">
                        <span className="ticker-price">{formatPrice(token.price)}</span>
                        {token.contractId && (
                          <span className="ticker-contract-id">#{token.contractId}</span>
                        )}
                      </div>
                      
                      <div className="ticker-stats">
                        {token.volume_24h && (
                          <span className="ticker-volume">
                            Vol: {formatVolume(token.volume_24h)}
                          </span>
                        )}
                        {token.liquidity !== undefined && (
                          <span 
                            className="ticker-liquidity"
                            style={{ color: getLiquidityColor(token.liquidity) }}
                          >
                            {formatLiquidity(token.liquidity)}
                          </span>
                        )}
                        {token.streams !== undefined && token.streams > 0 && (
                          <span className="ticker-streams">
                            {formatStreams(token.streams)}
                          </span>
                        )}
                      </div>
                    </div>
                    {showArtistDivider && (
                      <div className="ticker-divider">
                        <span>Artist Tokens</span>
                      </div>
                    )}
                    {showTrackDivider && (
                      <div className="ticker-divider">
                        <span>Trending Tracks</span>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          <div className="ticker-footer">
            <div className="ticker-disclaimer">
              Music prices update every 30s
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TickerSidebar;