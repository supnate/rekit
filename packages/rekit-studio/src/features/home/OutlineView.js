import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Tree } from 'antd';
import OutlineWorker from 'worker-loader?name=outline.[hash].worker.js!./workers/outline'; // eslint-disable-line
import { getTreeNodeData } from '../common/utils';

const { TreeNode } = Tree;

export default class OutlineView extends Component {
  static propTypes = {
    code: PropTypes.string.isRequired,
    onSelectNode: PropTypes.func,
    width: PropTypes.number.isRequired,
  };

  static defaultProps = {
    onSelectNode() {},
  };

  constructor(props) {
    super(props);
    this.worker = new OutlineWorker();
    this.setupWorker();
    this.createOutline();
  }

  state = {
    treeData: null,
    defaultExpandedKeys: [],
  };

  componentDidMount() {
    this.createOutline(this.props.code);
  }

  componentWillReceiveProps(nextProps) {
    this.createOutline(nextProps.code);
  }

  componentWillUnmount() {
    this.worker.terminate();
  }
  setupWorker() {
    this.worker.addEventListener('message', msg => {
      if (msg.data.root && msg.data.root.children) {
        const classes = msg.data.root.children.filter(n => n.type === 'ClassDeclaration').map(n => n.key);
        this.setState({
          treeData: msg.data.root,
          defaultExpandedKeys: _.union(this.state.defaultExpandedKeys, classes),
        });
      }
    });
  }

  createOutline = _.debounce(code => {
    this.worker.postMessage({ code });
  }, 200);

  handleTreeSelect = (keys, evt) => {
    const nodeData = getTreeNodeData(this.state.treeData, evt.node.props.eventKey);
    if (nodeData) {
      this.props.onSelectNode(nodeData);
    }
  };

  renderTreeNodeTitle(nodeData) {
    return (
      <span>
        <span className={`node-icon node-icon-${_.kebabCase(nodeData.type)}`} />
        {nodeData.label}
      </span>
    );
  }

  renderTreeNode = nodeData => {
    if (!nodeData) return null;
    return (
      <TreeNode title={this.renderTreeNodeTitle(nodeData)} key={nodeData.key}>
        {nodeData.children ? nodeData.children.map(item => this.renderTreeNode(item)) : null}
      </TreeNode>
    );
  };

  render() {
    return (
      <div className="home-outline-view" style={{ width: `${this.props.width}px` }}>
        {this.state.treeData &&
          (_.get(this.state.treeData, 'children.length') || 0) === 0 && (
            <div className="no-outline">No outline to show.</div>
          )}
        <Tree selectedKeys={[]} expandedKeys={this.state.defaultExpandedKeys} onSelect={this.handleTreeSelect}>
          {this.state.treeData && this.state.treeData.children.map(this.renderTreeNode)}
        </Tree>
      </div>
    );
  }
}
