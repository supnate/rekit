import setupSyntaxWorker from './setupSyntaxWorker';
import setupLinter from './setupLinter';

// Config Monaco Editor to support JSX and ESLint
function configureMonacoEditor(editor, monaco) {
  const compilerDefaults = {
    jsxFactory: 'React.createElement',
    reactNamespace: 'React',
    jsx: monaco.languages.typescript.JsxEmit.React,
    target: monaco.languages.typescript.ScriptTarget.ES2016,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    experimentalDecorators: true,
    noEmit: true,
    allowJs: true,
    typeRoots: ['node_modules/@types']
  };

  monaco.languages.typescript.typescriptDefaults.setMaximunWorkerIdleTime(-1);
  monaco.languages.typescript.javascriptDefaults.setMaximunWorkerIdleTime(-1);
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
    compilerDefaults
  );
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions(
    compilerDefaults
  );

  monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
  monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);

  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false
  });
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false
  });

  setupSyntaxWorker(editor, monaco);
  setupLinter(editor, monaco);
}

export default configureMonacoEditor;
