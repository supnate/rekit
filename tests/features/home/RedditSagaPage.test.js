import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { RedditSagaPage } from 'src/features/home/RedditSagaPage';

describe('home/RedditSagaPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RedditSagaPage {...props} />
    );

    expect(
      renderedComponent.find('.home-reddit-saga-page').node
    ).to.exist;
  });
});
