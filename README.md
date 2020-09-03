# <img src="/images/logo_text.png?raw=true" width="260"> [<img align="right" src="https://opencollective.com/rekit/tiers/backers.svg?avatarHeight=60"/>](https://opencollective.com/rekit)

[![Build Status](https://travis-ci.org/rekit/rekit.svg?branch=master)](https://travis-ci.org/supnate/rekit)
[![Coverage Status](https://img.shields.io/codecov/c/github/rekit/rekit/master.svg)](https://codecov.io/github/rekit/rekit)
[![Gitter](https://badges.gitter.im/supnate/rekit.svg)](https://gitter.im/rekitjs/Lobby?utm_source=share-link&utm_medium=link&utm_campaign=share-link)
[![Demo](https://img.shields.io/badge/demo-link-blue.svg)](http://demo.rekit.org)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Code Quality: Javascript](https://img.shields.io/lgtm/grade/javascript/g/supnate/rekit.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/supnate/rekit/context:javascript)
[![Total Alerts](https://img.shields.io/lgtm/alerts/g/supnate/rekit.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/supnate/rekit/alerts)

*An all-in-one solution for creating modern React apps*

Rekit is a toolkit for building scalable web applications with React, Redux and React-router. It helps you focus on business logic rather than dealing with massive libraries, patterns, configurations etc.

Rekit creates apps bootstrapped by [create-react-app](https://github.com/facebook/create-react-app) and uses an opinionated way to organize folder and code. It's designed to be scalable, testable and maintainable by using [feature oriented architecture](https://medium.com/@nate_wang/feature-oriented-architecture-for-web-applications-2b48e358afb0), [one action per file pattern](https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da#.9em77fuwk). This ensures application logic is well grouped and decoupled.

Rekit consists of two pieces:
 - [Rekit Studio](https://medium.com/free-code-camp/introducing-rekit-studio-a-real-ide-for-react-and-redux-development-baf0c99cb542): A complete IDE for React, Redux, and React Router development
 - [Rekit CLI](http://rekit.js.org/docs/cli.html): A command line tool to create and manage projects, components, actions, etc.

[**Read more about the new Rekit Studio in the blog post**](https://medium.com/@nate_wang/rekit-3-0-531742d0c2c9?sk=5bfe6383ae43d6b18063a070abd79d34)

🎉  [Rekit Now Creates Apps By Create-react-app](https://medium.com/@nate_wang/rekit-now-creates-apps-by-create-react-app-3f0d82fd64f3)

🔥  [Introducing Rekit Studio: a real IDE for React and Redux development](https://medium.com/@nate_wang/introducing-rekit-studio-a-real-ide-for-react-and-redux-development-baf0c99cb542)

🎉  [Using Rekit Studio in an Existing React Project](https://medium.com/@nate_wang/using-rekit-studio-in-an-existing-react-project-39713d9667b)

## Demo

Below is a quick demo video of how Rekit Studio works:

[<img src="/images/rekit-studio-youtube.png" width="500" alt="Rekit Demo"/>](https://youtu.be/i53XffYtWMc "Rekit Demo")

You can also see the live demo at: http://demo.rekit.org

## Installation

If you are on Mac you can use the [desktop app](https://github.com/rekit/rekit-app/releases).

**Install with npm:**

```
npm install -g rekit  # Install Rekit CLI
npm install -g rekit-studio  # Install Rekit Studio
```

This will install the commands `rekit` and `rekit-studio` to the system. Rekit is developed and tested on npm 3+ and node 6+, so this is the prerequisite for using Rekit.

## Usage
Create a new application
```
rekit create <app-name> [--sass]
```
This will create a new app named `app-name` in the current directory. The `--sass` flag allows to use [sass](https://sass-lang.com/) instead of default [less](http://lesscss.org/) as the CSS transpiler. After creating the app, you need to install dependencies:
```
cd app-name
npm install
```
Now, we can start Rekit Studio with:
```
rekit-studio -p 3040
```
Finally, you can open Rekit Studio at http://localhost:3040/. At the bottom in the "Scripts" tab you can find buttons to start, build, and test your app.

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

## Packages
The [Rekit organization](https://github.com/rekit) contains a number of packages.

| Packages  | Description |
| --- | --- |
| rekit-core |[![Version](http://img.shields.io/npm/v/rekit-core.svg)](https://www.npmjs.org/package/rekit-core) Provide core APIs such as create components, rename actions, etc... |
| rekit |[![Version](http://img.shields.io/npm/v/rekit.svg)](https://www.npmjs.org/package/rekit) CLI wrapper of rekit-core, create apps by cloning repo from [rekit-boilerplate-cra](https://github.com/supnate/rekit-boilerplate-cra)  |
| rekit-studio |[![Version](http://img.shields.io/npm/v/rekit-studio.svg)](https://www.npmjs.org/package/rekit-studio) Dedicated IDE for Rekit development, uses rekit-core to manage project too. |
| rekit-plugin-redux-saga |[![Version](http://img.shields.io/npm/v/rekit-plugin-redux-saga.svg)](https://www.npmjs.org/package/rekit-plugin-redux-saga) Use redux-saga instead of redux-thunk for async actions. |
| rekit-plugin-selector |[![Version](http://img.shields.io/npm/v/rekit-plugin-selector.svg)](https://www.npmjs.org/package/rekit-plugin-selector) Support selectors by Rekit cli. |
| rekit-plugin-apollo |[![Version](http://img.shields.io/npm/v/rekit-plugin-apollo.svg)](https://www.npmjs.org/package/rekit-plugin-apollo) Support graphql by [Apollo](https://www.apollographql.com/). |

## Documentation

*Disclaimer:* Some of documentation, particularly around installation, is outdated since the release of 3.0

[http://rekit.js.org](http://rekit.js.org)

## License
MIT
