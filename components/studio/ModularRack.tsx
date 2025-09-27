'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Settings, Trash2, Cable, Volume2, Waves, Zap } from 'lucide-react'
import { getTone } from '@/lib/audio/ToneWrapper'

interface Connection {
  id: string
  fromModule: string
  fromOutput: string
  toModule: string
  toInput: string
}

interface ModulePort {
  id: string
  name: string
  type: 'audio' | 'cv' | 'gate'
  direction: 'input' | 'output'
}

interface RackModule {
  id: string
  type: 'oscillator' | 'filter' | 'envelope' | 'vca' | 'delay' | 'reverb'
  name: string
  x: number
  y: number
  width: number
  height: number
  inputs: ModulePort[]
  outputs: ModulePort[]
  parameters: { [key: string]: number }
  audioNode?: any
}

const MODULE_TEMPLATES = {
  oscillator: {
    name: 'Oscillator',
    width: 120,
    height: 180,
    inputs: [
      { id: 'freq_cv', name: 'Freq CV', type: 'cv' as const, direction: 'input' as const },
      { id: 'sync', name: 'Sync', type: 'gate' as const, direction: 'input' as const }
    ],
    outputs: [
      { id: 'audio_out', name: 'Audio', type: 'audio' as const, direction: 'output' as const }
    ],
    parameters: {
      frequency: 440,
      detune: 0,
      type: 0 // 0=sine, 1=square, 2=sawtooth, 3=triangle
    }
  },
  filter: {
    name: 'Filter',
    width: 120,
    height: 180,
    inputs: [
      { id: 'audio_in', name: 'Audio', type: 'audio' as const, direction: 'input' as const },
      { id: 'cutoff_cv', name: 'Cutoff CV', type: 'cv' as const, direction: 'input' as const },
      { id: 'resonance_cv', name: 'Res CV', type: 'cv' as const, direction: 'input' as const }
    ],
    outputs: [
      { id: 'audio_out', name: 'Audio', type: 'audio' as const, direction: 'output' as const }
    ],
    parameters: {
      frequency: 1000,
      resonance: 1,
      type: 0 // 0=lowpass, 1=highpass, 2=bandpass
    }
  },
  envelope: {
    name: 'ADSR',
    width: 120,
    height: 180,
    inputs: [
      { id: 'gate', name: 'Gate', type: 'gate' as const, direction: 'input' as const }
    ],
    outputs: [
      { id: 'cv_out', name: 'CV', type: 'cv' as const, direction: 'output' as const }
    ],
    parameters: {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.5,
      release: 0.5
    }
  },
  vca: {
    name: 'VCA',
    width: 80,
    height: 140,
    inputs: [
      { id: 'audio_in', name: 'Audio', type: 'audio' as const, direction: 'input' as const },
      { id: 'cv_in', name: 'CV', type: 'cv' as const, direction: 'input' as const }
    ],
    outputs: [
      { id: 'audio_out', name: 'Audio', type: 'audio' as const, direction: 'output' as const }
    ],
    parameters: {
      gain: 0.5
    }
  }
}

export default function ModularRack() {
  const [modules, setModules] = useState<RackModule[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const [connecting, setConnecting] = useState<{
    fromModule: string
    fromOutput: string
  } | null>(null)
  const rackRef = useRef<HTMLDivElement>(null)

  const addModule = (type: keyof typeof MODULE_TEMPLATES) => {
    const template = MODULE_TEMPLATES[type]
    const newModule: RackModule = {
      id: `module_${Date.now()}`,
      type,
      name: template.name,
      x: Math.random() * 400,
      y: Math.random() * 300,
      width: template.width,
      height: template.height,
      inputs: template.inputs.map(input => ({ ...input, id: `${input.id}_${Date.now()}` })),
      outputs: template.outputs.map(output => ({ ...output, id: `${output.id}_${Date.now()}` })),
      parameters: { ...template.parameters }
    }

    setModules(prev => [...prev, newModule])
    
    // Create audio node for the module
    createAudioNode(newModule)
  }

  const createAudioNode = async (module: RackModule) => {
    const Tone = await getTone()
    if (!Tone) return

    let audioNode: any = null

    switch (module.type) {
      case 'oscillator':
        audioNode = new Tone.Oscillator({
          frequency: module.parameters.frequency,
          detune: module.parameters.detune,
          type: ['sine', 'square', 'sawtooth', 'triangle'][module.parameters.type] as any
        })
        break
      
      case 'filter':
        audioNode = new Tone.Filter({
          frequency: module.parameters.frequency,
          Q: module.parameters.resonance,
          type: ['lowpass', 'highpass', 'bandpass'][module.parameters.type] as any
        })
        break
      
      case 'envelope':
        audioNode = new Tone.AmplitudeEnvelope({
          attack: module.parameters.attack,
          decay: module.parameters.decay,
          sustain: module.parameters.sustain,
          release: module.parameters.release
        })
        break
      
      case 'vca':
        audioNode = new Tone.Gain(module.parameters.gain)
        break
    }

    if (audioNode) {
      setModules(prev => prev.map(m => 
        m.id === module.id ? { ...m, audioNode } : m
      ))
    }
  }

  const deleteModule = (moduleId: string) => {
    setModules(prev => {
      const module = prev.find(m => m.id === moduleId)
      if (module?.audioNode && module.audioNode.dispose) {
        module.audioNode.dispose()
      }
      return prev.filter(m => m.id !== moduleId)
    })
    
    // Remove connections involving this module
    setConnections(prev => prev.filter(conn => 
      conn.fromModule !== moduleId && conn.toModule !== moduleId
    ))
  }

  const startConnection = (moduleId: string, outputId: string) => {
    setConnecting({ fromModule: moduleId, fromOutput: outputId })
  }

  const completeConnection = (moduleId: string, inputId: string) => {
    if (!connecting) return

    const newConnection: Connection = {
      id: `conn_${Date.now()}`,
      fromModule: connecting.fromModule,
      fromOutput: connecting.fromOutput,
      toModule: moduleId,
      toInput: inputId
    }

    setConnections(prev => [...prev, newConnection])
    setConnecting(null)

    // Connect audio nodes
    connectAudioNodes(newConnection)
  }

  const connectAudioNodes = (connection: Connection) => {
    const fromModule = modules.find(m => m.id === connection.fromModule)
    const toModule = modules.find(m => m.id === connection.toModule)

    if (fromModule?.audioNode && toModule?.audioNode) {
      try {
        fromModule.audioNode.connect(toModule.audioNode)
      } catch (error) {
        console.error('Failed to connect audio nodes:', error)
      }
    }
  }

  const updateParameter = (moduleId: string, param: string, value: number) => {
    setModules(prev => prev.map(module => {
      if (module.id === moduleId) {
        const updatedModule = {
          ...module,
          parameters: { ...module.parameters, [param]: value }
        }

        // Update audio node parameter
        if (module.audioNode) {
          try {
            switch (param) {
              case 'frequency':
                if (module.audioNode.frequency) {
                  module.audioNode.frequency.value = value
                }
                break
              case 'resonance':
                if (module.audioNode.Q) {
                  module.audioNode.Q.value = value
                }
                break
              case 'gain':
                if (module.audioNode.gain) {
                  module.audioNode.gain.value = value
                }
                break
            }
          } catch (error) {
            console.error('Failed to update parameter:', error)
          }
        }

        return updatedModule
      }
      return module
    }))
  }

  const getPortColor = (type: string) => {
    switch (type) {
      case 'audio': return '#22c55e'
      case 'cv': return '#3b82f6'
      case 'gate': return '#ef4444'
      default: return '#64748b'
    }
  }

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'oscillator': return <Waves size={16} />
      case 'filter': return <Settings size={16} />
      case 'envelope': return <Zap size={16} />
      case 'vca': return <Volume2 size={16} />
      default: return <Settings size={16} />
    }
  }

  return (
    <div style={{
      width: '100%',
      height: '600px',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #141414 100%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      position: 'relative',
      overflow: 'hidden'
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
          Modular Rack
        </span>
        
        <div style={{ flex: 1 }} />
        
        {Object.keys(MODULE_TEMPLATES).map(type => (
          <button
            key={type}
            onClick={() => addModule(type as keyof typeof MODULE_TEMPLATES)}
            style={{
              padding: '6px 12px',
              background: 'rgba(139, 92, 246, 0.2)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '4px',
              color: '#8b5cf6',
              cursor: 'pointer',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Plus size={12} />
            {MODULE_TEMPLATES[type as keyof typeof MODULE_TEMPLATES].name}
          </button>
        ))}
      </div>

      {/* Rack Area */}
      <div 
        ref={rackRef}
        style={{
          flex: 1,
          position: 'relative',
          background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 70%)',
          overflow: 'auto'
        }}
      >
        {/* Connection Cables */}
        <svg style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1
        }}>
          {connections.map(conn => {
            const fromModule = modules.find(m => m.id === conn.fromModule)
            const toModule = modules.find(m => m.id === conn.toModule)
            if (!fromModule || !toModule) return null

            const fromX = fromModule.x + fromModule.width
            const fromY = fromModule.y + 60
            const toX = toModule.x
            const toY = toModule.y + 60

            return (
              <path
                key={conn.id}
                d={`M ${fromX} ${fromY} Q ${fromX + 50} ${fromY} ${toX} ${toY}`}
                stroke="#8b5cf6"
                strokeWidth="2"
                fill="none"
                opacity="0.7"
              />
            )
          })}
        </svg>

        {/* Modules */}
        {modules.map(module => (
          <div
            key={module.id}
            style={{
              position: 'absolute',
              left: module.x,
              top: module.y,
              width: module.width,
              height: module.height,
              background: 'linear-gradient(180deg, #2a2a2a 0%, #1e1e1e 100%)',
              border: selectedModule === module.id ? '2px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              zIndex: 2,
              cursor: 'move'
            }}
            onClick={() => setSelectedModule(module.id)}
          >
            {/* Module Header */}
            <div style={{
              height: '32px',
              background: 'linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px 6px 0 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {getModuleIcon(module.type)}
                <span style={{ color: '#ffffff', fontSize: '11px', fontWeight: '600' }}>
                  {module.name}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteModule(module.id)
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  padding: '2px'
                }}
              >
                <Trash2 size={12} />
              </button>
            </div>

            {/* Module Content */}
            <div style={{ padding: '8px' }}>
              {/* Parameters */}
              {Object.entries(module.parameters).map(([param, value]) => (
                <div key={param} style={{ marginBottom: '8px' }}>
                  <label style={{
                    display: 'block',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '10px',
                    marginBottom: '2px'
                  }}>
                    {param}: {typeof value === 'number' ? value.toFixed(2) : value}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={param === 'frequency' ? 2000 : param === 'resonance' ? 10 : 1}
                    step={param === 'frequency' ? 10 : 0.01}
                    value={value}
                    onChange={(e) => updateParameter(module.id, param, Number(e.target.value))}
                    style={{
                      width: '100%',
                      height: '4px',
                      accentColor: '#8b5cf6'
                    }}
                  />
                </div>
              ))}

              {/* Input Ports */}
              <div style={{ marginTop: '12px' }}>
                {module.inputs.map(input => (
                  <div
                    key={input.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '4px',
                      cursor: 'pointer'
                    }}
                    onClick={() => connecting && completeConnection(module.id, input.id)}
                  >
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: getPortColor(input.type),
                      border: '2px solid #1a1a1a',
                      marginRight: '6px'
                    }} />
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '9px' }}>
                      {input.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Output Ports */}
              <div style={{ marginTop: '8px' }}>
                {module.outputs.map(output => (
                  <div
                    key={output.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      marginBottom: '4px',
                      cursor: 'pointer'
                    }}
                    onClick={() => startConnection(module.id, output.id)}
                  >
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '9px', marginRight: '6px' }}>
                      {output.name}
                    </span>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: getPortColor(output.type),
                      border: '2px solid #1a1a1a'
                    }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {modules.length === 0 && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.4)'
          }}>
            <Cable size={48} style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>Empty Rack</h3>
            <p style={{ fontSize: '12px' }}>Add modules to start patching</p>
          </div>
        )}
      </div>
    </div>
  )
}