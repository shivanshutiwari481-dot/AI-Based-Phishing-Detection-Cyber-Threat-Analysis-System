import React, { useState } from 'react';
import { analyzeAppSecurity } from '../services/vulnerabilityAnalyzer';
import { AppSecurityScanResult } from '../types/threat';
import { ExplainableAI } from './ExplainableAI';
import { Smartphone, Globe, Shield, Lock, FileCode, CheckCircle, XCircle, AlertTriangle, Key } from 'lucide-react';

export const AppVectorScanner: React.FC = () => {
  const [appType, setAppType] = useState<'WEB_APP' | 'MOBILE_ANDROID_APK' | 'MOBILE_IOS_IPA'>('MOBILE_ANDROID_APK');
  const [appName, setAppName] = useState('SecureBank_Mobile_v3.4.apk');
  const [targetId, setTargetId] = useState('com.securebank.mobile.app');
  const [result, setResult] = useState<AppSecurityScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const res = analyzeAppSecurity(appName, appType, targetId);
      setResult(res);
      setIsScanning(false);
    }, 500);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Selector */}
      <div className="glass-panel-glow rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-3">
          <Smartphone className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            MOBILE & WEB APPLICATION VECTOR THREAT ANALYZER
          </h2>
        </div>
        <p className="text-slate-400 mb-4">
          Audit Mobile App Binaries (Android APK / iOS IPA) and Web Application Security Headers, API Token Disclosures, and Manifest Permissions.
        </p>

        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={() => {
              setAppType('MOBILE_ANDROID_APK');
              setAppName('SecureBank_Mobile_v3.4.apk');
              setTargetId('com.securebank.mobile.app');
            }}
            className={`px-4 py-2 rounded-lg border font-semibold flex items-center space-x-2 transition-all ${
              appType === 'MOBILE_ANDROID_APK'
                ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android APK Binary</span>
          </button>

          <button
            onClick={() => {
              setAppType('MOBILE_IOS_IPA');
              setAppName('PayVault_iOS_Enterprise.ipa');
              setTargetId('com.payvault.ios');
            }}
            className={`px-4 py-2 rounded-lg border font-semibold flex items-center space-x-2 transition-all ${
              appType === 'MOBILE_IOS_IPA'
                ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>iOS IPA Application</span>
          </button>

          <button
            onClick={() => {
              setAppType('WEB_APP');
              setAppName('Corporate E-Banking Portal');
              setTargetId('ebanking.target-bank.com');
            }}
            className={`px-4 py-2 rounded-lg border font-semibold flex items-center space-x-2 transition-all ${
              appType === 'WEB_APP'
                ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Web Application Domain</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400 text-[10px] block mb-1">App / Binary Name:</label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-cyan-200 outline-none"
            />
          </div>
          <div>
            <label className="text-slate-400 text-[10px] block mb-1">Package ID / Target Domain:</label>
            <input
              type="text"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-cyan-200 outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleScan}
          disabled={isScanning}
          className="mt-4 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md flex items-center space-x-2"
        >
          <Shield className="w-4 h-4" />
          <span>INSPECT APPLICATION SECURITY VECTORS</span>
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          <div className={`rounded-xl p-6 border ${result.severity === 'CRITICAL' || result.severity === 'HIGH' ? 'glass-panel-danger' : 'glass-panel-glow'}`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-pink-950 text-pink-300 rounded-full font-bold border border-pink-500/40">
                    {result.severity} APPLICATION RISK
                  </span>
                  <span className="text-slate-200 font-bold text-sm">{result.appName}</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Package / Vector: <code className="text-cyan-300">{result.targetIdentifier}</code>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-slate-900/90 rounded-xl border border-slate-800 shrink-0 min-w-[170px]">
                <span className="text-slate-400 mb-1">App Threat Index</span>
                <div className={`text-4xl font-extrabold ${result.riskScore >= 50 ? 'text-pink-400 text-danger-glow' : 'text-emerald-400'}`}>
                  {result.riskScore}<span className="text-sm font-normal text-slate-500">/100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hardcoded Secrets Disclosed */}
          {result.hardcodedSecrets && (
            <div className="glass-panel rounded-xl p-6 space-y-3">
              <h3 className="font-bold text-pink-400 flex items-center space-x-2">
                <Key className="w-4 h-4 text-pink-400" />
                <span>DISCLOSED HARDCODED API KEYS & SECRETS</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.hardcodedSecrets.map((sec, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/90 rounded border border-pink-500/30">
                    <div className="flex items-center justify-between font-bold text-pink-300 mb-1">
                      <span>{sec.secretType}</span>
                      <span className="text-[10px] bg-pink-950 px-2 py-0.5 rounded text-pink-400 border border-pink-500/40">
                        {sec.severity}
                      </span>
                    </div>
                    <code className="text-slate-300 text-[11px] break-all">{sec.snippet}</code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mobile App Permissions */}
          {result.permissionsChecked && (
            <div className="glass-panel rounded-xl p-6 space-y-3">
              <h3 className="font-bold text-cyan-300 flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>ANDROID MANIFEST PERMISSIONS AUDIT</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.permissionsChecked.map((perm, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/80 rounded border border-slate-800 flex items-start justify-between">
                    <div>
                      <span className="text-slate-200 font-bold block">{perm.permission}</span>
                      <span className="text-slate-400 text-[11px] mt-1 block">{perm.description}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      perm.risk === 'HIGH' ? 'bg-pink-950 text-pink-300 border-pink-500/40' : 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {perm.risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ExplainableAI features={result.xaiFeatures} overallScore={result.riskScore} />
        </div>
      )}
    </div>
  );
};
