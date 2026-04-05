import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronRight,
  Trash2,
  Edit3,
  Eye,
  FolderKanban
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Task } from '../types';

export default function MyMaterialsPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'generated' | 'editing' | 'review' | 'published'>('all');

  useEffect(() => {
    fetch('/api/tasks?userId=user_1')
      .then(res => res.json())
      .then(data => {
        // Mock adding statuses for demo purposes
        const tasksWithStatus = data.map((t: any, i: number) => ({
          ...t,
          materialStatus: i === 0 ? 'published' : i === 1 ? 'editing' : 'generated'
        }));
        setTasks(tasksWithStatus.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setLoading(false);
      });
  }, []);

  const filteredTasks = tasks.filter(t => 
    (activeTab === 'all' || (t as any).materialStatus === activeTab) &&
    (t.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     t.topic.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'draft': return { label: '草稿', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: Edit3 };
      case 'generated': return { label: '已生成', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: FileText };
      case 'editing': return { label: '編修中', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock };
      case 'review': return { label: '審核中', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: Eye };
      case 'published': return { label: '已發布', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 };
      default: return { label: '未知', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: AlertCircle };
    }
  };

  const tabs = [
    { id: 'all', label: '全部' },
    { id: 'draft', label: '草稿' },
    { id: 'generated', label: '已生成' },
    { id: 'editing', label: '編修中' },
    { id: 'review', label: '審核中' },
    { id: 'published', label: '已發布' },
  ];

  if (loading) return <div className="p-8 text-center text-slate-500">載入中...</div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">我的教材</h1>
          <p className="text-slate-500 mt-1">管理您建立的所有教學內容與進度</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜尋教材名稱..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1877f2] outline-none shadow-sm transition-all"
          />
        </div>
      </header>

      {/* Tabs */}
      <div className="flex overflow-x-auto custom-scrollbar pb-2 gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all",
              activeTab === tab.id 
                ? "bg-slate-800 text-white shadow-md" 
                : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.map((task: any) => {
          const statusConfig = getStatusConfig(task.materialStatus);
          
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-white p-5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-[#1877f2] transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{task.taskName}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={cn("text-xs px-2.5 py-1 rounded-md border font-bold flex items-center gap-1.5", statusConfig.color)}>
                      <statusConfig.icon className="w-3.5 h-3.5" />
                      {statusConfig.label}
                    </span>
                    <span className="text-slate-200">•</span>
                    <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(task.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => navigate('/edit')}
                  className="px-3 py-2 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-[#1877f2] rounded-lg text-sm font-bold transition-all flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" /> 編修
                </button>
                <button 
                  onClick={() => navigate('/preview')}
                  className="px-3 py-2 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-[#1877f2] rounded-lg text-sm font-bold transition-all flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" /> 預覽
                </button>
              </div>
            </motion.div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="py-32 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
            <FolderKanban className="w-16 h-16 text-slate-100 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">尚無符合條件的教材</p>
          </div>
        )}
      </div>
    </div>
  );
}
