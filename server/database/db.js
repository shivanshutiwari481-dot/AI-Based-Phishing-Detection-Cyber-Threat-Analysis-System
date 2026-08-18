import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database Directory Path
const dbDir = path.join(__dirname);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'cyber_threats.db');
sqlite3.verbose();

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error connecting to SQLite Database:', err.message);
  } else {
    console.log('⚡ Connected to SQLite Database at:', dbPath);
  }
});

// Initialize Database Tables
db.serialize(() => {
  // Table 1: Scans History Table
  db.run(`
    CREATE TABLE IF NOT EXISTS scans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scan_type TEXT NOT NULL,
      target TEXT NOT NULL,
      score INTEGER NOT NULL,
      severity TEXT NOT NULL,
      classification TEXT NOT NULL,
      xai_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table 2: Audit Reports Table
  db.run(`
    CREATE TABLE IF NOT EXISTS audit_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      report_title TEXT NOT NULL,
      content TEXT NOT NULL,
      author TEXT DEFAULT 'shivanshutiwari481-dot',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table 3: Live CTI Threat Feed Table
  db.run(`
    CREATE TABLE IF NOT EXISTS threat_feed (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_ip TEXT NOT NULL,
      target_region TEXT NOT NULL,
      threat_type TEXT NOT NULL,
      severity TEXT NOT NULL,
      description TEXT NOT NULL,
      target_domain TEXT NOT NULL,
      mitre_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed Initial Threat Feed Data if Empty
  db.get("SELECT COUNT(*) as count FROM threat_feed", (err, row) => {
    if (row && row.count === 0) {
      const seedStmt = db.prepare(`
        INSERT INTO threat_feed (source_ip, target_region, threat_type, severity, description, target_domain, mitre_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      seedStmt.run('185.220.101.4', 'US-East (Financial)', 'Phishing Campaign', 'CRITICAL', 'Credential harvesting kit mimicking Office365 OAuth flow.', 'login-office365-verify-sec.com', 'T1566.002');
      seedStmt.run('45.154.255.89', 'EU-Central (Logistics)', 'Ransomware Vector', 'HIGH', 'LockBit 3.0 loader payload distributed via deceptive PDF macro.', 'invoice-tracking-2026.xyz', 'T1204.002');
      seedStmt.run('194.26.29.112', 'APAC (Healthcare)', 'C2 Callback', 'CRITICAL', 'Cobalt Strike DNS beaconing over port 443 detected.', 'update-cdn-service.top', 'T1071.004');
      seedStmt.finalize();
      console.log('✅ SQLite Database Seeded with Initial CTI Threat Feed Data.');
    }
  });
});
