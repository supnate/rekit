import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Resizer } from 'src/features/layout';

describe('layout/Resizer', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <Resizer />
    );

    expect(
      renderedComponent.find('.layout-resizer').getElement()
    ).to.exist;
  });
});
