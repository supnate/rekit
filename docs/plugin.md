## Plugin
Rekit 2.0 introduced a new plugin mechanism for extending the capability of Rekit.

If you've tried Rekit command line tools, you may have been familiar with its pattern:
```
rekit <add|rm|mv> <element-type> <feature>/</element-name>
``` 

Internally Rekit supports 3 element types: `feature`, `component` and `action` and defines how to `add/rm/mv` them.

Now you can create a Rekit plugin to alter the default behavior like how Rekit creates an async action or let Rekit support a new element type like `selector` based on [reselect](https://github.com/reactjs/reselect).

Actually, there have been such two plugins available:

1. [rekit-plugin-redux-saga](https://github.com/supnate/rekit/tree/master/packages/rekit-plugin-redux-saga): allows Rekit to uses `redux-saga` rather than `redux-thunk` when creating async actions.
2. [rekit-plugin-selector](https://github.com/supnate/rekit/tree/master/packages/rekit-plugin-selector): adds a new element type named `selector` based on [reselect](https://github.com/reactjs/reselect) to Rekit. So that you can manage selectors by Rekit for your project.

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

// Summary:
//  This plugin allows to use redux-saga for redux async actions rather than
//  redux-thunk by default. It overrides the action management provided by rekit-core.
//  And it delegates action mgmt to rekit-core if it's sync.

const fs = require('fs');
const path = require('path');
const _ = require('lodash');

_.pascalCase = _.flow(_.camelCase, _.upperFirst);
_.upperSnakeCase = _.flow(_.snakeCase, _.toUpper);

module.exports = function(rekitCore) {
  const app = rekitCore.app;
  const utils = rekitCore.utils;
  const refactor = rekitCore.refactor;
  const test = rekitCore.test;
  const action = rekitCore.action;
  const vio = rekitCore.vio;

  const afterAddFeature = require('./hooks')(rekitCore).afterAddFeature;

  function ensureInit() {
    // Summary
    //  Init the project to be ready for redux-saga
    const rootSagaPath = utils.mapSrcFile('common/rootSaga.js');

    // Check if saga plugin is already installed
    if (fs.existsSync(rootSagaPath)) {
      return;
    }

    // Create src/common/rootSaga.js
    const content = vio.getContent(path.join(__dirname, 'templates/rootSaga.js'));
    vio.save(rootSagaPath, content);

    // Apply redux-saga middleware
    const configStorePath = utils.mapSrcFile('common/configStore.js');

    // Import saga modulesinit
    refactor.updateFile(configStorePath, ast => [].concat(
      refactor.addImportFrom(ast, 'redux-saga', 'createSagaMiddleware'),
      refactor.addImportFrom(ast, './rootSaga', 'rootSaga'),
      refactor.addToArray(ast, 'middlewares', 'sagaMiddleware')
    ));

    // Add const sagaMiddleWare = createSagaMiddleware();
    const lines = vio.getLines(configStorePath);
    let i = refactor.lastLineIndex(lines, /^import/);
    lines.splice(i + 1, 0, '', 'const sagaMiddleware = createSagaMiddleware();');

    // Add sagaMiddleWare.run(rootSaga);
    i = refactor.lineIndex(lines, 'return store;');
    lines.splice(i, 0, '  sagaMiddleware.run(rootSaga);');

    // Init existing features
    console.log(app.getFeatures().forEach);
    app.getFeatures().forEach(afterAddFeature);

    vio.save(configStorePath, lines);
  }

  function add(feature, name, args) {
    ensureInit();
    feature = _.kebabCase(feature);
    name = _.camelCase(name);

    args = args || {};
    if (!args.async || args.thunk) {
      // Use default behavior if it's a sync action or asyn action with thunk by default.
      rekitCore.addAction(feature, name, args);
      return;
    }

    // Saga action is similar with async action except the template.
    action.addAsync(feature, name, {
      templateFile: path.join(__dirname, 'templates/async_action_saga.js'),
    });

    // Add to redux/sagas.js
    const sagasEntry = utils.mapFeatureFile(feature, 'redux/sagas.js');
    refactor.addExportFrom(sagasEntry, `./${name}`, null, `watch${_.pascalCase(name)}`);

    // Add saga test
    test.addAction(feature, name, {
      templateFile: path.join(__dirname, 'templates/async_action_saga.test.js'),
      isAsync: true,
    });
  }

  function remove(feature, name) {
    ensureInit();
    feature = _.kebabCase(feature);
    name = _.camelCase(name);

    // Saga action is similar with default async action except the template.
    rekitCore.removeAction(feature, name);

    // Remove from sagas.js
    const sagasEntry = utils.mapFeatureFile(feature, 'redux/sagas.js');
    refactor.removeImportBySource(sagasEntry, `./${name}`);
  }

  function move(source, target) {
    ensureInit();
    rekitCore.moveAction(source, target);

    source.feature = _.kebabCase(source.feature);
    source.name = _.camelCase(source.name);
    target.feature = _.kebabCase(target.feature);
    target.name = _.camelCase(target.name);

    let targetPath;
    // rename saga function name
    targetPath = utils.mapFeatureFile(target.feature, `redux/${target.name}.js`);
    refactor.updateFile(targetPath, ast => [].concat(
      refactor.renameFunctionName(ast, `do${_.pascalCase(source.name)}`, `do${_.pascalCase(target.name)}`),
      refactor.renameFunctionName(ast, `watch${_.pascalCase(source.name)}`, `watch${_.pascalCase(target.name)}`)
    ));

    // rename saga function name in test.js
    targetPath = utils.mapTestFile(target.feature, `redux/${target.name}.test.js`);
    refactor.renameImportSpecifier(targetPath, `do${_.pascalCase(source.name)}`, `do${_.pascalCase(target.name)}`);

    if (source.feature === target.feature) {
      targetPath = utils.mapFeatureFile(target.feature, 'redux/sagas.js');
      refactor.updateFile(targetPath, ast => [].concat(
        refactor.renameExportSpecifier(ast, `watch${_.pascalCase(source.name)}`, `watch${_.pascalCase(target.name)}`),
        refactor.renameModuleSource(ast, `./${source.name}`, `./${target.name}`)
      ));
    } else {
      targetPath = utils.mapFeatureFile(source.feature, 'redux/sagas.js');
      refactor.removeImportBySource(targetPath, `./${source.name}`);
      targetPath = utils.mapFeatureFile(target.feature, 'redux/sagas.js');
      refactor.addExportFrom(targetPath, `./${target.name}`, null, `watch${_.pascalCase(target.name)}`);
    }
  }

  return {
    add,
    remove,
    move,
  };
}

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

> NOTE: plugins which support more element types could only be used via command line tools but not Rekit Studio for now.

## Plugin development
For most cases, a plugin just creates bolierplate code based on some template; refactors code when moving, deleting source files. Rekit-core exports many useful APIs for accerlarating plugin development. You may just need to compose those APIs to meet your requirement.

## API reference
See the link: [http://rekit.js.org/api/index.html](http://rekit.js.org/api/index.html)
