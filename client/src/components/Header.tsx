import React from 'react';
import { ShieldAlert, Terminal, Github, Activity, Radio, Cpu, FileText, Layers, Search, Globe, Smartphone, Bug, FileSpreadsheet } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openReportModal: () => void;
  threatCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  openReportModal,
  threatCount
}) => {
  const tabs = [
    { id: 'radar', label: 'Threat Radar & CTI', icon: Globe },
    { id: 'url', label: 'URL Phishing Scanner', icon: Search },
    { id: 'email', label: 'Email & Header Inspector', icon: Terminal },
    { id: 'app_vector', label: 'Mobile & Web App Scanner', icon: Smartphone },
    { id: 'vuln', label: 'Check Vulnerabilities & Bugs', icon: Bug },
    { id: 'phish_reports', label: 'Phishing Reports (Internal & External)', icon: FileSpreadsheet },
    { id: 'file', label: 'File Entropy & YARA', icon: Cpu },
    { id: 'mitre', label: 'MITRE ATT&CK Matrix', icon: Layers },
    { id: 'batch', label: 'Batch IOC Scanner', icon: Activity },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#080d19]/90 backdrop-blur-md border-b border-cyan-500/20 shadow-lg shadow-cyan-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('radar')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-400/50 text-cyan-400 shadow-md shadow-cyan-500/20">
              <ShieldAlert className="w-6 h-6 animate-pulse text-cyan-400" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold tracking-wider text-sm sm:text-base text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">
                  AI-Based Phishing Detection & Cyber Threat Analysis System
                </span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-slate-400">GitHub Dev:</span>
              <a 
                href="https://github.com/shivanshutiwari481-dot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-300 hover:text-cyan-100 font-semibold underline flex items-center space-x-1"
              >
                <span>shivanshutiwari481-dot</span>
                <Github className="w-3.5 h-3.5 inline ml-1 text-cyan-400" />
              </a>
            </div>

            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-pink-950/50 border border-pink-500/30 text-xs font-mono text-pink-300">
              <Radio className="w-3.5 h-3.5 animate-spin text-pink-400" />
              <span>{threatCount} Active Threat IOCs</span>
            </div>

            <button
              onClick={openReportModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-md shadow-cyan-900/50 transition-all border border-cyan-400/30"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generate Audit Report</span>
            </button>
          </div>
        </div>

        <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 text-xs font-mono rounded-md transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
