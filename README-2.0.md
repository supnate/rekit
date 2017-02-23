# <img src="/images/logo_text_2.0.png?raw=true" width="260">

> 🎉🎉🎉 Rekit 2.0 is out with nice new features! Check out the [release notes](https://github.com/supnate/rekit/releases/tag/v2.0.0) now!

Rekit is a toolkit for building scalable web applications with React, Redux and React-router.

It helps you focus on business logic rather than dealing with massive libraries, patterns, configurations etc.

[![Version](http://img.shields.io/npm/v/rekit.svg)](https://www.npmjs.org/package/rekit)
[![Build Status](https://travis-ci.org/supnate/rekit.svg?branch=master)](https://travis-ci.org/supnate/rekit)
[![Dependency Status](https://david-dm.org/supnate/rekit.svg?style=flat-square)](https://david-dm.org/supnate/rekit)
[![Coverage Status](https://img.shields.io/codecov/c/github/supnate/rekit/master.svg)](https://codecov.io/github/supnate/rekit)
[![Demo](https://img.shields.io/badge/demo-link-blue.svg)](https://rekit-portal.herokuapp.com)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

Rekit creates apps following general best practices. The apps created are designed to be scalable, testable and maintainable by using [feature oriented architecture](https://github.com), [one action per file pattern](https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da#.9em77fuwk). This ensures application logic is well grouped and decoupled.

Besides creating apps, Rekit also provides powerful tools for managing the project:
 1. [Command line tools](): you can use these tools to create/rename/move/delete project elements like components, actions etc.
 2. [Rekit portal](https://github.com/supnate/rekit-portal): it's a new tool shipped with Rekit 2.0. It not only provides web UIs for creating/renaming/moving/deleting elements of a Rekit app, but also provides tools for analyzing/building/testing a Rekit application. You can think of Rekit portal like an IDE for React development. See a live demo at: [https://rekit-portal.herokuapp.com](https://rekit-portal.herokuapp.com)

To learn more about Rekit, read the overall introduction at:
[Rekit 2.0: the next generation React development]()

And below are two quick video demos:

1. [Counter](): create a simple counter in 1 minute!
2. [Reddit list viewer](): show the latest reactjs topics on reddit, using async actions, in 2 minutes!


## Installation
```
npm install -g rekit
```
This will install a global command `rekit` to the system. Rekit is developed and tested on npm 3+ and node 6+, so this is the prerequisite for using Rekit.

## Usage
Create a new application
```
rekit create app-name [--sass]
```
This will create a new app named `app-name` in the folder `app-name` under the current directory. The `sass` flag allows to use [sass](https://sass-lang.com/) instead of default [less](http://lesscss.org/) as the css transpiler. After creating the app, you need to install dependencies and start the dev server:
```
cd app-name
npm install
npm start
```

It then starts three lightweight express servers by default:
 1. Wepback dev server: [http://localhost:6075](http://localhost:6075). This is the dev server your application is running on.
 2. Rekit portal: [http://localhost:6076](http://localhost:6076). You can browse the project structure quickly from Rekit portal.
 3. Build result test server: [http://localhost:6077](http://localhost:6077). This is the server for verifying the build result before deploying to production server.

To change the ports dev-servers running on, edit the `rekit` section in `package.json`:
```
{
  ...
  "rekit": {
    "devPort": 6075,
    "buildPort": 6076,
    "portalPort": 6077,
    ...
  }
  ...
}
```

## See the Real World Examples
[Rekit portal](https://github.com/supnate/rekit-portal) itself is just a typical Rekit application! So it's a good example for your reference. You can view the live demo at: [https://rekit-portal.herokuapp.com](https://rekit-portal.herokuapp.com). It not only demostrates how a Rekit app is structured but also demostrates the capabilities of Rekit portal.

There is a another simple forum application built with Rekit 1.0 (will be migrated to 2.0 soon). See more introduction at: [http://github.com/supnate/rekit-example](http://github.com/supnate/rekit-example)

## Motivation
While building a React + Redux + React-router application, there are many trival but important tasks to do besides the appication logic itself. These tasks are necessary to construct good architecture but are not actually related with your application funcionality at all. So Rekit is created to do all trival tasks for you so that you can just focus on the business logic.

For example: to create a list page to show recent topics of a forum application, typically you need to finish below tasks before you start writing the real topic list logic:

1. Create a React component class named `TopicList`.
2. Define a routing path for the `TopicList` component in React-router config.
3. Create a style file named `TopicList.less` and import it in the component or somewhere.
4. Use `react-redux` to connect the component to the Redux store.
5. Create four action types as constants: `FETCH_BEGIN`, `FETCH_PENDING`, `FETCH_SUCCESS`, `FETCH_FAILURE`, typically in `constants.js`.
6. Create two actions: `fetchTopicList` and `dismissFetchTopicListError`.
7. Import constants in the action file.
8. Create a reducer handling the four types of actions and define the initial state.
9. Import constants in the reducer file.
10. Create the component unit test file.
11. Create the action unit test file.
12. Create the reducer unit test file.

It's really awful! You need to write tons of code to setup the code structure just before writing the first line of the application logic. And it's even more awful if you want to rename or delete the topic list page! Dozens of places need to be found and correctly updated.

## How Rekit helps?
To resolve the problem described above with Rekit, you just need only 2 commands:
```
rekit add component forum/TopicList
rekit add action forum/fetch-topic-list -a
```

Here `forum` is the feature name, TopicList is a component under the feature. `-a` flag indicates it's an async action.

To rename it from `TopicList` to `Topics`, run below commands:
```
rekit mv component forum/TopicList forum/Topics
rekit mv action forum/fetch-topic-list forum/fetch-topics
```

To remove it, run below commands:
```
rekit rm component forum/TopicList
rekit rm action forum/fetch-topic-list
```

Actuall there is nothing magic behind, Rekit just does what you manually need to do. Every Rekit command will clearly show you what it does behind. For example, below snapshot shows how Rekit renames an async action:

<img src="/images/mv_async_action.png" alt="mv-async-action" />

You would never want to do it manually right? :-P

## Rekit portal
Rekit command line tools have been very useful, but Rekit portal provides a more intuitive and zero learning-cost way: it's almost an IDE for Rekit development! It not only provides web UIs for creating/renaming/moving/deleting elements of a Rekit app, but also provides tools for analyzing/building/testing a Rekit application. See below pictures of how Rekit portal looks like.

<img src="/images/rekit-portal-snapshot.png" alt="rekit-portal-snapshot" />

And you can view the live demo at: [https://rekit-portal.herokuapp.com](https://rekit-portal.herokuapp.com).

You can found more introduction about Rekit portal at: [http://rekit.js.org/portal](http://rekit.js.org/portal).

## Plugins
You can use or create plugins to enhance or customize the behavior of Rekit. That is you can either alter the default behavior like how Rekit creates an async action or let Rekit support more element types like `selector` based on [reselect](https://github.com/reactjs/reselect).

For example, there have been two plugins available:

1. [rekit-plugin-redux-saga](https://github.com/supnate/rekit-plugin-redux-saga): allows Rekit to uses `redux-saga` rather than `redux-thunk` when creating async actions.
2. [rekit-plugin-reselect](https://github.com/supnate/rekit-plugin): adds a new element type named `selector` based on [reselect](https://github.com/reactjs/reselect) to Rekit. So that you can manage selectors by Rekit for your project.

There are two types of plugins:

1. ***Public plugins***: plugins published on npm so that all people could use it.
2. ***Local plugins***: plugins only meet the requirements for your own project. They are placed under `<prjroot>/tools/plugins` folder.

To create a plugin, use below command:
```
rekit create-plugin my-plugin
```
It will create a local plugin if the current directory is in a Rekit project, otherwise create a public plugin.

For more information, please read the document at: [http://rekit.js.org/plugin](http://rekit.js.org/plugin.).

## Key Features
 * It's production-ready but not a starter kit.
 * Zero additional configuration needed after creating an app.
 * Powerful Rekit portal to boost the efficiency of development.
 * Command line tools to mange actions, reducers, components and pages.
 * Embed build script and test server for the build result.
 * Use [Webpack 2](http://webpack.js.org) for bundling.
 * Use [Babel](https://babeljs.io/) for ES2015(ES6)+ support.
 * Use [React hot loader](http://gaearon.github.io/react-hot-loader/) for hot module replacement.
 * Use [Redux](http://redux.js.org/) for application state management.
 * Use immutable state management.
 * Use [React-router](https://github.com/reactjs/react-router) for routing and it's configured with Redux reducer.
 * Not found page configured for React-router.
 * Use [Webpack dll plugin](http://webpack.github.io/docs/list-of-plugins.html#dllplugin) to improve dev-time build performance.
 * Use [Less](http://lesscss.org/) or [Sass](https://sass-lang.com/) as CSS transpilers.
 * Use [mocha](https://mochajs.org/), [enzyme](https://github.com/airbnb/enzyme) for testing.
 * Use [istanbul](https://github.com/gotwarlost/istanbul) for testing coverage report.
 * Use [eslint-config-airbnb](https://github.com/airbnb/javascript) for code style check.
 * Support [Redux dev tools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd).

## Documentation
[http://rekit.js.org](http://rekit.js.org)

## License
MIT
