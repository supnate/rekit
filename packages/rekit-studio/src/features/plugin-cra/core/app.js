const _ = require('lodash');
const shell = require('shelljs');

const { paths, vio } = rekit.core;

let elementById = {};
let allFiles = null;

function getComponents(feature) {
  const components = [];
  const eleById = allFiles.elementById;
  const eleFolder = eleById[`src/features/${feature}`];
  eleFolder.children.map(eid => eleById[eid]).forEach(ele => {    
    if (ele.type === 'file' && /\.jsx?$/.test(ele.name)) {
      components.push({
        type: 'component',
        id: `v:${ele.id}`,
        name: ele.name.replace(/\.[^.]*$/, ''),
        parts: [ele.id],
      });
    }
  });

  components.forEach(c => { elementById[c.id] = c; });
  console.log(feature, components);
  return components.map(c => c.id);
}
function getActions(feature) {}
function getRoutes(feature) {}
function getMiscFiles(feature) {
  const elements = [];
  const elementById = {};
  return elements;
}

function getFeatures() {
  // return _.toArray(shell.ls(rekit.core.paths.map('src/features')));
  const elements = [];
  shell.ls(paths.map('src/features')).forEach(f => {
    const id = `v:feature-${f}`;
    elements.push(id);

    const children = [
      { id: `v:${f}-routes`, type: 'routes', name: 'Routes', children: getRoutes(f) },
      { id: `v:${f}-actions`, type: 'actions', name: 'Actions', children: getActions(f) },
      { id: `v:${f}-components`, type: 'components', name: 'Components', children: getComponents(f) },
      { id: `v:${f}-misc`, type: 'misc', name: 'Misc', children: getMiscFiles(f) },
    ];
    elementById[id] = {
      type: 'feature',
      id,
      name: f,
      children: children.map(c => c.id),
    };
    children.forEach(c => {
      elementById[c.id] = c;
    });
  });
  return elements;
}

function getProjectData() {
  // return rekit.common.projectFiles.readDir();
  elementById = {};
  allFiles = rekit.common.projectFiles.readDir(paths.map('src'));

  const eleFeatures = {
    type: 'features',
    id: 'v:features',
    name: 'Features',
    children: getFeatures(),
  };
  const eleMisc = {
    type: 'misc',
    id: 'v:root-misc',
    name: 'Misc',
    children: getMiscFiles(),
  };

  const elements = [];

  [eleFeatures, eleMisc].forEach(ele => {
    elements.push(ele.id);
    elementById[ele.id] = ele;
  });

  return { elements, elementById };
}

module.exports = {
  getProjectData,
};
