import React, {useState} from 'react';
import Navigation from './components/Navigation';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import Posts from './pages/Posts';
import './App.css';

const App = () => {
  const [route, setRoute] = useState('login');
  const [username, setUsername] = useState('');

  if (route === 'login') {
    return (
      <div className="App h-lvh flex flex-col">
      <Login routeChange={setRoute} userChange={setUsername}/>
    </div>
    )
  }
  else if (route === 'register') {
    return (
      <div className="App h-lvh flex flex-col">
        <Register routeChange={setRoute} userChange={setUsername} />
      </div>
      )
  }
  else if (route === 'favorites') {
    return (
      <div className="App h-lvh flex flex-col">
        <Navigation route={route} routeChange={setRoute} userChange={setUsername} />
        <Favorites username={username} />
      </div>
    );
  }
  else if (route === 'posts') {
    return (
      <div className="App h-lvh flex flex-col">
        <Navigation route={route} routeChange={setRoute} userChange={setUsername} />
        <Posts username={username} />
      </div>
    );
  }
  else {
    return (
      <div className="App flex flex-col font-">
        <Navigation route={route} routeChange={setRoute} userChange={setUsername} />
        <Search username={username} />
      </div>
      );
  }
}

export default App;
