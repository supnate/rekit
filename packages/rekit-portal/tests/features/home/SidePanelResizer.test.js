import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { SidePanelResizer } from 'src/features/home/SidePanelResizer';

describe('home/SidePanelResizer', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <SidePanelResizer {...props} />
    );

    expect(
      renderedComponent.find('.home-side-panel-resizer').getElement()
    ).to.exist;
  });
});
