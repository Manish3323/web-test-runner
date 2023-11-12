// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { TestRunnerCodeLensProvider } from "./CodeLensProvider";
import findRoot from "find-root";
import { getExtensionLogger } from "@vscode-logging/logger";

export function activate(context: vscode.ExtensionContext) {
  const logOutputChannel = vscode.window.createOutputChannel(
    "web-test-runner-output"
  );
  const extLogger = getExtensionLogger({
    extName: "test-runner",
    level: "info", // See LogLevel type in @vscode-logging/types for possible logLevels
    logPath: context.logUri.fsPath, // The logPath is only available from the `vscode.ExtensionContext`
    sourceLocationTracking: false,
    logOutputChannel: logOutputChannel,
    logConsole: true, // define if messages should be logged to the consol
  });
  const configExists = () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return false;
    }
    const workSpaceFolder = vscode.workspace.getWorkspaceFolder(
      editor.document.uri
    );
    if (!workSpaceFolder) {
      return false;
    }
    const configuredFolderPath = vscode.workspace
      .getConfiguration()
      .get<string>("test-runner.config-directory");
    if (configuredFolderPath) {
      extLogger.info(`Extension is running in : ${configuredFolderPath}`);
    }
    const currentFolderPath =
      !!configuredFolderPath && configuredFolderPath !== null
        ? configuredFolderPath
        : findRoot(editor.document.fileName);
    const currentFolderjsConfigPath = path.join(
      currentFolderPath,
      "web-test-runner.config.js"
    );
    const currentFoldermjsConfigPath = path.join(
      currentFolderPath,
      "web-test-runner.config.mjs"
    );
    const currentFolderjsonConfigPath = path.join(
      currentFolderPath,
      "web-test-runner.config.json"
    );
    return (
      fs.existsSync(currentFolderjsConfigPath) ||
      fs.existsSync(currentFoldermjsConfigPath) ||
      fs.existsSync(currentFolderjsonConfigPath)
    );
  };

  const names: [string, boolean][] = [
    ["test-runner.runWebTestRunner", false],
    ["test-runner.runInWatchMode", true],
  ];

  const [runTestRunner, watchModeTestRunner] = names.map(([name, watchMode]) =>
    vscode.commands.registerCommand(
      name,
      async (testName: string, singleTest: boolean, range: vscode.Range) => {
        const configuredFolderPath = vscode.workspace
          .getConfiguration()
          .get<string>("test-runner.config-directory");
        if (configuredFolderPath) {
          extLogger.info(`Extension is running in : ${configuredFolderPath}`);
        }
        const folderPath =
          !!configuredFolderPath && configuredFolderPath !== null
            ? configuredFolderPath
            : findRoot(testName);
        if (singleTest && range) {
          appendOnlyToTest(range);
        }
        await sendCommand(folderPath, testName, watchMode);
      }
    )
  );

  function appendOnlyToTest(range: vscode.Range) {
    const editor = vscode.window.activeTextEditor;
    !!editor &&
      editor.edit((editBuilder) => {
        editBuilder.insert(range.end, ".only");
      });
    editor?.document.save();
  }

  const sendCommand = async (
    folderPath: string,
    testName: string,
    watchMode: boolean
  ) => {
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
}

// this method is called when your extension is deactivated
export function deactivate() {}
