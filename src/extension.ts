// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { TestRunner, TestRunnerCoreConfig } from '@web/test-runner';
import * as vscode from 'vscode';
import * as path from 'path';
import { CodeLens, CodeLensProvider, Range, TextDocument } from 'vscode';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const testsRoot = path.resolve(__dirname, "..");
  const testrunnerConfig: TestRunnerCoreConfig = {
    rootDir: testsRoot,
    concurrentBrowsers: 1,
    concurrency: 1,
    protocol: "http",
    hostname: "localhost",
    port: 8089,
		browserStartTimeout: 2000,
		testsStartTimeout: 5000,
		testsFinishTimeout: 20000,
		coverageConfig: {
			report: true,
			reportDir: './report'
		},
    browsers: [],
    logger: {
      log: (message) => console.log(message),
      debug: (message) => console.error(message),
      error: (message) => console.error(message),
      warn: (message) => console.log(message),
      group: () => console.log("group"),
      groupEnd: () => console.log("message"),
      logSyntaxError: () => console.log("message"),
    },
    reporters: [],
    watch: false,
  };
	const testRunner = new TestRunner(testrunnerConfig);
	const runJest = vscode.commands.registerCommand('extension.runWebTestRunner', async (argument: object | string) => {
    if (typeof argument === 'string') {
      testRunner.runTests(testRunner.sessions.);
    } else {
      testRunner.runCurrentTest();
    }
  });
	testRunner.testFiles

	const runJestFile = vscode.commands.registerCommand('extension.runWebTestFile', async (argument: object | string) => testRunner.);
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('test-runner.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from web/test-runner-extension!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
