# AI-Based Phishing Detection & Cyber Threat Analysis System

[![GitHub Developer](https://img.shields.io/badge/GitHub-shivanshutiwari481--dot-00f3ff?logo=github&style=flat-square)](https://github.com/shivanshutiwari481-dot)
[![License: MIT](https://img.shields.io/badge/License-MIT-00ff88.svg?style=flat-square)](LICENSE)
[![Built with React](https://img.shields.io/badge/Frontend-React%20%7C%20TypeScript%20%7C%20Tailwind-indigo?style=flat-square)](https://react.dev)
[![Database](https://img.shields.io/badge/Database-SQLite3-emerald?style=flat-square)](https://www.sqlite.org)

An enterprise-grade **AI-Based Phishing Detection, Vulnerability Scanner & Cyber Threat Intelligence System** built for Security Operations Centers (SOC), Red/Blue Teams, and Incident Response Analysts.

Developed & Maintained by **[shivanshutiwari481-dot](https://github.com/shivanshutiwari481-dot)**.

---

## 🌟 Key Features & Capabilities

### 1. Multi-Vector AI Threat Analyzers
- **URL & Homograph Phishing Inspector**: Lexical Shannon entropy analysis, homoglyph typosquatting (`g00gle.com`, `paypal-update-login-security.top`), direct IP hostnames, high-risk TLDs (`.top`, `.xyz`), SSL TLS validation.
- **Email Header & NLP Inspector**: SPF, DKIM, and DMARC alignment checks, spoofed sender detection (`From` vs `Return-Path`), NLP intent classification (credential harvesting, urgency, BEC wire transfer fraud).
- **Static File Payload & YARA Inspector**: Binary Shannon entropy calculation, SHA-256 / MD5 hashes, and dynamic YARA rules matching obfuscated PowerShell scripts and API injection primitives.

### 2. Mobile & Web Application Vector Scanner
- **Web App Security Scanner**: Audits Security Headers (CSP, HSTS, X-Frame-Options), CORS policy, and Cookie flags (`SameSite=Strict`, `HttpOnly`, `Secure`).
- **Mobile App Binary Inspector (Android APK & iOS IPA)**: Discovers hardcoded API keys (`AKIA...` tokens), dangerous manifest permissions (`READ_SMS`, `SYSTEM_ALERT_WINDOW`), unencrypted SQLite database files, and TLS pinning bypasses.

### 3. Check Vulnerabilities & Bugs Detection (OWASP Top 10)
- Detects vulnerabilities across **OWASP Top 10** categories (XSS, SQL Injection, SSRF, Broken Access Control, Security Misconfigurations).
- Provides **CVE IDs**, **CVSS v3.1 Scores**, **Proof of Concept (PoC) Exploit Payloads**, and **Remediation Patch Code**.

### 4. Internal & External Phishing Intelligence Hub
- **Internal Employee Simulation Reports**: Department risk levels (Finance, HR, Engineering), Phishing Click-Through Rates (CTR), credential submission metrics, and automated retraining suggestions.
- **External Brand Protection & Takedown Hub**: Takedown tracking dashboard for rogue phishing domains impersonating company brands, registrar status (GoDaddy, Namecheap, Cloudflare), hosting IP tracking.

### 5. Explainable AI (XAI) Engine & SQLite Database
- Visual neural feature importance charts illustrating *why* a risk score (0 to 100) was assigned.
- **Persistent SQLite Database (`server/database/cyber_threats.db`)**: Stores all scan logs, audit reports, and live CTI threat feeds.

### 🧩 System Modules & Navigation Tabs Summary

| Navigation Tab | Key Vector Analyzed | Output / Analytics |
| :--- | :--- | :--- |
| 🛰️ **Threat Radar & CTI** | Global Attack Vectors & Live Feed | Real-time CTI Event Telemetry & Defense Posture |
| 🔍 **URL Phishing Scanner** | Homoglyphs, Lexical Entropy, TLDs | XAI Feature Breakdown, Brand Impersonation Index |
| ✉️ **Email & Header Inspector** | SPF, DKIM, DMARC, Spoofed From | Body NLP Intent & Malicious Link Extractor |
| 📱 **Mobile & Web App Scanner** | Android APK, iOS IPA, Web Headers | Disclosed API Keys, Dangerous Permissions, CORS |
| 🐛 **Check Vulnerabilities & Bugs** | OWASP Top 10 (XSS, SQLi, SSRF) | CVE IDs, CVSS v3.1 Scores, PoC Exploits, Code Patches |
| 📊 **Phishing Reports (Internal/External)**| Employee Simulation CTR & Brand Takedowns | Department Risk Levels, Registrar Takedown Monitor |
| 💻 **File Entropy & YARA** | Binary Payloads & Scripts | Shannon Entropy Visualizer, Cryptographic Hashes, YARA |
| 🧱 **MITRE ATT&CK Matrix** | Tactic & Technique Correlation | TTP Mapping (`T1566.002`, `T1583.001`, `T1059`) |
| 📋 **Batch IOC Scanner** | Bulk List of IPs, URLs, Hashes | Categorized Risk Audit & CSV Report Export |

---

## 📁 Directory Architecture

```
AI BASED DECTICTON CYBER THREAT ANALYZER/
├── client/                             # 🎨 Frontend Application (React + Vite + Tailwind)
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   └── src/
│       ├── App.tsx                     # Main Router & Dashboard Layout
│       ├── components/
│       │   ├── ThreatRadar.tsx         # Global Attack Radar & Live Feed
│       │   ├── UrlScanner.tsx          # URL Phishing Inspector
│       │   ├── EmailScanner.tsx        # Email & Header Inspector
│       │   ├── AppVectorScanner.tsx    # Mobile & Web App Scanner (NEW)
│       │   ├── VulnerabilityScanner.tsx# Check Vulnerabilities & Bugs (NEW)
│       │   ├── PhishingReportHub.tsx   # Internal & External Reports (NEW)
│       │   ├── FileScanner.tsx         # File Entropy & YARA
│       │   ├── ExplainableAI.tsx       # Explainable AI (XAI)
│       │   ├── MitreMatrix.tsx         # MITRE ATT&CK Matrix
│       │   └── ReportModal.tsx         # Forensic Audit Report Generator
│       └── services/                   # Detection Services & API Client
├── server/                             # ⚙️ Backend (Express + SQLite Database)
│   ├── server.js                       # Express REST API Server
│   ├── database/
│   │   ├── db.js                       # SQLite Connection & Migration
│   │   └── cyber_threats.db            # SQLite Database File
│   └── services/                       # Backend Detection Engines
├── package.json                        # Root Package Orchestrator
└── README.md
```

---

## 🚀 Installation & Quick Start

### 1. Run both Client & Server with a Single Command:
```bash
npm run dev
```

- 🌐 **Frontend (Vite UI):** `http://localhost:5173`
- 🛡️ **Backend (Express Server & SQLite DB):** `http://localhost:5000`

---

## 🐙 Push to GitHub Direct (`shivanshutiwari481-dot`)

```bash
git remote set-url origin https://github.com/shivanshutiwari481-dot/AI-Based-Phishing-Detection-Cyber-Threat-Analysis-System.git
git add .
git commit -m "feat: initial release of AI-Based Phishing Detection & Cyber Threat Analysis System"
git push -u origin main
```

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for details.

**Developer & Maintainer:** [shivanshutiwari481-dot](https://github.com/shivanshutiwari481-dot)
