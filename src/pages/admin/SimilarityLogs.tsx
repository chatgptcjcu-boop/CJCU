import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from '../../components/ui/Card';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  Clock,
  User,
  ArrowRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { SimilarityReviewLog } from '../../types/import';

export default function SimilarityLogs() {
  const [logs, setLogs] = useState<SimilarityReviewLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/similarity-logs');
      const data = await response.json();
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch similarity logs');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    if (filter === 'high') return log.similarity_score >= 0.8;
    if (filter === 'medium') return log.similarity_score >= 0.5 && log.similarity_score < 0.8;
    if (filter === 'low') return log.similarity_score < 0.5;
    return true;
  });

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-red-600 bg-red-50 border-red-100';
    if (score >= 0.5) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-emerald-600 bg-emerald-50 border-emerald-100';
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">相似度風險檢查紀錄</h1>
        <p className="text-slate-500 mt-1">監控匯入素材與現有內容或外部來源的重合度風險</p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg w-full md:w-96">
          <Search className="w-5 h-5 text-slate-400" />
          <input type="text" placeholder="搜尋素材名稱或風險原因..." className="bg-transparent border-none focus:outline-none text-sm w-full" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {(['all', 'high', 'medium', 'low'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-1.5 rounded-md text-sm font-bold transition-all",
                  filter === f ? "bg-white text-[#1877f2] shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {f === 'all' ? '全部' : f === 'high' ? '高風險' : f === 'medium' ? '中風險' : '低風險'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">素材名稱</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">相似度得分</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">風險原因</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">審核狀態</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">檢查時間</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              [1, 2, 3, 4, 5].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-6 py-4 h-16 bg-slate-50/50" />
                </tr>
              ))
            ) : filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-700 text-sm">素材 #{log.source_import_id.split('_')[1]}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border",
                      getScoreColor(log.similarity_score)
                    )}>
                      {(log.similarity_score * 100).toFixed(0)}%
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {log.matched_reasons.map((reason, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                          {reason}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "flex items-center gap-1.5 text-[10px] font-bold",
                      log.status === 'flagged' ? "text-amber-600" : "text-emerald-600"
                    )}>
                      {log.status === 'flagged' ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      {log.status === 'flagged' ? '待處理' : '已忽略'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(log.checked_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-400 hover:text-[#1877f2]">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center text-slate-400">
                  目前沒有相似度風險紀錄
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-red-50 border-none">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-red-900">高風險警示</h3>
              <p className="text-xs text-red-700 mt-1">共有 {logs.filter(l => l.similarity_score >= 0.8).length} 筆素材相似度超過 80%，建議優先審核。</p>
            </div>
          </div>
        </Card>
        <Card className="bg-amber-50 border-none">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-amber-900">中風險提醒</h3>
              <p className="text-xs text-amber-700 mt-1">共有 {logs.filter(l => l.similarity_score >= 0.5 && l.similarity_score < 0.8).length} 筆素材相似度在 50%-80% 之間。</p>
            </div>
          </div>
        </Card>
        <Card className="bg-emerald-50 border-none">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-900">系統狀態</h3>
              <p className="text-xs text-emerald-700 mt-1">相似度檢查引擎運行正常，平均檢查耗時 1.2s。</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
