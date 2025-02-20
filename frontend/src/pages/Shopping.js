import React, { useState } from 'react';
import ShoppingCart from '../components/ShoppingCart';
import Recipe from '../components/Recipe';

const Shopping = ({ username }) => {
    const [shown, setShown] = useState(null);
    console.log(shown);

    if (shown) {
        return (
            <Recipe recipe={shown} saved={true} username={username} hideRecipe={() => setShown(null)} />
        );
    } else {
        return (
            <div className="w-full flex flex-col items-center">
                <ShoppingCart username={username} changeShown={setShown} />
            </div>
        )
    }
}

export default Shopping;
