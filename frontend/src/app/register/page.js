'use client';

import React, { useState, useRef } from 'react';
import { FaUtensils } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import UsernameModal from '../components/UsernameModal';
import { setCookie } from '../utils/cookies';

const Register = () => {
    const router = useRouter();
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [used, setUsed] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [googleData, setGoogleData] = useState(null);
    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const passwordInputRef = useRef(null);

    const usernameChange = (event) => {
        setUsername(event.target.value);
    };

    const onUsernameKeyPress = (event) => {
        if (event.key === 'Enter') {
            passwordInputRef.current?.focus();
        }
    };

    const passwordChange = (event) => {
        setPassword(event.target.value);
    };

    const onKeyPress = (event) => {
        if (event.key === 'Enter') {
            submitRegister();
        }
    };

    const submitRegister = async () => {
        // Reset error states
        setUsed(false);
        setPasswordError(false);

        // Check password length
        if (password.length < 6) {
            setPasswordError(true);
            return;
        }

        if (username !== "") {
            const submitResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/register`,
                {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                }
            )
            const submit = await submitResponse.json();
            if (submit === 'register success') {
                login(username);
                setCookie('username', username, 30);
                router.push('/home');
            } else {
                setUsed(true);
            }
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);
            setGoogleData(decoded);
            setShowUsernameModal(true);
        } catch (error) {
            console.error('Google registration error:', error);
        }
    };

    const handleUsernameSubmit = async (chosenUsername) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/google-register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: chosenUsername,
                    name: googleData.name,
                    googleId: googleData.sub
                })
            });

            const data = await response.json();
            if (data.success) {
                login(chosenUsername);
                setCookie('username', chosenUsername, 30);
                setShowUsernameModal(false);
                router.push('/home');
            } else if (data.error === 'user_exists') {
                return data.message;
            }
            return null;
        } catch (error) {
            console.error('Google registration error:', error);
            return 'An error occurred. Please try again.';
        }
    };

    return (
        <div className="min-h-screen w-96 bg-[#fde7cb] flex flex-col items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '4s'}}></div>
            </div>

            <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl shadow-lg mb-4 group">
                        <FaUtensils size={32} className="text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent tracking-wide">
                        Delish
                    </h1>
                </div>

                {/* Register Form */}
                <div className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create your account</h2>
                        <p className="text-gray-600">Start your culinary journey today</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                            <input
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm"
                                onChange={usernameChange}
                                onKeyUp={onUsernameKeyPress}
                                type="text"
                                placeholder="Choose a username"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                ref={passwordInputRef}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm"
                                onChange={passwordChange}
                                onKeyUp={onKeyPress}
                                type="password"
                                placeholder="Create a password"
                            />
                        </div>
                    </div>

                    <button
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
                        onClick={submitRegister}
                    >
                        Create Account
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white/90 text-gray-500 font-medium">Or continue with</span>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => console.log('Login Failed')}
                            size="large"
                            width="100%"
                            text="signup_with"
                            shape="rectangular"
                        />
                    </div>

                    <div className="text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <button
                                className="text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-200"
                                onClick={() => router.push('/')}
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                </div>

                {/* Error Messages */}
                {used && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-700 font-medium">Username already in use</p>
                        </div>
                    </div>
                )}
                {passwordError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-700 font-medium">Password must be at least 6 characters long</p>
                        </div>
                    </div>
                )}
            </div>

            {showUsernameModal && googleData && (
                <UsernameModal
                    email={googleData.email}
                    onSubmit={handleUsernameSubmit}
                    onClose={() => setShowUsernameModal(false)}
                />
            )}
        </div>
    );
};

export default Register;
