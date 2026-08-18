import React from 'react';
import { Github, Shield, ExternalLink } from 'lucide-react';

export const GitHubFooter: React.FC = () => {
  return (
    <footer className="mt-12 border-t border-slate-800/80 bg-[#060a12] py-8 text-slate-400 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-slate-200">Aegis Cyber AI Phishing & Threat Analyzer</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Connected to SQLite Database (`server/database/cyber_threats.db`).
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-900 border border-cyan-500/30">
              <Github className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300">GitHub Developer:</span>
              <a
                href="https://github.com/shivanshutiwari481-dot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 font-bold hover:text-cyan-100 underline flex items-center gap-1"
              >
                <span>shivanshutiwari481-dot</span>
                <ExternalLink className="w-3 h-3 text-cyan-400" />
              </a>
            </div>
          </div>

          <div className="text-center md:text-right text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} Aegis Cyber Intel. Open Source MIT License.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
