import React, {useState} from 'react';

const Login = ({routeChange, userChange}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [incorrect, setIncorrect] = useState(false);

    const usernameChange = (event) => {
        setUsername(event.target.value)
    }

    const passwordChange = (event) => {
        setPassword(event.target.value)
    }
    
    const submitLogin = async () => {
        console.log(username);
        console.log(password)
        const submitResponse = await fetch('http://localhost:3001/signin', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        const submit = await submitResponse.json();
        if (submit === 'login success') {
            routeChange("search");
            userChange(username);
        } else {
            setIncorrect(true);
        }
    }

    return (
        // <div className='place-self-center h-44 w-44 m-44 bg-white'>
        //     <p className=''>Sign in to your account</p>
        //     <input className='w-24' onChange={usernameChange} type='tex'/>
        //     <input className='w-24' onChange={passwordChange} type='tex'/>
        //     <button className="bg-blue-500 hover:bg-blue-700" onClick={submitLogin}>Log in</button>
        //     <p>Don't have an account? </p> <p onClick={() => routeChange("register")}> Sign Up</p>
        // </div>
        <div className='flex flex-col items-center justify-center h-screen'>
            <div className='relative bg-white p-8 rounded-md shadow-md mb-4'>
                <p className='mb-6 text-center text-3xl font-bold text-blue-700'>
                    Delish
                </p>
                <p className='text-center mb-4 text-lg font-semibold'>
                    Sign in to your account
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
                    onClick={submitLogin}
                >
                    Log in
                </button>
                <p className='mt-4 text-center mx-1'>Don't have an account? {' '} 
                    <span className='text-blue-500 cursor-pointer' onClick={() => routeChange("register")}>
                        Sign Up
                    </span>
                </p>
                {incorrect && (
                    <p className='absolute w-full -bottom-14 left-1/2 transform -translate-x-1/2 text-center text-red-500'>
                        Incorrect username/password
                    </p>
                )}
            </div>
        </div>
    );
}

export default Login;