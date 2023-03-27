import {
  CodeLens,
  CodeLensProvider,
  TextDocument,
} from "vscode";
import * as vscode from "vscode";

function getCodeLenses(document: TextDocument): CodeLens[] {
  const codeLens: CodeLens[] = [];
  const regex = /(describe|it|suite|test)[(]/g;
  const singleTestMatchers = ["it", "test"];
  const text = document.getText();

  return makeCodeLens(regex, text, document, singleTestMatchers, codeLens);
}

export class TestRunnerCodeLensProvider implements CodeLensProvider {
  private fileName = "";
  public async provideCodeLenses(document: TextDocument): Promise<CodeLens[]> {
    const codeLens: CodeLens[] = [];
    this.fileName = document.fileName;
    codeLens.push(...getCodeLenses(document));
    return codeLens;
  }
}

function makeCodeLens(regex: RegExp, text: string, document: TextDocument, singleTestMatchers: string[], codeLens: CodeLens[]) {
  let matches;
  while ((matches = regex.exec(text)) !== null) {
    const range = rangeForMatchedKeyword(document, matches);
    const isRunningSingleTest = singleTestMatchers.includes(matches[1]);

    if (range) {
      codeLens.push(
        new vscode.CodeLens(range, {
          title: "Run",
          command: "test-runner.runWebTestRunner",
          arguments: [document.fileName, isRunningSingleTest, range],
          tooltip: "Runs the test after spawning a new terminal instance & exits the WTR runner."
        }),
        new vscode.CodeLens(range, {
          title: "Watch",
          command: "test-runner.runInWatchMode",
          arguments: [document.fileName, isRunningSingleTest, range],
          tooltip: "Runs the test after spawning a new terminal instance & uses native WTR's watch mode"
        })
      );
    }
  }
  return codeLens;
}

function rangeForMatchedKeyword(document: TextDocument, matches: RegExpExecArray) {
  const line = document.lineAt(document.positionAt(matches.index).line);
  const indexOf = line.text.indexOf(matches[0]);
  const position = new vscode.Position(line.lineNumber, indexOf);
  const range = document.getWordRangeAtPosition(position, new RegExp(matches[1]));
  return range;
}

