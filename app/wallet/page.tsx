'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import QRCode from 'qrcode'
import { 
  Wallet,
  Send,
  Download,
  RefreshCw,
  Copy,
  Eye,
  EyeOff,
  TrendingUp,
  Music,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Key
} from 'lucide-react'
import { BSVWallet, connectToYoursWallet } from '@/lib/bsv/wallet'

interface Asset {
  id: string
  type: 'bsv' | 'nft' | 'token'
  name: string
  symbol: string
  balance: number
  value: number
  change24h: number
}

interface Transaction {
  id: string
  type: 'send' | 'receive'
  asset: string
  amount: number
  address: string
  time: Date
  status: 'pending' | 'confirmed'
}

export default function WalletPage() {
  const { data: session } = useSession()
  const [wallet, setWallet] = useState<BSVWallet | null>(null)
  const [address, setAddress] = useState('')
  const [balance, setBalance] = useState(0)
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [privateKey, setPrivateKey] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [activeTab, setActiveTab] = useState<'assets' | 'nfts' | 'activity'>('assets')
  
  const [assets] = useState<Asset[]>([
    {
      id: '1',
      type: 'bsv',
      name: 'Bitcoin SV',
      symbol: 'BSV',
      balance: 0.5432,
      value: 32.45,
      change24h: 2.3
    },
    {
      id: '2',
      type: 'token',
      name: 'Bitcoin Blues Token',
      symbol: 'BTCB',
      balance: 5000,
      value: 0.6,
      change24h: 12.5
    },
    {
      id: '3',
      type: 'token',
      name: 'Symphony Token',
      symbol: 'SYMP',
      balance: 1200,
      value: 1.07,
      change24h: -3.2
    }
  ])

  const [musicNFTs] = useState([
    {
      id: '1',
      title: 'Bitcoin Blues',
      artist: 'Satoshi Sounds',
      shares: 350,
      totalShares: 10000,
      value: 0.035,
      dividendEarned: 0.0012
    },
    {
      id: '2',
      title: 'Blockchain Symphony',
      artist: 'Digital Orchestra',
      shares: 100,
      totalShares: 5000,
      value: 0.025,
      dividendEarned: 0.0008
    }
  ])

  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'receive',
      asset: 'BSV',
      amount: 0.1,
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      time: new Date(),
      status: 'confirmed'
    },
    {
      id: '2',
      type: 'send',
      asset: 'BTCB',
      amount: 500,
      address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
      time: new Date(Date.now() - 3600000),
      status: 'confirmed'
    }
  ])

  useEffect(() => {
    initializeWallet()
  }, [])

  const initializeWallet = async () => {
    const bsvWallet = new BSVWallet()
    const walletData = bsvWallet.generateWallet()
    setWallet(bsvWallet)
    setAddress(walletData.address)
    setPrivateKey(walletData.privateKey)
    
    const qr = await QRCode.toDataURL(walletData.address)
    setQrCodeUrl(qr)
    
    const balance = await bsvWallet.getBalance()
    setBalance(balance)
  }

  const connectWallet = async () => {
    try {
      const result = await connectToYoursWallet()
      setAddress(result.address)
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleSend = () => {
    console.log('Opening send modal')
  }

  const handleReceive = () => {
    console.log('Opening receive modal')
  }

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center space-x-2">
              <Wallet className="w-8 h-8 text-bitcoin-orange" />
              <span>Music Wallet</span>
            </h1>
            <p className="text-gray-400 mt-1">Manage your BSV, music NFTs, and tokens</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={connectWallet}
              className="px-4 py-2 bg-white/10 rounded-lg text-gray-300 hover:bg-white/20 transition-colors"
            >
              Connect External
            </button>
            <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              <RefreshCw className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-morphism rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Wallet Overview</h2>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-green-400">Secured</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-400 mb-2">Total Balance</div>
                  <div className="text-3xl font-bold text-white mb-1">
                    ${(balance * 60).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">{balance} BSV</div>
                  
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={handleSend}
                      className="flex-1 flex items-center justify-center space-x-2 py-2 bg-bitcoin-orange rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      <Send className="w-4 h-4 text-white" />
                      <span className="text-white font-semibold">Send</span>
                    </button>
                    <button
                      onClick={handleReceive}
                      className="flex-1 flex items-center justify-center space-x-2 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <Download className="w-4 h-4 text-gray-300" />
                      <span className="text-gray-300 font-semibold">Receive</span>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  {qrCodeUrl && (
                    <img src={qrCodeUrl} alt="Wallet QR Code" className="w-32 h-32 rounded-lg" />
                  )}
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-sm text-gray-400">Address</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-white font-mono">
                      {address.slice(0, 6)}...{address.slice(-4)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(address)}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-sm text-gray-400">Private Key</span>
                  <div className="flex items-center space-x-2">
                    {showPrivateKey ? (
                      <>
                        <span className="text-sm text-white font-mono">
                          {privateKey.slice(0, 6)}...{privateKey.slice(-4)}
                        </span>
                        <button
                          onClick={() => setShowPrivateKey(false)}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                        >
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="text-sm text-gray-500">••••••••</span>
                        <button
                          onClick={() => setShowPrivateKey(true)}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-morphism rounded-xl p-6">
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setActiveTab('assets')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'assets'
                      ? 'bg-bitcoin-orange text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  Assets
                </button>
                <button
                  onClick={() => setActiveTab('nfts')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'nfts'
                      ? 'bg-bitcoin-orange text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  Music NFTs
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'activity'
                      ? 'bg-bitcoin-orange text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  Activity
                </button>
              </div>
              
              {activeTab === 'assets' && (
                <div className="space-y-3">
                  {assets.map((asset) => (
                    <div key={asset.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-bitcoin-orange/20 flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-bitcoin-orange" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{asset.name}</div>
                          <div className="text-sm text-gray-400">{asset.symbol}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">{asset.balance}</div>
                        <div className={`text-sm ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'nfts' && (
                <div className="space-y-3">
                  {musicNFTs.map((nft) => (
                    <div key={nft.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <Music className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{nft.title}</div>
                          <div className="text-sm text-gray-400">{nft.artist}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">{nft.shares} shares</div>
                        <div className="text-sm text-green-400">+{nft.dividendEarned} BSV earned</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'activity' && (
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'receive' ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}>
                          {tx.type === 'receive' ? (
                            <ArrowDownRight className="w-5 h-5 text-green-400" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            {tx.type === 'receive' ? 'Received' : 'Sent'} {tx.asset}
                          </div>
                          <div className="text-sm text-gray-400">
                            {tx.address.slice(0, 8)}...{tx.address.slice(-6)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${tx.type === 'receive' ? 'text-green-400' : 'text-red-400'}`}>
                          {tx.type === 'receive' ? '+' : '-'}{tx.amount} {tx.asset}
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(tx.time).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-morphism rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Portfolio Distribution</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">BSV</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-white/10 rounded-full">
                      <div className="w-1/2 h-full bg-bitcoin-orange rounded-full" />
                    </div>
                    <span className="text-white text-sm">50%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Tokens</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-white/10 rounded-full">
                      <div className="w-1/3 h-full bg-purple-500 rounded-full" />
                    </div>
                    <span className="text-white text-sm">30%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">NFTs</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-white/10 rounded-full">
                      <div className="w-1/5 h-full bg-pink-500 rounded-full" />
                    </div>
                    <span className="text-white text-sm">20%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-morphism rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Dividend Earnings</h3>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">0.0020 BSV</div>
                  <div className="text-sm text-gray-400 mt-1">Total Earned This Month</div>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Next Payout</span>
                    <span className="text-white">In 5 days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">APY Average</span>
                    <span className="text-green-400">9.8%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-morphism rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full py-2 bg-white/10 rounded-lg text-gray-300 hover:bg-white/20 transition-colors">
                  Import Wallet
                </button>
                <button className="w-full py-2 bg-white/10 rounded-lg text-gray-300 hover:bg-white/20 transition-colors">
                  Export Private Key
                </button>
                <button className="w-full py-2 bg-white/10 rounded-lg text-gray-300 hover:bg-white/20 transition-colors">
                  Backup Wallet
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}