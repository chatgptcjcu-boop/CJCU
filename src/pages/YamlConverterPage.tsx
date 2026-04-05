import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../components/ui/Card';
import { 
  FileCode, 
  Send, 
  Copy, 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  RefreshCw,
  Info,
  Type,
  Terminal,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export default function YamlConverterPage() {
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ yaml: string; instructions: string } | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/convert/yaml', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, userId: user?.id }),
      });

      const data = await response.json();
      if (data.success) {
        setResult({
          yaml: data.yaml,
          instructions: data.instructions
        });
      } else {
        setError(data.message || '轉換失敗');
      }
    } catch (err) {
      setError('連線錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">社群貼文 → YAML 模板轉換器</h1>
        <p className="text-slate-500 mt-1">將社群內容抽象化為可重用的結構化 YAML 模板</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <Card title="原始內容輸入" description="請貼上您想要轉換的社群貼文內容">
            <form onSubmit={handleConvert} className="space-y-4">
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="在此貼上 Facebook、IG 或廣告文案內容..."
                  className="w-full h-80 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1877f2] transition-all resize-none text-sm leading-relaxed"
                  required
                />
                <div className="absolute bottom-4 right-4 text-xs text-slate-400">
                  {inputText.length} 字
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={loading || !inputText.trim()}
                  className="flex-1 py-4 bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      正在分析並轉換...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5" />
                      立即轉換為 YAML
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setInputText('')}
                  className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all"
                >
                  清空
                </button>
              </div>
            </form>
          </Card>

          <Card className="bg-blue-50 border-none">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0" />
              <div className="text-sm text-blue-800 space-y-2">
                <p className="font-bold">轉換原則：</p>
                <ul className="list-disc list-inside space-y-1 opacity-80">
                  <li>自動抽取內容結構與語氣</li>
                  <li>將具體內容替換為變數欄位</li>
                  <li>移除品牌名稱與特定名詞</li>
                  <li>檢查並標記潛在版權風險</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {!result && !loading && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200"
              >
                <FileCode className="w-16 h-16 text-slate-200 mb-4" />
                <h3 className="text-lg font-bold text-slate-400">等待輸入內容</h3>
                <p className="text-sm text-slate-400 mt-2">請在左側貼上內容後點擊轉換按鈕</p>
              </motion.div>
            )}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-slate-100 shadow-sm"
              >
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
                  <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
                  <Terminal className="absolute inset-0 m-auto w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">AI 正在解析結構...</h3>
                <p className="text-sm text-slate-500 mt-2">我們正在將內容抽象化並生成 YAML 模板</p>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-red-50 border border-red-100 rounded-2xl text-red-600 flex items-start gap-4"
              >
                <AlertCircle className="w-6 h-6 shrink-0" />
                <div>
                  <h4 className="font-bold">轉換發生錯誤</h4>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </motion.div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="p-0 overflow-hidden border-slate-200 shadow-xl">
                  <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="ml-4 text-xs font-mono text-slate-400">template.yaml</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(result.yaml)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-all"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      {copied ? '已複製' : '複製 YAML'}
                    </button>
                  </div>
                  <pre className="p-6 bg-slate-950 text-indigo-100 font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed">
                    {result.yaml}
                  </pre>
                </Card>

                <Card title="模板使用說明" className="border-indigo-100 bg-indigo-50/30">
                  <div className="flex gap-4">
                    <BookOpen className="w-6 h-6 text-indigo-600 shrink-0" />
                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {result.instructions}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
