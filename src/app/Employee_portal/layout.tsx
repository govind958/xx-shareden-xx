'use client';
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/src/app/Employee_portal/employee-portal-sidebar';
import { verifyEmployeeSession } from '@/src/modules/employee/actions';

export default function EmployeePortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(true);
  const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage =
    pathname.startsWith('/Employee_portal/login') ||
    pathname.startsWith('/Employee_portal/signup');

  useEffect(() => {
    if (isAuthPage) return;

    let cancelled = false;
    verifyEmployeeSession().then((result) => {
      if (cancelled) return;
      if (!result.isValid) {
        router.replace('/Employee_portal/login');
      } else {
        setAuthState('authenticated');
      }
    });
    return () => { cancelled = true; };
  }, [isAuthPage, router]);

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (authState !== 'authenticated') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-black">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
      </div>
    );
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