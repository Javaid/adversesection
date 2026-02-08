import React, { useState } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaUser, FaBell } from "react-icons/fa";
import { MdOutlineAccessTime } from "react-icons/md";

const Header = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  console.log('Header - user object:', user);
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <header className="flex flex-col md:flex-row items-center justify-between p-4 bg-white-50 shadow-md border-b border-gray-300 min-h-[64px]">

      {/* Logo & Title */}
      <div className="flex items-center space-x-3 mb-4 md:mb-0">
        <div className="bg-blue-900 text-white rounded-md w-10 h-10 flex items-center justify-center font-bold text-lg">
          H
        </div>
        <span className="font-semibold text-gray-900 text-xl">
          HealthProviders Db
        </span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xl mx-4 mb-4 md:mb-0 relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="text"
          placeholder="Search by NPI Or Provider Name"
          className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-md
               focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent
               text-gray-700 placeholder-gray-500"
        />
      </div>

      {/* Last Updated */}
      <div>
        <span className="flex items-center gap-2 text-gray-600">
          <MdOutlineAccessTime className="text-lg" />
          Last Updated : Jan 8, 2026, 9:13 PM
        </span>
      </div>

      {/* Notifications & User */}
      <div className="flex items-center space-x-4 relative">
        <button
          className="p-2 rounded-md w-8 h-8 hover:bg-blue-900 transition"
          aria-label="Notifications"
        >
          <FaBell className="text-gray-600 text-lg" />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full hover:bg-blue-900 transition"
            aria-label="User menu"
          >
            <FaUser className="text-gray-600 text-lg" />
          </button>

          {showMenu && (
            <ul className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10">
              {user?.role === "admin" && (
                <>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Profile
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Settings
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    API Access
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-t"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </>
              )}
              {user?.role === "user" && (
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              )}
              {/* Fallback - always show logout if no role matches */}
              {(!user || (user.role !== "admin" && user.role !== "user")) && (
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
