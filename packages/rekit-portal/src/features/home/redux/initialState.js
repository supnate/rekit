const initialState = {
  count: 0,
  redditReactjsList: [],
  elementById: {},
  fileContentById: {},
  oldFileContentById: {},
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
  saveFilePending: false,
  saveFileError: null,
};

export default initialState;
