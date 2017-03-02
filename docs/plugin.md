## Plugin
Rekit 2.0 introduced a new plugin mechanism for extending the capability of Rekit.
If you've tried Rekit command line tools, you may have been familiar with the pattern:
```
rekit <add|rm|mv> <element-type> <feature>/</element-name>
``` 

Internally Rekit supports 3 element types: `feature`, `component` and `action` and defines how to `add/rm/mv` them.

Now you can create a Rekit plugin to alter the default behavior like how Rekit creates a component or let Rekit support a new element type like `selector` based on [reselect](https://github.com/reactjs/reselect).

For example, there have been two plugins available:

1. [rekit-plugin-redux-saga](https://github.com/supnate/rekit-plugin-redux-saga): allows Rekit to uses `redux-saga` rather than `redux-thunk` when creating async actions.
2. [rekit-plugin-reselect](https://github.com/supnate/rekit-plugin): adds a new element type named `selector` based on [reselect](https://github.com/reactjs/reselect) to Rekit. So that you can manage selectors by Rekit for your project.

There are two types of plugins:

1. **Public plugins**: plugins published on npm so that all people could use it.
2. **Local plugins**: plugins only meet the requirements for your own project. They are placed under `<your-prjroot>/tools/plugins` folder.

## Create a plugin

To create a plugin, use below command:
```
rekit create-plugin my-plugin
```
It will create a local plugin if the current directory is in a Rekit project, otherwise create a public plugin.

## Plugin structure
After creating a plugin, you can look into the folder structure. There could be some special files under the plugin folder:

- **index.js**: optional. Export plugin APIs when the plugin is published as a npm module. It's unnecessary in most cases.
- **config.js**: The key file of the 
- **hooks.js**:
- **package.json**:

## Define arguments of your command

## Work flow

## Hooks
