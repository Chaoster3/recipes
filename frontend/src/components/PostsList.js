import React, { useState, useEffect } from 'react';
import { User, Timer, MessageSquare, Users } from 'lucide-react';

const PostsList = ({ username, changeShown }) => {
    const [posts, setPosts] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsResponse = await fetch(`http://localhost:3001/reviews`);
                const received = await postsResponse.json();
                setPosts(received);
            } catch (error) {
                console.log('Error:', error);
            }
        };
        fetchPosts();
    }, [username]);

    if (!posts) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-pulse text-lg text-gray-600">Loading reviews...</div>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="text-center mt-32">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Community Reviews</h1>
                <p className="text-lg text-gray-600">No reviews have been shared yet!</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Community Reviews</h1>
                <p className="text-lg text-gray-600">Discover what others are cooking and loving</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((recipe) => (
                    <div
                        key={recipe.recipe_id}
                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
                        onClick={() => changeShown(recipe)}
                    >
                        <div className="p-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                    <User className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">{recipe.username}</div>
                                    <div className="text-xs text-gray-500">Shared a recipe review</div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <img
                                src={recipe.image.replace(/-\w+\.(jpg|jpeg|png|gif)$/, '-636x393.$1')}
                                alt={recipe.title}
                                className="w-full object-cover"
                            />
                        </div>

                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2">
                                {recipe.title}
                            </h3>

                            <div className="flex items-center text-sm text-gray-600 mb-3 space-x-4">
                                <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-1 text-orange-400" />
                                    {recipe.servings} servings
                                </div>
                                <div className="flex items-center">
                                    <Timer className="w-4 h-4 mr-1 text-orange-400" />
                                    {recipe.minutes}m
                                </div>
                            </div>

                            <div className="flex items-start gap-2">
                                <MessageSquare className="w-4 h-4 mt-1 flex-shrink-0 text-green-500" />
                                <p className="text-sm text-gray-600 line-clamp-3">
                                    {recipe.review}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostsList;