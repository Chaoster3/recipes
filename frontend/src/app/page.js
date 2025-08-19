'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { FaUtensils } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from './context/AuthContext';

const LoginContent = () => {
    const router = useRouter();
    const { login, isAuthenticated } = useAuth();
    const searchParams = useSearchParams();
    const message = searchParams.get('message');
    const logout = searchParams.get('logout');
    const returnTo = searchParams.get('from') || '/home';

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [incorrect, setIncorrect] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const passwordInputRef = useRef(null);

    useEffect(() => {
        if (isAuthenticated) {
            router.push(returnTo !== '/' ? returnTo : '/home');
        }
    }, [router, returnTo, isAuthenticated]);

    const usernameChange = (event) => {
        setUsername(event.target.value);
        setIncorrect(false);
    };

    const onUsernameKeyPress = (event) => {
        if (event.key === 'Enter') {
            passwordInputRef.current?.focus();
        }
    };

    const passwordChange = (event) => {
        setPassword(event.target.value);
        setIncorrect(false);
    };

    const onKeyPress = (event) => {
        if (event.key === 'Enter') {
            submitLogin();
        }
    };

    const submitLogin = async () => {
        if (!username || !password) {
            setIncorrect(true);
            return;
        }

        setIsLoading(true);
        try {
            const submitResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/signin`,
                {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: username,
                        password: password,
                    }),
                }
            );

            if (!submitResponse.ok) {
                throw new Error('Login failed');
            }

            const submit = await submitResponse.json();
            if (submit === 'login success') {
                login(username);
                router.push(returnTo !== '/' ? returnTo : '/home');
            } else {
                setIncorrect(true);
            }
        } catch (error) {
            console.error('Login error:', error);
            setIncorrect(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/google-signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: decoded.email,
                    name: decoded.name,
                    googleId: decoded.sub
                })
            });

            const data = await response.json();
            if (data.success) {
                login(data.username);
                router.push(returnTo !== '/' ? returnTo : '/home');
            } else if (data.error === 'user_not_found') {
                router.push('/register');
            }
        } catch (error) {
            console.error('Google login error:', error);
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

            {/* Success message for logout */}
            {logout === 'true' && (
                <div className="mb-6 max-w-md p-4 bg-green-50 border border-green-200 rounded-xl shadow-lg fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-green-800">Successfully logged out</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Error message */}
            {message && (
                <div className="mb-6 max-w-md p-4 bg-yellow-50 border border-yellow-200 rounded-xl shadow-lg fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-yellow-800">{message}</p>
                        </div>
                    </div>
                </div>
            )}
            
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

                {/* Login Form */}
                <div className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back</h2>
                        <p className="text-gray-600">Sign in to your account to continue</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                            <input
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm"
                                onChange={usernameChange}
                                onKeyUp={onUsernameKeyPress}
                                type="text"
                                placeholder="Enter your username"
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
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    <button
                        className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        onClick={submitLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Signing in...
                            </div>
                        ) : (
                            'Sign in'
                        )}
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
                            text="signin_with"
                            shape="rectangular"
                        />
                    </div>

                    <div className="text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <button
                                className="text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-200"
                                onClick={() => router.push('/register')}
                            >
                                Sign up
                            </button>
                        </p>
                    </div>
                </div>

                {/* Error Message */}
                {incorrect && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-700 font-medium">
                                {!username || !password ? 'Please fill in all fields' : 'Incorrect username or password'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const Login = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#fde7cb] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
};

export default Login;
