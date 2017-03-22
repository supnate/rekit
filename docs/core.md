## Rekit core
[Rekit core](https://github.com/supnate/rekit-core) provides core functions for managing Rekit apps, it's used by both Rekit command line tools and Rekit portal.

When a Rekit app is created, it has auto added `rekit-core` as a dependency. When you execute a command like 'rekit add feature f1' it finds the current installed `rekit-core` in the project to add a feature. So `rekit-core` is not global but project independent. Different Rekit apps may use different versions of `rekit-core`. This gurantees that the upgrade of `rekit-core` doesn't break existing Rekit apps potentially.

## API reference
Rekit core APIs are well modularized and documented. It's the foundation for create custom Rekit plugins.

You can view the API docs at: [https://rekit.js.org/rekit-core/api](https://rekit.js.org/rekit-core/api).

You can create your own plugins based on Rekit-core.


