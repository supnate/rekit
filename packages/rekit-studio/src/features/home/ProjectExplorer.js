import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Spin, Tree } from 'antd';
import * as actions from './redux/actions';
import { treeDataSelector } from './selectors/projectData';
import { ProjectExplorerContextMenu } from './';

const TreeNode = Tree.TreeNode;

export class ProjectExplorer extends Component {
  static propTypes = {
    projectData: PropTypes.object,
    treeData: PropTypes.array,
    actions: PropTypes.object.isRequired,
  };

  static defaultProps = {
    projectData: null,
    treeData: null,
  };

  handleContextMenu = (evt) => {
    this.ctxMenu.handleContextMenu(evt);
  }

  assignCtxMenu = ctxMenu => this.ctxMenu = ctxMenu.getWrappedInstance();

  renderTreeNode = nodeData => {
    return (
      <TreeNode key={nodeData.key} title={nodeData.name} className={nodeData.className} isLeaf={!nodeData.children}>
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
        {treeNodes.length > 0 ? (
          <Tree onRightClick={this.handleContextMenu}>{treeNodes}</Tree>
        ) : (
          <div className="no-results">Project not found.</div>
        )}
        <ProjectExplorerContextMenu ref={this.assignCtxMenu} />
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
