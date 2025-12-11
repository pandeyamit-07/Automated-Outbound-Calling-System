import React, { useState } from "react";

export default function Topbar() {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login"; // redirect to login
  };

  return (
    <nav className="bg-white shadow-md w-full fixed top-0 left-0 z-50 px-5 py-3 border-b">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-blue-700 flex items-center justify-center shadow-md animate-pulse">
            <img src="/Phone_icon.png" alt="phone" className="w-6 h-6 filter invert" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">Asterisk Dashboard</h1>
            {/* <p className="text-sm text-gray-500">Monitor call logs, durations, and user inputs</p> */}
          </div>
        </div>

        {/* Desktop Logout Button */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-3xl" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden flex flex-col gap-3 mt-4 bg-gray-50 p-4 rounded-lg border max-w-7xl mx-auto">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}





