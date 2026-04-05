import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SlideRenderer } from '../components/SlideRenderer';
import { Download, Table, LayoutTemplate } from 'lucide-react';
import yaml from 'js-yaml';
import { mapYamlToSheets } from '../services/sheets-mapper.service';

export default function LayoutPreviewPage() {
  const navigate = useNavigate();
  const [parsedData, setParsedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tasks?userId=user_1')
      .then(res => res.json())
      .then(tasks => {
        const exampleTask = tasks.find((t: any) => t.id === 'task_temple_ops_1');
        if (exampleTask) {
          try {
            setParsedData(yaml.load(exampleTask.result));
          } catch (e) {
            console.error(e);
          }
        }
        setLoading(false);
      });
  }, []);

  const downloadCsv = () => {
    if (!parsedData) return;
    const rows = mapYamlToSheets(parsedData);
    if (rows.length === 0) return;
    
    const headers = Object.keys(rows[0]).join(',');
    const csvContent = [
      headers,
      ...rows.map(row => Object.values(row).map(val => `"${String(val || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'presentation_data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">載入預覽中...</div>;
  }

  if (!parsedData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center max-w-3xl mx-auto mt-12">
        <LayoutTemplate className="w-16 h-16 text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-700 mb-2">尚未有可預覽的教材</h3>
        <p className="text-slate-500 mb-6">請先建立教材並完成編修後，再進行版型預覽。</p>
        <button 
          onClick={() => navigate('/create')}
          className="px-6 py-3 bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold rounded-xl shadow-md transition-all"
        >
          前往建立教材
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">版型預覽</h1>
          <p className="text-slate-500 mt-1">檢視投影片視覺效果與匯出 Canva 欄位資料</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={downloadCsv}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Table className="w-4 h-4" />
            匯出 CSV (Sheets)
          </button>
        </div>
      </header>

      <div className="bg-slate-50 p-4 md:p-8 rounded-3xl border border-slate-200">
        <SlideRenderer data={parsedData} loading={false} />
      </div>
    </div>
  );
}
