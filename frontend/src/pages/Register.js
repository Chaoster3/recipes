import React, { useState, useRef } from 'react';
import { FaUtensils } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import UsernameModal from '../components/UsernameModal';

const Register = ({ routeChange, userChange }) => {
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
                `${process.env.REACT_APP_BASE_URL}/register`,
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
                routeChange("search");
                userChange(username);
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
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/google-register`, {
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
                routeChange("search");
                userChange(chosenUsername);
                setShowUsernameModal(false);
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
        <div className="flex flex-col items-center justify-center h-screen animate-fadeIn">
            <div className="relative bg-white p-8 rounded-xl shadow-md w-[400px] animate-scaleIn">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-extrabold text-orange-500 tracking-wide flex items-center justify-center space-x-3">
                        <FaUtensils size={32} />
                        <span>Delish</span>
                    </h1>
                </div>

                {/* Register Form */}
                <p className="text-center mb-4 text-lg font-semibold">
                    Sign up for an account
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
                    className="w-full bg-orange-500 text-white py-3 text-base rounded-lg hover:bg-orange-600 transition duration-200"
                    onClick={submitRegister}
                >
                    Register
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
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => console.log('Login Failed')}
                        size="large"
                        width="340"
                        text="signup_with"
                        shape="rectangular"
                    />
                </div>
                <p className="mt-4 text-center text-base">
                    Already have an account?{' '}
                    <span
                        className="text-blue-500 cursor-pointer"
                        onClick={() => routeChange("login")}
                    >
                        Sign In
                    </span>
                </p>

                {/* Error Messages */}
                {used && (
                    <p className="absolute w-full -bottom-10 left-1/2 transform -translate-x-1/2 text-center text-red-500 text-base">
                        Username already in use
                    </p>
                )}
                {passwordError && (
                    <p className="absolute w-full -bottom-10 left-1/2 transform -translate-x-1/2 text-center text-red-500 text-base">
                        Password must be at least 6 characters long
                    </p>
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
