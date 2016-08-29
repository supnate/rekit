import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { TestComp1 } from 'src/features/home';

describe('features/home/TestComp1', () => {
  it('renders node with correct dom structure', () => {
    const renderedComponent = shallow(
      <TestComp1 />
    );

    expect(
      renderedComponent.find('.home-test-comp-1').node
    ).to.exist;
  });
});
