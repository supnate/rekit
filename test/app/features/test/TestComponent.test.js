import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { TestComponent } from 'src/features/test';

describe('test/TestComponent', () => {
  it('renders node with correct dom structure', () => {
    const renderedComponent = shallow(
      <TestComponent />
    );

    expect(
      renderedComponent.find('.test-test-component').node
    ).to.exist;
  });
});
