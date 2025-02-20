import React from 'react';
import { Users, Timer, Star, ChefHat, Search } from 'lucide-react';

const RecipeList = ({ recipes, changeShown }) => {
    if (!recipes) {
        return (
            <div className="mt-10 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <ChefHat className="w-12 h-12 text-orange-400 animate-bounce" />
                    <p className="text-lg text-gray-600">Discovering delicious recipes...</p>
                </div>
            </div>
        );
    }

    if (recipes.totalResults === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-6 max-w-md text-center p-8">
                    <Search className="w-16 h-16 text-orange-400" />
                    <h2 className="text-2xl font-semibold text-gray-800">No Recipes Found</h2>
                    <p className="text-gray-600">
                        Try adjusting your search terms or explore different ingredients.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recipes.results.map((recipe) => (
                    <div
                        key={recipe.id}
                        className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden border border-gray-100"
                        onClick={() => changeShown(recipe)}
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                            <img
                                src={recipe.image}
                                alt={recipe.title}
                                className="w-full h-72 object-cover"
                            />
                            <div className="absolute top-3 right-3 backdrop-blur-md bg-white/90 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 shadow-lg z-20">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="text-gray-800">{Math.round(recipe.spoonacularScore / 2) / 10}</span>
                            </div>
                        </div>

                        <div className="p-7">
                            <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                                {recipe.title}
                            </h3>

                            <div className="flex items-center text-sm text-gray-600 mb-4 space-x-6">
                                <div className="flex items-center bg-orange-50 px-3 py-1.5 rounded-full">
                                    <Users className="w-4 h-4 mr-1.5 text-orange-500" />
                                    <span className="font-medium">{recipe.servings}</span>
                                </div>
                                <div className="flex items-center bg-orange-50 px-3 py-1.5 rounded-full">
                                    <Timer className="w-4 h-4 mr-1.5 text-orange-500" />
                                    <span className="font-medium">{recipe.readyInMinutes}m</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {recipe.diets.map((diet, index) => (
                                    <span
                                        key={`diet-${index}`}
                                        className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full ring-1 ring-green-200"
                                    >
                                        {diet}
                                    </span>
                                ))}
                                {recipe.dishTypes.map((type, index) => (
                                    <span
                                        key={`type-${index}`}
                                        className="px-3 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full ring-1 ring-purple-200"
                                    >
                                        {type}
                                    </span>
                                ))}
                                {recipe.cuisines.map((cuisine, index) => (
                                    <span
                                        key={`cuisine-${index}`}
                                        className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full ring-1 ring-blue-200"
                                    >
                                        {cuisine}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecipeList;