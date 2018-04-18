import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default class Resizer extends Component {
  static propTypes = {
    onResize: PropTypes.func.isRequired,
    direction: PropTypes.oneOf(['vertical', 'horizontal']),
    // fix: PropTypes.boolean,
    position: PropTypes.object.isRequired,
  };

  static defaultProps = {
    // fix: false,
    direction: 'vertical',
  };

  state = {
    dragging: false,
  };

  componentDidMount() {
    this.maskNode = document.createElement('div');
    this.maskNode.style.display = 'none';
    this.maskNode.className = 'common-resizer-mask';
    document.body.appendChild(this.maskNode);
  }

  assignRef = node => {
    this.node = node;
  };

  handleMouseDown = () => {
    this.setState({ dragging: true });
  };

  handleMouseMove = evt => {
    if (!this.state.dragging) return;
    // this.props.actions.setSidePanelWidth(evt.pageX);
    this.props.onResize(evt);
    window.dispatchEvent(new window.Event('resize'));
  };

  handleMouseUp = () => {
    this.setState({ dragging: false });
  };

  render() {
    const { direction } = this.props;
    return (
      <div
        className={classnames('common-resizer', `direction-${direction}`, { 'is-dragging': this.state.dragging })}
        ref={this.assignRef}
      />
    );
    // return (
    //   <div
    //     className={classnames('home-side-panel-resizer', { 'is-dragging': this.state.dragging })}
    //     style={{ left: `${this.props.sidePanelWidth}px` }}
    //     ref={this.assignRef}
    //     onMouseUp={this.handleMouseUp}
    //     onMouseMove={this.handleMouseMove}
    //   >
    //     <div
    //       className="true-resizer"
    //       style={{ left: `${this.state.dragging ? this.props.sidePanelWidth : 0}px` }}
    //       onMouseDown={this.handleMouseDown}
    //     />
    //   </div>
    // );
  }
}
