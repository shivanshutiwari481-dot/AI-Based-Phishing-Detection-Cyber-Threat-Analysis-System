import React, { useState } from 'react';
import { Header } from './components/Header';
import { ThreatRadar } from './components/ThreatRadar';
import { UrlScanner } from './components/UrlScanner';
import { EmailScanner } from './components/EmailScanner';
import { AppVectorScanner } from './components/AppVectorScanner';
import { VulnerabilityScanner } from './components/VulnerabilityScanner';
import { PhishingReportHub } from './components/PhishingReportHub';
import { FileScanner } from './components/FileScanner';
import { MitreMatrix } from './components/MitreMatrix';
import { BatchScanner } from './components/BatchScanner';
import { TyposquatGenerator } from './components/TyposquatGenerator';
import { ReportModal } from './components/ReportModal';
import { GitHubFooter } from './components/GitHubFooter';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('radar');
  const [selectedUrlForScan, setSelectedUrlForScan] = useState<string>('');
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  const handleSelectSampleUrl = (url: string) => {
    setSelectedUrlForScan(url);
    setActiveTab('url');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b12] text-slate-100 selection:bg-cyan-500 selection:text-black">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openReportModal={() => setIsReportOpen(true)}
        threatCount={18}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {activeTab === 'radar' && (
          <>
            <ThreatRadar onSelectSampleUrl={handleSelectSampleUrl} />
            <TyposquatGenerator />
          </>
        )}

        {activeTab === 'url' && (
          <UrlScanner initialUrl={selectedUrlForScan} />
        )}

        {activeTab === 'email' && (
          <EmailScanner />
        )}

        {activeTab === 'app_vector' && (
          <AppVectorScanner />
        )}

        {activeTab === 'vuln' && (
          <VulnerabilityScanner />
        )}

        {activeTab === 'phish_reports' && (
          <PhishingReportHub />
        )}

        {activeTab === 'file' && (
          <FileScanner />
        )}

        {activeTab === 'mitre' && (
          <MitreMatrix />
        )}

        {activeTab === 'batch' && (
          <BatchScanner />
        )}
      </main>

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

      <GitHubFooter />
    </div>
  );
};

export default App;
