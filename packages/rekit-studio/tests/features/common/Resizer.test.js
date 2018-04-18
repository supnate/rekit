import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Resizer } from 'src/features/common';

describe('common/Resizer', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <Resizer />
    );

    expect(
      renderedComponent.find('.common-resizer').getElement()
    ).to.exist;
  });
});
