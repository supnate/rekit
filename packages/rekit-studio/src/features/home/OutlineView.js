import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Tree, Icon } from 'antd';
import OutlineWorker from 'worker-loader?name=outline.[hash].worker.js!./workers/outline'; // eslint-disable-line

import * as actions from './redux/actions';

const { TreeNode } = Tree;

export class OutlineView extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    code: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.worker = new OutlineWorker();
    this.setupWorker();
  }

  componentDidMount() {
    this.getOutline(this.props.code);
  }

  componentWillReceiveProps(nextProps) {
    this.getOutline(nextProps.code);
  }
  setupWorker() {
    this.worker.addEventListener('message', msg => {
      console.log('msg: ', msg);
    });
  }

  getOutline(code) {
    this.worker.postMessage({ code });
  }

  render() {
    return (
      <div className="home-outline-view">
        <Tree selectedKeys={[]}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="parent 1-0" key="0-0-0">
              <TreeNode title="leaf" key="0-0-0-0" />
              <TreeNode title="leaf" key="0-0-0-1" />
            </TreeNode>
            <TreeNode title="parent 1-1" key="0-0-1">
              <TreeNode title="sss" key="0-0-1-0" />
            </TreeNode>
          </TreeNode>
        </Tree>
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
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OutlineView);
