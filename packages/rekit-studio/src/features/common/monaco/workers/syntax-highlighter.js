/* eslint no-restricted-globals: 0 */
/* global self */
self.importScripts(["/static/libs/typescript.min.js"]);

const keywordSyntax = {
  IfStatement: { length: 2, name: "IfKeyword" },
  ReturnStatement: { length: 6, name: "ReturnKeyword" },
  ImportDeclaration: { length: 6, name: "ImportKeyword" }
};
function findKeyword(node, classifications, line, offset) {
  const s = self.ts.SyntaxKind[node.kind];
  if (keywordSyntax[s]) {
    classifications.push({
      start: node.getStart() + 1 - offset,
      end: node.getStart() + 1 + keywordSyntax[s].length - offset,
      kind: keywordSyntax[s].name,
      node,
      startLine: line,
      endLine: line
    });
  }
}

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
    typeof node.getStart === "function" &&
    typeof node.getEnd === "function"
  ) {
    return [node.getStart(), node.getEnd()];
  } else if (
    typeof node.pos !== "undefined" &&
    typeof node.end !== "undefined"
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
    findKeyword(id, classifications, startLine, offset);
    const kind = self.ts.SyntaxKind[id.kind];
    if (/^Jsx|^Identifier|^CallExpression|Keyword$/.test(kind)) {
      classifications.push({
        start: id.getStart() + 1 - offset,
        end: id.getEnd() + 1 - offset,
        kind,
        node: id,
        startLine,
        endLine
      });
    }

    addChildNodes(id, lines, classifications);
  });
}

// Respond to message from parent thread
self.addEventListener("message", event => {
  const { code, title, version } = event.data;
  try {
    const classifications = [];
    const sourceFile = self.ts.createSourceFile(
      "a.jsx",
      code,
      self.ts.ScriptTarget.ES2015,
      true
    );
    // console.log(sourceFile);
    const lines = code.split("\n").map(line => line.length);

    addChildNodes(sourceFile, lines, classifications);

    self.postMessage({ classifications, version });
  } catch (e) {
    /* Ignore error */
  }
});
