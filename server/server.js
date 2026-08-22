import express from 'express';
import cors from 'cors';
import { db } from './database/db.js';
import { analyzeUrlBackend } from './services/urlAnalyzer.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 0. Root Endpoint - Interactive API Portal & System Overview
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>AI-Based Phishing Detection & Cyber Threat Analysis System - Backend API</title>
      <style>
        body { font-family: 'Fira Code', monospace; background-color: #070b12; color: #00f3ff; padding: 40px; line-height: 1.6; }
        .card { background: #0d1527; border: 1px solid #00f3ff55; padding: 24px; border-radius: 12px; max-width: 800px; box-shadow: 0 0 20px rgba(0,243,255,0.1); }
        h1 { color: #fff; font-size: 20px; border-b: 1px solid #1e293b; padding-bottom: 10px; }
        a { color: #00f3ff; text-decoration: underline; font-weight: bold; }
        .badge { background: #004455; color: #00ff88; padding: 3px 8px; border-radius: 4px; font-size: 12px; }
        ul { list-style: none; padding-left: 0; }
        li { margin: 8px 0; background: #080d19; padding: 10px; border-radius: 6px; border: 1px solid #334155; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>🛡️ AI-Based Phishing Detection & Cyber Threat Analysis System</h1>
        <p><span class="badge">BACKEND ONLINE</span> <strong>Server Port: 5000</strong> | <strong>SQLite DB Connected</strong></p>
        <p>Developer & Maintainer: <strong>shivanshutiwari481-dot</strong></p>

        <p style="color: #cbd5e1;">👉 To view the Interactive Frontend Security Operations Center (SOC) Dashboard:</p>
        <p><a href="http://localhost:5173" target="_blank">🌐 Launch Frontend UI Dashboard (http://localhost:5173)</a></p>

        <h3 style="color: #fff; margin-top: 24px;">Available REST API Endpoints:</h3>
        <ul>
          <li>🩺 <strong>GET</strong> <a href="/api/health">/api/health</a> - System Health & Database Diagnostics</li>
          <li>📊 <strong>GET</strong> <a href="/api/scans">/api/scans</a> - Fetch Recent Threat Scans from SQLite DB</li>
          <li>🌐 <strong>GET</strong> <a href="/api/threats">/api/threats</a> - Live CTI Threat Intelligence Feed</li>
          <li>📝 <strong>GET</strong> <a href="/api/reports">/api/reports</a> - Saved Forensic Audit Reports</li>
          <li>🔍 <strong>POST</strong> <code>/api/scan/url</code> - Perform Real-Time URL Phishing Inspection</li>
        </ul>
      </div>
    </body>
    </html>
  `);
});

// 1. Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'AI-Based Phishing Detection & Cyber Threat Analysis System Engine',
    database: 'SQLite Connected (cyber_threats.db)',
    maintainer: 'shivanshutiwari481-dot',
    frontendUi: 'http://localhost:5173',
    timestamp: new Date().toISOString()
  });
});

// 2. Perform & Save URL Phishing Scan to SQLite Database
app.post('/api/scan/url', (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL parameter is required.' });

  const result = analyzeUrlBackend(url);

  const stmt = db.prepare(`
    INSERT INTO scans (scan_type, target, score, severity, classification, xai_json)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run('URL', result.url, result.score, result.severity, result.classification, JSON.stringify(result.xaiFeatures), function(err) {
    if (err) {
      console.error('Error inserting scan to SQLite DB:', err);
    } else {
      result.dbId = this.lastID;
    }
    res.json(result);
  });
});

// 3. Fetch Recent Scans from SQLite Database
app.get('/api/scans', (req, res) => {
  db.all("SELECT * FROM scans ORDER BY created_at DESC LIMIT 20", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// 4. Fetch CTI Threat Feed from SQLite Database
app.get('/api/threats', (req, res) => {
  db.all("SELECT * FROM threat_feed ORDER BY created_at DESC LIMIT 15", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// 5. Save Forensic Audit Report to SQLite Database
app.post('/api/reports', (req, res) => {
  const { report_title, content, author } = req.body;
  if (!content) return res.status(400).json({ error: 'Report content is required.' });

  const stmt = db.prepare(`
    INSERT INTO audit_reports (report_title, content, author)
    VALUES (?, ?, ?)
  `);

  stmt.run(report_title || 'Forensic Incident Audit Report', content, author || 'shivanshutiwari481-dot', function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, reportId: this.lastID, message: 'Report saved to SQLite Database.' });
  });
});

// 6. Fetch Saved Forensic Audit Reports
app.get('/api/reports', (req, res) => {
  db.all("SELECT * FROM audit_reports ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`\n🛡️ AI Cyber Threat Engine Backend Server running on http://localhost:${PORT}`);
  console.log(`⚡ Database: SQLite connected at server/database/cyber_threats.db\n`);
});
