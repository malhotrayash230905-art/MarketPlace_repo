import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, ShieldCheck, Zap, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [latestListings, setLatestListings] = useState([]);
  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);
  const navigate = useNavigate();

  const heroImages = [
    '/hero1.jpg',
    '/hero2.jpg',
    '/hero3.jpg',
    '/hero4.jpg'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIdx((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        
        if (!user || !user.collegeId) {
          setLatestListings([]);
          return;
        }

        const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/latest?collegeId=${user.collegeId}`;
        const res = await axios.get(url);
        setLatestListings(res.data);
      } catch (err) {
        console.error("Failed to fetch latest products", err);
      }
    };
    fetchLatest();
  }, []);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-accent/10 rounded-3xl p-8 md:p-12 border border-blue-100 flex flex-col md:flex-row items-center gap-8 overflow-hidden">
        <div className="flex-1 space-y-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-dark via-primary to-accent leading-[1.1] tracking-tight pb-2">
              Your Campus. <br/>Your UniBazaar.
            </h1>
            <p className="mt-6 text-xl text-gray-500 max-w-xl font-medium leading-relaxed">
              Discover exclusive deals from your peers in a secure, verified environment. Trade smarter, not harder.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/category/general" className="btn-primary text-lg px-8 py-3">Start Exploring</Link>
            <Link to="/sell" className="px-8 py-3 rounded-xl font-medium text-primary bg-white border border-gray-200 hover:border-primary hover:shadow-sm transition-all">List an Item</Link>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.4 }}
             className="flex flex-wrap gap-x-6 gap-y-2 pt-4 text-sm font-medium text-gray-500"
          >
            <div className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-500" /> AI Verified Listings</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-500" /> Campus Only UniBazaar</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-500" /> Safe Student Trading</div>
          </motion.div>
        </div>

        <div className="flex-1 w-full relative h-[400px] flex items-center justify-center overflow-hidden rounded-3xl neo-outline">
          <AnimatePresence>
            <motion.img
              key={currentHeroIdx}
              src={heroImages[currentHeroIdx]}
              alt="Aesthetic Campus Item"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute w-full h-full object-cover z-10"
            />
          </AnimatePresence>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-0"></div>
        </div>
      </section>

      {/* Latest Listings */}
      {latestListings.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-3xl font-bold text-dark tracking-tight">Fresh on Campus</h2>
            <Link to="/category/common" className="text-primary font-medium hover:underline">View all</Link>
          </div>
          
          <div className="relative w-full overflow-hidden py-4 -mx-4 px-4">
            <div className="absolute left-0 top-0 w-24 h-full bg-gradient-to-r from-secondary to-transparent z-10 pointer-events-none"></div>
            <div className="flex w-full overflow-hidden">
              <div 
                className="flex gap-6 items-stretch w-max"
                style={{
                  animation: `customMarquee ${Math.max(15, latestListings.length * 8)}s linear infinite`
                }}
              >
                {/* No duplicates used! Exactly as requested. Starts off-screen right, goes completely off-screen left, then loops. */}
                {latestListings.map((item, idx) => (
                  <div key={`${item._id}-${idx}`} className="w-[300px] flex-shrink-0">
                     <ProductCard product={item} onClick={() => navigate(`/category/${item.category.toLowerCase()}`)} />
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-secondary to-transparent z-10 pointer-events-none"></div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <Zap size={24} />, title: "AI-Powered", desc: "Auto-generated descriptions and smart search to find exactly what you need." },
          { icon: <ShieldCheck size={24} />, title: "Verified Listings", desc: "Every item is automatically checked for spam and accuracy before listing." },
          { icon: <TrendingUp size={24} />, title: "Smart Recommendations", desc: "Discover products tailored to your interests and recent views." }
        ].map((feature, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + idx*0.1 }}
            key={idx} 
            className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/40 hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default Home;
