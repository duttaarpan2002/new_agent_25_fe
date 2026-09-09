import React from 'react';
import { ShieldCheck, Cpu, Database, Settings, GitPullRequest } from 'lucide-react';
import { ServerConfig } from '../types/review';

interface HeaderProps {
  config: ServerConfig | null;
  onOpenConfig: () => void;
  onOpenStandards: () => void;
}

export const Header: React.FC<HeaderProps> = ({ config, onOpenConfig, onOpenStandards }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/25">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">AI Code Review Agent</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium border border-indigo-500/30">
              Pre-Push Gatekeeper
            </span>
          </div>
          <p className="text-xs text-slate-400">Enterprise deterministic quality gates & grounded LLM reasoning</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Active LLM Mode Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/70 text-xs">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <span className="text-slate-400">LLM Mode:</span>
          <span className="font-semibold text-white">
            {config?.mode === 'Gemini' ? `Gemini (${config?.gemini_model})` : `Mistral (${config?.mistral_model || 'Local'})`}
          </span>
        </div>

        {/* Database Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/70 text-xs">
          <Database className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400">Database:</span>
          <span className="font-semibold text-emerald-400">
            {config?.is_sqlite_fallback ? 'SQLite (Local Cache)' : `MySQL (${config?.mysql_host || '187.127.163.17'})`}
          </span>
        </div>

        {/* Standards button */}
        <button
          onClick={onOpenStandards}
          className="btn-secondary text-xs"
        >
          <GitPullRequest className="w-3.5 h-3.5 text-indigo-400" />
          Coding Standards RAG
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenConfig}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          title="Configure LLM & System Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
