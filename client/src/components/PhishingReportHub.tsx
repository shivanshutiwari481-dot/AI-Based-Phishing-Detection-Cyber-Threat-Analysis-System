import React, { useState } from 'react';
import { PhishingReportData } from '../types/threat';
import { ShieldAlert, Users, Globe, ExternalLink, AlertTriangle, FileSpreadsheet, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

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

const EXTERNAL_REPORT_DATA: PhishingReportData = {
  reportType: 'EXTERNAL',
  title: 'External Brand Impersonation & Rogue Domain Takedown Intelligence',
  period: 'August 2026 Threat Feed',
  totalCampaigns: 28,
  totalTargetUsers: 84000,
  clickedPhishingRatio: 8.5,
  submittedCredentialsRatio: 2.1,
  departmentBreakdown: [],
  externalTakedowns: [
    { domain: 'paypal-update-login-security.top', registrar: 'NameCheap Inc.', status: 'TAKEDOWN_REQUESTED', ip: '185.220.101.4' },
    { domain: 'g00gle-account-verification.xyz', registrar: 'Hostinger International', status: 'REMOVED', ip: '45.154.255.89' },
    { domain: 'microsoft-auth-portal-sec.com', registrar: 'GoDaddy LLC', status: 'ACTIVE', ip: '194.26.29.112' },
    { domain: 'secure-bank-update-login.info', registrar: 'Dynadot LLC', status: 'TAKEDOWN_REQUESTED', ip: '103.14.24.5' }
  ],
  topTemplates: [
    { templateName: 'OAuth SSO Token Harvester Kit v4', successRate: 42.0, riskCategory: 'Brand Impersonation' },
    { templateName: 'Fake Banking Login Portal Clone', successRate: 35.5, riskCategory: 'Financial Phishing' }
  ]
};

export const PhishingReportHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'INTERNAL' | 'EXTERNAL'>('INTERNAL');

  const report = activeTab === 'INTERNAL' ? INTERNAL_REPORT_DATA : EXTERNAL_REPORT_DATA;

  const chartData = report.departmentBreakdown.map(d => ({
    dept: d.dept,
    clickRate: d.clickRate
  }));

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Header Selector */}
      <div className="glass-panel-glow rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              INTERNAL & EXTERNAL PHISHING THREAT INTELLIGENCE REPORTS
            </h2>
          </div>

          <div className="flex space-x-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
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
          </div>
        </div>

        <div className="flex items-center justify-between text-slate-400 border-t border-slate-800 pt-3 text-[11px]">
          <span>Report Title: <strong className="text-slate-200">{report.title}</strong></span>
          <span>Time Frame: <strong className="text-cyan-300">{report.period}</strong></span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl space-y-1">
          <span className="text-slate-400 text-[10px]">Total Scanned Campaigns:</span>
          <div className="text-2xl font-bold text-cyan-300">{report.totalCampaigns} Campaigns</div>
        </div>
        <div className="glass-panel p-4 rounded-xl space-y-1">
          <span className="text-slate-400 text-[10px]">Target Audience / Users:</span>
          <div className="text-2xl font-bold text-indigo-300">{report.totalTargetUsers.toLocaleString()} Users</div>
        </div>
        <div className="glass-panel p-4 rounded-xl space-y-1">
          <span className="text-slate-400 text-[10px]">Phishing Click Ratio (CTR):</span>
          <div className="text-2xl font-bold text-amber-400">{report.clickedPhishingRatio}%</div>
        </div>
        <div className="glass-panel p-4 rounded-xl space-y-1">
          <span className="text-slate-400 text-[10px]">Compromised Credentials Rate:</span>
          <div className="text-2xl font-bold text-pink-400">{report.submittedCredentialsRatio}%</div>
        </div>
      </div>

      {/* Internal Department Risk Chart */}
      {activeTab === 'INTERNAL' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-slate-200 flex items-center space-x-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>DEPARTMENT PHISHING CLICK-THROUGH RATE (%)</span>
            </h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
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
              {report.topTemplates.map((tpl, idx) => (
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

      {/* External Brand Protection Takedowns Table */}
      {activeTab === 'EXTERNAL' && (
        <div className="glass-panel rounded-xl p-6 space-y-4">
          <h3 className="font-bold text-pink-400 flex items-center space-x-2">
            <Globe className="w-4 h-4 text-pink-400" />
            <span>EXTERNAL ROGUE PHISHING DOMAINS & REGISTRAR TAKEDOWN MONITOR</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="p-3">IMPERSONATING DOMAIN</th>
                  <th className="p-3">REGISTRAR</th>
                  <th className="p-3">HOSTING IP</th>
                  <th className="p-3">TAKEDOWN STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {report.externalTakedowns?.map((tk, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/60">
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
    </div>
  );
};
