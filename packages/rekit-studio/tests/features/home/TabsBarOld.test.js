import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { TabsBarOld } from 'src/features/home/TabsBarOld';

describe('home/TabsBarOld', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: { openTabs: [], historyTabs: [] },
      actions: {},
    };
    const renderedComponent = shallow(
      <TabsBarOld {...props} />
    );

    expect(
      renderedComponent.find('.home-tabs-bar-old').getElement()
    ).to.exist;
  });
});
