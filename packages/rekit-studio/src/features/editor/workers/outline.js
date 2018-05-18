/* eslint no-restricted-globals: 0, prefer-spread: 0, no-continue: 0, no-use-before-define: 0 */
/* global self, babylon */
self.importScripts(['/static/libs/babylon.js']);

function getScopeNodes(scope, contextKey) {
  contextKey = contextKey || '';
  const arr = [];
  scope.body.forEach(node => {
    if (node.declaration && /^(ClassDeclaration|FunctionDeclaration|VariableDeclaration)$/.test(node.declaration.type)) {
      node = node.declaration;
    }
    if (node.type === 'ClassDeclaration') {
      arr.push(getClassNode(node));
      return;
    }

    let key, label; // eslint-disable-line
    if (/^(ClassProperty|ClassMethod)$/.test(node.type)) {
      key = `${contextKey}-${node.key.name}`;
      label = node.key.name;
    }

    if (/^(FunctionDeclaration)$/.test(node.type)) {
      key = `${contextKey}-${node.id.name}`;
      label = node.id.name;
    }
    if (/^(VariableDeclaration)$/.test(node.type)) {
      const declaration = node.declarations[0];
      let name;
      if (declaration.id.type === 'ObjectPattern') {
        name = declaration.id.properties[0].key.name;
      } else {
        name = declaration.id.name;
      }
      key = `${contextKey}-${name}`;
      label = name;
    }
    if (key && label) {
      arr.push({
        key,
        label,
        startLine: node.loc.start.line,
        type: node.type,
      });
    }
  });
  return arr;
}
function getClassNode(classNode) {
  const treeNode = {
    key: classNode.id.name,
    label: classNode.id.name,
    type: classNode.type,
    startLine: classNode.loc.start.line,
    children: getScopeNodes(classNode.body, classNode.id.name),
  };
  return treeNode;
}

// Respond to message from parent thread
self.addEventListener('message', event => {
  const { code } = event.data;
  try {
    const ast = babylon.parse(code, {
      // parse in strict mode and allow module declarations
      sourceType: 'module',
      plugins: [
        'jsx',
        'flow',
        'doExpressions',
        'objectRestSpread',
        'decorators',
        'classProperties',
        'exportExtensions',
        'asyncGenerators',
        'functionBind',
        'functionSent',
        'dynamicImport',
      ],
    });

    const root = {
      key: 'root',
      label: 'Root',
      children: getScopeNodes(ast.program),
    };

    self.postMessage({ root });
  } catch (e) {
    // console.log('failed to parse ast: ', e);
    /* Ignore error */
  }
});
