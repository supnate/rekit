import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { clearOutput } from './redux/actions';

export class OutputView extends Component {
  static propTypes = {
    output: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    const { output } = this.props;
    return (
      <div className="home-output-view">
        <ul>
          {output.length === 0 && <li key="empty">No output.</li>}
          {output.map((html, i) => <li key={i} dangerouslySetInnerHTML={{ __html: html }} />)}
        </ul>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    output: state.home.output,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ clearOutput }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OutputView);
