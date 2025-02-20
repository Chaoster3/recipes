import React, { useState, useEffect } from 'react';
import SearchBox from '../components/SearchBox';
import RecipeList from '../components/RecipeList';
import Recipe from '../components/Recipe';

const Search = ({ username }) => {
  const [generatedRecipes, setGeneratedRecipes] = useState(null);
  const [shown, setShown] = useState(null);
  const [lastQuery, setLastQuery] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const recommendedResponse = await fetch(
          `http://localhost:3001/recipes/random`
        );

        if (!recommendedResponse.ok) {
          throw new Error('Failed to fetch recipes');
        }

        const recommended = await recommendedResponse.json();
        setGeneratedRecipes(recommended);
        setError(false);
      } catch (error) {
        console.log('Error:', error);
        setError(true);
      }
    };

    fetchRecipes();
  }, []);

  const changeRecipes = (recipes) => {
    setGeneratedRecipes(recipes);
  };

  return (
    <div className="flex flex-col items-center bg-[#fde7cb]">
      {shown ? (
        <Recipe recipe={shown} username={username} saved={false} hideRecipe={() => setShown(null)} />
      ) : (
        <>
          <SearchBox setRecipes={changeRecipes} setLastQuery={setLastQuery} startingQuery={lastQuery} />
          {error ? (
            <div className="mt-10 flex items-center justify-center">
              <div className="flex flex-col items-center gap-6 max-w-md text-center p-8">
                <h2 className="text-2xl font-semibold text-gray-800">Oops! Something went wrong</h2>
                <p className="text-gray-600">
                  We're having trouble loading the recipes. Please try again later.
                </p>
              </div>
            </div>
          ) : (
            <RecipeList recipes={generatedRecipes} changeShown={setShown} />
          )}
        </>
      )}
    </div>
  );
};

export default Search;
