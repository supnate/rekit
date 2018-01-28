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

  // Resotre open tabs and history tabs from local storage
  openTabs: JSON.parse(sessionStorage.getItem('openTabs') || '[]'),
  historyTabs: JSON.parse(sessionStorage.getItem('historyTabs') || '[]'),

  demoAlertVisible: false,
  saveFilePending: false,
  saveFileError: null,
};

export default initialState;
