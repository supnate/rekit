# <img src="/images/logo_text.png?raw=true" width="260">

> 🎉🎉🎉  [Introducing Rekit Studio: a real IDE for React and Redux development](https://medium.com/@nate_wang/introducing-rekit-studio-a-real-ide-for-react-and-redux-development-baf0c99cb542)

> 🎉🎉🎉  [Using Rekit Studio in an Existing React Project](https://medium.com/@nate_wang/using-rekit-studio-in-an-existing-react-project-39713d9667b)

Rekit is a toolkit for building scalable web applications with React, Redux and React-router. It's an all-in-one solution for creating modern React apps.

It helps you focus on business logic rather than dealing with massive libraries, patterns, configurations etc.

[![Version](http://img.shields.io/npm/v/rekit.svg)](https://www.npmjs.org/package/rekit)
[![Build Status](https://travis-ci.org/supnate/rekit.svg?branch=master)](https://travis-ci.org/supnate/rekit)
[![Coverage Status](https://img.shields.io/codecov/c/github/supnate/rekit/master.svg)](https://codecov.io/github/supnate/rekit)
[![Gitter](https://badges.gitter.im/supnate/rekit.svg)](https://gitter.im/rekitjs/Lobby?utm_source=share-link&utm_medium=link&utm_campaign=share-link)
[![Demo](https://img.shields.io/badge/demo-link-blue.svg)](http://demo.rekit.org)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

Rekit creates apps using an opinionated folder and code structure. It's designed to be scalable, testable and maintainable by using [feature oriented architecture](https://medium.com/@nate_wang/feature-oriented-architecture-for-web-applications-2b48e358afb0), [one action per file pattern](https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da#.9em77fuwk). This ensures application logic is well grouped and decoupled.

Besides creating apps, Rekit provides powerful tools for managing the project:

 1. [Rekit Studio](https://medium.com/@nate_wang/introducing-rekit-studio-a-real-ide-for-react-and-redux-development-baf0c99cb542): the real IDE for React, Redux development.
 2. [Command line tools](http://rekit.js.org/docs/cli.html): besides Rekit Studio, you can use command line tools to create/rename/move/delete project elements like components, actions etc. It has better support for Rekit plugin system.

Below is a quick demo video of how Rekit works:

[<img src="/images/rekit-studio-youtube.png" width="500" alt="Rekit Demo"/>](https://youtu.be/i53XffYtWMc "Rekit Demo")

The demo contains two parts, which are examples in Redux's official website:

1. Create a simple counter in 1 minute!
2. Show the latest reactjs topics on Reddit using async actions.

## Live Demo
You can also see the live demo at: http://demo.rekit.org

## Installation
```
npm install -g rekit
```
This will install a global command `rekit` to the system. Rekit is developed and tested on npm 3+ and node 6+, so this is the prerequisite for using Rekit.

## Usage
Create a new application
```
rekit create <app-name> [--sass] [--clean]
```
This will create a new app named `app-name` in the current directory. The `--sass` flag allows to use [sass](https://sass-lang.com/) instead of default [less](http://lesscss.org/) as the CSS transpiler. The `--clean` flag is used to create a clean app without any sample code. After creating the app, you need to install dependencies and start the dev server:
```
cd app-name
npm install
npm start
```

It then starts three lightweight express servers by default:

 1. Webpack dev server: [http://localhost:6075](http://localhost:6075). This is the dev server your application is running on.
 2. Rekit Studio: [http://localhost:6076](http://localhost:6076). The IDE for Rekit projects.
 3. Build result test server: [http://localhost:6077](http://localhost:6077). This is the server for verifying the build result before deploying to production server.

To change the ports dev-servers running on, edit the `rekit` section in `package.json`:
```
{
  ...
  "rekit": {
    "devPort": 6075,
    "studioPort": 6076,
    "buildPort": 6077,
    ...
  }
  ...
}
```

## Packages
This repo contains multiple packages managed by [yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/).

| Packages  | Description |
| --- | --- |
| rekit-core  | Provide core APIs such as create components, rename actions, etc... |
| rekit  | The CLI wrapper of rekit-core, and create apps by clone repo from [rekit-boilerplate](https://github.com/supnate/rekit-boilerplate)  |
| rekit-studio | Dedicated IDE for Rekit development, uses rekit-core to manage project too. |
| rekit-plugin-redux-saga | Use redux-saga instead of redux-thunk for async actions. |
| rekit-plugin-selector | Support selectors by Rekit cli. |

## Key Features
 * It's production-ready but not a starter kit.
 * Zero additional configuration needed after creating an app.
 * Dedicated IDE for Rekit development.
 * Command line tools to manage actions, reducers, components and pages.
 * Embed build script and test server for the build result.
 * Use [Webpack 3](http://webpack.js.org) for bundling.
 * Use [Babel](https://babeljs.io/) for ES2015(ES6)+ support.
 * Use [React hot loader](http://gaearon.github.io/react-hot-loader/) for hot module replacement.
 * Use [Redux](http://redux.js.org/) for application state management.
 * Use [React-router](https://github.com/reactjs/react-router) for routing and it's configured with Redux reducer.
 * Use [Webpack dll plugin](http://webpack.github.io/docs/list-of-plugins.html#dllplugin) to improve dev-time build performance.
 * Use [Less](http://lesscss.org/) or [Sass](https://sass-lang.com/) as CSS transpilers.
 * Use [mocha](https://mochajs.org/), [enzyme](https://github.com/airbnb/enzyme) for testing.
 * Use [istanbul](https://github.com/gotwarlost/istanbul) for testing coverage report.
 * Support [Redux dev tools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd).
 * Proxy to API in DEV like [create-react-app](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#proxying-api-requests-in-development). e.g.  fetch(/api/\<your path>) 


## Documentation
[http://rekit.js.org](http://rekit.js.org)

## License
MIT
