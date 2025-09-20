'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Activity, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react'

export default function ExchangeView() {
  const [selectedPair, setSelectedPair] = useState('MUSIC/BSV')
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy')

  const tradingPairs = [
    { pair: 'MUSIC/BSV', price: '0.0045', change: '+5.2%', volume: '1.2M', trending: 'up' },
    { pair: 'BEAT/BSV', price: '0.0023', change: '-2.1%', volume: '856K', trending: 'down' },
    { pair: 'VINYL/BSV', price: '0.0089', change: '+12.4%', volume: '2.4M', trending: 'up' },
    { pair: 'TRACK/BSV', price: '0.0034', change: '+1.8%', volume: '567K', trending: 'up' },
  ]

  const orderBook = {
    bids: [
      { price: '0.00448', amount: '1,234', total: '5.53' },
      { price: '0.00447', amount: '2,456', total: '10.98' },
      { price: '0.00446', amount: '3,789', total: '16.90' },
      { price: '0.00445', amount: '1,567', total: '6.97' },
    ],
    asks: [
      { price: '0.00451', amount: '987', total: '4.45' },
      { price: '0.00452', amount: '1,543', total: '6.97' },
      { price: '0.00453', amount: '2,234', total: '10.12' },
      { price: '0.00454', amount: '1,876', total: '8.52' },
    ]
  }

  const recentTrades = [
    { time: '14:23:45', price: '0.00450', amount: '567', type: 'buy' },
    { time: '14:23:38', price: '0.00449', amount: '234', type: 'sell' },
    { time: '14:23:31', price: '0.00450', amount: '1,234', type: 'buy' },
    { time: '14:23:25', price: '0.00448', amount: '789', type: 'sell' },
  ]

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      background: '#0a0a0a'
    }}>
      {/* Left Panel - Trading Pairs */}
      <div style={{
        width: '280px',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>
            Music Token Pairs
          </h2>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {tradingPairs.map((pair) => (
            <div
              key={pair.pair}
              onClick={() => setSelectedPair(pair.pair)}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                cursor: 'pointer',
                background: selectedPair === pair.pair 
                  ? 'rgba(139, 92, 246, 0.1)' 
                  : 'transparent',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => {
                if (selectedPair !== pair.pair) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedPair !== pair.pair) {
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '500' }}>
                  {pair.pair}
                </span>
                <span style={{ 
                  color: pair.trending === 'up' ? '#10b981' : '#ef4444',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}>
                  {pair.trending === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {pair.change}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#ffffff', fontSize: '13px' }}>
                  {pair.price} BSV
                </span>
                <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '11px' }}>
                  Vol: {pair.volume}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center - Chart and Order Book */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Price Header */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h1 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '600' }}>
              {selectedPair}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
              <span style={{ color: '#10b981', fontSize: '24px', fontWeight: '600' }}>
                0.00450
              </span>
              <span style={{ color: '#10b981', fontSize: '14px' }}>
                +5.2%
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              color: '#ffffff',
              fontSize: '12px',
              cursor: 'pointer'
            }}>
              1H
            </button>
            <button style={{
              padding: '8px 16px',
              background: 'rgba(139, 92, 246, 0.2)',
              border: '1px solid rgba(139, 92, 246, 0.5)',
              borderRadius: '4px',
              color: '#8b5cf6',
              fontSize: '12px',
              cursor: 'pointer'
            }}>
              1D
            </button>
            <button style={{
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              color: '#ffffff',
              fontSize: '12px',
              cursor: 'pointer'
            }}>
              1W
            </button>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.3)'
          }}>
            <Activity size={48} style={{ marginBottom: '12px' }} />
            <p>Price chart will be displayed here</p>
          </div>
        </div>

        {/* Order Book and Recent Trades */}
        <div style={{ height: '300px', display: 'flex' }}>
          {/* Order Book */}
          <div style={{ flex: 1, borderRight: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '13px',
              fontWeight: '600',
              color: '#ffffff'
            }}>
              Order Book
            </div>
            <div style={{ display: 'flex', height: 'calc(100% - 45px)' }}>
              {/* Bids */}
              <div style={{ flex: 1 }}>
                <div style={{
                  padding: '8px',
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr'
                }}>
                  <span>Price</span>
                  <span style={{ textAlign: 'center' }}>Amount</span>
                  <span style={{ textAlign: 'right' }}>Total</span>
                </div>
                {orderBook.bids.map((bid, index) => (
                  <div key={index} style={{
                    padding: '6px 8px',
                    fontSize: '12px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    background: `linear-gradient(to left, rgba(16, 185, 129, 0.1) ${(index + 1) * 20}%, transparent 0)`
                  }}>
                    <span style={{ color: '#10b981' }}>{bid.price}</span>
                    <span style={{ color: '#ffffff', textAlign: 'center' }}>{bid.amount}</span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'right' }}>{bid.total}</span>
                  </div>
                ))}
              </div>
              {/* Asks */}
              <div style={{ flex: 1, borderLeft: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{
                  padding: '8px',
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr'
                }}>
                  <span>Price</span>
                  <span style={{ textAlign: 'center' }}>Amount</span>
                  <span style={{ textAlign: 'right' }}>Total</span>
                </div>
                {orderBook.asks.map((ask, index) => (
                  <div key={index} style={{
                    padding: '6px 8px',
                    fontSize: '12px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    background: `linear-gradient(to left, rgba(239, 68, 68, 0.1) ${(index + 1) * 20}%, transparent 0)`
                  }}>
                    <span style={{ color: '#ef4444' }}>{ask.price}</span>
                    <span style={{ color: '#ffffff', textAlign: 'center' }}>{ask.amount}</span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'right' }}>{ask.total}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Trades */}
          <div style={{ width: '250px' }}>
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '13px',
              fontWeight: '600',
              color: '#ffffff'
            }}>
              Recent Trades
            </div>
            <div style={{ padding: '8px' }}>
              {recentTrades.map((trade, index) => (
                <div key={index} style={{
                  padding: '4px 8px',
                  fontSize: '12px',
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr 1fr',
                  alignItems: 'center'
                }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>{trade.time}</span>
                  <span style={{ 
                    color: trade.type === 'buy' ? '#10b981' : '#ef4444',
                    textAlign: 'center'
                  }}>
                    {trade.price}
                  </span>
                  <span style={{ color: '#ffffff', textAlign: 'right' }}>{trade.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Trade Form */}
      <div style={{
        width: '320px',
        borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '16px'
      }}>
        <div style={{ marginBottom: '16px' }}>
          <div style={{
            display: 'flex',
            gap: '4px',
            padding: '4px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '6px'
          }}>
            <button
              onClick={() => setOrderType('buy')}
              style={{
                flex: 1,
                padding: '8px',
                background: orderType === 'buy' 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'transparent',
                border: 'none',
                borderRadius: '4px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: orderType === 'buy' ? '600' : '400',
                cursor: 'pointer'
              }}
            >
              Buy
            </button>
            <button
              onClick={() => setOrderType('sell')}
              style={{
                flex: 1,
                padding: '8px',
                background: orderType === 'sell'
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                  : 'transparent',
                border: 'none',
                borderRadius: '4px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: orderType === 'sell' ? '600' : '400',
                cursor: 'pointer'
              }}
            >
              Sell
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>Price (BSV)</label>
          <input
            type="text"
            placeholder="0.00450"
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '4px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>Amount (MUSIC)</label>
          <input
            type="text"
            placeholder="0.00"
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '4px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>Total (BSV)</label>
          <input
            type="text"
            placeholder="0.00"
            disabled
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '4px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>

        <button style={{
          width: '100%',
          padding: '12px',
          background: orderType === 'buy'
            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          border: 'none',
          borderRadius: '6px',
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {orderType === 'buy' ? 'Buy MUSIC' : 'Sell MUSIC'}
        </button>

        {/* Balance Info */}
        <div style={{
          marginTop: '24px',
          padding: '12px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '6px',
          fontSize: '12px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>BSV Balance:</span>
            <span style={{ color: '#ffffff' }}>12.456 BSV</span>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between'
          }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>MUSIC Balance:</span>
            <span style={{ color: '#ffffff' }}>5,678.90 MUSIC</span>
          </div>
        </div>
      </div>
    </div>
  )
}