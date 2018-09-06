const { vio, refactor } = rekit.core;

function add(feature, name) {
  const targetPath = `src/features/${feature}/redux/constants.js`;
  const lines = vio.getLines(targetPath);
  const i = refactor.lastLineIndex(lines, /^export /);
  const code = `export const ${name} = '${name}';`;
  if (!lines.includes(code)) {
    lines.splice(i + 1, 0, code);
    vio.save(targetPath, lines);
  }
}

function rename(feature, oldName, newName) {
  const targetPath = `src/features/${feature}/redux/constants.js`;
  const lines = vio.getLines(targetPath);
  const i = refactor.lineIndex(lines, `export const ${oldName} = '${oldName}';`);
  if (i >= 0) {
    lines[i] = `export const ${newName} = '${newName}';`;
  }

  vio.save(targetPath, lines);
}

function remove(feature, name) {
  const targetPath = `src/features/${feature}/redux/constants.js`; 
  refactor.removeLines(targetPath, `export const ${name} = '${name}';`);
}

module.exports = {
  add,
  remove,
  rename,
};
