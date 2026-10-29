import React, { useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Home,
  FolderGit2,
  PlusCircle,
  Settings,
  User,
  Users,
  Clock,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';

export default function Sidebar({ onOpenCreateModal, mobileOpen, onClose }) {
  const location = useLocation();

  // Close mobile drawer when URL changes
  useEffect(() => {
    if (mobileOpen && onClose) {
      onClose();
    }
  }, [location.pathname]);

  const mainNav = [
    { to: '/', label: 'Home', icon: Home, end: true },
    { to: '/repositories', label: 'Repositories', icon: FolderGit2 },
    { to: '/create-repository', label: 'Create Repository', icon: PlusCircle },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const githubNav = [
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/organizations', label: 'Organizations', icon: Users },
    { to: '/activity', label: 'Activity', icon: Clock },
  ];

  const navContent = (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-6">
        {/* Main Navigation Links */}
        <div className="space-y-1.5">
          {mainNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
                    isActive
                      ? 'bg-[#FFF3EC] text-[#FF5A00] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#FF5A00] stroke-[2.2]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Section: Your GitHub */}
        <div className="pt-2">
          <div className="flex items-center gap-2 px-4 mb-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <svg className="w-3.5 h-3.5 fill-current opacity-70" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>Your GitHub</span>
          </div>
          <div className="space-y-1.5">
            {githubNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
                      isActive
                        ? 'bg-[#FFF3EC] text-[#FF5A00] shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#FF5A00] stroke-[2.2]' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Promo Card */}
      <div className="mt-8 p-4 rounded-3xl bg-gradient-to-br from-orange-50/80 via-white to-amber-50/50 border border-orange-100 shadow-sm relative overflow-hidden">
        <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF5A00] mb-2.5">
          <Sparkles className="w-4 h-4 fill-current" />
        </div>
        <h4 className="text-xs font-bold text-slate-900">Your code, your space</h4>
        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
          Manage your GitHub repositories with ease, all in one place.
        </p>
        <Link
          to="/create-repository"
          onClick={onClose}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#FF5A00] hover:bg-[#E04F00] text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all hover:gap-3"
        >
          <span>Create Repository</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Static Sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 bg-white border-r border-slate-200/80 p-5 flex-col justify-between min-h-[calc(100vh-4rem)]">
        {navContent}
      </aside>

      {/* 2. Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-slate-950/40 backdrop-blur-sm transition-opacity animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* 3. Mobile Slide-Over Drawer */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 max-w-[85vw] bg-white p-5 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-100">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-xl bg-[#FFF3EC] flex items-center justify-center text-[#FF5A00]">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-[#0F172A]">
              Git<span className="text-[#FF5A00]">Store</span>
            </span>
          </Link>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {navContent}
        </div>
      </div>
    </>
  );
}
