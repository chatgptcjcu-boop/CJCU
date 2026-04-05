import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, ShieldCheck, User as UserIcon, Lock, Zap, Shield } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginPage({ isEmbedded = false }: { isEmbedded?: boolean }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e?: React.FormEvent, credentials?: { email: string; password: string }) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    const loginData = credentials || { email, password };

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (response.ok) {
        login(data.user);
        if (!isEmbedded) {
          navigate('/');
        }
      } else {
        setError(data.message || '登入失敗');
      }
    } catch (err) {
      setError('連線錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (role: 'admin' | 'user') => {
    const credentials = role === 'admin' 
      ? { email: 'admin12345@ai.toolkit', password: 'admin@&$)(' }
      : { email: 'user12345@ai.toolkit', password: 'user”@&$)' };
    
    setEmail(credentials.email);
    setPassword(credentials.password);
    handleLogin(undefined, credentials);
  };

  if (isEmbedded) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <ShieldCheck className="text-white w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">請登入以繼續</h2>
          <p className="text-slate-500">您需要登入才能建立 AI 任務</p>
        </div>
        
        <form onSubmit={(e) => handleLogin(e)} className="space-y-4 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="電子郵件"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="密碼"
            required
          />
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all"
          >
            {loading ? '登入中...' : '登入'}
          </button>
          
          <div className="grid grid-cols-1 gap-3 mt-6">
            <button
              type="button"
              onClick={() => quickLogin('admin')}
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition-all"
            >
              管理員快速登入
            </button>
            <button
              type="button"
              onClick={() => quickLogin('user')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all border border-slate-200"
            >
              使用者快速登入
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col lg:flex-row items-center justify-center p-6 lg:p-24">
      {/* Left Side: Branding */}
      <div className="lg:w-1/2 lg:pr-12 mb-12 lg:mb-0 text-center lg:text-left max-w-lg">
        <h1 className="text-[#1877f2] text-5xl lg:text-6xl font-bold tracking-tight mb-4">
          AI Toolkit
        </h1>
        <p className="text-2xl text-[#1c1e21] leading-tight font-medium">
          專業的 AI 內容管理工具，幫助您建立任務、管理模板、並即時查看高品質的生成結果。
        </p>
        <div className="mt-8 hidden lg:flex flex-col gap-4 text-slate-500">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-amber-500" />
            <span>快速建立多樣化的 AI 生成任務</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>安全的後台模板與資料來源管理</span>
          </div>
        </div>
      </div>

      {/* Right Side: Login Card */}
      <div className="lg:w-1/2 w-full max-w-[400px]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-lg shadow-xl border border-slate-200"
        >
          <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
            <div className="space-y-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] text-lg transition-all"
                placeholder="電子郵件"
                required
              />
            </div>

            <div className="space-y-1">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] text-lg transition-all"
                placeholder="密碼"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1877f2] hover:bg-[#166fe5] text-white text-xl font-bold rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '登入中...' : '登入'}
            </button>

            <div className="text-center">
              <a href="#" className="text-[#1877f2] text-sm hover:underline">忘記密碼？</a>
            </div>

            <hr className="my-6 border-slate-200" />

            <div className="space-y-3">
              <p className="text-sm text-slate-500 text-center font-medium mb-2">快速登入測試身份</p>
              <button
                type="button"
                onClick={() => quickLogin('admin')}
                className="w-full py-3 bg-[#42b72a] hover:bg-[#36a420] text-white font-bold rounded-md transition-all flex items-center justify-center gap-2"
              >
                <Shield className="w-5 h-5" />
                以管理者身份快速登入
              </button>
              <button
                type="button"
                onClick={() => quickLogin('user')}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md transition-all border border-slate-300 flex items-center justify-center gap-2"
              >
                <UserIcon className="w-5 h-5" />
                以使用者身份快速登入
              </button>
            </div>
          </form>
        </motion.div>
        
        <p className="text-center mt-6 text-sm text-slate-600">
          <b>建立粉絲專頁</b> 為名人、品牌或商務建立專頁。
        </p>
      </div>
    </div>
  );
}
