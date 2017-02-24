## Namings

Rekit forces consistent naming rules. Either command line tools or Rekit portal follow below naming rules to create features, components and actions. If you create them manually should also follow the rules.

> NOTE: Whatever names provided as arguments will be converted. For example, the command `rekit add component home/my-page` will create a component named `MyPage.js` even the provided component name is in kebab case.

 * `feature`: Folder name: kebab case. For example: `rekit add feature myFeature` will create a folder named `my-feature`.
 * `redux store`: camel case. When adding a feature, Rekit will combine the feature reducer to the root reduer with the camel case as the branch name.
 * `url path`: kebab case. It's converted from the `-u` argument as it's always mapped to a page. For above command, it defines url path as 'my-page' in the route config.
 * `component`: File name and style file name: pascal case. For example: `rekit add component feature/my-component` will create files `MyComponent.js` and `MyComponent.less`.
 * `action`: Function name: camel case. For example: `rekit add action feature/my-action` will create a function named `myAction` in actions.js.
 * `action type`: Constant name and value: upper snake case. Action types are created when an action is created. For example: `rekit add action feature/my-action` will create a action type `MY_ACTION`.
