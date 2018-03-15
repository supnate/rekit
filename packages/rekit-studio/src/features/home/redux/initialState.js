import { storage } from '../../common/utils';

const initialState = {
  sidePanelWidth: parseInt(localStorage.getItem('sidePanelWidth') || 220, 10),
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
  filesHasSyntaxError: {},

  // Resotre open tabs and history tabs from local storage
  openTabs: storage.session.getItem('openTabs', []),
  historyTabs: storage.session.getItem('historyTabs', []),

  demoAlertVisible: false,
  saveFilePending: false,
  saveFileError: null,

  codeChange: 0, // used to trigger UI re-render when typing
};

export default initialState;
