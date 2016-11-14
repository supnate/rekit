import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { TestC } from 'src/features/test-1';

describe('test-1/TestC', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <TestC />
    );

    expect(
      renderedComponent.find('.test-1-test-c').node
    ).to.exist;
  });
});
