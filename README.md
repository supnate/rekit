# <img src="/images/logo_text.png?raw=true" width="260">

**Rekit 3.0 is out:** https://medium.com/@nate_wang/rekit-3-0-531742d0c2c9?sk=5bfe6383ae43d6b18063a070abd79d34

[<img src="https://opencollective.com/rekit/tiers/backers.svg?avatarHeight=50"/>](https://opencollective.com/rekit)


> NOTE: below content is not updated for the new 3.0. Read the article above for more information.

------

🎉  [Rekit Now Creates Apps By Create-react-app](https://medium.com/@nate_wang/rekit-now-creates-apps-by-create-react-app-3f0d82fd64f3)

🔥  [Introducing Rekit Studio: a real IDE for React and Redux development](https://medium.com/@nate_wang/introducing-rekit-studio-a-real-ide-for-react-and-redux-development-baf0c99cb542)

🎉  [Using Rekit Studio in an Existing React Project](https://medium.com/@nate_wang/using-rekit-studio-in-an-existing-react-project-39713d9667b)

**Try Rekit 3.0 with a desktop app: https://github.com/rekit/rekit-app/releases**

**Or see the guide for a web version: https://github.com/rekit/rekit/issues/201**

Rekit is a toolkit for building scalable web applications with React, Redux and React-router. It's an all-in-one solution for creating modern React apps.

It helps you focus on business logic rather than dealing with massive libraries, patterns, configurations etc.

[![Build Status](https://travis-ci.org/rekit/rekit.svg?branch=master)](https://travis-ci.org/supnate/rekit)
[![Coverage Status](https://img.shields.io/codecov/c/github/rekit/rekit/master.svg)](https://codecov.io/github/rekit/rekit)
[![Gitter](https://badges.gitter.im/supnate/rekit.svg)](https://gitter.im/rekitjs/Lobby?utm_source=share-link&utm_medium=link&utm_campaign=share-link)
[![Demo](https://img.shields.io/badge/demo-link-blue.svg)](http://demo.rekit.org)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Code Quality: Javascript](https://img.shields.io/lgtm/grade/javascript/g/supnate/rekit.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/supnate/rekit/context:javascript)
[![Total Alerts](https://img.shields.io/lgtm/alerts/g/supnate/rekit.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/supnate/rekit/alerts)

Rekit creates apps bootstrapped by [create-react-app](https://github.com/facebook/create-react-app) and uses an opinionated way to organize folder and code. It's designed to be scalable, testable and maintainable by using [feature oriented architecture](https://medium.com/@nate_wang/feature-oriented-architecture-for-web-applications-2b48e358afb0), [one action per file pattern](https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da#.9em77fuwk). This ensures application logic is well grouped and decoupled.

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
rekit create <app-name> [--sass]
```
This will create a new app named `app-name` in the current directory. The `--sass` flag allows to use [sass](https://sass-lang.com/) instead of default [less](http://lesscss.org/) as the CSS transpiler. After creating the app, you need to install dependencies and start the dev server:
```
cd app-name
npm install
npm start
```

It then starts two express servers by default:

 1. Webpack dev server: [http://localhost:6075](http://localhost:6075). Just what create-react-app starts.
 2. Rekit Studio: [http://localhost:6076](http://localhost:6076). The IDE for Rekit projects.

To change the ports dev-servers running on, edit the `rekit` section in `package.json`:
```
{
  ...
  "rekit": {
    "devPort": 6075,
    "studioPort": 6076,
    ...
  }
  ...
}
```

## Packages
This repo contains multiple packages managed by [yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/).

| Packages  | Description |
| --- | --- |
| rekit-core |[![Version](http://img.shields.io/npm/v/rekit-core.svg)](https://www.npmjs.org/package/rekit-core) Provide core APIs such as create components, rename actions, etc... |
| rekit |[![Version](http://img.shields.io/npm/v/rekit.svg)](https://www.npmjs.org/package/rekit) CLI wrapper of rekit-core, create apps by cloning repo from [rekit-boilerplate-cra](https://github.com/supnate/rekit-boilerplate-cra)  |
| rekit-studio |[![Version](http://img.shields.io/npm/v/rekit-studio.svg)](https://www.npmjs.org/package/rekit-studio) Dedicated IDE for Rekit development, uses rekit-core to manage project too. |
| rekit-plugin-redux-saga |[![Version](http://img.shields.io/npm/v/rekit-plugin-redux-saga.svg)](https://www.npmjs.org/package/rekit-plugin-redux-saga) Use redux-saga instead of redux-thunk for async actions. |
| rekit-plugin-selector |[![Version](http://img.shields.io/npm/v/rekit-plugin-selector.svg)](https://www.npmjs.org/package/rekit-plugin-selector) Support selectors by Rekit cli. |
| rekit-plugin-apollo |[![Version](http://img.shields.io/npm/v/rekit-plugin-apollo.svg)](https://www.npmjs.org/package/rekit-plugin-apollo) Support graphql by [Apollo](https://www.apollographql.com/). |

## Key Features
 * It's production-ready but not a starter kit.
 * Zero additional configuration needed after creating an app.
 * Dedicated IDE for Rekit development.
 * Command line tools to manage actions, reducers, components and pages.
 * Bootstrapped by [create-react-app](https://github.com/facebook/create-react-app), all your knowledge about it still works.
 * Use [Webpack 3](http://webpack.js.org) for bundling.
 * Use [Babel](https://babeljs.io/) for ES2015(ES6)+ support.
 * Use [React hot loader](http://gaearon.github.io/react-hot-loader/) for hot module replacement.
 * Use [Redux](http://redux.js.org/) for application state management.
 * Use [React-router](https://github.com/reactjs/react-router) for routing and it's configured with Redux reducer.
 * Use [Webpack dll plugin](https://webpack.js.org/plugins/dll-plugin/#src/components/Sidebar/Sidebar.jsx) to improve dev-time build performance.
 * Use [Less](http://lesscss.org/) or [Sass](https://sass-lang.com/) as CSS transpilers.
 * Use [jest](https://facebook.github.io/jest/), [enzyme](https://github.com/airbnb/enzyme) for testing.
 * Support [Redux dev tools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd).

## Documentation
[http://rekit.js.org](http://rekit.js.org)

## License
MIT
