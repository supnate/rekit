import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { DepsDiagram } from '../diagram';
import { getElementDiagramData } from './selectors/getElementDiagramData';

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
    const { nodes, links } = getElementDiagramData(elementById, this.getElementId());

    return { nodes, links };
  }

  handleNodeClick = node => {};

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
