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

export interface VulnerabilityItem {
  id: string;
  title: string;
  cveId: string;
  cvssScore: number;
  severity: ThreatSeverity;
  owaspCategory: string;
  affectedVector: string;
  description: string;
  pocPayload: string;
  remediationCode: string;
}

export interface AppSecurityScanResult {
  appName: string;
  appType: 'WEB_APP' | 'MOBILE_ANDROID_APK' | 'MOBILE_IOS_IPA';
  targetIdentifier: string; // URL or Package ID e.g. com.bank.mobile
  riskScore: number;
  severity: ThreatSeverity;
  vulnerabilities: VulnerabilityItem[];
  permissionsChecked?: { permission: string; risk: 'HIGH' | 'MEDIUM' | 'LOW'; description: string }[];
  securityHeaders?: { header: string; status: 'PASS' | 'FAIL'; recommendation: string }[];
  hardcodedSecrets?: { secretType: string; snippet: string; severity: ThreatSeverity }[];
  xaiFeatures: XAiFeature[];
  remediationSteps: string[];
  analyzedAt: string;
}

export interface PhishingReportData {
  reportType: 'INTERNAL' | 'EXTERNAL';
  title: string;
  period: string;
  totalCampaigns: number;
  totalTargetUsers: number;
  clickedPhishingRatio: number;
  submittedCredentialsRatio: number;
  departmentBreakdown: { dept: string; clickRate: number; riskLevel: ThreatSeverity }[];
  externalTakedowns?: { domain: string; registrar: string; status: 'ACTIVE' | 'TAKEDOWN_REQUESTED' | 'REMOVED'; ip: string }[];
  topTemplates: { templateName: string; successRate: number; riskCategory: string }[];
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
