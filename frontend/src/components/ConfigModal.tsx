import React, { useState, useEffect } from 'react';
import { X, Save, Cpu, Database, ShieldAlert, Check } from 'lucide-react';
import { ServerConfig } from '../types/review';
import { updateServerConfig } from '../services/api';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ServerConfig | null;
  onConfigUpdated: (newConfig: ServerConfig) => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose, config, onConfigUpdated }) => {
  if (!isOpen || !config) return null;

  const [mode, setMode] = useState(config.mode || 'Gemini');
  const [geminiModel, setGeminiModel] = useState(config.gemini_model || 'gemini-3.7-flash');
  const [mistralLocalUrl, setMistralLocalUrl] = useState(config.mistral_local_url || 'http://122.163.121.176:3041');
  const [strictGatekeeper, setStrictGatekeeper] = useState(config.strict_gatekeeper ?? true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateServerConfig({
        mode,
        gemini_model: geminiModel,
        mistral_local_url: mistralLocalUrl,
        strict_gatekeeper: strictGatekeeper
      });
      onConfigUpdated({
        ...config,
        mode,
        gemini_model: geminiModel,
        mistral_local_url: mistralLocalUrl,
        strict_gatekeeper: strictGatekeeper
      });
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1000);
    } catch (e) {
      alert('Failed to update config: ' + e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg overflow-hidden shadow-2xl border-slate-700">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">System & LLM Settings</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* LLM Mode Selector */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">LLM Engine Provider</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode('Gemini')}
                className={`p-3 rounded-lg border text-left font-medium transition-all ${
                  mode === 'Gemini'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-slate-200">Google Gemini</div>
                <div className="text-[11px] text-slate-400 mt-0.5">gemini-3.7-flash (Cloud)</div>
              </button>

              <button
                type="button"
                onClick={() => setMode('Mistral')}
                className={`p-3 rounded-lg border text-left font-medium transition-all ${
                  mode === 'Mistral'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-slate-200">Mistral AI</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Local vLLM / Cloud API</div>
              </button>
            </div>
          </div>

          {mode === 'Gemini' ? (
            <div className="space-y-1">
              <label className="font-medium text-slate-300">Gemini Model Name</label>
              <input
                type="text"
                value={geminiModel}
                onChange={(e) => setGeminiModel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          ) : (
            <div className="space-y-1">
              <label className="font-medium text-slate-300">Mistral Local Endpoint URL</label>
              <input
                type="text"
                value={mistralLocalUrl}
                onChange={(e) => setMistralLocalUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          )}

          {/* MySQL Database Info (Read-Only) */}
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-300">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              MySQL Persistence Server
            </div>
            <div className="text-[11px] text-slate-400 font-mono space-y-0.5">
              <div>Host: {config.mysql_host}:{config.mysql_port}</div>
              <div>User: {config.mysql_user} | Database: {config.mysql_database}</div>
            </div>
          </div>

          {/* Strict Gatekeeper Switch */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/90 border border-slate-800">
            <div>
              <div className="font-semibold text-slate-200">Deterministic Gatekeeper Mode</div>
              <div className="text-[11px] text-slate-400">Strictly block push on any critical security leak or unsatisfied AC</div>
            </div>
            <input
              type="checkbox"
              checked={strictGatekeeper}
              onChange={(e) => setStrictGatekeeper(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded"
            />
          </div>
        </div>

        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-end gap-2">
          <button onClick={onClose} className="btn-secondary text-xs">Cancel</button>
          <button onClick={handleSave} disabled={isSaving} className="btn-primary text-xs">
            {savedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
            {savedSuccess ? 'Saved!' : isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};
