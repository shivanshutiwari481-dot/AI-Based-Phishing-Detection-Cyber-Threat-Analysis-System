import React, { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';

export const TyposquatGenerator: React.FC = () => {
  const [brand, setBrand] = useState('paypal');
  const [results, setResults] = useState<string[]>([]);

  const handleGenerate = () => {
    const cleanBrand = brand.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!cleanBrand) return;

    setResults([
      `${cleanBrand}-security-update.com`,
      `${cleanBrand}-verify-account.top`,
      `${cleanBrand.replace(/o/g, '0')}.xyz`,
      `login-${cleanBrand}-auth.net`
    ]);
  };

  return (
    <div className="glass-panel rounded-xl p-6 space-y-4 font-mono text-xs">
      <div className="flex items-center space-x-2">
        <Sparkles className="w-5 h-5 text-amber-400" />
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
          BRAND TYPOSQUATTING & HOMOGLYPH VECTOR GENERATOR
        </h3>
      </div>

      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="e.g. paypal, google"
          className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-cyan-200 outline-none"
        />
        <button onClick={handleGenerate} className="px-4 py-2 bg-slate-800 text-slate-200 rounded-lg">
          GENERATE LOOKALIKES
        </button>
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          {results.map((domain, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded border border-slate-800">
              <code className="text-pink-300">{domain}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
