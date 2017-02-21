# <img src="/images/logo_text.png?raw=true" width="228">

> 🎉🎉🎉 Rekit 2.0 is out! Check out the release notes at: https://github.com/supnate/rekit/releases/tag/v2.0.0

Rekit is a toolkit for building scalable web applications with React, Redux and React-router.

It helps you focus on business logic rather than dealing with massive libraries, patterns, configurations, best practices etc.

[![Version](http://img.shields.io/npm/v/rekit.svg)](https://www.npmjs.org/package/rekit)
[![Build Status](https://travis-ci.org/supnate/rekit.svg?branch=master)](https://travis-ci.org/supnate/rekit)
[![Dependency Status](https://david-dm.org/supnate/rekit.svg?style=flat-square)](https://david-dm.org/supnate/rekit)
[![Coverage Status](https://img.shields.io/codecov/c/github/supnate/rekit/master.svg)](https://codecov.io/github/supnate/rekit)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

A Rekit generated application is designed to be scalable, testable and maintainable by using [feature oriented architecture](https://github.com), [one action per file pattern](one) (aka [ducks](ducks)). This ensures application logic is well grouped and decoupled.

Besides creating an application, Rekit also provides very powerful tools for managing the project:
 1. [Command line tools](): you can use these tools to create/rename/move/delete project elements like components, actions etc.
 2. [Rekit portal](): it's a new tool shipped with Rekit 2.0. It not only provides the UI wrapper of command line tools for ease of use, but also provides an easier way to unerstand the project, such as project architecture diagram, intuitive element page, etc. You can think of Rekit portal as an IDE for React development.

To learn more about Rekit, read the overall introduction at:
[Using Rekit to quickly create a React app](https://medium.com/@nate_wang/using-rekit-to-quickly-create-a-react-app-108bcc07e7f)

And here is a quick demo:
[<img src="/images/youtube.png" width="400" alt="Rekit Demo"/>](https://youtu.be/9lqWoQjy-JY "Rekit Demo")

For Chinese, please visit the demo on [Youku(优酷)](http://v.youku.com/v_show/id_XMTcyNTQxNzgwNA==.html):

## Installation
```
npm install -g rekit
```
This will install a global command `rekit` to the system. Rekit is developed and tested on npm 3+ and node 4+, so this is the prerequisite for using Rekit.

## Usage
Create a new application
```
rekit create app-name [--sass]
```
This will create a new app named `app-name` in the folder `app-name` under the current directory. The `sass` flag allows to use [sass]() instead of default [less]() as the css transpiler. After creating the application, you need to install dependencies and start the dev server:
```
cd app-name
npm install
npm start
```

It then starts three lightweight express servers by default:
 1. Wepback dev server: [http://localhost:6075](http://localhost:6075). This is the dev server your application is running on.
 2. Rekit portal: [http://localhost:6076](http://localhost:6076). You can browse the project structure quickly from Rekit portal.
 3. Build result test server: [http://localhost:6077](http://localhost:6077). This is the server for verifying the build result before deploying to production server.

To change the ports dev-servers runniong on, edit the `rekit` section in `package.json`:
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

## See the Real World Example
Rekit portal itself is just a typical Rekit application! So it's a good example for your reference. You can view the live demo at: [https://rekit-portal.herokuapp.com](https://rekit-portal.herokuapp.com). It not only demostrates how a Rekit app is structured but also the capabilities of Rekit portal.

There is a another simple forum application built with Rekit 1.0 (will be migrated to 2.0 soon). See more introduction from: [http://github.com/supnate/rekit-example](http://github.com/supnate/rekit-example)

## Motivation


## Motivation
Building web applications is hard today because there are too many technologies to learn. But it's also charming today, because there are so many great libraries helping to build complicated things in elegant ways. After enjoying creating a pretty large application mainly with React, Redux and React-router, I decided to summarize it and make the approach re-usable, so I created Rekit. Actually it is mainly based on the toolset I created for the project.

While building a React + Redux + React-router application, there are many trival but important tasks to do besides the appication logic. These tasks construct a good application architecture but are not related with your application funcionalities.

For example: a forum application needs a list page to display topics. Typically you need to finish below tasks before you start writing the topic list logic:

1. Create a React component class named `TopicList`.
2. Define a routing path for the `TopicList` component in React-router config.
3. Create a style file named `TopicList.css` and import it in the component or somewhere.
4. Use `react-redux` to connect the component to the Redux store.
5. Create four action types as constants: `FETCH_BEGIN`, `FETCH_PENDING`, `FETCH_SUCCESS`, `FETCH_FAILURE`, typically in `constants.js`.
6. Create two actions: `fetchTopicList` and `dismissFetchTopicListError`.
7. Import constants in the action file.
8. Create a reducer handling the four types of actions and define the initial state.
9. Import constants in the reducer file.
10. Create the component unit test file.
11. Create the action unit test file.
12. Create the reducer unit test file.

It's really awful! You need to write tons of code to setup the code structure just before writing the first line of the application logic. After repeating the same process dozens of times manually, I created tools to automate it.

Because the toolkit is based on the opinionate approach which I think is more scalable and testable, it could do more things than general code generators. Such as:

* It knows where to define routing config.
* It knows where to put constants.
* It knows how to define action types based on the action name.
* It knows how to create reducers based on action type.
* It knows how to create meaningful test cases.

And also because of the Rekit tools, the opinonate approach could be guranteed because almost all project elements could be generated by Rekit. So folder structure, namings, configurations could be always consistent so that they are easy to understand, analyze, test and maintain.

## Key Features
 * It's production-ready but not a starter kit.
 * Zero additional configuration needed after creating an app.
 * Powerful Rekit portal to boost the efficiency of development.
 * Command line tools to mange actions, reducers, components and pages.
 * Embed build script and test server for the build result.
 * Use [Webpack](http://webpack.github.io) for bundling.
 * Use [Babel](https://babeljs.io/) for ES2015(ES6)+ support.
 * Use [React hot loader](http://gaearon.github.io/react-hot-loader/) for hot module replacement.
 * Use [Redux](http://redux.js.org/) for application state management.
 * Use immutable state management.
 * Use [React-router](https://github.com/reactjs/react-router) for routing and it's configured with Redux reducer.
 * Not found page configured for React-router.
 * Use [Webpack dll plugin](http://webpack.github.io/docs/list-of-plugins.html#dllplugin) to improve dev-time build performance.
 * Use [Less](http://lesscss.org/) or [Sass]() as CSS transpilers.
 * Use mocha, enzyme, istanbul for testing.
 * Use [eslint-config-airbnb](https://github.com/airbnb/javascript) for code style check.
 * Support [Redux dev tools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd).

## Documentation
http://rekit.js.org

## License
MIT
