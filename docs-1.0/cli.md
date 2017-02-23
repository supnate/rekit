# Command Line Tools
Besides the Sublime plugin, you can use command line tools to complete common tasks like testing, creating/removing features, actions, pages, components etc.

Below is the list of all npm scripts provided by Rekit:

<table>
    <thead>
        <tr>
            <th style="text-align: left">Tools</th>
            <th style="text-align: left">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
          <td>npm run add:feature feature-name</td>
          <td>Add a new feature.</td>
        </tr>
        <tr>
          <td>npm test</td>
          <td>Run app tests.</td>
        </tr>
        <tr>
          <td>npm test test-file</td>
          <td>Run specific test files.</td>
        </tr>
        <tr>
          <td>npm test:cli</td>
          <td>Run command line tools tests.</td>
        </tr>
        <tr>
          <td>npm run rm:feature feature-name</td>
          <td>Remove a feature.</td>
        </tr>
        <tr>
          <td>npm run add:page feature-name/page-name[url-path]</td>
          <td>Add a new page.</td>
        </tr>
        <tr>
          <td>npm run rm:page feature-name/page-name</td>
          <td>Remove a page.</td>
        </tr>
        <tr>
          <td>npm run add:component [feature-name/]component-name</td>
          <td>Add a new component.</td>
        </tr>
        <tr>
          <td>npm run rm:component [feature-name/]component-name</td>
          <td>Remove a component.</td>
        </tr>
        <tr>
          <td>npm run add:action feature-name/action-name [action-type]</td>
          <td>Add a new action.</td>
        </tr>
        <tr>
          <td>npm run rm:action feature-name/action-name [action-type]</td>
          <td>Remove an action.</td>
        </tr>
        <tr>
          <td>npm run add:async-action feature-name/action-name</td>
          <td>Add a new async action.</td>
        </tr>
        <tr>
          <td>npm run rm:async-action feature-name/action-name</td>
          <td>Remove an async action.</td>
        </tr>
    </tbody>
</table>

### Naming
Before introducing the command line tools, here is the naming rules used for the tools to generate code or files. And what ever names provided to the command line tools, they will be converted to follow below rules. For example, by running `npm run add:page home/my-page` will create a component named `MyPage.js` even if the provided component name is in kebab case.
 * `feature`: Folder name: kebab case. For example: `npm run add:feature myFeature` will create a folder named `my-feature`.
 * `page`: File name and class name: upper first letter. For example: `npm run add:page feature/my-page` will create files `MyPage.js` and `MyPage.less`.
 * `url path`: kebab case. It's converted from the page name as it's always mapped to a page. For above command, it defines url path as 'my-page' in the route config.
 * `component`: File name and class name: upper first letter. For example: `npm run add:component feature/my-component` will create files `MyComponent.js` and `MyComponent.less`.
 * `action`: Function name: camel case. For example: `npm run add:action feature/my-action` will create a function named `myAction` in actions.js.
 * `action type`: Constant name and value: upper snake case. Action types are created when an action is created.  For example: `npm run add:action feature/my-action` will create a action type `MY_ACTION`.


### Adding a feature
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
* Create files of `actions.js`, `constants.js`, `reducer.js` in the redux folder and `index.js`, `selectors.js` and `style.less` in the feature folder.
* Import and combine the feature reducer in `src/common/rootReducer.js`
* Import and define the feature routeConfig in `src/common/routeConfig.js`
* Import the feature style.less in `src/styles/index.less`
* Create a default page: `DefaultPage`. See `npm run add:page` command for details.
* Create a sample action: `productSampleAction`. See `npm run add:action` command for details.

### Removing a feature
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

### Adding a page
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
* Add a unit test file `test/app/features/my-feature/MyPage.test.js`.

### Removing a page
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
* Remove the unit test file `test/app/features/my-feature/MyPage.test.js`.

### Adding a component for a feature
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
* Add a unit test file `test/app/features/my-feature/MyComponent.test.js`.

### Removing a component from a feature
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
* Remove the unit test file `test/app/features/my-feature/MyComponent.test.js`.

### Adding a common component
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
* Add a unit test file `test/app/components/MyComponent.test.js`.

### Removing a common component
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
* Remove the unit test file `test/app/comonents/MyComponent.test.js`.

### Adding an action
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
npm run add:action my-feature/my-action
```

Result:
* Add a action file `src/features/my-feature/redux/myAction.js
* Add action type `MY_ACTION` to `src/features/my-feature/redux/constants.js`.
* Import and export the action method `myAction` in `src/features/my-feature/redux/actions.js`.
* Import the reducer in `src/features/my-feature/redux/reducer.js`.
* Add a test file `src/features/my-feature/redux/myAction.test.js`.

### Removing an action
Usage:
```
npm run rm:action feature-name/action-name
```

Usage:
```
npm run add:action my-feature/action-name [action-type]
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
* Remove the action file `src/features/my-feature/redux/myAction.js
* Remove action type `MY_ACTION` from `src/features/my-feature/redux/constants.js`.
* Remove the import/export `myAction` from `src/features/my-feature/redux/actions.js`.
* Remove the import from `src/features/my-feature/redux/reducer.js`.
* Remove the test file `src/features/my-feature/redux/myAction.test.js`.

### Adding an async action
Usage:
```
npm run add:async-action feature-name/async-action-name
```

Args:
* `feature-name`: the feature name the action belongs to.
* `action-name`: the action name. It's also used as the action method name.

Example:
```
npm run add:async-action my-feature/fetch-topic-list
```

Result:
* Add action type `FETCH_TOPIC_LIST_BEGIN` to `src/features/my-feature/redux/constants.js`.
* Add action type `FETCH_TOPIC_LIST_PENDING` to `src/features/my-feature/redux/constants.js`.
* Add action type `FETCH_TOPIC_LIST_SUCCESS` to `src/features/my-feature/redux/constants.js`.
* Add action type `FETCH_TOPIC_LIST_FAILURE` to `src/features/my-feature/redux/constants.js`.
* Add a action file `src/features/my-feature/redux/fetchTopicList.js
* Import and export `fetchTopicList`, `dismissFetchTopicListError` from `src/features/my-feature/redux/actions.js`.
* Add a test file `src/features/my-feature/redux/fetchTopicList.test.js`.


### Removing an async action
Usage:
```
npm run rm:async-action feature-name/async-action-name
```

Args:
* `feature-name`: the feature name the action belongs to.
* `action-name`: the action name. It's also used as the action method name.

Example:
```
npm run rm:action my-feature/fetch-topic-list
```

Result:
* Remove action type `FETCH_TOPIC_LIST_BEGIN` to `src/features/my-feature/redux/constants.js`.
* Remove action type `FETCH_TOPIC_LIST_PENDING` to `src/features/my-feature/redux/constants.js`.
* Remove action type `FETCH_TOPIC_LIST_SUCCESS` to `src/features/my-feature/redux/constants.js`.
* Remove action type `FETCH_TOPIC_LIST_FAILURE` to `src/features/my-feature/redux/constants.js`.
* Remove the action file `src/features/my-feature/redux/fetchTopicList.js
* Remove the import/export `fetchTopicList`, `dismissFetchTopicListError` from `src/features/my-feature/redux/actions.js`.
* Remove the test file `src/features/my-feature/redux/fetchTopicList.test.js`.
