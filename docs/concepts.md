## Concepts
Rekit doesn't wrap or change any API of React, Redux or React router. But just creates apps following general best practices and provides tools to manage the projects. So there are no new concepts(maybe except feature) in the project. If you can understand React, Redux and React router, you can understand Rekit projects easily.

Below is just the description about how those concepts are used or managed by Rekit.

#### Feature
Feature is the top level concept of a project, and it's the core concept of Rekit. A feature is actually a natural way to describe some capability of an application. For example, an e-shop application usually contains below features:

 * `customer`: manage basic customer information.
 * `product`: manage products on sale.
 * `category`: manage product categories.
 * `order`: manage sales orders.
 * `user`: manage admins of the system.
 * etc...

A feature usually always contains multiple actions, components or routing rules. A Rekit application always consists of multiple features. By this approach, a large application could always be divided into multiple small, well-decoupled, understandable features.

There are two default features created automatically for a new Rekit application:

1. **common**: it's the place you put all cross-feature elements such as components, actions, etc. In Rekit 1.0, there was a `components` folder outside of all features where you put common components. Now they are expected to be put in `common` feature in Rekit 2.0. This change reduces the number of conepts and makes the folder structure more simple and consistent.
2. **home**: the base feature of the project and the start point of the application. Usually the most basic functionality is put here, such as the overall layout container, fundamental application logic, etc.

However this is just the way recommended by Rekit. Don't hesitate to rename or delete the default features if you want.

To get a quick feel on feature concept, you can look at the Rekit Studio live demo: [http://demo.rekit.org](http://demo.rekit.org).

See more instroduction about feature concept in the chapter: [feature oriented architecture](https://medium.com/@nate_wang/feature-oriented-architecture-for-web-applications-2b48e358afb0).

#### Component
It's just React component. [According to Redux](http://redux.js.org/docs/basics/UsageWithReact.html), components could be divided into two categories: `container` and `presentational`. You can create them with Rekit easily:
```
rekit add component home/Comp [-c]
```
The `-c` flag indicates it's a container component, otherwise a presentational one. Rekit will use different template to generate the component.

To use the component with React router, that is a component is represented on some url pattern, Rekit allows to specify a `-u` argument:
```
rekit add component home/Page1 -u page1
```

This will define a React router rule in the `route.js` file under the feature folder. Then you can access the component at http://localhost:6075/home/page1.

#### Action
It's just [Redux action](http://redux.js.org/docs/basics/Actions.html). There are two types of actions: sync and async. As described in Redux's doc, async action isn't actually a new concept but describes a work flow of async operations.

By default Rekit uses `redux-thunk` for async actions. When creating an async-action, Rekit creates the code boilerplate to handle request begin, request pending, request success, request failure action types. And maintains the `requestPending`, `requestError` state in the reducer. With the below command line tool, it automatically creates the boilerplate of an async action and you only need to fill the application logic in different technical artifacts:

```
rekit add action home/doRequest [-a]
```
The `-a` flag indicates if it's an async action, otherwise a sync action.

Alternatively, you can install [rekit-plugin-redux-saga](https://github.com/supnate/rekit-plugin-redux-saga) to create async actions with [redux-saga](https://github.com/redux-saga/redux-saga).

#### Reducer
It's just [Redux reducer](http://redux.js.org/docs/basics/Reducers.html). Rekit re-organizes the code structure for reducers compared to the official way. See the [one action one file](/docs/one-action-one-file) page for more introduction.
