import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  Shield,
  Database,
  FileText,
  Users,
  Terminal,
  Sliders,
  Layers,
  Wand2,
  ShieldAlert,
  Edit3,
  Eye,
  FolderKanban,
  MoreHorizontal
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mainNavItems = [
    { icon: LayoutDashboard, label: '首頁', path: '/' },
    { icon: PlusCircle, label: '建立', path: '/create' },
    { icon: Edit3, label: '編修', path: '/edit' },
    { icon: Eye, label: '預覽', path: '/preview' },
  ];

  const moreNavItems = [
    { icon: FolderKanban, label: '我的教材', path: '/materials' },
    { icon: Layers, label: '範本匯入', path: '/import' },
  ];

  const adminItems = [
    { icon: LayoutDashboard, label: '管理首頁', path: '/admin' },
    { icon: Settings, label: '模板管理', path: '/admin/templates' },
    { icon: Wand2, label: '教材審核', path: '/admin/templates-review' },
    { icon: Users, label: '使用者管理', path: '/admin/users' },
    { icon: Sliders, label: '系統設定', path: '/admin/settings' },
    { icon: Layers, label: '匯入素材管理', path: '/admin/imports' },
    { icon: ShieldAlert, label: '相似度風險紀錄', path: '/admin/similarity-logs' },
    { icon: FileText, label: 'Tasks', path: '/admin/tasks' },
    { icon: Database, label: 'Data Sources', path: '/admin/sources' },
    { icon: Terminal, label: 'Logs', path: '/admin/logs' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const allDesktopItems = [...mainNavItems, ...moreNavItems];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1877f2] rounded-lg flex items-center justify-center">
            <Shield className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-slate-800 text-lg">AI 教材平台</span>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">工作流</div>
          {allDesktopItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group",
                location.pathname === item.path 
                  ? "bg-blue-50 text-[#1877f2]" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-[#1877f2]"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {location.pathname === item.path && (
                <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 bg-[#1877f2] rounded-full" />
              )}
            </Link>
          ))}

          {isAdmin && (
            <>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-8 mb-2 px-2">管理後台</div>
              {adminItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group",
                    location.pathname === item.path 
                      ? "bg-blue-50 text-[#1877f2]" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-[#1877f2]"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-3 mb-2">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold">
              {user?.name?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.role === 'admin' ? '管理員' : '一般使用者'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">登出</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <span className="hidden md:inline">首頁</span>
            <ChevronRight className="w-4 h-4 hidden md:inline" />
            <span className="text-slate-800 font-medium">
              {location.pathname === '/' ? '儀表板' : 
               location.pathname === '/create' ? '建立教材' : 
               location.pathname === '/edit' ? '內容編修' : 
               location.pathname === '/preview' ? '版型預覽' : 
               location.pathname === '/materials' ? '我的教材' : 
               location.pathname === '/import' ? '範本匯入' : '管理'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-slate-800">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.role === 'admin' ? '管理權限' : '標準權限'}</p>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 pb-24 md:pb-8">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation (Mobile) - 5 Items */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 flex justify-between items-center z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] pb-safe">
        {mainNavItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 transition-all flex-1 py-1",
              location.pathname === item.path 
                ? "text-[#1877f2]" 
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            <item.icon className={cn("w-6 h-6", location.pathname === item.path && "fill-current")} />
            <span className="text-[10px] font-bold">{item.label}</span>
          </Link>
        ))}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className={cn(
            "flex flex-col items-center gap-1 transition-all flex-1 py-1",
            isMobileMenuOpen || moreNavItems.some(i => i.path === location.pathname) || location.pathname.startsWith('/admin')
              ? "text-[#1877f2]" 
              : "text-slate-400 hover:text-slate-600"
          )}
        >
          <MoreHorizontal className="w-6 h-6" />
          <span className="text-[10px] font-bold">更多</span>
        </button>
      </nav>

      {/* Mobile Sidebar Overlay (More Menu) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed inset-y-0 right-0 w-64 bg-white z-50 md:hidden flex flex-col shadow-2xl"
            >
              <div className="p-4 flex justify-between items-center border-b border-slate-100">
                <span className="font-bold text-slate-800">更多功能</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-50 rounded-full text-slate-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">個人</div>
                  <div className="space-y-1">
                    {moreNavItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                          location.pathname === item.path 
                            ? "bg-blue-50 text-[#1877f2] font-bold" 
                            : "text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {isAdmin && (
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">管理後台</div>
                    <div className="space-y-1">
                      {adminItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                            location.pathname === item.path 
                              ? "bg-blue-50 text-[#1877f2] font-bold" 
                              : "text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </nav>

              <div className="p-4 border-t border-slate-100">
                <div className="flex items-center gap-3 px-3 py-3 mb-4 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-[#1877f2] font-bold">
                    {user?.name?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 font-bold rounded-xl transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>登出系統</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
