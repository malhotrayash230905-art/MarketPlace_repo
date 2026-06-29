import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-gray-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="text-2xl font-bold text-white flex items-center gap-2">
             <img src="/logo.png" alt="Unibazaar Logo" className="w-28 h-28 object-contain drop-shadow-md invert contrast-150 mix-blend-screen" />
             UniBazaar
          </div>
          <p className="text-sm text-gray-400">
            Your premium AI-powered college marketplace for buying and selling items safely.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/category/mens" className="hover:text-white transition-colors">Mens</Link></li>
            <li><Link to="/category/womens" className="hover:text-white transition-colors">Womens</Link></li>
            <li><Link to="/category/general" className="hover:text-white transition-colors">General</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
            <li><Link to="/safety" className="hover:text-white transition-colors">Safety Center</Link></li>
            <li><Link to="/guidelines" className="hover:text-white transition-colors">Community Guidelines</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-sm text-center">
        <p>&copy; {new Date().getFullYear()} UniBazaar. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
