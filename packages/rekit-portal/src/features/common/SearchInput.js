import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input } from 'antd';

export default class SearchInput extends PureComponent {
  static propTypes = {
    onSearch: PropTypes.func,
  };

  static defaultProps = {
    onSearch() {},
  };

  @autobind
  handleSearchInput(evt) {
    const key = evt.target.value;
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.props.onSearch(key);
      delete this.searchTimeout;
    }, 200);
  }

  render() {
    return (
      <Input.Search onChange={this.handleSearchInput} className="common-search-input" />
    );
  }
}
