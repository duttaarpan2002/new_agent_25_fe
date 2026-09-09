"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const ReviewWebviewProvider_1 = require("./ReviewWebviewProvider");
const DiagnosticsManager_1 = require("./DiagnosticsManager");
function activate(context) {
    console.log('AI Code Review Agent extension activated.');
    const diagnosticsManager = new DiagnosticsManager_1.DiagnosticsManager();
    const provider = new ReviewWebviewProvider_1.ReviewWebviewProvider(context.extensionUri, diagnosticsManager);
    // Register Webview Provider
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(ReviewWebviewProvider_1.ReviewWebviewProvider.viewType, provider));
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
function deactivate() { }
//# sourceMappingURL=extension.js.map