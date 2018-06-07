const setItem = type => (key, item) => {
  const obj = window[`${type}Storage`];
  return obj.setItem(key, JSON.stringify(item));
};
const getItem = type => (key, defaultValue, saveIfNotExist) => {
  const obj = window[`${type}Storage`];
  const savedItem = obj.getItem(key);
  if (!savedItem && saveIfNotExist) {
    setItem(type)(key, defaultValue);
  }
  try {
    if (savedItem) return JSON.parse(savedItem);
  } catch (e) {
    obj.removeItem(key);
    return defaultValue;
  }
  return defaultValue;
};

const removeItem = type => (key) => {
  const obj = window[`${type}Storage`];
  obj.removeItem(key);
};

export const storage = {
  local: {
    setItem: setItem('local'),
    getItem: getItem('local'),
    removeItem: removeItem('local'),
  },
  session: {
    setItem: setItem('session'),
    getItem: getItem('session'),
    removeItem: removeItem('session'),
  },
};

export const getTreeNodeData = (treeData, key) => {
  const arr = [treeData];
  while (arr.length) {
    const node = arr.pop();
    if (node.key === key) return node;
    if (node.children) arr.push.apply(arr, node.children);
  }
  return null;
};
