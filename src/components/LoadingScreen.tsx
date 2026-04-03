'use client'

import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
      <div className="flex gap-2">
        {/* Five-dot staggered pulse animation */}
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
        <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse [animation-delay:200ms]" />
        <div className="w-2 h-2 rounded-full bg-gray-200 animate-pulse [animation-delay:400ms]" />
        <div className="w-2 h-2 rounded-full bg-gray-200 animate-pulse [animation-delay:600ms]" />
        <div className="w-2 h-2 rounded-full bg-gray-100 animate-pulse [animation-delay:800ms]" />
      </div>
    </div>
  );
};

export default LoadingScreen;