// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { TestRunnerCodeLensProvider } from "./CodeLensProvider";
import findRoot from "find-root";
let terminal: vscode.Terminal | null = null;
export function activate(context: vscode.ExtensionContext) {
  const runTestRunner = vscode.commands.registerCommand(
    "test-runner.runWebTestRunner",
    async (testName: string) => {
      await sendCommand(testName, false);
    }
  );

  const sendCommand = async (testName: string, watchMode: boolean) => {
    const folderPath = findRoot(testName);

    let terminal = vscode.window.terminals.find((x) => x.name === "wtr");
    if (terminal) {
      await vscode.commands.executeCommand("workbench.action.terminal.kill");
    }
    terminal = vscode.window.createTerminal("wtr");
    terminal.show();
    terminal.sendText(`cd ${folderPath}`);
    terminal.sendText(
      `node_modules/.bin/web-test-runner ${testName} ${
        watchMode ? "--watch" : ""
      }`
    );
  };

  const watchModeTestRunner = vscode.commands.registerCommand(
    "test-runner.runInWatchMode",
    async (testName: string) => {
      await sendCommand(testName, true);
    }
  );

  context.subscriptions.push(runTestRunner);
  context.subscriptions.push(watchModeTestRunner);

  const codeLensProvider = new TestRunnerCodeLensProvider();
  const docSelectors: vscode.DocumentFilter[] = [
    {
      pattern: vscode.workspace
        .getConfiguration()
        .get("test-runner.codeLensSelector"),
    },
  ];
  const codeLensProviderDisposable = vscode.languages.registerCodeLensProvider(
    docSelectors,
    codeLensProvider
  );
  context.subscriptions.push(codeLensProviderDisposable);
  vscode.commands.registerCommand("test-runner.enableCodeLens", () => {
    vscode.workspace
      .getConfiguration("test-runner")
      .update("enableCodeLens", true, true);
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
