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

  demoAlertVisible: false,
  a2Pending: false,
  a2Error: null,
};

export default initialState;
