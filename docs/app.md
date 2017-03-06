## Rekit app architecture
Like the official [Create React App](), you can also create an app by Rekit with one command line. The key difference of the two is CRA more likely creates an app for demo or prototype purpose, so the app is small and simple; Rekit creates an app which is production ready, so it covers more aspects of a real world React, Redux application. Such as scalability, ease of development and testing, React router integrated, and variable optimizations.

### Divide a large app into small features
One of the key concepts of Rekit is dividing a large app into small pieces called features. A feature is some capability of an application. It's small and well decoupled, so it's easy to understand and maintain.

A React app already naturally constructs UI by component tree. Actually by combining Redux reducers, defining child routes of React router config, we can also divide the overall application store, routing configuration into small pieces. By doing this we can tame the application complexity into orderred pieces. See below picture for the overall Rekit app architecture:

<img src="/images/app-architecture.png" width="600" alt="rekit-app-architecture" />

We can see each feature is a much smaller 'app' which is easy to understand. A large application is composed by many such small features.

### Folder structure

### General optimizations
