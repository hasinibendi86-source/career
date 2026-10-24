import React, { useState } from 'react';
import { Sparkles, User, Mail, Lock, GraduationCap, ArrowRight, CheckCircle2, ShieldCheck, Database } from 'lucide-react';
import { api } from '../services/api';

export default function LoginPage({ onLoginSuccess, onGuestAccess, onShowToast }) {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    degree: 'B.Tech Computer Science',
    target_role: 'Software Developer'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await api.register(formData);
        onShowToast('Account created successfully! Logging you in...', 'success');
        const loginRes = await api.login(formData.email, formData.password);
        onLoginSuccess(loginRes.user);
      } else {
        const res = await api.login(formData.email, formData.password);
        onShowToast(`Welcome back, ${res.user.full_name}!`, 'success');
        onLoginSuccess(res.user);
      }
    } catch (err) {
      setError(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await api.login('demo@careerai.com', 'demo123');
      onShowToast('Logged in as Alex Morgan (Sample Student Demo)!', 'success');
      onLoginSuccess(res.user);
    } catch (err) {
      setError('Failed to log in with demo credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative z-10">
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md rounded-3xl glass-panel-glow p-8 sm:p-10 text-white border border-purple-500/30 relative shadow-2xl">
        {/* Brand Logo & Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-600 p-[1.5px] shadow-[0_0_25px_rgba(139,92,246,0.5)] mb-3">
            <div className="w-full h-full bg-[#0a0d20] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-purple-400" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Career<span className="text-gradient-purple-pink">AI</span>
          </h1>
          <p className="text-xs text-slate-300">
            {isRegister
              ? 'Create a profile to save predictions and resume analyses'
              : 'Sign in to access your placement predictor, resume analyzer, and roadmap'}
          </p>
        </div>

        {/* 1-Click Demo Quick Fill Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold text-purple-200 bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/40 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.25)] transition-all hover:scale-[1.01]"
          >
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>1-Click Demo Student Login (Instant Access)</span>
          </button>
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#0b0e24] px-3 text-[10px] uppercase tracking-wider text-slate-400 font-semibold absolute">
              or continue with credentials
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g., Alex Morgan"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {isRegister && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Degree Program</label>
                <select
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white bg-[#0e142c]"
                >
                  <option value="B.Tech Computer Science">B.Tech CSE</option>
                  <option value="B.Tech Information Technology">B.Tech IT</option>
                  <option value="BCA">BCA</option>
                  <option value="MCA">MCA</option>
                  <option value="Diploma in Engineering">Diploma</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Role</label>
                <select
                  value={formData.target_role}
                  onChange={(e) => setFormData({ ...formData, target_role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white bg-[#0e142c]"
                >
                  <option value="Software Developer">Software Developer</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Full-Stack Developer">Full-Stack Developer</option>
                  <option value="Machine Learning Engineer">ML Engineer</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <span>{loading ? 'Authenticating...' : isRegister ? 'Create Account & Enter' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Toggle Login vs Register */}
        <div className="mt-5 text-center text-xs text-slate-400">
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setIsRegister(false); setError(''); }}
                className="text-purple-400 hover:text-purple-300 font-bold underline ml-1"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setIsRegister(true); setError(''); }}
                className="text-purple-400 hover:text-purple-300 font-bold underline ml-1"
              >
                Create One
              </button>
            </span>
          )}
        </div>

        {/* Guest Exploration Option */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <button
            type="button"
            onClick={onGuestAccess}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors inline-flex items-center gap-1.5"
          >
            <span>Continue as Guest Visitor</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Security & Database Indicator */}
        <div className="mt-4 pt-3 flex items-center justify-center gap-2 text-[10px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>SHA-256 Hashed Passwords • SQLite DB Persistent</span>
        </div>
      </div>
    </div>
  );
}
