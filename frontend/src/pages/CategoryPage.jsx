import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import axios from 'axios';

const CategoryPage = () => {
  const { type } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        
        if (!user || !user.collegeId) {
          setProducts([]);
          setFilteredProducts([]);
          setLoading(false);
          return;
        }

        const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/category/${type}?collegeId=${user.collegeId}`;
        const res = await axios.get(url);
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    // Reset filters when category changes
    setSearchQuery('');
    setPriceRange({ min: '', max: '' });
  }, [type]);

  const handleSearch = () => {
    let result = products;
    
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        (p.description && p.description.toLowerCase().includes(q))
      );
    }
    
    if (priceRange.min !== '') {
      result = result.filter(p => p.price >= Number(priceRange.min));
    }
    if (priceRange.max !== '') {
      result = result.filter(p => p.price <= Number(priceRange.max));
    }
    
    setFilteredProducts(result);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-dark capitalize">{type} Collection</h1>
          <p className="text-gray-500 mt-1">Discover items listed by other students.</p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-96 relative">
          <input
            type="text"
            placeholder="Search items by keywords..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <button 
            onClick={handleSearch}
            className="absolute right-2 top-2 btn-primary py-1.5 px-4 text-sm rounded-lg hover:bg-accent transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-gray-600 font-medium">
          <SlidersHorizontal size={18} />
          <span>Filters:</span>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="number" 
            placeholder="Min ₹" 
            className="input-field py-1.5 w-24 text-sm"
            value={priceRange.min}
            onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
          />
          <span className="text-gray-400">-</span>
          <input 
            type="number" 
            placeholder="Max ₹" 
            className="input-field py-1.5 w-24 text-sm"
            value={priceRange.max}
            onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
          />
          <button onClick={handleSearch} className="text-primary hover:text-accent font-medium text-sm px-2">Apply</button>
        </div>
      </div>

      {/* Product Grid */}
      {loading && filteredProducts.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} onClick={handleProductClick} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-400 mb-4">
            <Search size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No items available</h3>
          <p className="text-gray-500">We couldn't find any items matching your keywords.</p>
        </div>
      )}

      {/* Modal */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
};

export default CategoryPage;
