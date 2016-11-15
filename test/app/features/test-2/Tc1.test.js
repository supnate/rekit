import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Tc1 } from 'src/features/test-2';

describe('test-2/Tc1', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <Tc1 />
    );

    expect(
      renderedComponent.find('.test-2-tc-1').node
    ).to.exist;
  });
});
