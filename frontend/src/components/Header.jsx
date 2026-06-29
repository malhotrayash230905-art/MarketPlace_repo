import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, LogIn, LogOut, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthModal } from './AuthModal';

const Header = () => {
  const { openAuthModal } = useAuthModal();
  const [flipCount, setFlipCount] = useState(0);
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <header className="bg-[#FFF1D6]/90 backdrop-blur-md shadow-sm border-b-2 border-dark/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-28 items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <motion.img 
              src="/logo.png" 
              alt="Unibazaar Logo" 
              onClick={() => setFlipCount(flipCount + 1)}
              animate={{ rotateY: flipCount * 360 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="w-28 h-28 object-contain -ml-2 drop-shadow-sm mix-blend-multiply contrast-125 cursor-pointer" 
            />
            <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              UniBazaar
            </Link>
            {user && user.collegeName && (
              <span className="ml-3 px-3 py-1 bg-blue-50 text-primary text-xs font-semibold rounded-full hidden md:inline-block neo-outline">
                📍 {user.collegeName}
              </span>
            )}
          </div>

          {/* Middle Section (Animated Aesthetic) */}
          <div className="hidden lg:flex flex-1 justify-center relative overflow-hidden h-full pointer-events-none mx-8 items-center">
             <motion.div 
               animate={{ x: [-20, 20, -20], y: [-5, 5, -5] }}
               transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
               className="absolute w-32 h-32 bg-primary/20 rounded-full blur-2xl"
             />
              <motion.div 
               animate={{ x: [20, -20, 20], y: [5, -5, 5] }}
               transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
               className="absolute right-1/4 w-24 h-24 bg-accent/20 rounded-full blur-2xl"
             />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="text-gray-600 hover:text-primary transition-colors flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-blue-50 transition-colors neo-outline">
                    <User size={20} />
                  </div>
                  <span className="font-medium text-dark hidden sm:block">{user.name}</span>
                </Link>
              </div>
            ) : (
              <button onClick={() => openAuthModal('login')} className="btn-primary flex items-center gap-2">
                <LogIn size={18} />
                <span>Login / Signup</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
