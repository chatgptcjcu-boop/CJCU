import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { User, UserRole } from '../../types';
import { UserPlus, Shield, User as UserIcon, MoreVertical, Trash2, Edit2, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">載入中...</div>;

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">使用者管理</h1>
          <p className="text-slate-500 mt-1">管理系統存取權限與使用者角色</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all">
          <UserPlus className="w-5 h-5" /> 新增使用者
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none">
          <div className="p-6 space-y-2">
            <div className="text-xs font-bold uppercase tracking-widest opacity-70">總使用者數</div>
            <div className="text-4xl font-bold">{users.length}</div>
            <div className="flex items-center gap-2 text-xs font-medium opacity-90">
              <UserIcon className="w-4 h-4" /> 系統註冊帳號
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-none">
          <div className="p-6 space-y-2">
            <div className="text-xs font-bold uppercase tracking-widest opacity-70">管理員人數</div>
            <div className="text-4xl font-bold">{users.filter(u => u.role === 'admin').length}</div>
            <div className="flex items-center gap-2 text-xs font-medium opacity-90">
              <Shield className="w-4 h-4" /> 具備後台存取權限
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-none">
          <div className="p-6 space-y-2">
            <div className="text-xs font-bold uppercase tracking-widest opacity-70">活躍使用者</div>
            <div className="text-4xl font-bold">{users.length}</div>
            <div className="flex items-center gap-2 text-xs font-medium opacity-90">
              <CheckCircle2 className="w-4 h-4" /> 帳號狀態正常
            </div>
          </div>
        </Card>
      </div>

      <Card title="使用者列表">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">使用者資訊</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">角色</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">電子郵件</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">收藏模板</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold">
                        {u.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-slate-700">{u.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      u.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-600'
                    }`}>
                      {u.role === 'admin' ? '管理員' : '使用者'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">{u.email}</td>
                  <td className="px-4 py-4 text-sm text-slate-500">
                    {u.favoriteTemplates?.length || 0} 個收藏
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all">
                        <Edit2 className="w-4 h-4" />
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
