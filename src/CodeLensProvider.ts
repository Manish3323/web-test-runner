import { CodeLens, CodeLensProvider, Position, Range, TextDocument } from "vscode";
import * as vscode from "vscode";

function getTestsBlocks(document: TextDocument): CodeLens[] {
  const codeLens: CodeLens[] = [];
  const regex = new RegExp('describe');
  const text = document.getText();
  let matches;
  if ((matches = regex.exec(text)) !== null) {
      const line = document.lineAt(document.positionAt(matches.index).line);
      const indexOf = line.text.indexOf(matches[0]);
      const position = new vscode.Position(line.lineNumber, indexOf);
      const range = document.getWordRangeAtPosition(position, new RegExp(regex));
      if (range) {
        codeLens.push(new vscode.CodeLens(range));
      }
  }
  return codeLens;
  // const range = new Range(new Position(10,0), new Position(10,10));
  // codeLens.push(
  //   new CodeLens(range, {
  //     arguments: [document.fileName],
  //     command: "test-runner.runWebTestRunner",
  //     title: "Run",
  //   }),
  //   new CodeLens(range, {
  //     arguments: [document.fileName],
  //     command: "test-runner.runInWatchMode",
  //     title: "Debug",
  //   })
  // );

  // return codeLens;
}

export class TestRunnerCodeLensProvider implements CodeLensProvider {
  public async provideCodeLenses(document: TextDocument): Promise<CodeLens[]> {
    const codeLens: CodeLens[] = [];
    codeLens.push(...getTestsBlocks(document));
    return codeLens;
  }

  public resolveCodeLens(codeLens: vscode.CodeLens, token: vscode.CancellationToken) {
    if (vscode.workspace.getConfiguration("test-runner").get("enableCodeLens", true)) {
        codeLens.command = {
            title: "Run",
            command: "test-runner.runWebTestRunner"
        };
        return codeLens;
    }
    return null;
}
}
