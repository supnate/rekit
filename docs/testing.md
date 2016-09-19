## Testing

Testing a React + Redux application is difficult, you need to know many libs/tools regarding React testing and learn their usage. But Rekit will setup everything for you. You just need to write test code in the auto generated test files, running test with the Sublime plugin and reading the coverage report in a browser.

However here is the process of how React testing works. You can know how Rekit setups the testing process.

1. [Istanbul](https://github.com/gotwarlost/istanbul) instruments the source code for test coverage report. Istanbul itself doesn't support JSX, but there's a babel plugin [babel-plugin-istanbul](https://github.com/istanbuljs/babel-plugin-istanbul) then it works.
2. Webpack builds all testing files with [mocha-webpack](https://github.com/zinserjan/mocha-webpack) which auto finds test files to test.
3. [Mocha](https://github.com/mochajs/mocha) runs the built version of testing files.
4. [nyc](https://github.com/istanbuljs/nyc) generates the test coverage report.

All app testing files are saved in the folder `test/app`. And the folder structure is the same with the source code folder structure in `src` folder.

#### How Rekit generates testing files
When creating a new page, component or action, Rekit auto creates test cases for them. Even you don't add any code to to the generated test cases, they help you avoid simple errors. Such as:

1. It ensures a component is always rendered successfully by checking the existance of the root DOM node with correct css class.
2. It ensures reducer is immutable by checking equality of the previous and new states.

For example, when creating a new page, it generates below test case:
```javascript
it('renders node with correct class name', () => {
  const pageProps = {
    home: {},
    actions: {},
  };
  const renderedComponent = shallow(
    <TestPage1 {...pageProps} />
  );

  expect(
    renderedComponent.find('.home-test-page-1').node
  ).to.exist;
});
```

When creating an action, it generates below reducer test case:
```javascript
it('reducer should handle MY_ACTION', () => {
  const prevState = {};
  const state = reducer(
    prevState,
    { type: MY_ACTION }
  );
  expect(state).to.not.equal(prevState); // should be immutable
  expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
});
```

#### Command line tools testing
All command line tools also have unit test cases saved in `test/cli` folder. Not only in the rekit project, but also they are copied to the created app so that you can customize the tools with test cases.

Because these tool scripts are written with pure NodeJs, the testing is simpler:
1. Istanbul instruments the source code.
2. Mocha runs the test cases.
3. nyc generates the test coverage report.

#### run_test.js
As you may have noticed, test cases also need to be built with webpack, then Mocha could run the test cases. So running a single test case file also needs the build. So `run_test.js` is created to simplify this process. You can run any test case file just by the `run_test.js` tool. It's also exported as `npm test`. All arguments to it is just passed to the `run_test.js` script. The usage is as below:
```
npm test  // run all tests under the `test/app` folder
npm test app/features/home // run tests under the `home` feature
npm test app/**/list.test.js // run all tests named list.test.js under app folder
npm test cli // run tests for all command line tools
npm test all // run tests for both app and cli
```

#### See the coverage report
If tests are are run by `app`, `cli` or `all` then test coverage report will be involved. Different coverage report could be see at:

1. `all`: coverage/lcov-report/index.html
2. `app`: coverage/app/lcov-report/index.html
3. `cli`: coverage/cli/lcov-report/index.html



