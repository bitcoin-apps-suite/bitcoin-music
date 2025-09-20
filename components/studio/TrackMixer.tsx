'use client'

import { Sliders, Volume2 } from 'lucide-react'

interface Track {
  id: string
  name: string
  volume: number
  pan: number
  muted: boolean
  solo: boolean
}

interface TrackMixerProps {
  tracks: Track[]
  onUpdateTrack: (id: string, updates: Partial<Track>) => void
}

export default function TrackMixer({ tracks, onUpdateTrack }: TrackMixerProps) {
  return (
    <div className="glass-morphism rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white flex items-center space-x-2 mb-4">
        <Sliders className="w-5 h-5" />
        <span>Mixer</span>
      </h2>
      
      {tracks.length === 0 ? (
        <div className="text-center py-4 text-gray-400">
          No tracks to mix
        </div>
      ) : (
        <div className="space-y-4">
          {tracks.map((track) => (
            <div key={track.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{track.name}</span>
                <Volume2 className="w-4 h-4 text-gray-400" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400 w-8">Vol</span>
                  <input
                    type="range"
                    min="-60"
                    max="6"
                    value={track.volume}
                    onChange={(e) => onUpdateTrack(track.id, { volume: Number(e.target.value) })}
                    className="flex-1 accent-bitcoin-orange"
                  />
                  <span className="text-xs text-gray-300 w-10">{track.volume}dB</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400 w-8">Pan</span>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={track.pan}
                    onChange={(e) => onUpdateTrack(track.id, { pan: Number(e.target.value) })}
                    className="flex-1 accent-bitcoin-orange"
                  />
                  <span className="text-xs text-gray-300 w-10">
                    {track.pan === 0 ? 'C' : track.pan < 0 ? `${Math.abs(track.pan)}L` : `${track.pan}R`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}