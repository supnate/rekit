import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { RekitSteps } from 'src/features/home';

describe('home/RekitSteps', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <RekitSteps />
    );

    expect(
      renderedComponent.find('.home-rekit-steps').getElement()
    ).to.exist;
  });
});
