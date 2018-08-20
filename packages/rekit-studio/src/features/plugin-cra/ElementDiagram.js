import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import history from '../../common/history';
import * as actions from './redux/actions';
import { DepsDiagram } from '../diagram';
import { getElementDiagramData } from './selectors/getElementDiagramData';
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
      case 'component':
        elementId = element.parts[0];
        break;
      case 'action':
        elementId = element.parts[0];
        break;
      default:
        throw new Error('Unknown element type: ' + element.type);
    }
    return elementId;
  }

  getDiagramData() {
    const { elementById } = this.props;
    const byId = id => elementById[id];
    let { nodes, links } = getElementDiagramData(elementById, this.getElementId());

    // Filter out tests files
    nodes = nodes.filter(node => /^src\//.test(node.id));
    links = links.filter(link => /^src\//.test(link.source) && /^src\//.test(link.target));

    // Add features nodes
    const targetId = this.getElementId();
    const targetFeature = byId(targetId).feature;
    const featureNodes = [];
    nodes.forEach(node => {
      const ele = byId(node.id);
      const ownerEle = (ele.owner && byId(ele.owner)) || null;
      if (ownerEle) {
        node.name = ownerEle.name;
        node.bgColor = colors[ownerEle.type];
      } else {
        node.bgColor = colors[ele.type];
      }

      if (ele.feature && ele.feature !== targetFeature) {
        const fid = 'v:feature-' + ele.feature;
        if (!_.find(featureNodes, { id: fid })) {
          featureNodes.push({
            id: fid,
            name: ele.feature,
            radius: 20,
            bgColor: colors.feature,
            doubleCircle: true,
            cursor: 'default',
            noClick: true,
          });
        }
        links.push({
          source: fid,
          target: node.id,
          length: 100,
          type: 'child',
        });
        links.push({
          source: fid,
          target: targetId,
          length: 200,
          type: 'no-line',
        });
      }
    });
    nodes = [...nodes, ...featureNodes];

    return { nodes, links };
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
      <div className="plugin-cra-element-diagram">
        <div className="diagram-container">
          <DepsDiagram nodes={nodes} links={links} targetId={targetId} handleNodeClick={this.handleNodeClick} />
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
