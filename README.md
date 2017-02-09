# <img src="/images/logo_text.png?raw=true" width="228">

> Rekit 2.0 is coming! You could try it by `npm install -g rekit@next`. Also you could the preview live demo at: https://rekit-portal.herokuapp.com . Note that the docs here are mainly for 1.0. There will be some changes for 2.0, but don't worry, it will be fully compatible with 1.0 apps :-P.

Rekit is a toolkit for building scalable web applications with React, Redux and React-router.

It helps you focus on business logic rather than dealing with massive libraries, patterns, configurations etc.

[![Version](http://img.shields.io/npm/v/rekit.svg)](https://www.npmjs.org/package/rekit)
[![Build Status](https://travis-ci.org/supnate/rekit.svg?branch=master)](https://travis-ci.org/supnate/rekit)
[![Dependency Status](https://david-dm.org/supnate/rekit.svg?style=flat-square)](https://david-dm.org/supnate/rekit)
[![Coverage Status](https://img.shields.io/codecov/c/github/supnate/rekit/master.svg)](https://codecov.io/github/supnate/rekit)
[![Demo](https://img.shields.io/badge/demo-link-blue.svg)](https://supnate.github.io/rekit-example)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

A Rekit generated application is designed to be scalable, testable and maintainable by using feature-oriented folder structure, one action per file pattern. This ensures application logics are well decoupled.

With Rekit [Sublime text plugin](https://github.com/supnate/rekit-sublime), it's super easy to create features, components, actions, tests, etc by side bar menus. And you can test or build your applications without leaving the editor. Besides the plugin, all the features are also available as npm scripts, they could be used within a terminal.

Here is a tutorial about how to use Rekit on Medium:
[Using Rekit to quickly create a React app](https://medium.com/@nate_wang/using-rekit-to-quickly-create-a-react-app-108bcc07e7f)

And here is a quick demo:

[<img src="/images/youtube.png" width="400" alt="Rekit Demo"/>](https://youtu.be/9lqWoQjy-JY "Rekit Demo")

For Chinese, please visit the demo on [Youku(优酷)](http://v.youku.com/v_show/id_XMTcyNTQxNzgwNA==.html):

## Installation
```
npm install -g rekit
```
This will install a global command `rekit` to the system. Run the command to create a new project. Rekit is developed and tested on npm 3+ and node 4+, so this is the prerequisite for using Rekit.

## Usage
```
rekit [-h] [-v] app-name
```
This will create a new app named `app-name` in the folder `app-name` under the current directory. After creating the application, you need to install dependencies and start the dev server:
```
cd app-name
npm install
npm start
```
Then access [http://localhost:6076](http://localhost:6076) you will see a [welcome page](/docs/welcome-page.md) including some simple samples. 

The default port for webpack dev server is 6076, and it's 6077 for the build version. Change them in package.json if needed:
```
{
  ...
  "webpackDevServerPort": 6076,
  "buildTestServerPort": 6077,
  ...
}
```

## Sublimetext Plugin
Sublime text plugin provides sidebar menus for a Rekit application by which you can easily do common tasks like creating components, running tests etc, see more introduction from: https://github.com/supnate/rekit-sublime

## See the Real World Example
There is a simple forum application, connected to a real backend server, created by Rekit for reference. See more introduction from: [http://github.com/supnate/rekit-example](http://github.com/supnate/rekit-example)

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

## Folder Structure
Rekit creates a web application with a special folder structure. It groups application logic by features. Each feature contains its own components, actions, routing config etc. Because of the fixed folder structure, we can easily generate code for common React + Redux tasks by writing tools. Rekit provides a powerful set of command line tools which help you writing code with consistent namings, places and tests.

```
|-- project-name
|    |-- src
|    |    |-- features
|    |    |    |-- home
|    |    |    |    +-- redux
|    |    |    |    |-- index.js
|    |    |    |    |-- DefaultPage.js
|    |    |    |    |-- DefaultPage.less
|    |    |    |    |-- route.js
|    |    |    |    |-- styles.less
|    |    |    |    |-- ...
|    |    |    +-- feature-1
|    |    |    +-- feature-2
|    |    |-- components
|    |    |-- common
|    |    |-- containers
|    |    +-- styles
|    |-- tools
|    |    +-- cli
|    |    |-- server.js
|    |    |-- build.js
|    |    |-- ...
|-- .eslintrc
|-- .gitignore
|-- .webpack.dev.config.js
|-- ...
```

## Philosophy
1. ***Different application logic for a single functionality should be placed in one place.***
You don't want to jump among different folders to edit code for the same functionality. Such as one functionality usually contains component, actions, reducers, styes, etc. Navigating between these files takes too much time when the project grows large and becomes complicated. So Rekit organizes different parts of a feature into one folder. You can finish a functionality just in one folder.

2. ***Developer should own every line of the project configuration.***
Configuration errors often cause weird behaviors of your application and they are usually very hard to debug. If you don't know how each part of your project works together, you are at the risk of wasting tons of time on configuration errors. So Rekit just creates the project with an initial correct config and put every line of configuration into your project, you should understand and is responsible to maintain it.

3. ***Developer should understand what a tool exactly does when using it.***
Tools could accelerate your development and reduce errors. But if you don't understand what it does behind, then you are at risk. So Rekit copies all tools with source code into your project instead of hiding it behind some commands. The source code is just there for your reference.

4. ***Developer should have his own tool set for the development.***
Rekit provides a basic tool set for a typical React + Redux project. Once the project is created, the tool set has no relationship with Rekit. So they could be easily customized so that it better fits the specific project needs.

## Key Features
 * Always pull the latest and verified package versions when creating a project. That is the new created project always has the latest dependencies.
 * All command line tools are copied to the project so that you fully own it, you can modify the tools to better match your project needs. Once the project is created, Rekit itself is no longer needed.
 * It's production-ready but not a starter kit.
 * Embed build script and test server for the build result.
 * Use [Webpack](http://webpack.github.io) for bundling.
 * Use [Babel](https://babeljs.io/) for ES2015(ES6)+ support.
 * Use [React hot loader](http://gaearon.github.io/react-hot-loader/) for hot module replacement.
 * Use [Redux](http://redux.js.org/) for application state management.
 * Use immutable state management.
 * Use [React-router](https://github.com/reactjs/react-router) for routing and it's configured with Redux reducer.
 * Not found page configured for React-router.
 * Use [Webpack dll plugin](http://webpack.github.io/docs/list-of-plugins.html#dllplugin) to improve dev-time build performance.
 * Use [Less](http://lesscss.org/) as CSS transpiler.
 * Use mocha, enzyme, istanbul for testing.
 * Use [eslint-config-airbnb](https://github.com/airbnb/javascript) for code style check.
 * Support [Redux dev tools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd).
 * Command line tools to mange actions, reducers, components and pages.


## Documentation
http://rekit.js.org

## License
MIT
