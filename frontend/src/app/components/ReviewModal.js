'use client';

import { useState, useEffect } from 'react';
import { Star, X, Save, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

const ReviewModal = ({ modalChange, onPost, recipe }) => {
    // State for form fields
    const [review, setReview] = useState('');
    const [overallRating, setOverallRating] = useState(5);
    const [tasteRating, setTasteRating] = useState(5);
    const [presentationRating, setPresentationRating] = useState(5);
    const [difficultyRating, setDifficultyRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');


    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!review.trim()) {
            setError('Please write a review');
            return;
        }

        try {
            setIsSubmitting(true);
            
            const reviewData = {
                recipe_id: recipe.recipe_id,
                review: review.trim(),
                overall_rating: overallRating,
                taste_rating: tasteRating,
                presentation_rating: presentationRating,
                difficulty_rating: difficultyRating
            };
            
            await onPost(reviewData);
            modalChange(false);
        } catch (error) {
            setError('Failed to submit review. Please try again.');
            console.error('Review submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Star rating component
    const StarRating = ({ rating, setRating, label }) => {
        return (
            <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                        >
                            <Star
                                className={`w-6 h-6 ${
                                    star <= rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                }`}
                            />
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Write a Review
                    </h2>
                    <button 
                        onClick={() => modalChange(false)}
                        className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 120px)' }}>
                    <form onSubmit={handleSubmit}>
                        {/* Recipe Info */}
                        {recipe && (
                            <div className="flex gap-4 mb-6">
                                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                        src={recipe.image}
                                        alt={recipe.title}
                                        fill
                                        className="object-cover"
                                        sizes="80px"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{recipe.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{recipe.servings} servings • {recipe.minutes} min</p>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                                <AlertTriangle className="w-5 h-5" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Star Ratings */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <StarRating
                                label="Overall Rating"
                                rating={overallRating}
                                setRating={setOverallRating}
                            />
                            <StarRating
                                label="Taste"
                                rating={tasteRating}
                                setRating={setTasteRating}
                            />
                            <StarRating
                                label="Presentation"
                                rating={presentationRating}
                                setRating={setPresentationRating}
                            />
                            <StarRating
                                label="Difficulty"
                                rating={difficultyRating}
                                setRating={setDifficultyRating}
                            />
                        </div>

                        {/* Review Text */}
                        <div className="mb-6">
                            <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
                                Your Review
                            </label>
                            <textarea
                                id="review"
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                rows={6}
                                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                                placeholder="Share your experience with this recipe..."
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium ${
                                    isSubmitting
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-orange-500 hover:bg-orange-600'
                                } transition-colors`}
                            >
                                <Save className="w-5 h-5" />
                                {isSubmitting ? 'Submitting...' : 'Post Review'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;