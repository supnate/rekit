## Concepts
Before starting a Rekit project, some basic concepts of the project need to be explained:
#### Feature
This is the top level concept of a project, also it may be the only new concept here. Each feature corresponds to a logical part of an application. For example, an EShop application usually contains below features:
 * `customer`: manage basic customer information.
 * `product`: manage products on sale.
 * `category`: manage product categories.
 * `order`: manage sales orders.
 * `user`: manage admins of the system.
 * etc...

A feature usually always contains multiple actions, components and pages.

#### Component
It's just React component. In a Rekit project, there are two types of component: one is common component which is not related with any features, it's put in the `src/components` folder. The other is feature component which is provided by a feature, so it is put under the feature folder.

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
