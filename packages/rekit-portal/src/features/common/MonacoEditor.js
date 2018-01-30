/* eslint no-underscore-dangle: 0 */
/* global monaco */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

function noop() {}

export default class MonacoEditor extends Component {
  static propTypes = {
    theme: PropTypes.string,
    language: PropTypes.string,
    value: PropTypes.string,
    options: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    editorDidMount: PropTypes.func,
    editorWillMount: PropTypes.func,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    language: 'javascript',
    theme: 'vs-dark',
    options: {},
    value: null,
    editorDidMount: noop,
    editorWillMount: noop,
    onChange: noop,
  };

  componentDidMount() {
    this.afterViewInit();
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== this.__current_value) {
      // Always refer to the latest value
      this.__current_value = this.props.value;
      // Consider the situation of rendering 1+ times before the editor mounted
      if (this.editor) {
        this.__prevent_trigger_change_event = true;
        this.editor.setValue(this.__current_value);
        this.__prevent_trigger_change_event = false;
      }
    }
    if (prevProps.language !== this.props.language) {
      monaco.editor.setModelLanguage(this.editor.getModel(), this.props.language);
    }
    if (prevProps.theme !== this.props.theme) {
      monaco.editor.setTheme(this.props.theme);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
    this.destroyMonaco();
  }

  editorWillMount(monaco) {
    window.addEventListener('resize', this.handleWindowResize);
    const { editorWillMount } = this.props;
    editorWillMount(monaco);
  }

  editorDidMount(editor, monaco) {
    this.props.editorDidMount(editor, monaco);
    editor.onDidChangeModelContent((event) => {
      const value = editor.getValue();

      // Always refer to the latest value
      this.__current_value = value;

      // Only invoking when user input changed
      if (!this.__prevent_trigger_change_event) {
        this.props.onChange(value, event);
      }
    });
  }

  afterViewInit() {
    if (window.monaco !== undefined) {
      this.initMonaco();
      return;
    }
    const loaderUrl = 'vs/loader.js';
    const onGotAmdLoader = () => {
      // Load monaco
      window.require(['vs/editor/editor.main'], () => {
        this.initMonaco();
      });

      // Call the delayed callbacks when AMD loader has been loaded
      if (window.__REACT_MONACO_EDITOR_LOADER_ISPENDING__) {
        window.__REACT_MONACO_EDITOR_LOADER_ISPENDING__ = false;
        const loaderCallbacks = window.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__;

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
    if (window.__REACT_MONACO_EDITOR_LOADER_ISPENDING__) {
      // We need to avoid loading multiple loader.js when there are multiple editors loading
      // concurrently, delay to call callbacks except the first one
      // eslint-disable-next-line max-len
      window.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__ = window.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__ || [];
      window.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__.push({
        window: this,
        fn: onGotAmdLoader
      });
    } else if (typeof window.require === 'undefined') {
      const loaderScript = window.document.createElement('script');
      loaderScript.type = 'text/javascript';
      loaderScript.src = loaderUrl;
      loaderScript.addEventListener('load', onGotAmdLoader);
      window.document.body.appendChild(loaderScript);
      window.__REACT_MONACO_EDITOR_LOADER_ISPENDING__ = true;
    } else {
      onGotAmdLoader();
    }
  }

  initMonaco() {
    const { theme, options, language, value } = this.props;
    // const context = this.props.context || window;
    if (this.containerElement && typeof window.monaco !== 'undefined') {
      // Before initializing monaco editor
      this.editorWillMount(monaco);
      this.editor = monaco.editor.create(this.containerElement, {
        language,
        value,
        ...options,
      });
      monaco.editor.setTheme(theme);
      this.editorDidMount(this.editor, monaco);
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

  handleWindowResize = () => {
    this.editor.layout();
  }

  render() {
    return (
      <div ref={this.assignRef} className="common-monaco-editor" />
    );
  }
}
