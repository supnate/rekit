import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Spin, Tree } from 'antd';
import * as actions from './redux/actions';
import { treeDataSelector } from './selectors/projectData';

const TreeNode = Tree.TreeNode;

export class ProjectExplorer extends Component {
  static propTypes = {
    projectData: PropTypes.object,
    treeData: PropTypes.object,
    actions: PropTypes.object.isRequired,
  };

  static defaultProps = {
    projectData: null,
    treeData: null,
  };

  renderTreeNode = nodeData => {
    return (
      <TreeNode
        key={nodeData.key}
        title={nodeData.name}
        className={nodeData.className}
        isLeaf={!nodeData.children}
      >
        {nodeData.children && nodeData.children.map(this.renderTreeNode)}
      </TreeNode>
    );
  };

  renderLoading() {
    return (
      <div className="home-project-explorer">
        <Spin />
      </div>
    );
  }

  render() {
    // const { features, srcFiles, featureById, treeData, searchKey } = this.props;
    const prjData = this.props.projectData;

    if (!prjData) {
      return this.renderLoading();
    }

    const treeNodes = this.props.treeData.map(this.renderTreeNode);

    return (
      <div
        className="home-project-explorer"
        ref={node => {
          this.rootNode = node;
        }}
      >
        {treeNodes.length > 0 ? <Tree>{treeNodes}</Tree> : <div className="no-results">Project not found.</div>}
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  const prjData = state.home.projectData;
  return {
    projectData: prjData,
    treeData: prjData ? treeDataSelector(prjData) : null,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectExplorer);
