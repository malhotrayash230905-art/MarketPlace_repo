import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Tag, Package, Clock, Info, CheckCircle, CreditCard } from 'lucide-react';
import axios from 'axios';

const ProductModal = ({ product, onClose, onPurchaseSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    // Dynamically load Razorpay script
    const loadRazorpayScript = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    };
    loadRazorpayScript();
  }, []);

  const handleBuyNow = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!token) {
        alert("Please login to buy items.");
        window.location.href = '/login';
        return;
      }

      const config = {
        headers: { 'x-auth-token': token }
      };

      // 1. Create Order on Backend
      const { data: orderData } = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payment/create-order`,
        { productId: product._id },
        config
      );

      // 2. Open Razorpay Checkout
      const options = {
        key: 'rzp_test_T5SmTGjJG62z9c', // Your test key ID
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'UniBazaar',
        description: `Purchase of ${product.title}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            // 3. Verify Payment on Backend
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payment/verify`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                productId: product._id,
                amount: orderData.amount,
                sellerId: product.sellerId
              },
              config
            );

            if (verifyRes.data.msg === 'Payment successful') {
              setReceiptData({
                orderId: verifyRes.data.order._id,
                razorpayPaymentId: response.razorpay_payment_id,
                amount: orderData.amount / 100,
                title: product.title,
                date: new Date().toLocaleString(),
                sellerContact: product.contactNumber
              });
              if (onPurchaseSuccess) onPurchaseSuccess(product._id);
            }
          } catch (err) {
            console.error('Payment Verification Failed:', err);
            alert('Payment Verification Failed!');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#f97316' // Using our primary color theme approximately
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        alert(`Payment Failed: ${response.error.description}`);
      });
      rzp.open();

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Error initiating checkout');
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-dark/40 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-dark hover:bg-white transition-colors shadow-sm"
          >
            <X size={20} />
          </button>

          {/* Image Section */}
          <div className="w-full md:w-1/2 bg-gray-100 relative min-h-[300px] md:min-h-full">
            <img
              src={product.imageUrl || 'https://via.placeholder.com/600'}
              alt={product.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 p-8 overflow-y-auto flex flex-col">
            
            {receiptData ? (
              // RECEIPT VIEW
              <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle size={40} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-dark mb-2">Payment Successful!</h2>
                  <p className="text-gray-500">Your order has been confirmed.</p>
                </div>
                
                <div className="w-full bg-gray-50 p-6 rounded-2xl border border-gray-100 text-left space-y-3">
                  <h3 className="font-bold text-lg text-dark border-b pb-2">Receipt</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Item</span>
                    <span className="font-semibold text-dark">{receiptData.title}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Amount Paid</span>
                    <span className="font-semibold text-dark">₹{receiptData.amount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Transaction ID</span>
                    <span className="font-mono text-xs text-dark">{receiptData.razorpayPaymentId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Date</span>
                    <span className="text-dark text-xs">{receiptData.date}</span>
                  </div>
                  <div className="pt-3 mt-3 border-t">
                    <p className="text-sm text-gray-500 mb-1">Seller Contact:</p>
                    <a href={`tel:${receiptData.sellerContact}`} className="font-bold text-primary flex items-center gap-2">
                      <Phone size={16} /> {receiptData.sellerContact}
                    </a>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full btn-primary py-4 mt-4"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              // PRODUCT VIEW
              <>
                <div className="space-y-6 flex-1">
                  {/* Header */}
                  <div>
                    <span className="inline-block px-3 py-1 bg-blue-50 text-primary text-sm font-medium rounded-lg mb-3">
                      {product.category}
                    </span>
                    <h2 className="text-3xl font-bold text-dark leading-tight">{product.title}</h2>
                    <div className="text-3xl font-bold text-primary mt-2">₹{product.price}</div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <h3 className="flex items-center gap-2 font-semibold text-gray-800">
                      <Info size={18} className="text-gray-400" />
                      Description
                    </h3>
                    <p className="text-gray-600 leading-relaxed bg-secondary p-4 rounded-xl text-sm">
                      {product.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl bg-gray-50">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm">
                        <Package size={20} />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Quantity</div>
                        <div className="font-semibold text-gray-800">{product.quantity} Available</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl bg-gray-50">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm">
                        <Clock size={20} />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Listed</div>
                        <div className="font-semibold text-gray-800">
                          {new Date(product.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleBuyNow}
                    disabled={loading || product.quantity < 1}
                    className="flex-1 btn-primary flex items-center justify-center gap-2 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CreditCard size={20} />
                    {loading ? 'Processing...' : 'Buy Now'}
                  </button>
                  <a
                    href={`tel:${product.contactNumber}`}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-dark font-bold rounded-xl flex items-center justify-center gap-2 py-4 text-lg transition-colors"
                  >
                    <Phone size={20} />
                    Contact Seller
                  </a>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductModal;
