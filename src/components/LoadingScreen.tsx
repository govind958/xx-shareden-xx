'use client'

import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center" role="status" aria-label="Loading">
      <Loader2 size={32} className="animate-spin text-[#2B6CB0]" aria-hidden />
    </div>
  );
};

export default LoadingScreen;