'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCookie, setCookie, deleteCookie } from '../utils/cookies';

// Create the context
const AuthContext = createContext(null);

// Public paths that don't require auth
const publicPaths = ['/', '/register', '/home'];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check if current path requires auth
  const isPublicPath = () => {
    return publicPaths.includes(pathname) || 
           pathname.startsWith('/search/') || 
           pathname.startsWith('/recipe/') ||
           pathname.includes('api/');
  };

  // Check authentication on mount and path change
  useEffect(() => {
    const checkAuth = () => {
      const username = getCookie('username');
      
      if (username) {
        setUser(username);
        
        // If authenticated user is on the login page, redirect to home
        if (pathname === '/') {
          router.push('/home');
        }
      } else if (!isPublicPath()) {
        // Don't redirect if user just logged out
        const urlParams = new URLSearchParams(window.location.search);
        const isLogout = urlParams.get('logout') === 'true';
        
        if (!isLogout) {
          // Redirect to login if not authenticated and not on a public path
          router.push(`/?from=${encodeURIComponent(pathname)}&message=Please log in to access this page`);
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [pathname, router]);

  // Auth methods
  const login = (username) => {
    setCookie('username', String(username).trim(), 30);
    setUser(username);
  };

  const logout = () => {
    deleteCookie('username');
    setUser(null);
    // Redirect to home page without the error message
    router.push('/?logout=true');
  };

  // Values provided by the context
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// HOC to protect client components
export function withClientAuth(Component) {
  return function ProtectedComponent(props) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    
    // Check if current path requires auth
    const isPublicPath = () => {
      return publicPaths.includes(pathname) || 
             pathname.startsWith('/search/') || 
             pathname.startsWith('/recipe/') ||
             pathname.includes('api/');
    };
    
    useEffect(() => {
      if (!loading && !user && !isPublicPath()) {
        router.push(`/?from=${encodeURIComponent(pathname)}&message=Please log in to access this page`);
      }
    }, [loading, user, pathname, router]);
    
    // Show nothing while checking auth
    if (loading) return null;
    
    // If auth required but user not logged in, show nothing (will redirect)
    if (!user && !isPublicPath()) return null;
    
    // If auth is good or path is public, show the component
    return <Component {...props} />;
  };
} 