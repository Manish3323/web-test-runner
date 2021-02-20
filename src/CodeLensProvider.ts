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
  const regex = new RegExp("describe");
  const text = document.getText();
  let matches;
  if ((matches = regex.exec(text)) !== null) {
    const line = document.lineAt(document.positionAt(matches.index).line);
    const indexOf = line.text.indexOf(matches[0]);
    const position = new vscode.Position(line.lineNumber, indexOf);
    const range = document.getWordRangeAtPosition(position, new RegExp(regex));
    if (range) {
      codeLens.push(
        new vscode.CodeLens(range, {
          title: "Run",
          command: "test-runner.runWebTestRunner",
          arguments: [document.fileName],
        }),
        new vscode.CodeLens(range, {
          title: "Debug",
          command: "test-runner.runInWatchMode",
          arguments: [document.fileName],
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
