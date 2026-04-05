import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Copy, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Code,
  Settings2,
  Save,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Template, TaskType, OutputFormat } from '../../types';

export default function TemplateManager() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Partial<Template> | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/templates');
      const data = await res.json();
      setTemplates(data);
    } catch (err) {
      console.error('Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;

    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTemplate),
      });
      if (res.ok) {
        setMessage('模板已儲存');
        setIsModalOpen(false);
        fetchTemplates();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('儲存失敗');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除此模板嗎？')) return;
    try {
      const res = await fetch(`/api/templates/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage('模板已刪除');
        fetchTemplates();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('刪除失敗');
    }
  };

  const openModal = (template: Partial<Template> | null = null) => {
    setEditingTemplate(template || {
      name: '',
      type: 'news',
      system_instruction: '',
      prompt_template: '',
      outputFormat: 'markdown',
      version: '1.0',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const taskTypes: { id: TaskType; label: string }[] = [
    { id: 'news', label: '新聞改寫' },
    { id: 'presentation', label: '簡報大綱' },
    { id: 'lesson', label: '教案設計' },
    { id: 'official', label: '正式公文' },
    { id: 'image_prompt', label: '生圖指令' },
    { id: 'card', label: '卡片生成' },
  ];

  if (loading && templates.length === 0) return <div className="p-8 text-center text-slate-500">載入中...</div>;

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">模板管理</h1>
          <p className="text-slate-500 mt-1">管理 Prompt 模板、系統指令與輸出規範</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all"
        >
          <Plus className="w-5 h-5" /> 新增模板
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
        {templates.map((template) => (
          <Card key={template.id} className="group hover:shadow-md transition-all">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{template.name}</h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{template.type}</span>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => openModal(template)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(template.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="text-xs text-slate-500 line-clamp-3 bg-slate-50 p-3 rounded-lg font-mono">
                {template.prompt_template}
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">v{template.version}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${template.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    {template.isActive ? '啟用中' : '停用'}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{template.outputFormat}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingTemplate && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                {editingTemplate.id ? '編輯模板' : '新增模板'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">模板名稱</label>
                    <input
                      type="text"
                      required
                      value={editingTemplate.name}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="例如：專業新聞改寫 v2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">任務類型</label>
                      <select
                        value={editingTemplate.type}
                        onChange={(e) => setEditingTemplate({ ...editingTemplate, type: e.target.value as TaskType })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                        {taskTypes.map(t => (
                          <option key={t.id} value={t.id}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">輸出格式</label>
                      <select
                        value={editingTemplate.outputFormat}
                        onChange={(e) => setEditingTemplate({ ...editingTemplate, outputFormat: e.target.value as OutputFormat })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                        <option value="markdown">Markdown</option>
                        <option value="json">JSON</option>
                        <option value="yaml">YAML</option>
                        <option value="image_prompt">Image Prompt</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">版本號</label>
                    <input
                      type="text"
                      value={editingTemplate.version}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, version: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={editingTemplate.isActive}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, isActive: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="isActive" className="text-sm font-bold text-slate-700">啟用此模板</label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">系統指令 (System Instruction)</label>
                    <textarea
                      required
                      value={editingTemplate.system_instruction}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, system_instruction: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none min-h-[120px] text-sm"
                      placeholder="定義 AI 的角色與行為規範..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Prompt 模板 (使用 {"{{topic}}"} 等變數)</label>
                    <textarea
                      required
                      value={editingTemplate.prompt_template}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, prompt_template: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none min-h-[150px] font-mono text-sm"
                      placeholder="請根據以下資訊撰寫內容：\n主題：{{topic}}\n..."
                    />
                  </div>
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
                <Save className="w-5 h-5" /> 儲存模板
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
