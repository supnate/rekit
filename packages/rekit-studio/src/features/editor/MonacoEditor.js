/* eslint no-underscore-dangle: 0 */
/* global monaco */
import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import * as monaco from 'monaco-editor';
import configMonacoEditor from './configMonacoEditor';
import modelManager from './modelManager';

function noop() {}

self.MonacoEnvironment = { // eslint-disable-line
  getWorkerUrl: function (moduleId, label) {
    if (label === 'json') {
      return '/static/js/json.worker.bundle.js';
    }
    if (/^css|less|scss$/.test(label)) {
      return '/static/js/css.worker.bundle.js';
    }
    if (label === 'less') {
      return '/static/js/css.worker.bundle.js';
    }
    if (label === 'html') {
      return '/static/js/html.worker.bundle.js';
    }
    if (label === 'typescript' || label === 'javascript') {
      return '/static/js/ts.worker.bundle.js';
    }
    return '/static/js/editor.worker.bundle.js';
  }
}

let editorInstance = null; // Only one global monaco editor.
const getEditorNode = () => editorInstance && editorInstance.getDomNode() && editorInstance.getDomNode().parentNode;

export default class MonacoEditor extends Component {
  static propTypes = {
    theme: PropTypes.string,
    file: PropTypes.string,
    options: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    editorDidMount: PropTypes.func,
    editorWillMount: PropTypes.func,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    theme: 'vs-dark',
    options: {},
    file: '',
    editorDidMount: noop,
    editorWillMount: noop,
    onChange: noop
  };

  constructor(props) {
    super(props);
    this.monacoListeners = [];
  }

  componentDidMount() {
    this.initEditor();
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillReceiveProps(nextProps) {
    if (this.editor) this.editor._editingFile = nextProps.file;
    if (nextProps.file !== this.props.file) {
      this.editor.setModel(modelManager.getModel(nextProps.file));
    }
  }

  componentWillUnmount() {
    const editorNode = getEditorNode();
    if (editorNode) this.containerElement.removeChild(getEditorNode());
    this.editor = null;
    this.monacoListeners.forEach(lis => lis.dispose());
    window.removeEventListener('resize', this.handleWindowResize);
  }

  editorWillMount() {
    const { editorWillMount } = this.props;
    editorWillMount();
  }

  editorDidMount(editor) {
    this.props.editorDidMount(editor);
    this.monacoListeners.push(
      editor.onDidChangeModelContent(event => {
        const value = editor.getValue();
        // Always refer to the latest value
        this.__current_value = value;
        // Only invoking when user input changed
        if (!this.__prevent_trigger_change_event) {
          this.props.onChange(value, event);
        }
      })
    );
  }

  initEditor() {
    const { theme, options, file } = this.props;
    this.editorWillMount();
    if (!editorInstance) {
      const domNode = document.createElement('div');
      domNode.className = 'monaco-editor-node';
      this.containerElement.appendChild(domNode);
      editorInstance = monaco.editor.create(domNode, {
        model: modelManager.getModel(file),
        ...options
      });
      configMonacoEditor(editorInstance, monaco);
    } else {
      editorInstance.setModel(modelManager.getModel(file));
      this.containerElement.appendChild(getEditorNode());
    }
    monaco.editor.setTheme(theme);
    this.editor = editorInstance;
    this.editor._editingFile = this.props.file;
    this.editorDidMount(this.editor);
  }

  assignRef = component => {
    this.containerElement = component;
  };

  handleWindowResize = _.debounce(() => {
    this.editor.layout();
  }, 100);

  render() {
    return <div ref={this.assignRef} className="editor-monaco-editor" />;
  }
}
