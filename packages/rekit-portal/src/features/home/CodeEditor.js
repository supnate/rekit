import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import { Button, Icon, message, Modal, Spin } from 'antd';
import { MonacoEditor } from '../common';
import { fetchFileContent, saveFile } from './redux/actions';
import editorStateMap from './editorStateMap';

export class CodeEditor extends Component {
  static propTypes = {
    // home: PropTypes.object.isRequired,
    fileContentById: PropTypes.object.isRequired,
    fileContentNeedReload: PropTypes.object.isRequired,
    fetchFileContentPending: PropTypes.bool.isRequired, // eslint-disable-line
    saveFilePending: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
    file: PropTypes.string.isRequired,
    onError: PropTypes.func,
    onStateChange: PropTypes.func,
    onRunTest: PropTypes.func,
  };

  static defaultProps = {
    onError() {},
    onStateChange() {},
    onRunTest: null,
  };

  constructor(props) {
    super(props);
    // BIG magic here! When open/switch a new file, it will trigger cursor change first
    // which causes to save status. So if the file is new open, should not save its state
    // before recover the state. So when file is changed set this flag to true. After recover
    // the status, set it to false so that state could be saved.
    this.preventSaveEditorState = true;
  }

  state = {
    notFound: false,
    currentContent: '',
    editorWidth: 1,
    editorHeight: 1,
    loading: false,
  };

  async componentWillMount() {
    this.handleWindowResize();
    window.addEventListener('resize', this.handleWindowResize);
    this.setState({
      loading: true,
    });
    await this.checkAndFetchFileContent(this.props);
    this.setState({ // eslint-disable-line
      currentContent: this.getFileContent(),
      loading: false,
    });
    this.props.onStateChange({ hasChange: false });
  }

  async componentWillReceiveProps(nextProps) {
    const { props } = this;
    if (props.file !== nextProps.file) {
      // When file is changed, prevent saving before its state is restored.
      this.preventSaveEditorState = true;
    }
    if (props.file !== nextProps.file || nextProps.fileContentNeedReload[nextProps.file]) {
      // File changed or file content changed, the check and reload.
      const oldContent = this.getFileContent();
      const hasChange = this.hasChange();
      if (props.file !== nextProps.file) {
        this.setState({
          loading: true,
          currentContent: '',
        });
      }
      await this.checkAndFetchFileContent(nextProps);
      this.setState({
        loading: false,
      });
      const newContent = this.getFileContent();
      if (hasChange && oldContent !== newContent && newContent !== this.state.currentContent) {
        Modal.confirm({
          title: 'The file has changed on disk.',
          content: 'Do you want to reload it?',
          okText: 'Yes',
          cancelText: 'No',
          onOk: this.reloadContent,
        });
      } else if (!hasChange) {
        this.reloadContent();
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
    this.editor.onDidChangeCursorPosition(null);
    this.editor.onDidScrollChange(null);
  }

  getFileContent() {
    return this.props.fileContentById[this.props.file];
  }

  reloadContent = () => {
    // Reload content from Redux store to internal state(editor).
    this.setState({
      currentContent: this.getFileContent(),
    });
    this.props.onStateChange({ hasChange: false });
    this.recoverEditorState();
  }

  recoverEditorState = () => {
    if (!this.editor) return;
    const { file } = this.props;
    this.preventSaveEditorState = false;
    const editorState = editorStateMap[file] || {
      scrollLeft: 0,
      scrollTop: 0,
      position: new monaco.Position(0, 0),
    };
    this.editor.focus();
    this.editor.setScrollLeft(editorState.scrollLeft);
    this.editor.setScrollTop(editorState.scrollTop);
    this.editor.setPosition(editorState.position);
  }

  hasChange() {
    // Whether the editor content is different from which in store.
    return this.state.currentContent !== this.getFileContent();
  }

  checkAndFetchFileContent(props) {
    // Check if content exists or need reload, if yes then fetch it.
    const { fileContentById, fileContentNeedReload, fetchFileContentPending, file } = props;
    if ((!_.has(fileContentById, file) || fileContentNeedReload[file]) && !fetchFileContentPending) {
      return this.props.actions.fetchFileContent(props.file).then(() => {
        this.setState({ notFound: false });
      }).catch((e) => {
        message.error(`Failed to load file: ${e.toString()}`);
        if (_.get(e, 'response.status') === 404) {
          this.setState({ notFound: true });
          this.props.onError(404);
        }
      });
    } else {
      this.setState({ notFound: false });
      return Promise.resolve();
    }
  }

  handleWindowResize = () => {
    // Todo: bounce resize event to improve performance when resizing.
    let editorHeight = document.body.offsetHeight - 112;
    let editorWidth = document.body.offsetWidth - 302;
    if (editorHeight < 100) editorHeight = 100;
    if (editorWidth < 300) editorWidth = 300;
    this.setState({ editorWidth, editorHeight });
  }

  handleEditorChange = (newValue) => {
    this.setState({
      currentContent: newValue,
    });
    this.props.onStateChange({ hasChange: newValue !== this.getFileContent() });
  }

  handleEditorDidMount = (editor) => {window.editor = editor;console.log('editor did mount');
    this.editor = editor;
    editor.focus();
    editor.addCommand([monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S], () => { // eslint-disable-line
      if (this.hasChange()) this.handleSave();
    });
    editor.onDidChangeCursorPosition(this.handleEditorCursorScrollerChange);
    editor.onDidScrollChange(this.handleEditorCursorScrollerChange);

    // It needs some time for editor to load its content
    setTimeout(this.recoverEditorState, 30);
  }

  handleEditorCursorScrollerChange = () => {
    if (this.preventSaveEditorState) return;
    const { file } = this.props;

    editorStateMap[file] = {
      scrollLeft: this.editor.getScrollLeft(),
      scrollTop: this.editor.getScrollTop(),
      position: this.editor.getPosition(),
    };
  }

  handleRunTest = () => {
    this.props.onRunTest();
  }

  handleSave = () => {
    this.props.actions.saveFile(this.props.file, this.state.currentContent)
      .then(() => this.props.onStateChange({ hasChange: false }))
      .catch(() => {
        Modal.error({
          title: 'Failed to save.',
          content: 'Please retry or use other text editor.',
        });
      });
  }

  handleCancel = () => {
    Modal.confirm({
      title: 'Are you sure to cancel your changes?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => {
        this.setState({
          currentContent: this.getFileContent(),
        });
        this.props.onStateChange({ hasChange: false });
      }
    });
  }

  render() {
    if (this.state.notFound) {
      return (
        <div className="home-code-editor">
          <div className="code-editor-toolbar" style={{ width: `${this.state.editorWidth}px` }}>
            <div className="file-path">{this.props.file}</div>
          </div>
          <div style={{ color: 'red', marginTop: '10px', marginLeft: '15px' }}>File not found.</div>
        </div>
      );
    }
    const options = {
      selectOnLineNumbers: true,
      renderWhitespace: 'boundary',
    };
    const ext = this.props.file.split('.').pop();
    const lang = {
      js: 'javascript',
      md: 'markdown',
    }[ext] || ext;
    console.log('lang', lang);
    const hasChange = this.hasChange();
    const { saveFilePending } = this.props;
    return (
      <div className="home-code-editor">
        <Prompt when={hasChange} message="The change is not saved, are you sure to leave? Unsaved change will be discarded." />
        <div className="code-editor-toolbar" style={{ width: `${this.state.editorWidth}px` }}>
          <div className="file-path">{this.props.file}</div>
          <div style={{ float: 'right' }}>
            {this.props.onRunTest &&
            <Button type="primary" onClick={this.handleRunTest} size="small">
              <Icon type="play-circle-o" /> Run test
            </Button>}
            {hasChange && !this.state.loading &&
            <Button type="primary" size="small" loading={saveFilePending} disabled={saveFilePending} onClick={this.handleSave}>
              {saveFilePending ? 'Saving...' : 'Save'}
            </Button>}
            {hasChange && !this.state.loading && <Button size="small" onClick={this.handleCancel} disabled={saveFilePending}>Cancel</Button>}
          </div>
        </div>
        {this.state.loading &&
        <div className="loading-container">
          <Spin size="large" />
        </div>}
        <MonacoEditor
          width={this.state.editorWidth}
          height={this.state.editorHeight}
          language={lang}
          theme="vs-dark"
          value={this.state.currentContent}
          options={options}
          onChange={this.handleEditorChange}
          editorDidMount={this.handleEditorDidMount}
        />
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    // home: state.home,
    fileContentById: state.home.fileContentById,
    fileContentNeedReload: state.home.fileContentNeedReload,
    fetchFileContentPending: state.home.fetchFileContentPending,
    saveFilePending: state.home.saveFilePending,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ fetchFileContent, saveFile }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CodeEditor);
