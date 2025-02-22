import React, { useState, useEffect, useRef } from 'react';
import { X, Clock, Users, Star, Share2, Heart } from 'lucide-react';
import PostModal from './PostModal';
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  WhatsappShareButton, 
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon
} from 'react-share';

const Recipe = ({ recipe, saved, username, hideRecipe }) => {
    const [ready, setReady] = useState(recipe.minutes != null);
    const [modal, setModal] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const shareUrl = `${window.location.origin}/recipe/${recipe.recipe_id}`;
    const shareTitle = `Check out this recipe for ${recipe.title}!`;
    const shareMenuRef = useRef(null);

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
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/favorites/check/${username}/${recipe.recipe_id}`);
                const data = await response.json();
                setIsSaved(data.isFavorited);
            } catch (error) {
                console.log(error);
            }
        };

        if (username) {
            checkFavoriteStatus();
        }
    }, [recipe, username]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
                setShowShareMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const save = async () => {
        console.log(JSON.stringify({
            username: username,
            recipe_id: recipe.id,
            title: recipe.title,
            image: recipe.image,
            servings: recipe.servings,
            minutes: recipe.readyInMinutes,
            ingredients: recipe.extendedIngredients,
            instructions: recipe.analyzedInstructions,
            summary: recipe.summary,
        }));
        try {
            const saveResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/favorites`, {
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
            const saving = await saveResponse.json();
            if (saving === 'saved to favorites') {
                console.log('Saved to favorites');
                setIsSaved(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const post = async (review) => {
        try {
            const postResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/reviews`, {
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
                    review: review
                }),
            });
            const posting = await postResponse.json();
            if (posting === 'successfully posted') {
                setModal(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const remove = async () => {
        try {
            const saveResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/favorites`, {
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
            }
        } catch (error) {
            console.log(error);
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
                <div className="flex justify-end gap-3 mb-8">
                    <button
                        className="flex items-center gap-1.5 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm"
                    >
                        <Heart className={isSaved ? 'fill-current' : ''} size={18} />
                        {isSaved ? 'Remove Favorite' : 'Save'}
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setShowShareMenu(!showShareMenu)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition duration-200"
                        >
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>
                        {showShareMenu && (
                            <div 
                                ref={shareMenuRef} 
                                className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-lg p-3 z-50 animate-scaleIn"
                                style={{ minWidth: '180px' }}
                            >
                                <div className="flex gap-2">
                                    <FacebookShareButton 
                                        url={shareUrl} 
                                        quote={shareTitle}
                                        className="hover:opacity-80 transition-opacity"
                                    >
                                        <FacebookIcon size={32} round />
                                    </FacebookShareButton>
                                    <TwitterShareButton 
                                        url={shareUrl} 
                                        title={shareTitle}
                                        className="hover:opacity-80 transition-opacity"
                                    >
                                        <TwitterIcon size={32} round />
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
                        className="flex items-center gap-1.5 bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors text-sm"
                    >
                        <Share2 className="w-4 h-4" />
                        Review
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

            {modal && <PostModal onPost={post} modalChange={setModal} />}
        </div>
    );
};

export default Recipe;