import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ReviewControls } from './components/ReviewControls';
import { PushReadinessCard } from './components/PushReadinessCard';
import { IssuesList } from './components/IssuesList';
import { MissingTestsSection } from './components/MissingTestsSection';
import { DiffViewer } from './components/DiffViewer';
import { StandardsModal } from './components/StandardsModal';

import { ConfigModal } from './components/ConfigModal';
import { ReviewResult, ServerConfig } from './types/review';
import { runReview, fetchStandards, fetchServerConfig } from './services/api';
import { LayoutDashboard, FileCode, TestTube, History, BookOpen } from 'lucide-react';

export const App: React.FC = () => {
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
  const [currentDiff, setCurrentDiff] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'tests' | 'diff'>('overview');
  const [standards, setStandards] = useState<any[]>([]);
  const [config, setConfig] = useState<ServerConfig | null>(null);
  const [isStandardsOpen, setIsStandardsOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  useEffect(() => {
    // Load initial configuration and standards
    fetchServerConfig().then(setConfig).catch(console.error);
    fetchStandards().then(setStandards).catch(console.error);
  }, []);

  const handleRunReview = async (criteria: string, diff: string, language: string, framework: string) => {
    setIsLoading(true);
    setCurrentDiff(diff);
    try {
      const result = await runReview({
        git_diff: diff,
        acceptance_criteria: criteria,
        language,
        framework,
        repository_name: 'enterprise-workspace',
        branch: 'feature/pre-push-gate'
      });
      setReviewResult(result);
      setActiveTab('overview');
    } catch (err: any) {
      alert(`Review Failed: ${err.message || err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <Header
        config={config}
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenStandards={() => setIsStandardsOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Review Trigger Controls */}
        <ReviewControls onRunReview={handleRunReview} isLoading={isLoading} />

        {/* Results Section */}
        {reviewResult && (
          <div className="space-y-6">
            {/* Top Push Readiness Verdict */}
            <PushReadinessCard
              status={reviewResult.pushReadiness}
              riskLevel={reviewResult.riskLevel}
              summary={reviewResult.summary}
              blockingCount={reviewResult.blockingIssues}
              warningCount={reviewResult.warningIssues}
              passedChecksCount={reviewResult.passedChecksCount}
              missingTestsCount={reviewResult.missingTestsCount}
              durationMs={reviewResult.reviewMetadata?.durationMs || 0}
              model={reviewResult.reviewMetadata?.model || 'LLM Agent'}
            />

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`text-xs px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Review Overview & Findings ({reviewResult.issues.length})
              </button>

              <button
                onClick={() => setActiveTab('tests')}
                className={`text-xs px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                  activeTab === 'tests'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <TestTube className="w-4 h-4" />
                Missing Tests & Edge Cases ({reviewResult.missingTests.length})
              </button>

              <button
                onClick={() => setActiveTab('diff')}
                className={`text-xs px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                  activeTab === 'diff'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <FileCode className="w-4 h-4" />
                Visual Diff Inspector
              </button>
            </div>

            {/* Tab Views */}
            {activeTab === 'overview' && (
              <IssuesList issues={reviewResult.issues} />
            )}

            {activeTab === 'tests' && (
              <MissingTestsSection missingTests={reviewResult.missingTests} />
            )}

            {activeTab === 'diff' && (
              <DiffViewer diffText={currentDiff} issues={reviewResult.issues} />
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <StandardsModal
        isOpen={isStandardsOpen}
        onClose={() => setIsStandardsOpen(false)}
        standards={standards}
      />

      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={config}
        onConfigUpdated={(newCfg) => setConfig(newCfg)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        AI Code Review Agent — Enterprise Pre-Push Gatekeeper & Advisory Engine (Python Flask + React + MySQL)
      </footer>
    </div>
  );
};
