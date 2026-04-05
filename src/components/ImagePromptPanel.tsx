import React from 'react';
import { DesignTask } from '../types/design-task';
import { Copy, Check } from 'lucide-react';

interface ImagePromptPanelProps {
  tasks: DesignTask[];
}

export const ImagePromptPanel: React.FC<ImagePromptPanelProps> = ({ tasks }) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar pr-2">
      {tasks.map((task) => (
        <div key={task.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-md">
                Page {task.page_index + 1}
              </span>
              <span className="text-sm font-bold text-slate-700 capitalize">
                {task.page_type}
              </span>
            </div>
            {task.image_prompt && (
              <button
                onClick={() => handleCopy(task.id, task.image_prompt)}
                className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-colors"
                title="複製 Prompt"
              >
                {copiedId === task.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>
          
          <div className="mt-2">
            <h4 className="text-xs font-bold text-slate-500 mb-1">Slide Title:</h4>
            <p className="text-sm text-slate-800 mb-3">{task.text_fields.title || '(No title)'}</p>
            
            <h4 className="text-xs font-bold text-slate-500 mb-1">Image Prompt:</h4>
            {task.image_prompt ? (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm font-mono text-slate-700 whitespace-pre-wrap">
                {task.image_prompt}
              </div>
            ) : (
              <div className="text-sm text-slate-400 italic">
                No image prompt generated for this page based on current settings.
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
