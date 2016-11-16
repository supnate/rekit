import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Tc2 } from 'src/features/test-1';

describe('test-1/Tc2', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <Tc2 />
    );

    expect(
      renderedComponent.find('.test-1-tc-2').node
    ).to.exist;
  });
});
