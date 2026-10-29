import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, ExternalLink, ShieldCheck, FolderGit2, Building2, Plus, ArrowRight } from 'lucide-react';

export default function OrganizationsPage() {
  const { user } = useAuth();

  const mockOrgs = [
    {
      id: 'org-1',
      name: 'OpenSource Lab',
      login: 'opensource-lab',
      description: 'Collaborative research and development of open-source tooling.',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      members: 14,
      repos: 6,
      role: 'Member'
    },
    {
      id: 'org-2',
      name: 'CloudCore Systems',
      login: 'cloudcore-systems',
      description: 'Enterprise cloud infrastructure and microservices deployment.',
      avatar: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=100&auto=format&fit=crop&q=80',
      members: 32,
      repos: 18,
      role: 'Admin'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-6 lg:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-[#FF5A00] flex-shrink-0">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
              Organizations
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage your teams, shared repository access, and enterprise GitHub organizations.
            </p>
          </div>
        </div>

        <a
          href="https://github.com/organizations/plan"
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FF5A00] hover:bg-[#E04F00] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Organization</span>
        </a>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockOrgs.map((org) => (
          <div
            key={org.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-card-hover transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <img
                  src={org.avatar}
                  alt={org.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100"
                />
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-[#FF5A00] border border-orange-100">
                  {org.role}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900">{org.name}</h3>
              <p className="text-xs text-slate-400 font-mono">@{org.login}</p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {org.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 font-medium">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {org.members} Members
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
                  {org.repos} Repos
                </span>
              </div>
              <a
                href={`https://github.com/${org.login}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[#FF5A00] font-bold hover:underline"
              >
                <span>View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Info Card */}
      <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5">
        <Building2 className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 leading-relaxed">
          <span className="font-bold text-slate-900 block mb-0.5">Need Organization Access?</span>
          If your company or university uses GitHub Organizations, ensure your GitHub account has approved third-party application access to GitStore in your GitHub account settings.
        </div>
      </div>
    </div>
  );
}
