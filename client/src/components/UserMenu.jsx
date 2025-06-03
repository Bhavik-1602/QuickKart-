import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { logout } from '../store/userSlice';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { HiOutlineExternalLink } from 'react-icons/hi';
import isAdmin from '../utils/isAdmin';

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout,
      });
      if (response.data.success) {
        if (close) close();
        dispatch(logout());
        localStorage.clear();
        toast.success(response.data.message);
        navigate('/');
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleClose = () => {
    if (close) close();
  };

  const menuItems = [
    ...(isAdmin(user.role)
      ? [
          { to: '/dashboard/category', label: 'Category' },
          { to: '/dashboard/subcategory', label: 'Sub Category' },
          { to: '/dashboard/upload-product', label: 'Upload Product' },
          { to: '/dashboard/product', label: 'Product' },
        ]
      : []),
    { to: '/dashboard/myorders', label: 'My Orders' },
    { to: '/dashboard/address', label: 'Save Address' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 w-64 max-w-full border border-gray-100">
      {/* Header */}
      <h2 className="text-lg font-bold text-gray-800 mb-2">My Account</h2>
      <div className="flex items-center justify-between gap-2 mb-4">
        <span className="text-sm text-gray-700 truncate max-w-40">
          {user.name || user.mobile}{' '}
          {user.role === 'ADMIN' && (
            <span className="text-red-600 font-semibold">(Admin)</span>
          )}
        </span>
        <Link
          to="/dashboard/profile"
          onClick={handleClose}
          className="text-blue-600 hover:text-blue-700 transition"
          aria-label="View profile"
        >
          <HiOutlineExternalLink size={16} />
        </Link>
      </div>

      {/* Divider */}
      <hr className="border-gray-200 my-2" />

      {/* Menu Items */}
      <nav className="grid gap-1" role="navigation" aria-label="User menu">
        {menuItems.map((item, index) => (
          <Link
            key={`menu-item-${index}`}
            to={item.to}
            onClick={handleClose}
            className="px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            aria-label={item.label}
          >
            {item.label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="px-3 py-2 text-sm text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
          aria-label="Log out"
        >
          Log Out
        </button>
      </nav>
    </div>
  );
};

export default UserMenu;