## Concepts
Rekit doesn't wrap or change any API of React, Redux or React router but just provides tools to do trival tasks for you. So there are no new concepts in the project. If you can understand React, Redux and React router, you can understand Rekit projects easily.

Below is just the description about how those concepts are used/managed by Rekit.

#### Feature
This is the top level concept of a project, and it's the core concept of Rekit. A feature is some capability of an application. For example, an EShop application usually contains below features:
 * `customer`: manage basic customer information.
 * `product`: manage products on sale.
 * `category`: manage product categories.
 * `order`: manage sales orders.
 * `user`: manage admins of the system.
 * etc...

A feature usually always contains multiple actions, components or routing rules.

There are two default features created automatically for a new Rekit application:

1. `common`: it's the place you put all cross-feature elements such as components, actions, etc. In Rekit 1.0, there was a `components` folder outside of all features where you put common components. Now they are expected to be put here in Rekit 2.0. This change reduces the number of conepts and makes the folder structure more consistent.
2. `home`: the base feature of the project and the start point of the application. Usually the most basic functionality is put here, such as the overall layout container, fundamental application data, etc.

However this is just the way recommended by Rekit. Don't hesitate to rename or delete the default features if you want.

To get a quick feel on feature concept, just look at the Rekit portal live demo: [https://rekit-portal.herokuapp.com](https://rekit-portal.herokuapp.com).

And the next chapter will describe the thought of [feature oriented architecture]() behind Rekit.

#### Component
It's just the component concept of React.

#### Page
Page is some of special component which maps to the concept of 'Container' in the best practice of [separating presentational and container components](http://redux.js.org/docs/basics/UsageWithReact.html) pattern. A page also usually maps to a specific URL path, so when creating a page also needs to create a routing definition.

#### Action
It's just [Redux action](http://redux.js.org/docs/basics/Actions.html).

#### Async action
When developing a web application, we often need to request data from server side. It needs to be implemented as an `async-action`. Actually it is not anything new but just combining some normal actions and reducers. In Rekit, when creating an async-action, it creates the code skeleton to handle request begin, request pending, request success, request failure action types. And maintain the requestPending, requestError state in the reducer. With the command line tool `npm run add:async-action` it automatically creates the skeleton and you only need to fill the application logic in different technical artifacts. See below command line tools guide to see more details.

#### Reducer
It's just [Redux reducer](http://redux.js.org/docs/basics/Reducers.html).

### Container
The top level container of the application, it usually defines the top level UI layout and it's the container of pages. They are in `src/containers` folder. Very few containers are needed.
