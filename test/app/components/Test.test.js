import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Test } from 'src/components';

describe('components/Test', () => {
  it('renders node with correct dom structure', () => {
    const renderedComponent = shallow(
      <Test />
    );

    expect(
      renderedComponent.find('.component-test').node
    ).to.exist;
  });
});
