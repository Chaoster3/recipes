import React, { useState } from 'react';
import FavoritesList from '../components/FavoritesList';
import Recipe from '../components/Recipe';

const Favorites = ({ username }) => {
    const[shown, setShown] = useState(null);

    if (shown) {
        return (
            <Recipe recipe={shown} saved={true} username={username} hideRecipe={() => setShown(null)} />
        );
    } else {
        return (
            <div className="w-full h-full flex flex-col items-center overflow-hidden">
                <div className="text-2xl text-black font-semibold m-8 w-24">Favorites</div>
                <FavoritesList username={username} changeShown={setShown}/>
            </div>
        )
    }
}

export default Favorites;