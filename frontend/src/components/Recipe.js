import React, {useState, useEffect} from 'react';
import PostModal from './PostModal';

const Recipe = ({recipe, saved, username, hideRecipe}) => {
    const [ready, setReady] = useState(recipe.minutes != null);
    const [modal, setModal] = useState(false);
    
    useEffect(() => {
        return async () => {
            if (!recipe.minutes) {
                recipe.minutes = recipe.readyInMinutes;
                recipe.ingredients = recipe.extendedIngredients;
                recipe.instructions = recipe.analyzedInstructions;
                setReady(true);
            }
        };
    }, [recipe, recipe]);

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
                    summary: recipe.summary,
                    saved: new Date()
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

    const post = async (description) => {
        try {
            const postResponse = await fetch('http://localhost:3001/posts', {
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
            console.log(error)
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
    
    if (ready) {
        console.log(recipe);
        return (
            <div className='flex flex-col bg-gray-100 p-4 rounded-lg shadow-md m-6 pt-1.5'>
                <div className='flex justify-between mb-1'>
                    <div>
                        {saved ? (
                        <button className='border rounded-lg p-1.5 mb-1 text-sm bg-white mr-4 hover:bg-red-400 hover:text-white' onClick={remove}>
                            Remove from Favorites
                        </button>
                        ) : (
                        <button className='border rounded-lg p-1.5 mb-1 text-sm bg-white mr-4 hover:bg-red-400 hover:text-white' onClick={save}>
                            Add to Favorites
                        </button>
                        )}
                        <button className='border rounded-lg p-1.5 w-32 mb-1 text-sm bg-white hover:bg-blue-400 hover:text-white' onClick={() => setModal(true)}>
                            Post a Review
                        </button>
                    </div>
                    <button className=' border rounded-lg p-1.5 w-20 mb-1 text-sm bg-white hover:bg-gray-400 hover:text-white' onClick={hideRecipe}>
                        Close
                    </button>
                </div>
                <div className='bg-white p-4 rounded-md shadow-md'>
                    <h1 className='text-3xl font-bold pb-4 mb-4 border-b'>{recipe.title}</h1>
                    <div className='flex flex-row gap-8'>
                        <div className='basis-2/5 flex flex-col mx-10'>
                            <img
                                src={recipe.image}
                                alt={recipe.title}
                                className='w-full object-cover rounded mb-4 '
                            />
                            <p className='text-sm mb-8'>
                                <span className='font-bold'>Servings:</span> {recipe.servings} &nbsp;&nbsp;
                                <span className='font-bold'>Time to Prepare:</span> {recipe.minutes} mins
                            </p>
                            <div className='text-left p-4 bg-gray-50'>
                                <h2 className='text-xl font-bold mb-4 text-center'>Ingredients:</h2>
                                {recipe.ingredients.map((ingredient) => (
                                    <li className='text-sm mb-2'>{ingredient.original}</li>
                                ))}
                            </div>
                        </div>
                        <div className='mt-0 text-left mx-10 basis-3/5 '>
                            <div className='text-sm mb-8 p-4 bg-blue-50' dangerouslySetInnerHTML={{ __html: recipe.summary }}>
                            </div>
                            <div className='bg-orange-50 p-4'>
                                <h2 className='text-xl text-center font-bold mb-2 mt-0'>Instructions:</h2>
                                {recipe.instructions[0].steps.map((step) => (
                                    <div key={step.number} className='mb-4'>
                                        <div className='font-bold'> Step {step.number}</div> {step.step}
                                    </div>
                            ))}
                            </div>
                        </div>
                    </div>
                </div>
                {modal && <PostModal onPost={post} modalChange={setModal} />}
            </div>
        )
    } else {
        return(
            <div className='text-white mt-40 text-2xl'>Loading...</div>
        )
    }
}

export default Recipe;