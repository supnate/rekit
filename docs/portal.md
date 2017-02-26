## Rekit portal

Rekit portal is a ne dev tool shiped with Rekit 2.0. It's not only CLI wrappers, but also a central place to manage and analyze your application. It's motivated by different problems of React, Redux development:

1. UI interface is zero learning cost, and more intuitive than CLIs, just as you always create a Java class using eclipse like IDE.
2. Are you confident about how a system works if you'd not touched it for 3 months?
3. How does a new team member quickly dive it into a project?
4. What's the effect to a project if you want to do hacks for some special cases.

With these objectives, Rekit portal aims to be a powerful and easy to use IDE for React, Redux development, though there still be a long way to go. But I believe it has a good start:

### Project explorer
The project explorer provides a more meaningful view of the project folder structure by grouping source files by `features`, `actions`, `components`. You can easily see the functionality structure rather than just folder structure. You can see it at the left side of Rekit portal:

<img src="/images/portal-project-explorer.png" width="300" alt="project-explorer" />

Besides displaying the project structure, it also provides context menus to manage project elements like component.

### Dashboard
The dashboard provides an overall status view of the project such as overview diagram, test coverage etc.

<img src="/images/portal-dashboard.png" width="700" alt="project-explorer" />

### Overview diagram
The most notible part of the dashboard is the overview diagram. It's an intuitive view about the architecture of a Rekit project. It's also interactive, you can mouse move to different features, components, actions to see the relation ship to some specific element. You can also click a node to deep dive into it. Below information is covered by the overview diagram:

1. Relationship between modules.
2. The relative size of features.
3. How a feature is composed.

When mouseover an element, the diagram will highlight the current element and the relationship which is only about the current element.

> Ideally, there should be no dependecies between features. Then they could be pluggable and easier to understand. But in real projects you need to balance the architecture and development efficiency. So it's totally acceptable if there are light-weight dependencies between features. But a principle is to avoid too many dependencies between features. You can delay the refactor of removing dependencies when some type of dependencies become too complicated.

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


### Test coverage
Rekit uses [istanbul](https://github.com/gotwarlost/istanbul) to generate test coverage report.
After running all tests against the project, the test coverage will be available.
Running a single test or tests of a folder does not generate coverage report.
Note that if some tests failed, the report data may be incomplete.

### Manage project elements

### Run build

### Run tests

