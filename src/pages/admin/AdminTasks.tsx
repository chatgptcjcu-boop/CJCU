import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Task } from '../../types';
import { Search, Filter, Eye, Trash2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function AdminTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => {
        setTasks(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">載入中...</div>;

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">任務管理</h1>
          <p className="text-slate-500 mt-1">檢視系統中所有使用者的生成任務</p>
        </div>
      </header>

      <Card title="所有任務列表">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">任務名稱</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">使用者</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">類型</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">狀態</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">時間</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="font-bold text-slate-700">{task.taskName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{task.id}</div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">{task.userId}</td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase">
                      {task.taskType}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className={`flex items-center gap-1.5 text-xs font-bold ${
                      task.status === 'completed' ? 'text-emerald-600' : 
                      task.status === 'failed' ? 'text-red-600' : 'text-amber-600'
                    }`}>
                      {task.status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : 
                       task.status === 'failed' ? <AlertCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      {task.status === 'completed' ? '已完成' : 
                       task.status === 'failed' ? '失敗' : '處理中'}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs text-slate-500">
                    {new Date(task.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
