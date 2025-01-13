import React from 'react';

const RecipeList = ({recipes, changeShown}) => {
    if (recipes.totalResults === 0) {
        return (
            <div className="mt-32 text-white text-lg">
                No recipes found
            </div>
        )
    }
    else {
        return (
            <div className="flex flex-wrap justify-center gap-8 w-full px-20 mb- pb-10">
                {recipes.results.map((recipe) => (
                    <div className="w-72 shadow-2xl bg-white flex flex-col cursor-pointer rounded-lg hover:scale-105 duration-500" onClick={() => changeShown(recipe)}>
                        <img src={recipe.image} alt={recipe.title} className="rounded-t-lg" />
                        <div className="m-2 flex flex-col text-left mx-4 rounded-b-md">
                            <div className="text-xl mb-3 ">{recipe.title}</div>
                            <div>
                                <span className='font-semibold text-sm'>Score:</span>
                                <span className='text-sm mb-0.5'> {Math.round(recipe.spoonacularScore / 2) / 10 } / 5.0</span>
                            </div>
                            <div className='text-sm p-0 flex mb-2'>
                                <span className='font-semibold'>Servings:</span> &nbsp;
                                <span className='self-end'>{recipe.servings}  &nbsp;&nbsp;&nbsp;&nbsp;</span>
                                <span className='font-semibold'>Time:</span> &nbsp;
                                <span className='self-end'>{recipe.readyInMinutes} mins </span>
                            </div>
                            <div className='flex flex-wrap text-sm gap-x-2 mb-2'>
                                {recipe.diets.map((word) => (
                                <span className='mb-1 rounded-lg px-2 bg-blue-300'>{word}</span>
                                ))}
                                {recipe.dishTypes.map((word) => (
                                    <span className='mb-1 rounded-lg px-2 bg-blue-300'>{word}</span>
                                ))}
                                {recipe.cuisines.map((word) => (
                                    <span className='mb-1 rounded-lg px-2 bg-blue-300'>{word}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}
export default RecipeList;