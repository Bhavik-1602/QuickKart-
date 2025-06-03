import React, { useState } from 'react';
import EditProductAdmin from './EditProductAdmin';
import CofirmBox from './CofirmBox'; // Note: Typo 'CofirmBox' may need to be 'ConfirmBox'
import { IoClose } from 'react-icons/io5';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';

const ProductCardAdmin = ({ data, fetchProductData }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleDeleteCancel = () => {
    setOpenDelete(false);
  };

  const handleDelete = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data: {
          _id: data._id,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if (fetchProductData) {
          fetchProductData();
        }
        setOpenDelete(false);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className="w-full max-w-[160px] sm:max-w-[200px] md:max-w-[240px] p-3 sm:p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Image Section */}
      <div className="w-full h-28 xs:h-32 sm:h-40 md:h-48 overflow-hidden rounded-md">
        <img
          src={data?.image[0]}
          alt={data?.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="mt-2 sm:mt-3">
        <p className="text-xs xs:text-sm sm:text-base font-semibold text-gray-800 line-clamp-2">
          {data?.name}
        </p>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">{data?.unit}</p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
        <button
          onClick={() => setEditOpen(true)}
          className="border border-blue-600 bg-blue-50 text-blue-700 text-xs sm:text-sm py-1.5 sm:py-2 px-2 sm:px-3 rounded-md hover:bg-blue-100 transition-colors duration-200"
        >
          Edit
        </button>
        <button
          onClick={() => setOpenDelete(true)}
          className="border border-red-600 bg-red-50 text-red-600 text-xs sm:text-sm py-1.5 sm:py-2 px-2 sm:px-3 rounded-md hover:bg-red-200 transition-colors duration-200"
        >
          Delete
        </button>
      </div>

      {/* Edit Product Modal */}
      {editOpen && (
        <EditProductAdmin
          fetchProductData={fetchProductData}
          data={data}
          close={() => setEditOpen(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {openDelete && (
        <section className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 xs:p-4">
          <div className="bg-white p-4 xs:p-5 sm:p-6 w-full max-w-[90%] xs:max-w-[400px] sm:max-w-[500px] rounded-lg shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800">
                Confirm Deletion
              </h3>
              <button
                onClick={() => setOpenDelete(false)}
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <IoClose size={20} className="xs:w-6 xs:h-6" />
              </button>
            </div>
            <p className="my-3 xs:my-4 text-xs xs:text-sm sm:text-base text-gray-600">
              Are you sure you want to permanently delete this product?
            </p>
            <div className="flex justify-end gap-3 xs:gap-4 mt-4 sm:mt-6">
              <button
                onClick={handleDeleteCancel}
                className="border border-red-500 bg-red-50 text-red-600 text-xs xs:text-sm sm:text-base px-3 xs:px-4 py-1.5 xs:py-2 rounded-md hover:bg-red-100 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="border border-blue-500 bg-blue-50 text-blue-600 text-xs xs:text-sm sm:text-base px-3 xs:px-4 py-1.5 xs:py-2 rounded-md hover:bg-blue-100 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductCardAdmin;