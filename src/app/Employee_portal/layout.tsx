'use client';
import React, { useState } from 'react';
import Sidebar from '@/src/app/Employee_portal/employee-portal-sidebar'; // Adjust this path to where your Sidebar file is

export default function EmployeePortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(true); // Defaulting to dark for that infra look

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex min-h-screen bg-neutral-50 dark:bg-black transition-colors duration-300">
        {/* Sidebar stays mounted here */}
        <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* This "children" is where your Dashboard page will appear */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}