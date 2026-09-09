import React from 'react';
import { ShieldCheck, AlertTriangle, XCircle, HelpCircle, CheckCircle2, AlertOctagon } from 'lucide-react';
import { PushReadinessStatus, RiskLevel } from '../types/review';

interface PushReadinessCardProps {
  status: PushReadinessStatus;
  riskLevel: RiskLevel;
  summary: string;
  blockingCount: number;
  warningCount: number;
  passedChecksCount: number;
  missingTestsCount: number;
  durationMs: number;
  model: string;
}

export const PushReadinessCard: React.FC<PushReadinessCardProps> = ({
  status,
  riskLevel,
  summary,
  blockingCount,
  warningCount,
  passedChecksCount,
  missingTestsCount,
  durationMs,
  model
}) => {
  const getVerdictDetails = () => {
    switch (status) {
      case 'READY':
        return {
          title: 'READY TO PUSH',
          subtitle: 'All deterministic quality gates, security baselines, and tests passed cleanly.',
          badgeClass: 'badge-ready',
          icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
          borderGlow: 'border-emerald-500/50 shadow-emerald-500/20 shadow-xl'
        };
      case 'MINOR_FIXES_REQUIRED':
        return {
          title: 'MINOR FIXES REQUIRED',
          subtitle: 'Non-blocking recommendations or missing test scenarios were identified.',
          badgeClass: 'badge-warning',
          icon: <AlertTriangle className="w-8 h-8 text-amber-400" />,
          borderGlow: 'border-amber-500/50 shadow-amber-500/20 shadow-xl'
        };
      case 'DO_NOT_PUSH':
        return {
          title: 'DO NOT PUSH — GATE BLOCKED',
          subtitle: 'Critical security vulnerability, policy violation, or failed mandatory criterion detected.',
          badgeClass: 'badge-danger',
          icon: <XCircle className="w-8 h-8 text-rose-500" />,
          borderGlow: 'border-rose-500/60 shadow-rose-500/25 shadow-2xl'
        };
      case 'LIMITED_REVIEW':
      default:
        return {
          title: 'LIMITED REVIEW',
          subtitle: 'Review ran with partial context or missing acceptance criteria.',
          badgeClass: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
          icon: <HelpCircle className="w-8 h-8 text-blue-400" />,
          borderGlow: 'border-blue-500/30'
        };
    }
  };

  const verdict = getVerdictDetails();

  const getRiskBadge = () => {
    switch (riskLevel) {
      case 'LOW':
        return <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/30">LOW RISK</span>;
      case 'MEDIUM':
        return <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/30">MEDIUM RISK</span>;
      case 'HIGH':
        return <span className="text-xs px-2.5 py-1 rounded-full bg-orange-500/15 text-orange-400 font-semibold border border-orange-500/40">HIGH RISK</span>;
      case 'CRITICAL':
        return <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 font-bold border border-rose-500/50 animate-pulse">CRITICAL RISK</span>;
      default:
        return <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400">UNKNOWN</span>;
    }
  };

  return (
    <div className={`glass-panel p-6 border ${verdict.borderGlow} transition-all duration-300`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            {verdict.icon}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-extrabold tracking-tight text-white">{verdict.title}</h2>
              {getRiskBadge()}
            </div>
            <p className="text-xs text-slate-300 mt-1">{verdict.subtitle}</p>
          </div>
        </div>

        {/* Execution Metadata */}
        <div className="flex flex-col md:items-end text-xs text-slate-400 space-y-1">
          <div>Evaluated by: <span className="text-indigo-300 font-medium">{model}</span></div>
          <div>Execution time: <span className="text-slate-200 font-medium">{(durationMs / 1000).toFixed(2)}s</span></div>
        </div>
      </div>

      {/* Summary Narrative */}
      <div className="my-4 p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-200 leading-relaxed font-sans">
        <span className="font-semibold text-indigo-400 mr-2">Orchestrator Summary:</span>
        {summary}
      </div>

      {/* Metrics Counter Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className={`p-3 rounded-xl border ${blockingCount > 0 ? 'bg-rose-950/30 border-rose-800/60 text-rose-300' : 'bg-slate-900/50 border-slate-800 text-slate-400'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Blocking Issues</span>
            <AlertOctagon className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold mt-1 text-white">{blockingCount}</p>
        </div>

        <div className={`p-3 rounded-xl border ${warningCount > 0 ? 'bg-amber-950/25 border-amber-800/50 text-amber-300' : 'bg-slate-900/50 border-slate-800 text-slate-400'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Warnings</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold mt-1 text-white">{warningCount}</p>
        </div>

        <div className="p-3 rounded-xl border bg-slate-900/50 border-slate-800 text-emerald-400">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">Passed Checks</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold mt-1 text-white">{passedChecksCount}</p>
        </div>

        <div className={`p-3 rounded-xl border ${missingTestsCount > 0 ? 'bg-indigo-950/30 border-indigo-800/60 text-indigo-300' : 'bg-slate-900/50 border-slate-800 text-slate-400'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Missing Tests</span>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold mt-1 text-white">{missingTestsCount}</p>
        </div>
      </div>
    </div>
  );
};
