import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import fuzzysort from 'fuzzysort';
import scrollIntoView from 'dom-scroll-into-view';
import history from '../../common/history';
import { SvgIcon } from '../common';
import { getProjectElements } from './selectors/projectData';

export class QuickOpen extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    elementById: PropTypes.object.isRequired,
    elements: PropTypes.array.isRequired,
  };

  state = {
    selectedIndex: 0,
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

  highlightMatch(item) {
    const indexes = item.indexes.reduce((prev, i) => {
      prev[i] = true;
      return prev;
    }, {});

    const posLength = item.obj.position.length + 1;
    const highlightedName = item.obj.name
      .split('')
      .map((c, i) => (indexes[posLength + i] ? `<strong>${c}</strong>` : c))
      .join('');

    const highlightedPos = item.obj.position
      .split('')
      .map((c, i) => (indexes[i] ? `<strong>${c}</strong>` : c))
      .join('');
    return `${highlightedName}<span class="element-description">${highlightedPos}</span>`;
  }

  handleKeydown = evt => {
    if (evt.key === 'p' && (evt.metaKey || evt.ctrlKey)) {
      evt.preventDefault();
      evt.stopPropagation();
      const newState = {
        visible: !this.state.visible,
      };
      if (newState.visible) {
        newState.search = '';
        newState.results = [];
        newState.selectedIndex = 0;
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
    this.setState({ search: evt.target.value });
    if (evt.target.value.indexOf('|') >= 0) {
      this.setState({ results: [] });
      return;
    }

    const { elementById, elements } = this.props;
    const list = getProjectElements({ elements, elementById }).map(ele => ({
      ...ele,
      position: ele.id,
      toSearch: `${ele.id}`,
    }));

    // const list = Object.keys(elementById)
    //   .map(k => {
    //     const item = {
    //       ...elementById[k],
    //     };
    //     if (/component|action|misc/.test(item.type)) {
    //       item.position = item.file
    //         .split('/')
    //         .slice(0, -1)
    //         .join('/');
    //       item.toSearch = `${item.position}/${item.name}`;
    //     }
    //     return item;
    //   })
    //   .filter(e => /component|action|misc/.test(e.type));

    const results = fuzzysort.go(evt.target.value, list, { key: 'toSearch' });
    this.setState({ results, selectedIndex: 0 });
  };

  handleInputKeyDown = evt => {
    const scrollToSelected = () => {
      scrollIntoView(this.resultsNode.querySelectorAll('li')[this.state.selectedIndex], this.resultsNode, {
        onlyScrollIfNeeded: true,
      });
    };
    switch (evt.key) {
      case 'Enter':
        this.handleItemClick(this.state.selectedIndex);
        evt.preventDefault();
        break;
      case 'ArrowUp':
        evt.preventDefault();
        this.setState(
          {
            selectedIndex: this.state.selectedIndex < 1 ? this.state.results.length - 1 : this.state.selectedIndex - 1,
          },
          scrollToSelected
        );
        break;
      case 'ArrowDown':
        evt.preventDefault();
        this.setState(
          {
            selectedIndex: this.state.selectedIndex < this.state.results.length - 1 ? this.state.selectedIndex + 1 : 0,
          },
          scrollToSelected
        );
        break;
      default:
        break;
    }
  };

  handleItemClick = index => {
    this.setState({ visible: false });
    const item = this.state.results[index];
    history.push(`/element/${encodeURIComponent(item.obj.id)}/code`);
  };
  render() {
    if (!this.state.visible) return null;

    return (
      <div className="home-quick-open">
        <div className="input-container">
          <input
            ref={n => (this.inputNode = n)}
            onBlur={this.handleInputBlur}
            placeholder="Type something to search..."
            value={this.state.search}
            onKeyDown={this.handleInputKeyDown}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="quick-open-result" ref={n => (this.resultsNode = n)}>
          <ul>
            {this.state.results.length === 0 && <li className="no-results is-selected">No results found.</li>}
            {this.state.results.map((item, i) => (
              <li
                className={i === this.state.selectedIndex ? 'is-selected' : ''}
                key={item.obj.file}
                onClick={() => this.handleItemClick(i)}
              >
                {item.obj.icon && <SvgIcon type={item.obj.icon} style={{ fill: item.obj.iconColor || '#ccc' }} />}
                <span dangerouslySetInnerHTML={{ __html: this.highlightMatch(item) }} />
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
    elementById: state.home.elementById,
    elements: state.home.elements,
  };
}

export default connect(mapStateToProps)(QuickOpen);
