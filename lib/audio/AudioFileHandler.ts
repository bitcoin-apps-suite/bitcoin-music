'use client'

import { getTone } from './ToneWrapper'

export interface AudioFileInfo {
  name: string
  size: number
  duration?: number
  sampleRate?: number
  channels?: number
}

export class AudioFileHandler {
  // Supported audio formats for import
  static readonly SUPPORTED_IMPORT_FORMATS = [
    '.wav', '.mp3', '.ogg', '.m4a', '.flac', '.aac'
  ]
  
  // Export formats
  static readonly EXPORT_FORMATS = {
    WAV: 'audio/wav',
    MP3: 'audio/mpeg',
    OGG: 'audio/ogg'
  }

  /**
   * Import an audio file and return its buffer and metadata
   */
  static async importAudioFile(file: File): Promise<{
    url: string
    info: AudioFileInfo
    buffer?: AudioBuffer
  }> {
    // Validate file format
    const extension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!this.SUPPORTED_IMPORT_FORMATS.includes(extension)) {
      throw new Error(`Unsupported file format: ${extension}`)
    }

    // Create object URL for the file
    const url = URL.createObjectURL(file)
    
    const info: AudioFileInfo = {
      name: file.name,
      size: file.size
    }

    try {
      // Try to decode audio to get metadata
      const audioContext = new AudioContext()
      const arrayBuffer = await file.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      
      info.duration = audioBuffer.duration
      info.sampleRate = audioBuffer.sampleRate
      info.channels = audioBuffer.numberOfChannels
      
      audioContext.close()
      
      return { url, info, buffer: audioBuffer }
    } catch (error) {
      console.warn('Could not decode audio for metadata:', error)
      // Return without metadata if decoding fails
      return { url, info }
    }
  }

  /**
   * Import multiple audio files
   */
  static async importMultipleAudioFiles(files: FileList | File[]): Promise<Array<{
    url: string
    info: AudioFileInfo
    buffer?: AudioBuffer
  }>> {
    const imports = Array.from(files).map(file => this.importAudioFile(file))
    return Promise.all(imports)
  }

  /**
   * Export audio from Tone.js to a WAV file
   */
  static async exportToWAV(duration: number = 10): Promise<Blob> {
    const Tone = await getTone()
    if (!Tone) throw new Error('Tone.js not available')

    // Create offline context for rendering
    const sampleRate = 44100
    const offlineContext = new Tone.OfflineContext(2, duration, sampleRate)
    
    // Record the output
    const recorder = new Tone.Recorder()
    recorder.connect(offlineContext.destination)
    
    // Start recording and rendering
    await recorder.start()
    await offlineContext.render()
    const recording = await recorder.stop()
    
    // Return the WAV blob
    return recording as Blob
  }

  /**
   * Export current project audio to file
   */
  static async exportProject(format: 'wav' | 'mp3' | 'ogg' = 'wav'): Promise<Blob> {
    const Tone = await getTone()
    if (!Tone) throw new Error('Tone.js not available')

    // For now, we'll use the Tone.js Recorder
    // In a real implementation, you'd render the entire project offline
    const recorder = new Tone.Recorder()
    
    // Connect recorder to main output
    recorder.connect(Tone.Destination)
    
    // Start recording
    await recorder.start()
    
    // Play the transport for the project duration
    Tone.Transport.start()
    
    // Wait for the project duration (this should be calculated from actual project length)
    await new Promise(resolve => setTimeout(resolve, 5000)) // 5 seconds for demo
    
    // Stop transport and recording
    Tone.Transport.stop()
    const recording = await recorder.stop()
    
    return recording as Blob
  }

  /**
   * Convert audio buffer to WAV format
   */
  static audioBufferToWAV(buffer: AudioBuffer): Blob {
    const length = buffer.length * buffer.numberOfChannels * 2
    const arrayBuffer = new ArrayBuffer(44 + length)
    const view = new DataView(arrayBuffer)
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
      }
    }
    
    writeString(0, 'RIFF')
    view.setUint32(4, 36 + length, true)
    writeString(8, 'WAVE')
    writeString(12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, buffer.numberOfChannels, true)
    view.setUint32(24, buffer.sampleRate, true)
    view.setUint32(28, buffer.sampleRate * buffer.numberOfChannels * 2, true)
    view.setUint16(32, buffer.numberOfChannels * 2, true)
    view.setUint16(34, 16, true)
    writeString(36, 'data')
    view.setUint32(40, length, true)
    
    // Interleave audio data
    const channels = []
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i))
    }
    
    let offset = 44
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, channels[channel][i]))
        view.setInt16(offset, sample * 0x7FFF, true)
        offset += 2
      }
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' })
  }

  /**
   * Download a blob as a file
   */
  static downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  /**
   * Export and download project
   */
  static async exportAndDownload(filename: string = 'bitcoin-music-project.wav') {
    try {
      const blob = await this.exportProject('wav')
      this.downloadBlob(blob, filename)
      console.log(`Exported project as ${filename}`)
      return true
    } catch (error) {
      console.error('Failed to export project:', error)
      return false
    }
  }

  /**
   * Load project from JSON file
   */
  static async loadProject(file: File): Promise<any> {
    if (!file.name.endsWith('.json')) {
      throw new Error('Project files must be in JSON format')
    }
    
    const text = await file.text()
    const project = JSON.parse(text)
    
    // Validate project structure
    if (!project.version || !project.tracks || !project.settings) {
      throw new Error('Invalid project file structure')
    }
    
    return project
  }

  /**
   * Save project to JSON file
   */
  static saveProject(projectData: any, filename: string = 'bitcoin-music-project.json') {
    const project = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      ...projectData
    }
    
    const json = JSON.stringify(project, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    this.downloadBlob(blob, filename)
    
    console.log(`Saved project as ${filename}`)
    return true
  }
}