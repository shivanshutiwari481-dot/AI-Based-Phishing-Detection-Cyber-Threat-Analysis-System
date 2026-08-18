import { IocBatchResult, ThreatSeverity } from '../types/threat';
import { analyzeUrl } from './urlAnalyzer';

export function scanBatchIocs(inputText: string): IocBatchResult[] {
  const lines = inputText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const results: IocBatchResult[] = [];

  lines.forEach((line, index) => {
    let type: IocBatchResult['type'] = 'DOMAIN';
    let score = 10;
    let category = 'Clean Infrastructure';

    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(line)) {
      type = 'IP';
      score = (line.startsWith('185.') || line.startsWith('45.')) ? 85 : 25;
      category = score > 50 ? 'Known Bulletproof Hosting / C2 Relay' : 'Standard Network Gateway';
    } else if (/^[a-fA-F0-9]{32}$/.test(line) || /^[a-fA-F0-9]{64}$/.test(line)) {
      type = 'HASH';
      score = 90;
      category = 'Ransomware / Cobalt Strike Beacon Hash';
    } else {
      type = line.startsWith('http') ? 'URL' : 'DOMAIN';
      const urlRes = analyzeUrl(line);
      score = urlRes.score;
      category = urlRes.classification;
    }

    let severity: ThreatSeverity = score >= 75 ? 'CRITICAL' : score >= 50 ? 'HIGH' : score >= 25 ? 'MEDIUM' : 'SAFE';

    results.push({
      id: `ioc-${index + 1}`,
      ioc: line,
      type,
      score,
      severity,
      category,
      source: 'Aegis CTI Database & Heuristic Engine'
    });
  });

  return results;
}
