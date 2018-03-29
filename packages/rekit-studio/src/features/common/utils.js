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

  return savedItem ? JSON.parse(savedItem) : defaultValue;
};

export const storage = {
  local: {
    setItem: setItem('local'),
    getItem: getItem('local'),
  },
  session: {
    setItem: setItem('session'),
    getItem: getItem('session'),
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
