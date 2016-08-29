import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Hello } from 'features/home';

describe('home/Hello', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <Hello />
    );

    expect(
      renderedComponent.find('.home-hello').node
    ).to.exist;
  });
});
