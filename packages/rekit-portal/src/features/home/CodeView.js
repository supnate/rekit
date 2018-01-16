import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { message } from 'antd';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-less';
import 'prismjs/components/prism-sass';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-dart';
import 'prismjs/components/prism-diff';
import 'prismjs/components/prism-git';
import 'prismjs/components/prism-makefile';
import 'prismjs/components/prism-perl';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-basic';
import 'prismjs/components/prism-clike';
import 'prismjs/plugins/line-numbers/prism-line-numbers';

import { fetchFileContent } from './redux/actions';

export class CodeView extends PureComponent {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    file: PropTypes.string.isRequired,
    onError: PropTypes.func,
  };

  static defaultProps = {
    onError() {},
  };

  state = {
    notFound: false,
  };

  componentDidMount() {
    this.fetchFileContent(this.props).then(this.highlightCode);
  }

  componentWillReceiveProps(nextProps) {
    const props = this.props;
    if (this.props.file !== nextProps.file || props.home.fileContentById[props.file] !== nextProps.home.fileContentById[nextProps.file]) {
      this.fetchFileContent(nextProps);
    }
  }

  componentDidUpdate() {
    this.highlightCode();
  }

  getFileContent() {
    return this.props.home.fileContentById[this.props.file];
  }

  @autobind
  highlightCode() {
    const code = this.getFileContent();
    if (this.codeNode && code !== this.lastCode) {
      Prism.highlightElement(this.codeNode);
      this.lastCode = code;
    }
  }

  fetchFileContent(props, force = false) {
    const home = props.home;
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

  render() {
    const content = this.getFileContent();
    const ext = this.props.file.split('.').pop();
    const lang = { js: 'jsx', md: 'markdown' }[ext] || ext;

    return (
      <div className="home-code-view">
        <div className="file-path">{this.props.file}</div>
        {this.state.notFound ?
          <div style={{ color: 'red', marginTop: 10 }}>File not found.</div>
        :
          <pre><code className={`language-${lang} line-numbers`} ref={(node) => { this.codeNode = node; }}>
            {typeof content === 'string' ? content : '// Loading...'}
          </code></pre>
        }
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
)(CodeView);
