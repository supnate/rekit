# Rekit Studio

Rekit Studio is a new dev tool shipped with Rekit 2.0. It's a central place to manage and analyze your Rekit project. Rekit Studio itself is also created with Rekit, so it's also a good real-world example of Rekit for reference.

[![Version](http://img.shields.io/npm/v/rekit-studio.svg)](https://www.npmjs.org/package/rekit-studio)
[![Build Status](https://travis-ci.org/supnate/rekit-studio.svg?branch=master)](https://travis-ci.org/supnate/rekit-studio)
[![Dependency Status](https://david-dm.org/supnate/rekit-studio.svg?style=flat-square)](https://david-dm.org/supnate/rekit-studio)
[![Demo](https://img.shields.io/badge/demo-link-blue.svg)](http://demo.rekit.org)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

To have a quick view on how Rekit Studio works, you can look at the [live demo](http://demo.rekit.org).

### Key features

1. Provide a more intuitive way to create, rename, move or delete features, components or actions than CLI. Just like you always create a Java class using an IDE like eclipse.
2. Generate diagram reports of the project architecture by source code. So that new team members, or yourself several months later could learn the project easier.
3. Easy to run tests of a single component or action by just right click on it.
4. Run build without opening a terminal.
5. Integrated test coverage report.

### Installation
You don't need to install Rekit Studio manually. When a new Rekit app is created, the `rekit-portal` is auto dependent as a npm module. You should be able to access Rekit Studio at [http://localhost:6076](http://localhost:6076) by default.

### Project explorer
The project explorer provides a more meaningful view of the project folder structure by grouping source files by `features`, `actions`, `components`. You can easily see the functionality structure rather than just folder structure. You can see it at the left side of Rekit Studio:

<img src="/images/portal-project-explorer.png" width="300" alt="project-explorer" />

Besides displaying the project structure, it also provides context menus to manage project elements like component.

### Dashboard
The dashboard provides an overall status view of the project such as overview diagram, test coverage etc.

<img src="/images/portal-dashboard.png" width="700" alt="dashboard" />

### Overview diagram
The most notible part of the dashboard is the overview diagram. It's an intuitive view about the architecture of a Rekit project. It's also interactive, you can mouse move to different features, components, actions to see the relationship of some specific element. You can also click a node to deep dive into it. Below information is covered by the overview diagram:

1. Relationship between modules.
2. The relative size of features.
3. How a feature is composed.

When mouseover an element, the diagram will highlight the current element and the relationship which is only about the current element.

Ideally, there should be no circular-dependecies among features. So that they are pluggable and easier to understand. But in real projects you need to balance the architecture and development efficiency. So it's acceptable if there are light-weight circular-dependencies between features while a principle is to avoid too many such dependencies. You can delay the refactor of removing dependencies when some type of dependencies become too complicated.

Here is a list about what different colors and lines mean:

<table>
  <tbody>
    <tr>
      <td style="vertical-align: middle; text-align: center; width: 140px;"><img src="/images/overview-diagram-feature.png" width="110" alt="color-feature"/></td>
      <td>Features.</td>
    </tr>
    <tr>
      <td style="vertical-align: middle; text-align: center; width: 140px;"><img src="/images/overview-diagram-action.png" width="110" alt="color-action"/></td>
      <td>Actions.</td>
    </tr>
    <tr>
      <td style="vertical-align: middle; text-align: center; width: 140px;"><img src="/images/overview-diagram-component.png" width="110" alt="color-component"/></td>
      <td>Components.</td>
    </tr>
    <tr>
      <td style="vertical-align: middle; text-align: center; width: 140px;"><img src="/images/overview-diagram-misc.png" width="110" alt="color-misc"/></td>
      <td>Misc files.</td>
    </tr>
    <tr>
      <td style="vertical-align: middle; text-align: center; width: 140px;"><img src="/images/overview-diagram-dep1.png" width="110" alt="color-dep-on"/></td>
      <td>A module depends on others.</td>
    </tr>
    <tr>
      <td style="vertical-align: middle; text-align: center; width: 140px;"><img src="/images/overview-diagram-dep2.png" width="110" alt="color-dep-by"/></td>
      <td>A module is dependent by others.</td>
    </tr>
    <tr>
      <td style="vertical-align: middle; text-align: center; width: 140px;"><img src="/images/overview-diagram-dep3.png" width="110" alt="color-dep-internal"/></td>
      <td>A module depends on others in the same feature.</td>
    </tr>
  </tbody>
</table>

### Element diagram
While the overview diagram shows the overall architecture of the project, the element diagram provides a focused view of the relationship between the selected element and others. It helps to understand a module quickly, and helps to find out over-complicated modules.

When you click an element from the project explorer or the overview diagram, it will show the element diagram by default:

<img src="/images/element-diagram.png" width="550" alt="element-diagram" />

### Test coverage
Rekit uses [istanbul](https://github.com/gotwarlost/istanbul) to generate test coverage report.
After running all tests against the project, the test coverage will be available.
Running a single test or tests of a folder does not generate coverage report.
Note that if some tests failed, the report data may be incomplete.

You can see the overall test coverage report from dashboard or the original report generated by [istanbul-nyc](https://github.com/istanbuljs/nyc) from the test coverage detail page.

### Manage project elements
Rekit Studio wraps command line tools into UI dialogs, with which you can intuitively create, rename or delete components, actions etc. To open a dialog, right click an element in the project exploer and click the corresponding menu item.

<img src="/images/cmd-dialogs.png" width="700" alt="cmd-dialogs" />

### Run build
Rekit Studio executes the build script `tools/build.js` under your project when click the menu item `Build`. It reads the webpack build progress data to update the progress bar. Though `build.js` created by Rekit looks a bit complex but you can update it per your requirement after you fully understand how it works.

<img src="/images/portal-build.png" width="550" alt="build" />


### Run tests
Rekit Studio executes the test script `tools/run_test.js` under your project when click the menu item `Run tests`. The script accepts the argument which tests to run, it could be one single file or a folder. When no argument provides, it runs all tests under `tests` folder, and generates test coverage report. See more in [command line tools](/docs/cli.md) page.

So when click `Run test` menu item on a project element like component, it just executes `tools/run_test.js` behind and pass the current component test file as the argument to the script. You can also update `run_test.js` script on your requirement.

<img src="/images/portal-test.png" width="550" alt="test" />

### Code viewer
It helps to quickly view the source code of the project. For example, when select an component, by default it shows the diagram view, but you can switch to the code view where you can view the source code of the component. And you could also easily view the style code or test file. For now Rekit hasn't support editing code directly because it doesn't intend to replace your favorite text editors.

<img src="/images/element-page.png" width="700" alt="element-page" />

