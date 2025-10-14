// Note: js-1sat-ord has compatibility issues, using direct API calls instead

export interface OrdinalsMusic {
  txid: string
  outpoint: string
  inscription: {
    id: string
    number: number
    contentType: string
    contentLength: number
    contentUrl: string
    timestamp: number
  }
  metadata?: {
    title?: string
    artist?: string
    album?: string
    genre?: string
    duration?: number
    description?: string
  }
  preview?: string
  size: number
}

export interface OrdinalsSearchParams {
  contentType?: string
  limit?: number
  offset?: number
  sort?: 'newest' | 'oldest' | 'largest' | 'smallest'
  search?: string
}

export class OrdinalsIndexer {
  private apiUrl = 'https://ordinals.gorillapool.io/api'

  constructor() {
    // Direct API implementation without js-1sat-ord dependency
  }

  async searchMusicOrdinals(params: OrdinalsSearchParams = {}): Promise<OrdinalsMusic[]> {
    const {
      contentType = 'audio/mpeg',
      limit = 50,
      offset = 0,
      sort = 'newest',
      search = ''
    } = params

    try {
      // Search for music content types
      const musicTypes = [
        'audio/mpeg',
        'audio/mp3', 
        'audio/wav',
        'audio/ogg',
        'audio/m4a',
        'video/mp4' // MP4 can contain audio
      ]

      const results: OrdinalsMusic[] = []

      for (const type of musicTypes) {
        if (contentType && contentType !== type && contentType !== 'audio/*') continue

        const response = await fetch(`${this.apiUrl}/inscriptions?content_type=${encodeURIComponent(type)}&limit=${limit}&offset=${offset}`)
        
        if (!response.ok) continue

        const data = await response.json()
        
        for (const inscription of data.inscriptions || []) {
          const musicItem: OrdinalsMusic = {
            txid: inscription.txid,
            outpoint: `${inscription.txid}_${inscription.vout}`,
            inscription: {
              id: inscription.inscription_id || inscription.id,
              number: inscription.inscription_number || inscription.num,
              contentType: inscription.content_type,
              contentLength: inscription.content_length || 0,
              contentUrl: `${this.apiUrl}/content/${inscription.inscription_id || inscription.id}`,
              timestamp: inscription.timestamp || Date.now()
            },
            size: inscription.content_length || 0
          }

          // Try to extract metadata from inscription data
          if (inscription.data || inscription.content) {
            try {
              const content = inscription.data || inscription.content
              if (typeof content === 'string') {
                const metadata = this.extractMetadata(content)
                if (metadata) musicItem.metadata = metadata
              }
            } catch (e) {
              // Ignore metadata extraction errors
            }
          }

          // Add search filtering
          if (search) {
            const searchLower = search.toLowerCase()
            const matchesTitle = musicItem.metadata?.title?.toLowerCase().includes(searchLower)
            const matchesArtist = musicItem.metadata?.artist?.toLowerCase().includes(searchLower)
            const matchesAlbum = musicItem.metadata?.album?.toLowerCase().includes(searchLower)
            
            if (!matchesTitle && !matchesArtist && !matchesAlbum) continue
          }

          results.push(musicItem)
        }
      }

      // Sort results
      return this.sortResults(results, sort)

    } catch (error) {
      console.error('Error searching ordinals:', error)
      return []
    }
  }

  async getOrdinalsStats(): Promise<{
    totalMusic: number
    totalSize: number
    contentTypes: Record<string, number>
  }> {
    try {
      const response = await fetch(`${this.apiUrl}/stats`)
      if (!response.ok) throw new Error('Failed to fetch stats')

      const data = await response.json()
      
      // Filter for music-related content types
      const musicContentTypes = Object.entries(data.content_types || {})
        .filter(([type]) => 
          type.startsWith('audio/') || 
          (type === 'video/mp4' && data.content_types[type] > 0)
        )
        .reduce((acc, [type, count]) => {
          acc[type] = count as number
          return acc
        }, {} as Record<string, number>)

      const totalMusic = Object.values(musicContentTypes).reduce((sum, count) => sum + count, 0)
      const totalSize = data.total_size || 0

      return {
        totalMusic,
        totalSize,
        contentTypes: musicContentTypes
      }
    } catch (error) {
      console.error('Error fetching ordinals stats:', error)
      return {
        totalMusic: 0,
        totalSize: 0,
        contentTypes: {}
      }
    }
  }

  async getOrdinalsById(inscriptionId: string): Promise<OrdinalsMusic | null> {
    try {
      const response = await fetch(`${this.apiUrl}/inscriptions/${inscriptionId}`)
      if (!response.ok) return null

      const inscription = await response.json()

      const musicItem: OrdinalsMusic = {
        txid: inscription.txid,
        outpoint: `${inscription.txid}_${inscription.vout}`,
        inscription: {
          id: inscription.inscription_id || inscription.id,
          number: inscription.inscription_number || inscription.num,
          contentType: inscription.content_type,
          contentLength: inscription.content_length || 0,
          contentUrl: `${this.apiUrl}/content/${inscription.inscription_id || inscription.id}`,
          timestamp: inscription.timestamp || Date.now()
        },
        size: inscription.content_length || 0
      }

      // Extract metadata
      if (inscription.data || inscription.content) {
        try {
          const content = inscription.data || inscription.content
          if (typeof content === 'string') {
            const metadata = this.extractMetadata(content)
            if (metadata) musicItem.metadata = metadata
          }
        } catch (e) {
          // Ignore metadata extraction errors
        }
      }

      return musicItem
    } catch (error) {
      console.error('Error fetching ordinals by ID:', error)
      return null
    }
  }

  private extractMetadata(content: string): any {
    // Try to extract metadata from various formats
    try {
      // JSON metadata
      if (content.includes('{') && content.includes('}')) {
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0])
        }
      }

      // Simple key-value pairs
      const metadata: any = {}
      const lines = content.split('\n')
      
      for (const line of lines) {
        if (line.includes(':')) {
          const [key, ...valueParts] = line.split(':')
          const value = valueParts.join(':').trim()
          const keyLower = key.trim().toLowerCase()
          
          if (['title', 'artist', 'album', 'genre', 'description'].includes(keyLower)) {
            metadata[keyLower] = value
          }
          
          if (keyLower === 'duration' && !isNaN(Number(value))) {
            metadata.duration = Number(value)
          }
        }
      }

      return Object.keys(metadata).length > 0 ? metadata : null
    } catch (e) {
      return null
    }
  }

  private sortResults(results: OrdinalsMusic[], sort: string): OrdinalsMusic[] {
    switch (sort) {
      case 'newest':
        return results.sort((a, b) => b.inscription.timestamp - a.inscription.timestamp)
      case 'oldest':
        return results.sort((a, b) => a.inscription.timestamp - b.inscription.timestamp)
      case 'largest':
        return results.sort((a, b) => b.size - a.size)
      case 'smallest':
        return results.sort((a, b) => a.size - b.size)
      default:
        return results
    }
  }

  // Alternative API endpoints for broader coverage
  async searchAlternativeAPI(params: OrdinalsSearchParams = {}): Promise<OrdinalsMusic[]> {
    const alternativeApis = [
      'https://1sat.market/api/inscriptions',
      'https://ordinals.bsv.direct/api/inscriptions'
    ]

    for (const apiUrl of alternativeApis) {
      try {
        const response = await fetch(`${apiUrl}?content_type=audio&limit=${params.limit || 50}`)
        if (response.ok) {
          const data = await response.json()
          // Process alternative API response format
          return this.processAlternativeResponse(data)
        }
      } catch (e) {
        continue
      }
    }

    return []
  }

  private processAlternativeResponse(data: any): OrdinalsMusic[] {
    // Process different API response formats
    const results: OrdinalsMusic[] = []
    
    if (Array.isArray(data)) {
      for (const item of data) {
        if (item.content_type?.startsWith('audio/') || item.content_type === 'video/mp4') {
          results.push(this.normalizeOrdinalsResponse(item))
        }
      }
    } else if (data.data && Array.isArray(data.data)) {
      for (const item of data.data) {
        if (item.content_type?.startsWith('audio/') || item.content_type === 'video/mp4') {
          results.push(this.normalizeOrdinalsResponse(item))
        }
      }
    }

    return results
  }

  private normalizeOrdinalsResponse(item: any): OrdinalsMusic {
    return {
      txid: item.txid || item.tx_id,
      outpoint: `${item.txid || item.tx_id}_${item.vout || 0}`,
      inscription: {
        id: item.inscription_id || item.id,
        number: item.inscription_number || item.num || 0,
        contentType: item.content_type,
        contentLength: item.content_length || item.size || 0,
        contentUrl: item.content_url || `https://ordinals.gorillapool.io/api/content/${item.inscription_id || item.id}`,
        timestamp: item.timestamp || item.created_at || Date.now()
      },
      metadata: item.metadata || this.extractMetadata(item.data || ''),
      size: item.content_length || item.size || 0
    }
  }
}

export const ordinalsIndexer = new OrdinalsIndexer()