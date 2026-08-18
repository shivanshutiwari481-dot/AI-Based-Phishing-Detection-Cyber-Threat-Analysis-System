export type ThreatSeverity = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface XAiFeature {
  name: string;
  score: number;
  weight: number;
  status: 'SAFE' | 'WARNING' | 'DANGER';
  description: string;
}

export interface UrlAnalysisResult {
  url: string;
  domain: string;
  score: number;
  severity: ThreatSeverity;
  isPhishing: boolean;
  classification: string;
  entropy: number;
  domainAgeDays: number;
  sslValid: boolean;
  hasSuspiciousTld: boolean;
  isIpHostname: boolean;
  hasHomoglyph: boolean;
  detectedBrand?: string;
  mitreTechniques: { id: string; name: string; description: string }[];
  xaiFeatures: XAiFeature[];
  remediationSteps: string[];
  analyzedAt: string;
}

export interface EmailAnalysisResult {
  subject: string;
  sender: string;
  returnPath: string;
  spfStatus: 'PASS' | 'FAIL' | 'NEUTRAL';
  dkimStatus: 'PASS' | 'FAIL' | 'NEUTRAL';
  dmarcStatus: 'PASS' | 'FAIL' | 'NEUTRAL';
  spoofedSender: boolean;
  urgentKeywordsFound: string[];
  financialTriggersFound: string[];
  credentialHarvestingFlags: string[];
  extractedLinks: { url: string; isMalicious: boolean }[];
  overallScore: number;
  severity: ThreatSeverity;
  intentCategory: 'Credential Harvesting' | 'Business Email Compromise (BEC)' | 'Financial Fraud' | 'Malware Delivery' | 'Legitimate Email';
  xaiFeatures: XAiFeature[];
  remediationSteps: string[];
  analyzedAt: string;
}

export interface FileAnalysisResult {
  filename: string;
  sizeBytes: number;
  fileType: string;
  entropy: number;
  md5: string;
  sha256: string;
  riskScore: number;
  severity: ThreatSeverity;
  detectedSignatures: string[];
  yaraMatches: { rule: string; description: string; severity: ThreatSeverity }[];
  suspiciousFunctions: string[];
  xaiFeatures: XAiFeature[];
  remediationSteps: string[];
  analyzedAt: string;
}

export interface IocBatchResult {
  id: string;
  ioc: string;
  type: 'URL' | 'IP' | 'HASH' | 'DOMAIN';
  score: number;
  severity: ThreatSeverity;
  category: string;
  source: string;
}

export interface ThreatFeedEvent {
  id: string;
  timestamp: string;
  sourceIp: string;
  targetRegion: string;
  threatType: 'Phishing Campaign' | 'Ransomware Vector' | 'Credential Dump' | 'C2 Callback' | 'DNS Spoofing';
  severity: ThreatSeverity;
  description: string;
  targetDomain: string;
  mitreId: string;
}
