## Get started

The easiest way to try out Rekit is creating a Rekit app and playing with it. It only needs 3 steps:

##### 1. Install Rekit
```
$ npm install -g rekit
```

##### 2. Create an app
```
$ rekit create app my-app
$ cd my-app
$ npm install
```

##### 3. Start it!
```
$ npm start
```

### See the welcome page
The app should be started in a few seconds, then you can access it at: http://localhost:6075.

If everything is ok, you should be able to see the welcome page:

<img src="/images/welcome-page.png" width="600" alt="Rekit Welcome Page"/>

The welcome page consists of 3 parts:

**1. A simple nav component**
It reads the route config of the whole application and generates links to different pages.

**2. A counter demo using sync actions.**
A counter has three buttons `plus`, `minus` and `reset` which control the number it shows. By this sample you can quickly see how normal actions (sync actions) work together for a Redux application.

**3. A demo to fetch latest topics of `reactjs` channel from Reddit**
This is just the same example from the official Redux site: [https://redux.js.org/docs/advanced/ExampleRedditAPI.html](https://redux.js.org/docs/advanced/ExampleRedditAPI.html). It demostrates the [async actions](/docs/concepts#async-action) for a Redux application. But the Rekit version uses one file one action pattern, and it addes error handling which is a common requirement for real-world apps.

These parts demostrate the basic usage of Rekit features, components and actions.

### Try Rekit Portal
Rekit portal is a new dev tool shipped with Rekit 2.0. When a Rekit app is started, the Rekit portal is also auto started by default. You can visit it at: [http://localhost:6076](http://localhost:6076):

<img src="/images/welcome-page.png" width="600" alt="Rekit Welcome Page"/>

It not only provides web UIs for creating/renaming/moving/deleting elements of a Rekit app, but also provides tools for analyzing/building/testing a Rekit application.

From the dashboard, you find test coverage report have not been generated. Don't hesitate to click the run tests button and get a quick view about how Rekit portal helps to do such tasks in a super easy way!

You can learn more from the [Rekit portal](/docs/portal.md) page.

### Try command line tools
Though you can use Rekit portal to manage project elements. Command line tools is also a quick way. Now let's add a new component:
```
$ rekit add component home/new-page -u
```

Then open [http://localhost:6075](http://localhost:6075) you should be able to see it in the left navigtion tree. Click it then you can see the created component has been correctly renderred.

### Two quick tutorial videos
There are two demos on the welcome page, and they are also demos on Redux's official web site. Now let's see how to create them with Rekit.

1. Create a counter with Rekit in 1 minute!
2. Create a reddit list viewer step by step (5 minutes).

### That's it!
You have already created your very first Rekit app and tried its powerful tools! Now you can read more details about Rekit in the following pages.
