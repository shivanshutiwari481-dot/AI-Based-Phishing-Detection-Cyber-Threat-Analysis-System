import React, { useEffect, useState } from 'react';
import { ThreatFeedEvent } from '../types/threat';
import { Shield, Radio, Activity, ExternalLink, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const INITIAL_EVENTS: ThreatFeedEvent[] = [
  {
    id: 'evt-101',
    timestamp: 'Just now',
    sourceIp: '185.220.101.4',
    targetRegion: 'US-East (Financial Sector)',
    threatType: 'Phishing Campaign',
    severity: 'CRITICAL',
    description: 'Credential harvesting kit mimicking Office365 OAuth flow detected.',
    targetDomain: 'login-office365-verify-sec.com',
    mitreId: 'T1566.002'
  },
  {
    id: 'evt-102',
    timestamp: '2 mins ago',
    sourceIp: '45.154.255.89',
    targetRegion: 'EU-Central (Logistics)',
    threatType: 'Ransomware Vector',
    severity: 'HIGH',
    description: 'LockBit 3.0 loader payload distributed via deceptive PDF macro.',
    targetDomain: 'invoice-tracking-2026.xyz',
    mitreId: 'T1204.002'
  },
  {
    id: 'evt-103',
    timestamp: '5 mins ago',
    sourceIp: '194.26.29.112',
    targetRegion: 'APAC (Healthcare)',
    threatType: 'C2 Callback',
    severity: 'CRITICAL',
    description: 'Cobalt Strike DNS beaconing over port 443 detected from endpoint host.',
    targetDomain: 'update-cdn-service.top',
    mitreId: 'T1071.004'
  }
];

const RADAR_DATA = [
  { subject: 'Phishing Defense', A: 85, fullMark: 100 },
  { subject: 'Email Gateway', A: 92, fullMark: 100 },
  { subject: 'URL Reputation', A: 78, fullMark: 100 },
  { subject: 'Endpoint YARA', A: 88, fullMark: 100 },
  { subject: 'XAI Confidence', A: 95, fullMark: 100 },
  { subject: 'DNS Filter', A: 90, fullMark: 100 },
];

export const ThreatRadar: React.FC<{ onSelectSampleUrl: (url: string) => void }> = ({ onSelectSampleUrl }) => {
  const [events, setEvents] = useState<ThreatFeedEvent[]>(INITIAL_EVENTS);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const randomIp = `${Math.floor(Math.random() * 200) + 20}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      const threatTypes: ThreatFeedEvent['threatType'][] = ['Phishing Campaign', 'Ransomware Vector', 'C2 Callback', 'DNS Spoofing'];
      const randomType = threatTypes[Math.floor(Math.random() * threatTypes.length)];
      const domains = ['verify-paypal-login.top', 'g00gle-account-security.xyz', 'microsoft-auth-portal.com', 'secure-bank-update.info'];
      const chosenDomain = domains[Math.floor(Math.random() * domains.length)];

      const newEvt: ThreatFeedEvent = {
        id: `evt-${Date.now()}`,
        timestamp: 'Just now',
        sourceIp: randomIp,
        targetRegion: ['US-East', 'EU-West', 'APAC', 'SA-East'][Math.floor(Math.random() * 4)],
        threatType: randomType,
        severity: Math.random() > 0.5 ? 'CRITICAL' : 'HIGH',
        description: `Live AI anomaly trigger detected on vector ${chosenDomain}`,
        targetDomain: chosenDomain,
        mitreId: 'T1566'
      };

      setEvents(prev => [newEvt, ...prev.slice(0, 7)]);
    }, 6000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel-glow rounded-xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
              <h2 className="text-lg font-mono font-bold text-slate-100 tracking-wide">
                GLOBAL THREAT RADAR & CTI STREAM
              </h2>
            </div>
            <button
              onClick={() => setIsLive(!isLive)}
              className={`px-3 py-1 text-xs font-mono rounded-full border transition-all ${
                isLive ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {isLive ? '● LIVE INTELLIGENCE FEED' : 'PAUSED'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="relative flex items-center justify-center p-4">
              <div className="w-56 h-56 rounded-full border border-cyan-500/30 flex items-center justify-center relative shadow-lg shadow-cyan-500/10">
                <div className="w-40 h-40 rounded-full border border-cyan-500/20 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border border-cyan-500/20 flex items-center justify-center">
                    <Shield className="w-10 h-10 text-cyan-400 animate-pulse" />
                  </div>
                </div>
                <div className="absolute inset-0 rounded-full border-t border-cyan-400/80 animate-radar-sweep pointer-events-none"></div>
                <div className="absolute top-10 right-12 w-3 h-3 rounded-full bg-pink-500 animate-ping"></div>
                <div className="absolute bottom-12 left-10 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></div>
              </div>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-400">Total Scanned Indicators:</div>
                <div className="text-2xl font-bold text-cyan-300">142,890 IOCs</div>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-400">SQLite Database Integration:</div>
                <div className="text-2xl font-bold text-emerald-400">ONLINE (cyber_threats.db)</div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-mono font-bold text-cyan-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              SYSTEM DEFENSE POSTURE
            </h3>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              OPTIMAL
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={RADAR_DATA}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#334155" />
                <Radar name="Aegis AI" dataKey="A" stroke="#00f3ff" fill="#00f3ff" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-pink-400" />
            <h3 className="text-sm font-mono font-bold text-slate-200">
              REAL-TIME THREAT INTEL INCIDENT FEED
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="p-4 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs"
            >
              <div className="flex items-start space-x-3">
                <span className={`mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold border ${
                  evt.severity === 'CRITICAL' ? 'bg-pink-950 text-pink-300 border-pink-500/40' : 'bg-amber-950 text-amber-300 border-amber-500/40'
                }`}>
                  {evt.severity}
                </span>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-cyan-300 font-bold">{evt.threatType}</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-400">IP: {evt.sourceIp}</span>
                  </div>
                  <p className="text-slate-300 mt-1">{evt.description}</p>
                </div>
              </div>

              <button
                onClick={() => onSelectSampleUrl(evt.targetDomain)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900/60 transition-all shrink-0"
              >
                <span>Analyze Vector</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
