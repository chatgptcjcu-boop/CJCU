import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { 
  Users, 
  Zap, 
  Database, 
  Terminal, 
  TrendingUp, 
  Activity, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { Task, User, AuditLog } from '../../types';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTasks: 0,
    totalSources: 0,
    totalLogs: 0,
    successRate: 0,
    avgTime: 0
  });
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, tasksRes, sourcesRes, logsRes] = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/tasks'),
          fetch('/api/sources'),
          fetch('/api/admin/logs')
        ]);

        const users = await usersRes.json();
        const tasks = await tasksRes.json();
        const sources = await sourcesRes.json();
        const logs = await logsRes.json();

        setStats({
          totalUsers: users.length,
          totalTasks: tasks.length,
          totalSources: sources.length,
          totalLogs: logs.length,
          successRate: 98.5, // Mocked
          avgTime: 3.8 // Mocked
        });

        setRecentTasks(tasks.sort((a: Task, b: Task) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { label: '總使用者數', value: stats.totalUsers, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+12%', trendUp: true },
    { label: '總生成任務', value: stats.totalTasks, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+24%', trendUp: true },
    { label: '資料來源', value: stats.totalSources, icon: Database, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '穩定', trendUp: true },
    { label: '系統日誌', value: stats.totalLogs, icon: Terminal, color: 'text-slate-600', bg: 'bg-slate-50', trend: '正常', trendUp: true },
  ];

  if (loading) return <div className="p-8 text-center text-slate-500">載入中...</div>;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">管理儀表板</h1>
        <p className="text-slate-500 mt-1">監控系統運行狀態、使用者活動與資源使用情況</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${stat.trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                  {stat.trend}
                  {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card title="最近生成任務" description="系統中最新完成的 AI 生成活動">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">任務名稱</th>
                    <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">使用者</th>
                    <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">狀態</th>
                    <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">時間</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-700 text-sm">{task.taskName}</div>
                        <div className="text-[10px] text-slate-400 uppercase">{task.taskType}</div>
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-600">{task.userId}</td>
                      <td className="px-4 py-4">
                        <div className={`flex items-center gap-1.5 text-[10px] font-bold ${
                          task.status === 'completed' ? 'text-emerald-600' : 'text-amber-600'
                        }`}>
                          {task.status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                          {task.status === 'completed' ? '已完成' : '處理中'}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-500 text-right">
                        {new Date(task.createdAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="系統負載" description="API 回應與伺服器效能">
              <div className="space-y-6 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500 uppercase tracking-widest">API 回應率</span>
                    <span className="text-emerald-600">99.9%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[99.9%]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500 uppercase tracking-widest">伺服器 CPU</span>
                    <span className="text-indigo-600">24%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[24%]" />
                  </div>
                </div>
              </div>
            </Card>
            <Card title="資源分配" description="各類型任務佔比">
              <div className="space-y-4 pt-4">
                {[
                  { label: '新聞改寫', value: '45%', color: 'bg-indigo-500' },
                  { label: '簡報大綱', value: '25%', color: 'bg-amber-500' },
                  { label: '教案設計', value: '15%', color: 'bg-emerald-500' },
                  { label: '其他', value: '15%', color: 'bg-slate-400' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-xs font-bold text-slate-600 flex-1">{item.label}</span>
                    <span className="text-xs font-bold text-slate-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card title="系統運行狀態" className="bg-slate-900 text-white border-none">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-emerald-500 animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-500">系統運行中</p>
                  <p className="text-[10px] text-slate-400">最後檢查時間：剛剛</p>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Gemini API</span>
                  <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> 在線
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">資料庫</span>
                  <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> 在線
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">存儲服務</span>
                  <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> 在線
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all text-xs">
                  檢視詳細運行指標
                </button>
              </div>
            </div>
          </Card>

          <Card title="管理員快速操作">
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 bg-slate-50 hover:bg-indigo-50 rounded-2xl flex flex-col items-center gap-2 transition-all group">
                <Users className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                <span className="text-[10px] font-bold text-slate-600">新增用戶</span>
              </button>
              <button className="p-4 bg-slate-50 hover:bg-indigo-50 rounded-2xl flex flex-col items-center gap-2 transition-all group">
                <FileText className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                <span className="text-[10px] font-bold text-slate-600">新增模板</span>
              </button>
              <button className="p-4 bg-slate-50 hover:bg-indigo-50 rounded-2xl flex flex-col items-center gap-2 transition-all group">
                <Database className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                <span className="text-[10px] font-bold text-slate-600">更新來源</span>
              </button>
              <button className="p-4 bg-slate-50 hover:bg-indigo-50 rounded-2xl flex flex-col items-center gap-2 transition-all group">
                <Terminal className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                <span className="text-[10px] font-bold text-slate-600">檢視日誌</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
