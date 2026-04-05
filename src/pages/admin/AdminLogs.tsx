import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { AuditLog } from '../../types';
import { Terminal, Clock, User as UserIcon, Activity, Search, Filter } from 'lucide-react';

export default function AdminLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/logs')
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">載入中...</div>;

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">系統日誌</h1>
          <p className="text-slate-500 mt-1">監控系統活動、錯誤與使用者操作紀錄</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all text-sm">
            <Filter className="w-4 h-4" /> 篩選
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all text-sm">
            匯出 CSV
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3" title="最近活動日誌">
          <div className="space-y-4">
            {logs.length === 0 ? (
              <div className="py-20 text-center text-slate-300">
                <Terminal className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-sm font-medium">尚無活動紀錄</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">時間</th>
                      <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">使用者</th>
                      <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">動作</th>
                      <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">詳情</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-4 text-xs text-slate-500 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-xs font-bold text-slate-700">{log.userId}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                            log.action.includes('ERROR') ? 'bg-red-50 text-red-600' : 
                            log.action.includes('LOGIN') ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-500 max-w-xs truncate">
                          {log.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card title="系統狀態">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span>API 狀態</span>
                </div>
                <span className="text-xs font-bold text-emerald-600">正常</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  <span>平均回應時間</span>
                </div>
                <span className="text-xs font-bold text-indigo-600">1.2s</span>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">伺服器資訊</div>
                <div className="text-xs text-slate-500 font-mono">
                  Node: v20.x<br />
                  Env: production<br />
                  Region: asia-northeast1
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
