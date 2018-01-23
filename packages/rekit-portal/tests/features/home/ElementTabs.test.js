import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ElementTabs } from 'src/features/home/ElementTabs';

describe('home/ElementTabs', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <ElementTabs {...props} />
    );

    expect(
      renderedComponent.find('.home-element-tabs').getElement()
    ).to.exist;
  });
});
