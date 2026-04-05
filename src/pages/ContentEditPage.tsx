import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Save, Eye, LayoutTemplate, FileCode2, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import yaml from 'js-yaml';
import { validateYamlStandard } from '../services/yaml-validator.service';

export default function ContentEditPage() {
  const navigate = useNavigate();
  const [showYaml, setShowYaml] = useState(false);
  const [yamlContent, setYamlContent] = useState('');
  const [parsedData, setParsedData] = useState<any>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Load mock data on mount
  useEffect(() => {
    fetch('/api/tasks?userId=user_1')
      .then(res => res.json())
      .then(tasks => {
        const exampleTask = tasks.find((t: any) => t.id === 'task_temple_ops_1');
        if (exampleTask) {
          setYamlContent(exampleTask.result);
          try {
            setParsedData(yaml.load(exampleTask.result));
          } catch (e) {
            console.error(e);
          }
        }
      });
  }, []);

  const handleYamlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newYaml = e.target.value;
    setYamlContent(newYaml);
    try {
      const parsed = yaml.load(newYaml);
      setParsedData(parsed);
    } catch (e) {
      // Handle parse error silently while typing
    }
  };

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  if (!parsedData) {
    return <div className="p-8 text-center text-slate-500">載入教材中...</div>;
  }

  const slides = parsedData.slides || [];
  const currentSlide = slides[activeSlideIndex];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">內容編修</h1>
          <p className="text-slate-500 mt-1">{parsedData.global?.course_name} - {parsedData.global?.unit_name}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            {saveStatus === 'saving' ? <Loader2 className="w-4 h-4 animate-spin" /> : 
             saveStatus === 'saved' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : 
             <Save className="w-4 h-4" />}
            儲存草稿
          </button>
          <button 
            onClick={() => navigate('/preview')}
            className="px-4 py-2 bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            版型預覽
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Slide Navigation */}
        <div className="lg:col-span-3 space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
          {slides.map((slide: any, idx: number) => (
            <div
              key={slide.slide_id || idx}
              onClick={() => setActiveSlideIndex(idx)}
              className={cn(
                "p-4 rounded-xl border-2 cursor-pointer transition-all",
                activeSlideIndex === idx 
                  ? "border-[#1877f2] bg-blue-50" 
                  : "border-slate-100 bg-white hover:border-blue-200"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400">Slide {slide.page_number}</span>
                <span className="text-[10px] px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full uppercase">
                  {slide.page_type}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 text-sm line-clamp-2">{slide.body?.title || '未命名頁面'}</h3>
            </div>
          ))}
        </div>

        {/* Slide Editor Form */}
        <div className="lg:col-span-9 space-y-6">
          {currentSlide && (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-800">編輯第 {currentSlide.page_number} 頁</h2>
                <span className="text-sm font-bold text-slate-400">{currentSlide.slide_id}</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">主標題 (Title)</label>
                  <input 
                    type="text" 
                    value={currentSlide.body?.title || ''}
                    readOnly
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">副標題 (Subtitle)</label>
                  <input 
                    type="text" 
                    value={currentSlide.body?.subtitle || ''}
                    readOnly
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">重點項目 (Bullet Points)</label>
                  <div className="space-y-2">
                    {(currentSlide.body?.bullet_points || []).map((bp: string, i: number) => (
                      <input 
                        key={i}
                        type="text" 
                        value={bp}
                        readOnly
                        placeholder={`重點 ${i + 1}`}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none"
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">視覺提示 (Visual Hint)</label>
                    <input 
                      type="text" 
                      value={currentSlide.body?.visual_hint || ''}
                      readOnly
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">圖像提示詞 (Image Prompt)</label>
                    <input 
                      type="text" 
                      value={currentSlide.body?.image_prompt || ''}
                      readOnly
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">講者備註 (Speaker Note)</label>
                  <textarea 
                    value={currentSlide.body?.speaker_note || ''}
                    readOnly
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none resize-none"
                  />
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
                <LayoutTemplate className="w-5 h-5 text-[#1877f2] shrink-0 mt-0.5" />
                <p className="text-sm text-slate-600">
                  此為表單預覽模式。若需修改內容，請展開下方的 YAML 編輯器進行進階編修。
                </p>
              </div>
            </div>
          )}

          {/* Collapsible YAML Editor */}
          <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div 
              className="flex items-center justify-between p-4 bg-slate-900 cursor-pointer select-none"
              onClick={() => setShowYaml(!showYaml)}
            >
              <div className="flex items-center gap-2 text-slate-300">
                <FileCode2 className="w-5 h-5" />
                <span className="font-bold text-sm">進階 YAML 編輯器</span>
              </div>
              {showYaml ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </div>
            
            <AnimatePresence>
              {showYaml && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-slate-800">
                    <textarea
                      value={yamlContent}
                      onChange={handleYamlChange}
                      className="w-full h-96 bg-slate-900 text-slate-300 font-mono text-sm p-4 rounded-xl border border-slate-700 focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] outline-none resize-y custom-scrollbar"
                      spellCheck={false}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
