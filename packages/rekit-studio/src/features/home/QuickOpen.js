import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon } from 'antd';
// import Fuse from 'fuse.js';
import fuzzy from 'fuzzy';
import { getElementData } from './helpers';
import * as actions from './redux/actions';

export class QuickOpen extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  state = {
    search: '',
    results: [],
    visible: false,
  };

  componentWillMount() {
    document.body.addEventListener('keydown', this.handleKeydown);
  }
  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.handleKeydown);
  }

  handleKeydown = evt => {
    if (evt.key === 'p' && evt.metaKey) {
      evt.preventDefault();
      evt.stopPropagation();
      const newState = {
        visible: !this.state.visible,
      };
      if (newState.visible) {
        newState.search = '';
        newState.results = [];
      }
      this.setState(newState, () => {
        if (this.inputNode) this.inputNode.focus();
      });
    }
    if (evt.key === 'Escape') {
      this.setState({ visible: false });
    }
  };

  handleInputBlur = evt => {
    evt.stopPropagation();
    evt.preventDefault();
    setTimeout(() => this.setState({ visible: false }), 50);
  };

  handleInputChange = evt => {
    console.log('searching: ', evt.target.value);
    this.setState({ search: evt.target.value });
    if (evt.target.value.indexOf('|') >= 0) {
      this.setState({ results: [] });
      return;
    }

    const { elementById } = this.props.home;
    const list = Object.keys(elementById)
      .map(k => {
        const item = { ...elementById[k] };
        if (/component|action/.test(item.type)) {
          item.position = item.file
            .split('/')
            .slice(0, -1)
            .join('/');
        }
        return item;
      })
      .filter(e => /component|action/.test(e.type))
      .map(e => `${e.position}/|${e.name}`);

    const options = { pre: '<strong>', post: '</strong>' };
    const results = fuzzy.filter(evt.target.value, list, options).map(s => {
      const arr = s.string.split('|');
      const name = arr.pop();
      return `${name}<span class="element-description">${arr.join('')}</span>`;
    });
    this.setState({ results });
  };

  render() {
    if (!this.state.visible) return null;
    const { elementById } = this.props.home;

    const result = Object.keys(elementById)
      .map(k => {
        const item = { ...elementById[k] };
        if (/component|action/.test(item.type)) {
          item.position = item.file
            .split('/')
            .slice(0, -1)
            .join('/');
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
          <input
            ref={n => (this.inputNode = n)}
            onBlur={this.handleInputBlur}
            placeholder="Type something to search..."
            value={this.state.search}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="quick-open-result">
          <ul>
            {this.state.results.length === 0 && <li className="no-results is-selected">No results found.</li>}
            {this.state.results.map((s, i) => (
              <li className={i === 0 ? 'is-selected' : ''} key={s}>
                <Icon type="appstore-o" />
                <span dangerouslySetInnerHTML={{ __html: s }} />
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
