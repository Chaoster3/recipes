import React, { useState, useEffect } from 'react';
import { X, Clock, Users, Star, Share2 } from 'lucide-react';
import PostModal from './PostModal';

const Recipe = ({ recipe, saved, username, hideRecipe }) => {
    const [ready, setReady] = useState(recipe.minutes != null);
    const [modal, setModal] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    console.log(recipe);
    useEffect(() => {
        if (!recipe.minutes) {
            recipe.recipe_id = recipe.id;
            recipe.minutes = recipe.readyInMinutes;
            recipe.ingredients = recipe.extendedIngredients;
            recipe.instructions = recipe.analyzedInstructions;
            setReady(true);
        }

        // Check if recipe is favorited
        const checkFavoriteStatus = async () => {
            try {
                const response = await fetch(`http://localhost:3001/favorites/check/${username}/${recipe.recipe_id}`);
                const data = await response.json();
                setIsSaved(data.isFavorited);
            } catch (error) {
                console.log(error);
            }
        };

        if (username) {
            checkFavoriteStatus();
        }
    }, [recipe, username]);

    const save = async () => {
        console.log(JSON.stringify({
            username: username,
            recipe_id: recipe.id,
            title: recipe.title,
            image: recipe.image,
            servings: recipe.servings,
            minutes: recipe.readyInMinutes,
            ingredients: recipe.extendedIngredients,
            instructions: recipe.analyzedInstructions,
            summary: recipe.summary,
        }));
        try {
            const saveResponse = await fetch('http://localhost:3001/favorites', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    recipe_id: recipe.recipe_id,
                    title: recipe.title,
                    image: recipe.image,
                    servings: recipe.servings,
                    minutes: recipe.minutes,
                    ingredients: JSON.stringify(recipe.ingredients),
                    instructions: JSON.stringify(recipe.instructions),
                    summary: recipe.summary,
                }),
            });
            const saving = await saveResponse.json();
            if (saving === 'saved to favorites') {
                console.log('Saved to favorites');
                setIsSaved(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const post = async (review) => {
        try {
            const postResponse = await fetch('http://localhost:3001/reviews', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    recipe_id: recipe.recipe_id,
                    title: recipe.title,
                    image: recipe.image,
                    servings: recipe.servings,
                    minutes: recipe.minutes,
                    ingredients: JSON.stringify(recipe.ingredients),
                    instructions: JSON.stringify(recipe.instructions),
                    summary: recipe.summary,
                    review: review
                }),
            });
            const posting = await postResponse.json();
            if (posting === 'successfully posted') {
                setModal(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const remove = async () => {
        try {
            const saveResponse = await fetch('http://localhost:3001/favorites', {
                method: 'delete',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    recipe_id: recipe.recipe_id,
                }),
            });
            const saving = await saveResponse.json();
            if (saving === 'removed from favorites') {
                console.log('Removed From favorites');
                setIsSaved(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (!ready) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-pulse text-lg text-gray-600">Loading recipe...</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-4xl mx-auto">
            {/* Header Section - same as before */}
            <div className="relative">
                <img
                    src={recipe.image.replace(/-\w+\.(jpg|jpeg|png|gif)$/, '-636x393.$1')}
                    alt={recipe.title}
                    className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="absolute bottom-0 p-6 w-full">
                        <h1 className="text-4xl font-bold text-white mb-4">{recipe.title}</h1>
                        <div className="flex gap-4 text-white/90">
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">{recipe.minutes} mins</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span className="text-sm">{recipe.servings} servings</span>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    onClick={hideRecipe}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                >
                    <X className="w-5 h-5 text-gray-700" />
                </button>
            </div>

            {/* Content Section */}
            <div className="p-8">
                {/* Updated Quick Actions with smaller buttons */}
                <div className="flex justify-end gap-3 mb-8">
                    {isSaved ? (
                        <button
                            onClick={remove}
                            className="flex items-center gap-1.5 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm"
                        >
                            <Star className="w-4 h-4" />
                            Remove Favorite
                        </button>
                    ) : (
                        <button
                            onClick={save}
                            className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                        >
                            <Star className="w-4 h-4" />
                            Add Favorite
                        </button>
                    )}
                    <button
                        onClick={() => setModal(true)}
                        className="flex items-center gap-1.5 bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors text-sm"
                    >
                        <Share2 className="w-4 h-4" />
                        Review
                    </button>
                </div>

                {/* Rest of the content remains the same */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">About this Recipe</h2>
                    <div className="prose prose-sm max-w-none text-gray-600">
                        <p dangerouslySetInnerHTML={{ __html: recipe.summary }} />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-orange-50/50 rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Ingredients</h2>
                        <ul className="space-y-3">
                            {recipe.ingredients.map((ingredient, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                                    <span className="text-gray-700 text-sm">{ingredient.original}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-blue-50/50 rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Instructions</h2>
                        <ol className="space-y-4">
                            {recipe.instructions[0]?.steps.map((step) => (
                                <li key={step.number} className="flex gap-4">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                                        {step.number}
                                    </span>
                                    <p className="text-sm text-gray-700 mt-0.5">{step.step}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>

            {modal && <PostModal onPost={post} modalChange={setModal} />}
        </div>
    );
};

export default Recipe;