## Concepts
Rekit doesn't wrap or change any API of React, Redux or React router but just provides tools to manage necessary boilerplate code for you. So there are no new concepts(except feature) in the project. If you can understand React, Redux and React router, you can understand Rekit projects easily.

Below is just the description about how those concepts are used/managed by Rekit.

#### Feature
Feature is the top level concept of a project, and it's the core concept of Rekit. A feature is actually a natural concept that describes some capability of an application. For example, an EShop application usually contains below features:

 * `customer`: manage basic customer information.
 * `product`: manage products on sale.
 * `category`: manage product categories.
 * `order`: manage sales orders.
 * `user`: manage admins of the system.
 * etc...

A feature usually always contains multiple actions, components or routing rules. A Rekit application always consists of multiple features.

There are two default features created automatically for a new Rekit application:

1. `common`: it's the place you put all cross-feature elements such as components, actions, etc. In Rekit 1.0, there was a `components` folder outside of all features where you put common components. Now they are expected to be put here in Rekit 2.0. This change reduces the number of conepts and makes the folder structure more consistent.
2. `home`: the base feature of the project and the start point of the application. Usually the most basic functionality is put here, such as the overall layout container, fundamental application data, etc.

However this is just the way recommended by Rekit. Don't hesitate to rename or delete the default features if you want.

To get a quick feel on feature concept, just look at the Rekit portal live demo: [https://rekit-portal.herokuapp.com](https://rekit-portal.herokuapp.com).

And the next chapter will describe the thought of [feature oriented architecture]() behind Rekit.

#### Component
It's just the component concept of React. [By Redux](http://redux.js.org/docs/basics/UsageWithReact.html), components could be divided into categories: `container` and `presentational`. Actually the key difference is whether to connect component to the Redux store. So Rekit allows to create these two types of components by setting options:
```
rekit add component home/Comp [-c]
```
The `-c` flag indicates it's a container component. Rekit will use different template to generate a component.

To use the component with React router, that is a component is represented on some url pattern, Rekit allows to specify a `-u` argument:
```
rekit add component home/Page1 -u page1
```

This will define a React router rule in the `route.js` file of the feature. Then you can access the component by http://localhost/home/page1.


#### Action
It's just [Redux action](http://redux.js.org/docs/basics/Actions.html). There are two types of actions: sync and async. As described in Redux's doc, async actions are actually not new concepts but indicates a work flow of async operations.

By default Rekit uses `redux-thunk` for async actions. When creating an async-action, Rekit creates the code boilerplate to handle request begin, request pending, request success, request failure action types. And maintain the requestPending, requestError state in the reducer. With the command line tool `npm run add:async-action` it automatically creates the skeleton and you only need to fill the application logic in different technical artifacts. See below command line tools guide to see more details.

```
rekit add action home/doRequest [-a]
```
The `-a` flag indicates if it's an async action.

#### Reducer
It's just [Redux reducer](http://redux.js.org/docs/basics/Reducers.html). But Rekit re-organizes the code structure for reducers compared to the official way. See the [one action one file]() chapter.
