/* eslint no-underscore-dangle: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

function noop() {}

export default class MonacoEditor extends Component {
  static propTypes = {
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    theme: PropTypes.string,
    options: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    editorDidMount: PropTypes.func,
    openReference: PropTypes.func,
    editorWillMount: PropTypes.func,
    context: PropTypes.object, // eslint-disable-line react/require-default-props, react/forbid-prop-types
    onChange: PropTypes.func,
    template: PropTypes.string,
    requireConfig: PropTypes.object,
  };

  static defaultProps = {
    width: '100%',
    height: '100%',
    theme: 'vs-dark',
    options: {},
    editorDidMount: noop,
    editorWillMount: noop,
    onChange: noop,
    template: '',
    requireConfig: {},
  };

  componentDidMount() {
    this.afterViewInit();
  }

  componentWillUnmount() {
    this.destroyMonaco();
  }

  editorWillMount(monaco) {
    const { editorWillMount } = this.props;
    editorWillMount(monaco);
  }

  editorDidMount(editor, monaco) {
    this.props.editorDidMount(editor, monaco);
    editor.layout();

    // monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    //   jsx: 2,
    //   allowNonTsExtensions: true,
    // });
    // compiler options
    // monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    //   target: monaco.languages.typescript.ScriptTarget.ES2016,
    //   allowNonTsExtensions: true,
    //   // moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    //   // module: monaco.languages.typescript.ModuleKind.CommonJS,
    //   noEmit: true,
    //   // typeRoots: ["node_modules/@types"]
    // });

    // extra libraries
    // monaco.languages.typescript.typescriptDefaults.addExtraLib(
    //   `export declare function next() : string`,
    //   'node_modules/@types/external/index.d.ts');

    // monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    //   noSemanticValidation: false,
    //   noSyntaxValidation: false
    // })

    // var jsCode = `import * as x from "external"
    //   const tt : string = x.dnext();`;

    // monaco.editor.create(document.getElementById("container"), {
    //   model: monaco.editor.createModel(jsCode,"typescript",new monaco.Uri("file:///main.tsx")), 
    // });

  }

  afterViewInit() {
    const context = this.props.context || window;
    if (context.monaco !== undefined) {
      this.initMonaco();
      return;
    }

    const { requireConfig } = this.props;

    const loaderUrl = 'vs/loader.js';

    const onGotAmdLoader = () => {
      if (context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__) {
        // Do not use webpack
        if (requireConfig.paths && requireConfig.paths.vs) {
          // will need to switch to nodeRequire here
          context.require.config(requireConfig);
        }
      }

      // Load monaco
      context.require(['vs/editor/editor.main'], () => {
        this.initMonaco();
      });

      // Call the delayed callbacks when AMD loader has been loaded
      if (context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__) {
        context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__ = false;
        const loaderCallbacks = context.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__;

        if (loaderCallbacks && loaderCallbacks.length) {
          let currentCallback = loaderCallbacks.shift();

          while (currentCallback) {
            currentCallback.fn.call(currentCallback.context);
            currentCallback = loaderCallbacks.shift();
          }
        }
      }
    };

    // Load AMD loader if necessary
    if (context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__) {
      // We need to avoid loading multiple loader.js when there are multiple editors loading
      // concurrently, delay to call callbacks except the first one
      // eslint-disable-next-line max-len
      context.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__ = context.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__ || [];
      context.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__.push({
        context: this,
        fn: onGotAmdLoader
      });
    } else if (typeof context.require === 'undefined') {
      const loaderScript = context.document.createElement('script');
      loaderScript.type = 'text/javascript';
      loaderScript.src = loaderUrl;
      loaderScript.addEventListener('load', onGotAmdLoader);
      context.document.body.appendChild(loaderScript);
      context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__ = true;
    } else {
      onGotAmdLoader();
    }
  }

  initMonaco() {
    const { theme, options } = this.props;
    const context = this.props.context || window;
    if (this.containerElement && typeof context.monaco !== 'undefined') {
      // Before initializing monaco editor
      context.monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        jsx: monaco.languages.typescript.JsxEmit.React,
        jsxFactory: 'React.createElement',
        reactNamespace: 'React',
        allowNonTsExtensions: true,
        allowJs: true,
        target: monaco.languages.typescript.ScriptTarget.Latest,
      });
      this.editorWillMount(context.monaco);
      const editorService = {
        openEditor: model => this.props.openReference(model),
      };
      this.editor = context.monaco.editor.create(
        this.containerElement,
        {
          // model: monaco.editor.createModel(options.value || '', 'typescript', new monaco.Uri('./main.tsx')),
          ...options,
        },
        { editorService }
      );

      context.monaco.editor.defineTheme('rekit-studio', {
        base: 'vs-dark', // can also be vs-dark or hc-black
        inherit: true, // can also be false to completely replace the builtin rules
        rules: [
          // { token: 'comment', foreground: '626466' },
          // { token: 'keyword', foreground: '6CAEDD' },
          { token: 'identifier', foreground: 'fac863' },
        ],
      });
      context.monaco.editor.setTheme('rekit-studio');
      // After initializing monaco editor
      this.editorDidMount(this.editor, context.monaco);
    }
  }

  destroyMonaco() {
    if (typeof this.editor !== 'undefined') {
      this.editor.dispose();
    }
  }

  assignRef = (component) => {
    this.containerElement = component;
  }

  render() {
    return (
      <div ref={this.assignRef} className="common-monaco-editor" />
    );
  }
}
