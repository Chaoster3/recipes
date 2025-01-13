import React, { useState, useEffect } from 'react';

const PostsList = ({ username, changeShown }) => {
    const [posts, setPosts] = useState(null);

    useEffect(() => {
        return async () => {
            try {
                const postsResponse = await fetch(`http://localhost:3001/posts`);
                const received = await postsResponse.json();
                setPosts(received);
            } catch (error) {
                console.log('Error:', error);
            }
        }
    }, [username]);

    if (posts) {
        if (posts.length === 0) {
            return (
                <div className="mt-32 text-white text-lg">
                    No one has shared anything!
                </div>
            )
        }
        else {
            return (
                <div className="flex flex-wrap justify-center gap-5 w-full px-28 overflow-auto mb-6 text-left pb-12">
                    {posts.map((recipe) => (
                            <div className="shadow-2xl bg-white px-4 py-2 cursor-pointer rounded-lg" onClick={() => changeShown(recipe)}>
                                <div className='text-left mb-2'>{recipe.username}</div>
                                <img src={recipe.image} alt={recipe.title} className="w-72" />
                                <div className="mt-2 mb-4 text-xl font-semibold border-b">{recipe.title}</div>
                                <div className="mb-1">{recipe.description}</div>
                            </div>
                    ))}
                </div>
            );
        }
    } else {
        return (
            <div>
                Loading
            </div>
        )
    }
}

export default PostsList;