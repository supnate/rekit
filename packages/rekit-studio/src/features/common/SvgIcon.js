import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Load all svg files into svg sprite
const files = require.context('!svg-sprite-loader!../../svgicons', false, /.*\.svg$/);
files.keys().forEach(files);

export default class SvgIcon extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    size: PropTypes.number,
    className: PropTypes.string,
    style: PropTypes.object,
  };

  static defaultProps = {
    size: null,
    className: '',
    style: null,
  };

  render() {
    const { size, type } = this.props;
    const props = { ...this.props };
    delete props.type;
    delete props.size;
    delete props.className;
    if (size) {
      props.style = {
        ...this.props.style,
        width: `${size}px`,
        height: `${size}px`,
      };
    }
    const cssCls = `common-svg-icon common-svg-icon-${type} ${this.props.className || ''}`;
    return (
      <svg className={cssCls} xmlns="http://www.w3.org/2000/svg" {...props}>
        <use xlinkHref={`#${type}`} />
      </svg>
    );
  }
}
