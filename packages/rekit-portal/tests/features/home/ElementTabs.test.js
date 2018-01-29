import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ElementTabs } from 'src/features/home/ElementTabs';

describe('home/ElementTabs', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: { openTabs: [], historyTabs: [] },
      actions: {},
      router: { location: { pathname: 'pathname' } },
    };
    const renderedComponent = shallow(
      <ElementTabs {...props} />
    );

    expect(
      renderedComponent.find('.home-element-tabs').getElement()
    ).to.exist;
  });
});
