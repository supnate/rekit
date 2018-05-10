export function getElementData(elementById, projectRoot, file) {
  if (!file) return null;
  file = decodeURIComponent(file);
  const fullPath = projectRoot + file;
  const arr = fullPath.split('.');
  const ext = arr.length > 1 ? arr.pop() : null;
  const ele = elementById[file];

  if (!ele) return null;

  const data = {
    ...ele,
    hasDiagram: /^(js|jsx)$/.test(ext),
    hasTest: ele.hasTest,
    hasCode: /^(ts|tsx|js|jsx|html|css|less|scss|txt|json|sass|md|xml|svg|log|pl|py|sh|cmd)$/.test(ext),
    isPic: /^(jpe?g|png|gif|bmp)$/.test(ext),
  };
  data.onlyCode = data.hasCode && !data.hasDiagram && !data.hasTest;
  return data;
}

export function getElementFiles(elementById, projectRoot, cssExt, file) {
  const data = getElementData(elementById, projectRoot, file);
  if (!data) {
    return null;
  }

  const files = {};
  if (data.hasCode) files.code = data.file;
  if (data.hasTest) {
    files.test = `tests/${decodeURIComponent(file)
      .replace(/^src\//, '')
      .replace('.js', '')}.test.js`;
  }
  if (data.type === 'component') files.style = `src/features/${data.feature}/${data.name}.${cssExt}`;
  return files;
}

export function getElementUrl(element) {
  switch (element.type) {
    case 'component':
    case 'action':
    case 'misc':
      return `/element/${encodeURIComponent(element.file)}/code`;
    default:
      return '/';
  }
}
