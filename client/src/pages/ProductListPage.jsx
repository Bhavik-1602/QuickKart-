import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import Loading from '../components/Loading';
import CardProduct from '../components/CardProduct';
import { valideURLConvert } from '../utils/valideURLConvert';

const ProductListPage = () => {
  const { category, subCategory } = useParams();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const allSubCategories = useSelector((state) => state.product.allSubCategory);
  const [displaySubCategories, setDisplaySubCategories] = useState([]);

  const categoryId = category?.split('-')?.slice(-1)[0];
  const subCategoryId = subCategory?.split('-')?.slice(-1)[0];
  const subCategoryName = subCategory?.split('-')?.slice(0, -1)?.join(' ') || 'Products';

  // Fetch product data
  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId,
          subCategoryId,
          page,
          limit: 8,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setData(page === 1 ? responseData.data : [...data, ...responseData.data]);
        setTotalPages(Math.ceil(responseData.totalCount / 8));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter subcategories
  useEffect(() => {
    const filteredSubCategories = allSubCategories.filter((sub) =>
      sub.category.some((cat) => cat._id === categoryId)
    );
    setDisplaySubCategories(filteredSubCategories);
  }, [categoryId, allSubCategories]);

  // Fetch products on page or params change
  useEffect(() => {
    fetchProductData();
  }, [categoryId, subCategoryId, page]);

  // Load more products
  const handleLoadMore = () => {
    if (page < totalPages && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-[250px,1fr] lg:grid-cols-[280px,1fr] gap-6">
        {/* Sidebar: Subcategories */}
        <aside className="bg-white rounded-lg shadow-md p-4 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-none">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Subcategories</h2>
          <div className="grid gap-2">
            {displaySubCategories.map((sub, index) => {
              const link = `/${valideURLConvert(sub.category[0]?.name)}-${sub.category[0]?._id}/${valideURLConvert(sub.name)}-${sub._id}`;
              return (
                <Link
                  key={`${sub._id}-${index}`}
                  to={link}
                  className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                    subCategoryId === sub._id ? 'bg-blue-100' : 'hover:bg-blue-50'
                  }`}
                  aria-label={`View ${sub.name} products`}
                >
                  <img
                    src={sub.image}
                    alt={sub.name}
                    className="w-12 h-12 object-contain rounded"
                    loading="lazy"
                  />
                  <span className="text-sm lg:text-base text-gray-700">{sub.name}</span>
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Main Content: Product Grid */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-800">{subCategoryName}</h1>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.length === 0 && !loading ? (
              <p className="col-span-full text-center text-gray-500">No products found.</p>
            ) : (
              data.map((product, index) => (
                <CardProduct
                  key={`${product._id}-product-${index}`}
                  data={product}
                />
              ))
            )}
          </div>

          {/* Load More Button */}
          {page < totalPages && (
            <div className="mt-6 text-center">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
              <Loading />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductListPage;