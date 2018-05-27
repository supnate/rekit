import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';

export class Panel extends Component {
  static propTypes = {
    layout: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    direction: PropTypes.oneOf(['vertical', 'horizontal']),
    children: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    closable: PropTypes.bool,
    // layout: PropTypes.func,
  };

  static defaultProps = {
    direction: 'horizontal',
    className: '',
    width: 0,
    height: 0,
    style: {},
    closable: false,
    layout: () => {},
    _type: 'Layout.Panel',
  };

  handleResize(key) {}

  render() {
    const { direction, className, style, width, height } = this.props;
    const newStyle = { ...style };
    // if (direction === 'horizontal') {
    //   Object.assign(newStyle, { top: 0, bottom: 0 });
    // } else {
    //   Object.assign(newStyle, { left: 0, right: 0 });
    // }
    const totalSize = this.props.width || document.body.offsetWidth;
    const usedSize = 0;
    let autoSizeChild = null;
    let children = [...this.props.children];
    children = children.map(child => {
      if (!child.props || !/Layout\.Panel|Layout\.Resizer/.test(child.props._type)) return child;
      const childWidth = child.props.width;
      console.log('child width: ', childWidth);
      if (!childWidth && childWidth !== 0) {
        if (autoSizeChild) {
          throw new Error('More than one panel do not have width property, please check');
        }
        autoSizeChild = child;
      }
      return child;
    });
    if (!autoSizeChild) {
      autoSizeChild = children[children.length - 1];
    }
    return (
      <div className={`layout-panel ${className}`} style={newStyle}>
        {children}
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    layout: state.layout,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Panel);
