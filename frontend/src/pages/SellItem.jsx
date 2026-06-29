import React, { useState } from 'react';
import { Upload, Sparkles, CheckCircle, XCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SellItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    quantity: 1,
    contactNumber: ''
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  
  // Verification States
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [imageValidStatus, setImageValidStatus] = useState(null); // 'checking' | 'valid' | 'invalid'
  const [textValidStatus, setTextValidStatus] = useState(null); // 'checking' | 'valid' | 'invalid'
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setImageValidStatus(null); // Reset validation on new image
    }
  };

  const handleGenerateDesc = async () => {
    setIsGeneratingDesc(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/generate-description`, {
        title: formData.title,
        imageUrl: imagePreview
      }, { headers: { 'x-auth-token': token } });
      
      setFormData(prev => ({ ...prev, description: res.data.description }));
    } catch (err) {
      alert("Failed to generate description. Please check your title/image or API limits.");
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const handleVerifyImage = async () => {
    if (!formData.title || !imagePreview) return alert("Please provide title and image first.");
    setImageValidStatus('checking');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/verify-image`, {
        title: formData.title,
        imageUrl: imagePreview
      }, { headers: { 'x-auth-token': token } });
      setImageValidStatus(res.data.isValid ? 'valid' : 'invalid');
    } catch (err) {
      setImageValidStatus('invalid');
    }
  };

  const handleVerifyText = async () => {
    if (!formData.description) return alert("Please provide a description first.");
    setTextValidStatus('checking');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/verify-text`, {
        text: formData.description
      }, { headers: { 'x-auth-token': token } });
      setTextValidStatus(res.data.isValid ? 'valid' : 'invalid');
    } catch (err) {
      setTextValidStatus('invalid');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageValidStatus !== 'valid' || textValidStatus !== 'valid') {
      alert("Please verify both the image and text before submitting.");
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const submitData = {
        ...formData,
        contactNumber: '+91 ' + formData.contactNumber,
        imageUrl: imagePreview
      };

      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`, submitData, {
        headers: { 'x-auth-token': token }
      });

      setSuccessMessage('Item listed successfully! Redirecting...');
      setTimeout(() => {
        navigate(`/category/${formData.category.toLowerCase()}`);
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to list item.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-dark">List an Item for Sale</h1>
        <p className="text-gray-500 mt-2">Fill in the details below. Our AI will help you write descriptions and keep UniBazaar safe.</p>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-xl flex items-center gap-3">
          <CheckCircle size={24} />
          <span className="font-semibold text-lg">{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
        
        {/* Step 1: Image Upload */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">1. Upload Product Image</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden relative group">
              {imagePreview ? (
                <div className="w-full h-full relative flex items-center justify-center bg-gray-100">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white font-medium flex items-center gap-2"><ImageIcon size={20}/> Change Image</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400">PNG, JPG or WEBP (MAX. 5MB)</p>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} required />
            </label>
          </div>
        </div>

        {/* Step 2: Title */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">2. Product Title</label>
          <input
            type="text"
            name="title"
            required
            className="input-field"
            placeholder="e.g. Casio fx-991ES Calculator"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        {/* Step 3: AI Description Generation */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            3. AI Generate Description <span className="text-gray-400 font-normal">(Optional but Recommended)</span>
          </label>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
             <p className="text-sm text-gray-600">Let our AI write a professional description based on your title and image.</p>
             <button
              type="button"
              onClick={handleGenerateDesc}
              disabled={isGeneratingDesc || !formData.title || !imagePreview}
              className="text-sm flex items-center gap-1.5 px-4 py-2 bg-white text-primary border border-blue-200 rounded-lg hover:shadow-md transition-all disabled:opacity-50 font-medium whitespace-nowrap"
            >
              <Sparkles size={16} />
              {isGeneratingDesc ? 'Generating...' : 'Auto-Generate'}
            </button>
          </div>
        </div>

        {/* Step 4: Manual Description */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            4. Manual Description
          </label>
          <textarea
            name="description"
            rows={4}
            className="input-field resize-none"
            placeholder="Describe the condition, age, and any other details..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Step 5 & 6: AI Verification */}
        <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 space-y-4">
          <h3 className="text-sm font-semibold text-dark flex items-center gap-2">
            <ShieldCheckIcon /> AI Security Checks
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Step 5: Verify Image */}
            <button
              type="button"
              onClick={handleVerifyImage}
              disabled={imageValidStatus === 'checking'}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium transition-all border ${
                imageValidStatus === 'valid' ? 'bg-green-50 text-green-700 border-green-200' :
                imageValidStatus === 'invalid' ? 'bg-red-50 text-red-700 border-red-200' :
                'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {imageValidStatus === 'checking' ? 'Checking...' : 
               imageValidStatus === 'valid' ? <><CheckCircle size={18}/> Image Verified</> :
               imageValidStatus === 'invalid' ? <><AlertCircle size={18}/> Re-check Image</> :
               '5. Verify Image'}
            </button>

            {/* Step 6: Verify Text */}
            <button
              type="button"
              onClick={handleVerifyText}
              disabled={textValidStatus === 'checking'}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium transition-all border ${
                textValidStatus === 'valid' ? 'bg-green-50 text-green-700 border-green-200' :
                textValidStatus === 'invalid' ? 'bg-red-50 text-red-700 border-red-200' :
                'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {textValidStatus === 'checking' ? 'Checking...' : 
               textValidStatus === 'valid' ? <><CheckCircle size={18}/> Text Safe</> :
               textValidStatus === 'invalid' ? <><XCircle size={18}/> Policy Violation</> :
               '6. Verify Text'}
            </button>
          </div>
          {(imageValidStatus === 'invalid' || textValidStatus === 'invalid') && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
              <AlertCircle size={16} className="inline mr-1" />
              There was an issue verifying your listing. Please make sure the image matches the title and the description is appropriate.
            </p>
          )}
        </div>

        {/* Details Grid (Steps 7, 8, 9, 10) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Step 7: Price */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">7. Price (₹)</label>
            <input
              type="number"
              name="price"
              required
              min="0"
              className="input-field"
              placeholder="e.g. 500"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          {/* Step 8: Category */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">8. Category</label>
            <select
              name="category"
              required
              className="input-field"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="" disabled>Select a category</option>
              <option value="Mens">Mens</option>
              <option value="Womens">Womens</option>
              <option value="General">General</option>
            </select>
          </div>

          {/* Step 9: Quantity */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">9. Quantity</label>
            <input
              type="number"
              name="quantity"
              required
              min="1"
              className="input-field"
              value={formData.quantity}
              onChange={handleChange}
            />
          </div>

          {/* Step 10: Contact Number */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">10. Contact Number</label>
            <div className="flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                +91
              </span>
              <input
                type="tel"
                name="contactNumber"
                required
                pattern="^[0-9]{10}$"
                maxLength="10"
                className="flex-1 min-w-0 block w-full px-4 py-2 border border-gray-300 rounded-none rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
                placeholder="9876543210"
                value={formData.contactNumber}
                onChange={handleChange}
              />
            </div>
            <p className="text-xs text-gray-400">Enter exactly 10 digits</p>
          </div>
        </div>

        {/* Step 11: Submit */}
        <div className="pt-4 border-t border-gray-100">
          <button
            type="submit"
            className="w-full btn-primary py-4 text-lg"
          >
            11. Put to Sell
          </button>
        </div>

      </form>
    </div>
  );
};

// Helper component for icon
const ShieldCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
);

export default SellItem;
