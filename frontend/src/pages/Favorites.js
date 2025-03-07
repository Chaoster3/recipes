import React, { useState } from 'react';
import FavoritesList from '../components/FavoritesList';
import Recipe from '../components/Recipe';

const Favorites = ({ username }) => {
    const [shown, setShown] = useState(null);
    console.log(shown);

    if (shown) {
        return (
            <Recipe recipe={shown} saved={true} username={username} hideRecipe={() => setShown(null)} />
        );
    } else {
        return (
            <div className="w-full h-full flex flex-col items-center overflow-y-auto">
                <FavoritesList username={username} changeShown={setShown} />
            </div>
        );
    }
}

export default Favorites;
