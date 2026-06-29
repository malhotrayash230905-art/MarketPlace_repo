import React, { createContext, useContext, useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Create Context
const AuthModalContext = createContext();

export const useAuthModal = () => useContext(AuthModalContext);

export const AuthModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' or 'signup'

  const openAuthModal = (initialMode = 'login') => {
    setMode(initialMode);
    setIsOpen(true);
  };

  const closeAuthModal = () => {
    setIsOpen(false);
  };

  return (
    <AuthModalContext.Provider value={{ isOpen, mode, openAuthModal, closeAuthModal, setMode }}>
      {children}
      <AuthModal />
    </AuthModalContext.Provider>
  );
};

const AuthModal = () => {
  const { isOpen, mode, closeAuthModal, setMode } = useAuthModal();
  
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', confirmPassword: '', age: '', gender: '', collegeId: '' 
  });
  
  const [colleges, setColleges] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isOpen && mode === 'signup' && colleges.length === 0) {
      const fetchColleges = async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/colleges`);
          setColleges(res.data);
        } catch (err) {
          console.error("Failed to fetch colleges", err);
        }
      };
      fetchColleges();
    }
  }, [isOpen, mode, colleges.length]);

  // Reset state when closing or switching mode
  useEffect(() => {
    setError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    if (!isOpen) {
       setFormData({ name: '', email: '', password: '', confirmPassword: '', age: '', gender: '', collegeId: '' });
       setSearchQuery('');
    }
  }, [isOpen, mode]);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const filteredColleges = colleges.filter(college =>
    college.collegeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (!formData.collegeId) {
        setError('Please select a valid college from the suggestions');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, { email: formData.email, password: formData.password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      } else {
        const payload = {
          name: formData.name, email: formData.email, password: formData.password,
          age: Number(formData.age), gender: formData.gender, collegeId: formData.collegeId
        };
        const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/signup`, payload);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      closeAuthModal();
      window.location.href = '/'; // Hard reload to apply token globally
    } catch (err) {
      setError(err.response?.data?.msg || `An error occurred during ${mode}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAuthModal}
            className="absolute inset-0 bg-dark/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <button 
              onClick={closeAuthModal}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-50 text-gray-500 hover:text-dark hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>

            <div className="p-8">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4 -ml-4">
                  <img src="/logo.png" alt="Unibazaar Logo" className="w-40 h-40 object-contain drop-shadow-md mix-blend-multiply contrast-125" />
                </div>
                <h2 className="text-2xl font-extrabold text-dark">
                  {mode === 'login' ? 'Welcome back' : 'Create an account'}
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                  <button 
                    type="button"
                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                    className="font-medium text-primary hover:text-accent transition-colors"
                  >
                    {mode === 'login' ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100">
                    {error}
                  </div>
                )}

                {mode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text" name="name" required className="input-field pl-10"
                        placeholder="John Doe" value={formData.name} onChange={handleChange}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email" name="email" required className="input-field pl-10"
                      placeholder="you@example.com" value={formData.email} onChange={handleChange}
                    />
                  </div>
                </div>

                {mode === 'signup' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                      <input
                        type="number" name="age" required min="16" max="100"
                        className="input-field" placeholder="20" value={formData.age} onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        name="gender" required className="input-field py-2 px-3 bg-white"
                        value={formData.gender} onChange={handleChange}
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                  </div>
                )}

                {mode === 'signup' && (
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">College / University</label>
                    <input
                      type="text" required className="input-field"
                      placeholder="Search and select college..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowDropdown(true);
                        setFormData(prev => ({ ...prev, collegeId: '' }));
                      }}
                      onFocus={() => setShowDropdown(true)}
                      onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    />
                    {showDropdown && searchQuery && (
                      <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                        {filteredColleges.length > 0 ? (
                          filteredColleges.map((college) => (
                            <button
                              key={college._id} type="button"
                              className="w-full text-left px-4 py-2 hover:bg-primary/5 hover:text-primary transition-colors text-sm border-b border-gray-50 last:border-b-0"
                              onMouseDown={() => {
                                setSearchQuery(college.collegeName);
                                setFormData(prev => ({ ...prev, collegeId: college._id }));
                                setShowDropdown(false);
                              }}
                            >
                              <span className="font-semibold block">{college.collegeName}</span>
                              <span className="text-xs text-gray-400 block">{college.city}, {college.state}</span>
                            </button>
                          ))
                        ) : (
                          <div className="p-3 text-sm text-gray-500 text-center">No colleges found</div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"} name="password" required
                      className="input-field pl-10 pr-10" placeholder="••••••••"
                      value={formData.password} onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"} name="confirmPassword" required
                        className="input-field pl-10 pr-10" placeholder="••••••••"
                        value={formData.confirmPassword} onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit" disabled={loading}
                  className="w-full mt-4 flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (mode === 'login' ? 'Signing in...' : 'Creating Account...') : (mode === 'login' ? 'Sign in' : 'Create Account')}
                  {!loading && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
