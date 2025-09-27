'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { 
  TrendingUp, 
  Mouse, 
  Edit, 
  Trash2, 
  Copy, 
  Scissors,
  RotateCcw,
  Play,
  Pause
} from 'lucide-react'
import { useAudioEngine } from '@/hooks/useAudioEngine'

interface AutomationPoint {
  id: string
  time: number // in seconds
  value: number // 0-1 normalized
  curve: 'linear' | 'exponential' | 'bezier'
}

interface AutomationLane {
  id: string
  trackId: string
  parameter: string
  points: AutomationPoint[]
  enabled: boolean
  min: number
  max: number
  unit: string
}

interface AutomationEditorProps {
  trackId: string
  duration: number // track duration in seconds
}

const AUTOMATION_PARAMETERS = [
  { id: 'volume', name: 'Volume', min: -60, max: 0, unit: 'dB' },
  { id: 'pan', name: 'Pan', min: -100, max: 100, unit: '%' },
  { id: 'cutoff', name: 'Filter Cutoff', min: 20, max: 20000, unit: 'Hz' },
  { id: 'resonance', name: 'Filter Resonance', min: 0.1, max: 10, unit: 'Q' },
  { id: 'reverb', name: 'Reverb Send', min: 0, max: 100, unit: '%' },
  { id: 'delay', name: 'Delay Send', min: 0, max: 100, unit: '%' }
]

export default function AutomationEditor({ trackId, duration = 60 }: AutomationEditorProps) {
  const { setTrackVolume } = useAudioEngine()
  const [lanes, setLanes] = useState<AutomationLane[]>([])
  const [selectedLane, setSelectedLane] = useState<string | null>(null)
  const [selectedPoints, setSelectedPoints] = useState<string[]>([])
  const [tool, setTool] = useState<'select' | 'pencil' | 'line'>('select')
  const [isPlaying, setIsPlaying] = useState(false)
  const [playheadPosition, setPlayheadPosition] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [scrollX, setScrollX] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const pixelsPerSecond = 100 * zoom
  const laneHeight = 80
  const timelineHeight = 30

  const addAutomationLane = (parameter: string) => {
    const paramConfig = AUTOMATION_PARAMETERS.find(p => p.id === parameter)
    if (!paramConfig) return

    const newLane: AutomationLane = {
      id: `lane_${Date.now()}`,
      trackId,
      parameter,
      points: [
        { id: 'start', time: 0, value: 0.5, curve: 'linear' },
        { id: 'end', time: duration, value: 0.5, curve: 'linear' }
      ],
      enabled: true,
      min: paramConfig.min,
      max: paramConfig.max,
      unit: paramConfig.unit
    }

    setLanes(prev => [...prev, newLane])
  }

  const deleteLane = (laneId: string) => {
    setLanes(prev => prev.filter(lane => lane.id !== laneId))
    if (selectedLane === laneId) {
      setSelectedLane(null)
    }
  }

  const addAutomationPoint = (laneId: string, time: number, value: number) => {
    setLanes(prev => prev.map(lane => {
      if (lane.id !== laneId) return lane

      const newPoint: AutomationPoint = {
        id: `point_${Date.now()}`,
        time,
        value,
        curve: 'linear'
      }

      const sortedPoints = [...lane.points, newPoint].sort((a, b) => a.time - b.time)
      return { ...lane, points: sortedPoints }
    }))
  }

  const deleteAutomationPoint = (laneId: string, pointId: string) => {
    setLanes(prev => prev.map(lane => {
      if (lane.id !== laneId) return lane
      return {
        ...lane,
        points: lane.points.filter(point => point.id !== pointId)
      }
    }))
  }

  const moveAutomationPoint = (laneId: string, pointId: string, newTime: number, newValue: number) => {
    setLanes(prev => prev.map(lane => {
      if (lane.id !== laneId) return lane
      
      return {
        ...lane,
        points: lane.points.map(point => {
          if (point.id !== pointId) return point
          return {
            ...point,
            time: Math.max(0, Math.min(duration, newTime)),
            value: Math.max(0, Math.min(1, newValue))
          }
        }).sort((a, b) => a.time - b.time)
      }
    }))
  }

  const getAutomationValue = (lane: AutomationLane, time: number): number => {
    if (lane.points.length === 0) return 0.5

    // Find surrounding points
    let beforePoint = lane.points[0]
    let afterPoint = lane.points[lane.points.length - 1]

    for (let i = 0; i < lane.points.length - 1; i++) {
      if (lane.points[i].time <= time && lane.points[i + 1].time >= time) {
        beforePoint = lane.points[i]
        afterPoint = lane.points[i + 1]
        break
      }
    }

    if (beforePoint === afterPoint) return beforePoint.value

    // Interpolate between points
    const timeDiff = afterPoint.time - beforePoint.time
    const valueDiff = afterPoint.value - beforePoint.value
    const progress = (time - beforePoint.time) / timeDiff

    switch (beforePoint.curve) {
      case 'linear':
        return beforePoint.value + valueDiff * progress
      case 'exponential':
        return beforePoint.value + valueDiff * Math.pow(progress, 2)
      case 'bezier':
        // Simplified bezier curve
        return beforePoint.value + valueDiff * (3 * Math.pow(progress, 2) - 2 * Math.pow(progress, 3))
      default:
        return beforePoint.value + valueDiff * progress
    }
  }

  const applyAutomation = () => {
    lanes.forEach(lane => {
      if (!lane.enabled) return

      const value = getAutomationValue(lane, playheadPosition)
      const realValue = lane.min + (lane.max - lane.min) * value

      switch (lane.parameter) {
        case 'volume':
          setTrackVolume(trackId, realValue)
          break
        // Add other parameter automation here
      }
    })
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || !selectedLane) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left + scrollX
    const y = event.clientY - rect.top

    const time = x / pixelsPerSecond
    const laneIndex = Math.floor((y - timelineHeight) / laneHeight)
    const lane = lanes[laneIndex]

    if (!lane || lane.id !== selectedLane) return

    const valueY = y - timelineHeight - laneIndex * laneHeight
    const value = 1 - (valueY / laneHeight)

    if (tool === 'pencil') {
      addAutomationPoint(selectedLane, time, value)
    }
  }

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)

    // Draw timeline
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, width, timelineHeight)
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, timelineHeight)
    ctx.lineTo(width, timelineHeight)
    ctx.stroke()

    // Draw time markers
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.font = '10px monospace'
    for (let i = 0; i <= duration; i += 5) {
      const x = i * pixelsPerSecond - scrollX
      if (x >= 0 && x <= width) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, timelineHeight)
        ctx.stroke()
        ctx.fillText(`${i}s`, x + 2, 12)
      }
    }

    // Draw playhead
    const playheadX = playheadPosition * pixelsPerSecond - scrollX
    if (playheadX >= 0 && playheadX <= width) {
      ctx.strokeStyle = '#fbbf24'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(playheadX, 0)
      ctx.lineTo(playheadX, height)
      ctx.stroke()
    }

    // Draw automation lanes
    lanes.forEach((lane, index) => {
      const laneY = timelineHeight + index * laneHeight
      const isSelected = selectedLane === lane.id

      // Lane background
      ctx.fillStyle = isSelected ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255, 255, 255, 0.02)'
      ctx.fillRect(0, laneY, width, laneHeight)

      // Lane border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, laneY + laneHeight)
      ctx.lineTo(width, laneY + laneHeight)
      ctx.stroke()

      if (!lane.enabled) {
        ctx.globalAlpha = 0.3
      }

      // Draw automation curve
      if (lane.points.length > 1) {
        ctx.strokeStyle = isSelected ? '#8b5cf6' : '#64748b'
        ctx.lineWidth = 2
        ctx.beginPath()

        for (let x = -scrollX; x < width + scrollX; x += 2) {
          const time = x / pixelsPerSecond
          const value = getAutomationValue(lane, time)
          const y = laneY + laneHeight - (value * laneHeight)
          
          if (x === -scrollX) {
            ctx.moveTo(x + scrollX, y)
          } else {
            ctx.lineTo(x + scrollX, y)
          }
        }
        ctx.stroke()
      }

      // Draw automation points
      lane.points.forEach(point => {
        const x = point.time * pixelsPerSecond - scrollX
        const y = laneY + laneHeight - (point.value * laneHeight)

        if (x >= -10 && x <= width + 10) {
          const isPointSelected = selectedPoints.includes(point.id)
          
          ctx.fillStyle = isPointSelected ? '#fbbf24' : isSelected ? '#8b5cf6' : '#64748b'
          ctx.beginPath()
          ctx.arc(x, y, isPointSelected ? 6 : 4, 0, Math.PI * 2)
          ctx.fill()

          // Point border
          ctx.strokeStyle = '#ffffff'
          ctx.lineWidth = 1
          ctx.stroke()
        }
      })

      ctx.globalAlpha = 1
    })
  }, [lanes, selectedLane, selectedPoints, playheadPosition, pixelsPerSecond, scrollX, duration])

  useEffect(() => {
    draw()
  }, [draw])

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setPlayheadPosition(prev => {
          const next = prev + 0.016 // ~60fps
          if (next >= duration) {
            setIsPlaying(false)
            return 0
          }
          return next
        })
        animationRef.current = requestAnimationFrame(animate)
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, duration])

  useEffect(() => {
    applyAutomation()
  }, [playheadPosition, lanes])

  return (
    <div style={{
      width: '100%',
      height: '400px',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #141414 100%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Toolbar */}
      <div style={{
        height: '40px',
        background: 'linear-gradient(180deg, #1a1a1a 0%, #161616 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: '8px'
      }}>
        <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600' }}>
          Automation
        </span>

        {/* Tool Selection */}
        <div style={{ display: 'flex', gap: '4px', marginLeft: '16px' }}>
          {[
            { id: 'select', icon: Mouse, label: 'Select' },
            { id: 'pencil', icon: Edit, label: 'Pencil' },
            { id: 'line', icon: TrendingUp, label: 'Line' }
          ].map(toolOption => (
            <button
              key={toolOption.id}
              onClick={() => setTool(toolOption.id as any)}
              style={{
                width: '32px',
                height: '24px',
                background: tool === toolOption.id ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '3px',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={toolOption.label}
            >
              <toolOption.icon size={12} />
            </button>
          ))}
        </div>

        {/* Transport */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            width: '32px',
            height: '24px',
            background: isPlaying ? '#ef4444' : '#22c55e',
            border: 'none',
            borderRadius: '3px',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '16px'
          }}
        >
          {isPlaying ? <Pause size={12} /> : <Play size={12} />}
        </button>

        <div style={{ flex: 1 }} />

        {/* Add Parameter */}
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) {
              addAutomationLane(e.target.value)
              e.target.value = ''
            }
          }}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            color: '#ffffff',
            padding: '4px 8px',
            fontSize: '12px'
          }}
        >
          <option value="" style={{ background: '#1a1a1a' }}>Add Parameter...</option>
          {AUTOMATION_PARAMETERS.map(param => (
            <option key={param.id} value={param.id} style={{ background: '#1a1a1a' }}>
              {param.name}
            </option>
          ))}
        </select>
      </div>

      {/* Lane List */}
      <div style={{
        width: '200px',
        background: '#161616',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        overflowY: 'auto'
      }}>
        {lanes.map((lane, index) => {
          const paramConfig = AUTOMATION_PARAMETERS.find(p => p.id === lane.parameter)
          return (
            <div
              key={lane.id}
              style={{
                height: `${laneHeight}px`,
                padding: '8px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                background: selectedLane === lane.id ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedLane(lane.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: '500' }}>
                  {paramConfig?.name || lane.parameter}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteLane(lane.id)
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)', marginTop: '4px' }}>
                {lane.min} - {lane.max} {lane.unit}
              </div>
            </div>
          )
        })}
      </div>

      {/* Automation Canvas */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={lanes.length * laneHeight + timelineHeight}
          style={{
            width: '100%',
            height: '100%',
            cursor: tool === 'pencil' ? 'crosshair' : 'default'
          }}
          onClick={handleCanvasClick}
        />
      </div>
    </div>
  )
}