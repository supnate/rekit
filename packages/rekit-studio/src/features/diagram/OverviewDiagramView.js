import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { OverviewDiagram } from './';
import element from '../../common/element';

export class OverviewDiagramView extends Component {
  static propTypes = {
    elementById: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  handleNodeClick = node => {
    element.show(node.id, 'diagram');
  }

  render() {
    return (
      <div className="diagram-overview-diagram-view">
        <OverviewDiagram elementById={this.props.elementById} onNodeClick={this.handleNodeClick}/>
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
    actions: bindActionCreators({ ...actions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OverviewDiagramView);
