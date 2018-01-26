import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { TabsBar } from 'src/features/home/TabsBar';

describe('home/TabsBar', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TabsBar {...props} />
    );

    expect(
      renderedComponent.find('.home-tabs-bar').getElement()
    ).to.exist;
  });
});
