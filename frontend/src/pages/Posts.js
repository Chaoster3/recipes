import React, { useState } from 'react';
import PostsList from '../components/PostsList';
import Recipe from '../components/Recipe';

const Posts = ({ username }) => {
    const [shown, setShown] = useState(null);
    if (shown) {
        return (
            <Recipe recipe={shown} saved={false} username={username} hideRecipe={() => setShown(null)} />
        );
    } else {
        return (
            <div className="flex flex-col items-center flex-grow overflow-hidden">
                <div className="text-2xl text-white font-semibold p-8 w-full">Latest Reviews</div>
                <PostsList username={username} changeShown={setShown} />
            </div>
        )   
    }
}

export default Posts;