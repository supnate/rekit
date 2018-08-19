import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { DepsDiagram } from '../diagram';

export class ElementDiagram extends Component {
  static propTypes = {
    pluginCra: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    elementById: PropTypes.object.isRequired,
    element: PropTypes.string.isRequired,
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

  render() {
    const { elementById } = this.props;
    return (
      <div className="plugin-cra-element-diagram">
        <DepsDiagram elementById={elementById} elementId={this.getElementId()} />
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    pluginCra: state.pluginCra,
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
