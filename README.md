Rekit
======

[![Version](http://img.shields.io/npm/v/rekit.svg)](https://www.npmjs.org/package/rekit)
[![Build Status](https://travis-ci.org/supnate/rekit.svg?branch=master)](https://travis-ci.org/supnate/rekit)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

Rekit is a toolkit to create and mange a React + Redux + React-router based SPA project. It uses  the feature oriented project structure I prefer. That is all code is organized by features. There is a folder for each feature and all feature related actions, reducers, components and pages are put under the folder. If you are also comfortable with this pattern, you may find Rekit very useful because you can only be focus on your application logic instead of technical details.

Install
======
```
npm install -g rekit
```
This will install a global command `rekit` to the system. Run the command could create a new project.

What Rekit Does
======
1. Create a React + Redux + React-router based project boilerplate with all necessary configurations.
2. Provide command line tools to create and delete features, actions, reducers, components and pages.

Motivation
======
I've been using the draft version of this toolkit for about one year and found it is really helpful for improve development efficiency  and it also helps to make code consistent among different application logic. Now I guess it will also help others with similar thought, so I created this project. The project was initially created as react-init but that name has existed on npm so I moved it here and named it Rekit.

Key Features
======
 * Always pull the latest package versions when creating a project. That is the new created project always has the latest dependencies.
 * All command line tools are copied to the project so that you fully own it, you can modify the toolset to better match your project needs. Once the project is created, Rekit itself is no longer needed.
 * Use Webpack for bundling.
 * Use Babel for ES2015(ES6)+ support.
 * Use React hot loader for hot module replacement.
 * Use Webpack dll plugin to improve dev-time build performance.
 * Use Less as CSS solution.
 * Use Redux for application state management.
 * Use React-router for routing and it's configured with Redux reducer.
 * Use eslint-config-airbnb for code style check.
 * Support Redux dev tools.
 * Command line tools to mange actions, reducers, components and pages.

Design Philosophy
======
1. ***Different application logic for a single target should be placed in one place.***
You don't want to jump among different folders to edit code for the same mission. Especially when the project grows and becomes complicated, navigating between files takes too much time. So Rekit organizes different parts of a feature into one folder. The folder name is just the feature name.

2. ***Developer should own every line of the project configuration.***
Configuration errors often cause weird behaviors of your application and they are usually very hard to debug. If you don't know how each part of your project works together, you are in risk to waste tons of time on configuration errors. So Rekit just creates the project with an initial correct config, then you own it and is responsible to maintain it.

3. ***Developer should understand what a tool exactly does when using it.***
Tools could accelerate your development and reduce errors. But if you don't understand what it does behind, then you are in risk. So Rekit copies all tools with source code into your project instead of hiding it behind some commands.

4. ***Developer should have his own tool set for the development.***
Rekit provides a basic tool set for a typical React project. Once the project is created, the tool set has no relationship with Rekit. So they could be easily customized so that it better fits the specific project needs.

Concepts
======
Before starting a Rekit project, some basic concepts of the project needs to be explained:
### Feature
This is the top level concept of a project, also it may be the only new concept for you. Each feature corresponds to a logical part of an application. For example, an EShop application usually contains below features:
 * customer: manage basic customer information.
 * product: manage products on sale.
 * category: manage product categories.
 * order: manage sales orders.
 * user: manage admins of the system.
 * etc...

A feature usually always contains multiple actions, components and pages.

### Component
It's just React component. In a Rekit project, components are divided to two types: one is common component which is not related with any features, it's put at the components folder. The other is feature component which is provided by a feature, so it is put under the feature folder.

### Page
Page is some of a special component which is used as router component. That is a page is usually mapped to a specific URL pattern. When creating a page, the tool also registers a URL in the react router config. Page is usually displayed directly in the container.

### Action
It's just Redux action.

### Container
It's just the concept of container in High Order Component patter.


How to Use
======
There are two parts of Rekit. One is the `rekit` command itself which is only used to create a new project. The other part is command line tools which manage the project elements.

### Create a Project
Usage:
```
rekit feature-name
```
 * `feature-name`: 

Example:
```
rekit my-app
```

Result:
It creates an empty project and all latest dependencies defined in package.json. Before start the application, you need to install the dependencies manually:
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
The build result is put at build folder, the you can deploy it to the product server. Then access http://localhost:6077, you should see the same page as above.

### Change the default port
There are two ports defined in package.json:
 * `webpackDevServerPort`: defaults to 6076, you can change it as you want.
 * `buildTestServerPort`: defaults to 6077, you can change it as you want.

Command Line Tools
======
The most important part of Rekit is the command line tools copied to your project. They help you to quickly create the boilerplate of frequently-used elements such as features, actions, pages, components etc.

### Naming
Before introducing the command line tools, here is the naming rules used for the tools to generate code or files. And what ever names provided to the command line tools, they will be converted to follow below rules:
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
Example:
```
npm run add:feature product
```
What it does:
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
### Add a page
Usage:
```
npm run add:page feature-name/page-name
```
### Remove a page
Usage:
```
npm run rm:page feature-name/page-name
```
### Add a component
Usage:
```
npm run add:component feature-name/component-name
```
### Remove a component
Usage:
```
npm run rm:component feature-name/component-name
```
### Add an action
Usage:
```
npm run add:action feature-name/action-name
```
### Remove an action
Usage:
```
npm run rm:action feature-name/action-name
```
### Add an async action
Usage:
```
npm run add:action-action feature-name/async-action-name
```
### Remove an async action
Usage:
```
npm run rm:action-action feature-name/async-action-name
```

Limitations
=====
* Unit test support
* Rename features, pages, components, actions

License
=====
MIT