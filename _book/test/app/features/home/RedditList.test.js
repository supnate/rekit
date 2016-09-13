import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import _ from 'lodash';
import { RedditList } from 'src/features/home';

describe('home/RedditList', () => {
  it('renders node with correct dom structure', () => {
    const list = _.times(5, i => ({
      data: {
        id: `id${i}`,
        title: `test${i}`,
        url: `http://example.com/test${i}`,
      }
    }));

    const renderedComponent = shallow(
      <RedditList list={list} />
    );

    expect(
      renderedComponent.find('.home-reddit-list').node
    ).to.exist;

    expect(
      renderedComponent.find('a').length
    ).to.equal(5);
  });

  it('shows no content placeholder when list is empty', () => {
    const list = [];
    const renderedComponent = shallow(
      <RedditList list={list} />
    );

    expect(
      renderedComponent.find('.no-items-tip').node
    ).to.exist;
  });
});
