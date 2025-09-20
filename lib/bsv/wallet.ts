import { PrivateKey, PublicKey, Address, Transaction, Script } from '@bsv/sdk'
import CryptoJS from 'crypto-js'

export interface WalletData {
  mnemonic: string
  privateKey: string
  publicKey: string
  address: string
  balance: number
}

export class BSVWallet {
  private privateKey: PrivateKey | null = null
  private publicKey: PublicKey | null = null
  private address: string | null = null

  constructor(privateKeyWIF?: string) {
    if (privateKeyWIF) {
      this.importWallet(privateKeyWIF)
    }
  }

  generateWallet(): WalletData {
    this.privateKey = PrivateKey.fromRandom()
    this.publicKey = this.privateKey.toPublicKey()
    this.address = this.publicKey.toAddress().toString()

    return {
      mnemonic: '',
      privateKey: this.privateKey.toWIF(),
      publicKey: this.publicKey.toString(),
      address: this.address,
      balance: 0
    }
  }

  importWallet(privateKeyWIF: string): WalletData {
    try {
      this.privateKey = PrivateKey.fromWIF(privateKeyWIF)
      this.publicKey = this.privateKey.toPublicKey()
      this.address = this.publicKey.toAddress().toString()

      return {
        mnemonic: '',
        privateKey: privateKeyWIF,
        publicKey: this.publicKey.toString(),
        address: this.address,
        balance: 0
      }
    } catch (error) {
      throw new Error('Invalid private key')
    }
  }

  async getBalance(): Promise<number> {
    if (!this.address) throw new Error('Wallet not initialized')
    
    try {
      const response = await fetch(`https://api.whatsonchain.com/v1/bsv/main/address/${this.address}/balance`)
      const data = await response.json()
      return data.confirmed + data.unconfirmed
    } catch (error) {
      console.error('Error fetching balance:', error)
      return 0
    }
  }

  async createMusicNFTTransaction(
    musicData: {
      title: string
      artist: string
      audioHash: string
      metadata: any
    },
    recipientAddress?: string
  ): Promise<string> {
    if (!this.privateKey || !this.publicKey || !this.address) {
      throw new Error('Wallet not initialized')
    }

    const tx = new Transaction()
    
    const nftScript = Script.fromASM([
      'OP_FALSE',
      'OP_RETURN',
      Buffer.from('music.nft').toString('hex'),
      Buffer.from(JSON.stringify(musicData)).toString('hex')
    ].join(' '))

    tx.addOutput({
      script: nftScript,
      satoshis: 0
    })

    if (recipientAddress) {
      tx.addOutput({
        address: recipientAddress,
        satoshis: 1000
      })
    }

    return tx.toString()
  }

  async signTransaction(tx: Transaction): Promise<Transaction> {
    if (!this.privateKey) throw new Error('Wallet not initialized')
    
    tx.sign(this.privateKey)
    return tx
  }

  encryptPrivateKey(privateKey: string, password: string): string {
    return CryptoJS.AES.encrypt(privateKey, password).toString()
  }

  decryptPrivateKey(encryptedKey: string, password: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedKey, password)
    return bytes.toString(CryptoJS.enc.Utf8)
  }
}

export const connectToYoursWallet = async () => {
  if (typeof window !== 'undefined' && (window as any).yours) {
    try {
      const wallet = (window as any).yours
      await wallet.connect()
      
      const address = await wallet.getAddress()
      const publicKey = await wallet.getPublicKey()
      
      return {
        address,
        publicKey,
        isConnected: true
      }
    } catch (error) {
      console.error('Error connecting to Yours Wallet:', error)
      throw error
    }
  } else {
    throw new Error('Yours Wallet not found')
  }
}

export const connectToHandCash = async () => {
  try {
    const HandCashConnect = (await import('@handcash/handcash-connect')).default
    const appId = process.env.NEXT_PUBLIC_HANDCASH_APP_ID || ''
    const handcash = new HandCashConnect({ appId })
    
    const redirectUrl = await handcash.getRedirectionUrl()
    window.location.href = redirectUrl
  } catch (error) {
    console.error('Error connecting to HandCash:', error)
    throw error
  }
}