import React, { useState } from 'react';
import { TestTube2, Copy, Check, Target, AlertCircle } from 'lucide-react';
import { MissingTest } from '../types/review';

interface MissingTestsSectionProps {
  missingTests: MissingTest[];
}

export const MissingTestsSection: React.FC<MissingTestsSectionProps> = ({ missingTests }) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedId(idx);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getScenarioTypeBadge = (type: string) => {
    switch (type) {
      case 'negative_path':
        return <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">NEGATIVE PATH</span>;
      case 'edge_case':
        return <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">EDGE CASE</span>;
      case 'regression':
        return <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">REGRESSION</span>;
      case 'happy_path':
      default:
        return <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">HAPPY PATH</span>;
    }
  };

  return (
    <div className="glass-panel p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <TestTube2 className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-semibold text-white">Missing Tests & Edge Cases</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
            {missingTests.length} scenarios
          </span>
        </div>
      </div>

      {missingTests.length === 0 ? (
        <div className="py-8 text-center text-slate-400 space-y-2">
          <TestTube2 className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm">All essential test scenarios and edge cases were observed in the diff!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {missingTests.map((test, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  {getScenarioTypeBadge(test.scenario_type)}
                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                    <Target className="w-3 h-3 text-indigo-400" />
                    <span className="truncate max-w-[200px]" title={test.target_file}>
                      {test.target_file.split('/').pop()}
                    </span>
                  </div>
                </div>

                <p className="text-xs font-medium text-slate-200">{test.description}</p>
              </div>

              {test.suggested_test_code && (
                <div className="relative group rounded-lg bg-slate-950 border border-slate-900 p-2.5 text-[11px] font-mono text-indigo-200">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span>// Suggested Test Method:</span>
                    <button
                      onClick={() => handleCopyCode(test.suggested_test_code!, idx)}
                      className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                      title="Copy test code"
                    >
                      {copiedId === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span className="text-[10px]">{copiedId === idx ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="overflow-x-auto whitespace-pre-wrap">{test.suggested_test_code}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
