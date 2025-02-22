import React, { useState } from 'react';
import { X } from 'lucide-react';

const UsernameModal = ({ onSubmit, onClose, email }) => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (username.length < 3) {
            setError('Username must be at least 3 characters long');
            return;
        }
        setIsSubmitting(true);
        const error = await onSubmit(username);
        if (error) {
            setError(error);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-xl p-6 w-[400px] relative animate-scaleIn">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-semibold text-gray-800 mb-4">Choose a Username</h2>
                <p className="text-sm text-gray-600 mb-6">
                    This will be your unique identifier on Delish.
                    Your Google account ({email}) will be linked to this username.
                </p>

                <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        setError('');
                    }}
                    placeholder="Enter username"
                    className={`w-full border p-3 rounded-lg mb-4 ${error ? 'border-red-500' : ''}`}
                />

                {error && (
                    <p className="text-red-500 text-sm mb-4 animate-shake">{error}</p>
                )}

                <button
                    onClick={handleSubmit}
                    className={`w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition duration-200 
                        ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Creating account...' : 'Continue'}
                </button>
            </div>
        </div>
    );
};

export default UsernameModal; 