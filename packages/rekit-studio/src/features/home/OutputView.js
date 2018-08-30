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
  getSnapshotBeforeUpdate() {
    // why not called?
    const n = this.scrollNode;
    console.log('snapshot: ', n.scrollHeight, n.scrollTop, n.offsetHeight);
    return n.scrollHeight - n.scrollTop < n.offsetHeight * 1.8;
  }
  componentDidUpdate(prevProps, prevState, needScrollBottom) {
    const n = this.scrollNode;
    n.scrollTop = n.scrollHeight - n.offsetHeight;

  }

  assignRef = node => this.scrollNode = node;

  render() {
    const { output } = this.props;
    return (
      <div className="home-output-view" ref={this.assignRef}>
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
