## Welcome page

After creating a new Rekit application, you can see a welcome page by accessing [http://localhost:6076](http://localhost:6076). Seeing it means the creation is successful. It's also the default page of the auto created `home` [feature](/docs/concepts.md#feature).

<img src="/images/welcome-page.png" width="600" alt="Rekit Welcome Page"/>

The welcome page consists of 3 parts:

**1. A simple nav component**
It reads the route config of the whole application and generates links to different [pages](/docs/concepts.md#page).

**2. A counter demo using normal actions.**
A counter has three buttons `plus`, `minus` and `reset` which control the number it shows. By this sample you can quickly see how normal actions (sync actions) work together for a Redux application.

**3. A demo to fetch latest topics of `reactjs` channel from Reddit**
This is just the same example from the official Redux site: [https://redux.js.org/docs/advanced/ExampleRedditAPI.html](https://redux.js.org/docs/advanced/ExampleRedditAPI.html). It demonstrates the [async actions](/docs/concepts#async-action) for a Redux application. But the Rekit version uses one file one action pattern, and it adds error handling which is a common requirement for real-world apps.

These parts demonstrate the basic usage of Rekit features, pages, components and actions.

#### Remove samples
All samples could be removed safely from the new created app by running one command:
```
npm run rm:feature home
```

This command removes the `home` feature from the application. Then the app will be totally clean without any unnecessary code. You can begin your application by creating your features, pages, actions etc. If you just want to only remove sample pages leaving the `home` feature, you can run below command:
```
npm run rm:page home/DefaultPage
npm run rm:page home/TestPage1
npm run rm:page home/TestPage2
```

The counter and Reddit demos are put in the `DefaultPage`. `TestPage1` and `TestPage2` are only there for demonstrating the sample nav component.

However, leaving the sample feature there doesn't have any side effect to your app. Recommend that if you are new to Rekit so that you can refer to the samples any time.
