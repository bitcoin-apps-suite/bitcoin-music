'use client';

import React from 'react';
import './mixing-desk.css';

const MixingDesk: React.FC = () => {
  return (
    <div className="console-wrapper">
      <div className="console-header">
        <div className="brand">
          <div className="brand-logo">♪</div>
          <div className="brand-text">BITCOIN MUSIC PRO</div>
        </div>
        <div className="console-displays">
          <div className="display">
            <div className="display-label">BPM</div>
            <div className="display-value">128</div>
          </div>
          <div className="display">
            <div className="display-label">Time</div>
            <div className="display-value">03:42:15</div>
          </div>
          <div className="display">
            <div className="display-label">CPU</div>
            <div className="display-value">42%</div>
          </div>
        </div>
      </div>
      
      <div className="mixing-desk">
        <div className="channel-section">
          {/* Channels */}
          {[
            { num: '01', label: 'Kick', solo: true },
            { num: '02', label: 'Snare', solo: false },
            { num: '03', label: 'Hi-Hat', solo: false },
            { num: '04', label: 'Bass', solo: true },
            { num: '05', label: 'Lead', solo: false },
            { num: '06', label: 'Pad', solo: false },
            { num: '07', label: 'Vocal', solo: true },
            { num: '08', label: 'FX', solo: false },
          ].map((channel) => (
            <div key={channel.num} className="channel">
              <div className="channel-header">
                <div className="channel-number">{channel.num}</div>
                <div className="channel-label">{channel.label}</div>
              </div>
              <div className="eq-section">
                <div className="eq-label">HIGH</div>
                <div className="knob-container">
                  <div className="knob"></div>
                </div>
                <div className="eq-label">MID</div>
                <div className="knob-container">
                  <div className="knob"></div>
                </div>
                <div className="eq-label">LOW</div>
                <div className="knob-container">
                  <div className="knob"></div>
                </div>
              </div>
              <div className="fader-section">
                <div className="fader-track">
                  <div className="fader-handle"></div>
                </div>
              </div>
              <div className="button-section">
                <button className={`channel-button ${channel.solo ? 'active' : ''}`}>S</button>
                <button className="channel-button">M</button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Master Section */}
        <div className="master-section">
          <div className="master-title">MASTER</div>
          <div className="knob-container">
            <div className="knob"></div>
            <div className="knob-label">COMP</div>
          </div>
          <div className="knob-container">
            <div className="knob"></div>
            <div className="knob-label">LIMIT</div>
          </div>
          <div className="master-fader fader-section">
            <div className="fader-track">
              <div className="fader-handle"></div>
            </div>
          </div>
          <div className="knob-container">
            <div className="knob"></div>
            <div className="knob-label">OUTPUT</div>
          </div>
        </div>
        
        {/* Effects Rack */}
        <div className="effects-rack">
          <div className="effects-title">EFFECTS & ANALYSIS</div>
          
          <div className="spectrum-analyzer">
            <div className="spectrum-bars">
              {[80, 95, 70, 85, 60, 75, 50, 65, 40, 55, 35, 45].map((height, i) => (
                <div 
                  key={i} 
                  className="spectrum-bar" 
                  style={{ 
                    height: `${height}%`,
                    animationDelay: `${i * 0.1}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
          
          <div className="vu-meters">
            <div className="vu-meter">
              <div className="vu-label">LEFT</div>
              <div className="vu-display">
                <div className="vu-level"></div>
              </div>
            </div>
            <div className="vu-meter">
              <div className="vu-label">RIGHT</div>
              <div className="vu-display">
                <div className="vu-level" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>
          </div>
          
          <div className="effects-controls">
            {['Reverb', 'Delay', 'Chorus', 'Flanger', 'Phaser', 'Filter'].map((effect) => (
              <div key={effect} className="effect-module">
                <div className="effect-name">{effect}</div>
                <div className="effect-knob"></div>
              </div>
            ))}
          </div>
          
          <div className="transport-controls">
            <button className="transport-btn">⏮</button>
            <button className="transport-btn play">▶</button>
            <button className="transport-btn">⏸</button>
            <button className="transport-btn">⏹</button>
            <button className="transport-btn record">●</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MixingDesk;