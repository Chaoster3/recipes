'use client';

import React, { useState } from 'react';
import SearchBox from '../components/SearchBox';
import RecipeList from '../components/RecipeList';
import Recipe from '../components/Recipe';
import { useAuth } from '../context/AuthContext';

const SearchClient = ({ initialRecipes }) => {
  const [generatedRecipes, setGeneratedRecipes] = useState(initialRecipes);
  const [shown, setShown] = useState(null);
  const [lastQuery, setLastQuery] = useState('');
  const [error, setError] = useState(!initialRecipes);
  const { user } = useAuth();

  const changeRecipes = (recipes) => {
    setGeneratedRecipes(recipes);
    setError(false);
  };

  return (
    <div className="min-h-screen bg-[#fde7cb]">
      {shown ? (
        <Recipe 
          recipe={shown} 
          username={user} 
          saved={false} 
          hideRecipe={() => setShown(null)}
          onUnfavorited={() => {}} // No-op since search page doesn't need to update favorites
        />
      ) : (
        <div className="flex flex-col items-center">
          <SearchBox setRecipes={changeRecipes} setLastQuery={setLastQuery} startingQuery={lastQuery} />
          
          {error ? (
            <div className="w-full max-w-4xl mx-auto px-6 py-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-2xl mb-6">
                  <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  We're having trouble loading the recipes, likely because we have exceeded our API limit. Please try refreshing the page.
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <RecipeList recipes={generatedRecipes} changeShown={setShown} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchClient;
