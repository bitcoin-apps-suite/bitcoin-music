'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

interface PocBarProps {
  isVisible?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
}

export default function PocBar({ isVisible: controlledVisible, onVisibilityChange }: PocBarProps) {
  const [internalVisible, setInternalVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Use controlled visibility if provided, otherwise use internal state
  const isVisible = controlledVisible !== undefined ? controlledVisible : internalVisible;
  
  useEffect(() => {
    setMounted(true);
    if (controlledVisible === undefined && typeof window !== 'undefined') {
      const saved = localStorage.getItem('pocBannerVisible');
      const visible = saved !== null ? saved === 'true' : true;
      setInternalVisible(visible);
    }
  }, [controlledVisible]);

  useEffect(() => {
    if (mounted && controlledVisible === undefined && typeof window !== 'undefined') {
      localStorage.setItem('pocBannerVisible', internalVisible.toString());
    }
  }, [internalVisible, mounted, controlledVisible]);

  const handleClose = () => {
    if (controlledVisible !== undefined) {
      onVisibilityChange?.(false);
    } else {
      setInternalVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className="poc-banner"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '40px',
        background: 'linear-gradient(135deg, #9333ea, #7c3aed)', // Purple gradient for Bitcoin Music
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10001,
        fontSize: '13px',
        fontWeight: '500',
        color: 'white',
        letterSpacing: '0.5px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        borderBottom: '1px solid rgba(0,0,0,0.2)',
        padding: '0 12px'
      }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        flex: 1
      }}>
        <span style={{ 
          fontSize: '12px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '16px',
          height: '16px'
        }}>⚠️</span>
        <span style={{ fontWeight: '600' }}>PROOF OF CONCEPT</span>
        <span style={{ opacity: 0.9 }}>This is a demonstration version.</span>
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginLeft: '16px', 
          fontSize: '12px'
        }}>
          <Link 
            href="/studio" 
            style={{ 
              color: 'white', 
              textDecoration: 'underline',
              opacity: 0.9,
              fontWeight: '400',
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}
          >
            Studio
          </Link>
          <Link 
            href="/community" 
            style={{ 
              color: 'white', 
              textDecoration: 'underline',
              opacity: 0.9,
              fontWeight: '400',
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}
          >
            Community
          </Link>
          <Link 
            href="/token" 
            style={{ 
              color: 'white', 
              textDecoration: 'underline',
              opacity: 0.9,
              fontWeight: '400',
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}
          >
            Token
          </Link>
          <a 
            href="https://github.com/bitcoin-apps-suite/bitcoin-music"
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              color: 'white', 
              textDecoration: 'underline',
              opacity: 0.9,
              fontWeight: '400',
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}
          >
            GitHub
          </a>
        </div>
      </div>
      
      <button
        onClick={handleClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.7,
          transition: 'all 0.2s ease',
          marginLeft: '16px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.7';
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        title="Close banner"
      >
        <X size={14} />
      </button>
    </div>
  );
}