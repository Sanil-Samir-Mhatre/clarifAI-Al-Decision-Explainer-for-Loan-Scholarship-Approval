'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>('');
  
  useEffect(() => {
    const email = localStorage.getItem('user_email');
    if (email) {
      setUserEmail(email);
    }
  }, [pathname]);
  
  const isPublicPage = pathname === '/login' || pathname === '/' || pathname === '/about';
  
  // Show public simplified nav on public pages
  if (isPublicPage) {
    return (
      <nav className="bg-surface-container-lowest border-b border-surface-container-highest px-container-padding-desktop py-space-sm flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <Link href="/login" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary text-on-primary rounded-lg flex items-center justify-center font-bold animate-logo">C</div>
          <span className="font-headline-sm text-on-surface font-bold tracking-tight">ClarifAI</span>
        </Link>
        <div className="flex items-center gap-space-sm">
          <Link href="/about" className={`px-space-md py-space-xs rounded-full font-label-lg transition-colors ${pathname === '/about' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-variant'}`}>About</Link>
          <Link href="/login" className={`px-space-md py-space-xs rounded-full font-label-lg transition-colors ${pathname === '/login' || pathname === '/' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-variant'}`}>Login</Link>
        </div>
      </nav>
    );
  }
  const isAdmin = pathname.startsWith('/admin');

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    router.push('/login');
  };

  return (
    <nav className="bg-surface-container-lowest border-b border-surface-container-highest px-container-padding-desktop py-space-sm flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-space-xl">
        <Link href={isAdmin ? "/admin/applications" : "/student/apply"} className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary text-on-primary rounded-lg flex items-center justify-center font-bold animate-logo">C</div>
          <span className="font-headline-sm text-on-surface font-bold tracking-tight">ClarifAI</span>
        </Link>
        
        <div className="flex items-center gap-space-sm">
          {isAdmin ? (
            <>
              <Link href="/admin/applications" className={`px-space-md py-space-xs rounded-full font-label-lg transition-colors ${pathname === '/admin/applications' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-variant'}`}>Applications</Link>
              <Link href="/admin/history" className={`px-space-md py-space-xs rounded-full font-label-lg transition-colors ${pathname === '/admin/history' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-variant'}`}>History</Link>
              <Link href="/admin/metrics" className={`px-space-md py-space-xs rounded-full font-label-lg transition-colors ${pathname === '/admin/metrics' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-variant'}`}>Metrics</Link>
            </>
          ) : (
            <>
              <Link href="/student/apply" className={`px-space-md py-space-xs rounded-full font-label-lg transition-colors ${pathname === '/student/apply' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-variant'}`}>Apply</Link>
              <Link href="/student/history" className={`px-space-md py-space-xs rounded-full font-label-lg transition-colors ${pathname === '/student/history' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-variant'}`}>History</Link>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-space-md">
        <div className="flex flex-col text-right">
          <span className="font-label-md text-on-surface">{isAdmin ? 'Admin Reviewer' : 'Student Applicant'}</span>
          <span className="text-[10px] text-on-surface-variant">{userEmail || 'Not logged in'}</span>
        </div>
        <button onClick={handleLogout} className="px-space-md py-space-xs border border-outline-variant rounded-full text-on-surface font-label-md hover:bg-surface-variant transition-colors flex items-center gap-1">
          Logout <span className="material-symbols-outlined text-[18px]">logout</span>
        </button>
      </div>
    </nav>
  );
}
