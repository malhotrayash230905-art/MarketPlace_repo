import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import SellItem from './pages/SellItem';
import Profile from './pages/Profile';
import { AuthModalProvider } from './components/AuthModal';

import StaticPage from './pages/StaticPage';

const App = () => {
  return (
    <AuthModalProvider>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/category/:type" element={<Layout><CategoryPage /></Layout>} />
        <Route path="/sell" element={<Layout><SellItem /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        {['/help', '/safety', '/guidelines', '/terms', '/privacy', '/cookies'].map(path => (
          <Route key={path} path={path} element={<Layout><StaticPage /></Layout>} />
        ))}
      </Routes>
    </AuthModalProvider>
  );
};

export default App;
