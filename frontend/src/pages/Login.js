import React, { useState, useRef } from 'react';
import { FaUtensils } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Login = ({ routeChange, userChange }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [incorrect, setIncorrect] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const passwordInputRef = useRef(null);

    const usernameChange = (event) => {
        setUsername(event.target.value);
        setIncorrect(false); // Clear error when user types
    };

    const onUsernameKeyPress = (event) => {
        if (event.key === 'Enter') {
            passwordInputRef.current?.focus();
        }
    };

    const passwordChange = (event) => {
        setPassword(event.target.value);
        setIncorrect(false); // Clear error when user types
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
                `${process.env.REACT_APP_BASE_URL}/signin`,
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
                routeChange("search");
                userChange(username);
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
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/google-signin`, {
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
                routeChange("search");
                userChange(data.username);
            } else if (data.error === 'user_not_found') {
                routeChange("register");
            }
        } catch (error) {
            console.error('Google login error:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen animate-fadeIn">
            <div className="relative bg-white p-8 rounded-xl shadow-md w-[400px] animate-scaleIn">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-extrabold text-orange-500 tracking-wide flex items-center justify-center space-x-3">
                        <FaUtensils size={32} />
                        <span>Delish</span>
                    </h1>
                </div>

                {/* Login Form */}
                <p className="text-center mb-4 text-lg font-semibold">
                    Sign in to your account
                </p>

                <div className="mb-3">
                    <input
                        className="w-full border p-3 text-base rounded-lg"
                        onChange={usernameChange}
                        onKeyUp={onUsernameKeyPress}
                        type="text"
                        placeholder="Username"
                    />
                </div>

                <div className="mb-6">
                    <input
                        ref={passwordInputRef}
                        className="w-full border p-3 text-base rounded-lg"
                        onChange={passwordChange}
                        onKeyUp={onKeyPress}
                        type="password"
                        placeholder="Password"
                    />
                </div>

                <button
                    className={`w-full bg-orange-500 text-white py-3 text-base rounded-lg hover:bg-orange-600 transition duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    onClick={submitLogin}
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Log in'}
                </button>

                <div className="mt-4 relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div className="mt-4 w-full flex justify-center">
                    <div className="w-full flex justify-center" >
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => console.log('Login Failed')}
                            size="large"
                            width="340"
                            text="signin_with"
                            shape="rectangular"
                        />
                    </div>
                </div>

                <p className="mt-4 text-center text-base">
                    Don't have an account?{' '}
                    <span
                        className="text-blue-500 cursor-pointer"
                        onClick={() => routeChange("register")}
                    >
                        Sign Up
                    </span>
                </p>

                {/* Error Message */}
                {incorrect && (
                    <p className="absolute w-full -bottom-10 left-1/2 transform -translate-x-1/2 text-center text-red-500 text-base">
                        {!username || !password ? 'Please fill in all fields' : 'Incorrect username/password'}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Login;
