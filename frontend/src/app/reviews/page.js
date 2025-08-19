'use client';

import { useState, useEffect, Suspense } from 'react';
import { BookOpen, ChefHat } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReviewsList from '../components/ReviewsList';
import Recipe from '../components/Recipe';
import { useAuth } from '../context/AuthContext';
import { FaPen } from 'react-icons/fa';

function ReviewsPageContent() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const recipeId = searchParams.get('recipe');
  
  // Fetch reviews on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;

        const res = await fetch(`${baseUrl}/reviews?username=${user || ''}`, {
          cache: 'no-store'
        });

        if (!res.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const data = await res.json();
        setReviews(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user]);
  
  // Find the selected recipe if recipeId is present
  const shownRecipe = recipeId 
    ? reviews.find(review => review.recipe_id.toString() === recipeId)
    : null;
  
  // Update URL when showing a recipe
  const handleShowRecipe = (recipe) => {
    router.push(`/reviews?recipe=${recipe.recipe_id}`, { scroll: false });
  };
  
  // Remove recipe parameter when hiding
  const handleHideRecipe = () => {
    router.push('/reviews', { scroll: false });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fde7cb] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl shadow-lg mb-6">
            <ChefHat className="w-10 h-10 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Community Reviews</h2>
          <p className="text-gray-600">Discovering culinary insights...</p>
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
          <p className="text-gray-600 mb-6">We couldn't load the reviews. Please try again later.</p>
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
          onUnfavorited={() => {}} // No-op since reviews page doesn't need to update favorites
        />
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Enhanced Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl shadow-lg mb-6">
              <FaPen className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-black mb-4">
              Latest Community Reviews
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover what others are cooking and sharing. Get inspired by real experiences from our culinary community.
            </p>
          </div>
          
          <ReviewsList 
            initialReviews={reviews} 
            changeShown={handleShowRecipe}
          />
        </div>
      )}
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fde7cb] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl shadow-lg mb-6">
            <ChefHat className="w-10 h-10 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Community Reviews</h2>
          <p className="text-gray-600">Discovering culinary insights...</p>
        </div>
      </div>
    }>
      <ReviewsPageContent />
    </Suspense>
  );
}