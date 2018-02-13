## Get started

The easiest way to try out Rekit is creating a Rekit app and playing with it. Just 3 steps:

##### 1. Install Rekit
```
$ npm install -g rekit
```

##### 2. Create an app
```
$ rekit create my-app
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

<img src="/images/welcome-page.png" width="700" alt="Rekit Welcome Page"/>

The welcome page consists of 3 parts:

**1. A simple nav component**
It reads the route config of the whole application and generates links to different pages.

**2. A counter demo using sync actions.**
By the sample you can quickly see how component, actions and reducers work together.

**3. A demo to fetch latest topics of `reactjs` channel from Reddit**
This is just the same example from the official Redux site: [https://redux.js.org/docs/advanced/ExampleRedditAPI.html](https://redux.js.org/docs/advanced/ExampleRedditAPI.html). It demonstrates the [async actions](/docs/concepts#async-action) for a Redux application. But the Rekit version uses [one action one file pattern](/docs/one-action-one-file.md), and it adds error handling which is a common requirement for real-world apps.

### Using Rekit Studio
Rekit Studio is the IDE for Rekit projects. When a Rekit app is started, Rekit Studio is also auto started at: [http://localhost:6076](http://localhost:6076) by default:

<img src="/images/rekit-studio.png" width="700" alt="Rekit Studio"/>

See a full introduction at: https://medium.com/@nate_wang/introducing-rekit-studio-a-real-ide-for-react-and-redux-development-baf0c99cb542

### Where to start
Rekit creates a single page application by default. You may need to edit the root container first to define your own container layout. The source file is at `src/features/home/App.js`.

### Two quick tutorial videos
There are two samples on the welcome page, and they are also demos on Redux's official web site. Now let's see how to create them with Rekit.

1. [Create a counter with Rekit in 1 minute!](https://youtu.be/HT6YzZtbPKc)

<img src="/images/youtube.png" width="400" alt="Demo video" />

2. [Create a Reddit list viewer step by step (5 minutes).](https://youtu.be/edq5lWsxZMg)

<img src="/images/youtube.png" width="400" alt="Demo video" />

### That's it!
You have already created your very first Rekit app and tried powerful Rekit tools! Now you can read more details about Rekit in the following pages.
