const { vio, refactor } = rekit.core;

const getDeps = filePath => {
  if (!filePath.endsWith('.marko')) return null;
  const deps = [];

  const pushModuleSource = (moduleSource, args = {}) => {
    if (!moduleSource) return;
    if (!refactor.isLocalModule(moduleSource)) {
      deps.push({
        id: moduleSource,
        type: 'npm',
        ...args,
      });
      return;
    }
    let modulePath = refactor.resolveModulePath(filePath, moduleSource);
    // maybe modulePath is json/img or others.
    if (!vio.fileExists(modulePath)) modulePath += '.js';
    deps.push({ id: modulePath, type: 'file', ...args });
  };

  const content = vio.getContent(filePath);
  const regex = /<include\(['"]([^)]+)['"]\)/g;
  let res;
  while ((res = regex.exec(content)) !== null) {
    pushModuleSource(res[1]);
  }

  const regex2 = /<([\w-_]+) /g;
  let res2;
  while ((res2 = regex2.exec(content)) !== null) {
    const depFile = `src/ui-modules/${res2[1]}/component.js`;
    if (vio.fileExists(depFile)) {
      pushModuleSource(depFile);
    }

    const depFile2 = `src/components/${res2[1]}/component.js`;
    if (vio.fileExists(depFile2)) {
      pushModuleSource(depFile2);
    }
  }
  return deps;
};

module.exports = { getDeps };
