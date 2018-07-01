import _ from 'lodash';

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

export function getTabKey(pathname) {
  // Get the tab key by pathname, if not provided, get it from current url
  if (!pathname) pathname = document.location.pathname;
  const arr = _.compact(pathname.split('/')).map(decodeURIComponent);
  let key = null;
  if (arr.length === 0) {
    key = '#home';
  } else if (arr[1] === 'routes') {
    key = `${arr[0]}/routes`;
  } else if (arr[0] === 'element') {
    key = arr[1];
  } else if (arr[0] === 'tools' && arr[1] === 'tests') {
    key = '#tests';
  } else if (arr[0] === 'tools' && arr[1] === 'coverage') {
    key = '#coverage';
  } else if (arr[0] === 'tools' && arr[1] === 'build') {
    key = '#build';
  } else if (arr[0] === 'config' && arr[1] === 'deps') {
    key = '#deps';
  } else if (arr[0] === 'config' && arr[1] === 'env') {
    key = '#env';
  }
  return key;
}
