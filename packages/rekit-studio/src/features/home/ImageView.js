import React, { Component } from 'react';

export default class ImageView extends Component {
  static propTypes = {

  };

  render() {
    const { element } = this.props;
    const url = `/${element.id}`;
    return (
      <div className="home-image-view">
        <img src={url} alt={url} title={url} />
      </div>
    );
  }
}
