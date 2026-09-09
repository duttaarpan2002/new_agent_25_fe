import React from 'react';
import { X, BookOpen, Check, Shield } from 'lucide-react';

interface StandardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  standards: any[];
}

export const StandardsModal: React.FC<StandardsModalProps> = ({ isOpen, onClose, standards }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border-slate-700">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Approved Coding Standards & RAG Catalog</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          <p className="text-xs text-slate-400">
            These enterprise standards are dynamically retrieved during review to ground agent recommendations:
          </p>

          <div className="space-y-3">
            {standards.map((std, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {std.rule_code}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-200">{std.title}</h4>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {std.language} / {std.framework}
                  </span>
                </div>

                <p className="text-xs text-slate-300">{std.description}</p>

                {std.good_example && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                    {std.bad_example && (
                      <div className="p-2 rounded bg-rose-950/20 border border-rose-900/40 text-rose-300">
                        <span className="text-rose-400 block mb-1 select-none font-sans font-semibold">❌ Non-Compliant:</span>
                        <pre className="overflow-x-auto">{std.bad_example}</pre>
                      </div>
                    )}
                    <div className="p-2 rounded bg-emerald-950/20 border border-emerald-900/40 text-emerald-300">
                      <span className="text-emerald-400 block mb-1 select-none font-sans font-semibold">✅ Approved Standard:</span>
                      <pre className="overflow-x-auto">{std.good_example}</pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
