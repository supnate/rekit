import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { AllDepsDiagram } from './';
import element from '../../common/element';

export class AllDepsDiagramView extends Component {
  static propTypes = {
    elementById: PropTypes.object.isRequired,
  };

  handleNodeClick = node => {
    element.show(node.id, 'diagram');
  }

  render() {
    const { elementById } = this.props;
    return (
      <div className="diagram-all-deps-diagram-view">
        <AllDepsDiagram elementById={elementById} onNodeClick={this.handleNodeClick} />
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
)(AllDepsDiagramView);
