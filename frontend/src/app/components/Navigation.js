'use client';

import React from 'react';
import { FaSearch, FaHeart, FaPen, FaSignOutAlt, FaShoppingCart, FaUtensils, FaUser, FaHome } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Get the current route for highlighting active link
  const currentRoute = pathname.split('/')[1] || 'home';

  // Custom link styling
  const getLinkClass = (route) => {
    const baseClasses = "flex items-center space-x-5 p-3 py-3.5 rounded-lg font-medium cursor-pointer transition-all duration-200";
    return currentRoute === route 
      ? `${baseClasses} bg-orange-500 text-white shadow-lg transform` 
      : `${baseClasses} text-gray-700 hover:bg-orange-100 hover:transform hover:translate-x-1`;
  };

  return (
    <nav className="fixed left-0 top-0 h-full w-60 bg-white shadow-md flex flex-col p-6 rounded-r-2xl z-30">
      {/* Logo with enhanced animation */}
      <div className="mb-10 text-center">
        <Link href="/home" className="block">
          <h1 className="text-4xl font-extrabold text-orange-500 tracking-wide flex items-center justify-left space-x-3 group cursor-pointer">
            <FaUtensils className="transform group-hover:-rotate-12 transition-transform duration-300 ease-in-out" size={32} />
            <span className="group-hover:text-orange-600 transition-colors duration-200">Delish</span>
          </h1>
        </Link>
      </div>

      {/* Navigation Links with enhanced styling */}
      <div className="flex-1 flex flex-col space-y-5">
        <Link href="/home" className={getLinkClass('home')}>
          <FaHome size={22} className="min-w-[22px]" />
          <span>Home</span>
        </Link>
        
        <Link href="/search" className={getLinkClass('search')}>
          <FaSearch size={22} className="min-w-[22px]" />
          <span>Search</span>
        </Link>
        
        <Link href="/favorites" className={getLinkClass('favorites')}>
          <FaHeart size={22} className="min-w-[22px]" />
          <span>Favorites</span>
        </Link>
        
        <Link href="/reviews" className={getLinkClass('reviews')}>
          <FaPen size={22} className="min-w-[22px]" />
          <span>Reviews</span>
        </Link>
        
        <Link href="/shopping" className={getLinkClass('shopping')}>
          <FaShoppingCart size={22} className="min-w-[22px]" />
          <span>Shopping Cart</span>
        </Link>
      </div>

      {/* User Info with better styling */}
      {user && (
        <div className="mt-auto mb-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-orange-50 to-white border border-orange-100">
            <FaUser size={18} className="text-orange-500" />
            <span className="font-medium text-gray-700">{user}</span>
          </div>
        </div>
      )}

      {/* Sign Out Button with improved styling */}
      <div className="mt-2">
        <button
          className="w-full flex items-center space-x-5 p-3 py-3.5 rounded-lg text-red-500 hover:bg-red-100 hover:text-red-600 transition-all duration-200 cursor-pointer group"
          onClick={logout}
        >
          <FaSignOutAlt size={22} className="min-w-[22px] group-hover:rotate-180 transition-transform duration-500" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;