import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FolderGit2, Plus, Clock, User } from 'lucide-react';

export default function MobileBottomNav({ onOpenCreateModal }) {
  const navItems = [
    { to: '/', label: 'Home', icon: Home, end: true },
    { to: '/repositories', label: 'Repos', icon: FolderGit2 },
    { isCreate: true },
    { to: '/activity', label: 'Activity', icon: Clock },
    { to: '/profile', label: 'Profile', icon: User }
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item, idx) => {
          if (item.isCreate) {
            return (
              <button
                key="create-btn"
                onClick={onOpenCreateModal}
                className="-mt-5 w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5A00] to-[#FF8A3D] text-white flex items-center justify-center shadow-lg shadow-orange-500/35 hover:scale-105 active:scale-95 transition-all focus:outline-none"
                aria-label="Create Repository"
                title="Create Repository"
              >
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </button>
            );
          }

          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                  isActive
                    ? 'text-[#FF5A00] font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FF5A00]" />
                    )}
                  </div>
                  <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
