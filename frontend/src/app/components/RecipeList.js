'use client';

import { Users, Star, ChefHat, Search, Clock } from 'lucide-react';
import Image from 'next/image';

const RecipeList = ({ recipes, changeShown }) => {
    if (!recipes) {
        return (
            <div className="w-full max-w-7xl mx-auto px-6 py-12">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl shadow-lg mb-6">
                        <ChefHat className="w-10 h-10 text-white animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Discovering Delicious Recipes</h2>
                    <p className="text-gray-600">Loading amazing culinary creations for you...</p>
                </div>
            </div>
        );
    }

    if (recipes.totalResults === 0) {
        return (
            <div className="w-full max-w-4xl mx-auto px-6 py-12">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-2xl mb-6">
                        <Search className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No Recipes Found</h2>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Try adjusting your search terms. Sometimes the best recipes are just a different keyword away!
                    </p>
                </div>
            </div>
        );
    }

    const displayedCount = recipes.results.length;
    const totalCount = recipes.totalResults;

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-8">
            {/* Results Header */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {totalCount > displayedCount ? (
                        <>Showing {displayedCount} of {totalCount.toLocaleString()} Recipe{totalCount !== 1 ? 's' : ''} Found</>
                    ) : (
                        <>{totalCount} Recipe{totalCount !== 1 ? 's' : ''} Found</>
                    )}
                </h2>
                <p className="text-gray-600">
                    {totalCount > displayedCount ? (
                        <>Discover your next favorite dish from our curated selection</>
                    ) : (
                        <>Discover your next favorite dish from our curated collection</>
                    )}
                </p>
            </div>

            {/* Recipe Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recipes.results.map((recipe) => (
                    <div
                        key={recipe.id}
                        className="group card cursor-pointer overflow-hidden transform hover:-translate-y-2 transition-all duration-300"
                        onClick={() => changeShown(recipe)}
                    >
                        <div className="relative w-full aspect-video overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
                            <Image
                                src={recipe.image.replace(/-\w+\.(jpg|jpeg|png|gif)$/, '-636x393.$1')}
                                alt={recipe.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute top-4 right-4 z-20">
                                <div className="flex items-center bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span className="text-white text-sm ml-2 font-medium">
                                        {Math.round(recipe.spoonacularScore / 2) / 10}
                                    </span>
                                </div>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 z-20">
                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-orange-300 transition-colors">
                                    {recipe.title}
                                </h3>
                            </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center justify-start gap-3 mb-4">
                                <div className="flex items-center bg-orange-100 px-3 py-1.5 rounded-full">
                                    <Users className="w-4 h-4 text-orange-600" />
                                    <span className="ml-1.5 text-xs font-medium text-orange-900">{recipe.servings} servings</span>
                                </div>
                                <div className="flex items-center bg-orange-100 px-3 py-1.5 rounded-full">
                                    <Clock className="w-4 h-4 text-orange-600" />
                                    <span className="ml-1.5 text-xs font-medium text-orange-900">{recipe.readyInMinutes} minutes</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-auto">
                                {[
                                    ...recipe.diets.map(tag => ({ text: tag, type: 'diet' })),
                                    ...recipe.dishTypes.map(tag => ({ text: tag, type: 'dish' })),
                                    ...recipe.cuisines.map(tag => ({ text: tag, type: 'cuisine' }))
                                ].slice(0, 6).map((tag, index) => {
                                    const styles = {
                                        diet: 'bg-emerald-50 text-emerald-700 ring-emerald-200/50',
                                        dish: 'bg-violet-50 text-violet-700 ring-violet-200/50', 
                                        cuisine: 'bg-sky-50 text-sky-700 ring-sky-200/50'
                                    };
                                    
                                    return (
                                        <span
                                            key={`${tag.type}-${index}`}
                                            className={`px-2 py-1 text-xs font-medium rounded-full ring-1 ${styles[tag.type]}`}
                                        >
                                            {tag.text}
                                        </span>
                                    );
                                })}
                                {[
                                    ...recipe.diets.map(tag => ({ text: tag, type: 'diet' })),
                                    ...recipe.dishTypes.map(tag => ({ text: tag, type: 'dish' })),
                                    ...recipe.cuisines.map(tag => ({ text: tag, type: 'cuisine' }))
                                ].length > 6 && (
                                    <span className="px-2 py-1 text-xs font-medium rounded-full ring-1 bg-gray-50 text-gray-700 ring-gray-200/50">
                                        +{[
                                            ...recipe.diets.map(tag => ({ text: tag, type: 'diet' })),
                                            ...recipe.dishTypes.map(tag => ({ text: tag, type: 'dish' })),
                                            ...recipe.cuisines.map(tag => ({ text: tag, type: 'cuisine' }))
                                        ].length - 6} more
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecipeList;