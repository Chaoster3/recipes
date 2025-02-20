import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBox = ({ setRecipes, setLastQuery, startingQuery }) => {
    const [query, setQuery] = useState(startingQuery);

    const onSearch = async () => {
        try {
            const response = await fetch(
                `http://localhost:3001/recipes/search?query=${encodeURIComponent(query)}`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch recipes');
            }
            
            const data = await response.json();
            setRecipes(data);
            setLastQuery(query);
        } catch (error) {
            console.log('Error:', error);
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
        <div className="m-8 justify-items-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Search Recipes</h1>
            <p className="text text-gray-600 mb-6">Discover new dishes for any occasion.</p>
            <div className="mb-10 flex items-center bg-white shadow-md rounded-lg">
                <input
                    className="w-[420px] p-3 text rounded-l-lg focus:outline-none text-gray-700"
                    value={query}
                    onChange={onInputChange}
                    onKeyUp={onKeyPress}
                    type="text"
                    placeholder="Enter dish name"
                />
                <button
                    className="p-4 px-6 bg-orange-500 hover:bg-orange-700 text-white rounded-r-lg transition duration-300"
                    onClick={onSearch}
                >
                    <FaSearch size={19} />
                </button>
            </div>
        </div>
    );
};

export default SearchBox;