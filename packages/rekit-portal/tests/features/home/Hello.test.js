import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Hello } from 'src/features/home';

describe('features/home/Hello', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <Hello />
    );

    expect(
      renderedComponent.find('.home-hello').getElement()
    ).to.exist;
  });
});
