
export function getTestFilePattern(testFile) {
  let testFilePattern;
  if (/\.js$/.test(testFile)) {
    // a single file
    testFilePattern = testFile.replace(/^src\//, '').replace(/\.js$/, '.test.js');
  } else if (testFile) {
    if (testFile === 'features') {
      testFilePattern = 'features/**/*.test.js';
    } else {
      const arr = testFile.split('/');
      const feature = arr[0];
      const type = arr[1];
      if (type) {
        // run tests for all actions or components
        if (type === 'actions') {
          testFilePattern = `features/${feature}/redux/**/*.test.js`;
        } else if (type === 'components') {
          testFilePattern = `features/${feature}/**/*.test.js`;
        }
      } else {
        // run tests under a feature
        testFilePattern = `features/${feature}/**/*.test.js`;
      }
    }
  } else {
    // run all tests of the project
    testFilePattern = '';
  }
  return testFilePattern;
}
