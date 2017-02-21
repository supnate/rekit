## Styling

Rekit uses [Less](http://lesscss.org) as the css pre-processor because I've been used to it for long time. [Scss](http://sass-lang.com/guide) support will be a candidate in near future. Actually in my opinon there's not much difference between the two and they easy to switch.

Unlike many practices import less file in a React component, Rekit recommends to just use Less itself to manage dependencies. This approach has several advantages:

1. Css could be built and generated separtely.
2. Importing less from a React component is not a standard way but just a webpack loader's feature.
3. Css-loader for webpack generates duplicate Css code for the build if the component is used more than one time.

The approach used by Rekit is intuitive, described by below picture:

<img src="/images/styling.png" width="600" alt="Styling"/>

In general, styling for a Rekit application follows below several rules:

1. Global style is defined in `src/styles/global.less`, such as css for body, h1, h2...
2. Each component has a style file with the same name, for example, component `SimpleNav.js` has style file named `SimpleNave.less`.
3. Each feature has a style file named `style.less` which imports all necessary style files for pages and components. All feature scope common style is also defined in the file.
4. The `src/styles/index.less` is the entry style file which imports all feature's `style.less` and `global.less`.

For other scenarios, feel free to use the way you like.
