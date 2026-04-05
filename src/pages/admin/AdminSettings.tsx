import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Save, Shield, Settings, Layout, Type, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SystemSettings, TaskType, OutputFormat } from '../../types';

export default function AdminSettings() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setMessage('設定已成功儲存');
      }
    } catch (err) {
      setMessage('儲存失敗');
    } finally {
      setSaving(false);
    }
  };

  const toggleTaskType = (type: TaskType) => {
    if (!settings) return;
    const enabled = settings.enabledTaskTypes.includes(type);
    const newList = enabled 
      ? settings.enabledTaskTypes.filter(t => t !== type)
      : [...settings.enabledTaskTypes, type];
    setSettings({ ...settings, enabledTaskTypes: newList });
  };

  if (loading) return <div className="p-8 text-center text-slate-500">載入中...</div>;
  if (!settings) return <div className="p-8 text-center text-red-500">無法載入設定</div>;

  const taskTypes: { id: TaskType; label: string }[] = [
    { id: 'news', label: '新聞改寫' },
    { id: 'presentation', label: '簡報大綱' },
    { id: 'lesson', label: '教案設計' },
    { id: 'official', label: '正式公文' },
    { id: 'image_prompt', label: '生圖指令' },
    { id: 'card', label: '卡片生成' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">系統設定</h1>
          <p className="text-slate-500 mt-1">管理全域模型參數、安全設定與系統預設值</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all disabled:opacity-50"
        >
          {saving ? '儲存中...' : <><Save className="w-5 h-5" /> 儲存變更</>}
        </button>
      </header>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 font-bold text-sm ${
          message.includes('成功') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
        }`}>
          {message.includes('成功') ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="模型與輸出設定">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">預設模型</label>
              <select
                value={settings.defaultModel}
                onChange={(e) => setSettings({ ...settings, defaultModel: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="gemini-3-flash-preview">Gemini 3 Flash (最新/快速)</option>
                <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (強大/推理)</option>
                <option value="gemini-2.5-flash-preview-tts">Gemini 2.5 Flash TTS</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">預設輸出格式</label>
              <select
                value={settings.defaultOutputFormat}
                onChange={(e) => setSettings({ ...settings, defaultOutputFormat: e.target.value as OutputFormat })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="markdown">Markdown</option>
                <option value="json">JSON</option>
                <option value="yaml">YAML</option>
                <option value="image_prompt">Image Prompt</option>
              </select>
            </div>
          </div>
        </Card>

        <Card title="安全設定 (Safety Settings)">
          <div className="space-y-4">
            {Object.keys(settings.safetySettings).map((key) => (
              <div key={key}>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <select
                  value={(settings.safetySettings as any)[key]}
                  onChange={(e) => setSettings({
                    ...settings,
                    safetySettings: { ...settings.safetySettings, [key]: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="BLOCK_NONE">不封鎖 (None)</option>
                  <option value="BLOCK_ONLY_HIGH">僅封鎖高風險 (High)</option>
                  <option value="BLOCK_MEDIUM_AND_ABOVE">封鎖中等以上 (Medium+)</option>
                  <option value="BLOCK_LOW_AND_ABOVE">封鎖低等以上 (Low+)</option>
                </select>
              </div>
            ))}
          </div>
        </Card>

        <Card title="可用任務類型開關" className="md:col-span-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {taskTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => toggleTaskType(type.id)}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                  settings.enabledTaskTypes.includes(type.id)
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-600 shadow-sm'
                    : 'bg-white border-slate-100 text-slate-400 grayscale'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  settings.enabledTaskTypes.includes(type.id) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  <Layout className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold">{type.label}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card title="系統提示詞預設值 (Default System Prompt)" className="md:col-span-2">
          <div className="space-y-4">
            <p className="text-xs text-slate-500">當模板未定義 system_instruction 時，將使用此預設值。</p>
            <textarea
              value={settings.defaultSystemPrompt}
              onChange={(e) => setSettings({ ...settings, defaultSystemPrompt: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[150px] font-mono text-sm"
              placeholder="請輸入預設的系統指令..."
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
