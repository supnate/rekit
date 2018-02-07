import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { QuickOpen } from 'src/features/home/QuickOpen';

describe('home/QuickOpen', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <QuickOpen {...props} />
    );

    expect(
      renderedComponent.find('.home-quick-open').getElement()
    ).to.exist;
  });
});
