import React, { useState } from 'react';
import { FaUtensils } from 'react-icons/fa';

const Login = ({ routeChange, userChange }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [incorrect, setIncorrect] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const usernameChange = (event) => {
        setUsername(event.target.value);
        setIncorrect(false); // Clear error when user types
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
            const submitResponse = await fetch('http://localhost:3001/signin', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

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

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#fde7cb]">
            <div className="relative bg-white p-12 rounded-xl shadow-md w-[26rem]">
                {/* Logo */}
                <div className="mb-10 text-center">
                    <h1 className="text-6xl font-extrabold text-orange-500 tracking-wide flex items-center justify-center space-x-4">
                        <FaUtensils size={50} />
                        <span>Delish</span>
                    </h1>
                </div>

                {/* Login Form */}
                <p className="text-center mb-6 text-xl font-semibold">
                    Sign in to your account
                </p>

                <div className="mb-4">
                    <input
                        className="w-full border p-4 text-xl rounded-lg"
                        onChange={usernameChange}
                        type="text"
                        placeholder="Username"
                    />
                </div>

                <div className="mb-8">
                    <input
                        className="w-full border p-4 text-xl rounded-lg"
                        onChange={passwordChange}
                        onKeyUp={onKeyPress}
                        type="password"
                        placeholder="Password"
                    />
                </div>

                <button
                    className={`w-full bg-orange-500 text-white py-4 text-xl rounded-lg hover:bg-orange-600 transition duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    onClick={submitLogin}
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Log in'}
                </button>

                <p className="mt-6 text-center text-xl">
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
                    <p className="absolute w-full -bottom-12 left-1/2 transform -translate-x-1/2 text-center text-red-500 text-xl">
                        {!username || !password ? 'Please fill in all fields' : 'Incorrect username/password'}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Login;
