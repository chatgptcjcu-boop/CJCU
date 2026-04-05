import React from 'react';
import { CanvaWorkspaceConfig } from '../types/design-task';

interface CanvaFieldMapEditorProps {
  config: CanvaWorkspaceConfig;
  onChange: (config: CanvaWorkspaceConfig) => void;
}

export const CanvaFieldMapEditor: React.FC<CanvaFieldMapEditorProps> = ({ config, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
                type === 'number' ? parseInt(value) : value;
    onChange({ ...config, [name]: val });
  };

  return (
    <div className="space-y-6">
      {/* Canva 模板設定 */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 border-b pb-2">Canva 模板設定</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">模板名稱 (Template Name)</label>
            <input type="text" name="template_name" value={config.template_name} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1877f2] outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">模板類型</label>
              <select name="template_type" value={config.template_type} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1877f2] outline-none">
                <option value="presentation">Presentation (16:9)</option>
                <option value="carousel">Carousel (4:5)</option>
                <option value="poster">Poster (A4)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">品牌風格</label>
              <select name="brand_style" value={config.brand_style} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1877f2] outline-none">
                <option value="科技">科技 (Tech)</option>
                <option value="教學">教學 (Education)</option>
                <option value="溫暖">溫暖 (Warm)</option>
                <option value="專業">專業 (Professional)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 版面配置設定 */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 border-b pb-2">版面配置設定</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Logo 位置</label>
            <select name="logo_position" value={config.logo_position} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1877f2] outline-none">
              <option value="top-left">Top Left</option>
              <option value="top-right">Top Right</option>
              <option value="footer">Footer</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">頁碼位置</label>
            <select name="page_number_position" value={config.page_number_position} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1877f2] outline-none">
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="top-right">Top Right</option>
            </select>
          </div>
        </div>
      </div>

      {/* 視覺與插圖設定 */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 border-b pb-2">視覺與插圖設定</h3>
        
        <label className="flex items-center gap-2 cursor-pointer mb-3">
          <input type="checkbox" name="enable_auto_illustration" checked={config.enable_auto_illustration} onChange={handleChange} className="w-4 h-4 text-[#1877f2] rounded focus:ring-[#1877f2]" />
          <span className="text-sm font-bold text-slate-700">啟用自動插圖生成 (Image Prompts)</span>
        </label>

        {config.enable_auto_illustration && (
          <div className="space-y-3 pl-6 border-l-2 border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">插圖風格</label>
              <select name="illustration_style" value={config.illustration_style} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1877f2] outline-none">
                <option value="教育漫畫">教育漫畫 (Educational Comic)</option>
                <option value="科技扁平">科技扁平 (Tech Flat Design)</option>
                <option value="商務簡潔">商務簡潔 (Business Minimalist)</option>
                <option value="溫暖插畫">溫暖插畫 (Warm Illustration)</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">圖片位置</label>
                <select name="image_position" value={config.image_position} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1877f2] outline-none">
                  <option value="right">Right Side</option>
                  <option value="left">Left Side</option>
                  <option value="top">Top</option>
                  <option value="center">Center</option>
                  <option value="background">Background</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">圖片比例</label>
                <select name="image_ratio" value={config.image_ratio} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1877f2] outline-none">
                  <option value="square">Square (1:1)</option>
                  <option value="portrait">Portrait (3:4)</option>
                  <option value="landscape">Landscape (16:9)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="image_on_every_page" checked={config.image_on_every_page} onChange={handleChange} className="w-4 h-4 text-[#1877f2] rounded focus:ring-[#1877f2]" />
                <span className="text-xs text-slate-600">每頁都要產生圖片</span>
              </label>
              {!config.image_on_every_page && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="image_only_on_content" checked={config.image_only_on_content} onChange={handleChange} className="w-4 h-4 text-[#1877f2] rounded focus:ring-[#1877f2]" />
                  <span className="text-xs text-slate-600">只在內容頁加圖</span>
                </label>
              )}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="cover_independent_visual" checked={config.cover_independent_visual} onChange={handleChange} className="w-4 h-4 text-[#1877f2] rounded focus:ring-[#1877f2]" />
                <span className="text-xs text-slate-600">封面獨立生成主視覺</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
