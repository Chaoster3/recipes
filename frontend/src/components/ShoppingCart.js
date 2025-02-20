import React, { useState, useEffect } from 'react';
import { PlusCircle, MinusCircle, X, ChefHat } from 'lucide-react';
import PlanModal from './PlanModal';

const ShoppingCart = ({ username }) => {
    const [favorites, setFavorites] = useState(null);
    const [mealPlan, setMealPlan] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [modal, setModal] = useState(false);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const favResponse = await fetch(`http://localhost:3001/favorites/${username}`);
                const fav = await favResponse.json();
                setFavorites(fav);
            } catch (error) {
                console.log('Error:', error);
            }
        };
        fetchFavorites();
    }, [username]);

    useEffect(() => {
        if (mealPlan.length === 0 || !favorites) {
            setIngredients([]);
            return;
        }

        const ingredientMap = new Map();

        const pluralizeUnit = (unit, amount) => {
            if (amount <= 1) return unit;
            
            const pluralRules = {
                'pound': 'pounds',
                'gram': 'grams',
                'leaf': 'leaves',
                'pinch': 'pinches',
                'loaf': 'loaves',
                'oz': 'oz',
                'small': 'small',
                'medium': 'medium',
                'large': 'large',
                
            };

            if (pluralRules[unit]) return pluralRules[unit];
            if (unit.endsWith('s')) return unit;
            return unit + 's';
        };

        mealPlan.forEach((recipe) => {
            const fullRecipe = favorites.find((fav) => fav.recipe_id === recipe.recipe_id);
            if (!fullRecipe) return;

            fullRecipe.ingredients.forEach((ingredient) => {
                const ingredientKey = ingredient.name.toLowerCase();
                const existing = ingredientMap.get(ingredientKey);

                const amount = Math.round(ingredient.amount * recipe.quantity * 100) / 100;
                let unit = (
                    (ingredient.measures?.us?.unitShort || 
                    ingredient.measures?.metric?.unitShort || ingredient.unit || 
                    'unit')).toLowerCase();

                unit = pluralizeUnit(unit, amount);

                if (existing) {
                    if (existing.unit.toLowerCase() === unit.toLowerCase()) {
                        const newAmount = Math.round((existing.amount + amount) * 100) / 100;
                        existing.amount = newAmount;
                        existing.unit = pluralizeUnit(unit, newAmount);
                    } else {
                        ingredientMap.set(`${ingredientKey}-${unit}`, {
                            name: ingredient.name,
                            amount,
                            unit,
                        });
                    }
                } else {
                    ingredientMap.set(ingredientKey, {
                        name: ingredient.name,
                        amount,
                        unit,
                    });
                }
            });
        });

        setIngredients(Array.from(ingredientMap.values()));
    }, [mealPlan, favorites]);

    if (!favorites) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-2xl shadow-lg">
                    <ChefHat className="w-16 h-16 text-orange-500 animate-bounce" />
                    <p className="text-xl font-medium text-gray-700">Preparing your cart...</p>
                </div>
            </div>
        );
    }

    const addToMealPlan = (recipe_id, title) => {
        setMealPlan((prevPlan) => {
            const existingIndex = prevPlan.findIndex((item) => item.recipe_id === recipe_id);

            if (existingIndex !== -1) {
                const updatedPlan = [...prevPlan];
                updatedPlan[existingIndex] = {
                    ...updatedPlan[existingIndex],
                    quantity: updatedPlan[existingIndex].quantity + 1,
                };
                return updatedPlan;
            }

            return [...prevPlan, { recipe_id, title, quantity: 1 }];
        });
    };

    const removeFromMealPlan = (recipe_id) => {
        setMealPlan((prevPlan) => prevPlan.filter((item) => item.recipe_id !== recipe_id));
    };

    const incrementQuantity = (recipe_id) => {
        setMealPlan((prevPlan) =>
            prevPlan.map((item) =>
                item.recipe_id === recipe_id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decrementQuantity = (recipe_id) => {
        setMealPlan((prevPlan) =>
            prevPlan
                .map((item) =>
                    item.recipe_id === recipe_id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    return (
        <div className="w-full px-8 py-12">
            {modal && <PlanModal addToMealPlan={addToMealPlan} modalChange={setModal} favorites={favorites} />}
            
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Shopping Cart Tool</h1>
                    <p className="text-gray-600">
                        Plan your meals and generate a shopping list
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 justify-center">
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Your Meal Plan</h2>
                            
                            <div className="space-y-3">
                                {mealPlan.map((recipe) => (
                                    <div 
                                        key={recipe.recipe_id} 
                                        className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-1 text-center">{recipe.title}</h3>
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-medium text-orange-600 bg-white px-3 py-1 rounded-full shadow-sm">
                                                {recipe.quantity} {recipe.quantity === 1 ? 'serving' : 'servings'}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={() => decrementQuantity(recipe.recipe_id)}
                                                    className="p-1.5 bg-white text-orange-600 rounded-full hover:bg-orange-50 transition-colors shadow-sm"
                                                >
                                                    <MinusCircle className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => incrementQuantity(recipe.recipe_id)}
                                                    className="p-1.5 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors shadow-sm"
                                                >
                                                    <PlusCircle className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => removeFromMealPlan(recipe.recipe_id)}
                                                    className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setModal(true)}
                                className="mt-4 w-full p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-md hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <PlusCircle className="w-5 h-5" />
                                Add Recipe to Plan
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Shopping List</h2>
                            
                            {mealPlan.length > 0 ? (
                                <div className="grid gap-3">
                                    {ingredients.map((ingredient) => (
                                        <div 
                                            key={ingredient.name} 
                                            className="flex justify-between items-center p-3 bg-orange-50 rounded-xl border border-orange-200"
                                        >
                                            <span className="text-gray-800 font-medium truncate mr-4">{ingredient.name}</span>
                                            <span className="text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm border border-orange-200 whitespace-nowrap">
                                                {ingredient.amount} {ingredient.unit}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-orange-50 rounded-xl border border-orange-200">
                                    <ChefHat className="w-12 h-12 text-orange-400 mx-auto mb-3" />
                                    <p className="text-gray-600 text-lg">No dishes added to the meal plan yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;
