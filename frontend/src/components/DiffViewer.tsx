import React, { useState } from 'react';
import { FileCode, AlertCircle, ChevronDown, ChevronRight, CheckCircle } from 'lucide-react';
import { GroundedIssue } from '../types/review';

interface DiffViewerProps {
  diffText: string;
  issues: GroundedIssue[];
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ diffText, issues }) => {
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);

  if (!diffText || !diffText.trim()) {
    return (
      <div className="glass-panel p-8 text-center text-slate-400 space-y-2">
        <FileCode className="w-8 h-8 text-slate-600 mx-auto" />
        <p className="text-sm">No Git diff available for visual review.</p>
      </div>
    );
  }

  // Parse diff blocks by file
  const fileBlocks = diffText.split(/(?=^diff --git )/m).filter(b => b.trim());

  return (
    <div className="glass-panel overflow-hidden">
      {/* Diff Header / File Tab Switcher */}
      <div className="flex items-center gap-2 p-3 bg-slate-900/90 border-b border-slate-800 overflow-x-auto">
        <FileCode className="w-4 h-4 text-indigo-400 shrink-0" />
        <span className="text-xs font-semibold text-slate-300 mr-2 shrink-0">Modified Files:</span>
        <div className="flex items-center gap-1.5">
          {fileBlocks.map((block, idx) => {
            const firstLines = block.split('\n').slice(0, 5).join(' ');
            const match = firstLines.match(/diff --git a\/(.*?)\s+b\/(.*)/);
            const fileName = match ? match[2] : `File ${idx + 1}`;
            
            const fileIssues = issues.filter(i => i.file.includes(fileName) || fileName.includes(i.file));

            return (
              <button
                key={idx}
                onClick={() => setActiveFileIndex(idx)}
                className={`text-xs px-3 py-1.5 rounded-lg font-mono flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  activeFileIndex === idx
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{fileName.split('/').pop()}</span>
                {fileIssues.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500/80 text-white font-bold">
                    {fileIssues.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Code Diff Display */}
      <div className="p-4 bg-slate-950 font-mono text-xs overflow-x-auto max-h-[600px] overflow-y-auto space-y-0.5">
        {fileBlocks[activeFileIndex]?.split('\n').map((line, lIdx) => {
          let lineClass = 'text-slate-400 pl-4';
          let prefix = ' ';

          if (line.startsWith('+') && !line.startsWith('+++')) {
            lineClass = 'diff-added pl-4 font-medium';
            prefix = '+';
          } else if (line.startsWith('-') && !line.startsWith('---')) {
            lineClass = 'diff-deleted pl-4';
            prefix = '-';
          } else if (line.startsWith('@@')) {
            lineClass = 'diff-header py-1 px-3 my-1 rounded text-indigo-300 font-semibold';
          }

          return (
            <div key={lIdx} className={`flex items-start py-0.5 ${lineClass}`}>
              <span className="w-8 select-none text-slate-600 text-[10px] shrink-0 text-right pr-3">
                {lIdx + 1}
              </span>
              <span className="whitespace-pre">{line}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
