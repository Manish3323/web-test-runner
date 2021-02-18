// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// import { TestRunner, TestRunnerCoreConfig } from '@web/test-runner';
import * as vscode from "vscode";
import { CodeLens, CodeLensProvider, Range, TextDocument } from "vscode";
import { TestRunnerCodeLensProvider } from "./CodeLensProvider";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
const currentWorkspaceFolderPath = () => {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    return vscode.workspace.getWorkspaceFolder(editor.document.uri)?.uri.fsPath;
  }
};

export function activate(context: vscode.ExtensionContext) {
  const runTestRunner = vscode.commands.registerCommand(
    "test-runner.runWebTestRunner",
    async () => {
      const terminal = vscode.window.createTerminal("test-runner");
      terminal.show();
      await vscode.commands.executeCommand("workbench.action.terminal.clear");
      terminal.sendText(`cd /Users/manish.gowardipe/Desktop/esw-ocs-eng-ui`);
      terminal.sendText(
        "node_modules/.bin/web-test-runner 'test/**/*.unit.test.{ts,tsx}'"
      );
    }
  );

  const watchModeTestRunner = vscode.commands.registerCommand(
    "test-runner.runInWatchMode",
    async () => {
      const terminal = vscode.window.createTerminal("test-runner");
      terminal.show();
      await vscode.commands.executeCommand("workbench.action.terminal.clear");
      terminal.sendText(
        "web-test-runner 'test/**/*.unit.test.{ts,tsx}' --watch"
      );
    }
  );

  context.subscriptions.push(runTestRunner);
  context.subscriptions.push(watchModeTestRunner);

  const codeLensProvider = new TestRunnerCodeLensProvider();
  const codeLensProviderDisposable = vscode.languages.registerCodeLensProvider(
    "*",
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

// const testrunnerConfig: TestRunnerCoreConfig = {
//   rootDir: testsRoot,
//   concurrentBrowsers: 1,
//   concurrency: 1,
//   protocol: "http",
//   hostname: "localhost",
//   port: 8089,
// 	browserStartTimeout: 2000,
// 	testsStartTimeout: 5000,
// 	testsFinishTimeout: 20000,
// 	coverageConfig: {
// 		report: true,
// 		reportDir: './report'
// 	},
//   browsers: [],
//   logger: {
//     log: (message) => console.log(message),
//     debug: (message) => console.error(message),
//     error: (message) => console.error(message),
//     warn: (message) => console.log(message),
//     group: () => console.log("group"),
//     groupEnd: () => console.log("message"),
//     logSyntaxError: () => console.log("message"),
//   },
//   reporters: [],
//   watch: false,
// };
// const testRunner = new TestRunner(testrunnerConfig);
