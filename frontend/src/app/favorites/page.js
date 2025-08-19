'use client';

import { useState, useEffect, Suspense } from 'react';
import { Heart, ChefHat } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import FavoritesList from '../components/FavoritesList';
import Recipe from '../components/Recipe';
import { useAuth } from '../context/AuthContext';
import { withClientAuth } from '../context/AuthContext';
import { FaHeart } from 'react-icons/fa';

function FavoritesPageContent() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const recipeId = searchParams.get('recipe');
  
  // Fetch favorites on component mount
  useEffect(() => {
    const fetchFavorites = async () => {
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
        console.log(user);

        if (!res.ok) {
          throw new Error('Failed to fetch favorites');
        }

        const data = await res.json();
        setFavorites(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);
  
  // Find selected recipe
  const shownRecipe = currentRecipe || (recipeId 
    ? favorites.find(favorite => favorite.recipe_id.toString() === recipeId)
    : null);
  
  const handleShowRecipe = (recipe) => {
    setCurrentRecipe(recipe);
    router.push(`/favorites?recipe=${recipe.recipe_id}`, { scroll: false });
  };
  
  const handleHideRecipe = () => {
    setCurrentRecipe(null);
    router.push('/favorites', { scroll: false });
  };

  const handleRecipeUnfavorited = (unfavoritedRecipeId) => {
    setFavorites(prevFavorites =>
      prevFavorites.filter(favorite => favorite.recipe_id.toString() !== unfavoritedRecipeId.toString())
    );
    // Don't close the recipe - keep it open for viewing
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fde7cb] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl shadow-lg mb-6">
            <ChefHat className="w-10 h-10 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Your Favorites</h2>
          <p className="text-gray-600">Gathering your culinary collection...</p>
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
          <p className="text-gray-600 mb-6">We couldn't load your favorites. Please try again later.</p>
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
      {shownRecipe ? (
        <Recipe 
          recipe={shownRecipe} 
          saved={true} 
          hideRecipe={handleHideRecipe}
          onUnfavorited={handleRecipeUnfavorited}
        />
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Enhanced Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl shadow-lg mb-6">
              <FaHeart className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-black mb-4">
              My Favorites
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your personal collection of beloved recipes, carefully curated and ready to inspire your next culinary adventure.
            </p>
          </div>
          
          <FavoritesList 
            initialFavorites={favorites} 
            changeShown={handleShowRecipe}
          />
        </div>
      )}
    </div>
  );
}

function FavoritesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fde7cb] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl shadow-lg mb-6">
            <ChefHat className="w-10 h-10 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Your Favorites</h2>
          <p className="text-gray-600">Gathering your culinary collection...</p>
        </div>
      </div>
    }>
      <FavoritesPageContent />
    </Suspense>
  );
}

export default withClientAuth(FavoritesPage);
