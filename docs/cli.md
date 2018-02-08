## Command Line Tools
Rekit provides a set of command line tools to manage components, actions and routing rules for Rekit projects. They are implemented as JavaScript modules in the package [rekit-core](https://github.com/supnate/rekit/tree/master/packages/rekit-core). Then Rekit just wraps them as command line tools. Actually `rekit-core` is also used by [Rekit Studio](https://github.com/supnate/rekit/tree/master/packages/rekit-studio).


### Create an app
You can use below command to create an app:
```
rekit create <app-name> [--sass] [--clean]
```

This will create an app named `app-name` under the current directory. The flag `--sass` allows to use [sass](https://sass-lang.com) instead of [less](http://lesscss.org) as the css transpiler. The flag `--clean` is used to create a clean project without samples.

### Create a plugin
You can use below command to create a plugin:
```
rekit create-plugin <plugin-name>
```
It will create a local plugin if the current directory is in a Rekit project, otherwise create a public plugin.

For more information, please read the document at: [http://rekit.js.org/docs/plugin.html](http://rekit.js.org/docs/plugin.html).

### Install a plugin
If you will use a plugin via npm, use the below command:
```
rekit install <plugin-name>
```

This will execute `install.js` script of the plugin to do the initialization and added the plugin name to `rekit.plugins` section of package.json.

### Rekit tools

Rekit tools are pure scripts shipped with created applications. They are put in the `tools` folder of your app and are supposed to be edited to meet additional requirements of your project.

##### tools/server.js
This script is used to start dev servers, by default it starts all 3 servers include webpack dev server, Rekit Studio and the build result server. You can only start some of servers by arguments.

Usage:
```
node tools/server.js [-m, --mode] [--readonly]
```

- `mode`: if not provided, all 3 dev servers are started. Otherwise only the specified dev server is started. It could be:
  - `dev`: webpack dev server
  - `sutdio`: Rekit Studio
  - `build`: start a static express server for build folder.
- `readonly`: start the Rekit Studio on readonly mode. It's useful to start a studio server only for explore the project structure. For example, the Rekit Studio [live demo](http://demo.rekit.org) is running on readonly mode.

It's also available as the npm script: `npm start`. 

##### tools/run_test.js
This script is helpful to run one or multiple unit tests. It accepts argument what tests files should be run.

Usage:
```
node tools/run_test.js <file-pattern>
```

The file pattern is the same as what `mocha` accepts. If no `file-pattern` specified, it runs all tests and generates test coverage report. Otherwise run tests matches the pattern.

For example:
```
node tools/run_test.js features/home/redux/counterPlusOne.test.js  // run test of a redux action
node tools/run_test.js features/home // run all tests of home feature
node tools/run_test.js // run all tests and generate test coverage report
```

It's also available as the npm script: `npm test`. 

#### tools/build.js
This script is used to build the project.

Usage:
```
node tools/build.js
```

It's also available as the npm script: `npm run build`. It will build the project to the `build` folder.

### Manage features, components and actions.
This is the key part of daily Rekit development. You will use below commands to mange Rekit elements.

> Note: though all commands are put under the `rekit` command, i.e. `rekit add component home/comp1`. Actually Rekit will find the local `rekit-core` package in your app to finish the operation. So execute `rekit` commands under different Rekit apps may have different behaviors if those apps depends on different versions of `rekit-core`.

All such commands have silimar patterns:

- `rekit add <type>`: add an element of the type.
- `rekit mv <type>`: move/rename an element of the type.
- `rekit rm <type>`: delete an element of the type.

All commands supports [-h] argument to see the usage help. i.e. `rekit add -h`.

Below is the list of all Rekit commands to manage project elements:

<table>
    <thead>
        <tr>
            <th style="text-align: left">Commands</th>
            <th style="text-align: left; width: 250px;">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
          <td>rekit add feature &lt;feature-name&gt;</td>
          <td>Add a new feature.</td>
        </tr>
        <tr>
          <td>rekit mv feature &lt;old-name&gt; &lt;new-name&gt;</td>
          <td>Rename a feature.</td>
        </tr>
        <tr>
          <td>rekit rm feature &lt;feature-name&gt;</td>
          <td>Delete a feature.</td>
        </tr>

        <tr>
          <td>rekit add component &lt;component-name&gt; [-u] [-c]</td>
          <td>
            Add a new component.<br />
            - `-u`: specify the url pattern of the component.
            - `-c`: it's a container component connected to Redux store.
          </td>
        </tr>
        <tr>
          <td>rekit mv component &lt;old-name&gt; &lt;new-name&gt;</td>
          <td>Rename a component.</td>
        </tr>
        <tr>
          <td>rekit rm component &lt;component-name&gt;</td>
          <td>Delete a component.</td>
        </tr>

        <tr>
          <td>rekit add action &lt;action-name&gt; [-a]</td>
          <td>
            Add a new action. <br />
            - `-u`: add an async action.
          </td>
        </tr>
        <tr>
          <td>rekit mv action &lt;old-name&gt; &lt;new-name&gt;</td>
          <td>Rename an action.</td>
        </tr>
        <tr>
          <td>rekit rm action &lt;action-name&gt;</td>
          <td>Delete an action.</td>
        </tr>
    </tbody>
</table>


