'use client';

import React, { useState, useEffect } from 'react';
import PocBar from './PocBar';
import Taskbar from './Taskbar';
import DevBar from './DevBar';
import Footer from './Footer';
import { useBitcoinOS } from '@/lib/utils/useBitcoinOS';

interface AppWrapperProps {
  children: React.ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(true); // Default collapsed like Bitcoin Writer
  const [pocBannerVisible, setPocBannerVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isInOS, setTitle } = useBitcoinOS();

  useEffect(() => {
    setMounted(true);
    
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    if (typeof window !== 'undefined') {
      const savedDevCollapsed = localStorage.getItem('devSidebarCollapsed');
      const savedPocVisible = localStorage.getItem('pocBannerVisible');
      
      setDevSidebarCollapsed(savedDevCollapsed !== null ? savedDevCollapsed === 'true' : true);
      setPocBannerVisible(savedPocVisible !== null ? savedPocVisible === 'true' : true);
    }
    
    // Set app title when running in Bitcoin OS
    if (isInOS) {
      setTitle('Bitcoin Music');
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, [isInOS, setTitle]);

  const handleDevSidebarCollapsedChange = (collapsed: boolean) => {
    setDevSidebarCollapsed(collapsed);
  };

  const handlePocBannerVisibilityChange = (visible: boolean) => {
    setPocBannerVisible(visible);
  };

  if (!mounted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {!isInOS && <PocBar />}
        {!isInOS && <Taskbar />}
        {!isMobile && !isInOS && <DevBar />}
        <div style={{ 
          paddingTop: isInOS ? '0' : '72px', // 40px POC banner + 32px taskbar
          paddingLeft: !isMobile && !isInOS && !devSidebarCollapsed ? '260px' : (!isMobile && !isInOS ? '60px' : '0'),
          flex: 1,
          background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
          transition: 'padding-left 0.3s ease'
        }}>
          {children}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Only show PoC banner when NOT in Bitcoin OS */}
      {!isInOS && (
        <PocBar 
          isVisible={pocBannerVisible}
          onVisibilityChange={handlePocBannerVisibilityChange}
        />
      )}
      
      {/* Dev Sidebar - Desktop Only */}
      {!isMobile && !isInOS && (
        <DevBar onCollapsedChange={handleDevSidebarCollapsedChange} />
      )}
      
      {/* Clean taskbar - Only when NOT in Bitcoin OS */}
      {!isInOS && <Taskbar />}
      
      <div 
        className={`app-container ${isInOS ? '' : (!isMobile && devSidebarCollapsed ? 'with-dev-sidebar-collapsed' : '')}`}
        style={{ 
          paddingTop: isInOS ? '0' : (pocBannerVisible ? '72px' : '32px'), // Adjust based on PoC banner visibility
          paddingLeft: !isMobile && !isInOS && !devSidebarCollapsed ? '260px' : (!isMobile && !isInOS ? '60px' : '0'),
          flex: 1,
          background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
          transition: 'padding-left 0.3s ease'
        }}
      >
        {children}
      </div>
      
      <Footer />
    </div>
  );
}