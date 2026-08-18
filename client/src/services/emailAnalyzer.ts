import { EmailAnalysisResult, ThreatSeverity, XAiFeature } from '../types/threat';
import { analyzeUrl } from './urlAnalyzer';

const URGENCY_PATTERNS = ['urgent', 'action required', 'immediate response', 'account suspended', 'verify now', 'security alert'];
const FINANCIAL_PATTERNS = ['wire transfer', 'invoice overdue', 'swift code', 'direct deposit', 'bitcoin', 'bank account details'];
const CREDENTIAL_PATTERNS = ['click here to login', 're-enter your password', 'verify credentials', 'office 365 login'];

export function analyzeEmail(headersText: string, bodyText: string): EmailAnalysisResult {
  const fullText = (headersText + ' ' + bodyText).toLowerCase();

  const fromMatch = headersText.match(/From:\s*(.*?)(?:\r?\n|$)/i);
  const returnPathMatch = headersText.match(/Return-Path:\s*<?(.*?)>?(?:\r?\n|$)/i);
  const subjectMatch = headersText.match(/Subject:\s*(.*?)(?:\r?\n|$)/i);
  const spfMatch = headersText.match(/spf=(pass|fail|neutral|softfail)/i);
  const dkimMatch = headersText.match(/dkim=(pass|fail|neutral)/i);
  const dmarcMatch = headersText.match(/dmarc=(pass|fail|neutral)/i);

  const sender = fromMatch ? fromMatch[1].trim() : 'Unknown Sender';
  const returnPath = returnPathMatch ? returnPathMatch[1].trim() : 'Unknown Return Path';
  const subject = subjectMatch ? subjectMatch[1].trim() : 'No Subject';

  const spfStatus = (spfMatch ? spfMatch[1].toUpperCase() : 'FAIL') as 'PASS' | 'FAIL' | 'NEUTRAL';
  const dkimStatus = (dkimMatch ? dkimMatch[1].toUpperCase() : 'FAIL') as 'PASS' | 'FAIL' | 'NEUTRAL';
  const dmarcStatus = (dmarcMatch ? dmarcMatch[1].toUpperCase() : 'FAIL') as 'PASS' | 'FAIL' | 'NEUTRAL';

  const extractDomain = (str: string) => {
    const match = str.match(/@([a-zA-Z0-9.-]+)/);
    return match ? match[1].toLowerCase() : '';
  };

  const senderDomain = extractDomain(sender);
  const returnDomain = extractDomain(returnPath);
  const spoofedSender = senderDomain && returnDomain ? (senderDomain !== returnDomain) : true;

  const urgentKeywordsFound = URGENCY_PATTERNS.filter(p => fullText.includes(p));
  const financialTriggersFound = FINANCIAL_PATTERNS.filter(p => fullText.includes(p));
  const credentialHarvestingFlags = CREDENTIAL_PATTERNS.filter(p => fullText.includes(p));

  const urlRegex = /(https?:\/\/[^\s"'<>]+)/gi;
  const extractedUrls = bodyText.match(urlRegex) || [];
  const extractedLinks = extractedUrls.map(url => {
    const result = analyzeUrl(url);
    return { url, isMalicious: result.isPhishing || result.score > 40 };
  });

  const maliciousLinkCount = extractedLinks.filter(l => l.isMalicious).length;

  let score = 0;
  const xaiFeatures: XAiFeature[] = [];

  if (spfStatus === 'FAIL' || dkimStatus === 'FAIL' || dmarcStatus === 'FAIL' || spoofedSender) {
    score += 35;
    xaiFeatures.push({
      name: 'Email Header & Domain Spoofing',
      score: 90,
      weight: 35,
      status: 'DANGER',
      description: `Header alignment failed (SPF: ${spfStatus}, DKIM: ${dkimStatus}, DMARC: ${dmarcStatus}).`
    });
  }

  if (maliciousLinkCount > 0) {
    score += 35;
    xaiFeatures.push({
      name: 'Embedded Malicious Links',
      score: 95,
      weight: 35,
      status: 'DANGER',
      description: `Detected ${maliciousLinkCount} high-risk URLs in email body.`
    });
  }

  if (urgentKeywordsFound.length > 0) {
    score += 15;
    xaiFeatures.push({
      name: 'NLP Urgency & Psychological Coercion',
      score: 75,
      weight: 15,
      status: 'WARNING',
      description: `Found urgency keywords (${urgentKeywordsFound.join(', ')}).`
    });
  }

  score = Math.min(100, Math.max(0, score));
  let severity: ThreatSeverity = score >= 75 ? 'CRITICAL' : score >= 50 ? 'HIGH' : score >= 25 ? 'MEDIUM' : 'SAFE';

  let intentCategory: EmailAnalysisResult['intentCategory'] = 'Legitimate Email';
  if (financialTriggersFound.length > 0 && spoofedSender) {
    intentCategory = 'Business Email Compromise (BEC)';
  } else if (credentialHarvestingFlags.length > 0 || maliciousLinkCount > 0) {
    intentCategory = 'Credential Harvesting';
  } else if (financialTriggersFound.length > 0) {
    intentCategory = 'Financial Fraud';
  }

  return {
    subject,
    sender,
    returnPath,
    spfStatus,
    dkimStatus,
    dmarcStatus,
    spoofedSender,
    urgentKeywordsFound,
    financialTriggersFound,
    credentialHarvestingFlags,
    extractedLinks,
    overallScore: score,
    severity,
    intentCategory,
    xaiFeatures,
    remediationSteps: score >= 50 ? ['Quarantine email in Mail Gateway.', 'Add sender domain to blocklist.'] : ['Email verified clean.'],
    analyzedAt: new Date().toISOString()
  };
}
