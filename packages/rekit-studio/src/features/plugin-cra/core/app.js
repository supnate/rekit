const _ = require('lodash');
// const shell = require('shelljs');
const traverse = require('babel-traverse').default;

const { paths, vio } = rekit.core;
const { ast, projectFiles } = rekit.common;

let elementById = {};
const filePropsCache = {};

function getFileProps(file) {
  if (filePropsCache[file] && filePropsCache[file].content === vio.getContent(file)) {
    return filePropsCache[file].props;
  }

  const fileAst = ast.getAst(file);
  const ff = {}; // File features

  traverse(fileAst, {
    ImportDeclaration(path) {
      switch (path.node.source.value) {
        case 'react':
          ff.importReact = true;
          break;
        case 'redux':
          ff.importRedux = true;
          break;
        case 'react-redux':
          ff.importReactRedux = true;
          break;
        case './constants':
          ff.importConstant = true;
          ff.importMultipleConstants = path.node.specifiers.length > 3;
          break;
        default:
          break;
      }
    },
    ClassDeclaration(path) {
      if (path.node.superClass && path.node.body.body.some(n => n.type === 'ClassMethod' && n.key.name === 'render')) {
        ff.hasClassAndRenderMethod = true;
      }
    },
    CallExpression(path) {
      if (path.node.callee.name === 'connect') {
        ff.connectCall = true;
      }
    },
    ExportNamedDeclaration(path) {
      if (_.get(path, 'node.declaration.id.name') === 'reducer') {
        ff.exportReducer = true;
      }
    },
  });
  const props = {
    component: ff.importReact &&
      ff.hasClassAndRenderMethod && {
        connectToStore: ff.importReactRedux && ff.connectCall,
      },
    action: ff.exportReducer &&
      ff.importConstant && {
        isAsync: ff.importMultipleConstants,
      },
  };

  if (props.component) props.type = 'component';
  else if (props.action) props.type = 'action';

  filePropsCache[file] = {
    content: vio.getContent(file),
    props,
  };
  return props;
}

function getComponents(feature) {
  const components = [];
  const eleFolder = elementById[`src/features/${feature}`];
  eleFolder.children.map(eid => elementById[eid]).forEach(ele => {
    if (ele.type === 'file' && /\.jsx?$/.test(ele.name) && getFileProps(ele.id).component) {
      const views = [
        { key: 'diagram', name: 'Diagram' },
        { key: 'code', name: 'Code', target: ele.id, isDefault: true },
        { key: 'style', name: 'Style', target: ele.id.replace(/\.jsx?$/, '.less') },
        { key: 'test', name: 'Test', target: ele.id.replace(/^src\//, 'tests/').replace(/\.jsx?$/, '.test.js') },
      ];
      const name = ele.name.replace(/\.[^.]*$/, '');
      components.push({
        type: 'component',
        id: `v:${ele.id}`,
        name,
        props: getFileProps(ele.id).component,
        views,
      });
    }
  });

  components.forEach(c => {
    elementById[c.id] = c;
  });
  return components.map(c => c.id);
}

function getActions(feature) {
  const actions = [];
  const eleFolder = elementById[`src/features/${feature}/redux`];
  eleFolder.children.map(eid => elementById[eid]).forEach(ele => {
    if (ele.type === 'file' && /\.js$/.test(ele.name) && getFileProps(ele.id).action) {
      const views = [
        { key: 'diagram', name: 'Diagram' },
        { key: 'code', name: 'Code', target: ele.id, isDefault: true },
        { key: 'test', name: 'Test', target: ele.id.replace(/^src\//, 'tests/').replace(/\.js$/, '.test.js') },
      ];
      actions.push({
        type: 'action',
        id: `v:${ele.id}`,
        name: ele.name.replace(/\.[^.]*$/, ''),
        props: getFileProps(ele.id).action,
        views,
      });
    }
  });

  actions.forEach(c => {
    elementById[c.id] = c;
  });
  return actions.map(c => c.id);
}

function getRoutes(feature) {}

function getFiles(feature) {
  const res = projectFiles.readDir(paths.map(`src/features/${feature}`));
  Object.assign(elementById, res.elementById);
  return res.elements;
}

function getInitialState(feature) {
  const id = `v:${feature}-initial-state`;
  const ele = {
    id,
    type: 'initial-state',
    target: `src/features/${feature}/redux/initialState.js`,
    name: 'initialState',
  };
  elementById[id] = ele;
  return ele;
}

function getFeatures() {
  // return _.toArray(shell.ls(rekit.core.paths.map('src/features')));
  const elements = [];
  const eles = elementById['src/features'].children.map(eid => elementById[eid]);
  eles.forEach(ele => {
    if (ele.type !== 'folder') {
      elements.push(ele.id);
      return;
    }
    // feature name
    const f = ele.id.split('/').pop();

    const routes = getRoutes(f);
    const actions = getActions(f);
    const components = getComponents(f);

    actions.unshift(getInitialState(f).id);

    const toRemoveFromMisc = {};
    [...actions, ...components].map(eid => elementById[eid]).forEach(ele => {
      if (ele.target) toRemoveFromMisc[ele.target] = true;
      if (ele.views) {
        ele.views.forEach(p => {
          if (p.target) toRemoveFromMisc[p.target] = true;
        });
      }
    });

    const filterNonMisc = children => {
      const filtered = children.filter(cid => !toRemoveFromMisc[cid]);
      filtered.map(cid => elementById[cid]).forEach(c => {
        if (c.children) c.children = filterNonMisc(c.children);
      });
      return filtered;
    };

    const misc = filterNonMisc(getFiles(f));

    const children = [
      {
        id: `v:${f}-routes`,
        type: 'routes',
        name: 'Routes',
        children: routes,
      },
      {
        id: `v:${f}-actions`,
        type: 'actions',
        name: 'Actions',
        children: actions,
      },
      {
        id: `v:${f}-components`,
        type: 'components',
        name: 'Components',
        children: components,
      },
      { id: `v:${f}-misc`, type: 'misc', name: 'Misc', children: misc },
    ];
    const id = `v:feature-${f}`;
    elements.push(id);
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
  const allFiles = projectFiles.readDir(paths.map('src'));
  elementById = allFiles.elementById;

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
    children: allFiles.elements.filter(eid => eid !== 'src/features'),
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
