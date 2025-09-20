import { PrivateKey, PublicKey, Transaction, Script } from '@bsv/sdk'
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
    this.address = (this.publicKey as any).toAddress?.().toString() || this.publicKey.toString()

    return {
      mnemonic: '',
      privateKey: this.privateKey.toWif(),
      publicKey: this.publicKey.toString(),
      address: this.address || '',
      balance: 0
    }
  }

  importWallet(privateKeyWIF: string): WalletData {
    try {
      this.privateKey = PrivateKey.fromWif(privateKeyWIF)
      this.publicKey = this.privateKey.toPublicKey()
      this.address = (this.publicKey as any).toAddress?.().toString() || this.publicKey.toString()

      return {
        mnemonic: '',
        privateKey: privateKeyWIF,
        publicKey: this.publicKey.toString(),
        address: this.address || '',
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

    // Add NFT output with script
    const nftOutput: any = {
      script: nftScript,
      satoshis: 0
    }
    tx.addOutput(nftOutput)

    if (recipientAddress) {
      // Add recipient output
      const recipientOutput: any = {
        address: recipientAddress,
        satoshis: 1000
      }
      tx.addOutput(recipientOutput)
    }

    return tx.toString()
  }

  async signTransaction(tx: Transaction): Promise<Transaction> {
    if (!this.privateKey) throw new Error('Wallet not initialized')
    
    // @ts-ignore - sign method exists but types are incorrect
    tx.sign?.(this.privateKey)
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
    // Temporarily disabled due to build issues with node:crypto
    // const HandCashConnect = (await import('@handcash/handcash-connect')).default
    // const appId = process.env.NEXT_PUBLIC_HANDCASH_APP_ID || ''
    // const handcash = new HandCashConnect({ appId })
    
    // const redirectUrl = await handcash.getRedirectionUrl()
    // window.location.href = redirectUrl
    console.log('HandCash integration temporarily disabled')
  } catch (error) {
    console.error('Error connecting to HandCash:', error)
    throw error
  }
}