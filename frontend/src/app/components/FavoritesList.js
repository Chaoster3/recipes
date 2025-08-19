import { Clock, Users, ChefHat, BookOpen } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const FavoritesList = ({ initialFavorites, changeShown }) => {
    const [favorites, setFavorites] = useState(initialFavorites);

    if (!initialFavorites) {
        return (
            <div className="flex flex-col items-center gap-4 mt-60">
                <ChefHat className="w-16 h-16 text-orange-500 animate-bounce" />
                <p className="text-xl font-medium text-gray-700">Preparing your recipes...</p>
            </div>
        );
    }

    if (initialFavorites.length === 0) {
        return (
            <div className="min-h-[60vh] bg-[#fde7cb] flex items-start justify-center px-4 pt-8">
                <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
                    <div className="mb-6 bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                        <BookOpen className="w-10 h-10 text-orange-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Your Recipe Book is Empty</h2>
                    <p className="text-gray-600 mb-6">
                        Start exploring and save your favorite recipes to build your personal collection.
                    </p>
                    <div className="flex flex-col gap-2 text-sm text-gray-500 mb-6">
                        <p>• Search for recipes you love</p>
                        <p>• Click the heart icon to save them</p>
                        <p>• They'll appear here for easy access</p>
                    </div>
                    <button 
                        onClick={() => window.location.href = '/search'}
                        className="inline-flex items-center justify-center bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                    >
                        Start Exploring Recipes
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fde7cb] px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 text-center">
                    <p className="text-gray-600 text-lg">
                        {initialFavorites.length} saved {initialFavorites.length === 1 ? "recipe" : "recipes"} waiting to be cooked.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((favorite) => (
                        <article 
                            key={favorite.recipe_id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
                            onClick={() => changeShown(favorite)}
                        >
                            <div className="relative h-40">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                <Image
                                    src={favorite.image}
                                    alt={favorite.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                            <div className="p-4">
                                <h2 className="text font-semibold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                                    {favorite.title}
                                </h2>
                                <div className="flex items-center gap-4 text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5 text-orange-400" />
                                        <span className="text-xs">{favorite.minutes} mins</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="w-3.5 h-3.5 text-orange-400" />
                                        <span className="text-xs">{favorite.servings} servings</span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FavoritesList;