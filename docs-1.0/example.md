## Example

There is a simple forum application built with Rekit for your reference. It connects to a real backend server powered by [Leancloud.cn](https://leancloud.cn)( a [Parse](https://www.parse.com) like Saas service).
It provides basic forum features: `topics` and `comments`.

<img src="/images/example.png" width="600" alt="Rekit Example"/>

You can see the online example at: https://supnate.github.io/rekit-example

Or see the code at: https://github.com/supnate/rekit-example

You can clone the repo and run it locally:
```
git clone https://github.com/supnate/rekit-example.git
cd rekit-example
npm install
npm start
```
Then access http://localhost:6090/rekit-example

The simple forum app demostrates most of capabilities of Rekit such as:

1. How to use multiple features together.
2. How to change the default container to create your own layout.
3. How to use async action to fetch data from backend service.
4. How to handle errors.
5. How to write and run tests.
...

#### Roadmap
Next features are planed to be added to the example at priority:

1. Topic list pagination.
2. Show comment count in topic list.
3. User authentication.

...

And welcome to [submit feature requests](https://github.com/supnate/rekit-example/issues)
