
const initialState = {
  cmdDialogVisible: false,
  addActionDialogVisible: false,
  logViewerDialogVisible: false,
  execCmdResult: null,
  logsTitle: '', // Used for logs viewer dialog
  logsDescription: '', // Used for logs viewer dialog
  cmdArgs: null, // Args provided to the current command
  execCmdPending: false,
  execCmdError: null,
};

export default initialState;
