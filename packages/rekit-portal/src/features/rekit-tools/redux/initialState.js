const initialState = {
  runBuildPending: false,
  runBuildError: null,

  runBuildOutput: null,
  runBuildRunning: false, // the build process has started and has not finished.

  bgProcesses: {},
  currentTestFile: null,
  runTestPending: false,
  runTestError: null,
  runTestOutput: null,
  runTestRunning: false, // the test process has started and has not finished.
  checkTestCoveragePending: false,
  checkTestCoverageError: null,
};

export default initialState;
