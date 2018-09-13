import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import history from '../../common/history';
import * as actions from './redux/actions';
import { DepsDiagram } from '../diagram';
// import { getElementDiagramData } from './selectors/getElementDiagramData';
import { getDepsDiagramData } from '../diagram/selectors/getDepsDiagramData';

import colors from './colors';

export class ElementDiagram extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    elementById: PropTypes.object.isRequired,
    element: PropTypes.object.isRequired,
  };

  getElementId() {
    const { element } = this.props;
    let elementId;
    switch (element.type) {
      case 'ui-module':
      case 'page':
      case 'layout':
      case 'service':
        elementId = element.parts[0];
        break;
      case 'file':
        elementId = element.id;
        break;
      default:
        throw new Error('Unknown element type: ' + element.type);
    }
    return elementId;
  }

  getDiagramData() {
    const { elementById } = this.props;
    const byId = id => elementById[id];
    // let { nodes, links } = getDepsDiagramData(elementById, this.getElementId());
    return getDepsDiagramData({ elementById, elementId: this.getElementId() });

    // Filter out tests files
    // nodes = nodes.filter(node => /^src\//.test(node.id));
    // links = links.filter(link => /^src\//.test(link.source) && /^src\//.test(link.target));

    // return { nodes, links };
  }

  handleNodeClick = node => {
    const byId = id => this.props.elementById[id];

    let ele = byId(node.id);
    if (ele.owner) ele = byId(ele.owner);

    history.push(`/element/${encodeURIComponent(ele.id)}/diagram`);
  };

  render() {
    const targetId = this.getElementId();
    const { nodes, links } = this.getDiagramData();
    return (
      <div className="plugin-node-element-diagram">
        <div className="diagram-container">
          <DepsDiagram
            nodes={nodes}
            links={links}
            targetId={targetId}
            handleNodeClick={this.handleNodeClick}
          />
        </div>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    elementById: state.home.elementById,
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
)(ElementDiagram);
