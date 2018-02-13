## Testing

Testing a React + Redux application is difficult, you need to know many libs/tools regarding React testing and learn their usage. But Rekit will setup everything for you. You just need to write test code in the auto generated test files, running test with Rekit Studio and reading the coverage report in a browser.

However here is the process of how React testing works. You can know how Rekit setups the testing process.

1. [Istanbul](https://github.com/gotwarlost/istanbul) instruments the source code for test coverage report. Istanbul itself doesn't support JSX, but there's a babel plugin [babel-plugin-istanbul](https://github.com/istanbuljs/babel-plugin-istanbul) then it works.
2. Webpack builds all testing files with [mocha-webpack](https://github.com/zinserjan/mocha-webpack) which auto finds test files to test.
3. [Mocha](https://github.com/mochajs/mocha) runs the built version of testing files.
4. [nyc](https://github.com/istanbuljs/nyc) generates the test coverage report.

All app testing files are saved in the folder `test/app`. And the folder structure is the same with the source code folder structure in `src` folder.

#### How Rekit generates testing files
When creating a new component or action, Rekit auto creates test cases for them. Even you don't add any code to to the generated test cases, they help you avoid simple errors. Such as:

1. It ensures a component is always rendered successfully by checking the existence of the root DOM node with correct css class.
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

#### Run tests
As you may have noticed, test cases also need to be built with webpack, then Mocha could run the test cases. So running a single test case file also needs the build. So `tools/run_test.js` is created to simplify this process. You can run any test case file just by the `run_test.js` tool. It's also exported as `npm test`. All arguments to it is just passed to the `run_test.js` script. The usage is as below:
```
npm test  // run all tests of the project
npm test features/home // run tests under the `home` feature
npm test **/List.test.js // run all tests named list.test.js under app folder
```

The script is under your project, so you can edit it for free to meet your own requirements.

By default it does below things:

1. Istanbul instruments the source code.
2. Mocha runs the test cases.
3. nyc generates the test coverage report.


#### See the coverage report
If tests are are run for the whole project then test coverage report will be generated at `coverage` folder.
