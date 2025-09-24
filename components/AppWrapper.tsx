'use client';

import React, { useState, useEffect } from 'react';
import DevBar from './DevBar';
import Taskbar from './Taskbar';
import { useBitcoinOS } from '@/lib/utils/useBitcoinOS';

interface AppWrapperProps {
  children: React.ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isInOS, setTitle } = useBitcoinOS();

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('devBarCollapsed');
      setIsCollapsed(saved === 'true');
    }
    
    // Set app title when running in Bitcoin OS
    if (isInOS) {
      setTitle('Bitcoin Music Studio');
    }
  }, [isInOS, setTitle]);

  const handleCollapsedChange = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  if (!mounted) {
    return (
      <>
        {!isInOS && <DevBar />}
        {!isInOS && <Taskbar />}
        <div style={{ 
          paddingTop: isInOS ? '0' : '60px', // 32px for POC banner + 28px for taskbar
          flex: 1,
          background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)'
        }}>
          {children}
        </div>
      </>
    );
  }

  return (
    <>
      {!isInOS && <DevBar onCollapsedChange={handleCollapsedChange} />}
      {!isInOS && <Taskbar />}
      <div 
        className={`app-container ${isInOS ? '' : (isCollapsed ? 'with-dev-bar-collapsed' : 'with-dev-bar')}`}
        style={{ 
          paddingTop: isInOS ? '0' : '60px', // 32px for POC banner + 28px for taskbar
          flex: 1,
          background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)'
        }}
      >
        {children}
      </div>
    </>
  );
}