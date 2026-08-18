const SUSPICIOUS_TLDS = ['.top', '.xyz', '.zip', '.mov', '.work', '.click', '.gq', '.tk', '.ml', '.cf', '.ga', '.fit', '.racing', '.cam', '.monster', '.biz'];
const TARGET_BRANDS = ['google', 'paypal', 'microsoft', 'apple', 'amazon', 'github', 'netflix', 'binance', 'coinbase', 'bankofamerica', 'chase', 'wellsfargo'];

export function calculateShannonEntropy(str) {
  if (!str) return 0;
  const len = str.length;
  const charFreq = {};
  for (let i = 0; i < len; i++) {
    const char = str[i];
    charFreq[char] = (charFreq[char] || 0) + 1;
  }
  let entropy = 0;
  for (const char in charFreq) {
    const p = charFreq[char] / len;
    entropy -= p * Math.log2(p);
  }
  return Number(entropy.toFixed(3));
}

export function detectHomoglyph(domain) {
  const normalized = domain.toLowerCase()
    .replace(/0/g, 'o')
    .replace(/1/g, 'l')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/8/g, 'b');

  for (const brand of TARGET_BRANDS) {
    if (normalized.includes(brand) && !domain.toLowerCase().endsWith(`${brand}.com`)) {
      return { hasHomoglyph: true, targetBrand: brand };
    }
  }
  return { hasHomoglyph: false };
}

export function analyzeUrlBackend(rawUrl) {
  let urlString = rawUrl.trim();
  if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
    urlString = 'https://' + urlString;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(urlString);
  } catch (e) {
    parsedUrl = new URL('https://' + rawUrl.replace(/[^a-zA-Z0-9.-]/g, ''));
  }

  const domain = parsedUrl.hostname.toLowerCase();
  const fullPath = parsedUrl.pathname + parsedUrl.search;
  const entropy = calculateShannonEntropy(domain + fullPath);
  const isHttps = parsedUrl.protocol === 'https:';

  const isIpHostname = /^(\d{1,3}\.){3}\d{1,3}$/.test(domain);
  const tldMatch = SUSPICIOUS_TLDS.find(tld => domain.endsWith(tld));
  const hasSuspiciousTld = !!tldMatch;
  const homoglyphResult = detectHomoglyph(domain);

  let score = 0;
  const xaiFeatures = [];

  if (homoglyphResult.hasHomoglyph) {
    score += 35;
    xaiFeatures.push({ name: 'Brand Impersonation / Homoglyph', score: 95, status: 'DANGER', description: `Impersonates brand ${homoglyphResult.targetBrand}` });
  }

  if (isIpHostname) {
    score += 30;
    xaiFeatures.push({ name: 'Raw IP Hostname', score: 90, status: 'DANGER', description: 'Direct IP usage bypassing DNS reputation filters.' });
  } else if (hasSuspiciousTld) {
    score += 25;
    xaiFeatures.push({ name: 'High-Risk TLD', score: 80, status: 'DANGER', description: `Domain uses suspicious TLD ${tldMatch}.` });
  }

  if (entropy > 4.2) {
    score += 20;
    xaiFeatures.push({ name: 'High Lexical Entropy', score: 75, status: 'WARNING', description: `Entropy is ${entropy} out of 8.0` });
  }

  if (!isHttps) {
    score += 15;
    xaiFeatures.push({ name: 'Unencrypted HTTP', score: 65, status: 'WARNING', description: 'No SSL encryption.' });
  }

  score = Math.min(100, Math.max(0, score));
  let severity = score >= 75 ? 'CRITICAL' : score >= 50 ? 'HIGH' : score >= 25 ? 'MEDIUM' : 'SAFE';

  return {
    url: rawUrl,
    domain,
    score,
    severity,
    isPhishing: score >= 50,
    classification: score >= 70 ? 'Malicious Phishing Portal' : score >= 40 ? 'Deceptive Site' : 'Legitimate URL',
    entropy,
    sslValid: isHttps,
    xaiFeatures,
    analyzedAt: new Date().toISOString()
  };
}
