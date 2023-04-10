import globby from 'globby';
import { sep } from 'path';

export function findFullTestName(selectedLine: number, children: any[]): string | undefined {
  if (!children) {
    return;
  }
  for (const element of children) {
    if (element.type === 'describe' && selectedLine === element.start.line) {
      return element.name;
    }
    if (element.type !== 'describe' && selectedLine >= element.start.line && selectedLine <= element.end.line) {
      return element.name;
    }
  }
  for (const element of children) {
    const result = findFullTestName(selectedLine, element.children);
    if (result) {
      return element.name + ' ' + result;
    }
  }
}

export function collectTestFiles(patterns: string | string[], baseDir = process.cwd()) {
  const normalizedPatterns = [patterns].flat().map(p => p.split(sep).join('/'));
  return globby.sync(normalizedPatterns, { cwd: baseDir, absolute: true });
}