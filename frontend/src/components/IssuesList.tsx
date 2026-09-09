import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Info, Check, Copy, FileText, ChevronRight, Lock, Wrench } from 'lucide-react';
import { GroundedIssue, Severity } from '../types/review';

interface IssuesListProps {
  issues: GroundedIssue[];
}

export const IssuesList: React.FC<IssuesListProps> = ({ issues }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['ALL', 'Security', 'Acceptance Criteria', 'Quality', 'Standards', 'Error Handling'];

  const filteredIssues = issues.filter(issue => {
    if (selectedCategory === 'ALL') return true;
    return issue.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleCopySuggestion = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getSeverityBadge = (sev: Severity, isBlocking?: boolean) => {
    switch (sev) {
      case 'CRITICAL':
        return <span className="text-[11px] px-2 py-0.5 rounded font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1"><Lock className="w-3 h-3" /> BLOCKING CRITICAL</span>;
      case 'ERROR':
        return <span className="text-[11px] px-2 py-0.5 rounded font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> ERROR</span>;
      case 'WARNING':
        return <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> WARNING</span>;
      case 'INFO':
      default:
        return <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-blue-500/15 text-blue-300 border border-blue-500/30 flex items-center gap-1"><Info className="w-3 h-3" /> INFO</span>;
    }
  };

  return (
    <div className="glass-panel p-5 space-y-4">
      {/* Header and Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-semibold text-white">Grounded Issues & Remediation Suggestions</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
            {filteredIssues.length} of {issues.length}
          </span>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Issues List */}
      {filteredIssues.length === 0 ? (
        <div className="py-12 text-center text-slate-400 space-y-2">
          <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm">No issues found in this category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredIssues.map((issue, idx) => {
            const issueKey = `${issue.file}-${issue.line}-${idx}`;
            return (
              <div
                key={issueKey}
                className={`p-4 rounded-xl border transition-all ${
                  issue.is_blocking || issue.severity === 'CRITICAL'
                    ? 'bg-rose-950/20 border-rose-900/60 hover:border-rose-700/80'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Issue Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(issue.severity, issue.is_blocking)}
                    <span className="text-xs font-semibold text-slate-300">{issue.category}</span>
                    {issue.rule_id && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {issue.rule_id}
                      </span>
                    )}
                  </div>

                  {/* File & Line Tag */}
                  <div className="flex items-center gap-1.5 text-xs font-mono text-indigo-300 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-800/40">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{issue.file}:{issue.line > 0 ? issue.line : 'file'}</span>
                  </div>
                </div>

                {/* Message */}
                <p className="text-xs font-medium text-slate-200 mt-2">{issue.message}</p>

                {/* Evidence Snippet */}
                {issue.evidence && (
                  <div className="mt-2.5 p-2.5 rounded bg-slate-950 border border-slate-900 text-[11px] font-mono text-slate-400 overflow-x-auto">
                    <span className="text-slate-500 select-none">// Observed evidence:</span>
                    <pre className="mt-1 text-slate-300">{issue.evidence}</pre>
                  </div>
                )}

                {/* Remediation Suggestion */}
                <div className="mt-3 p-3 rounded-lg bg-indigo-950/20 border border-indigo-900/40">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-semibold text-indigo-300 flex items-center gap-1">
                      <ChevronRight className="w-3.5 h-3.5" /> Recommended Remediation:
                    </span>
                    <button
                      onClick={() => handleCopySuggestion(issue.suggestion, issueKey)}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                      title="Copy suggestion"
                    >
                      {copiedId === issueKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedId === issueKey ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">{issue.suggestion}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
