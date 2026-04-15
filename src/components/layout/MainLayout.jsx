import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-bg-secondary border-b border-border flex items-center px-4 z-30 md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <span className="ml-3 text-accent font-bold text-lg">Blueprint</span>
      </div>

      <main className="flex-1 md:ml-56 pt-14 md:pt-0 p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
