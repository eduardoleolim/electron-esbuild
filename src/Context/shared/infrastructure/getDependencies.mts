import dependencyTree from 'dependency-tree';
import * as fs from 'fs';
import path from 'path';

export function getDependencies(filename: string): string[] {
  const stats = fs.lstatSync(filename);

  if (stats.isDirectory()) {
    return [];
  }

  const directory = path.dirname(filename);

  return dependencyTree.toList({
    filename,
    directory,
    filter: (path) => path.indexOf('node_modules') === -1
  });
}
