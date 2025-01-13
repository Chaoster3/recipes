import React, {useState} from 'react';

const Register = ({routeChange, userChange}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [used, setUsed] = useState(false);

    const usernameChange = (event) => {
        setUsername(event.target.value)
    }

    const passwordChange = (event) => {
        setPassword(event.target.value)
    }
    
    const submitRegister = async () => {
        if (username !== "") {
            const submitResponse = await fetch('http://localhost:3001/register', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
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
    }

    return (
            <div className='flex flex-col items-center justify-center h-screen'>
                <div className='relative bg-white p-8 rounded-md shadow-md mb-4'>
                    <p className='mb-6 text-center text-3xl font-bold text-blue-700'>
                        Delish
                    </p>
                    <p className='text-center mb-4 text-lg font-semibold'>
                        Sign up for an account
                    </p>
                    <div className='mb-2'>
                        <input
                            className='w-full border p-2'
                            onChange={usernameChange}
                            type='text'
                            placeholder='Username'
                        />
                    </div>
                    <div className='mb-2'>
                        <input
                            className='w-full border p-2'
                            onChange={passwordChange}
                            type='password'
                            placeholder='Password'
                        />
                    </div>
                    <button
                        className='w-full bg-blue-500 hover:bg-blue-700 text-white py-2 rounded'
                        onClick={submitRegister}
                    >
                        Register
                    </button>
                    <p className='mt-4 text-center'>
                        Already have an account?{' '}
                        <span
                            className='text-blue-500 cursor-pointer'
                            onClick={() => routeChange('login')}
                        >
                            Sign In
                        </span>
                    </p>
                    {used && (
                        <p className='absolute w-full -bottom-14 left-1/2 transform -translate-x-1/2 text-center text-red-500'>
                            Username already in use
                        </p>
                    )}
                </div>
            </div>
    );
}

export default Register;