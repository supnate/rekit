import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { AllDepsDiagram } from './';
import { getAllDepsDiagramData } from './selectors/getAllDepsDiagramData';

export class AllDepsDiagramView extends Component {
  static propTypes = {
    elementById: PropTypes.object.isRequired,
  };

  render() {
    const { elementById } = this.props;
    const { nodes, links } = getAllDepsDiagramData({ elementById });
    console.log(nodes, links);
    return (
      <div className="diagram-all-deps-diagram-view">
        <AllDepsDiagram nodes={nodes} links={links} />
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
