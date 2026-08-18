import express from 'express';
import cors from 'cors';
import { db } from './database/db.js';
import { analyzeUrlBackend } from './services/urlAnalyzer.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'Aegis Cyber AI Threat Engine Server',
    database: 'SQLite Connected (cyber_threats.db)',
    maintainer: 'shivanshutiwari481-dot',
    timestamp: new Date().toISOString()
  });
});

// 2. Perform & Save URL Phishing Scan to SQLite Database
app.post('/api/scan/url', (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL parameter is required.' });

  const result = analyzeUrlBackend(url);

  // Insert Scan into SQLite DB
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
  console.log(`\n🛡️ Aegis Cyber AI Backend Server running on http://localhost:${PORT}`);
  console.log(`⚡ Database: SQLite connected at server/database/cyber_threats.db\n`);
});
