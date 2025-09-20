'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Activity,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  RefreshCw
} from 'lucide-react'

interface Order {
  id: string
  type: 'buy' | 'sell'
  price: number
  amount: number
  total: number
}

interface Trade {
  id: string
  time: Date
  price: number
  amount: number
  type: 'buy' | 'sell'
}

interface MusicToken {
  id: string
  symbol: string
  name: string
  artist: string
  price: number
  change24h: number
  volume24h: number
  marketCap: number
  totalShares: number
  dividendYield: number
}

export default function ExchangePage() {
  const { data: session } = useSession()
  const [selectedToken, setSelectedToken] = useState<MusicToken | null>(null)
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy')
  const [orderAmount, setOrderAmount] = useState('')
  const [orderPrice, setOrderPrice] = useState('')
  const [activeTab, setActiveTab] = useState<'spot' | 'portfolio' | 'history'>('spot')

  const [tokens] = useState<MusicToken[]>([
    {
      id: '1',
      symbol: 'BTCB',
      name: 'Bitcoin Blues Token',
      artist: 'Satoshi Sounds',
      price: 0.00012,
      change24h: 12.5,
      volume24h: 45230,
      marketCap: 120000,
      totalShares: 10000000,
      dividendYield: 8.5
    },
    {
      id: '2',
      symbol: 'SYMP',
      name: 'Symphony Token',
      artist: 'Digital Orchestra',
      price: 0.00089,
      change24h: -3.2,
      volume24h: 23400,
      marketCap: 445000,
      totalShares: 5000000,
      dividendYield: 6.3
    },
    {
      id: '3',
      symbol: 'BEAT',
      name: 'Mining Beats Token',
      artist: 'Hash Rate',
      price: 0.00034,
      change24h: 5.8,
      volume24h: 78900,
      marketCap: 680000,
      totalShares: 20000000,
      dividendYield: 12.1
    }
  ])

  const [orderBook] = useState<{ bids: Order[], asks: Order[] }>({
    bids: [
      { id: '1', type: 'buy', price: 0.00011, amount: 5000, total: 0.55 },
      { id: '2', type: 'buy', price: 0.00010, amount: 10000, total: 1.0 },
      { id: '3', type: 'buy', price: 0.00009, amount: 15000, total: 1.35 },
    ],
    asks: [
      { id: '4', type: 'sell', price: 0.00013, amount: 3000, total: 0.39 },
      { id: '5', type: 'sell', price: 0.00014, amount: 7000, total: 0.98 },
      { id: '6', type: 'sell', price: 0.00015, amount: 12000, total: 1.8 },
    ]
  })

  const [recentTrades] = useState<Trade[]>([
    { id: '1', time: new Date(), price: 0.00012, amount: 2500, type: 'buy' },
    { id: '2', time: new Date(Date.now() - 60000), price: 0.00011, amount: 1800, type: 'sell' },
    { id: '3', time: new Date(Date.now() - 120000), price: 0.00012, amount: 3200, type: 'buy' },
  ])

  useEffect(() => {
    if (tokens.length > 0 && !selectedToken) {
      setSelectedToken(tokens[0])
    }
  }, [tokens, selectedToken])

  const handlePlaceOrder = () => {
    console.log('Placing order:', { type: orderType, amount: orderAmount, price: orderPrice })
  }

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Music Token Exchange</h1>
            <p className="text-gray-400 mt-1">Trade music tokens and NFT shares</p>
          </div>
          <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
            <RefreshCw className="w-5 h-5 text-gray-300" />
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-morphism rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {selectedToken && (
                    <>
                      <h2 className="text-2xl font-bold text-white">
                        {selectedToken.symbol}/BSV
                      </h2>
                      <span className={`flex items-center text-lg font-semibold ${
                        selectedToken.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {selectedToken.change24h >= 0 ? (
                          <TrendingUp className="w-5 h-5 mr-1" />
                        ) : (
                          <TrendingDown className="w-5 h-5 mr-1" />
                        )}
                        {Math.abs(selectedToken.change24h)}%
                      </span>
                    </>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('spot')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'spot' 
                        ? 'bg-bitcoin-orange text-white' 
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    Spot
                  </button>
                  <button
                    onClick={() => setActiveTab('portfolio')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'portfolio' 
                        ? 'bg-bitcoin-orange text-white' 
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    Portfolio
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      activeTab === 'history' 
                        ? 'bg-bitcoin-orange text-white' 
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    History
                  </button>
                </div>
              </div>

              <div className="h-64 bg-black/30 rounded-lg mb-6 flex items-center justify-center">
                <span className="text-gray-400">Price Chart</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Order Book - Bids</h3>
                  <div className="space-y-1">
                    {orderBook.bids.map((bid) => (
                      <div key={bid.id} className="flex justify-between text-sm">
                        <span className="text-green-400">{bid.price.toFixed(5)}</span>
                        <span className="text-gray-300">{bid.amount.toLocaleString()}</span>
                        <span className="text-gray-500">{bid.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Order Book - Asks</h3>
                  <div className="space-y-1">
                    {orderBook.asks.map((ask) => (
                      <div key={ask.id} className="flex justify-between text-sm">
                        <span className="text-red-400">{ask.price.toFixed(5)}</span>
                        <span className="text-gray-300">{ask.amount.toLocaleString()}</span>
                        <span className="text-gray-500">{ask.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-morphism rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Place Order</h3>
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setOrderType('buy')}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                    orderType === 'buy'
                      ? 'bg-green-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setOrderType('sell')}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                    orderType === 'sell'
                      ? 'bg-red-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  Sell
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Price (BSV)</label>
                  <input
                    type="number"
                    value={orderPrice}
                    onChange={(e) => setOrderPrice(e.target.value)}
                    placeholder="0.00000"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-bitcoin-orange"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Amount</label>
                  <input
                    type="number"
                    value={orderAmount}
                    onChange={(e) => setOrderAmount(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-bitcoin-orange"
                  />
                </div>
                
                <button
                  onClick={handlePlaceOrder}
                  className={`w-full py-3 font-semibold rounded-lg transition-colors ${
                    orderType === 'buy'
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  {orderType === 'buy' ? 'Buy' : 'Sell'} {selectedToken?.symbol}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-morphism rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Market Stats</h3>
              {selectedToken && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price</span>
                    <span className="text-white font-semibold">{selectedToken.price} BSV</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h Volume</span>
                    <span className="text-white">{selectedToken.volume24h.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Market Cap</span>
                    <span className="text-white">${selectedToken.marketCap.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Shares</span>
                    <span className="text-white">{selectedToken.totalShares.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Dividend Yield</span>
                    <span className="text-green-400">{selectedToken.dividendYield}% APY</span>
                  </div>
                </div>
              )}
            </div>

            <div className="glass-morphism rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Token List</h3>
              <div className="space-y-2">
                {tokens.map((token) => (
                  <button
                    key={token.id}
                    onClick={() => setSelectedToken(token)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      selectedToken?.id === token.id
                        ? 'bg-bitcoin-orange/20 border border-bitcoin-orange'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white">{token.symbol}</div>
                        <div className="text-xs text-gray-400">{token.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white">{token.price} BSV</div>
                        <div className={`text-xs ${
                          token.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {token.change24h >= 0 ? '+' : ''}{token.change24h}%
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-morphism rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Trades</h3>
              <div className="space-y-2">
                {recentTrades.map((trade) => (
                  <div key={trade.id} className="flex justify-between text-sm">
                    <span className={trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}>
                      {trade.price.toFixed(5)}
                    </span>
                    <span className="text-gray-300">{trade.amount.toLocaleString()}</span>
                    <span className="text-gray-500">
                      {new Date(trade.time).toLocaleTimeString()}
                    </span>
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