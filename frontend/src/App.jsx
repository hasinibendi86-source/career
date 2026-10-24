import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';

import LandingPage from './pages/LandingPage';
import PlacementPredictor from './pages/PlacementPredictor';
import ResumeVerifier from './pages/ResumeVerifier';
import AiAssistant from './pages/AiAssistant';
import JobRecommendations from './pages/JobRecommendations';
import SkillRoadmap from './pages/SkillRoadmap';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';

import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [roadmapParams, setRoadmapParams] = useState(null);

  const handleNavigate = (tab, params = null) => {
    setActiveTab(tab);
    if (tab === 'roadmap' && params) {
      setRoadmapParams(params);
    }
  };

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('careerai_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    // Main page is login if not yet authenticated
    return null;
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Health check against Flask backend
    api.checkHealth().then((res) => {
      setBackendOnline(res.online);
    });

    const interval = setInterval(() => {
      api.checkHealth().then((res) => setBackendOnline(res.online));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    localStorage.setItem('careerai_user', JSON.stringify(authenticatedUser));
    setActiveTab('landing');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('careerai_user');
    showToast('Logged out successfully.', 'info');
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col relative selection:bg-purple-600 selection:text-white">
      {/* Interactive Ambient Particle Background */}
      <ParticleBackground />

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={() => {
          if (!user) {
            setUser(null);
          } else {
            setAuthModalOpen(true);
          }
        }}
        onLogout={handleLogout}
        backendOnline={backendOnline}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">
        {!user ? (
          <LoginPage
            onLoginSuccess={handleAuthSuccess}
            onGuestAccess={() => {
              handleAuthSuccess({
                id: 1,
                email: 'demo@careerai.com',
                full_name: 'Alex Morgan (Sample Student)',
                degree: 'B.Tech Computer Science',
                department: 'Computer Science & Engineering',
                cgpa: 8.4,
                target_role: 'Software Developer'
              });
              showToast('Entered as Demo Guest Student', 'info');
            }}
            onShowToast={showToast}
          />
        ) : (
          <>
            {activeTab === 'landing' && <LandingPage onNavigate={handleNavigate} />}
            {activeTab === 'predictor' && <PlacementPredictor user={user} onShowToast={showToast} onNavigate={handleNavigate} />}
            {activeTab === 'resume' && <ResumeVerifier user={user} onShowToast={showToast} onNavigate={handleNavigate} />}
            {activeTab === 'ai-assistant' && <AiAssistant onShowToast={showToast} onNavigate={handleNavigate} />}
            {activeTab === 'jobs' && <JobRecommendations user={user} onShowToast={showToast} onNavigate={handleNavigate} />}
            {activeTab === 'roadmap' && <SkillRoadmap user={user} onShowToast={showToast} initialParams={roadmapParams} onNavigate={handleNavigate} />}
            {activeTab === 'dashboard' && <Dashboard user={user} onNavigate={handleNavigate} onShowToast={showToast} />}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onNavClick={setActiveTab} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        onShowToast={showToast}
      />

      {/* Toast notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
