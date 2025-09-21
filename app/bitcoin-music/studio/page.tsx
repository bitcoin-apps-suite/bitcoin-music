'use client';

import React, { useState, useEffect, useRef } from 'react';
import './studio.css';

const StudioPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [activeStep, setActiveStep] = useState(0);
  const [sequencerPattern, setSequencerPattern] = useState(
    Array(8).fill(null).map(() => Array(16).fill(false))
  );
  const [activePads, setActivePads] = useState<Set<number>>(new Set());
  const [xyPosition, setXyPosition] = useState({ x: 50, y: 50 });
  const [oscilloscopeData, setOscilloscopeData] = useState<number[]>(
    Array(100).fill(50)
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sequencer animation
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % 16);
      }, (60 / bpm) * 250); // 16th notes
      return () => clearInterval(interval);
    }
  }, [isPlaying, bpm]);

  // Oscilloscope animation
  useEffect(() => {
    const interval = setInterval(() => {
      setOscilloscopeData(
        Array(100).fill(0).map(() => Math.random() * 100)
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const toggleSequencerCell = (row: number, col: number) => {
    const newPattern = [...sequencerPattern];
    newPattern[row][col] = !newPattern[row][col];
    setSequencerPattern(newPattern);
  };

  const handleDrumPad = (padNumber: number) => {
    setActivePads(prev => new Set(Array.from(prev).concat(padNumber)));
    setTimeout(() => {
      setActivePads(prev => {
        const newSet = new Set(Array.from(prev));
        newSet.delete(padNumber);
        return newSet;
      });
    }, 100);
  };

  const handleXYPad = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setXyPosition({ x, y });
  };

  return (
    <div className="studio-container">
      {/* Header */}
      <div className="studio-header">
        <div className="studio-brand">
          <div className="studio-logo">♪</div>
          <div className="studio-title">BITCOIN MUSIC STUDIO</div>
        </div>
        <div className="header-controls">
          <div className="tempo-display">
            <div className="tempo-label">BPM</div>
            <div className="tempo-value">{bpm}</div>
            <div className="tempo-buttons">
              <button onClick={() => setBpm(Math.max(60, bpm - 1))}>−</button>
              <button onClick={() => setBpm(Math.min(200, bpm + 1))}>+</button>
            </div>
          </div>
          <div className="master-controls">
            <button 
              className={`play-button ${isPlaying ? 'active' : ''}`}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button className="stop-button" onClick={() => {
              setIsPlaying(false);
              setActiveStep(0);
            }}>⏹</button>
            <button className="record-button">●</button>
          </div>
        </div>
      </div>

      <div className="studio-workspace">
        {/* Left Section - Drum Pads & Sequencer */}
        <div className="left-section">
          {/* Drum Pads */}
          <div className="drum-machine">
            <div className="section-title">MPC DRUM PADS</div>
            <div className="drum-pads">
              {['KICK', 'SNARE', 'HAT', 'OPEN HAT', 'CLAP', 'CRASH', 'TOM', 'RIDE',
                'PERC 1', 'PERC 2', 'FX 1', 'FX 2', '808', 'SUB', 'VOCAL', 'SAMPLE'].map((name, i) => (
                <button
                  key={i}
                  className={`drum-pad ${Array.from(activePads).includes(i) ? 'active' : ''}`}
                  onMouseDown={() => handleDrumPad(i)}
                  style={{
                    background: Array.from(activePads).includes(i) 
                      ? `radial-gradient(circle, ${['#ff0066', '#00ff66', '#66ff00', '#ff6600'][i % 4]}, #222)`
                      : `linear-gradient(135deg, #2a2a2a, #1a1a1a)`
                  }}
                >
                  <div className="pad-label">{name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step Sequencer */}
          <div className="sequencer">
            <div className="section-title">STEP SEQUENCER</div>
            <div className="sequencer-grid">
              {['KICK', 'SNARE', 'HAT', 'CLAP', 'TOM', 'CRASH', 'PERC', 'FX'].map((track, row) => (
                <div key={row} className="sequencer-row">
                  <div className="track-label">{track}</div>
                  {Array(16).fill(null).map((_, col) => (
                    <button
                      key={col}
                      className={`sequencer-cell ${sequencerPattern[row][col] ? 'active' : ''} ${
                        col === activeStep ? 'playing' : ''
                      }`}
                      onClick={() => toggleSequencerCell(row, col)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Section - Keyboard & Controls */}
        <div className="center-section">
          {/* Synthesizer Keyboard */}
          <div className="synthesizer">
            <div className="section-title">SYNTHESIZER</div>
            <div className="synth-controls">
              <div className="synth-knobs">
                {['ATTACK', 'DECAY', 'SUSTAIN', 'RELEASE', 'CUTOFF', 'RESONANCE'].map((param) => (
                  <div key={param} className="synth-knob-group">
                    <div className="knob synth-knob"></div>
                    <div className="knob-label">{param}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="keyboard">
              {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
                'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map((note, i) => (
                <button
                  key={i}
                  className={`key ${note.includes('#') ? 'black' : 'white'}`}
                >
                  <span className="note-label">{note}</span>
                </button>
              ))}
            </div>
          </div>

          {/* XY Pad Controller */}
          <div className="xy-controller">
            <div className="section-title">XY PAD - EFFECTS CONTROLLER</div>
            <div 
              className="xy-pad"
              onMouseMove={handleXYPad}
              onMouseDown={handleXYPad}
            >
              <div 
                className="xy-cursor"
                style={{ 
                  left: `${xyPosition.x}%`, 
                  top: `${xyPosition.y}%` 
                }}
              />
              <div className="xy-grid">
                {Array(10).fill(null).map((_, i) => (
                  <div key={`h${i}`} className="grid-line horizontal" />
                ))}
                {Array(10).fill(null).map((_, i) => (
                  <div key={`v${i}`} className="grid-line vertical" />
                ))}
              </div>
              <div className="xy-labels">
                <span className="xy-label top-left">REVERB</span>
                <span className="xy-label top-right">DELAY</span>
                <span className="xy-label bottom-left">FILTER</span>
                <span className="xy-label bottom-right">DISTORTION</span>
              </div>
            </div>
            <div className="xy-values">
              <div>X: {Math.round(xyPosition.x)}%</div>
              <div>Y: {Math.round(xyPosition.y)}%</div>
            </div>
          </div>

          {/* Sample Trigger Pads */}
          <div className="sample-triggers">
            <div className="section-title">SAMPLE LOOPS</div>
            <div className="sample-pads">
              {['LOOP 1', 'LOOP 2', 'LOOP 3', 'LOOP 4', 'LOOP 5', 'LOOP 6', 'LOOP 7', 'LOOP 8'].map((loop, i) => (
                <button key={i} className="sample-pad">
                  <div className="sample-waveform">
                    {Array(20).fill(null).map((_, j) => (
                      <div 
                        key={j} 
                        className="waveform-bar"
                        style={{ height: `${Math.random() * 100}%` }}
                      />
                    ))}
                  </div>
                  <div className="sample-name">{loop}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - Visualizers & Effects */}
        <div className="right-section">
          {/* Oscilloscope */}
          <div className="oscilloscope">
            <div className="section-title">OSCILLOSCOPE</div>
            <div className="oscilloscope-display">
              <svg viewBox="0 0 100 100" className="oscilloscope-svg">
                <polyline
                  points={oscilloscopeData.map((y, x) => `${x},${y}`).join(' ')}
                  fill="none"
                  stroke="#00ff00"
                  strokeWidth="0.5"
                />
                {/* Grid lines */}
                {Array(10).fill(null).map((_, i) => (
                  <line
                    key={`h${i}`}
                    x1="0"
                    y1={i * 10}
                    x2="100"
                    y2={i * 10}
                    stroke="#003300"
                    strokeWidth="0.1"
                  />
                ))}
                {Array(10).fill(null).map((_, i) => (
                  <line
                    key={`v${i}`}
                    x1={i * 10}
                    y1="0"
                    x2={i * 10}
                    y2="100"
                    stroke="#003300"
                    strokeWidth="0.1"
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* Spectrum Analyzer */}
          <div className="spectrum-analyzer-pro">
            <div className="section-title">SPECTRUM ANALYZER</div>
            <div className="spectrum-display">
              {Array(32).fill(null).map((_, i) => (
                <div 
                  key={i} 
                  className="spectrum-bar-pro"
                  style={{ 
                    height: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.05}s`
                  }}
                />
              ))}
            </div>
            <div className="frequency-labels">
              <span>20Hz</span>
              <span>200Hz</span>
              <span>2kHz</span>
              <span>20kHz</span>
            </div>
          </div>

          {/* VU Meters */}
          <div className="vu-meter-section">
            <div className="section-title">VU METERS</div>
            <div className="vu-meters-pro">
              <div className="vu-meter-channel">
                <div className="vu-meter-display">
                  <div className="vu-needle" style={{ transform: `rotate(${Math.random() * 60 - 30}deg)` }} />
                  <div className="vu-scale">
                    <span>-20</span>
                    <span>-10</span>
                    <span>0</span>
                    <span>+3</span>
                  </div>
                </div>
                <div className="vu-label">LEFT</div>
              </div>
              <div className="vu-meter-channel">
                <div className="vu-meter-display">
                  <div className="vu-needle" style={{ transform: `rotate(${Math.random() * 60 - 30}deg)` }} />
                  <div className="vu-scale">
                    <span>-20</span>
                    <span>-10</span>
                    <span>0</span>
                    <span>+3</span>
                  </div>
                </div>
                <div className="vu-label">RIGHT</div>
              </div>
            </div>
          </div>

          {/* Effects Rack */}
          <div className="effects-rack-pro">
            <div className="section-title">EFFECTS RACK</div>
            <div className="effects-modules">
              {['REVERB', 'DELAY', 'CHORUS', 'PHASER', 'FLANGER', 'DISTORTION', 
                'COMPRESSOR', 'LIMITER', 'GATE'].map((effect) => (
                <div key={effect} className="effect-module-pro">
                  <div className="effect-led active" />
                  <div className="effect-name">{effect}</div>
                  <div className="effect-knob-small" />
                </div>
              ))}
            </div>
          </div>

          {/* Pitch Bend & Mod Wheels */}
          <div className="performance-wheels">
            <div className="section-title">PERFORMANCE</div>
            <div className="wheels-container">
              <div className="wheel-group">
                <div className="wheel pitch-wheel">
                  <div className="wheel-indicator" />
                </div>
                <div className="wheel-label">PITCH</div>
              </div>
              <div className="wheel-group">
                <div className="wheel mod-wheel">
                  <div className="wheel-indicator" />
                </div>
                <div className="wheel-label">MOD</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioPage;