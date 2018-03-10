/* eslint no-bitwise: 0, jsx-no-bind: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from 'axios';
import { Button, Icon, message, Modal, Spin, Tooltip } from 'antd';
import { MonacoEditor } from '../common';
import { fetchFileContent, saveFile, showDemoAlert, codeChange } from './redux/actions';
import editorStateMap from './editorStateMap';
import modelManager from '../common/monaco/modelManager';

export class CodeEditor extends Component {
  static propTypes = {
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

    this.monacoListeners = [];
  }

  state = {
    notFound: false,
    loadingFile: false,
    loadingEditor: true,
    cursorPos: {
      lineNumber: 1,
      column: 1,
    },
  };

  async componentWillMount() {
    this.setState({
      loadingFile: true,
    });
    await this.checkAndFetchFileContent(this.props);
    // Todo: check if conflict
    modelManager.setInitialValue(this.props.file, this.getFileContent(this.props.file), true);
    this.setState({
      // eslint-disable-line
      loadingFile: false,
    });
    this.props.onStateChange({ hasChange: false });
  }

  async componentWillReceiveProps(nextProps) {
    const { props } = this;
    if (props.file !== nextProps.file) {
      // When file is changed, prevent saving before its state is restored.
      this.preventSaveEditorState = true;
      this.setState({
        loadingFile: true,
      });
      await this.checkAndFetchFileContent(nextProps);
      // Todo: check if conflict
      modelManager.setInitialValue(nextProps.file, this.getFileContent(nextProps.file), true);
      this.preventSaveEditorState = false;
      this.recoverEditorState();
      this.setState({
        loadingFile: false,
      });
    } else if (nextProps.fileContentNeedReload[nextProps.file]) {
      const oldContent = this.getFileContent();
      const hasChange = this.hasChange(); // has changed
      await this.checkAndFetchFileContent(nextProps);
      modelManager.setInitialValue(nextProps.file, this.getFileContent(nextProps.file), true);
      this.setState({
        loadingFile: false,
      });
      const newContent = this.getFileContent();
      if (hasChange && oldContent !== newContent && newContent !== modelManager.getValue(nextProps.file)) {
        Modal.confirm({
          title: 'The file has changed on disk.',
          content: 'Do you want to reload it?',
          okText: 'Yes',
          cancelText: 'No',
          onOk: () => {
            modelManager.reset(nextProps.file);
          },
        });
      }
    }
  }

  componentWillUnmount() {
    this.monacoListeners.forEach(lis => lis.dispose());
  }

  getFileContent(filePath) {
    return this.props.fileContentById[filePath || this.props.file];
  }

  formatCode = () => {
    this.setState({ loadingFile: true });
    axios
      .post('/rekit/api/format-code', {
        content: modelManager.getValue(this.props.file),
        file: this.props.file,
      })
      .then(res => {
        this.editor.executeEdits('format', [
          { range: new monaco.Range(1, 1, 1000000, 1), text: res.data.content, forceMoveMarkers: true },
        ]);
        this.setState({
          loadingFile: false,
        });
      })
      .catch(() => {
        this.setState({
          loadingFile: false,
        });
      });
  };

  recoverEditorState = () => {
    if (!this.editor) return;
    const { file } = this.props;
    this.preventSaveEditorState = false;
    const editorState = editorStateMap[file] || null;
    this.editor.restoreViewState(editorState);
    this.editor.focus();
  };

  hasChange() {
    // Whether the editor content is different from which in store.
    return modelManager.isChanged(this.props.file);
    // return this.state.currentContent !== this.getFileContent();
  }

  checkAndFetchFileContent(props) {
    // Check if content exists or need reload, if yes then fetch it.
    const { fileContentById, fileContentNeedReload, fetchFileContentPending, file } = props;
    if ((!_.has(fileContentById, file) || fileContentNeedReload[file]) && !fetchFileContentPending) {
      return this.props.actions
        .fetchFileContent(props.file)
        .then(() => {
          this.setState({ notFound: false });
        })
        .catch(e => {
          message.error(`Failed to load file: ${e.toString()}`);
          if (_.get(e, 'response.status') === 404) {
            this.setState({ notFound: true, loadingFile: false });
            this.props.onError(404);
          }
        });
    } else {
      this.setState({ notFound: false });
      return Promise.resolve();
    }
  }

  handleEditorChange = () => {
    this.props.actions.codeChange();
  };

  handleEditorDidMount = editor => {
    this.setState({
      loadingEditor: false,
    });
    this.editor = editor;
    editor.focus();
    // This seems to be able to add multiple times.
    editor.addCommand([monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S], () => {
      if (this.hasChange()) this.handleSave();
    });
    editor.addCommand([monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_B], () => {
      this.formatCode();
    });
    this.monacoListeners.push(
      editor.onDidChangeCursorPosition(() => this.setState({ cursorPos: editor.getPosition() })),
      editor.onDidChangeCursorPosition(this.handleEditorCursorScrollerChange),
      editor.onDidScrollChange(this.handleEditorCursorScrollerChange)
    );

    // // It needs some time for editor to load its content
    setTimeout(this.recoverEditorState, 30);
  };

  handleEditorCursorScrollerChange = () => {
    if (this.preventSaveEditorState) return;
    const { file } = this.props;

    editorStateMap[file] = this.editor.saveViewState();
  };

  handleRunTest = () => {
    this.props.onRunTest();
  };

  handleSave = () => {
    this.props.actions
      .saveFile(this.props.file, this.editor.getValue())
      .then(() => {
        modelManager.setInitialValue(this.props.file, this.editor.getValue());
        this.props.actions.codeChange();
      })
      .catch(() => {
        if (process.env.REKIT_ENV === 'demo') {
          this.props.actions.showDemoAlert();
          return;
        }
        Modal.error({
          title: 'Failed to save.',
          content: 'Please retry or use other text editor.',
        });
      });
  };

  handleCancel = () => {
    Modal.confirm({
      content: 'Are you sure to discard your changes?',
      okText: 'Discard',
      cancelText: 'No',
      onOk: () => {
        modelManager.setValue(this.props.file, modelManager.getInitialValue(this.props.file));
      },
    });
  };

  render() {
    if (this.state.notFound) {
      return (
        <div className="home-code-editor">
          <div className="code-editor-toolbar">
            <div className="file-path" title={this.props.file}>
              {this.props.file}
            </div>
          </div>
          <div style={{ color: 'red', marginTop: '10px', marginLeft: '15px' }}>File not found.</div>
        </div>
      );
    }
    const options = {
      selectOnLineNumbers: true,
    };
    const hasChange = this.hasChange();
    const { saveFilePending } = this.props;
    return (
      <div className="home-code-editor">
        <div className="code-editor-toolbar">
          <div className="file-path">{this.props.file}</div>
          <div>
            {this.state.cursorPos.column && (
              <span className="cursor-pos">
                Ln {this.state.cursorPos.lineNumber}, Col {this.state.cursorPos.column}
              </span>
            )}
            <Tooltip
              overlayClassName="tooltip-no-arrow"
              title={
                <label>
                  Beautify your code using prettier{' '}
                  <span style={{ color: '#888', fontSize: '12px' }}>
                    ({/^Mac/.test(window.navigator.platform) ? 'Cmd' : 'Ctrl'}+B)
                  </span>
                </label>
              }
            >
              <Button onClick={this.formatCode} size="small">
                <Icon type="menu-fold" />
              </Button>
            </Tooltip>
            {this.props.onRunTest && (
              <Button type="primary" onClick={this.handleRunTest} size="small">
                <Icon type="play-circle-o" /> Run test
              </Button>
            )}
            {hasChange &&
              !this.state.loadingFile && (
                <Tooltip
                  title={
                    <label>
                      Save{' '}
                      <span style={{ color: '#888', fontSize: '12px' }}>
                        ({/^Mac/.test(window.navigator.platform) ? 'Cmd' : 'Ctrl'}+S)
                      </span>
                    </label>
                  }
                >
                  <Button
                    type="primary"
                    size="small"
                    loading={saveFilePending}
                    disabled={saveFilePending}
                    onClick={this.handleSave}
                  >
                    <Icon type="save" />
                  </Button>
                </Tooltip>
              )}
            {hasChange &&
              !this.state.loadingFile && (
                <Tooltip title="Discard changes">
                  <Button size="small" onClick={this.handleCancel} disabled={saveFilePending}>
                    <Icon type="close-circle" />
                  </Button>
                </Tooltip>
              )}
          </div>
        </div>
        {(this.state.loadingFile || this.state.loadingEditor) && (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        )}
        <MonacoEditor
          file={this.props.file}
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
    // codeChange: state.home.codeChange,
    fileContentById: state.home.fileContentById,
    fileContentNeedReload: state.home.fileContentNeedReload,
    fetchFileContentPending: state.home.fetchFileContentPending,
    saveFilePending: state.home.saveFilePending,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ fetchFileContent, saveFile, codeChange, showDemoAlert }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CodeEditor);
