import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ImageView } from 'src/features/home';

describe('home/ImageView', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <ImageView />
    );

    expect(
      renderedComponent.find('.home-image-view').getElement()
    ).to.exist;
  });
});
