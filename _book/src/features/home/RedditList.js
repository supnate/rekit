import React, { PureComponent, PropTypes } from 'react';

export default class RedditList extends PureComponent {
  static propTypes = {
    list: PropTypes.array,
  };

  static defaultProps = {
    list: [],
  };

  render() {
    return (
      <ul className="home-reddit-list">
        {
          this.props.list.length > 0 ?
            this.props.list.map(item => <li key={item.data.id}><a href={item.data.url}>{item.data.title}</a></li>)
            : <li className="no-items-tip">No items yet.</li>
        }
      </ul>
    );
  }
}
