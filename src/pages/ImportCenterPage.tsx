import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../components/ui/Card';
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Layers, 
  Send, 
  CheckCircle2, 
  Loader2,
  AlertCircle,
  ArrowRight,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { ImportType, SourcePlatform, ImportGoal, ExtractionMode } from '../types/import';

export default function ImportCenterPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [importName, setImportName] = useState('');
  const [importType, setImportType] = useState<ImportType>('text');
  const [sourcePlatform, setSourcePlatform] = useState<SourcePlatform>('facebook');
  const [sourceDescription, setSourceDescription] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [importGoal, setImportGoal] = useState<ImportGoal>('文案模板');
  const [extractionMode, setExtractionMode] = useState<ExtractionMode>('抽取結構+風格');
  const [keepOriginal, setKeepOriginal] = useState(false);
  const [createReusable, setCreateReusable] = useState(true);

  const handleImportTypeChange = (type: ImportType) => {
    setImportType(type);
    if (type === 'image') {
      setImportGoal('圖卡模板');
      setSourcePlatform('instagram');
    } else if (type === 'text') {
      setImportGoal('文案模板');
      setSourcePlatform('facebook');
    } else if (type === 'mixed') {
      setImportGoal('簡報模板');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/imports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          import_name: importName,
          import_type: importType,
          source_platform: sourcePlatform,
          source_text: sourceText,
          source_image: sourceImage,
          import_goal: importGoal,
          extraction_mode: extractionMode,
          keep_original: keepOriginal,
          create_reusable: createReusable,
          imported_by: user?.id
        }),
      });

      if (response.ok) {
        setSuccess(true);
        // Reset form
        setImportName('');
        setSourceText('');
        setSourceImage(null);
      } else {
        const data = await response.json();
        setError(data.message || '匯入失敗');
      }
    } catch (err) {
      setError('連線錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-3xl shadow-xl text-center border border-slate-100"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">匯入成功！</h2>
          <p className="text-slate-500 mb-8 text-lg">
            您的素材已成功匯入系統。AI 正在進行結構化解析，管理員審核完成後即可在模板庫中使用。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setSuccess(false)}
              className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
            >
              繼續匯入
            </button>
            <button 
              onClick={() => window.location.href = '/history'}
              className="px-8 py-3 bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              查看匯入紀錄 <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">內容轉模板匯入中心</h1>
          <p className="text-slate-500 mt-1">將外部社群內容轉化為您的專屬 AI 模板資產</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
          <Info className="w-4 h-4" />
          <span>AI 自動抽取結構與風格</span>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card title="1. 素材內容" description="請提供您想要轉化為模板的原始內容">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['text', 'image', 'mixed'] as ImportType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleImportTypeChange(type)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                        importType === type 
                          ? "border-[#1877f2] bg-blue-50 text-[#1877f2]" 
                          : "border-slate-100 hover:border-slate-200 text-slate-500"
                      )}
                    >
                      {type === 'text' && <FileText className="w-6 h-6" />}
                      {type === 'image' && <ImageIcon className="w-6 h-6" />}
                      {type === 'mixed' && <Layers className="w-6 h-6" />}
                      <span className="font-bold text-sm">
                        {type === 'text' ? '純文字匯入' : type === 'image' ? '圖卡匯入' : '圖文混合匯入'}
                      </span>
                    </button>
                  ))}
                </div>

                {(importType === 'text' || importType === 'mixed') && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">文字內容貼上</label>
                    <textarea
                      value={sourceText}
                      onChange={(e) => setSourceText(e.target.value)}
                      placeholder="請貼上社群貼文、文案或網頁內容..."
                      className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1877f2] transition-all resize-none"
                      required={importType === 'text'}
                    />
                  </div>
                )}

                {(importType === 'image' || importType === 'mixed') && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">圖片/圖卡上傳</label>
                    <div className="relative group">
                      {sourceImage ? (
                        <div className="relative rounded-xl overflow-hidden border border-slate-200">
                          <img src={sourceImage} alt="Preview" className="w-full h-64 object-contain bg-slate-100" />
                          <button 
                            type="button"
                            onClick={() => setSourceImage(null)}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all"
                          >
                            <Loader2 className="w-4 h-4 rotate-45" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-200 rounded-xl hover:bg-slate-50 hover:border-[#1877f2] transition-all cursor-pointer">
                          <Upload className="w-10 h-10 text-slate-400 mb-2" />
                          <span className="text-sm font-bold text-slate-500">點擊或拖曳圖片至此</span>
                          <span className="text-xs text-slate-400 mt-1">支援 JPG, PNG, WebP</span>
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" required={importType === 'image'} />
                        </label>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card title="2. 匯入設定" description="設定 AI 如何處理您的素材">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">匯入名稱</label>
                  <input
                    type="text"
                    value={importName}
                    onChange={(e) => setImportName(e.target.value)}
                    placeholder="例如：FB 爆款文案結構"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">來源平台</label>
                  <select
                    value={sourcePlatform}
                    onChange={(e) => setSourcePlatform(e.target.value as SourcePlatform)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                  >
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="web">Web 網頁</option>
                    <option value="other">其他</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">匯入目的</label>
                  <select
                    value={importGoal}
                    onChange={(e) => setImportGoal(e.target.value as ImportGoal)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                  >
                    <option value="文案模板">文案模板</option>
                    <option value="圖卡模板">圖卡模板</option>
                    <option value="簡報模板">簡報模板</option>
                    <option value="風格分析">風格分析</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">抽取模式</label>
                  <select
                    value={extractionMode}
                    onChange={(e) => setExtractionMode(e.target.value as ExtractionMode)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1877f2]"
                  >
                    <option value="僅抽取結構">僅抽取結構</option>
                    <option value="抽取風格">抽取風格</option>
                    <option value="抽取結構+風格">抽取結構+風格</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={cn(
                    "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all",
                    keepOriginal ? "bg-[#1877f2] border-[#1877f2]" : "border-slate-200 group-hover:border-slate-300"
                  )} onClick={() => setKeepOriginal(!keepOriginal)}>
                    {keepOriginal && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  <span className="text-sm font-medium text-slate-700">保留原文內容作為參考（預設否）</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={cn(
                    "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all",
                    createReusable ? "bg-[#1877f2] border-[#1877f2]" : "border-slate-200 group-hover:border-slate-300"
                  )} onClick={() => setCreateReusable(!createReusable)}>
                    {createReusable && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  <span className="text-sm font-medium text-slate-700">自動建立可重用模板草稿（預設是）</span>
                </label>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="匯入說明" className="bg-blue-50 border-none">
              <div className="space-y-4 text-sm text-blue-800 leading-relaxed">
                <p>
                  <strong>💡 如何運作？</strong><br />
                  AI 會分析您提供的素材，並將其「抽象化」為結構化的模板。
                </p>
                <p>
                  <strong>🛡️ 版權保護</strong><br />
                  系統預設不會直接保存原文，而是抽取其背後的邏輯與版型，確保生成的內容具有原創性。
                </p>
                <p>
                  <strong>✅ 審核流程</strong><br />
                  匯入後，管理員會審核 AI 抽取的結果，確認無誤後即可正式發布為系統模板。
                </p>
              </div>
            </Card>

            <div className="sticky top-24">
              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#1877f2] hover:bg-[#166fe5] text-white text-lg font-bold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    正在解析素材...
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6" />
                    開始匯入並解析
                  </>
                )}
              </button>
              <p className="text-center text-xs text-slate-400 mt-4">
                點擊送出即代表您同意系統使用 AI 進行內容分析
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
