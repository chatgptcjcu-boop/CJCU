import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, LayoutTemplate } from 'lucide-react';
import { YamlStandardDocument } from '../types/yaml-standard';

interface SlideRendererProps {
  data: YamlStandardDocument | null;
  loading?: boolean;
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({ data, loading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [data]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">投影片預覽</h3>
        </div>
        <div className="w-full aspect-video rounded-xl shadow-md overflow-hidden flex flex-col border border-slate-200 bg-white animate-pulse">
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <div className="w-24 h-6 bg-slate-200 rounded"></div>
            <div className="w-32 h-6 bg-slate-200 rounded"></div>
            <div className="w-20 h-6 bg-slate-200 rounded"></div>
          </div>
          <div className="flex-1 p-10 flex flex-col justify-center">
            <div className="w-3/4 h-10 bg-slate-200 rounded mb-4"></div>
            <div className="w-1/2 h-6 bg-slate-200 rounded mb-8"></div>
            <div className="space-y-5">
              <div className="w-full h-4 bg-slate-200 rounded"></div>
              <div className="w-5/6 h-4 bg-slate-200 rounded"></div>
              <div className="w-4/6 h-4 bg-slate-200 rounded"></div>
            </div>
          </div>
          <div className="p-3 border-t border-slate-100 flex justify-center">
            <div className="w-1/3 h-4 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.slides || data.slides.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">投影片預覽</h3>
        </div>
        <div className="w-full aspect-video rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
          <LayoutTemplate className="w-12 h-12 mb-4 text-slate-300" />
          <p>尚無投影片資料</p>
        </div>
      </div>
    );
  }

  const slide = data.slides[currentIndex];
  const globalConfig = data.global;

  const resolveVar = (val: string | undefined, fallback: string = '') => {
    if (!val) return fallback;
    let resolved = val;
    if (resolved.includes('{global.provider_logo_url}')) resolved = resolved.replace('{global.provider_logo_url}', globalConfig?.provider_logo_url || '');
    if (resolved.includes('{global.unit_name}')) resolved = resolved.replace('{global.unit_name}', globalConfig?.unit_name || '');
    if (resolved.includes('{global.course_date}')) resolved = resolved.replace('{global.course_date}', globalConfig?.course_date || '');
    if (resolved.includes('{global.background_style}')) resolved = resolved.replace('{global.background_style}', globalConfig?.background_style || '');
    if (resolved.includes('{global.primary_color}')) resolved = resolved.replace('{global.primary_color}', globalConfig?.primary_color || '');
    if (resolved.includes('{global.font_title}')) resolved = resolved.replace('{global.font_title}', globalConfig?.font_title || '');
    return resolved;
  };

  const primaryColor = resolveVar(slide.style?.primary_color, globalConfig?.primary_color) || '#1877f2';
  const bgColor = resolveVar(slide.style?.background_style, globalConfig?.background_style) || '#ffffff';
  const fontTitle = resolveVar(slide.style?.font_title, globalConfig?.font_title) || 'sans-serif';

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(data.slides.length - 1, prev + 1));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">投影片預覽</h3>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {currentIndex + 1} / {data.slides.length}
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrev} 
              disabled={currentIndex === 0}
              className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={handleNext} 
              disabled={currentIndex === data.slides.length - 1}
              className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div 
        className="w-full aspect-video rounded-xl shadow-md overflow-hidden flex flex-col border border-slate-200 relative transition-all duration-300"
        style={{ 
          background: bgColor.includes('漸層') ? `linear-gradient(135deg, #ffffff 0%, ${primaryColor}15 100%)` : bgColor,
          fontFamily: fontTitle
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-2 sm:p-4 border-b border-slate-100/50 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 sm:gap-3 w-1/3">
            {resolveVar(slide.header?.logo_url, globalConfig?.provider_logo_url) && resolveVar(slide.header?.logo_url, globalConfig?.provider_logo_url) !== 'https://your-logo.png' ? (
              <img src={resolveVar(slide.header?.logo_url, globalConfig?.provider_logo_url)} alt="logo" className="h-4 sm:h-6 object-contain" />
            ) : (
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-slate-200 rounded-full flex items-center justify-center text-[8px] sm:text-[10px] font-bold text-slate-500">L</div>
            )}
          </div>
          <div className="w-1/3 text-center">
             <span className="text-xs sm:text-sm font-bold text-slate-600 truncate block">{resolveVar(slide.header?.unit_name, globalConfig?.unit_name)}</span>
          </div>
          <div className="flex items-center justify-end gap-2 sm:gap-4 text-[10px] sm:text-xs text-slate-400 font-medium w-1/3">
            <span className="hidden sm:inline">{resolveVar(slide.header?.course_date, globalConfig?.course_date)}</span>
            <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-slate-100 rounded-md">{resolveVar(slide.header?.page_label, String(slide.page_number))}</span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 p-4 sm:p-6 md:p-10 flex flex-col justify-center overflow-y-auto custom-scrollbar">
          <h2 
            className="text-xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4"
            style={{ color: primaryColor }}
          >
            {slide.body?.title}
          </h2>
          {slide.body?.subtitle && (
            <h3 className="text-sm sm:text-lg md:text-xl text-slate-500 mb-4 sm:mb-8 font-medium">
              {slide.body?.subtitle}
            </h3>
          )}
          
          <ul className="space-y-2 sm:space-y-4 md:space-y-5 mt-2 sm:mt-4">
            {slide.body?.bullet_points?.filter((item: string) => item.trim() !== '').map((item: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 sm:gap-4 text-slate-700 text-sm sm:text-lg md:text-xl">
                <span className="mt-1.5 sm:mt-2 w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full shrink-0" style={{ backgroundColor: primaryColor }} />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>

          {slide.body?.visual_hint && (
            <div className="mt-4 sm:mt-8 md:mt-10 p-2 sm:p-4 bg-slate-50 border border-slate-100 rounded-xl border-dashed flex items-center justify-center text-xs sm:text-sm text-slate-400">
              💡 視覺建議：{slide.body?.visual_hint}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2 sm:p-3 bg-slate-50/80 border-t border-slate-100/50 text-[10px] sm:text-xs text-slate-400 text-center truncate">
          {slide.footer?.footer_note}
        </div>
      </div>
    </div>
  );
};
