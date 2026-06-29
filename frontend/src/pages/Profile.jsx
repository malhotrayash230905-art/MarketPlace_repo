import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, GraduationCap, Calendar, Trash2, ShieldAlert, Award, X, Check, DollarSign, Receipt, PackageCheck, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
  const [profile, setProfile] = useState({ name: '', email: '', age: '', gender: '', collegeName: '' });
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Tabs: 'active', 'sold', 'receipts'
  const [activeTab, setActiveTab] = useState('active');

  // Deletion Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const config = {
          headers: { 'x-auth-token': token }
        };

        // Fetch fresh profile info
        const profileRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/profile/me`, config);
        setProfile(profileRes.data);
        
        const localUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...localUser, ...profileRes.data }));

        // Fetch user's listings
        const listingsRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/my-listings`, config);
        setListings(listingsRes.data);

        // Fetch user's orders (purchased)
        const ordersRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payment/my-orders`, config);
        setOrders(ordersRes.data);

        // Fetch user's sales
        const salesRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payment/my-sales`, config);
        setSales(salesRes.data);

      } catch (err) {
        console.error("Error fetching profile details", err);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/';
        } else {
          setMessage({ type: 'error', text: 'Failed to load profile data.' });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const config = {
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token 
        }
      };

      const payload = {
        name: profile.name,
        age: profile.age ? Number(profile.age) : undefined,
        gender: profile.gender
      };

      const res = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/profile`, payload, config);
      setProfile(res.data);
      
      const localUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...localUser, ...res.data }));

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => {
        window.dispatchEvent(new Event('storage'));
      }, 500);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.response?.data?.msg || 'Failed to update profile.' });
    } finally {
      setSaveLoading(false);
    }
  };

  const openDeleteConfirm = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteListing = async () => {
    if (!productToDelete) return;
    
    try {
      const config = {
        headers: { 'x-auth-token': token }
      };

      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/${productToDelete._id}`, config);
      
      setListings(prev => prev.filter(item => item._id !== productToDelete._id));
      
      setMessage({ type: 'success', text: 'Listing deleted successfully!' });
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      } else {
        setMessage({ type: 'error', text: err.response?.data?.msg || 'Failed to delete listing. Please try again.' });
      }
      setShowDeleteModal(false);
    }
  };

  const activeListings = listings.filter(item => !item.isSold);
  const amountCollected = sales.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-2">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-dark tracking-tight">Your Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage your account details, listings, and receipts.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-center text-sm border font-medium ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-600 border-green-100' 
            : 'bg-red-50 text-red-600 border-red-100'
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-col gap-8 items-stretch">
        {/* Profile Card & Editing Form */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100">
            <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center text-3xl font-black mb-4">
              {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h2 className="text-2xl font-bold text-dark">{profile.name}</h2>
            <p className="text-gray-400 text-sm mt-1">{profile.email}</p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Full Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="name"
                  required
                  className="input-field"
                  value={profile.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Age</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    name="age"
                    min="16"
                    max="100"
                    className="input-field"
                    value={profile.age || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Gender</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <select
                    name="gender"
                    className="input-field py-2 px-3 bg-white"
                    value={profile.gender || ''}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-400">Email Address (Read-only)</label>
              <input
                type="email"
                disabled
                className="input-field bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed mt-1"
                value={profile.email}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-400">College Name (Read-only)</label>
              <input
                type="text"
                disabled
                className="input-field bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed mt-1"
                value={profile.collegeName || 'Not Set'}
              />
            </div>

            <button
              type="submit"
              disabled={saveLoading}
              className="w-full btn-primary flex items-center justify-center py-3 text-sm"
            >
              {saveLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Listings and Stats Dashboard */}
        <div className="space-y-8">
          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center font-bold shadow-sm">
                <Calendar size={24} />
              </div>
              <div>
                <div className="text-sm text-gray-400">Total Listings</div>
                <div className="text-3xl font-black text-dark">{Math.max(profile.totalListings || 0, listings.length)}</div>
              </div>
            </div>

            {sales.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center font-bold shadow-sm">
                  <DollarSign size={24} />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Amount Collected</div>
                  <div className="text-3xl font-black text-dark">₹{amountCollected}</div>
                </div>
              </div>
            )}
          </div>

          {/* Activity Section */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-50 pb-4 gap-4">
              <h2 className="text-2xl font-bold text-dark">Your Activity</h2>
              <div className="flex bg-gray-50 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('active')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'active' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-dark'}`}
                >
                  Active Listings
                </button>
                {sales.length > 0 && (
                  <button
                    onClick={() => setActiveTab('sold')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'sold' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-dark'}`}
                  >
                    Items Sold
                  </button>
                )}
                {orders.length > 0 && (
                  <button
                    onClick={() => setActiveTab('receipts')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'receipts' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-dark'}`}
                  >
                    Receipts/Bills
                  </button>
                )}
              </div>
            </div>

            {/* Tab: Active Listings */}
            {activeTab === 'active' && (
              activeListings.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <div className="text-5xl mb-4">🛒</div>
                  <h3 className="font-semibold text-lg">No active listings</h3>
                  <p className="text-sm text-gray-400 mt-1">Start selling items you no longer need on campus!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeListings.map((product) => (
                    <div key={product._id} className="card relative group flex flex-col justify-between">
                      <button
                        onClick={() => openDeleteConfirm(product)}
                        className="absolute top-3 right-3 z-10 w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100"
                      >
                        <X size={16} />
                      </button>
                      <div className="relative h-44 w-full bg-gray-50 overflow-hidden border-b border-gray-100">
                        <img src={product.imageUrl} alt={product.title} className="w-full h-full object-contain" />
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <h3 className="font-bold text-dark text-lg line-clamp-1">{product.title}</h3>
                          <p className="text-xs text-gray-400">Listed: {new Date(product.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-primary font-black text-lg">₹{product.price}</span>
                          <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-600 rounded-md font-medium border border-blue-100">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Tab: Items Sold By You */}
            {activeTab === 'sold' && (
              sales.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <div className="text-5xl mb-4">📦</div>
                  <h3 className="font-semibold text-lg">No items sold yet</h3>
                  <p className="text-sm text-gray-400 mt-1">Your sold items will appear here once someone buys them.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sales.map((order) => (
                    <div key={order._id} className="card relative group flex flex-col justify-between bg-gray-50 opacity-80">
                      <div className="relative h-44 w-full bg-white overflow-hidden border-b border-gray-100">
                        <img src={order.productId?.imageUrl} alt={order.productId?.title} className="w-full h-full object-contain grayscale" />
                        <div className="absolute inset-0 bg-dark/10 flex items-center justify-center">
                          <span className="bg-dark/80 text-white px-4 py-2 rounded-lg font-bold tracking-widest text-sm uppercase">SOLD OUT</span>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <h3 className="font-bold text-dark text-lg line-clamp-1">{order.productId?.title}</h3>
                          <p className="text-xs text-gray-400">Sold On: {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex flex-col gap-1 pt-2 border-t border-gray-200 mt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-green-600 font-black text-lg">+ ₹{order.amount}</span>
                            <span className="text-xs px-2.5 py-1 bg-gray-200 text-gray-600 rounded-md font-medium">
                              {order.razorpayPaymentId?.substring(0, 10)}...
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 flex flex-col">
                            <span className="font-semibold text-gray-700">Buyer Info:</span>
                            <span>{order.buyerId?.name || 'Unknown Buyer'}</span>
                            <a href={`mailto:${order.buyerId?.email}`} className="text-primary hover:underline">{order.buyerId?.email}</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Tab: Receipts / Bills (Bought Items) */}
            {activeTab === 'receipts' && (
              orders.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <div className="text-5xl mb-4">🧾</div>
                  <h3 className="font-semibold text-lg">No purchases yet</h3>
                  <p className="text-sm text-gray-400 mt-1">Items you buy will generate receipts here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row gap-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-full md:w-32 h-32 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                        <img src={order.productId?.imageUrl} alt={order.productId?.title} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md">{order.productId?.category}</span>
                              <h3 className="text-xl font-bold text-dark mt-2">{order.productId?.title}</h3>
                            </div>
                            <div className="text-right">
                              <span className="text-2xl font-black text-dark block">₹{order.amount}</span>
                              <span className="text-xs text-green-600 font-medium flex items-center gap-1 justify-end mt-1"><Check size={12}/> Paid</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{order.productId?.description}</p>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="block text-gray-400 text-xs mb-1">Order Date</span>
                            <span className="font-medium text-dark">{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="block text-gray-400 text-xs mb-1">Transaction ID</span>
                            <span className="font-mono text-dark text-xs truncate max-w-[100px] block" title={order.razorpayPaymentId}>{order.razorpayPaymentId}</span>
                          </div>
                          <div className="col-span-2 flex flex-col">
                            <span className="block text-gray-400 text-xs mb-1">Seller Info</span>
                            <span className="font-medium text-dark">{order.sellerId?.name}</span>
                            <div className="flex flex-col gap-2 mt-1">
                              <a href={`mailto:${order.sellerId?.email}`} className="text-primary text-xs hover:underline flex items-center gap-1.5">
                                <Mail size={12} /> {order.sellerId?.email}
                              </a>
                              {order.productId?.contactNumber && (
                                <a href={`tel:${order.productId?.contactNumber}`} className="text-primary text-xs hover:underline flex items-center gap-1.5">
                                  <Phone size={12} /> {order.productId?.contactNumber}
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal Overlay */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-dark/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 space-y-6 text-center"
            >
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <ShieldAlert size={36} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-dark">Confirm Deletion</h3>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                  Are you sure you want to permanently remove <strong className="text-dark font-semibold">"{productToDelete?.title}"</strong> from UniBazaar? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 hover:text-dark transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteListing}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
