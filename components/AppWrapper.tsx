'use client';

import React, { useState, useEffect } from 'react';
import DevBar from './DevBar';
import Taskbar from './Taskbar';

interface AppWrapperProps {
  children: React.ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('devBarCollapsed');
      setIsCollapsed(saved === 'true');
    }
  }, []);

  const handleCollapsedChange = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  if (!mounted) {
    return (
      <>
        <DevBar />
        <Taskbar />
        <div style={{ 
          paddingTop: '60px', // 32px for POC banner + 28px for taskbar
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)'
        }}>
          {children}
        </div>
      </>
    );
  }

  return (
    <>
      <DevBar onCollapsedChange={handleCollapsedChange} />
      <Taskbar />
      <div 
        className={`app-container ${isCollapsed ? 'with-dev-bar-collapsed' : 'with-dev-bar'}`}
        style={{ 
          paddingTop: '60px', // 32px for POC banner + 28px for taskbar
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)'
        }}
      >
        {children}
      </div>
    </>
  );
}