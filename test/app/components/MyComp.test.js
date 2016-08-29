import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { MyComp } from 'src/components';

describe('components/MyComp', () => {
  it('renders node with correct dom structure', () => {
    const renderedComponent = shallow(
      <MyComp />
    );

    expect(
      renderedComponent.find('.component-my-comp').node
    ).to.exist;
  });
});
