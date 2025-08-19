'use client';

import React, { useState, useEffect } from 'react';
import { ChefHat, Trash, Plus, Minus, CheckCircle2, Printer } from 'lucide-react';
import PlanModal from './PlanModal';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { getCookie } from '../utils/cookies';

const ShoppingCart = () => {
    const [favorites, setFavorites] = useState(null);
    const [modal, setModal] = useState(false);
    const [username, setUsername] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checkedIngredients, setCheckedIngredients] = useState({});
    const { user } = useAuth();

    useEffect(() => {
        // Use the user from AuthContext, fallback to cookie if needed
        const currentUser = user || getCookie('username');
        setUsername(currentUser);
    }, [user]);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!username) return;
            
            try {
                const favResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/favorites/${username}`
                );
                const fav = await favResponse.json();
                setFavorites(fav);
            } catch (error) {
                console.error('Error fetching favorites:', error);
            }
        };
        fetchFavorites();
    }, [username]);

    // Process initial items into cart format
    useEffect(() => {
        // Start with empty cart - no initial items
        setCartItems([]);
        setLoading(false);
    }, []);

    // Handle quantity changes
    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        
        setCartItems(prev => 
            prev.map(item => 
                item.recipe_id === itemId 
                    ? { ...item, quantity: newQuantity } 
                    : item
            )
        );
    };

    // Remove item from cart
    const removeItem = (itemId) => {
        setCartItems(prev => prev.filter(item => item.recipe_id !== itemId));
    };

    // Add recipe to cart
    const addToCart = (recipe_id, title, image, ingredients) => {
        setCartItems((prevItems) => {
            const existingIndex = prevItems.findIndex((item) => item.recipe_id === recipe_id);

            if (existingIndex !== -1) {
                const updatedItems = [...prevItems];
                updatedItems[existingIndex] = {
                    ...updatedItems[existingIndex],
                    quantity: updatedItems[existingIndex].quantity + 1,
                };
                return updatedItems;
            }

            const newItem = { 
                recipe_id, 
                title, 
                image, 
                ingredients: ingredients || [],
                quantity: 1 
            };
            return [...prevItems, newItem];
        });
    };

    // Process ingredients with robust error handling and units
    const processIngredients = () => {
        if (!cartItems || cartItems.length === 0) return [];
        
        const ingredientMap = new Map();
        
        const pluralizeUnit = (unit, amount) => {
            // Return empty string as-is, don't pluralize it
            if (unit === "" || unit === null || unit === undefined) return unit;
            if (amount <= 1) return unit;
            
            const pluralRules = {
                'pound': 'pounds',
                'gram': 'grams',
                'leaf': 'leaves',
                'pinch': 'pinches',
                'bunch': 'bunches',
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

        const pluralizeIngredientName = (name, unit, amount) => {
            if (amount > 1 && 
                !name.toLowerCase().endsWith('s') && 
                (unit === "" || unit === "small" || unit === "medium" || unit === "large")) {
                return name + 's';
            }
            return name;
        };

        cartItems.forEach(item => {
            if (!item.ingredients) return;
            
            try {
                item.ingredients.forEach(ing => {
                    // Handle different possible ingredient formats
                    let ingredientName, amount, unit;
                    
                    if (typeof ing === 'string') {
                        ingredientName = ing;
                        amount = item.quantity;
                        unit = 'unit';
                        
                    } else if (typeof ing === 'object' && ing !== null) {
                        // Handle different ingredient object formats
                        ingredientName = ing.name || ing.ingredient || ing.original || JSON.stringify(ing);
                        
                        // Handle amount and unit from ingredient object
                        if (ing.measures?.us?.amount) {
                            amount = Math.round(ing.measures?.us?.amount * item.quantity * 100) / 100;
                            // Ensure minimum amount of 1 if the calculated amount is too small
                            if (amount < 0.01) amount = item.quantity;
                        } else {
                            amount = item.quantity;
                        }
                        
                        // Get unit from measures or unit property
                        let rawUnit = ing.measures?.us?.unitShort;
                        if (rawUnit === null || rawUnit === undefined) {
                            rawUnit = ing.measures?.metric?.unitShort;
                        }
                        if (rawUnit === null || rawUnit === undefined) {
                            rawUnit = ing.unit;
                        }
                        
                        // Convert to lowercase if we have a unit, otherwise keep as empty string
                        unit = (rawUnit !== null && rawUnit !== undefined) ? rawUnit.toLowerCase() : '';
                        
                        unit = pluralizeUnit(unit, amount);
                    } else {
                        ingredientName = String(ing);
                        amount = item.quantity;
                        unit = 'unit';
                    }
                    
                    const ingredientKey = ingredientName.toLowerCase().trim();
                    const existing = ingredientMap.get(ingredientKey);
                    
                    if (existing) {
                        if (existing.unit.toLowerCase() === unit.toLowerCase()) {
                            const newAmount = Math.round((existing.amount + amount) * 100) / 100;
                            existing.amount = newAmount;
                            existing.unit = pluralizeUnit(unit, newAmount);
                        } else {
                            // Different units, create separate entry
                            ingredientMap.set(`${ingredientKey}-${unit}`, {
                                name: ingredientName,
                                amount,
                                unit,
                            });
                        }
                    } else {
                        ingredientMap.set(ingredientKey, {
                            name: ingredientName,
                            amount,
                            unit,
                        });
                    }
                });
            } catch (error) {
                console.error('Error processing ingredients for item:', item.title, error);
            }
        });
        
        // Convert to array for sorting and rendering
        return Array.from(ingredientMap.values())
            .sort((a, b) => a.name.localeCompare(b.name));
    };
    
    const processedIngredients = processIngredients();

    // Toggle ingredient checked status
    const toggleIngredientChecked = (name) => {
        setCheckedIngredients(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    // Print shopping list
    const printShoppingList = () => {
        window.print();
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh]">
                <ChefHat className="w-16 h-16 text-orange-500 animate-bounce mb-4" />
                <p className="text-xl font-medium text-gray-700">Preparing your shopping list...</p>
            </div>
        );
    }

    return (
        <div className="shopping-cart-container bg-[#fde7cb] min-h-screen px-4 py-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-10 text-center">
                    <p className="text-gray-600 text-lg mb-6">
                        {processedIngredients.length} {processedIngredients.length === 1 ? "ingredient" : "ingredients"} from your recipes
                    </p>
                    
                    {/* Print button */}
                    <button 
                        onClick={printShoppingList}
                        className="print-hide inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <Printer className="w-4 h-4" />
                        <span>Print List</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Cart Summary and Ingredients (full width) */}
                    <div className="w-full">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Selected Recipes</h2>
                        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 p-6">
                            {cartItems.length > 0 ? (
                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <div key={item.recipe_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-center gap-4">
                                                <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.title}
                                                        fill
                                                        className="object-cover"
                                                        sizes="64px"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => updateQuantity(item.recipe_id, item.quantity - 1)}
                                                    className="print-hide w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                
                                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                
                                                <button 
                                                    onClick={() => updateQuantity(item.recipe_id, item.quantity + 1)}
                                                    className="print-hide w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                                
                                                <button 
                                                    onClick={() => removeItem(item.recipe_id)}
                                                    className="print-hide w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <div className="pt-4 border-t border-gray-200">
                                        <button 
                                            onClick={() => setModal(true)}
                                            className="print-hide inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Add More Recipes</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <div className="mb-3 bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                                        <ChefHat className="w-8 h-8 text-orange-500" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No Recipes Selected</h3>
                                    <p className="text-gray-600 mb-4">
                                        Start building your shopping list by selecting recipes from your favorites.
                                    </p>
                                    <button 
                                        onClick={() => setModal(true)}
                                        className="print-hide inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                                    >
                                        <Plus className="w-5 h-5" />
                                        <span>Browse Favorites</span>
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        {/* Ingredients List - Always show */}
                        <div className="mt-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Shopping List</h2>
                            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Ingredients</h3>
                                {processedIngredients.length > 0 ? (
                                    <ul className="space-y-3 print:list-disc print:ml-5">
                                        {processedIngredients.map((ingredient, index) => {
                                            const ingredientKey = `${ingredient.name}-${ingredient.unit}`;
                                            return (
                                                <li key={index} 
                                                    className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors hover:bg-gray-50 cursor-pointer ${
                                                        checkedIngredients[ingredientKey] ? 'bg-green-50 line-through text-gray-400' : ''
                                                    }`}
                                                    onClick={() => toggleIngredientChecked(ingredientKey)}
                                                >
                                                    <button className="flex-shrink-0 w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center bg-white">
                                                        {checkedIngredients[ingredientKey] && 
                                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                        }
                                                    </button>
                                                    
                                                    <div className="flex items-center gap-2 flex-grow">
                                                        <span className="w-8 h-6 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full text-xs flex-shrink-0 font-medium">
                                                            {ingredient.amount}
                                                        </span>
                                                        {ingredient.unit && ingredient.unit !== 'unit' && (
                                                            <span className="text-sm text-gray-500">
                                                                {ingredient.unit}
                                                            </span>
                                                        )}
                                                        <span className="text-gray-700">{ingredient.name}</span>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="mb-4 bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                                            <ChefHat className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500">No ingredients yet. Add recipes to see your shopping list.</p>
                                    </div>
                                )}
                                
                                {processedIngredients.length > 0 && (
                                    <div className="mt-6 pt-4 border-t border-gray-100">
                                        <div className="flex justify-between items-center text-sm text-gray-500">
                                            <span>{processedIngredients.length} ingredients</span>
                                            <button 
                                                onClick={() => setCheckedIngredients({})}
                                                className="print-hide text-orange-500 hover:text-orange-600"
                                            >
                                                Uncheck all
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recipe Selection Modal */}
            {modal && (
                <PlanModal 
                    addToMealPlan={(recipeId) => {
                        const recipe = favorites.find(fav => fav.recipe_id === recipeId);
                        if (recipe) {
                            addToCart(recipe.recipe_id, recipe.title, recipe.image, recipe.ingredients);
                        }
                    }}
                    modalChange={setModal}
                    favorites={favorites || []}
                />
            )}

            {/* Add print-specific styles */}
            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .shopping-cart-container, .shopping-cart-container * {
                        visibility: visible;
                    }
                    .shopping-cart-container {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        background: white;
                        padding: 20px;
                    }
                    .line-through {
                        text-decoration: line-through;
                    }
                    .print-hide {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ShoppingCart;
