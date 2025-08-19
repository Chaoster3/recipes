'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, ChefHat } from 'lucide-react';
import ShoppingCartComponent from '../components/ShoppingCart';
import { useAuth } from '../context/AuthContext';
import { withClientAuth } from '../context/AuthContext';
import { FaShoppingCart } from 'react-icons/fa';

function ShoppingPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  
  // Fetch shopping items on component mount
  useEffect(() => {
    const fetchShoppingItems = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;

        const res = await fetch(`${baseUrl}/favorites/${user}`, {
          cache: 'no-store'
        });
        
        if (!res.ok) {
          console.error('Failed to fetch shopping items:', res.status);
          setItems([]);
          return;
        }

        const data = await res.json();
        setItems(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching shopping items:', err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShoppingItems();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fde7cb] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl shadow-lg mb-6">
            <ChefHat className="w-10 h-10 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Preparing Your Shopping List</h2>
          <p className="text-gray-600">Gathering ingredients from your favorites...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fde7cb] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-2xl mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">We couldn't load your shopping items. Please try again later.</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#fde7cb]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl shadow-lg mb-6">
            <FaShoppingCart className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">
            Shopping Cart
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your meal plan into an organized shopping list.
          </p>
        </div>
        
        <ShoppingCartComponent initialItems={items} />
      </div>
    </div>
  );
}

export default withClientAuth(ShoppingPage);
