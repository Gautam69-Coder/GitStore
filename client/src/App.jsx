import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import DashboardPage from './pages/DashboardPage';
import RepositoriesPage from './pages/RepositoriesPage';
import CreateRepositoryPage from './pages/CreateRepositoryPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import OrganizationsPage from './pages/OrganizationsPage';
import ActivityPage from './pages/ActivityPage';
import RepoDetailsPage from './pages/RepoDetailsPage';
import CreateRepoModal from './components/modals/CreateRepoModal';
import AuthModal from './components/modals/AuthModal';
import { useRepo } from './context/RepoContext';

export default function App() {
  const { deleteRepository } = useRepo();
  const navigate = useNavigate();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleDeleteRepo = async (repo) => {
    if (window.confirm(`Are you sure you want to delete repository "${repo.name}"? This action cannot be undone.`)) {
      await deleteRepository(repo.owner?.login, repo.name);
      navigate('/repositories');
    }
  };

  const handleCreatedRepo = (newRepo) => {
    navigate(`/repo/${newRepo.owner?.login || 'user'}/${newRepo.name}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar onOpenAuthModal={() => setShowAuthModal(true)} />

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar onOpenCreateModal={() => setShowCreateModal(true)} />

        {/* Center / Main Content Area with Routes */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              {/* 1. Home Dashboard Route */}
              <Route
                path="/"
                element={
                  <DashboardPage
                    onOpenCreateModal={() => setShowCreateModal(true)}
                    onDeleteRepo={handleDeleteRepo}
                  />
                }
              />

              {/* 2. Repositories Page Route */}
              <Route
                path="/repositories"
                element={
                  <RepositoriesPage
                    onOpenCreateModal={() => setShowCreateModal(true)}
                    onDeleteRepo={handleDeleteRepo}
                  />
                }
              />

              {/* 3. Create Repository Page Route */}
              <Route
                path="/create-repository"
                element={<CreateRepositoryPage />}
              />

              {/* 4. Settings Page Route */}
              <Route
                path="/settings"
                element={<SettingsPage onOpenAuthModal={() => setShowAuthModal(true)} />}
              />

              {/* 5. Profile Page Route */}
              <Route
                path="/profile"
                element={<ProfilePage />}
              />

              {/* 6. Organizations Page Route */}
              <Route
                path="/organizations"
                element={<OrganizationsPage />}
              />

              {/* 7. Activity History Page Route */}
              <Route
                path="/activity"
                element={<ActivityPage />}
              />

              {/* 8. Repository Details / Explorer Page Route */}
              <Route
                path="/repo/:owner/:repo"
                element={<RepoDetailsPage />}
              />

              {/* Fallback to Home */}
              <Route
                path="*"
                element={<Navigate to="/" replace />}
              />
            </Routes>
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <CreateRepoModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handleCreatedRepo}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
