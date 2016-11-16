import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Tc } from 'src/features/test-1';

describe('test-1/Tc', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <Tc />
    );

    expect(
      renderedComponent.find('.test-1-tc').node
    ).to.exist;
  });
});
