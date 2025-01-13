import React from 'react';

const Navigation = ({route, routeChange, userChange}) => {
    const signout = () => {
        routeChange("login");
        userChange('');
    }

    return (
        <nav className='flex flex-row justify-between p-2 items-center shadow bg-white'>
            <div className='ml-5'>
                <h1 className='text-2xl font-bold text-blue-500'>Delish</h1>
            </div>
            <div className='flex flex-row items-center'>
                <p
                    className={`mr-8 p-2 rounded cursor-pointer ${route === 'search' ? 'text-white bg-blue-500' : ''}`}
                    onClick={() => routeChange('search')}
                >
                    Search
                </p>
                <p
                    className={`mr-8 p-2 rounded cursor-pointer ${route === 'favorites' ? 'text-white bg-blue-500' : ''}`}
                    onClick={() => routeChange('favorites')}
                >
                    Favorites
                </p>
                <p
                    className={`mr-8 p-2 rounded cursor-pointer ${route === 'posts' ? 'text-white bg-blue-500' : ''}`}
                    onClick={() => routeChange('posts')}
                >
                    Reviews
                </p>
                <p className='mr-8 cursor-pointer' onClick={signout}>
                    Sign Out
                </p>
            </div>
        </nav>
    );
}

export default Navigation;