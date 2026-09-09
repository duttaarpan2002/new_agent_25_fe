import * as vscode from 'vscode';
import { ReviewWebviewProvider } from './ReviewWebviewProvider';
import { DiagnosticsManager } from './DiagnosticsManager';

export function activate(context: vscode.ExtensionContext) {
  console.log('AI Code Review Agent extension activated.');

  const diagnosticsManager = new DiagnosticsManager();
  const provider = new ReviewWebviewProvider(context.extensionUri, diagnosticsManager);

  // Register Webview Provider
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(ReviewWebviewProvider.viewType, provider)
  );

  // Register "Review Before Push" Command
  const reviewCmd = vscode.commands.registerCommand('ai-code-review.reviewBeforePush', async () => {
    vscode.commands.executeCommand('workbench.view.extension.ai-code-review-explorer');
    await provider.executeReview();
  });

  // Register Clear Diagnostics Command
  const clearCmd = vscode.commands.registerCommand('ai-code-review.clearDiagnostics', () => {
    diagnosticsManager.clear();
    vscode.window.showInformationMessage('AI Code Review issues cleared.');
  });

  context.subscriptions.push(reviewCmd, clearCmd);
}

export function deactivate() {}
