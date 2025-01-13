import React, { useState } from 'react';
import PostModal from './PostModal';

const SavedRecipe = ({ recipe, saved, username, hideRecipe }) => {
    const [modal, setModal] = useState(false);
    console.log(recipe.recipe_id)
    const save = async () => {
        try {
            const saveResponse = await fetch('http://localhost:3001/favorites', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    recipe_id: recipe.id,
                    title: recipe.title,
                    image: recipe.image,
                    servings: recipe.servings,
                    minutes: recipe.readyInMinutes,
                    ingredients: recipe.extendedIngredients,
                    instructions: recipe.analyzedInstructions,
                    summary: recipe.summary
                })
            });
            const saving = await saveResponse.json();
            if (saving === "saved to favorites") {
                console.log("Saved to favorites");
            } else {
                console.log("Error saving to favorites");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const remove = async () => {
        try {
            const saveResponse = await fetch('http://localhost:3001/favorites', {
                method: 'delete',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    recipe_id: recipe.recipe_id
                })
            });
            const saving = await saveResponse.json();
            if (saving === "removed from favorites") {
                console.log("Removed From favorites");
            } else {
                console.log("Error removing from favorites");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const post = async (description) => {
        try {
            const postResponse = await fetch('http://localhost:3001/posts', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    recipe_id: recipe.recipe_id,
                    title: recipe.title,
                    image: recipe.image,
                    servings: recipe.servings,
                    minutes: recipe.minutes,
                    ingredients: recipe.ingredients,
                    instructions: recipe.instructions,
                    summary: recipe.summary,
                    description: description
                })
            });
            const posting = await postResponse.json();
            if (posting === "successfully posted") {
                console.log("Successfully posted");
                setModal(false);
            } else {
                console.log("Error posting");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='flex flex-col bg-gray-100 p-4 rounded-lg shadow-md'>
            <button className='mb-4 text-blue-500 hover:underline' onClick={hideRecipe}>
                Close
            </button>
            <div className='flex items-center justify-center bg-white p-4 rounded-md shadow-md'>
                <img src={recipe.image} alt={recipe.title} className='w-24 h-24 object-cover rounded-md mr-4' />
                <div className='flex flex-col'>
                    <p className='text-xl font-bold mb-2'>{recipe.title}</p>
                    <p>Servings: {recipe.servings}</p>
                    <p>Time to Prepare: {recipe.minutes} minutes</p>
                </div>
            </div>
            <div className='mt-4 bg-white p-4 rounded-md shadow-md'>
                <p className='font-bold mb-2'>Instructions:</p>
                <div>
                    {recipe.instructions[0].steps.map((step) => (
                        <div key={step.number} className='mb-2'>
                            <span className='font-bold'>{step.number}.</span> {step.step}
                        </div>
                    ))}
                </div>
                <div className='mt-4'>
                    <p className='font-bold mb-2'>Ingredients:</p>
                    {recipe.ingredients.map((ingredient) => (
                        <div key={ingredient.name} className='flex justify-between mb-2'>
                            <span>{ingredient.name}</span>
                            <span>{ingredient.measures.us.amount} {ingredient.measures.us.unitShort}</span>
                            {/* <span>{ingredient.original}</span> */}
                        </div>
                    ))}
                </div>
            </div>
            <div className='mt-4 flex justify-between'>
                <button className='text-blue-500 hover:underline' onClick={hideRecipe}>
                    Hide
                </button>
                {saved
                    ? <button className='text-red-500 hover:underline' onClick={remove}>
                        Remove from Favorites
                    </button>
                    : <button className='text-green-500 hover:underline' onClick={save}>
                        Add to Favorites
                    </button>
                }
                <button className='text-purple-500 hover:underline' onClick={() => setModal(true)}>
                    Share
                </button>
            </div>
            {modal && <PostModal onPost={post} modalChange={setModal} />}
        </div>
    )
}

export default SavedRecipe;