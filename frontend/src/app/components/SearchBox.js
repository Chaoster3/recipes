'use client';

import React, { useState } from 'react';
import { FaSearch, FaUtensils } from 'react-icons/fa';

const SearchBox = ({ setRecipes, setLastQuery, startingQuery = "" }) => {
    const [query, setQuery] = useState(startingQuery);
    const [isSearching, setIsSearching] = useState(false);

    const onSearch = async () => {
        if (!query.trim()) return;
        
        setIsSearching(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/recipes/search?query=${encodeURIComponent(query)}&number=9`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch recipes');
            }
            
            const data = await response.json();
            setRecipes(data);
            setLastQuery(query);
        } catch (error) {
            console.log('Error:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const onInputChange = (event) => {
        setQuery(event.target.value);
    };

    const onKeyPress = (event) => {
        if (event.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-6 pt-12 pb-6 text-center">
            {/* Header Section */}
            <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl shadow-lg mb-6 group">
                    <FaSearch size={28} className="text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h1 className="text-4xl font-bold text-black mb-4">
                    Recipe Search
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Explore thousands of recipes from around the world. Find your next favorite dish with our powerful search.
                </p>
            </div>

            {/* Search Input */}
            <div className="relative max-w-2xl mx-auto">
                <div className="relative flex items-center bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                    <input
                        className="flex-1 px-6 py-4 text-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-0 bg-transparent"
                        value={query}
                        onChange={onInputChange}
                        onKeyUp={onKeyPress}
                        type="text"
                        placeholder="Search for recipes, ingredients, or cuisines..."
                    />
                    <button
                        className={`px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white transition-all duration-300 flex items-center gap-2 font-semibold ${isSearching ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}`}
                        onClick={onSearch}
                        disabled={isSearching}
                    >
                        {isSearching ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Searching...</span>
                            </>
                        ) : (
                            <>
                                <FaSearch size={18} />
                                <span>Search</span>
                            </>
                        )}
                    </button>
                </div>
                
                {/* Search suggestions */}
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {['Burger','Curry', 'Soup', 'Chicken','Butter', 'Vegetarian', 'Dessert'].map((suggestion) => (
                        <button
                            key={suggestion}
                            onClick={() => {
                                setQuery(suggestion);
                            }}
                            className="px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-sm font-medium hover:bg-orange-100 transition-colors duration-200 border border-orange-200"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchBox;