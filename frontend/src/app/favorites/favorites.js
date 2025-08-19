'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import FavoritesList from '../components/FavoritesList';
import Recipe from '../components/Recipe';

export default function Favorites({ initialFavorites }) {
  const [shown, setShown] = useState(null);

  return (
    <div className="p-8">
      {shown ? (
        <Recipe 
          recipe={shown} 
          saved={true} 
          hideRecipe={() => setShown(null)}
          onUnfavorited={() => {}} // No-op since this is a legacy component
        />
      ) : (
          <FavoritesList 
            initialFavorites={initialFavorites} 
            changeShown={setShown}
          />
      )}
    </div>
  );
} 