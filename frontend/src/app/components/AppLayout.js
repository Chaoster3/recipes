'use client';

import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const AppLayout = ({ children }) => {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  // Don't show navigation on login/register pages when not authenticated
  // Also exclude standalone recipe pages from authentication requirements
  const isAuthPage = pathname === '/' || pathname === '/register';
  const isStandaloneRecipePage = pathname.startsWith('/recipe/');
  const showNavigation = isAuthenticated && !isAuthPage;

  // For standalone recipe pages, render without navigation and authentication check
  if (isStandaloneRecipePage) {
    return (
      <div className="min-h-screen bg-[#fde7cb]">
        {children}
      </div>
    );
  }

  if (!showNavigation) {
    return (
      <div className="min-h-screen bg-[#fde7cb] flex items-center justify-center">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#fde7cb]">
      <Navigation />
      <div className="flex-grow ml-60">
        {children}
      </div>
    </div>
  );
};

export default AppLayout; 