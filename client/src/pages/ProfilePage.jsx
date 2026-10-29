import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useRepo } from '../context/RepoContext';
import { Github, MapPin, Calendar, Users, Star, GitFork, ExternalLink, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
  const { user, isDemo, authMode } = useAuth();
  const { stats, repos } = useRepo();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img
            src={user.avatar_url}
            alt={user.name}
            className="w-24 h-24 rounded-3xl object-cover ring-4 ring-orange-100 shadow-md"
          />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-extrabold text-slate-900">{user.name}</h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-50 text-[#FF5A00] border border-orange-100">
                @{user.login}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {isDemo ? 'Demo Mode' : `${authMode.toUpperCase()} Connected`}
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-xl">
              {user.bio || 'Full Stack Developer & Open Source Contributor.'}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-slate-800">{user.followers ?? 48}</span> followers ·{' '}
                <span className="font-bold text-slate-800">{user.following ?? 32}</span> following
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                Joined {new Date(user.created_at || '2022-01-15').toLocaleDateString()}
              </span>
              {user.html_url && (
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[#FF5A00] font-semibold hover:underline"
                >
                  <Github className="w-3.5 h-3.5" />
                  GitHub Profile <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Total Repositories</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalRepos ?? 12}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Private Repos</p>
          <p className="text-2xl font-extrabold text-[#FF5A00] mt-1">{stats.privateRepos ?? 8}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Public Repos</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{stats.publicRepos ?? 4}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Total Stars</p>
          <p className="text-2xl font-extrabold text-amber-500 mt-1">{stats.totalStars ?? 47}</p>
        </div>
      </div>

      {/* Top Languages Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4">Technologies & Languages</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'JavaScript', pct: '42%', color: 'bg-amber-400' },
            { name: 'TypeScript', pct: '28%', color: 'bg-sky-500' },
            { name: 'Python', pct: '18%', color: 'bg-emerald-500' },
            { name: 'HTML / CSS', pct: '12%', color: 'bg-[#FF5A00]' }
          ].map((lang) => (
            <div key={lang.name} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${lang.color}`}></span>
                <span className="text-xs font-bold text-slate-800">{lang.name}</span>
              </div>
              <p className="text-xs text-slate-500">{lang.pct} of codebase</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
