import React, { useState } from 'react';
import PostsList from '../components/PostsList';
import Recipe from '../components/Recipe';
import { BookOpen } from 'lucide-react';

const Posts = ({ username }) => {
    const [shown, setShown] = useState(null);

    if (shown) {
        return (
            <Recipe 
                recipe={shown} 
                saved={false} 
                username={username} 
                hideRecipe={() => setShown(null)} 
            />
        );
    }

    return (
        <div className="flex flex-col items-center flex-grow overflow-hidden">
            <div className="w-full max-w-4xl px-4">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Community Reviews</h1>
                    <p className="text-gray-600 text-md">
                        Discover what others are cooking and sharing
                    </p>
                </div>
                <PostsList 
                    username={username} 
                    changeShown={setShown} 
                    EmptyState={() => (
                        <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-xl shadow-sm">
                            <BookOpen className="w-12 h-12 text-orange-500 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Reviews Yet</h3>
                            <p className="text-gray-600 text-center max-w-md mb-6">
                                Be the first to share your culinary adventures! Save a recipe and leave a review to start building our community cookbook.
                            </p>
                            <button 
                                onClick={() => window.location.href = '/search'}
                                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-200"
                            >
                                Discover Recipes
                            </button>
                        </div>
                    )}
                />
            </div>
        </div>
    );
}

export default Posts;