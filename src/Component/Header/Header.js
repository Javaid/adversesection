import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaUser, FaBell } from "react-icons/fa";
import { MdOutlineAccessTime } from "react-icons/md";
import { clearAuthSession, getUser } from "../../utils/auth";

const Header = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const user = getUser();


  const handleLogout = () => {
    clearAuthSession();
    navigate("/login", { replace: true });
  };

  return (
    <header className="flex flex-col md:flex-row items-center justify-between p-4 bg-white shadow-sm border-b border-[#d8e4ef] min-h-[64px]">

      {/* Logo & Title */}
      <div className="flex items-center space-x-3 mb-4 md:mb-0">
        <div className="bg-[#4fa7d8] text-white rounded-md w-10 h-10 flex items-center justify-center font-bold text-lg shadow-sm">
          PA
        </div>
        <span className="font-semibold text-[#2e4358] text-xl">
          Provider Adverse
        </span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xl mx-4 mb-4 md:mb-0 relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#89a0b5] text-sm" />
        <input
          type="text"
          placeholder="Search by NPI Or Provider Name"
          className="w-full pl-10 pr-4 py-2 bg-[#f7fafc] border border-[#d8e4ef] rounded-md
               focus:outline-none focus:ring-2 focus:ring-[#4fa7d8] focus:border-transparent
               text-[#2e4358] placeholder-[#8aa0b5]"
        />
      </div>

      {/* Last Updated */}
      <div>
        <span className="flex items-center gap-2 text-[#6c8094]">
          <MdOutlineAccessTime className="text-lg" />
          Last Updated : Jan 8, 2026, 9:13 PM
        </span>
      </div>

      {/* Notifications & User */}
      <div className="flex items-center space-x-4 relative">
        <button
          className="p-2 rounded-md w-8 h-8 hover:bg-[#e8f3fa] transition"
          aria-label="Notifications"
        >
          <FaBell className="text-[#6c8094] text-lg" />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full hover:bg-[#e8f3fa] transition"
            aria-label="User menu"
          >
            <FaUser className="text-[#6c8094] text-lg" />
          </button>

          {showMenu && (
            <ul className="absolute right-0 mt-2 w-40 bg-white border border-[#d8e4ef] rounded-md shadow-lg z-10">
              {user?.role === "admin" && (
                <>
                  <li className="px-4 py-2 hover:bg-[#f3f8fc] cursor-pointer">
                    Profile
                  </li>
                  <li className="px-4 py-2 hover:bg-[#f3f8fc] cursor-pointer">
                    Settings
                  </li>
                  <li className="px-4 py-2 hover:bg-[#f3f8fc] cursor-pointer">
                    API Access
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-[#f3f8fc] cursor-pointer border-t border-[#d8e4ef]"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </>
              )}
              {user?.role === "user" && (
                <li
                  className="px-4 py-2 hover:bg-[#f3f8fc] cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              )}
              {/* Fallback - always show logout if no role matches */}
              {(!user || (user.role !== "admin" && user.role !== "user")) && (
                <li
                  className="px-4 py-2 hover:bg-[#f3f8fc] cursor-pointer"
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
