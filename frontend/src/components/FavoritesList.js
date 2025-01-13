import React, { useState, useEffect } from 'react';

const FavoritesList = ({username, changeShown}) => {
    const [favorites, setFavorites] = useState(null);

    useEffect(() => {
        return async () => {
            try {
                const favResponse = await fetch(`http://localhost:3001/favorites/${username}`);
                const fav = await favResponse.json();
                setFavorites(fav);
            } catch (error) {
                console.log('Error:', error);
            }
        }
    }, [username]);

    if (favorites) {
        if (favorites.length === 0) {
            return (
                <div className="mt-32 text-white text-lg">
                    No saved recipes
                </div>
            )
        }
        else {
            console.log(favorites[0].saved)
            return (
                <div className="flex flex-wrap gap-5 w-2/3 overflow-auto pb-24 p-5">
                    {favorites.map((recipe) => (
                        <div className="flex shadow-xl bg-white cursor-pointer w-full rounded-lg hover:scale-105 duration-500" onClick={() => changeShown(recipe)}>
                            <img src={recipe.image} alt={recipe.title} className="w-72 object-contain border-r rounded-l-lg" />
                            <div className='w-full flex flex-col items-start text-left m-4 ml-10'>
                                <div className="font-semibold mt-3 text-2xl">{recipe.title}</div>
                                <div className="flex text-base flex-grow w-full">
                                    <div className="self-end">{recipe.minutes} minutes</div> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <div className="self-end">{recipe.servings} servings</div>
                                    <div className="ml-auto self-end"> Saved on: {recipe.saved.substring(5, 7)}/{recipe.saved.substring(8, 10)}/{recipe.saved.substr(0,4)} </div>
                                </div>
                            </div>
                        </div> 
                    ))}
                </div>
            );
        }
    } else {
        return (
            <div className="mt-32 text-white text-lg">
                No saved recipes
            </div>
        )
    }
}

export default FavoritesList;

{/* <div className="w-72 shadow-xl bg-white p-2 cursor-pointer rounded-lg" onClick={() => changeShown(recipe)}>
                            <img src={recipe.image} alt={recipe.title} className="" />
                            <div className="m-2">
                                <div className="text-xl flex flex-col font-semibold">{recipe.title}</div>
                            </div>
                        </div> */}