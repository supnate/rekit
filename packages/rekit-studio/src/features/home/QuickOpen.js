import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import { getElementData } from './helpers';
import * as actions from './redux/actions';

export class QuickOpen extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentWillMount() {
    document.body.addEventListener('keypress', this.handleKeypress);
  }
  componentWillUnmount() {
    document.body.removeEventListener('keypress', this.handleKeypress);
  }

  handleKeypress = evt => {
    console.log('keypress', evt);
  };

  render() {
    const { elementById } = this.props.home;

    const result = Object.keys(elementById)
      .map(k => {
        const item = { ...elementById[k] };
        if (/component|action/.test(item.type)) {
          item.position = item.file.split('/').slice(0, -1).join('/');
        }
        return item;
      })
      .filter(e => /component|action|misc|file/.test(e.type))
      .slice(0, 15);

    const iconTypes = {
      component: 'appstore-o',
      action: 'notification',
      misc: 'file',
      file: 'file',
    };
    return (
      <div className="home-quick-open">
        <div className="input-container">
          <input placeholder="Type something to search..." />
        </div>
        <div className="quick-open-result">
          <ul>
            {result.map((item, i) => (
              <li className={i === 0 ? 'is-selected' : ''} key={item.file}>
                <Icon type={iconTypes[item.type]} />
                {item.name} <span className="element-description">{item.position}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    home: state.home,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(QuickOpen);
