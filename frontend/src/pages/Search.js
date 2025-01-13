import React, {useState, useEffect} from 'react';
import SearchBox from '../components/SearchBox';
import RecipeList from '../components/RecipeList';
import Recipe from '../components/Recipe';


const Search = ({username}) => {
    const [generatedRecipes, setGeneratedRecipes] = useState(null);
    const [recommendedRecipes, setRecommendedRecipes] = useState(null);
    const [shown, setShown] = useState(null);

  useEffect(() => {
    return async () => {
        try {
          const recommendedResponse = await fetch(
            `https://api.spoonacular.com/recipes/random?number=2&apiKey=90b0ce1a581040c386e0e9c607554c37&includeNutrition=false`
          );
          const recommended = await recommendedResponse.json();
          recommended['results'] = recommended['recipes']
          delete recommended['recipes']
          setRecommendedRecipes(recommended);
          } catch (error) {
          console.log('Error:', error);
        }
    };
  }, []);

  const changeRecipes = (recipes) => {
    setGeneratedRecipes(recipes)
  }

  if (generatedRecipes) {
    if (shown) {
        return (
          <div className='flex flex-col items-center h-full'>
            <Recipe recipe={shown} username={username} saved={false} hideRecipe={() => setShown(null)}/>
          </div>
        )
    } else {
      return (
        <div className='flex flex-col items-center flex-grow overflow-hidden'>
          <SearchBox setRecipes={changeRecipes}/>
          <RecipeList recipes={generatedRecipes} changeShown={setShown}/>
        </div>
      )
    }
  } else {
    if (recommendedRecipes) {
      if (shown) {
        return (
          <div className='flex flex-col items-center h-full'>
            <Recipe recipe={shown} username={username} saved={false} hideRecipe={() => setShown(null)} />
          </div>
        )
      } else {
      return (
      <div className='flex flex-col items-center h-'>
        <SearchBox setRecipes={changeRecipes} />
        <div className="text-xl mb-6 text-white">Recommended Recipes</div>
        <RecipeList recipes={recommendedRecipes} changeShown={setShown} />
      </div>
      )
    }
    } else {
      return (
        <div className='flex flex-col items-center h-'>
          <SearchBox setRecipes={changeRecipes} />
          <div className="">Loading</div>
        </div>
      )
    }
  }
}

export default Search;