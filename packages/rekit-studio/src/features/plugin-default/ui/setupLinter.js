/* eslint no-use-before-define: 0 */
import _ from 'lodash';
import axios from 'axios';
import store from '../../../common/store';
import { lint } from '../redux/actions';

let editor;
let monaco;

// Worker always run and will never terminate
// There is only one global editor instance never disposed in Rekit Studio.
function setupLintWorker(_editor, _monaco) {
  editor = _editor;
  monaco = _monaco;
  editor.onDidChangeModelContent(doLint);
  editor.onDidChangeModel(doLint);
  requestAnimationFrame(doLint); // For first time load
}

const doLint = _.debounce(() => {
  if (!editor.getModel()) return;
  if (/javascript/i.test(editor.getModel().getModeId())) {
    const code = editor.getValue();
    const file = editor._editingFile;
    store
      .dispatch(lint(file, code))
      .then(messages => {
        if (code === editor.getValue() && file === editor._editingFile) {
          updateLintWarnings(messages);
        }
      })
      .catch(() => {});
    // axios
    //   .post('/api/lint', {
    //     content: code,
    //     file: editor._editingFile // eslint-disable-line
    //   })
    //   .then(res => {
    //     if (code === editor.getValue()) {
    //       updateLintWarnings(res.data);
    //     }
    //   })
    //   .catch(() => {});
  } else {
    updateLintWarnings([]);
  }
}, 500);

function updateLintWarnings(validations) {
  if (!editor.getModel()) return;
  const markers = validations.map(error => ({
    severity: Math.min(error.severity + 1, 3),
    startColumn: error.column,
    startLineNumber: error.line,
    endColumn: error.endColumn,
    endLineNumber: error.endLine,
    message: `${error.message} (${error.ruleId})`,
    source: 'eslint',
  }));

  monaco.editor.setModelMarkers(editor.getModel(), 'eslint', markers);
}

export default setupLintWorker;
