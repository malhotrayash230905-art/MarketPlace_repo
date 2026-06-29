import React from 'react';
import { motion } from 'framer-motion';

const ProductCard = ({ product, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="card cursor-pointer group"
      onClick={() => onClick(product)}
    >
      <div className="aspect-square w-full relative overflow-hidden bg-gray-100">
        {/* Placeholder if no image */}
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-gray-100 flex items-center justify-center text-gray-400">
          Image
        </div>
        <img
          src={product.imageUrl || 'https://via.placeholder.com/400'}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 mix-blend-multiply"
          loading="lazy"
        />
      </div>
      <div className="p-4 space-y-2 bg-white">
        <h3 className="font-semibold text-lg text-dark truncate">{product.title}</h3>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-primary">₹{product.price}</span>
          <span className="text-xs font-medium bg-secondary text-gray-600 px-2 py-1 rounded-md">
            {new Date(product.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
