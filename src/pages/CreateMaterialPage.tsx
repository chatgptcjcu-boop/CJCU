import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, FileText, Image as ImageIcon, Presentation, BookOpen, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { generateYaml, YamlGeneratorParams } from '../services/yaml-generator.service';

const contentTypes = [
  { id: 'presentation', title: '教學簡報', icon: Presentation, desc: '標準化投影片結構' },
  { id: 'handout', title: '學員講義', icon: BookOpen, desc: '詳細文字說明與練習' },
  { id: 'social', title: '社群貼文', icon: ImageIcon, desc: '圖文並茂的短篇內容' },
  { id: 'script', title: '短影音腳本', icon: FileText, desc: '分鏡與口白設計' },
];

const templates = [
  { id: 'sys_1', title: '系統預設 - 專業藍', type: 'system' },
  { id: 'sys_2', title: '系統預設 - 活潑橘', type: 'system' },
  { id: 'dept_1', title: '資管系 - 專題報告', type: 'department' },
  { id: 'personal_1', title: '我的最愛 - 極簡風', type: 'personal' },
];

const stepsList = [
  { num: 1, label: '內容類型' },
  { num: 2, label: '選擇模板' },
  { num: 3, label: '基本設定' },
  { num: 4, label: '確認生成' }
];

export default function CreateMaterialPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<YamlGeneratorParams>({
    course_name: '',
    unit_name: '',
    provider: '',
    logo_url: '',
    date: new Date().toISOString().split('T')[0],
    topic: '',
    audience: '初學者',
    level: '入門',
    tone: '專業且易懂',
    slide_count: 8,
    primary_color: '#1877f2',
    secondary_color: '#42b72a',
    background_style: '淺色底',
    font_title: 'Noto Sans TC Bold',
    font_body: 'Noto Sans TC Regular',
    add_pinyin: false,
    add_scenario: true,
    add_cta: true
  });

  const [selectedType, setSelectedType] = useState('presentation');
  const [selectedTemplate, setSelectedTemplate] = useState('sys_1');

  const handleNext = () => setStep(s => Math.min(4, s + 1));
  const handlePrev = () => setStep(s => Math.max(1, s - 1));

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Mock generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      // In a real app, we would save this to the backend and get an ID
      navigate('/edit');
    } catch (error) {
      console.error(error);
      alert('生成失敗，請重試');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">建立教材</h1>
        <p className="text-slate-500">選擇內容類型與模板，系統將協助生成教材初稿</p>
      </header>

      {/* Progress Bar */}
      <div className="relative px-2 sm:px-6 mb-12">
        <div className="absolute left-6 right-6 sm:left-10 sm:right-10 top-4 -translate-y-1/2 h-1 bg-slate-100 rounded-full -z-10"></div>
        <div 
          className="absolute left-6 sm:left-10 top-4 -translate-y-1/2 h-1 bg-[#1877f2] rounded-full -z-10 transition-all duration-500"
          style={{ width: `calc(${((step - 1) / 3) * 100}% - ${((step - 1) / 3) * 2}rem)` }}
        ></div>
        
        <div className="flex items-center justify-between">
          {stepsList.map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-2 relative z-10">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                  step >= s.num ? "bg-[#1877f2] text-white shadow-md shadow-blue-200" : "bg-white text-slate-400 border-2 border-slate-200"
                )}
              >
                {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
              </div>
              <span className={cn(
                "text-[10px] sm:text-xs font-bold transition-colors duration-300 absolute top-10 whitespace-nowrap",
                step >= s.num ? "text-[#1877f2]" : "text-slate-400"
              )}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 min-h-[400px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-slate-800">Step 1. 選擇內容類型</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contentTypes.map(type => (
                  <div
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={cn(
                      "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4",
                      selectedType === type.id 
                        ? "border-[#1877f2] bg-blue-50" 
                        : "border-slate-100 hover:border-blue-200 hover:bg-slate-50"
                    )}
                  >
                    <div className={cn(
                      "p-3 rounded-lg",
                      selectedType === type.id ? "bg-[#1877f2] text-white" : "bg-slate-100 text-slate-500"
                    )}>
                      <type.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{type.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{type.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-slate-800">Step 2. 選擇模板</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {templates.map(tpl => (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl.id)}
                    className={cn(
                      "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4",
                      selectedTemplate === tpl.id 
                        ? "border-[#1877f2] bg-blue-50" 
                        : "border-slate-100 hover:border-blue-200 hover:bg-slate-50"
                    )}
                  >
                    <div className="w-16 h-12 bg-slate-200 rounded flex items-center justify-center text-slate-400 text-xs">
                      預覽圖
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{tpl.title}</h3>
                      <span className="text-[10px] px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full mt-1 inline-block">
                        {tpl.type === 'system' ? '系統模板' : tpl.type === 'department' ? '系所模板' : '個人模板'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-slate-800">Step 3. 基本設定</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">教材主題</label>
                  <input 
                    type="text" 
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    placeholder="例如：人工智慧的基本概念與應用"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1877f2] outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">目標受眾</label>
                    <input 
                      type="text" 
                      name="audience"
                      value={formData.audience}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1877f2] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">預計頁數</label>
                    <input 
                      type="number" 
                      name="slide_count"
                      value={formData.slide_count}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1877f2] outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">語氣風格</label>
                  <input 
                    type="text" 
                    name="tone"
                    value={formData.tone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1877f2] outline-none transition-all"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 flex flex-col items-center justify-center text-center py-8"
            >
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-10 h-10 text-[#1877f2]" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">準備生成初稿</h2>
              <p className="text-slate-500 max-w-md">
                系統將根據您的設定：「{formData.topic || '未命名主題'}」，使用「{templates.find(t => t.id === selectedTemplate)?.title}」模板，生成約 {formData.slide_count} 頁的教材初稿。
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={handlePrev}
          disabled={step === 1 || loading}
          className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-all disabled:opacity-0 flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" /> 上一步
        </button>
        
        {step < 4 ? (
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            下一步 <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-8 py-3 bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {loading ? '生成中...' : '開始生成'}
          </button>
        )}
      </div>
    </div>
  );
}
