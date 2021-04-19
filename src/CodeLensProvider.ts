import {
  CodeLens,
  CodeLensProvider,
  Position,
  Range,
  TextDocument,
} from "vscode";
import * as vscode from "vscode";

function getCodeLenses(document: TextDocument): CodeLens[] {
  const codeLens: CodeLens[] = [];
  const regex = /(describe|it)[(]/g;
  const text = document.getText();
  let matches;
  while ((matches = regex.exec(text)) !== null) {
    const line = document.lineAt(document.positionAt(matches.index).line);
    const indexOf = line.text.indexOf(matches[0]);
    const position = new vscode.Position(line.lineNumber, indexOf);
    const range = document.getWordRangeAtPosition(position, new RegExp(regex));
    if (range) {
      codeLens.push(
        new vscode.CodeLens(range, {
          title: "Run",
          command: "test-runner.runWebTestRunner",
          arguments: [document.fileName, matches[1] === "it", range],
        }),
        new vscode.CodeLens(range, {
          title: "Watch",
          command: "test-runner.runInWatchMode",
          arguments: [document.fileName, matches[1] === "it", range],
        })
      );
    }
  }
  return codeLens;
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
