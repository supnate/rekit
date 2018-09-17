const { vio, refactor } = rekit.core;

const getDeps = (filePath) => {
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
  while((res = regex.exec(content)) !== null) {
    pushModuleSource(res[1]);
  }
  return deps;
}

module.exports = { getDeps };