"use client";

import { useState } from "react";

export default function Navbar() {
  const [search, setSearch] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`You searched for: ${search}`);
  };

  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-pink-500"></div>
          <div className="w-6 h-6 rounded-full bg-orange-500 -ml-2"></div>
          <div className="w-6 h-6 rounded-full bg-yellow-400 -ml-2"></div>
          <span className="font-semibold text-gray-700">Guide</span>
        </div>

        {/* Middle: Search */}
        <form onSubmit={handleSubmit} className="flex-1 px-6">
          <input
            type="text"
            placeholder="Search for help..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </form>

        {/* Right: Links */}
        <div className="flex items-center space-x-4">
          <button className="text-sm text-gray-600 hover:text-gray-800">Help</button>
          <button className="px-4 py-2 text-sm font-medium bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition">
            Get Started
          </button>
          <button className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition">
            Log In
          </button>
        </div>
      </div>
    </nav>
  );
}
