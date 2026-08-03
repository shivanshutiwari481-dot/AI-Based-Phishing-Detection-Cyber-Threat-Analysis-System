import express from 'express';
import cors from 'cors';
import { analyzeUrl } from '../src/services/urlAnalyzer.js';
import { analyzeEmail } from '../src/services/emailAnalyzer.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Health Check API Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'Aegis Cyber AI Threat Analysis Engine',
    version: '2.4',
    timestamp: new Date().toISOString()
  });
});

// 2. URL Phishing AI Scan API Endpoint
app.post('/api/scan/url', (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required.' });
  }
  const result = analyzeUrl(url);
  res.json(result);
});

// 3. Email & Header Inspection API Endpoint
app.post('/api/scan/email', (req, res) => {
  const { headers, body } = req.body;
  if (!headers || !body) {
    return res.status(400).json({ error: 'Headers and body text are required.' });
  }
  const result = analyzeEmail(headers, body);
  res.json(result);
});

// 4. Live CTI Feed API Endpoint
app.get('/api/threats/live', (req, res) => {
  res.json([
    { id: 'c2-101', type: 'Phishing Campaign', domain: 'paypal-security-update.top', score: 85 },
    { id: 'c2-102', type: 'Ransomware Loader', domain: 'invoice-tracking-2026.xyz', score: 92 },
    { id: 'c2-103', type: 'Cobalt Strike Beacon', domain: 'update-cdn-service.top', score: 95 }
  ]);
});

app.listen(PORT, () => {
  console.log(`\n🛡️ Aegis Cyber AI Backend Server running on http://localhost:${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health\n`);
});
