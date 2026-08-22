import React, { useState } from 'react';
import { PhishingReportData } from '../types/threat';
import { ShieldAlert, Users, Globe, ExternalLink, AlertTriangle, FileSpreadsheet, Search, CheckCircle, Filter, Zap } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const INITIAL_EXTERNAL_TAKEDOWNS = [
  { domain: 'paypal-update-login-security.top', registrar: 'NameCheap Inc.', status: 'TAKEDOWN_REQUESTED', ip: '185.220.101.4' },
  { domain: 'g00gle-account-verification.xyz', registrar: 'Hostinger International', status: 'REMOVED', ip: '45.154.255.89' },
  { domain: 'microsoft-auth-portal-sec.com', registrar: 'GoDaddy LLC', status: 'ACTIVE', ip: '194.26.29.112' },
  { domain: 'secure-bank-update-login.info', registrar: 'Dynadot LLC', status: 'TAKEDOWN_REQUESTED', ip: '103.14.24.5' },
  { domain: 'appleid-verify-credentials.click', registrar: 'Cloudflare Inc.', status: 'ACTIVE', ip: '185.220.101.88' }
];

const INTERNAL_REPORT_DATA: PhishingReportData = {
  reportType: 'INTERNAL',
  title: 'Q3 Corporate Employee Phishing Simulation & Security Awareness Audit',
  period: 'Q3 2026 (Last 90 Days)',
  totalCampaigns: 12,
  totalTargetUsers: 1450,
  clickedPhishingRatio: 12.4,
  submittedCredentialsRatio: 3.8,
  departmentBreakdown: [
    { dept: 'Finance & Accounting', clickRate: 18.5, riskLevel: 'HIGH' },
    { dept: 'Human Resources (HR)', clickRate: 15.2, riskLevel: 'HIGH' },
    { dept: 'Sales & Marketing', clickRate: 11.8, riskLevel: 'MEDIUM' },
    { dept: 'Engineering / IT', clickRate: 4.2, riskLevel: 'SAFE' },
    { dept: 'Executive Management', clickRate: 14.0, riskLevel: 'MEDIUM' }
  ],
  topTemplates: [
    { templateName: 'Office 365 Password Expiration Alert', successRate: 22.4, riskCategory: 'Credential Harvesting' },
    { templateName: 'SWIFT Wire Transfer Confidential Notice', successRate: 16.8, riskCategory: 'Business Email Compromise (BEC)' },
    { templateName: 'Payroll Direct Deposit Update Required', successRate: 14.1, riskCategory: 'Financial Fraud' }
  ]
};

export const PhishingReportHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'INTERNAL' | 'EXTERNAL'>('EXTERNAL');
  const [searchQuery, setSearchQuery] = useState('');
  const [takedownsList, setTakedownsList] = useState(INITIAL_EXTERNAL_TAKEDOWNS);
  const [isSearching, setIsSearching] = useState(false);

  const handleUrlSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      let domainName = searchQuery.trim().toLowerCase();
      try {
        const parsed = new URL(domainName.startsWith('http') ? domainName : 'https://' + domainName);
        domainName = parsed.hostname;
      } catch (e) {}

      // Check if domain exists in takedown list, otherwise dynamically generate entry
      const exists = takedownsList.some(t => t.domain.includes(domainName));
      if (!exists) {
        const newEntry = {
          domain: domainName,
          registrar: domainName.endsWith('.top') ? 'NameCheap Inc.' : domainName.endsWith('.xyz') ? 'Hostinger' : 'GoDaddy LLC',
          status: Math.random() > 0.5 ? 'TAKEDOWN_REQUESTED' : 'ACTIVE',
          ip: `${Math.floor(Math.random() * 150) + 40}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
        };
        setTakedownsList(prev => [newEntry, ...prev]);
      }
      setIsSearching(false);
    }, 400);
  };

  const filteredTakedowns = takedownsList.filter(t =>
    t.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.registrar.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.ip.includes(searchQuery)
  );

  const filteredDepartments = INTERNAL_REPORT_DATA.departmentBreakdown.filter(d =>
    d.dept.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const chartData = filteredDepartments.map(d => ({
    dept: d.dept,
    clickRate: d.clickRate
  }));

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Header Selector */}
      <div className="glass-panel-glow rounded-xl p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              INTERNAL & EXTERNAL PHISHING THREAT INTELLIGENCE REPORTS
            </h2>
          </div>

          <div className="flex space-x-2 bg-slate-900 p-1 rounded-lg border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('EXTERNAL')}
              className={`px-4 py-1.5 rounded-md font-semibold transition-all ${
                activeTab === 'EXTERNAL'
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              External Brand Protection
            </button>
            <button
              onClick={() => setActiveTab('INTERNAL')}
              className={`px-4 py-1.5 rounded-md font-semibold transition-all ${
                activeTab === 'INTERNAL'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Internal Employee Audit
            </button>
          </div>
        </div>

        {/* URL / Domain Search Bar */}
        <div className="mt-2 space-y-2">
          <label className="text-slate-300 font-bold text-[11px] flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            Search Phishing Campaign Domain / Rogue URL / IP:
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUrlSearch()}
                placeholder="e.g. paypal-update-login-security.top or g00gle-account-verification.xyz"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-lg text-xs text-cyan-200 outline-none"
              />
              <Globe className="absolute right-3 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>

            <button
              onClick={handleUrlSearch}
              disabled={isSearching}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-md flex items-center justify-center space-x-2 transition-all shrink-0"
            >
              {isSearching ? <Zap className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>SEARCH REPORT INTEL</span>
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px]">
            <span className="text-slate-500">Quick Intel Filter:</span>
            {['paypal', 'google', 'microsoft', '185.220'].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSearchQuery(preset);
                  handleUrlSearch();
                }}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              >
                {preset}
              </button>
            ))}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-500/40"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-slate-400 border-t border-slate-800 pt-3 text-[11px] mt-4">
          <span>Report Title: <strong className="text-slate-200">{activeTab === 'INTERNAL' ? INTERNAL_REPORT_DATA.title : EXTERNAL_REPORT_DATA.title}</strong></span>
          <span>Time Frame: <strong className="text-cyan-300">August 2026 Threat Feed</strong></span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl space-y-1">
          <span className="text-slate-400 text-[10px]">Total Scanned Campaigns:</span>
          <div className="text-2xl font-bold text-cyan-300">28 Campaigns</div>
        </div>
        <div className="glass-panel p-4 rounded-xl space-y-1">
          <span className="text-slate-400 text-[10px]">Target Audience / Users:</span>
          <div className="text-2xl font-bold text-indigo-300">84,000 Users</div>
        </div>
        <div className="glass-panel p-4 rounded-xl space-y-1">
          <span className="text-slate-400 text-[10px]">Phishing Click Ratio (CTR):</span>
          <div className="text-2xl font-bold text-amber-400">8.5%</div>
        </div>
        <div className="glass-panel p-4 rounded-xl space-y-1">
          <span className="text-slate-400 text-[10px]">Compromised Credentials Rate:</span>
          <div className="text-2xl font-bold text-pink-400">2.1%</div>
        </div>
      </div>

      {/* External Brand Protection Takedowns Table */}
      {activeTab === 'EXTERNAL' && (
        <div className="glass-panel rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-pink-400 flex items-center space-x-2">
              <Globe className="w-4 h-4 text-pink-400" />
              <span>EXTERNAL ROGUE PHISHING DOMAINS & REGISTRAR TAKEDOWN MONITOR ({filteredTakedowns.length})</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="p-3">IMPERSONATING DOMAIN / URL</th>
                  <th className="p-3">REGISTRAR</th>
                  <th className="p-3">HOSTING IP</th>
                  <th className="p-3">TAKEDOWN STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredTakedowns.map((tk, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-3 font-semibold text-pink-300 break-all">{tk.domain}</td>
                    <td className="p-3">{tk.registrar}</td>
                    <td className="p-3 font-mono text-cyan-300">{tk.ip}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
                        tk.status === 'REMOVED'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                          : tk.status === 'TAKEDOWN_REQUESTED'
                          ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                          : 'bg-pink-950 text-pink-300 border-pink-500/40'
                      }`}>
                        {tk.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Internal Department Risk Chart */}
      {activeTab === 'INTERNAL' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-slate-200 flex items-center space-x-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>DEPARTMENT PHISHING CLICK-THROUGH RATE (%)</span>
            </h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={180}>
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                  <XAxis type="number" domain={[0, 25]} stroke="#475569" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis dataKey="dept" type="category" stroke="#475569" tick={{ fontSize: 10, fill: '#cbd5e1' }} width={140} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                  <Bar dataKey="clickRate" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.clickRate > 15 ? '#ff0055' : entry.clickRate > 10 ? '#ff9900' : '#00ff88'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-6 space-y-3">
            <h3 className="font-bold text-slate-200">TOP PHISHING SIMULATION TEMPLATES</h3>
            <div className="space-y-3">
              {INTERNAL_REPORT_DATA.topTemplates.map((tpl, idx) => (
                <div key={idx} className="p-3 bg-slate-900/80 rounded border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-slate-200 font-bold block">{tpl.templateName}</span>
                    <span className="text-slate-400 text-[11px]">{tpl.riskCategory}</span>
                  </div>
                  <span className="text-pink-400 font-bold bg-pink-950 px-2.5 py-1 rounded border border-pink-500/40">
                    {tpl.successRate}% Click Rate
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
