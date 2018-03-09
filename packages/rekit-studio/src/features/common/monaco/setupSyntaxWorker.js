/* eslint no-use-before-define: 0 */
import SyntaxHighlightWorker from 'worker-loader?name=monaco-syntax-highlighter.[hash].worker.js!./workers/syntaxHighlighter'; // eslint-disable-line

let syntaxWorker;
let lastDecorations = [];
let editor;
let monaco;

// Worker always run and will never terminate
// There is only one global editor instance never disposed in Rekit Studio.
function setupSyntaxWorker(_editor, _monaco) {
  editor = _editor;
  monaco = _monaco;
  syntaxWorker = new SyntaxHighlightWorker();
  syntaxWorker.addEventListener('message', event => {
    const { classifications } = event.data;
    requestAnimationFrame(() => {
      updateDecorations(classifications);
    });
  });
  editor.onDidChangeModelContent(syntaxHighlight);
  editor.onDidChangeModel(syntaxHighlight);
  requestAnimationFrame(syntaxHighlight); // For first time load
}

function syntaxHighlight() {
  if (!editor.getModel()) return; // all models disposed
  if (/typescript|javascript/i.test(editor.getModel().getModeId())) {
    syntaxWorker.postMessage({
      code: editor.getValue(),
    });
  }
}

function updateDecorations(classifications) {
  const decorations = classifications.map(classification => ({
    range: new monaco.Range(
      classification.startLine,
      classification.start,
      classification.endLine,
      classification.end
    ),
    options: {
      inlineClassName: classification.kind
    }
  }));

  lastDecorations = editor.deltaDecorations(
    lastDecorations || [],
    decorations
  );
}

export default setupSyntaxWorker;
