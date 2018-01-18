const initialState = {
  count: 0,
  redditReactjsList: [],
  elementById: {},
  fileContentById: {},
  features: null,
  projectDataNeedReload: false,
  projectFileChanged: false,
  fetchProjectDataPending: false,
  fetchProjectDataError: null,
  fetchFileContentPending: false,
  fetchFileContentError: null,
  // editingFile: {
  //   file: null, // File path
  //   originalContent: null, // Content before save
  // },
  demoAlertVisible: false,
  saveCodePending: false,
  saveCodeError: null,
};

export default initialState;
