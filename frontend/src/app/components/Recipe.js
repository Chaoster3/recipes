'use client';
import React, { useState, useEffect, useRef } from 'react';
import { X, Clock, Users, Pen, Share2, Heart, MessageSquare } from 'lucide-react';
import ReviewModal from './ReviewModal';
import { 
  // FacebookShareButton, 
  TwitterShareButton, 
  WhatsappShareButton, 
  EmailShareButton,
  // FacebookIcon,
  XIcon,
  WhatsappIcon,
  EmailIcon
} from 'react-share';
import { getCookie } from '../utils/cookies';
import { fetchWithAuth } from '../utils/api';

const Recipe = ({ recipe, saved, hideRecipe, onUnfavorited }) => {
    const [ready, setReady] = useState(recipe.minutes != null);
    const [modal, setModal] = useState(false);
    const [isSaved, setIsSaved] = useState(saved || false);
    const [isCheckingFavorite, setIsCheckingFavorite] = useState(false);
    const [isSavingFavorite, setIsSavingFavorite] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [username, setUsername] = useState('');
    const shareUrl = `${window.location.origin}/recipe/${recipe.recipe_id}`;
    const shareTitle = `Check out this recipe for ${recipe.title}!`;
    const shareMenuRef = useRef(null);
    console.log(modal)
    useEffect(() => {
        const storedUsername = getCookie('username');
        setUsername(storedUsername);
    }, []);

    useEffect(() => {
        if (!recipe.minutes) {
            recipe.recipe_id = recipe.id;
            recipe.minutes = recipe.readyInMinutes;
            recipe.ingredients = recipe.extendedIngredients;
            recipe.instructions = recipe.analyzedInstructions;
            setReady(true);
        }

        // Check if recipe is favorited
        const checkFavoriteStatus = async () => {
            try {
                setIsCheckingFavorite(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/check/${username}/${recipe.recipe_id}`, {
                    // credentials: 'include',
                });
                const data = await response.json();
                console.log(data);
                setIsSaved(data.isFavorited);
            } catch (error) {
                console.log(error);
                setIsSaved(false);
            } finally {
                setIsCheckingFavorite(false);
            }
        };

        if (username) {
            checkFavoriteStatus();
            console.log(isSaved);
        }
    }, [recipe, username]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
                setShowShareMenu(false);
            }
        };

        // Only add the listener when the share menu is open
        if (showShareMenu) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showShareMenu]);

    const save = async () => {
        console.log(username);
        try {
            setIsSavingFavorite(true);
            const saveResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites`, {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    recipe_id: recipe.recipe_id,
                    title: recipe.title,
                    image: recipe.image,
                    servings: recipe.servings,
                    minutes: recipe.minutes,
                    ingredients: JSON.stringify(recipe.ingredients),
                    instructions: JSON.stringify(recipe.instructions),
                    summary: recipe.summary,
                }),
            });
            
            if (!saveResponse) return; // Handles the case where fetchWithAuth redirected
            
            const saving = await saveResponse.json();
            if (saving === 'saved to favorites') {
                console.log('Saved to favorites');
                setIsSaved(true);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsSavingFavorite(false);
        }
    };

    const post = async (reviewData) => {
        try {
            const postResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    recipe_id: recipe.recipe_id,
                    title: recipe.title,
                    image: recipe.image,
                    servings: recipe.servings,
                    minutes: recipe.minutes,
                    ingredients: JSON.stringify(recipe.ingredients),
                    instructions: JSON.stringify(recipe.instructions),
                    summary: recipe.summary,
                    review: reviewData.review,
                    overall_rating: reviewData.overall_rating,
                    taste_rating: reviewData.taste_rating,
                    presentation_rating: reviewData.presentation_rating,
                    difficulty_rating: reviewData.difficulty_rating
                }),
            });
            
            if (!postResponse.ok) {
                throw new Error('Failed to post review');
            }
            
            const posting = await postResponse.json();
            if (posting === 'successfully posted review') {
                console.log('Successfully posted');
                setModal(false);
            }
        } catch (error) {
            console.log(error);
            throw error; // Re-throw to let ReviewModal handle the error
        }
    };

    const remove = async () => {
        try {
            setIsSavingFavorite(true);
            const saveResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites`, {
                method: 'delete',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    recipe_id: recipe.recipe_id,
                }),
            });
            const saving = await saveResponse.json();
            if (saving === 'removed from favorites') {
                console.log('Removed From favorites');
                setIsSaved(false);
                // Call the onUnfavorited callback if provided
                if (onUnfavorited) {
                    onUnfavorited(recipe.recipe_id);
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsSavingFavorite(false);
        }
    };

    if (!ready) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-pulse text-base text-gray-600">Loading recipe...</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="relative">
                <img
                    src={recipe.image.replace(/-\w+\.(jpg|jpeg|png|gif)$/, '-636x393.$1')}
                    alt={recipe.title}
                    className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="absolute bottom-0 p-6 w-full">
                        <h1 className="text-4xl font-bold text-white mb-4">{recipe.title}</h1>
                        <div className="flex gap-4 text-white/90">
                            <div className="flex items-center gap-1">
                                <Clock className="w-5 h-5" />
                                <span className="text-sm">{recipe.minutes} mins</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users className="w-5 h-5" />
                                <span className="text-sm">{recipe.servings} servings</span>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    onClick={hideRecipe}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                >
                    <X className="w-5 h-5 text-gray-700" />
                </button>
            </div>

            <div className="p-8">
                {/* Action Buttons */}
                <div className="flex justify-end gap-2 mb-8">
                    <button
                        onClick={isSaved ? remove : save}
                        disabled={isCheckingFavorite || isSavingFavorite}
                        className={`group relative p-2.5 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-all duration-200 ${
                            (isCheckingFavorite || isSavingFavorite) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        <Heart className={isSaved ? 'fill-current' : ''} size={20} />
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-10 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {isCheckingFavorite ? 'Checking...' : isSavingFavorite ? 'Saving...' : isSaved ? 'Remove from Favorites' : 'Save Recipe'}
                        </span>
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setShowShareMenu(!showShareMenu)}
                            className="group relative p-2.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all duration-200"
                        >
                            <Share2 className="w-5 h-5" />
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-10 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                Share Recipe
                            </span>
                        </button>
                        {showShareMenu && (
                            <div 
                                ref={shareMenuRef} 
                                className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-lg p-3 z-50 animate-scaleIn"
                                style={{ minWidth: '180px' }}
                            >
                                <div className="flex gap-2">
                                    <TwitterShareButton 
                                        url={shareUrl} 
                                        title={shareTitle}
                                        className="hover:opacity-80 transition-opacity"
                                    >
                                        <XIcon size={32} round />
                                    </TwitterShareButton>
                                    <WhatsappShareButton 
                                        url={shareUrl} 
                                        title={shareTitle}
                                        className="hover:opacity-80 transition-opacity"
                                    >
                                        <WhatsappIcon size={32} round />
                                    </WhatsappShareButton>
                                    <EmailShareButton 
                                        url={shareUrl} 
                                        subject={shareTitle}
                                        className="hover:opacity-80 transition-opacity"
                                    >
                                        <EmailIcon size={32} round />
                                    </EmailShareButton>
                                </div>
                                <div className="mt-2 pt-2 border-t border-gray-100">
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(shareUrl);
                                            setShowShareMenu(false);
                                        }}
                                        className="w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1"
                                    >
                                        Copy link
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setModal(true)}
                        className="group relative p-2.5 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-all duration-200"
                    >
                        <Pen className="w-5 h-5" />
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-10 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Write Review
                        </span>
                    </button>
                </div>

                {/* About Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">About this Recipe</h2>
                    <div className="prose prose-sm max-w-none text-gray-600">
                        <p dangerouslySetInnerHTML={{ __html: recipe.summary }} />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-orange-50/50 rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Ingredients</h2>
                        <ul className="space-y-3">
                            {recipe.ingredients.map((ingredient, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                                    <span className="text-gray-700 text-sm">{ingredient.original}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-blue-50/50 rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Instructions</h2>
                        <ol className="space-y-4">
                            {recipe.instructions[0]?.steps.map((step) => (
                                <li key={step.number} className="flex gap-4">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                                        {step.number}
                                    </span>
                                    <p className="text-sm text-gray-700 mt-0.5">{step.step}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>

            {modal && <ReviewModal onPost={post} modalChange={setModal} recipe={recipe} />}
        </div>
    );
};

export default Recipe;