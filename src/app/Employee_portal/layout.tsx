'use client';
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/src/app/Employee_portal/employee-portal-sidebar';

export default function EmployeePortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(true);
  const pathname = usePathname();

  // Auth pages (login/signup) render their own layout — just pass children through
  const isAuthPage =
    pathname.startsWith('/Employee_portal/login') ||
    pathname.startsWith('/Employee_portal/signup');

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex min-h-screen bg-neutral-50 dark:bg-black transition-colors duration-300">
        <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}