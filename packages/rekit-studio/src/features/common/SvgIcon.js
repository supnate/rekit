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
    fill: PropTypes.string,
  };

  static defaultProps = {
    size: null,
    className: '',
    style: null,
    fill: '#ddd',
  };

  render() {
    const { size, type, fill } = this.props;
    const props = { ...this.props };
    delete props.type;
    delete props.size;
    delete props.className;
    delete props.fill;
    if (size) {
      props.style = {
        fill,
        width: `${size}px`,
        height: `${size}px`,
        ...this.props.style,
      };
    }
    console.log(type, fill, props.style);
    const cssCls = `common-svg-icon common-svg-icon-${type} ${this.props.className || ''}`;
    return (
      <svg className={cssCls} xmlns="http://www.w3.org/2000/svg" {...props}>
        <use xlinkHref={`#${type}`} />
      </svg>
    );
  }
}
