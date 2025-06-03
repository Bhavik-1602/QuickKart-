import React, { useEffect, useState } from 'react';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';

const Product = () => {
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchProductData = async () => {
    setLoading(true);
    try {
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page: page,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setProductData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 text-center">
          Our Products
        </h1>
        <p className="text-sm sm:text-base text-gray-600 text-center mt-2">
          Explore our wide range of products
        </p>
      </header>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Product Grid */}
      {!loading && productData.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg sm:text-xl text-gray-600">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {productData.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              {/* Product Image */}
              <div className="w-full h-40 sm:h-48 md:h-56 overflow-hidden">
                <img
                  src={product?.image?.[0] || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {product.unit || 'Unit not specified'}
                </p>
                <p className="text-sm sm:text-base font-medium text-gray-900 mt-2">
                  ${product.price?.toFixed(2) || 'N/A'}
                </p>
              </div>

              {/* Action Button */}
              <div className="p-4 pt-0">
                <button className="w-full bg-blue-600 text-white text-sm sm:text-base py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-6 sm:mt-8">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 text-sm sm:text-base rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors duration-200"
        >
          Previous
        </button>
        <span className="text-sm sm:text-base text-gray-700">
          Page {page}
        </span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={productData.length === 0}
          className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 text-sm sm:text-base rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Product;