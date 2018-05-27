import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default class Resizer extends Component {
  static propTypes = {
    // onResize: PropTypes.func.isRequired,
    // direction: PropTypes.oneOf(['vertical', 'horizontal']),
    // position: PropTypes.object.isRequired,
  };

  static defaultProps = {
    direction: 'vertical',
    _type: 'Layout.Resizer',
  };

  state = {
    dragging: false,
  };

  componentDidMount2() {
    this.maskNode = document.createElement('div');
    this.maskNode.style.display = 'none';
    this.maskNode.className = 'layout-resizer-mask';
    this.maskNode.addEventListener('mousemove', this.handleMouseMove);
    this.maskNode.addEventListener('mouseup', this.handleMouseUp);
    document.body.appendChild(this.maskNode);
    this.calcParentPosition();
    window.addEventListener('resize', this.calcParentPosition);
    if (this.props.direction === 'horizontal') this.maskNode.style.cursor = 'row-resize';
    else this.maskNode.style.cursor = 'col-resize';
  }

  componentWillUnmount2() {
    document.body.removeChild(this.maskNode);
    this.maskNode.removeEventListener('mousemove', this.handleMouseMove);
    this.maskNode.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('resize', this.calcParentPosition);
  }

  calcParentPosition = () => {
    this.parentPosition = this.node.offsetParent.getBoundingClientRect();
  };

  assignRef = node => {
    this.node = node;
  };

  handleMouseDown = () => {
    this.maskNode.style.display = 'block';
    this.setState({ dragging: true });
  };

  handleMouseMove = evt => {
    if (!this.state.dragging) return;
    if (this.props.direction === 'horizontal') {
      const top = evt.pageY - this.parentPosition.top;
      this.props.onResize({ top, bottom: this.parentPosition.height - top });
    } else {
      const left = evt.pageX - this.parentPosition.left;
      this.props.onResize({ left, right: this.parentPosition.width - left });
    }
  };

  handleMouseUp = () => {
    this.maskNode.style.display = 'none';
    this.setState({ dragging: false });
    window.dispatchEvent(new window.Event('resize'));
  };

  render() {return <div></div>
    const { direction, position } = this.props;
    const className = classnames('layout-resizer', `direction-${direction}`, { 'is-dragging': this.state.dragging });
    return (
      <div className={className} onMouseDown={this.handleMouseDown} ref={this.assignRef} style={position} />
    );
  }
}
