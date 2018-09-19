import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

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
    fill: null,
  };

  render() {
    const { size, type, fill } = this.props;
    const props = { ...this.props };
    delete props.type;
    delete props.size;
    delete props.className;
    delete props.fill;

    if (fill) {
      props.style = {
        ...props.style,
        fill,
      };
    }
    if (size) {
      props.style = {
        ...props.style,
        width: `${size}px`,
        height: `${size}px`,
      };
    }
    const cssCls = `common-svg-icon common-svg-icon-${type} ${this.props.className || ''}`;

    if (/^anticon-/.test(type)) {
      if (fill) {
        props.style.color = fill;
      }
      if (size) {
        delete props.style.width;
        delete props.style.height;
        props.style.fontSize = `${size}px`;
      }

      return <Icon className={cssCls} type={type.replace(/^anticon-/, '')} {...props} />;
    }
    return (
      <svg className={cssCls} xmlns="http://www.w3.org/2000/svg" {...props}>
        <use xlinkHref={`#${type}`} />
      </svg>
    );
  }
}
