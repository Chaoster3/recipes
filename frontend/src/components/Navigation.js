import React from 'react';
import { FaSearch, FaHeart, FaPen, FaSignOutAlt, FaUtensils, FaShoppingCart} from 'react-icons/fa'; // Importing the utensils icon

const Navigation = ({ route, routeChange, userChange }) => {
    const signout = () => {
        routeChange("login");
        userChange('');
    };

    return (
        <nav className="fixed left-0 top-0 h-full w-80 bg-white shadow-md flex flex-col p-8 rounded-r-2xl">
            {/* Logo */}
            <div className="mb-10 text-center">
                <h1 className="text-5xl font-extrabold text-orange-500 tracking-wide flex items-center space-x-3">
                    <FaUtensils size={40} /> {/* Added utensils icon */}
                    <span>Delish</span>
                </h1>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col space-y-6 mt-6">
                <p
                    className={`flex items-center space-x-5 p-5 rounded-lg text-xl font-medium cursor-pointer transition duration-200 ${route === 'search' ? 'bg-orange-500 text-white shadow-lg' : 'hover:bg-orange-100 text-gray-700'
                        }`}
                    onClick={() => routeChange('search')}
                >
                    <FaSearch size={26} />
                    <span>Search</span>
                </p>
                <p
                    className={`flex items-center space-x-5 p-5 rounded-lg text-xl font-medium cursor-pointer transition duration-200 ${route === 'favorites' ? 'bg-orange-500 text-white shadow-lg' : 'hover:bg-orange-100 text-gray-700'
                        }`}
                    onClick={() => routeChange('favorites')}
                >
                    <FaHeart size={26} />
                    <span>Favorites</span>
                </p>
                <p
                    className={`flex items-center space-x-5 p-5 rounded-lg text-xl font-medium cursor-pointer transition duration-200 ${route === 'posts' ? 'bg-orange-500 text-white shadow-lg' : 'hover:bg-orange-100 text-gray-700'
                        }`}
                    onClick={() => routeChange('posts')}
                >
                    <FaPen size={26} />
                    <span>Reviews</span>
                </p>
                <p
                    className={`flex items-center space-x-5 p-5 rounded-lg text-xl font-medium cursor-pointer transition duration-200 ${route === 'shopping' ? 'bg-orange-500 text-white shadow-lg' : 'hover:bg-orange-100 text-gray-700'
                        }`}
                    onClick={() => routeChange('shopping')}
                >
                    <FaShoppingCart size={26} />
                    <span>Shopping Cart</span>
                </p>
            </div>

            {/* Sign Out Button */}
            <div className="mt-auto">
                <p
                    className="flex items-center space-x-5 p-5 rounded-lg text-xl font-medium cursor-pointer text-red-500 hover:bg-red-100 transition duration-200"
                    onClick={signout}
                >
                    <FaSignOutAlt size={26} />
                    <span>Sign Out</span>
                </p>
            </div>
        </nav>
    );
};

export default Navigation;