import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { SidePanel } from 'src/features/home/SidePanel';

describe('home/SidePanel', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {
        projectRoot: '/app1',
      },
      actions: {},
    };
    const renderedComponent = shallow(
      <SidePanel {...props} />
    );

    expect(
      renderedComponent.find('.home-side-panel').getElement()
    ).to.exist;
  });
});
