import { Users, Timer, Star, ChefHat, Search, Clock, Utensils } from 'lucide-react';

const RecipeList = ({ recipes, changeShown }) => {
    if (!recipes) {
        return (
            <div className="mt-10 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <ChefHat className="w-16 h-16 text-orange-500 animate-bounce" />
                    <p className="text-lg font-medium text-gray-600">Discovering delicious recipes...</p>
                </div>
            </div>
        );
    }

    if (recipes.totalResults === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-6 max-w-md text-center p-8">
                    <Search className="w-20 h-20 text-orange-500" />
                    <h2 className="text-2xl font-semibold text-gray-800">No Recipes Found</h2>
                    <p className="text-gray-600 text-lg">
                        Try adjusting your search terms or explore different ingredients.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-12 mx-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {recipes.results.map((recipe) => (
                    <div
                        key={recipe.id}
                        className="group bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col transform hover:-translate-y-1"
                        onClick={() => changeShown(recipe)}
                    >
                        <div className="relative w-full aspect-video">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
                            <img
                                src={recipe.image.replace(/-\w+\.(jpg|jpeg|png|gif)$/, '-636x393.$1')}
                                alt={recipe.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 right-3 z-20">
                                <div className="flex items-center bg-black/50 backdrop-blur-sm px-2.5 py-1.5 rounded-full">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span className="text-white text-sm ml-1.5 font-medium">
                                        {Math.round(recipe.spoonacularScore / 2) / 10}
                                    </span>
                                </div>
                            </div>
                            <div className="absolute bottom-3 left-3 right-3 z-20">
                                <h3 className="text-xl font-bold text-white mb-1 line-clamp-2 group-hover:text-orange-400 transition-colors">
                                    {recipe.title}
                                </h3>
                            </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col">
                            <div className="flex items-center justify-start gap-4 mb-4">
                                <div className="flex items-center bg-orange-100 px-3 py-1.5 rounded-full">
                                    <Users className="w-4 h-4 text-orange-600" />
                                    <span className="ml-1.5 text-xs font-medium text-orange-900">{recipe.servings} servings</span>
                                </div>
                                <div className="flex items-center bg-orange-100 px-3 py-1.5 rounded-full">
                                    <Clock className="w-4 h-4 text-orange-600" />
                                    <span className="ml-1.5 text-xs font-medium text-orange-900">{recipe.readyInMinutes} minutes</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {[
                                    ...recipe.diets.map(tag => ({ text: tag, type: 'diet' })),
                                    ...recipe.dishTypes.map(tag => ({ text: tag, type: 'dish' })),
                                    ...recipe.cuisines.map(tag => ({ text: tag, type: 'cuisine' }))
                                ].map((tag, index) => {
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
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            </div>
    );
}

export default RecipeList;