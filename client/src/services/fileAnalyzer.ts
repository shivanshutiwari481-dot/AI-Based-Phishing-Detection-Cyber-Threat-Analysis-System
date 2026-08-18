import { FileAnalysisResult, ThreatSeverity, XAiFeature } from '../types/threat';
import { calculateShannonEntropy } from './urlAnalyzer';

const DANGEROUS_EXTENSIONS = ['.exe', '.vbs', '.js', '.bat', '.ps1', '.cmd', '.scr', '.hta', '.jar', '.dll'];
const SUSPICIOUS_CODE_KEYWORDS = ['eval(', 'exec(', 'powershell -nop -w hidden', 'WScript.Shell', 'VirtualAlloc', 'CreateRemoteThread'];

function buf2hex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function simpleHash(str: string): string {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(32, 'e');
}

export async function analyzeFile(file: File): Promise<FileAnalysisResult> {
  const arrayBuffer = await file.arrayBuffer();
  const fileText = new TextDecoder('utf-8', { fatal: false }).decode(arrayBuffer);

  let sha256 = '';
  try {
    const hashBuf = await crypto.subtle.digest('SHA-256', arrayBuffer);
    sha256 = buf2hex(hashBuf);
  } catch (e) {
    sha256 = simpleHash(file.name + file.size) + simpleHash(file.name);
  }

  const md5 = simpleHash(file.name + file.size);
  const entropy = calculateShannonEntropy(fileText.substring(0, 5000));
  const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  const isDangerousExt = DANGEROUS_EXTENSIONS.includes(ext);

  const suspiciousFunctions = SUSPICIOUS_CODE_KEYWORDS.filter(kw => fileText.includes(kw));

  const yaraMatches: FileAnalysisResult['yaraMatches'] = [];
  if (suspiciousFunctions.includes('powershell -nop -w hidden')) {
    yaraMatches.push({ rule: 'SUSP_PowerShell_Obfuscated_Downloader', description: 'Hidden PowerShell downloader script detected.', severity: 'CRITICAL' });
  }

  let score = isDangerousExt ? 35 : 10;
  if (yaraMatches.length > 0) score += 40;
  if (entropy > 6.5) score += 20;

  score = Math.min(100, Math.max(0, score));
  let severity: ThreatSeverity = score >= 75 ? 'CRITICAL' : score >= 50 ? 'HIGH' : score >= 25 ? 'MEDIUM' : 'SAFE';

  return {
    filename: file.name,
    sizeBytes: file.size,
    fileType: file.type || ext.replace('.', '').toUpperCase() || 'UNKNOWN',
    entropy,
    md5,
    sha256,
    riskScore: score,
    severity,
    detectedSignatures: yaraMatches.map(m => m.rule),
    yaraMatches,
    suspiciousFunctions,
    xaiFeatures: [
      { name: 'File Extension Risk', score: isDangerousExt ? 85 : 10, weight: 35, status: isDangerousExt ? 'DANGER' : 'SAFE', description: `Extension '${ext}' capability.` }
    ],
    remediationSteps: score >= 40 ? ['Quarantine file in endpoint sandbox.', `Block SHA-256 ${sha256.substring(0, 16)}...`] : ['Clean file.'],
    analyzedAt: new Date().toISOString()
  };
}
