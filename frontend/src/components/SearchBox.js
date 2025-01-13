import React, {useState} from 'react';
import { FaSearch } from 'react-icons/fa'

const SearchBox = ({setRecipes}) => {
    const [query, setQuery] = useState('');

    const onSearch = async () => {
        try {
          const response = await fetch(
              `https://api.spoonacular.com/recipes/complexSearch?apiKey=90b0ce1a581040c386e0e9c607554c37&number=6&query=${query}&addRecipeInformation=true&instructionsRequired=true&fillIngredients=true`
          );
          const data = await response.json();
          setRecipes(data);
        }
        catch (error) {
          console.log('Error:', {error});
        }
      }
    
    const onInputChange = (event) => {
        setQuery(event.target.value);
    }

    const onKeyPress = (event) => {
        if (event.key === 'Enter') {
            onSearch();
        }
    }

    return (
        // className = 'bg-white mt-8 p-6 rounded-md shadow-md'
        <div className='m-8'>
            <p className='text-xl font-semibold mb-4 text-white'>Search for Recipes</p>
            <div className='mb-3 flex items-center shadow-lg'>
                <input
                    className='w-96 p-2 rounded-l-md focus:outline-none '
                    onChange={onInputChange}
                    onKeyUp={onKeyPress}
                    type='text'
                    placeholder='Enter dish'
                />
                <button
                    className='w p-3 px-4 bg-blue-500 hover:bg-blue-700 text-white rounded-r-md'
                    onClick={onSearch}
                >
                    <FaSearch className='size-4'/>
                </button>
            </div>
        </div>
    )
}

export default SearchBox;