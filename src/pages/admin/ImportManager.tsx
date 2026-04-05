import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../../components/ui/Card';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  AlertTriangle, 
  FileText, 
  Image as ImageIcon,
  Clock,
  User,
  ExternalLink,
  ShieldAlert,
  Layers,
  Wand2,
  FileJson,
  Code
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { SourceImport, ExtractedPattern } from '../../types/import';

export default function ImportManager() {
  const { user } = useAuth();
  const [imports, setImports] = useState<(SourceImport & { pattern: ExtractedPattern })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImport, setSelectedImport] = useState<(SourceImport & { pattern: ExtractedPattern }) | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [converting, setConverting] = useState(false);
  const [conversionType, setConversionType] = useState<'social_post' | 'graphic_card' | 'slide' | 'educational'>('social_post');
  const [showConversionResult, setShowConversionResult] = useState(false);
  const [conversionResult, setConversionResult] = useState<any>(null);

  useEffect(() => {
    fetchImports();
  }, []);

  const fetchImports = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/imports');
      const data = await response.json();
      setImports(data);
    } catch (err) {
      console.error('Failed to fetch imports');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (patternId: string) => {
    try {
      const response = await fetch('/api/admin/imports/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patternId, reviewerId: user?.id }),
      });

      if (response.ok) {
        fetchImports();
        // Don't close modal yet, allow conversion
        const updated = imports.find(i => i.pattern?.id === patternId);
        if (updated) {
          setSelectedImport({ ...updated, pattern: { ...updated.pattern, approved_status: 'approved' } });
        }
      }
    } catch (err) {
      console.error('Approval failed');
    }
  };

  const handleConvert = async () => {
    if (!selectedImport?.pattern) return;
    
    setConverting(true);
    try {
      const response = await fetch('/api/admin/imports/convert-to-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          patternId: selectedImport.pattern.id, 
          templateType: conversionType,
          userId: user?.id 
        }),
      });

      const data = await response.json();
      if (data.success) {
        setConversionResult(data.template);
        setShowConversionResult(true);
      }
    } catch (err) {
      console.error('Conversion failed');
    } finally {
      setConverting(false);
    }
  };

  const filteredImports = imports.filter(imp => {
    if (filter === 'all') return true;
    return imp.pattern?.approved_status === filter;
  });

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">匯入素材管理</h1>
          <p className="text-slate-500 mt-1">審核 AI 抽取的模板結構與相似度風險</p>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg w-full md:w-96">
          <Search className="w-5 h-5 text-slate-400" />
          <input type="text" placeholder="搜尋匯入名稱或使用者..." className="bg-transparent border-none focus:outline-none text-sm w-full" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {(['all', 'pending', 'approved'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-1.5 rounded-md text-sm font-bold transition-all",
                  filter === f ? "bg-white text-[#1877f2] shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {f === 'all' ? '全部' : f === 'pending' ? '待審核' : '已核准'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-2xl" />)
        ) : filteredImports.length > 0 ? (
          filteredImports.map((imp) => (
            <motion.div
              key={imp.id}
              layoutId={imp.id}
              onClick={() => setSelectedImport(imp)}
              className="cursor-pointer group"
            >
              <Card className="hover:shadow-md transition-all border-slate-100 group-hover:border-[#1877f2]">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    "p-2 rounded-lg",
                    imp.import_type === 'text' ? "bg-blue-50 text-blue-600" : 
                    imp.import_type === 'image' ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600"
                  )}>
                    {imp.import_type === 'text' ? <FileText className="w-5 h-5" /> : 
                     imp.import_type === 'image' ? <ImageIcon className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold uppercase",
                    imp.pattern?.approved_status === 'approved' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  )}>
                    {imp.pattern?.approved_status === 'approved' ? '已核准' : '待審核'}
                  </div>
                </div>
                <h3 className="font-bold text-slate-800 mb-1 truncate">{imp.import_name}</h3>
                <p className="text-xs text-slate-500 mb-4 line-clamp-2">{imp.source_text || '圖片素材'}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-50 pt-4">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{imp.imported_by}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(imp.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                {imp.pattern?.risk_flags?.length > 0 && (
                  <div className="mt-3 flex items-center gap-1 text-amber-600 text-[10px] font-bold">
                    <ShieldAlert className="w-3 h-3" />
                    <span>發現 {imp.pattern.risk_flags.length} 個潛在風險</span>
                  </div>
                )}
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400">目前沒有符合條件的匯入素材</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedImport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImport(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              layoutId={selectedImport.id}
              className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Eye className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{selectedImport.import_name}</h2>
                    <p className="text-xs text-slate-500">來源：{selectedImport.source_platform} | 類型：{selectedImport.import_type}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedImport(null)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                  <XCircle className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left: Source Content */}
                  <div className="space-y-6">
                    <section>
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">原始素材</h4>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-700 max-h-64 overflow-y-auto">
                        {selectedImport.source_text || "未提供文字內容"}
                      </div>
                    </section>
                    {selectedImport.source_image_path && (
                      <section>
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">原始圖片</h4>
                        <div className="bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                          <div className="h-48 flex items-center justify-center text-slate-400">
                            <ImageIcon className="w-12 h-12" />
                            <span className="ml-2">圖片預覽 (路徑: {selectedImport.source_image_path})</span>
                          </div>
                        </div>
                      </section>
                    )}
                  </div>

                  {/* Right: AI Extraction Results */}
                  <div className="space-y-6">
                    <section>
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">AI 抽取結果</h4>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                          <p className="text-xs font-bold text-blue-600 mb-1">內容摘要</p>
                          <p className="text-sm text-slate-700">{selectedImport.pattern?.extracted_json.source_summary}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 mb-1">語氣風格</p>
                            <p className="text-xs text-slate-700 font-medium">{selectedImport.pattern?.extracted_json.tone_style}</p>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 mb-1">目標受眾</p>
                            <p className="text-xs text-slate-700 font-medium">{selectedImport.pattern?.extracted_json.target_audience}</p>
                          </div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="text-xs font-bold text-slate-400 mb-2">可重用組件</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedImport.pattern?.extracted_json.component_blocks.map((block, i) => (
                              <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] text-slate-600">
                                {block}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>

                    {selectedImport.pattern?.risk_flags.length > 0 && (
                      <section className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <div className="flex items-center gap-2 text-amber-700 font-bold text-sm mb-2">
                          <AlertTriangle className="w-5 h-5" />
                          <span>風險警示</span>
                        </div>
                        <ul className="list-disc list-inside text-xs text-amber-600 space-y-1">
                          {selectedImport.pattern.risk_flags.map((risk, i) => (
                            <li key={i}>{risk}</li>
                          ))}
                        </ul>
                      </section>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  匯入時間：{new Date(selectedImport.created_at).toLocaleString()}
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setSelectedImport(null)}
                    className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-all"
                  >
                    取消
                  </button>
                  {selectedImport.pattern?.approved_status === 'approved' ? (
                    <div className="flex items-center gap-2">
                      <select 
                        value={conversionType}
                        onChange={(e) => setConversionType(e.target.value as any)}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                      >
                        <option value="social_post">社群貼文模板</option>
                        <option value="graphic_card">圖卡模板</option>
                        <option value="slide">簡報單頁模板</option>
                        <option value="educational">教學內容模板</option>
                      </select>
                      <button 
                        onClick={handleConvert}
                        disabled={converting}
                        className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold rounded-xl transition-all flex items-center gap-2"
                      >
                        {converting ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Wand2 className="w-5 h-5" />
                        )}
                        一鍵轉成模板
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleApprove(selectedImport.pattern.id)}
                      className="px-8 py-2 bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold rounded-xl transition-all flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      核准並發布模式
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Conversion Result Modal */}
      <AnimatePresence>
        {showConversionResult && conversionResult && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConversionResult(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-lg shadow-indigo-200">
                    <Wand2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">模板化改寫完成</h2>
                    <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">已成功抽象化為可重用資產</p>
                  </div>
                </div>
                <button onClick={() => setShowConversionResult(false)} className="p-2 hover:bg-white rounded-full transition-all shadow-sm">
                  <XCircle className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Info Column */}
                  <div className="space-y-6">
                    <Card className="p-5 border-none shadow-sm">
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        模板基本資訊
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">模板名稱</p>
                          <p className="text-sm font-bold text-slate-700">{conversionResult.template_name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">模板目標</p>
                          <p className="text-sm text-slate-600">{conversionResult.template_goal}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">必要欄位</p>
                          <div className="flex flex-wrap gap-1">
                            {conversionResult.required_fields.map((f: string, i: number) => (
                              <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold">
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-5 border-none shadow-sm bg-emerald-50/50 border-emerald-100">
                      <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        安全改寫說明
                      </h3>
                      <p className="text-xs text-emerald-700 leading-relaxed">
                        {conversionResult.safe_rewrite_note}
                      </p>
                    </Card>
                  </div>

                  {/* Rules & Example Column */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                        <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                          <Code className="w-4 h-4 text-indigo-600" />
                          內容規則
                        </h4>
                        <ul className="space-y-2">
                          {conversionResult.content_rules.map((rule: string, i: number) => (
                            <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5" />
                              {rule}
                            </li>
                          ))}
                        </ul>
                      </section>
                      <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                        <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-indigo-600" />
                          視覺規則
                        </h4>
                        <ul className="space-y-2">
                          {conversionResult.visual_rules.map((rule: string, i: number) => (
                            <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5" />
                              {rule}
                            </li>
                          ))}
                        </ul>
                      </section>
                    </div>

                    <section className="bg-slate-900 rounded-2xl p-6 shadow-xl">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                          <FileJson className="w-5 h-5" />
                          模板結構 (YAML / JSON)
                        </h4>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-[10px] font-bold hover:bg-slate-700 transition-all">
                            複製 YAML
                          </button>
                          <button className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-[10px] font-bold hover:bg-slate-700 transition-all">
                            複製 JSON
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <pre className="bg-slate-800/50 p-4 rounded-xl text-[10px] text-indigo-100 font-mono overflow-x-auto max-h-64">
                          {conversionResult.yaml_content}
                        </pre>
                        <pre className="bg-slate-800/50 p-4 rounded-xl text-[10px] text-emerald-100 font-mono overflow-x-auto max-h-64">
                          {JSON.stringify(conversionResult.json_content, null, 2)}
                        </pre>
                      </div>
                    </section>

                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                      <h4 className="text-sm font-bold text-slate-800 mb-3">輸出範例 (新主題填值)</h4>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-700 italic">
                        {conversionResult.output_example}
                      </div>
                    </section>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-white flex items-center justify-end gap-3">
                <button 
                  onClick={() => setShowConversionResult(false)}
                  className="px-8 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-all"
                >
                  完成並儲存至模板庫
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
