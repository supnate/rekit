Rekit
======

[![Version](http://img.shields.io/npm/v/rekit.svg)](https://www.npmjs.org/package/rekit)
[![Build Status](https://travis-ci.org/supnate/rekit.svg?branch=master)](https://travis-ci.org/supnate/rekit)
[![Dependency Status](https://david-dm.org/supnate/rekit.svg?style=flat-square)](https://david-dm.org/supnate/rekit)
[![Demo](https://img.shields.io/badge/Demo-Link-brightgreen.svg)](https://supnate.github.io/rekit-example)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

Rekit is a toolkit for creating and managing React + Redux + React-route projects. Besides creating empty projects with configurations ready, it also provides scripts to generate code for frequently used elements such as components, actions, reducers etc. And it provides the ability to delete them.

The Rekit project boilerplate is designed to be extensible and production-ready, so all technical artifacts are grouped by features. There is a folder for each feature and all feature related actions, reducers, components and pages are put under the folder. Such folder structure supports large and complicated projects.

See the Online Example
=====
There is a simple forum application created with Rekit for reference: [http://github.com/supnate/rekit-example](http://github.com/supnate/rekit-example)

Install
======
```
npm install -g rekit
```
This will install a global command `rekit` to the system. Run the command to create a new project.

A Quick Look
======
When your project is created and npm installed. You can use npm scripts in your project, for example, by running:
```
npm run add:async-action my-feature/save-article
```
You will get code generated for the Redux async action as below:
![Async action code.](/images/async_action.png?raw=true)

More npm scripts usage, see the below documentation.

What Rekit Does
======
1. Create a React + Redux + React-router based project boilerplate with all necessary configurations.
2. Provide command line tools in your project to create and delete features, actions, reducers, components and pages.

Motivation
======
I've been using the draft version of this toolkit for about half of a year and found it is really helpful for improve development efficiency and it also helps to make code consistent among different application logic. Now I'm about to give an online session about how to use React and Redux, so I created this project and the example project to better introduce the technical details. The project was initially created as react-init but that name has existed on npm so I moved it here and named it Rekit.

Key Features
======
 * Always pull the latest package versions when creating a project. That is the new created project always has the latest dependencies.
 * All command line tools are copied to the project so that you fully own it, you can modify the tools to better match your project needs. Once the project is created, Rekit itself is no longer needed.
 * The project structure is designed to be flexible, extensible and predictable.
 * It's production-ready but not a starter kit.
 * Embed build script and test server for the build result.
 * Use [Webpack](http://webpack.github.io) for bundling.
 * Use [Babel](https://babeljs.io/) for ES2015(ES6)+ support.
 * Use [React hot loader](http://gaearon.github.io/react-hot-loader/) for hot module replacement.
 * Use [Redux](http://redux.js.org/) for application state management.
 * Use immutable state management.
 * Use [React-router](https://github.com/reactjs/react-router) for routing and it's configured with Redux reducer.
 * 404 page configured for React-router.
 * Use [Webpack dll plugin](http://webpack.github.io/docs/list-of-plugins.html#dllplugin) to improve dev-time build performance.
 * Use [Less](http://lesscss.org/) as CSS transpiler.
 * Use [eslint-config-airbnb](https://github.com/airbnb/javascript) for code style check.
 * Support [Redux dev tools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd).
 * Command line tools to mange actions, reducers, components and pages.

Design Philosophy
======
1. ***Different application logic for a single functionality should be placed in one place.***
You don't want to jump among different folders to edit code for the same functionality. Such as one functionality usually contains component, actions, reducers, styes, etc. Navigating between these files takes too much time when the project grows large and becomes complicated. So Rekit organizes different parts of a feature into one folder. You can finish a functionality just in one folder.

2. ***Developer should own every line of the project configuration.***
Configuration errors often cause weird behaviors of your application and they are usually very hard to debug. If you don't know how each part of your project works together, you are at the risk of wasting tons of time on configuration errors. So Rekit just creates the project with an initial correct config and put every line of configuration into your project, you should understand and is responsible to maintain it.

3. ***Developer should understand what a tool exactly does when using it.***
Tools could accelerate your development and reduce errors. But if you don't understand what it does behind, then you are at risk. So Rekit copies all tools with source code into your project instead of hiding it behind some commands. The source code is just there for your reference.

4. ***Developer should have his own tool set for the development.***
Rekit provides a basic tool set for a typical React + Redux project. Once the project is created, the tool set has no relationship with Rekit. So they could be easily customized so that it better fits the specific project needs.

Project Folder structure
=====
A Rekit project has below folder structure:

```
|-- project-name
|    |-- src
|    |    |-- features
|    |    |    |-- home
|    |    |    |    |-- actions.js
|    |    |    |    |-- constants.js
|    |    |    |    |-- index.js
|    |    |    |    |-- reducer.js
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
|    |    +-- feature_template
|    |    |-- server.js
|    |    |-- build.js
|    |    |-- ...
|-- .eslintrc
|-- .gitignore
|-- .webpack.dev.config.js
|-- ...
```

This Rekit repo itself is also a Rekit project, you can also browse the project source code to understand the folder structure. Actually this repo itself is the base for creating a new project.

Concepts
======
Before starting a Rekit project, some basic concepts of the project need to be explained:
### Feature
This is the top level concept of a project, also it may be the only new concept here. Each feature corresponds to a logical part of an application. For example, an EShop application usually contains below features:
 * `customer`: manage basic customer information.
 * `product`: manage products on sale.
 * `category`: manage product categories.
 * `order`: manage sales orders.
 * `user`: manage admins of the system.
 * etc...

A feature usually always contains multiple actions, components and pages.

### Component
It's just React component. In a Rekit project, there are two types of component: one is common component which is not related with any features, it's put in the `src/components` folder. The other is feature component which is provided by a feature, so it is put under the feature folder.

### Page
Page is some of special component which maps to the concept of 'Container' in the best practice of [separating presentational and container components](http://redux.js.org/docs/basics/UsageWithReact.html) pattern. A page also usually maps to a specific URL path, so when creating a page also needs to create a routing definition.

### Action
It's just [Redux action](http://redux.js.org/docs/basics/Actions.html).

### Async action
When developing a web application, we often need to request data from server side. It needs to be implemented as an `async-action`. Actually it is not anything new but just combining some normal actions and reducers. In Rekit, when creating an async-action, it creates the code skeleton to handle request begin, request pending, request success, request failure action types. And maintain the requestPending, requestError state in the reducer. With the command line tool `npm run add:async-action` it automatically creates the skeketon and you only need to fill the application logic in different technical artifacts. See below command line tools guide to see more details.

### Reducer
It's just [Redux reducer](http://redux.js.org/docs/basics/Reducers.html).

### Container
The top level container of the application, it usually defines the top level UI layout and it's the container of pages. They are put in `src/containers` folder. Very few containers are needed.

How to Use
======
There are two parts of Rekit. One is the `rekit` command itself which is only used to create a new project. The other part is command line tools which manage the project elements.

### Create a Project
Usage:
```
rekit app-name
```
 * `app-name`: The app name, it's just used as the project folder name.

Example:
```
rekit my-app
```

Result:

It creates an empty project with some initial sample pages and all latest dependencies defined in package.json. Before start the application, you need to install the dependencies manually:
```
cd my-app
npm install
npm start
```
Then access http://localhost:6076, you should see the sample page!

### Build the project
There is a pre-defined npm script to quickly build the project:
```
npm run build
```
To test the build result, you could run below command:
```
npm run build:test
```
The build result is put in the build folder, then you can deploy it to the product server. You should see the same page as which of dev-time at http://localhost:6077.

### Change the default port
There are two ports defined in package.json:
 * `webpackDevServerPort`: port of webpack dev server for development, defaults to 6076, you can change it as you want.
 * `buildTestServerPort`: port of webpack dev server for the build result, defaults to 6077, you can change it as you want.

Command Line Tools
======
The most important part of Rekit is the command line tools copied to your project. They help you to quickly create the boilerplate of frequently-used artifacts such as features, actions, pages, components etc.

### Naming
Before introducing the command line tools, here is the naming rules used for the tools to generate code or files. And what ever names provided to the command line tools, they will be converted to follow below rules. For example, by running `npm run add:page home/my-page` will create a component named `MyPage.js` even if the provided component name is in kebab case.
 * `feature`: Folder name: kebab case. For example: `npm run add:feature myFeature` will create a folder named `my-feature`.
 * `page`: File name and class name: upper first letter. For example: `npm run add:page feature/my-page` will create files `MyPage.js` and `MyPage.less`.
 * `url path`: kebab case. It's converted from the page name as it's always mapped to a page. For above command, it defines url path as 'my-page' in the route config.
 * `component`: File name and class name: upper first letter. For example: `npm run add:component feature/my-component` will create files `MyComponent.js` and `MyComponent.less`.
 * `action`: Function name: camel case. For example: `npm run add:action feature/my-action` will create a function named `myAction` in actions.js.
 * `action type`: Constant name and value: upper snake case. Action types are created when an action is created.  For example: `npm run add:action feature/my-action` will create a action type `MY_ACTION`.


### Add a feature
Usage:
```
npm run add:feature feature-name
```

Args:
* `feature-name`: the feature name.

Example:
```
npm run add:feature product
```
Result:
* Create a folder named `product` under the `src/features/` folder.
* Create files of `actions.js`, `constants.js`, `actions.js`, `reducer.js`, `index.js`, `selectors.js` and `style.less` in the feature folder.
* Import and combine the feature reducer in `src/common/rootReducer.js`
* Import and define the feature routeConfig in `src/common/routeConfig.js`
* Import the feature style.less in `src/styles/index.less`
* Create a default page: `DefaultPage`. See `npm run add:page` command for details.
* Create a sample action: `productSampleAction`. See `npm run add:action` command for details.

### Remove a feature
Usage:
```
npm run rm:feature feature-name
```

Args:
* `feature-name`: the feature name.

Example:
```
npm run rm:feature my-feature
```

Result:
* Remove the folder `src/features/my-feature`.
* Remove the related reducer from `src/common/rootReducer`.
* Remove the related route config from `src/common/routeConfig`.
* Remove the less import from `src/styles/index.less`.

### Add a page
Usage:
```
npm run add:page feature-name/page-name [url-path]
```
Args:
* `feature-name`: the feature name the page belongs to.
* `page-name`: the page name.
* `url-path`: optional. The url path used to define the routing. Defaults to `page-name`.

Example:
```
npm run add:page my-feature/my-page
```

Result:
* Add the page component: `src/features/my-feature/MyPage.js`.
* Add the page style file: `src/features/my-feature/MyPage.less`.
* Export the page component in `src/features/my-feature/index.js`.
* Import MyPage.less in `src/features/my-feature/style.less`.
* Define routing in `src/features/my-feature/route.js` with url path.

### Remove a page
Usage:
```
npm run rm:page feature-name/page-name
```

Args:
* `feature-name`: the feature name the page belongs to.
* `page-name`: the page name to remove.

Example:
```
npm run rm:page my-feature/my-page
```
Result:
* Remove the page component: `src/features/my-feature/MyPage.js`.
* Remove the page style file: `src/features/my-feature/MyPage.less`.
* Remove the page component export in `src/features/my-feature/index.js`.
* Remove MyPage.less import in `src/features/my-feature/style.less`.
* Remove routing config in `src/features/my-feature/route.js`.

### Add a component for a feature
Usage:
```
npm run add:component feature-name/component-name
```

Args:
* `feature-name`: the feature name the component belongs to.
* `component-name`: the component name.

Example:
```
npm run add:component my-feature/my-component
```

Result:
* Add the component: `src/features/my-feature/MyComponent.js`.
* Add the component style file: `src/features/my-feature/MyComponent.less`.
* Export the component in `src/features/my-feature/index.js`.
* Import MyComponent.less in `src/features/my-feature/style.less`.

### Remove a component from a feature
Usage:
```
npm run rm:component feature-name/component-name
```

Args:
* `feature-name`: the feature name the component belongs to.
* `component-name`: the component name.

Example:
```
npm run rm:component my-feature/my-component
```

Result:
* Remove the component: `src/features/my-feature/MyComponent.js`.
* Remove the component style file: `src/features/my-feature/MyComponent.less`.
* Remove the export of component from `src/features/my-feature/index.js`.
* Remove the import MyComponent.less from `src/features/my-feature/style.less`.

### Add a common component
Usage:
```
npm run add:component component-name
```

Args:
* `component-name`: the component name.

Example:
```
npm run add:component my-component
```

Result:
* Add the component: `src/components/MyComponent.js`.
* Add the component style file: `src/components/MyComponent.less`.
* Export the component in `src/components/index.js`.
* Import MyComponent.less in `src/components/style.less`.

### Remove a common component
Usage:
```
npm run rm:component component-name
```

Args:
* `component-name`: the component name.

Example:
```
npm run rm:component my-component
```

Result:
* Remove the component: `src/components/MyComponent.js`.
* Remove the component style file: `src/components/MyComponent.less`.
* Remove the export of component from `src/components/index.js`.
* Remove the import MyComponent.less from `src/components/style.less`.

### Add an action
Usage:
```
npm run add:action feature-name/action-name [action-type]
```
Args:
* `feature-name`: the feature name the action belongs to.
* `action-name`: the action name. It's also used as the action method name.
* `action-type`: optional. The action type name. It's usually not needed. Defaults to `ACTION_NAME`.

Example:
```
npm run add:action feature-name/my-action
```

Result:
* Add action type `MY_ACTION` to `src/features/my-feature/constants.js`.
* Define the action method `myAction()` in `src/features/my-feature/actions.js`.
* Define the switch case `case MY_ACTION:` in `src/features/my-feature/reducer.js`.

### Remove an action
Usage:
```
npm run rm:action feature-name/action-name
```

Usage:
```
npm run add:action feature-name/action-name [action-type]
```
Args:
* `feature-name`: the feature name the action belongs to.
* `action-name`: the action name. It's also used as the action method name.
* `action-type`: optional. The action type name. It's usually not needed. Defaults to `ACTION_NAME`.

Example:
```
npm run rm:action feature-name/my-action
```

Result:
* Remove action type `MY_ACTION` from `src/features/my-feature/constants.js`.
* Remove the action method `myAction()` from `src/features/my-feature/actions.js`.
* Remove the switch case `case MY_ACTION:` from `src/features/my-feature/reducer.js`.

### Add an async action
Usage:
```
npm run add:async-action feature-name/async-action-name
```

Args:
* `feature-name`: the feature name the action belongs to.
* `action-name`: the action name. It's also used as the action method name.

Example:
```
npm run add:async-action feature-name/fetch-topic-list
```

Result:
* Add action type `FETCH_TOPIC_LIST_BEGIN` to `src/features/my-feature/constants.js`.
* Add action type `FETCH_TOPIC_LIST_PENDING` to `src/features/my-feature/constants.js`.
* Add action type `FETCH_TOPIC_LIST_SUCCESS` to `src/features/my-feature/constants.js`.
* Add action type `FETCH_TOPIC_LIST_FAILURE` to `src/features/my-feature/constants.js`.
* Define the action method `fetchTopicList()` in `src/features/my-feature/actions.js`.
* Define the action method `dismissFetchTopicListError()` in `src/features/my-feature/actions.js`.
* Define the switch case `case FETCH_TOPIC_LIST_BEGIN:` in `src/features/my-feature/reducer.js`.
* Define the switch case `case FETCH_TOPIC_LIST_PENDING:` in `src/features/my-feature/reducer.js`.
* Define the switch case `case FETCH_TOPIC_LIST_SUCCESS:` in `src/features/my-feature/reducer.js`.
* Define the switch case `case FETCH_TOPIC_LIST_FAILURE:` in `src/features/my-feature/reducer.js`.

### Remove an async action
Usage:
```
npm run rm:async-action feature-name/async-action-name
```

Args:
* `feature-name`: the feature name the action belongs to.
* `action-name`: the action name. It's also used as the action method name.

Example:
```
npm run rm:action feature-name/fetch-topic-list
```

Result:
* Remove action type `FETCH_TOPIC_LIST_BEGIN` from `src/features/my-feature/constants.js`.
* Remove action type `FETCH_TOPIC_LIST_PENDING` from `src/features/my-feature/constants.js`.
* Remove action type `FETCH_TOPIC_LIST_SUCCESS` from `src/features/my-feature/constants.js`.
* Remove action type `FETCH_TOPIC_LIST_FAILURE` from `src/features/my-feature/constants.js`.
* Remove the action method `fetchTopicList()` from `src/features/my-feature/actions.js`.
* Remove the action method `dismissFetchTopicListError()` from `src/features/my-feature/actions.js`.
* Remove the switch case `case FETCH_TOPIC_LIST_BEGIN:` from `src/features/my-feature/reducer.js`.
* Remove the switch case `case FETCH_TOPIC_LIST_PENDING:` from `src/features/my-feature/reducer.js`.
* Remove the switch case `case FETCH_TOPIC_LIST_SUCCESS:` from `src/features/my-feature/reducer.js`.
* Remove the switch case `case FETCH_TOPIC_LIST_FAILURE:` from `src/features/my-feature/reducer.js`.

Todos
=====
* Unit test support.
* Localization support.
* [Sass](http://sass-lang.com/) support.
* Tools to rename/move features, pages, components, actions.

FAQ
=====
No questions yet.:-)

License
=====
[MIT](LICENSE). Copyright (c) 2016 Nate Wang.
