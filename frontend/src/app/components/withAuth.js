'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from '../utils/cookies';

// HOC to protect routes that require authentication
export default function withAuth(Component) {
  return function ProtectedRoute(props) {
    const router = useRouter();
    
    useEffect(() => {
      const username = getCookie('username');
      if (!username) {
        router.push(`/?from=${encodeURIComponent(window.location.pathname)}&message=${encodeURIComponent('Please log in to access this page')}`);
      }
    }, [router]);
    
    const username = getCookie('username');
    return username ? <Component {...props} /> : null;
  };
} 