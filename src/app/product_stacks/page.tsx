import React from "react";

// This is a simple functional component that returns a "coming soon" message.
const StacksPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-lg w-full">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4 tracking-tight">
          Startup Stacks
        </h2>
        <p className="text-xl text-gray-600 mb-6 leading-relaxed">
          Our curated list of startup stacks is coming soon! We&apos;re hard at
          work building the best resource for you.
        </p>
        <div className="relative inline-flex">
          <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></div>
          <a
            href="#"
            className="relative inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Stay Tuned!
          </a>
        </div>
      </div>
    </div>
  );
};

export default StacksPage;
