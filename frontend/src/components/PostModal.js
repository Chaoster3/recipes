import React, { useState } from 'react';
import { X } from 'lucide-react';

const PostModal = ({ onPost, modalChange }) => {
    const [post, setPost] = useState("");
    const handlePostChange = (event) => {
        setPost(event.target.value);
    };

    const handleSubmit = () => {
        if (post.trim()) {
            onPost(post);
            modalChange(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => modalChange(false)}
            />

            {/* Modal */}
            <div className="max-w-2xl w-11/12 bg-white rounded-xl shadow-xl transform transition-all max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex-1" /> {/* Spacer */}
                    <h2 className="text-2xl font-bold text-gray-800">Share Your Review</h2>
                    <div className="flex-1 flex justify-end">
                        <button
                            onClick={() => modalChange(false)}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6 flex-grow">
                    <div className="relative">
                        <textarea
                            className="w-full min-h-[160px] p-4 text-gray-700 bg-gray-50 rounded-lg border border-gray-200 focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 transition-colors resize-none"
                            placeholder="Share your thoughts about this recipe..."
                            value={post}
                            onChange={handlePostChange}
                        />
                        <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                            {post.length} / 500
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-center gap-3 px-6 py-4 border-t border-gray-100">
                    <button
                        onClick={handleSubmit}
                        disabled={!post.trim()}
                        className={`px-6 py-2 text-sm font-medium rounded-lg transition-all ${
                            post.trim()
                                ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        Post Review
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostModal;