## Namings

Rekit forces consistent naming rules by auto converting the input. Either command line tools or Rekit Studio follow below naming rules to create features, components and actions. If you create them manually should also follow the rules.

 * `feature`: Folder name: kebab case. For example: `rekit add feature myFeature` will create a folder named `my-feature`.
 * `redux store`: camel case. When adding a feature, Rekit will combine the feature reducer to the root reducer with the camel case as the branch name.
 * `url path`: kebab case. It's converted from the `-u MyPage` argument as it's always mapped to a page. For this command, it defines url path as 'my-page' in the route config.
 * `component`: File name and style file name: pascal case. For example: `rekit add component feature/my-component` will create files `MyComponent.js` and `MyComponent.less`.
 * `action`: Function name: camel case. For example: `rekit add action feature/my-action` will create a function named `myAction` in actions.js.
 * `action type`: Constant name and value: upper snake case. Action types are created when an action is created. For example: `rekit add action home/my-action` will create a action type `HOME_MY_ACTION`.

As you see, whatever names provided as arguments will be converted. So that all variables namings of a Rekit application are always consistent and easy to understand.
