import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import { Button, Icon, message, Modal } from 'antd';
import MonacoEditor from 'react-monaco-editor';
import { fetchFileContent } from './redux/actions';

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
    await this.fetchFileContent(this.props);
    this.setState({ // eslint-disable-line
      currentContent: this.getFileContent(),
    });
    this.props.onStateChange({ hasChange: false });    
  }

  async componentWillReceiveProps(nextProps) {
    const { props } = this;
    if (props.file !== nextProps.file || props.home.fileContentById[props.file] !== nextProps.home.fileContentById[nextProps.file]) {
      // File changed or file content changed.
      await this.fetchFileContent(nextProps);
      this.setState({
        currentContent: this.getFileContent(),
      });
      this.props.onStateChange({ hasChange: false });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }
  getFileContent() {
    return this.props.home.fileContentById[this.props.file];
  }

  hasChange() {
    return this.state.currentContent !== this.getFileContent();
  }

  fetchFileContent(props, force = false) {
    const { home } = props;
    if (
      (force || !_.has(home.fileContentById, props.file))
      && !home.fetchFileContentPending
    ) {
      return this.props.actions.fetchFileContent(props.file).then(() => {
        this.setState({ notFound: false });
      }).catch((e) => {
        message.error(`Failed to load file: ${e.toString()}`);
        if (_.get(e, 'response.status') === 404) {
          this.setState({ notFound: true });
          this.props.onError(404);
        }
      });
    }
    this.setState({ notFound: false });
    return Promise.resolve();
  }

  handleWindowResize = () => {
    // Todo: bounce resize event to improve performance when resizing.
    let editorHeight = document.body.offsetHeight - 215;
    const editorWidth = document.body.offsetWidth - 380;
    if (editorHeight < 100) editorHeight = 100;
    this.setState({ editorWidth, editorHeight });
  }

  handleEditorChange = (newValue) => {
    this.setState({
      currentContent: newValue,
    });
    this.props.onStateChange({ hasChange: newValue !== this.getFileContent() });
  }

  handleEditorDidMount = (editor) => {console.log(editor);
    editor.focus();
    editor.addCommand([monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S], () => { // eslint-disable-line
      console.log('SAVE pressed!');
    });
  }

  handleRunTest = () => {
    this.props.onRunTest();
  }

  handleSave = () => {}
  handleCancel = () => {
    Modal.confirm({
      title: 'Are you sure to discard your changes?',
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
            {hasChange && <Button type="primary" size="small" onClick={this.handleSave}>Save</Button>}
            {hasChange && <Button size="small" onClick={this.handleCancel}>Cancel</Button>}
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
    actions: bindActionCreators({ fetchFileContent }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CodeEditor);
