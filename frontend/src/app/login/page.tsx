'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const emailLower = email.toLowerCase();
    
    if (emailLower === 'admin@gmail.com') {
      if (password === 'admin123') {
        localStorage.setItem('user_email', emailLower);
        localStorage.setItem('user_role', 'admin');
        router.push('/admin/applications');
      } else {
        setError('Invalid password for admin');
      }
    } else if (emailLower === 'student@gmail.com') {
      if (password === 'student123') {
        localStorage.setItem('user_email', emailLower);
        localStorage.setItem('user_role', 'student');
        router.push('/student/apply');
      } else {
        setError('Invalid password for student');
      }
    } else {
      setError('Account not found. Use a demo credential.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-surface flex flex-col items-center justify-center py-space-xl px-container-padding-mobile md:px-container-padding-desktop relative overflow-y-auto">
      {/* Background glow effects */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary-fixed/20 blur-3xl pointer-events-none -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-tertiary-fixed/20 blur-3xl pointer-events-none -z-10 -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="w-full max-w-[1200px] mx-auto z-10 grid grid-cols-1 lg:grid-cols-2 gap-space-3xl items-center mb-space-xl">
        
        {/* Left Side: Application Description */}
        <div className="flex flex-col text-left pr-0 lg:pr-space-xl">
          <div className="flex items-center mb-space-md mt-4">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-primary text-on-primary rounded-[1rem] md:rounded-[1.2rem] flex items-center justify-center font-black text-4xl md:text-5xl shadow-md shrink-0 mr-1">
               C
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-on-surface tracking-tighter leading-none">
               larifAI
            </h1>
          </div>
          <h2 className="font-headline-md text-on-surface-variant mb-space-lg">AI Decision Explainer for Loan/Scholarship Approval</h2>
          <p className="font-body-lg text-on-surface-variant leading-relaxed mb-space-2xl">
            ClarifAI is an explainable AI prototype that recommends approval, rejection, or manual review using mock applicant data. It provides simple, neutral, and non-biased explanations to support transparency and human review, rather than acting as a final decision maker. By separating facts from assumptions, ClarifAI ensures fairness consideration across all applicants.
          </p>
          <div className="font-label-lg text-primary flex items-center gap-3 mt-auto pt-space-md">
            <span className="w-12 h-[2px] bg-primary"></span>
            Created by Sanil Samir Mhatre
          </div>
        </div>

        {/* Right Side: Login & Credentials */}
        <div className="flex flex-col items-center lg:items-end w-full">
          <div className="w-full max-w-[460px] flex flex-col gap-space-lg">
            
            {/* Login Card */}
            <div className="w-full bg-surface-container-lowest rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-surface-container-highest p-space-xl relative z-10">
              <div className="flex flex-col items-center text-center mb-space-xl">
                <div className="w-12 h-12 bg-primary-container text-on-primary rounded-xl flex items-center justify-center mb-space-sm shadow-sm">
                   <span className="material-symbols-outlined text-[28px]">lock</span>
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight">Welcome back</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">Sign in to your ClarifAI account</p>
              </div>

              <form className="flex flex-col gap-space-lg" onSubmit={handleLogin}>
                <div className="flex flex-col gap-space-2xs">
                  <label htmlFor="email" className="font-label-md text-label-md text-on-surface">Email address</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@university.edu" 
                    className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-on-surface-variant/50"
                    required
                  />
                </div>

                <div className="flex flex-col gap-space-2xs">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="font-label-md text-label-md text-on-surface">Password</label>
                    <Link href="#" className="font-label-md text-label-md text-primary hover:text-primary-fixed-variant transition-colors">Forgot password?</Link>
                  </div>
                  <input 
                    type="password" 
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-on-surface-variant/50"
                    required
                  />
                </div>

                {error && <div className="text-red-500 text-sm font-medium text-center">{error}</div>}

                <div className="flex gap-space-sm mt-space-xs">
                    <button type="submit" className="flex-1 py-space-sm bg-primary hover:bg-primary-fixed-variant text-on-primary font-label-lg text-label-lg rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm">
                      Login
                    </button>
                </div>
              </form>
            </div>

            {/* Demo Credentials */}
            <div className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-xl p-space-lg shadow-sm">
              <div className="flex flex-col mb-space-md">
                <h3 className="font-headline-sm text-on-surface flex items-center gap-2">
                  <span className="text-xl">🔑</span> Demo Credentials
                </h3>
                <p className="text-xs text-on-surface-variant italic mt-1">Click a row to autofill credentials</p>
              </div>
              
              <div className="overflow-x-auto rounded-lg border border-surface-container-highest">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface text-on-surface-variant font-medium border-b border-surface-container-highest">
                    <tr>
                      <th className="py-2 px-3">Role</th>
                      <th className="py-2 px-3">Email / ID</th>
                      <th className="py-2 px-3">Password</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-highest bg-surface-container-lowest">
                    <tr className="cursor-pointer hover:bg-surface-variant/50 transition-colors" onClick={() => { setEmail('admin@gmail.com'); setPassword('admin123'); }}>
                      <td className="py-3 px-3 font-semibold flex items-center gap-2"><span>👑</span> Admin</td>
                      <td className="py-3 px-3"><span className="font-mono text-xs bg-surface-variant/50 text-on-surface rounded px-2 py-1">admin@gmail.com</span></td>
                      <td className="py-3 px-3"><span className="font-mono text-xs bg-surface-variant/50 text-on-surface rounded px-2 py-1">admin123</span></td>
                    </tr>
                    <tr className="cursor-pointer hover:bg-surface-variant/50 transition-colors" onClick={() => { setEmail('student@gmail.com'); setPassword('student123'); }}>
                      <td className="py-3 px-3 font-semibold flex items-center gap-2"><span>🎓</span> Student</td>
                      <td className="py-3 px-3"><span className="font-mono text-xs bg-surface-variant/50 text-on-surface rounded px-2 py-1">student@gmail.com</span></td>
                      <td className="py-3 px-3"><span className="font-mono text-xs bg-surface-variant/50 text-on-surface rounded px-2 py-1">student123</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
