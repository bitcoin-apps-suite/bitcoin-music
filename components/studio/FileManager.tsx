'use client'

import { useState, useRef } from 'react'
import { Upload, Download, Save, FolderOpen, Music, FileAudio } from 'lucide-react'
import { AudioFileHandler } from '@/lib/audio/AudioFileHandler'
import { useAudioEngine } from '@/hooks/useAudioEngine'

export function FileManager() {
  const [importing, setImporting] = useState(false)
  const [exporting, setExporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const projectInputRef = useRef<HTMLInputElement>(null)
  const { tracks, audioEngine, createTrack, deleteTrack, loadAudioToTrack } = useAudioEngine()

  const handleImportAudio = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setImporting(true)
    try {
      const imports = await AudioFileHandler.importMultipleAudioFiles(files)
      
      // Create a new track for each imported file
      for (const { url, info } of imports) {
        const trackName = info.name.replace(/\.[^/.]+$/, '') // Remove extension
        const trackId = await createTrack(trackName, 'audio')
        await loadAudioToTrack(trackId, url)
        
        console.log(`Imported ${info.name} to track ${trackId}`)
      }
    } catch (error) {
      console.error('Failed to import audio:', error)
      alert('Failed to import audio file(s)')
    } finally {
      setImporting(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleExportProject = async (format: 'wav' | 'mp3' = 'wav') => {
    setExporting(true)
    try {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
      const filename = `bitcoin-music-${timestamp}.${format}`
      await AudioFileHandler.exportAndDownload(filename)
    } catch (error) {
      console.error('Failed to export project:', error)
      alert('Failed to export project')
    } finally {
      setExporting(false)
    }
  }

  const handleSaveProject = async () => {
    try {
      const projectData = {
        tracks: tracks.map(track => ({
          id: track.id,
          name: track.name,
          volume: track.volume,
          muted: track.muted,
          solo: track.solo
        })),
        settings: {
          bpm: await audioEngine.getBPM(),
          position: await audioEngine.getPosition()
        }
      }
      
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
      AudioFileHandler.saveProject(projectData, `bitcoin-music-project-${timestamp}.json`)
    } catch (error) {
      console.error('Failed to save project:', error)
      alert('Failed to save project')
    }
  }

  const handleLoadProject = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const project = await AudioFileHandler.loadProject(file)
      
      // Clear existing tracks
      for (const track of tracks) {
        await deleteTrack(track.id)
      }
      
      // Load project tracks
      for (const trackData of project.tracks) {
        const trackId = await createTrack(trackData.name, 'audio')
        audioEngine.setTrackVolume(trackId, trackData.volume)
        audioEngine.setTrackMute(trackId, trackData.muted)
        audioEngine.setTrackSolo(trackId, trackData.solo)
      }
      
      // Apply project settings
      if (project.settings) {
        await audioEngine.setBPM(project.settings.bpm)
        await audioEngine.setPosition(project.settings.position || '0:0:0')
      }
      
      console.log('Project loaded successfully')
    } catch (error) {
      console.error('Failed to load project:', error)
      alert('Failed to load project file')
    } finally {
      if (projectInputRef.current) {
        projectInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="bg-card rounded-lg p-4 space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground mb-3">File Manager</h3>
      
      {/* Import Audio */}
      <div className="space-y-2">
        <label className="block text-xs text-muted-foreground">Import Audio</label>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={importing}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-md text-sm transition-colors disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          {importing ? 'Importing...' : 'Import Audio Files'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={AudioFileHandler.SUPPORTED_IMPORT_FORMATS.join(',')}
          onChange={handleImportAudio}
          className="hidden"
        />
        <p className="text-xs text-muted-foreground">
          Supports: WAV, MP3, OGG, M4A, FLAC, AAC
        </p>
      </div>

      {/* Export Project */}
      <div className="space-y-2">
        <label className="block text-xs text-muted-foreground">Export Project</label>
        <div className="flex gap-2">
          <button
            onClick={() => handleExportProject('wav')}
            disabled={exporting}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-md text-sm transition-colors disabled:opacity-50"
          >
            <FileAudio className="w-4 h-4" />
            {exporting ? 'Exporting...' : 'Export WAV'}
          </button>
          <button
            onClick={() => handleExportProject('mp3')}
            disabled={exporting || true} // MP3 export needs additional encoding
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-md text-sm transition-colors disabled:opacity-50"
            title="MP3 export coming soon"
          >
            <Music className="w-4 h-4" />
            Export MP3
          </button>
        </div>
      </div>

      {/* Project Management */}
      <div className="border-t pt-4 space-y-2">
        <label className="block text-xs text-muted-foreground">Project</label>
        <div className="flex gap-2">
          <button
            onClick={handleSaveProject}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Project
          </button>
          <button
            onClick={() => projectInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-md text-sm transition-colors"
          >
            <FolderOpen className="w-4 h-4" />
            Load Project
          </button>
        </div>
        <input
          ref={projectInputRef}
          type="file"
          accept=".json"
          onChange={handleLoadProject}
          className="hidden"
        />
      </div>

      {/* Track Count */}
      {tracks.length > 0 && (
        <div className="text-xs text-muted-foreground text-center">
          {tracks.length} track{tracks.length !== 1 ? 's' : ''} in project
        </div>
      )}
    </div>
  )
}