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

### See the examples
The app should be started in a few seconds, then you can access it at: http://localhost:6075.

When a Rekit app is created, there will be an examples feature in it. You can see it at: http://localhost:6075/examples:

The examples feature has two examples:

**1. A counter demo using sync actions.**
By the sample you can quickly see how component, actions and reducers work together.

**2. A demo to fetch latest topics of `reactjs` channel from Reddit**
This is just the same example from the official Redux site: [https://redux.js.org/docs/advanced/ExampleRedditAPI.html](https://redux.js.org/docs/advanced/ExampleRedditAPI.html). It demonstrates the [async actions](/docs/concepts#async-action) for a Redux application. But the Rekit version uses [one action one file pattern](/docs/one-action-one-file.md), and it adds error handling which is a common requirement for real-world apps.

### Using Rekit Studio
Rekit Studio is the IDE for Rekit projects. When a Rekit app is started, Rekit Studio is also auto started at: [http://localhost:6076](http://localhost:6076) by default:

<img src="/images/rekit-studio.png" width="700" alt="Rekit Studio"/>

See a full introduction at: https://medium.com/@nate_wang/introducing-rekit-studio-a-real-ide-for-react-and-redux-development-baf0c99cb542

### Where to start
Rekit creates a single page application by default. You may need to edit the root container first to define your own container layout. The source file is at `src/features/home/App.js`.

### See the quick tutorial videos
There are two samples on the welcome page, and they are also demos on Redux's official web site. Now let's see how to create them with Rekit.

[<img src="/images/rekit-studio-youtube.png" width="500" alt="Rekit Demo"/>](https://youtu.be/i53XffYtWMc "Rekit Demo")

The demo contains two parts, which are examples in Redux's official website:

1. Create a simple counter in 1 minute!
2. Show the latest reactjs topics on Reddit using async actions.

### That's it!
You have already created your very first Rekit app and tried powerful Rekit tools! Now you can read more details about Rekit in the following pages.
