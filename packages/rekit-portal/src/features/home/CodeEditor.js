import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import { Button, Icon, message, Modal } from 'antd';
import MonacoEditor from 'react-monaco-editor';
import { fetchFileContent, saveFile } from './redux/actions';

export class CodeEditor extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
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

  state = {
    notFound: false,
    currentContent: '',
    editorWidth: 1,
    editorHeight: 1,
  };

  async componentWillMount() {
    this.handleWindowResize();
    window.addEventListener('resize', this.handleWindowResize);
    await this.checkAndFetchFileContent(this.props);
    this.setState({ // eslint-disable-line
      currentContent: this.getFileContent(),
    });
    this.props.onStateChange({ hasChange: false });
  }

  async componentWillReceiveProps(nextProps) {
    const { props } = this;
    // const fileContentChanged = props.home.fileContentById[props.file] !== nextProps.home.fileContentById[nextProps.file];

    if (props.file !== nextProps.file || nextProps.home.fileContentNeedReload[nextProps.file]) {
      // File changed or file content changed, the check and reload.
      const oldContent = this.getFileContent();
      const hasChange = this.hasChange();
      await this.checkAndFetchFileContent(nextProps);
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
  }

  getFileContent() {
    return this.props.home.fileContentById[this.props.file];
  }

  reloadContent = () => {
    // Reload content from Redux store to internal state(editor).
    this.setState({
      currentContent: this.getFileContent(),
    });
    this.props.onStateChange({ hasChange: false });
  }

  hasChange() {
    // Whether the editor content is different from which in store.
    return this.state.currentContent !== this.getFileContent();
  }

  checkAndFetchFileContent(props) {
    // Check if content exists or need reload, if yes then fetch it.
    const { home, file } = props;
    const { fileContentById, fileContentNeedReload, fetchFileContentPending } = home;
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
    let editorHeight = document.body.offsetHeight - 250;
    let editorWidth = document.body.offsetWidth - 380;
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

  handleEditorDidMount = (editor) => {
    editor.focus();
    editor.addCommand([monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S], () => { // eslint-disable-line
      if (this.hasChange()) this.handleSave();
    });
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
          <div style={{ color: 'red', marginTop: 10 }}>File not found.</div>
        </div>
      );
    }
    const options = {
      selectOnLineNumbers: true
    };
    const ext = this.props.file.split('.').pop();
    const lang = {
      js: 'javascript',
      md: 'markdown',
    }[ext] || ext;
    const hasChange = this.hasChange();
    const { saveFilePending } = this.props.home;
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
            {hasChange &&
            <Button type="primary" size="small" loading={saveFilePending} disabled={saveFilePending} onClick={this.handleSave}>
              {saveFilePending ? 'Saving...' : 'Save'}
            </Button>}
            {hasChange && <Button size="small" onClick={this.handleCancel} disabled={saveFilePending}>Cancel</Button>}
          </div>
        </div>
        <MonacoEditor
          key={`${this.state.editorWidth}-${this.state.editorHeight}`}
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
    home: state.home,
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
