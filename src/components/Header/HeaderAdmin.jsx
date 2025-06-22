import React, { useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const HeaderAdmin = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear("token");
    navigate("/admin");
  };

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold text-sky-500">Galaxy</h2>
          <h2 className="text-2xl font-bold text-red-400">Cinema</h2>
        </div>

        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-gray-800 relative">
            <IoNotificationsOutline className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              2
            </span>
          </button>

          <div className="relative">
            <button
              className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg transition-colors"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <FaRegUser className="h-6 w-6 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Admin User
              </span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                >
                  <IoLogOutOutline className="h-5 w-5" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;
