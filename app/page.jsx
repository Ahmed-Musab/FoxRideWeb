'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';

export default function Splash() {
  const router = useRouter();
  const { user } = useAuth();
  const [progress, setProgress] = useState(0);

  // Helper to determine the dashboard path based on role
  const getDashboardPath = (role) => {
    switch (role) {
      case 'admin':
        return '/pages/adminDashboardPage';
      case 'employee':
        return '/pages/employeeDashboardPage';
      case 'manager':
        return '/pages/managerDashboardPage';
      case 'transportAdmin':
        return '/pages/transportAdminDashboardPage';
      case 'driver':
        return '/pages/driverDashboardPage';
      default:
        return '/pages/loginPage';
    }
  };

  useEffect(() => {
    // Start filling progress bar to indicate active loading
    setProgress(50);

    const checkAuthAndRedirect = async () => {
      let targetPath = '/pages/loginPage';
      try {
        if (user && user.role) {
          targetPath = getDashboardPath(user.role);
        }
      } catch (error) {
        console.error('Auth check error on splash page:', error);
      } finally {
        setProgress(100);
        router.replace(targetPath);
      }
    };

    checkAuthAndRedirect();
  }, [router, user]);

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-between overflow-hidden bg-[#090d16] text-white font-sans">
      {/* Soft Blue Background Glows */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />

      {/* Main Content Container */}
      <div className="my-auto flex flex-col items-center justify-center px-4 text-center z-10">
        {/* Simple & Minimalist Logo Symbol */}
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-neutral-900/60 p-4 ring-1 ring-white/10">
          <svg
            className="h-full w-full text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <path d="M9 17h6" />
            <circle cx="17" cy="17" r="2" />
          </svg>
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            FoxRide
          </span>
        </h1>

        {/* Tagline */}
        <p className="mt-3 max-w-xs text-xs font-medium text-neutral-400 md:max-w-sm tracking-wide">
          Smart Carpooling for Organizations
        </p>
      </div>

      {/* Footer Area with Progress Bar */}
      <div className="w-full max-w-xs pb-16 z-10 px-4">
        {/* Progress Bar Container */}
        <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_6px_rgba(59,130,246,0.6)] transition-all duration-[800ms] ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Simple Loading Indicator */}
        <div className="mt-2.5 flex justify-center text-[10px] font-semibold tracking-wider text-neutral-500 uppercase">
          <span className="animate-pulse">Loading...</span>
        </div>
      </div>
    </div>
  );
}