import React, { useState, useEffect } from 'react';
import { analyzeUrl } from '../services/urlAnalyzer';
import { UrlAnalysisResult } from '../types/threat';
import { ExplainableAI } from './ExplainableAI';
import { Search, Globe, Cpu, ShieldCheck, Zap } from 'lucide-react';
import { sendUrlScanToBackend } from '../services/apiClient';

const PRESET_URLS = [
  { label: 'Phishing PayPal Homoglypt', url: 'https://paypal-update-login-security.top/verify?user=admin' },
  { label: 'Homograph Google Lookalike', url: 'https://g00gle-account-verification.xyz/auth' },
  { label: 'Suspicious Raw IP', url: 'http://185.220.101.4/office365/login.php' },
  { label: 'Legitimate Official Domain', url: 'https://github.com/shivanshutiwari481-dot' },
];

export const UrlScanner: React.FC<{ initialUrl?: string }> = ({ initialUrl }) => {
  const [inputUrl, setInputUrl] = useState(initialUrl || 'https://paypal-update-login-security.top/verify?user=admin');
  const [result, setResult] = useState<UrlAnalysisResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async (targetUrl?: string) => {
    const urlToScan = targetUrl || inputUrl;
    if (!urlToScan) return;
    setIsScanning(true);
    
    // Try sending to Express + SQLite backend, fallback to client engine
    const backendRes = await sendUrlScanToBackend(urlToScan);
    if (backendRes && !backendRes.error) {
      setResult(backendRes);
    } else {
      const res = analyzeUrl(urlToScan);
      setResult(res);
    }
    setIsScanning(false);
  };

  useEffect(() => {
    if (initialUrl) {
      setInputUrl(initialUrl);
      handleScan(initialUrl);
    } else {
      handleScan('https://paypal-update-login-security.top/verify?user=admin');
    }
  }, [initialUrl]);

  return (
    <div className="space-y-6">
      <div className="glass-panel-glow rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-3">
          <Search className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wide">
            AI URL Phishing & Homograph Analyzer (SQLite DB Connected)
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              placeholder="e.g. https://paypal-security-update.top/login"
              className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-lg text-sm font-mono text-cyan-200 outline-none transition-all"
            />
            <Globe className="absolute right-3 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>

          <button
            onClick={() => handleScan()}
            disabled={isScanning}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono font-semibold text-sm rounded-lg shadow-md shadow-cyan-900/50 flex items-center justify-center space-x-2 transition-all"
          >
            {isScanning ? (
              <>
                <Zap className="w-4 h-4 animate-spin text-cyan-300" />
                <span>SCANNING & SAVING TO DB...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>RUN AI SCAN</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-800">
          <span className="text-xs font-mono text-slate-400 flex items-center mr-2">Sample IOC Vectors:</span>
          {PRESET_URLS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputUrl(preset.url);
                handleScan(preset.url);
              }}
              className="px-2.5 py-1 text-[11px] font-mono rounded bg-slate-800/80 hover:bg-cyan-950/80 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-slate-300 transition-all"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="space-y-6">
          <div className={`rounded-xl p-6 border transition-all ${
            result.severity === 'CRITICAL' || result.severity === 'HIGH' ? 'glass-panel-danger' : 'glass-panel-glow'
          }`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 flex-1 font-mono">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                    result.severity === 'CRITICAL' ? 'bg-pink-950 text-pink-300 border-pink-500' : 'bg-emerald-950 text-emerald-300 border-emerald-500'
                  }`}>
                    {result.severity} THREAT SEVERITY
                  </span>
                  <span className="text-xs text-cyan-300 font-bold">{result.classification}</span>
                </div>

                <div className="break-all text-sm text-slate-100 bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500">Target URL:</span>{' '}
                  <span className="text-pink-400 font-semibold">{result.url}</span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-slate-900/80 rounded-xl border border-slate-800 shrink-0 min-w-[180px] font-mono">
                <span className="text-xs text-slate-400 mb-1">AI Risk Score</span>
                <div className={`text-4xl font-extrabold ${result.score >= 50 ? 'text-pink-500 text-danger-glow' : 'text-emerald-400'}`}>
                  {result.score}<span className="text-sm font-normal text-slate-500">/100</span>
                </div>
              </div>
            </div>
          </div>

          <ExplainableAI features={result.xaiFeatures} overallScore={result.score} />
        </div>
      )}
    </div>
  );
};
