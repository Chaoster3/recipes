'use client';

import React, { useState, useEffect } from 'react';
import { User, Timer, MessageSquare, Users, ChefHat, Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { getCookie } from '../utils/cookies';

const StarRating = ({ value, size = "sm" }) => {
    const ratingStars = [];
    const starSize = size === 'xs' ? 'w-3 h-3' : 'w-4 h-4';

    for (let i = 1; i <= 5; i++) {
        ratingStars.push(
            <Star 
                key={i} 
                className={`${starSize} ${i <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} 
            />
        );
    }

    return <div className="flex">{ratingStars}</div>;
};

const ReviewsList = ({ initialReviews, changeShown }) => {
    const [posts, setPosts] = useState(initialReviews);
    const [username, setUsername] = useState('');
    const { user } = useAuth();
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 5; // Number of reviews per page

    useEffect(() => {
        // Use the user from AuthContext, fallback to cookie if needed
        const currentUser = user || getCookie('username');
        setUsername(currentUser);
        
        // Fetch reviews with user's vote status
        if (currentUser) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews?username=${currentUser}`)
                .then(res => res.json())
                .then(data => {
                    setPosts(data.map(post => ({
                        ...post,
                        userVote: post.user_vote
                    })));
                })
                .catch(error => console.error('Error fetching reviews:', error));
        }
    }, [user]);

    // Calculate the reviews to display
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = posts ? posts.slice(indexOfFirstReview, indexOfLastReview) : [];

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleVote = async (reviewId, voteType, e) => {
        e.stopPropagation(); // Prevent triggering the card click
        if (!username) {
            console.log('No username found, cannot vote');
            return;
        }

        console.log('Voting:', { reviewId, voteType, username });

        try {
            const requestBody = {
                username,
                review_id: reviewId,
                vote_type: voteType
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                console.log('Vote successful, fetching fresh data');
                // Fetch fresh data from the backend to get updated vote counts
                const updatedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews?username=${username}`);
                if (updatedResponse.ok) {
                    const updatedData = await updatedResponse.json();
                    console.log('Updated data received:', updatedData);
                    setPosts(updatedData.map(post => ({
                        ...post,
                        userVote: post.user_vote
                    })));
                } else {
                    console.error('Failed to fetch updated data:', updatedResponse.status);
                }
            } else {
                const errorText = await response.text();
                console.error('Vote failed:', response.status, errorText);
            }
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    if (!posts) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh]">
                <ChefHat className="w-16 h-16 text-orange-500 animate-bounce mb-4" />
                <p className="text-xl font-medium text-gray-700">Loading delicious reviews...</p>
            </div>
        );
    }

    if (posts && posts.length === 0) {
        return (
            <div className="min-h-[70vh] bg-[#fde7cb] flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
                    <div className="mb-6 bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                        <MessageSquare className="w-10 h-10 text-orange-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">No Reviews Yet</h2>
                    <p className="text-gray-600 mb-6">
                        Be the first to share your culinary adventures with the community!
                    </p>
                    <button 
                        onClick={() => window.location.href = '/search'}
                        className="inline-flex items-center justify-center bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                    >
                        Discover Recipes
                    </button>
                </div>
            </div>
        );
    }

    // Calculate total pages
    const totalPages = Math.ceil((posts?.length || 0) / reviewsPerPage);

    return (
        <div className="flex flex-col items-center gap-8 p-6">
            {currentReviews.map((post) => (
                <article 
                    key={post.review_id}
                    className="w-full max-w-4xl group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 relative"
                >
                    <div className="flex flex-col md:flex-row">
                        {/* Left Column - Image and General Info */}
                        <div className="md:w-1/4">
                            {/* Recipe Image with Title and Info Overlay */}
                            <div className="relative h-56 overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-700"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                
                                {/* Title Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className="text-lg font-bold text-white line-clamp-2 transition-colors duration-300 drop-shadow-lg mb-2">
                                        {post.title}
                                    </h3>
                                    
                                    {/* Recipe Info Overlay */}
                                    <div className="flex items-center gap-4 text-xs text-white">
                                        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                                            <Users className="w-3 h-3 text-white" />
                                            <span className="font-medium">{post.servings} servings</span>
                                        </div>
                                        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                                            <Timer className="w-3 h-3 text-white" />
                                            <span className="font-medium">{post.minutes}m</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Ratings, Review, and Actions */}
                        <div className="md:w-3/4 flex flex-col">
                            {/* Top Row - Ratings and Review */}
                            <div className="flex flex-col md:flex-row h-full">
                                {/* Middle Column - Ratings */}
                                <div className="md:w-1/3 p-2 flex flex-col">
                                    {/* Username and Review Header */}
                                    <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 px-2 py-1 rounded-lg shadow-sm border border-orange-100 mb-2">
                                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm">
                                            <User className="w-2 h-2 text-white" />
                                        </div>
                                        <span className="text-sm font-semibold text-gray-800">{post.username}</span>
                                    </div>

                                    {/* Combined Ratings Section */}
                                    <div className="flex-1 p-2.5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 shadow-sm">
                                        <div className="flex items-center justify-between mb-2.5">
                                            <span className="text-sm font-bold text-gray-800">Overall Rating</span>
                                            <div className="flex items-center gap-1.5">
                                                <StarRating value={post.overall_rating || 0} size="sm" />
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2 pt-2 border-t border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-600">Taste</span>
                                                <StarRating value={post.taste_rating || 0} size="xs" />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-600">Presentation</span>
                                                <StarRating value={post.presentation_rating || 0} size="xs" />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-600">Difficulty</span>
                                                <StarRating value={post.difficulty_rating || 0} size="xs" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Review Text and Actions */}
                                <div className="md:w-2/3 p-2 flex flex-col">
                                    <div className="h-full flex flex-col">
                                        {/* Review Text */}
                                        <div className="flex-grow">
                                            <p className="text-gray-700 text-sm leading-relaxed">
                                                {post.review}
                                            </p>
                                        </div>
                                        
                                        {/* Actions */}
                                        <div className="flex items-center justify-between pt-2 border-t border-gray-200 mt-2">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    changeShown(post);
                                                }}
                                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors duration-200 bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-lg border border-orange-200"
                                            >
                                                <span>View Recipe</span>
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                            
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={(e) => handleVote(post.review_id, 'up', e)}
                                                    className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all duration-200 ${
                                                        post.userVote === 'up' 
                                                            ? 'bg-green-100 text-green-700 shadow-sm border border-green-200' 
                                                            : 'text-gray-500 hover:bg-green-50 hover:text-green-600 border border-gray-200 hover:border-green-200'
                                                    }`}
                                                >
                                                    <ThumbsUp className="w-3 h-3" />
                                                    <span className="text-sm font-medium">{post.upvotes || 0}</span>
                                                </button>
                                                <button 
                                                    onClick={(e) => handleVote(post.review_id, 'down', e)}
                                                    className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all duration-200 ${
                                                        post.userVote === 'down' 
                                                            ? 'bg-red-100 text-red-700 shadow-sm border border-red-200' 
                                                            : 'text-gray-500 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200'
                                                    }`}
                                                >
                                                    <ThumbsDown className="w-3 h-3" />
                                                    <span className="text-sm font-medium">{post.downvotes || 0}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            ))}
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8 mb-4">
                    {/* Previous Button */}
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`group flex items-center justify-center gap-1 w-20 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            currentPage === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                : 'bg-white text-orange-600 border border-orange-200 hover:bg-orange-50 hover:border-orange-300 hover:shadow-sm'
                        }`}
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Prev
                    </button>
                    
                    {/* Page Numbers Container */}
                    <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
                        {Array.from({ length: totalPages }, (_, index) => {
                            const pageNumber = index + 1;
                            const isCurrentPage = currentPage === pageNumber;
                            
                            // Show first page, last page, current page, and pages around current page
                            if (
                                pageNumber === 1 ||
                                pageNumber === totalPages ||
                                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                            ) {
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => paginate(pageNumber)}
                                        className={`min-w-[2rem] h-8 rounded text-sm font-medium transition-all duration-200 ${
                                            isCurrentPage
                                                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                                                : 'text-gray-700 hover:bg-gray-100 hover:text-orange-600'
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            } else if (
                                pageNumber === currentPage - 2 ||
                                pageNumber === currentPage + 2
                            ) {
                                return (
                                    <span key={pageNumber} className="px-1 py-1 text-gray-400 text-sm">
                                        ...
                                    </span>
                                );
                            }
                            return null;
                        })}
                    </div>
                    
                    {/* Next Button */}
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`group flex items-center justify-center gap-1 w-20 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            currentPage === totalPages
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                : 'bg-white text-orange-600 border border-orange-200 hover:bg-orange-50 hover:border-orange-300 hover:shadow-sm'
                        }`}
                    >
                        Next
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            )}
            
            {/* Page Info */}
            {posts && posts.length > 0 && (
                <div className="bg-white rounded border border-gray-200 px-3 py-2">
                    <div className="text-xs text-gray-600 text-center">
                        Showing <span className="text-orange-600 font-medium">{indexOfFirstReview + 1}</span> to{' '}
                        <span className="text-orange-600 font-medium">{Math.min(indexOfLastReview, posts.length)}</span> of{' '}
                        <span className="text-orange-600 font-medium">{posts.length}</span> reviews
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewsList;