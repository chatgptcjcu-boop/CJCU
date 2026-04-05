import { motion } from 'motion/react';
import { Card } from '../components/ui/Card';
import { 
  PlusCircle, 
  History, 
  Zap, 
  FileText, 
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Users,
  Database,
  Terminal
} from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const userStats = [
    { label: '本月生成任務', value: '12', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: '已儲存模板', value: '5', icon: FileText, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: '平均生成時間', value: '4.2s', icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: '成功率', value: '98%', icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  const adminStats = [
    { label: '總使用者數', value: '24', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: '總生成任務', value: '1,284', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: '資料來源', value: '8', icon: Database, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: '系統日誌', value: '42', icon: Terminal, color: 'text-slate-500', bg: 'bg-slate-50' },
  ];

  const stats = isAdmin ? adminStats : userStats;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">歡迎回來，{user?.name} 👋</h1>
        <p className="text-slate-500 mt-1">今天想建立什麼樣的 AI 內容？</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className={cn("p-3 rounded-xl", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card title="快速開始" description="選擇一個常用的任務類型立即開始">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/create" className="group p-4 border border-slate-100 rounded-xl hover:border-indigo-200 hover:bg-indigo-50/50 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">新聞改寫</p>
                      <p className="text-xs text-slate-500">將原始資訊轉化為專業新聞稿</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                </div>
              </Link>
              <Link to="/create" className="group p-4 border border-slate-100 rounded-xl hover:border-indigo-200 hover:bg-indigo-50/50 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">簡報大綱</p>
                      <p className="text-xs text-slate-500">快速生成結構化的簡報內容</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                </div>
              </Link>
            </div>
            <div className="mt-6 text-center">
              <Link to="/create" className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:gap-3 transition-all">
                查看所有任務類型 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Card>

          <Card title="最近任務" description="您最近完成的生成紀錄">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">產品發佈新聞稿 v{i}</p>
                      <p className="text-xs text-slate-400">2026-04-05 10:30</p>
                    </div>
                  </div>
                  <button className="text-xs font-medium text-indigo-600 hover:underline">查看結果</button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="系統公告" className="bg-indigo-600 text-white border-none shadow-indigo-200">
            <div className="space-y-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <p className="text-sm font-bold">Gemini 1.5 Pro 已上線</p>
                <p className="text-xs text-indigo-100 mt-1">現在支援更長的上下文與更精準的邏輯推理。</p>
              </div>
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <p className="text-sm font-bold">新模板：生圖指令生成</p>
                <p className="text-xs text-indigo-100 mt-1">幫助您快速寫出高品質的 Midjourney 提示詞。</p>
              </div>
            </div>
          </Card>

          <Card title="使用量統計">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">本月額度</span>
              <span className="text-sm font-bold text-slate-800">12 / 100</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 w-[12%]" />
            </div>
            <p className="text-[10px] text-slate-400 mt-4">額度將於每月 1 號重置</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
