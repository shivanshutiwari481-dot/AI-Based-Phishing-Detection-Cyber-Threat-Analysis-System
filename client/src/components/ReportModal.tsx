import React, { useState } from 'react';
import { X, FileText, Copy, Check, Download, Github } from 'lucide-react';
import { saveReportToBackend } from '../services/apiClient';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const reportMarkdown = `# FORENSIC INCIDENT & VULNERABILITY AUDIT REPORT
**System:** AI-Based Phishing Detection & Cyber Threat Analyzer System
**Version:** v2.4 (Enterprise Full-Stack Edition)
**Date:** ${new Date().toUTCString()}
**Lead SOC Maintainer:** shivanshutiwari481-dot (https://github.com/shivanshutiwari481-dot)
**Database File:** SQLite Connected (\`server/database/cyber_threats.db\`)

---

## 1. Executive Summary
This forensic audit report details findings across Web Endpoints, Mobile Application Binaries (APK/IPA), Internal/External Phishing Campaigns, and OWASP Top 10 Vulnerabilities.

## 2. Analyzed Threat Vectors & Indicators of Compromise (IOCs)
- **URL Vector:** \`https://paypal-update-login-security.top/verify?user=admin\`
  - **Risk Score:** 85/100 (CRITICAL) | **Classification:** Malicious Phishing Portal
- **Mobile Application Binary:** \`SecureBank_Mobile_v3.4.apk\` (\`com.securebank.mobile.app\`)
  - **Risk Score:** 82/100 (CRITICAL)
  - **Hardcoded Secret Disclosed:** \`AKIAIOSFODNN7EXAMPLE\` (AWS Access Key ID)
  - **High-Risk Permissions:** \`READ_SMS\`, \`SYSTEM_ALERT_WINDOW\`
- **Web App Vulnerability:** CVE-2024-41102 Reflected XSS in \`/search?q=\` (CVSS 8.2 HIGH)

## 3. Internal & External Phishing Intelligence Summary
- **Internal Employee Simulation Click Rate:** 12.4% (Highest risk: Finance 18.5%, HR 15.2%)
- **External Rogue Brand Protection Takedowns:**
  - \`paypal-update-login-security.top\` (IP: 185.220.101.4) - **Takedown Requested**
  - \`g00gle-account-verification.xyz\` (IP: 45.154.255.89) - **Removed**

## 4. Automated SOAR Remediation & Patching
1. Rotate disclosed AWS & Stripe API keys immediately.
2. Apply DOMPurify contextual HTML output sanitization to fix Reflected XSS.
3. Block \`185.220.101.4\` and \`paypal-update-login-security.top\` on DNS/Perimeter Gateway.

---
*Generated automatically by AI-Based Phishing Detection & Cyber Threat Analyzer System.*
*Repository & Maintainer: [shivanshutiwari481-dot](https://github.com/shivanshutiwari481-dot)*
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToDatabase = async () => {
    const res = await saveReportToBackend(reportMarkdown, 'Forensic Incident Audit Report');
    if (res && res.success) {
      setSavedStatus(`Saved to SQLite DB (Report ID #${res.reportId})`);
    } else {
      setSavedStatus('Database connection fallback.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-panel-glow w-full max-w-3xl rounded-xl p-6 relative max-h-[90vh] flex flex-col font-mono text-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              FORENSIC INCIDENT AUDIT REPORT GENERATOR
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-3 p-2.5 rounded bg-slate-900/90 border border-slate-800 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">GitHub Developer:</span>
          <a href="https://github.com/shivanshutiwari481-dot" target="_blank" rel="noreferrer" className="text-cyan-300 font-bold hover:underline flex items-center gap-1">
            <span>shivanshutiwari481-dot</span>
            <Github className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="flex-1 overflow-y-auto my-2 p-4 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 whitespace-pre-wrap font-mono text-[11px]">
          {reportMarkdown}
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-emerald-400 font-bold">{savedStatus}</span>
          <div className="flex items-center space-x-3">
            <button onClick={handleSaveToDatabase} className="px-3 py-2 rounded bg-slate-800 text-cyan-300 font-semibold border border-slate-700">
              SAVE TO SQLITE DB
            </button>
            <button onClick={handleCopy} className="px-4 py-2 rounded bg-cyan-600 text-white font-semibold flex items-center space-x-1">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'COPIED' : 'COPY MARKDOWN'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
