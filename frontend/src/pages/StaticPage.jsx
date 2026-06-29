import React from 'react';
import { useLocation } from 'react-router-dom';

const pagesData = {
  '/help': {
    title: 'Help Center',
    content: (
      <div className="space-y-6 text-gray-700">
        <h2 className="text-2xl font-bold text-dark">How can we help you?</h2>
        <p>Welcome to the Unibazaar Help Center. Here you can find answers to the most common questions about buying and selling on our platform.</p>
        
        <h3 className="text-xl font-semibold mt-4 text-dark">Buying Items</h3>
        <p>To buy an item, simply browse the categories, select an item you like, and contact the seller through the provided details. Always meet in safe, public places on campus to exchange items.</p>
        
        <h3 className="text-xl font-semibold mt-4 text-dark">Selling Items</h3>
        <p>Click on "List an Item" to start selling. Make sure to provide clear pictures and an accurate description. Once an item is sold, please mark it as sold or delete the listing.</p>
      </div>
    )
  },
  '/safety': {
    title: 'Safety Center',
    content: (
      <div className="space-y-6 text-gray-700">
        <h2 className="text-2xl font-bold text-dark">Your Safety is Our Priority</h2>
        <p>Unibazaar is designed exclusively for college students. By requiring college email verification, we maintain a secure environment.</p>
        
        <ul className="list-disc pl-5 space-y-2">
          <li>Always meet in well-lit, public areas on campus.</li>
          <li>Do not share unnecessary personal information.</li>
          <li>Inspect items thoroughly before making a payment.</li>
          <li>Report any suspicious activity or listings immediately.</li>
        </ul>
      </div>
    )
  },
  '/guidelines': {
    title: 'Community Guidelines',
    content: (
      <div className="space-y-6 text-gray-700">
        <h2 className="text-2xl font-bold text-dark">Community Guidelines</h2>
        <p>To keep Unibazaar a safe and friendly place for everyone, we ask that you follow these rules:</p>
        
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Be respectful:</strong> Treat all buyers and sellers with respect.</li>
          <li><strong>No prohibited items:</strong> Do not list illegal items, weapons, hazardous materials, or recalled items.</li>
          <li><strong>Be honest:</strong> Provide accurate descriptions and don't misrepresent items.</li>
          <li><strong>No spamming:</strong> Do not post duplicate listings.</li>
        </ul>
      </div>
    )
  },
  '/terms': {
    title: 'Terms of Service',
    content: (
      <div className="space-y-6 text-gray-700">
        <h2 className="text-2xl font-bold text-dark">Terms of Service</h2>
        <p>By accessing or using Unibazaar, you agree to be bound by these Terms of Service.</p>
        <p>We are a platform that facilitates connections between buyers and sellers. We do not own the items listed and are not responsible for any transactions that take place between users.</p>
        <p>Users must be enrolled students with a valid college email address. Any abuse of the platform will result in immediate termination of your account.</p>
      </div>
    )
  },
  '/privacy': {
    title: 'Privacy Policy',
    content: (
      <div className="space-y-6 text-gray-700">
        <h2 className="text-2xl font-bold text-dark">Privacy Policy</h2>
        <p>We take your privacy seriously. This policy describes how we collect, use, and protect your personal information.</p>
        <p>We collect information such as your name, college email, and browsing activity on our site to improve your experience. We will never sell your personal information to third parties.</p>
      </div>
    )
  },
  '/cookies': {
    title: 'Cookie Policy',
    content: (
      <div className="space-y-6 text-gray-700">
        <h2 className="text-2xl font-bold text-dark">Cookie Policy</h2>
        <p>Unibazaar uses cookies to ensure you get the best experience on our website.</p>
        <p>Cookies are small text files that are placed on your device to help the site provide a better user experience. In general, cookies are used to retain user preferences and provide anonymized tracking data.</p>
      </div>
    )
  }
};

const StaticPage = () => {
  const location = useLocation();
  const pageData = pagesData[location.pathname] || {
    title: 'Page Not Found',
    content: <p>The page you are looking for does not exist.</p>
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white/70 backdrop-blur-md border border-white/50 rounded-3xl p-8 md:p-12 shadow-xl">
        <h1 className="text-4xl font-extrabold text-dark mb-8 pb-4 border-b border-gray-100">
          {pageData.title}
        </h1>
        <div className="prose prose-lg max-w-none">
          {pageData.content}
        </div>
      </div>
    </div>
  );
};

export default StaticPage;
