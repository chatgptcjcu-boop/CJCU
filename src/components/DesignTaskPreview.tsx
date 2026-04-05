import React from 'react';
import { DesignTask } from '../types/design-task';
import { Image as ImageIcon, Target, BookOpen, CheckCircle, Presentation } from 'lucide-react';

interface DesignTaskPreviewProps {
  tasks: DesignTask[];
}

export const DesignTaskPreview: React.FC<DesignTaskPreviewProps> = ({ tasks }) => {
  
  const renderPageTypeIcon = (type: string) => {
    switch (type) {
      case 'cover': return <Presentation className="w-4 h-4" />;
      case 'objectives': return <Target className="w-4 h-4" />;
      case 'content': return <BookOpen className="w-4 h-4" />;
      case 'summary': return <CheckCircle className="w-4 h-4" />;
      default: return <Presentation className="w-4 h-4" />;
    }
  };

  const renderCover = (task: DesignTask) => (
    <div className="flex flex-col items-center justify-center text-center p-10 h-full gap-6">
      <div className="w-full flex justify-center mb-4">
        {task.text_fields.logo && task.text_fields.logo !== 'https://your-logo.png' ? (
          <img src={task.text_fields.logo} alt="logo" className="h-8 object-contain" />
        ) : (
          <div className="px-3 py-1 bg-slate-200 rounded text-xs font-bold text-slate-500">LOGO</div>
        )}
      </div>
      <div>
        <div className="text-sm text-slate-400 mb-2 font-medium tracking-widest uppercase">{task.text_fields.unit_name}</div>
        <h3 className="text-4xl md:text-5xl font-extrabold text-slate-800 leading-tight" style={{ color: task.style_fields.primary_color }}>
          {task.text_fields.title}
        </h3>
        {task.text_fields.subtitle && (
          <h4 className="text-xl text-slate-500 mt-4 font-medium">{task.text_fields.subtitle}</h4>
        )}
      </div>
      {task.image_prompt && (
        <div className="w-full max-w-md aspect-video mt-4 bg-slate-100 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-4">
          <ImageIcon className="w-10 h-10 mb-2 text-slate-300" />
          <span className="text-sm font-medium">主視覺 (Main Visual)</span>
          <span className="text-xs mt-2 line-clamp-2 text-slate-400 max-w-[80%]">{task.image_prompt}</span>
        </div>
      )}
    </div>
  );

  const renderObjectives = (task: DesignTask) => (
    <div className="flex flex-col md:flex-row gap-8 p-8 h-full items-center">
      <div className="flex-1 space-y-6">
        <div>
          <h3 className="text-3xl font-bold text-slate-800 flex items-center gap-3" style={{ color: task.style_fields.primary_color }}>
            <Target className="w-8 h-8" />
            {task.text_fields.title}
          </h3>
          {task.text_fields.subtitle && (
            <h4 className="text-lg text-slate-500 mt-2">{task.text_fields.subtitle}</h4>
          )}
        </div>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <ul className="space-y-4">
            {[task.text_fields.bullet_1, task.text_fields.bullet_2, task.text_fields.bullet_3, task.text_fields.bullet_4, task.text_fields.bullet_5]
              .filter(Boolean)
              .map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-3 text-lg text-slate-700 font-medium">
                  <span className="mt-1.5 w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: task.style_fields.primary_color }}>
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{bullet}</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
      {task.image_prompt && (
        <div className="w-full md:w-1/3 aspect-square bg-slate-100 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
          <ImageIcon className="w-8 h-8 mb-2 text-slate-300" />
          <span className="text-xs font-medium">概念插圖</span>
        </div>
      )}
    </div>
  );

  const renderContent = (task: DesignTask) => (
    <div className="flex flex-col md:flex-row gap-6 p-8 h-full">
      <div className="flex-1 space-y-4">
        <div>
          <div className="text-xs text-slate-400 mb-1 font-medium">{task.text_fields.unit_name}</div>
          <h3 className="text-2xl font-bold text-slate-800" style={{ color: task.style_fields.primary_color }}>
            {task.text_fields.title}
          </h3>
          {task.text_fields.subtitle && (
            <h4 className="text-md text-slate-500 mt-1">{task.text_fields.subtitle}</h4>
          )}
        </div>
        <ul className="space-y-3 mt-4">
          {[task.text_fields.bullet_1, task.text_fields.bullet_2, task.text_fields.bullet_3, task.text_fields.bullet_4, task.text_fields.bullet_5]
            .filter(Boolean)
            .map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-2 text-md text-slate-700">
                <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: task.style_fields.primary_color }} />
                <span className="leading-relaxed">{bullet}</span>
              </li>
            ))}
        </ul>
      </div>
      {task.image_prompt && (
        <div className="w-full md:w-2/5 aspect-[4/3] bg-slate-100 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
          <ImageIcon className="w-8 h-8 mb-2 text-slate-300" />
          <span className="text-xs font-medium">教學/資訊插圖</span>
          <span className="text-[10px] mt-2 line-clamp-3 text-slate-400">
            {task.image_prompt}
          </span>
        </div>
      )}
    </div>
  );

  const renderSummary = (task: DesignTask) => (
    <div className="flex flex-col p-8 h-full items-center text-center">
      <div className="mb-6">
        <h3 className="text-3xl font-bold text-slate-800" style={{ color: task.style_fields.primary_color }}>
          {task.text_fields.title}
        </h3>
        {task.text_fields.subtitle && (
          <h4 className="text-lg text-slate-500 mt-2">{task.text_fields.subtitle}</h4>
        )}
      </div>
      
      <div className="w-full max-w-2xl bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-6 text-left">
        <h5 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">重點回顧</h5>
        <ul className="space-y-3">
          {[task.text_fields.bullet_1, task.text_fields.bullet_2, task.text_fields.bullet_3, task.text_fields.bullet_4, task.text_fields.bullet_5]
            .filter(Boolean)
            .map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-3 text-md text-slate-700">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: task.style_fields.primary_color }} />
                <span className="leading-relaxed">{bullet}</span>
              </li>
            ))}
        </ul>
      </div>

      {task.image_prompt && (
        <div className="w-full max-w-md aspect-[21/9] bg-slate-100 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
          <ImageIcon className="w-6 h-6 mb-2 text-slate-300" />
          <span className="text-xs font-medium">收束/成果畫面</span>
        </div>
      )}
    </div>
  );

  const renderContentByPageType = (task: DesignTask) => {
    switch (task.page_type) {
      case 'cover': return renderCover(task);
      case 'objectives': return renderObjectives(task);
      case 'summary': return renderSummary(task);
      case 'content':
      default: return renderContent(task);
    }
  };

  return (
    <div className="space-y-8 max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar pr-2 pb-10">
      {tasks.map((task) => (
        <div key={task.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col min-h-[400px]">
          {/* Top Bar */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-md">
                Page {task.page_index + 1}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider bg-white px-3 py-1 rounded-md border border-slate-200 shadow-sm">
                {renderPageTypeIcon(task.page_type)}
                {task.page_type}
              </span>
            </div>
            <span className="text-xs font-medium text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
              {task.layout_fields.image_position} layout
            </span>
          </div>

          {/* Content Area */}
          <div className="flex-1 relative">
            {renderContentByPageType(task)}
          </div>

          {/* Footer Bar */}
          <div className="bg-slate-50 border-t border-slate-100 px-4 py-3 flex items-center justify-between text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-4">
              <span>{task.text_fields.logo && task.text_fields.logo !== 'https://your-logo.png' ? '✓ Logo' : '✗ Logo'}</span>
              {task.text_fields.footer_note && (
                <span className="max-w-[200px] truncate" title={task.text_fields.footer_note}>
                  Note: {task.text_fields.footer_note}
                </span>
              )}
            </div>
            <span>{task.text_fields.date} | P.{task.text_fields.page}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
