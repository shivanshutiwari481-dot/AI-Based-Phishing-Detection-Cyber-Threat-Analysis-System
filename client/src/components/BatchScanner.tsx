import React, { useState } from 'react';
import { scanBatchIocs } from '../services/iocScanner';
import { IocBatchResult } from '../types/threat';
import { Activity, Download, Search } from 'lucide-react';

const SAMPLE_BATCH = `paypal-update-login-security.top
185.220.101.4
a1b2c3d4e5f67890123456789abcdef0
http://185.220.101.4/office365/login.php
https://github.com/shivanshutiwari481-dot`;

export const BatchScanner: React.FC = () => {
  const [inputText, setInputText] = useState(SAMPLE_BATCH);
  const [results, setResults] = useState<IocBatchResult[]>([]);

  const handleBatchScan = () => {
    const res = scanBatchIocs(inputText);
    setResults(res);
  };

  const handleExportCsv = () => {
    if (results.length === 0) return;
    const headers = 'IOC,Type,Risk Score,Severity,Category,Source\n';
    const rows = results.map(r => `"${r.ioc}","${r.type}",${r.score},"${r.severity}","${r.category}","${r.source}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IOC_Batch_Threat_Report_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="glass-panel-glow rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-3">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            BATCH IOC THREAT SCANNER
          </h2>
        </div>

        <textarea
          rows={5}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full p-3 bg-slate-900/90 border border-slate-700 rounded-lg text-cyan-200 outline-none resize-none"
        />

        <div className="flex items-center space-x-3 mt-4">
          <button onClick={handleBatchScan} className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold rounded-lg flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <span>RUN BATCH ANALYSIS</span>
          </button>
          {results.length > 0 && (
            <button onClick={handleExportCsv} className="px-4 py-2.5 bg-slate-800 text-cyan-300 rounded-lg border border-slate-700 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>EXPORT CSV AUDIT</span>
            </button>
          )}
        </div>
      </div>

      {results.length > 0 && (
        <div className="glass-panel rounded-xl p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="p-3">INDICATOR</th>
                <th className="p-3">TYPE</th>
                <th className="p-3">SEVERITY</th>
                <th className="p-3">SCORE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {results.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/60">
                  <td className="p-3 font-semibold text-pink-300 break-all">{item.ioc}</td>
                  <td className="p-3">{item.type}</td>
                  <td className="p-3">{item.severity}</td>
                  <td className="p-3 font-bold text-cyan-300">{item.score}/100</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
