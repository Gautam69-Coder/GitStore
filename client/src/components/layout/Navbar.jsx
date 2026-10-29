import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  ChevronDown,
  Github,
  Key,
  LogOut,
  User as UserIcon,
  Settings,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRepo } from '../../context/RepoContext';

export default function Navbar({ onOpenAuthModal, onToggleMobileMenu }) {
  const { user, authMode, isDemo, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useRepo();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate('/repositories');
      setMobileSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Hamburger & Brand Logo */}
      <div className="flex items-center gap-2 sm:gap-4 lg:gap-8">
        {/* Mobile Hamburger Drawer Trigger */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="p-2 -ml-1 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link
          to="/"
          className="flex items-center gap-2 sm:gap-2.5 group focus:outline-none"
        >
          {/* GitHub Octocat icon in Vibrant Orange */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FFF3EC] flex items-center justify-center text-[#FF5A00] group-hover:scale-105 transition-transform shadow-xs">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </div>
          <span className="text-lg sm:text-xl font-extrabold tracking-tight text-[#0F172A]">
            Git<span className="text-[#FF5A00]">Store</span>
          </span>
        </Link>

        {/* Desktop Global Search Input */}
        <div className="relative hidden md:block w-72 lg:w-96">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search repositories... (Press Enter)"
            className="w-full pl-10 pr-12 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-[#FF5A00]/15 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right: Search Toggle (Mobile), Mode Pill, Notifications, User Avatar */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Mobile Search Icon Toggle */}
        <button
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden transition-colors"
          aria-label="Toggle search"
        >
          {mobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
        </button>

        {/* Connection Mode Pill */}
        <button
          onClick={onOpenAuthModal}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold border transition-all ${
            isDemo
              ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
          }`}
          title="Click to switch authentication mode"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isDemo ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
          <span className="hidden xs:inline">
            {isDemo ? 'Demo Mode' : authMode === 'pat' ? 'Connected (PAT)' : 'Connected (OAuth)'}
          </span>
          <span className="xs:hidden">
            {isDemo ? 'Demo' : 'Live'}
          </span>
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-colors"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF5A00] rounded-full ring-2 ring-white"></span>
          </button>

          {/* Notifications Dropdown (Responsive width) */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-xs sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-900">Notifications</span>
                <span className="text-xs text-[#FF5A00] font-semibold">3 New</span>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-orange-50/70 border border-orange-100/80">
                  <p className="font-bold text-slate-800">Welcome to GitStore!</p>
                  <p className="text-slate-500 mt-0.5 leading-relaxed">Explore your repositories, edit code, and push commits.</p>
                </div>
                <div className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <p className="font-semibold text-slate-800">Direct Git API</p>
                  <p className="text-slate-500 mt-0.5 leading-relaxed">Changes save straight to GitHub REST API.</p>
                </div>
                <div className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <p className="font-semibold text-slate-800">Responsive UI</p>
                  <p className="text-slate-500 mt-0.5 leading-relaxed">Full mobile, tablet, and desktop layout support.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-1 pr-1.5 py-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="User menu"
          >
            <img
              src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100"
            />
            <span className="text-xs font-bold text-slate-800 hidden sm:inline-block max-w-[100px] truncate">
              {user.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* Profile Menu (Responsive width) */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-[11px] font-medium text-slate-400">Signed in as</p>
                <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">@{user.login}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => { navigate('/profile'); setProfileOpen(false); }}
                  className="w-full text-left px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                >
                  <UserIcon className="w-4 h-4 text-[#FF5A00]" />
                  View Profile
                </button>
                <button
                  onClick={() => { navigate('/settings'); setProfileOpen(false); }}
                  className="w-full text-left px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  Settings
                </button>
                <button
                  onClick={() => { onOpenAuthModal(); setProfileOpen(false); }}
                  className="w-full text-left px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2.5">
                    <Key className="w-4 h-4 text-slate-500" />
                    Auth Mode
                  </span>
                  <span className="text-[10px] font-bold text-[#FF5A00] bg-orange-50 px-2 py-0.5 rounded">
                    {authMode.toUpperCase()}
                  </span>
                </button>
                {user.html_url && (
                  <a
                    href={user.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-left px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <Github className="w-4 h-4 text-slate-500" />
                    GitHub Profile
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-auto" />
                  </a>
                )}
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => { logout(); setProfileOpen(false); }}
                  className="w-full text-left px-4 py-2 text-xs sm:text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2.5"
                >
                  <LogOut className="w-4 h-4" />
                  {isDemo ? 'Reset Demo Data' : 'Sign Out'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Input Drawer (Dropdown when mobileSearchOpen is true) */}
      {mobileSearchOpen && (
        <div className="absolute top-16 inset-x-0 p-3 bg-white border-b border-slate-200/90 shadow-md md:hidden z-20 animate-fade-in">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search repositories... (Press Enter)"
              className="w-full pl-9 pr-10 py-2.5 bg-slate-50 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-[#FF5A00]/15"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
