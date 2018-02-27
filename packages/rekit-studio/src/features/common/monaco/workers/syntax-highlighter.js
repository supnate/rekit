/* eslint no-restricted-globals: 0 */
/* global self */
self.importScripts([
  '/static/libs/typescript.min.js',
]);

function getLineNumberAndOffset(start, lines) {
  let line = 0;
  let offset = 0;
  while (offset + lines[line] < start) {
    offset += lines[line] + 1;
    line += 1;
  }

  return { line: line + 1, offset };
}

function nodeToRange(node) {
  if (
    typeof node.getStart === 'function' &&
    typeof node.getEnd === 'function'
  ) {
    return [node.getStart(), node.getEnd()];
  } else if (
    typeof node.pos !== 'undefined' &&
    typeof node.end !== 'undefined'
  ) {
    return [node.pos, node.end];
  }
  return [0, 0];
}

function addChildNodes(node, lines, classifications) {
  self.ts.forEachChild(node, id => {
    const [start, end] = nodeToRange(id);
    const { offset, line: startLine } = getLineNumberAndOffset(start, lines);
    const { line: endLine } = getLineNumberAndOffset(end, lines);
    // if (self.ts.SyntaxKind.IfKeyword === id.kind) console.error('if');
    if (self.ts.SyntaxKind.IfStatement === id.kind) {
      classifications.push({
        start: id.getStart() + 1 - offset,
        end: id.getStart() + 3 - offset,
        kind: self.ts.SyntaxKind[self.ts.SyntaxKind.IfKeyword],
        node: id,
        startLine,
        endLine: startLine,
      });
    }
    if (self.ts.SyntaxKind.ReturnStatement === id.kind) {
      classifications.push({
        start: id.getStart() + 1 - offset,
        end: id.getStart() + 7 - offset,
        kind: self.ts.SyntaxKind[self.ts.SyntaxKind.ReturnKeyword],
        node: id,
        startLine,
        endLine: startLine,
      });
    }
    classifications.push({
      start: id.getStart() + 1 - offset,
      end: id.getEnd() + 1 - offset,
      kind: self.ts.SyntaxKind[id.kind],
      node: id,
      startLine,
      endLine,
    });

    addChildNodes(id, lines, classifications);
  });
}

// Respond to message from parent thread
self.addEventListener('message', event => {
  const { code, title, version } = event.data;
  try {
    const classifications = [];
    const sourceFile = self.ts.createSourceFile(
      'a.jsx',
      code,
      self.ts.ScriptTarget.ES2015,
      true
    );
    // console.log(sourceFile);
    const lines = code.split('\n').map(line => line.length);

    addChildNodes(sourceFile, lines, classifications);

    self.postMessage({ classifications, version });
  } catch (e) {
    /* Ignore error */
  }
});
