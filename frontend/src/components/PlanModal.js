import React, { useState } from 'react';
import { X, Clock, Users } from 'lucide-react';

const PlanModal = ({ addToMealPlan, modalChange, favorites }) => {
    const [selected, setSelected] = useState([]);

    const handleSubmit = () => {
        addToMealPlan(selected[0], selected[1]);
        modalChange(false);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => modalChange(false)}
            />

            {/* Modal */}
            <div className="max-w-7xl w-11/12 bg-white rounded-xl shadow-xl transform transition-all max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex-1" /> {/* Spacer */}
                    <h2 className="text-2xl font-bold text-gray-800">Select a Dish to Add</h2>
                    <div className="flex-1 flex justify-end">
                        <button
                            onClick={() => modalChange(false)}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6 flex-grow">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((recipe) => (
                            <div
                                key={recipe.recipe_id}
                                onClick={() => setSelected([recipe.recipe_id, recipe.title])}
                                className={`group relative bg-white rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer ${
                                    selected[0] === recipe.recipe_id 
                                        ? 'border-orange-500 shadow-orange-100 shadow-lg' 
                                        : 'border-gray-200 hover:border-orange-200 hover:shadow-md'
                                }`}
                            >
                                {/* Image with Gradient Overlay */}
                                <div className="relative h-48">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                    <img
                                        src={recipe.image}
                                        alt={recipe.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    {/* Title */}
                                    <h2 className="text-lg font-semibold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                                        {recipe.title}
                                    </h2>

                                    {/* Recipe Info */}
                                    <div className="flex items-center gap-4 text-gray-600">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4 text-orange-500" />
                                            <span className="text-sm">{recipe.minutes} mins</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Users className="w-4 h-4 text-orange-500" />
                                            <span className="text-sm">{recipe.servings} servings</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Selected Indicator */}
                                {selected[0] === recipe.recipe_id && (
                                    <div className="absolute top-3 right-3 bg-orange-500 text-white p-2 rounded-full shadow-lg z-20">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-center gap-3 px-6 py-4 border-t border-gray-100">
                    <button
                        onClick={handleSubmit}
                        disabled={selected.length === 0}
                        className={`px-6 py-2 text-sm font-medium rounded-lg transition-all ${
                            selected.length > 0
                                ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        Add to Meal Plan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlanModal;