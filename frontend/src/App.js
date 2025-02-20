import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import Posts from './pages/Posts';
import Shopping from './pages/Shopping';

import './App.css';

const App = () => {
  const [route, setRoute] = useState('login');
  const [username, setUsername] = useState('');

  return (
    <div className="h-screen flex">
      {/* Navigation - fixed width */}
      {route !== 'login' && route !== 'register' && (
        <div className="w-80 flex-shrink-0">
          <Navigation
            route={route}
            routeChange={setRoute}
            userChange={setUsername}
          />
        </div>
      )}

      {/* Main Content Area - takes remaining width */}
      <div
        className={`flex-1 bg-[#fde7cb] overflow-auto ${route === 'login' || route === 'register'
            ? 'flex justify-center items-center'
            : 'p-6'
          }`}
      >
        {route === 'login' && (
          <Login routeChange={setRoute} userChange={setUsername} />
        )}
        {route === 'register' && (
          <Register routeChange={setRoute} userChange={setUsername} />
        )}
        {route === 'favorites' && <Favorites username={username} />}
        {route === 'posts' && <Posts username={username} />}
        {route === 'search' && <Search username={username} />}
        {route === 'shopping' && <Shopping username={username} />}
      </div>
    </div>
  );
};

export default App;