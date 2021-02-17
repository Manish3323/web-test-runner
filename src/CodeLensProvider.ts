import { CodeLens, CodeLensProvider, Range, TextDocument } from 'vscode';
import { escapeRegExp, findFullTestName } from './util';


function getTestsBlocks(parsedNode: ParsedNode, parseResults: ParsedNode[]): CodeLens[] {
  const codeLens: CodeLens[] = [];

  parsedNode.children?.forEach(subNode => {
    codeLens.push(...getTestsBlocks(subNode, parseResults));
  });

  const range = new Range(
    parsedNode.start.line - 1,
    parsedNode.start.column,
    parsedNode.end.line - 1,
    parsedNode.end.column
  );

  if (parsedNode.type === 'expect') {
    return [];
  }

  const fullTestName = escapeRegExp(findFullTestName(parsedNode.start.line, parseResults));

  codeLens.push(
    new CodeLens(range, {
      arguments: [fullTestName],
      command: 'extension.runJest',
      title: 'Run'
    }),
    new CodeLens(range, {
      arguments: [fullTestName],
      command: 'extension.debugJest',
      title: 'Debug'
    })
  );

  return codeLens;
}

export class TestRunnerCodeLensProvider implements CodeLensProvider {
  public async provideCodeLenses(document: TextDocument): Promise<CodeLens[]> {
    // const parseResults = parse(document.fileName, document.getText()).root.children;
    console.log(document.getText());
    const codeLens: CodeLens[] = [];
    // parseResults.forEach(parseResult => codeLens.push(...getTestsBlocks(parseResult, parseResults)));
    return codeLens;
  }
}