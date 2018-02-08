## Routing

Rekit uses [React Router V4](https://github.com/ReactTraining/react-router) as the routing solution. It's almost the standard way for React web applications. With [React-router-redux](https://github.com/reactjs/react-router-redux) you can easily sync the routing state with the Redux store.

Though React Router V4 provides very powerful features Rekit just use the very basic functionality to do "page" level routing. If you want to use it for very detailed routing like tab switch. Just use it as usual.

Routing is very important even for a simple application. Just like a traditional web application needs different URLs for different page, a sigle page application also needs it to group different logic into different UI parts, which is the Page concept of Rekit.

With Rekit, when you create a component with some url path, it will also create a rule for React Router to map the url to the component.

### Route configuration
Since Rekit use feature oriented folder structure, so does route configuration. That is all feature related route config is also defined in the feature folder. Each feature has a `route.js` file where you define the route rules. Below is a sample configuration:
```javascript
import {
  EditPage,
  ListPage,
  ViewPage,
} from './index';

export default {
  path: '',
  name: '',
  childRoutes: [
    { path: '', component: ListPage, name: 'Topic List', isIndex: true },
    { path: 'topic/add', component: EditPage, name: 'New Topic' },
    { path: 'topic/:topicId', component: ViewPage },
  ],
};
```

#### Using JavaScript to define route rules
From above example, we can see route config uses JavaScript. Actually React router supports [Json for configuration](https://github.com/ReactTraining/react-router/blob/master/docs/guides/RouteConfiguration.md). Rekit takes use of it so that it's easy to seperates different routing config into different features. Below is a Json routes config example from the React router official doc:
```javascript
const routes = {
  path: '/',
  component: App,
  indexRoute: { component: Dashboard },
  childRoutes: [
    { path: 'about', component: About },
    {
      component: Inbox,
      childRoutes: [{
        path: 'messages/:id', component: Message
      }]
    }
  ]
}
```

Below is the pattern used by Rekit so that different routes config could be defined in their features:
```javascript
import topicRoute from '../features/topic/route';
import commentRoute from '../features/comment/route';

const routes = [{
  path: '/rekit-example',
  component: App,
  childRoutes: [
    topicRoute,
    commentRoute,
    { path: '*', name: 'Page not found', component: PageNotFound },
  ],
}];
```
It shows how to import and use routes config from features `topic` and `comment`.
> Note that you don't need to maintain the file `src/common/routeConfig.js` manually, Rekit will auto add and remove the rule when adding/removing a feature.

#### Using `isIndex` property instead of indexRoute
Unlink the JSX way to define route config with `<IndexRoute ...>` tag, the official `indexRoute` config for JavaScript API is a difficult part for Rekit because it prevents defining all necessary incofmation in different features. So Rekit adds the support by using `isIndex` property. A routing rule with `isIndex: true` will become the index route for the parent. Below code is the route config for the auto created `home` feature:
```javascript
import {
  DefaultPage,
  TestPage1,
  TestPage2,
} from './index';

export default {
  path: '',
  name: 'home',
  childRoutes: [
    { path: 'default-page', component: DefaultPage, isIndex: true },
    { path: 'test-page-1', component: TestPage1 },
    { path: 'test-page-2', component: TestPage2 },
  ],
};
```
The `DefaultPage` then becomes the index route for the root path.

#### The `name` property
You may have noticed there is a `name` property for the route config rule. Actually it's only used by the `SimpleNav` component. It's only a handy component for displaying links from the route config in dev time. You have seen in the welcome page. It may be useless for a real world application.

All other usage of route config API is just the same with the official way, you can refer to the [React-router official docs](https://github.com/ReactTraining/react-router/blob/master/docs/guides/RouteConfiguration.md).

