## Plugin
Rekit 2.0 introduced a new plugin mechanism for extending the capability of Rekit.

If you've tried Rekit command line tools, you may have been familiar with its pattern:
```
rekit <add|rm|mv> <element-type> <feature>/</element-name>
``` 

Internally Rekit supports 3 element types: `feature`, `component` and `action` and defines how to `add/rm/mv` them.

Now you can create a Rekit plugin to alter the default behavior like how Rekit creates an async action or let Rekit support a new element type like `selector` based on [reselect](https://github.com/reactjs/reselect).

Actually, there have been such two plugins available:

1. [rekit-plugin-redux-saga](https://github.com/supnate/rekit-plugin-redux-saga): allows Rekit to uses `redux-saga` rather than `redux-thunk` when creating async actions.
2. [rekit-plugin-reselect](https://github.com/supnate/rekit-plugin-selector): adds a new element type named `selector` based on [reselect](https://github.com/reactjs/reselect) to Rekit. So that you can manage selectors by Rekit for your project.

The two plugins are not only productable but also reference about how to create Rekit plugins.

There are two types of plugins:

1. **Public plugins**: plugins published on npm so that all people could use it. When installed, it's under `node_modules` folder. In development time, you can use [npm link](https://docs.npmjs.com/cli/link) to test a public plugin.
2. **Local plugins**: plugins only meet the requirements for your own project. They are placed under `<your-prjroot>/tools/plugins` folder.

There are no difference of the two types of plugins themselves.

## Create a plugin

To create a plugin, use below command:

```
rekit create-plugin <plugin-name>
```

It will create a local plugin if the current directory is in a Rekit project, otherwise create a public plugin.

## Plugin structure
After creating a plugin, you can look into the folder structure. There could be some special files under the plugin folder:

### config.js
The only mandotory file of a plugin, it defines element types it could handle and defines the command arguments if necessary. For example:

```javascript
module.exports = {
  accept: ['action'],
  defineArgs(addCmd, mvCmd, rmCmd) { // eslint-disable-line
    addCmd.addArgument(['--thunk'], {
      help: 'Use redux-thunk for async actions.',
      action: 'storeTrue',
    });
  },
};

```

There are two parts:

#### 1. accept
It's an array of element types that the plugin could handle. Here it's `action`, it will override the default behavior how Rekit handles `action`. Whenever an element type is defined here, there should be a module named `${elementType}.js` where defines `add`, `remove`, `move` method to manage those elements. For example, element type `action` is defined, there should be a module `action.js` in the plugin folder:
```javascript
module.exports = {
  add(feature, name, args) {},
  remove(feature, name, args) {},
  move(source, target, args) {},
};
```

You can export just some of `add`, `remove`, `move` if needed. For example, if you only defines `add` command, then when executes `rekit mv action ...` it will fallback to the default behavior of how Rekit `mv` actions.

You can also create 3 plugins handle `add`, `remove`, `move` sepearately, they accept the same element type. Though seems useless.

#### 2. defineArgs(addCmd, mvCmd, rmCmd)
Rekit uses [argparse](https://www.npmjs.com/package/argparse) to parse command arguments. This methods allows to define custom arguments for command line tools. Here `addCmd`, `mvCmd` and `rmCmd` are all sub-commands of the global `rekit` command. According to the docs of argparse, you can add more options to sub-commands to meet your requirements. For example: `redux-saga` plugin defines a new option `--thunk` that allows to use `redux-thunk` for async actions while redux-saga is used by default. Then you could use:

```
rekit add action home/my-action -a --thunk
```

### hooks.js
This file is only necessary when you want to hook to some operations. i.e., do something after a feature is created or removed. Each element type has two kind of hook points: `before` and `after`, they are combined with operation types to form multiple hook points. For example, `feature` element type has below hook points:

- beforeAddFeature()
- afterAddFeature()
- beforeMoveFeature()
- afterMoveFeature()
- beforeRemoveFeature()
- afterRemoveFeature()

The arguments just inherit from the hook target. That is, whatever arguments passed to addFeature are also passed to beforeAddFeature.

Note that not only internal element types have hook points, each element type supported by plugins all have such hook points.

For example, `redux-saga` plugins uses hooks to do initialization and uninitialization when adding or removing features.

```javascript
const fs = require('fs');
const _ = require('lodash');
const rekitCore = require('rekit-core');

const utils = rekitCore.utils;
const refactor = rekitCore.refactor;
const vio = rekitCore.vio;

function afterAddFeature(featureName) {
  // Summary:
  //  Called after a feature is added. Add sagas.js and add entry in rootSaga.js
  const rootSaga = utils.mapSrcFile('common/rootSaga.js');
  refactor.updateFile(rootSaga, ast => [].concat(
    refactor.addImportFrom(ast, `../features/${_.kebabCase(featureName)}/redux/sagas`, null, null, `${_.camelCase(featureName)}Sagas`),
    refactor.addToArray(ast, 'featureSagas', `${_.camelCase(featureName)}Sagas`)
  ));

  const featureSagas = utils.mapFeatureFile(featureName, 'redux/sagas.js');
  // create sagas.js entry file for the feature
  if (!fs.existsSync(featureSagas)) vio.save(featureSagas, '');
}

function afterRemoveFeature(featureName) {
  // Summary:
  //  Called after a feature is removed. Remove entry from rootSaga.js
  const rootSaga = utils.mapSrcFile('common/rootSaga.js');
  refactor.updateFile(rootSaga, ast => [].concat(
    refactor.removeImportBySource(ast, `../features/${_.kebabCase(featureName)}/redux/sagas`),
    refactor.removeFromArray(ast, 'featureSagas', `${_.camelCase(featureName)}Sagas`)
  ));
}

function afterMoveFeature(oldName, newName) {
  // Summary:
  //  Called after a feature is renamed. Rename entry in rootSaga.js
  const rootSaga = utils.mapSrcFile('common/rootSaga.js');
  refactor.updateFile(rootSaga, ast => [].concat(
    refactor.renameModuleSource(ast, `../features/${_.kebabCase(oldName)}/redux/sagas`, `../features/${_.kebabCase(newName)}/redux/sagas`),
    refactor.renameImportSpecifier(ast, `${_.camelCase(oldName)}Sagas`, `${_.camelCase(newName)}Sagas`)
  ));
}

module.exports = {
  afterAddFeature,
  afterRemoveFeature,
  afterMoveFeature,
};

```

## Using a plugin
For local plugins, you don't need to do anything else besides creating it. And it has highest priority for handling element types if there are conflicts.

For public plugins, that is installed from npm. You need to register it in `rekit` section of `package.json`:

```json
{
...,
"rekit": {
  "plugins": ["redux-saga", "apollo"], 
},
...,
}
```

Here you should only define public plugins in the `plugins` property so that they are loaded by Rekit. Local plugins will be always loaded by Rekit. Note that the order of plugin names matters while they accept same element types, the eariers have higher priority.

While there are conflicts that multiple plugins accept the same element type, the priority from high to low is: local plugins &lt; public plugins &lt; Rekit default behavior.

> NOTE: plugins which support more element types could only be used via command line tools for now.

## Plugin development
For most cases, a plugin just creates bolierplate code based on some template; refactors code when moving, deleting source files. Rekit-core exports many useful APIs for accerlarating plugin development. You may just need to compose those APIs to meet your requirement.

## API reference
See the link: [http://rekit.js.org/api/index.html](http://rekit.js.org/api/index.html)
