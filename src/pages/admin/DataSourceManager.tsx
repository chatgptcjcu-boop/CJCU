import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Database, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Link as LinkIcon,
  Globe,
  Upload,
  Save,
  X,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DataSource } from '../../types';

export default function DataSourceManager() {
  const [sources, setSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<Partial<DataSource> | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sources');
      const data = await res.json();
      setSources(data);
    } catch (err) {
      console.error('Failed to fetch sources');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSource) return;

    try {
      const res = await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSource),
      });
      if (res.ok) {
        setMessage('資料來源已儲存');
        setIsModalOpen(false);
        fetchSources();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('儲存失敗');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除此資料來源嗎？')) return;
    try {
      const res = await fetch(`/api/sources/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage('資料來源已刪除');
        fetchSources();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('刪除失敗');
    }
  };

  const openModal = (source: Partial<DataSource> | null = null) => {
    setEditingSource(source || {
      name: '',
      type: 'text',
      description: '',
      content: '',
      isActive: true
    });
    setIsModalOpen(true);
  };

  if (loading && sources.length === 0) return <div className="p-8 text-center text-slate-500">載入中...</div>;

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">資料來源管理</h1>
          <p className="text-slate-500 mt-1">管理 RAG 知識庫，為 AI 提供專業背景資訊</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all"
        >
          <Plus className="w-5 h-5" /> 新增來源
        </button>
      </header>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 font-bold text-sm ${
          message.includes('成功') || message.includes('儲存') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
        }`}>
          {message.includes('失敗') ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sources.map((source) => (
          <Card key={source.id} className="group hover:shadow-md transition-all">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{source.name}</h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{source.type}</span>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => openModal(source)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(source.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-slate-500 line-clamp-2 min-h-[40px]">
                {source.description}
              </p>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${source.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    {source.isActive ? '啟用中' : '停用'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    {source.content.length} 字元
                  </span>
                </div>
                <button 
                  onClick={() => openModal(source)}
                  className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" /> 檢視內容
                </button>
              </div>
            </div>
          </Card>
        ))}
        {sources.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
            <Database className="w-16 h-16 text-slate-100 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">尚無資料來源</p>
            <button onClick={() => openModal()} className="mt-4 text-indigo-600 font-bold hover:underline">立即新增第一個來源</button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && editingSource && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                {editingSource.id ? '編輯資料來源' : '新增資料來源'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">來源名稱</label>
                    <input
                      type="text"
                      required
                      value={editingSource.name}
                      onChange={(e) => setEditingSource({ ...editingSource, name: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="例如：2024 公司產品手冊"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">來源類型</label>
                    <select
                      value={editingSource.type}
                      onChange={(e) => setEditingSource({ ...editingSource, type: e.target.value as any })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="text">純文字 (Text)</option>
                      <option value="pdf">PDF 文件</option>
                      <option value="url">網頁連結 (URL)</option>
                      <option value="api">API 串接</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">簡短描述</label>
                    <textarea
                      value={editingSource.description}
                      onChange={(e) => setEditingSource({ ...editingSource, description: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none min-h-[80px] text-sm"
                      placeholder="描述此資料來源的用途與內容..."
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={editingSource.isActive}
                      onChange={(e) => setEditingSource({ ...editingSource, isActive: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="isActive" className="text-sm font-bold text-slate-700">啟用此來源</label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-bold text-slate-700">內容 (Content)</label>
                    <div className="flex gap-2">
                      <button type="button" className="p-1.5 text-slate-400 hover:text-indigo-600 transition-all" title="上傳檔案">
                        <Upload className="w-4 h-4" />
                      </button>
                      <button type="button" className="p-1.5 text-slate-400 hover:text-indigo-600 transition-all" title="抓取網頁">
                        <Globe className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <textarea
                    required
                    value={editingSource.content}
                    onChange={(e) => setEditingSource({ ...editingSource, content: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none min-h-[300px] font-mono text-xs leading-relaxed"
                    placeholder="貼上參考資料內容..."
                  />
                  <p className="text-[10px] text-slate-400">目前字數：{editingSource.content?.length || 0} / 100,000</p>
                </div>
              </div>
            </form>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 text-slate-500 font-bold hover:bg-slate-200 rounded-xl transition-all"
              >
                取消
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all"
              >
                <Save className="w-5 h-5" /> 儲存來源
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
