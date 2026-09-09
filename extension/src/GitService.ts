import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class GitService {
  public static async getWorkingDiff(): Promise<string> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      return '';
    }

    const cwd = workspaceFolders[0].uri.fsPath;

    try {
      // 1. Try git diff HEAD (staged + unstaged)
      const { stdout } = await execAsync('git diff HEAD', { cwd, timeout: 5000 });
      if (stdout && stdout.trim()) {
        return stdout;
      }

      // 2. Try git diff
      const { stdout: diffStdout } = await execAsync('git diff', { cwd, timeout: 5000 });
      if (diffStdout && diffStdout.trim()) {
        return diffStdout;
      }

      return '';
    } catch (err) {
      console.warn('Could not extract git diff automatically:', err);
      return '';
    }
  }

  public static async getCurrentBranch(): Promise<string> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) return 'main';

    try {
      const { stdout } = await execAsync('git rev-parse --abbrev-ref HEAD', {
        cwd: workspaceFolders[0].uri.fsPath,
        timeout: 3000
      });
      return stdout.trim() || 'main';
    } catch {
      return 'main';
    }
  }
}
