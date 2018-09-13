import plugin from '../../common/plugin';
import setupSyntaxWorker from './setupSyntaxWorker';
import setupLinter from './setupLinter';

// Config Monaco Editor to support JSX and ESLint
function configureMonacoEditor(editor, monaco) {
  plugin.getPlugins('editor.config').forEach(p => p.editor.config(editor, monaco));
  setupSyntaxWorker(editor, monaco);
  setupLinter(editor, monaco);
}

export default configureMonacoEditor;
