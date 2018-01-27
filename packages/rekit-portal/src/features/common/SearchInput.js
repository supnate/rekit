import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon, Input } from 'antd';

export default class SearchInput extends PureComponent {
  static propTypes = {
    onSearch: PropTypes.func,
  };

  static defaultProps = {
    onSearch() {},
  };

  state = {
    value: '',
  };

  handleClearClick = (evt) => {
    this.setState({
      value: '',
    });
    this.props.onSearch('');
    try {
      // Depends on the DOM structure of antd component, so try/catch it.
      evt.target.parentNode.previousSibling.focus();
    } catch(e) {}
  }

  handleSearchInput = (evt) => {
    const key = evt.target.value;
    this.setState({ value: key });
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.props.onSearch(key);
      delete this.searchTimeout;
    }, 200);
  }

  render() {
    return (
      <Input.Search
        className={this.state.value ? 'common-search-input no-search-icon' : 'common-search-input'}
        value={this.state.value}
        onChange={this.handleSearchInput}
        suffix={this.state.value && <Icon type="close-circle" onClick={this.handleClearClick} />}
      />
    );
  }
}
