import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { setOutlineWidth } from './redux/actions';

export class OutlineReiszer extends Component {
  static propTypes = {
    sidePanelWidth: PropTypes.number.isRequired,
    actions: PropTypes.object.isRequired,
  };

  state = {
    dragging: false,
  };

  assignRef = node => {
    this.node = node;
  };

  handleMouseDown = () => {
    this.setState({ dragging: true });
  };

  handleMouseMove = evt => {
    if (!this.state.dragging) return;
    this.props.actions.setOutlineWidth(evt.pageX);
    window.dispatchEvent(new window.Event('resize'));
  };

  handleMouseUp = () => {
    this.setState({ dragging: false });
  };

  render() {
    return (
      <div
        className={classnames('home-outline-resizer', { 'is-dragging': this.state.dragging })}
        style={{ left: `${this.props.sidePanelWidth}px` }}
        ref={this.assignRef}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
      >
        <div
          className="true-resizer"
          style={{ left: `${this.state.dragging ? this.props.sidePanelWidth : 0}px` }}
          onMouseDown={this.handleMouseDown}
        />
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    sidePanelWidth: state.home.sidePanelWidth,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ setOutlineWidth }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OutlineReiszer);
