import React, { useState, useEffect } from 'react';
import { Clock, Users, ChefHat, BookOpen } from 'lucide-react';

const FavoritesList = ({ username, changeShown }) => {
    const [favorites, setFavorites] = useState(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await fetch(`http://localhost:3001/favorites/${username}`);
                const data = await response.json();
                setFavorites(data);
            } catch (error) {
                console.error('Error fetching favorites:', error);
            }
        };
        fetchFavorites();
    }, [username]);

    const renderLoadingState = () => (
        <div className="min-h-screen bg-[#fde7cb] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <ChefHat className="w-12 h-12 text-orange-400 animate-bounce" />
                <p className="text-lg text-gray-600">Preparing your recipes...</p>
            </div>
        </div>
    );

    const renderEmptyState = () => (
        <div className="min-h-screen bg-[#fde7cb] flex items-center justify-center">
            <div className="flex flex-col items-center gap-6 max-w-md text-center p-8 mb-64">
                <BookOpen className="w-16 h-16 text-orange-400" />
                <h2 className="text-xl font-semibold text-gray-800">Your Recipe Book is Empty</h2>
                <p className="text-gray-600">
                    Start exploring and save your favorite recipes to build your personal collection.
                </p>
            </div>
        </div>
    );

    const renderFavorites = () => (
        <div className="min-h-screen bg-[#fde7cb] px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Culinary Collection</h1>
                    <p className="text-gray-600 text-md">
                        {favorites.length} saved {favorites.length === 1 ? "recipe" : "recipes"} waiting to be cooked.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((recipe) => (
                        <div
                            key={recipe.recipe_id}
                            onClick={() => changeShown(recipe)}
                            className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                        >
                            <div className="relative h-40">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                <img
                                    src={recipe.image}
                                    alt={recipe.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <h2 className="text font-semibold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                                    {recipe.title}
                                </h2>
                                <div className="flex items-center gap-4 text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5 text-orange-400" />
                                        <span className="text-xs">{recipe.minutes} mins</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="w-3.5 h-3.5 text-orange-400" />
                                        <span className="text-xs">{recipe.servings} servings</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/10 transition-colors duration-300" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (!favorites) return renderLoadingState();
    if (favorites.length === 0) return renderEmptyState();
    return renderFavorites();
};

export default FavoritesList;