## Bundling

Webpack is also considered one of the most difficult parts for building a React application. Luckily again Rekit setups everything for you. There are 2 webpack config files corresponding to different usage:

* `webpack.config.js`: it's a webpack config factory for dev, dll and dist bundling.
* `webpack.test.config.js`: the config for test build.

#### Boost the build performance by using webpack-dll-plugin
When a React application grows large, the build time in dev time takes long time. The `webpack-dll-plugin` could resolve the problem. There's little doc about it but there's a great article introducing it: http://engineering.invisionapp.com/post/optimizing-webpack/ . Rekit takes use the approach mentioned in the article.

The basic idea is to build common libs such as React, Redux, React-router into a separate dll bundle. So that they don't need to be built every time your code is changed. By doing this the build time could be significantly reduced.

Rekit integrates the process in `tools/server.js` which is run when calling `npm start`. The script checks versions of all packages needed for the dll build. So that it auto builds a new dll when any dependency version is changed.


