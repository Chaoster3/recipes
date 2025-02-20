import React, { useState } from 'react';
import { FaUtensils } from 'react-icons/fa';

const Register = ({ routeChange, userChange }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [used, setUsed] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const usernameChange = (event) => {
        setUsername(event.target.value);
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
            const submitResponse = await fetch('http://localhost:3001/register', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            const submit = await submitResponse.json();
            if (submit === 'register success') {
                routeChange("search");
                userChange(username);
            } else {
                setUsed(true);
            }
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

                {/* Register Form */}
                <p className="text-center mb-6 text-xl font-semibold">
                    Sign up for an account
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
                    className="w-full bg-orange-500 text-white py-4 text-xl rounded-lg hover:bg-orange-600 transition duration-200"
                    onClick={submitRegister}
                >
                    Register
                </button>

                <p className="mt-6 text-center text-xl">
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
                    <p className="absolute w-full -bottom-12 left-1/2 transform -translate-x-1/2 text-center text-red-500 text-xl">
                        Username already in use
                    </p>
                )}
                {passwordError && (
                    <p className="absolute w-full -bottom-12 left-1/2 transform -translate-x-1/2 text-center text-red-500 text-xl">
                        Password must be at least 6 characters long
                    </p>
                )}
            </div>
        </div>
    );
};

export default Register;
