import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Home,
  FolderGit2,
  PlusCircle,
  Settings,
  User,
  Users,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function Sidebar({ onOpenCreateModal }) {
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

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200/80 p-5 flex flex-col justify-between min-h-[calc(100vh-4rem)]">
      <div>
        {/* Main Navigation Links */}
        <div className="space-y-1.5">
          {mainNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-[#FFF3EC] text-[#FF5A00] font-bold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#FF5A00]' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Section Divider: Your GitHub */}
        <div className="pt-6 pb-2">
          <div className="flex items-center gap-2 px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
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
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl font-medium text-sm transition-all ${
                      isActive
                        ? 'bg-[#FFF3EC] text-[#FF5A00] font-bold shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-5 h-5 ${isActive ? 'text-[#FF5A00]' : 'text-slate-500'}`} />
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
      <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-orange-50/70 via-white to-amber-50/50 border border-orange-100/80 shadow-sm relative overflow-hidden">
        <div className="w-8 h-8 rounded-xl bg-orange-100/70 flex items-center justify-center text-[#FF5A00] mb-3">
          <Sparkles className="w-4 h-4 fill-current" />
        </div>
        <h4 className="text-sm font-bold text-slate-900">Your code, your space</h4>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Manage your GitHub repositories with ease, all in one place.
        </p>
        <Link
          to="/create-repository"
          className="mt-3.5 w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#FF5A00] hover:bg-[#E04F00] text-white text-xs font-semibold rounded-xl shadow-md shadow-orange-500/20 transition-all hover:gap-3"
        >
          <span>Create Repository</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
