import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../../components/ui/Card';
import { 
  Wand2, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  FileJson, 
  Code,
  Clock,
  User,
  Layout,
  FileText,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ReusableTemplate } from '../../types/import';

export default function TemplateReview() {
  const [templates, setTemplates] = useState<ReusableTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<ReusableTemplate | null>(null);
  const [filter, setFilter] = useState<'all' | 'social_post' | 'graphic_card' | 'slide' | 'educational'>('all');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/templates-review');
      const data = await response.json();
      setTemplates(data);
    } catch (err) {
      console.error('Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(tpl => {
    if (filter === 'all') return true;
    return tpl.template_type === filter;
  });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">模板轉換審核</h1>
        <p className="text-slate-500 mt-1">審核由 AI 從素材中抽象化生成的 YAML/JSON 模板</p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg w-full md:w-96">
          <Search className="w-5 h-5 text-slate-400" />
          <input type="text" placeholder="搜尋模板名稱或目標..." className="bg-transparent border-none focus:outline-none text-sm w-full" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {(['all', 'social_post', 'graphic_card', 'slide', 'educational'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-1.5 rounded-md text-[10px] font-bold transition-all uppercase tracking-wider",
                  filter === f ? "bg-white text-[#1877f2] shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {f === 'all' ? '全部' : f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-2xl" />)
        ) : filteredTemplates.length > 0 ? (
          filteredTemplates.map((tpl) => (
            <motion.div
              key={tpl.id}
              layoutId={tpl.id}
              onClick={() => setSelectedTemplate(tpl)}
              className="cursor-pointer group"
            >
              <Card className="hover:shadow-md transition-all border-slate-100 group-hover:border-indigo-600">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Wand2 className="w-5 h-5" />
                  </div>
                  <div className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">
                    {tpl.template_type.replace('_', ' ')}
                  </div>
                </div>
                <h3 className="font-bold text-slate-800 mb-1 truncate">{tpl.template_name}</h3>
                <p className="text-xs text-slate-500 mb-4 line-clamp-2">{tpl.template_goal}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-50 pt-4">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{tpl.created_by}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(tpl.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400">目前沒有待審核的模板</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTemplate(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              layoutId={selectedTemplate.id}
              className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-50/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 text-white rounded-lg">
                    <Wand2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{selectedTemplate.template_name}</h2>
                    <p className="text-xs text-indigo-600 font-bold uppercase">模板轉換審核中</p>
                  </div>
                </div>
                <button onClick={() => setSelectedTemplate(null)} className="p-2 hover:bg-white rounded-full transition-all">
                  <XCircle className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="space-y-6">
                    <section>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">基本資訊</h4>
                      <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase">模板目標</p>
                          <p className="text-sm text-slate-700">{selectedTemplate.template_goal}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase">必要欄位</p>
                          <div className="flex flex-wrap gap-1">
                            {selectedTemplate.required_fields.map((f, i) => (
                              <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold">
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-2">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>安全改寫說明</span>
                      </div>
                      <p className="text-xs text-emerald-600 leading-relaxed">
                        {selectedTemplate.safe_rewrite_note}
                      </p>
                    </section>
                  </div>

                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <section className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                          <Code className="w-4 h-4 text-indigo-600" />
                          內容規則
                        </h4>
                        <ul className="space-y-2">
                          {selectedTemplate.content_rules.map((rule, i) => (
                            <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5" />
                              {rule}
                            </li>
                          ))}
                        </ul>
                      </section>
                      <section className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                          <Layout className="w-4 h-4 text-indigo-600" />
                          視覺規則
                        </h4>
                        <ul className="space-y-2">
                          {selectedTemplate.visual_rules.map((rule, i) => (
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
                          YAML 結構
                        </h4>
                      </div>
                      <pre className="bg-slate-800/50 p-4 rounded-xl text-[10px] text-indigo-100 font-mono overflow-x-auto max-h-64">
                        {selectedTemplate.yaml_content}
                      </pre>
                    </section>

                    <section className="bg-white p-6 rounded-2xl border border-slate-100">
                      <h4 className="text-sm font-bold text-slate-800 mb-3">輸出範例</h4>
                      <div className="p-4 bg-slate-50 rounded-xl text-sm text-slate-700 italic">
                        {selectedTemplate.output_example}
                      </div>
                    </section>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  生成時間：{new Date(selectedTemplate.created_at).toLocaleString()}
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setSelectedTemplate(null)}
                    className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-all"
                  >
                    取消
                  </button>
                  <button 
                    className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    核准並發布至模板庫
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
