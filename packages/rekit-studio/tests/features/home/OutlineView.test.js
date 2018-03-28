import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { OutlineView } from 'src/features/home/OutlineView';

describe('home/OutlineView', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <OutlineView {...props} />
    );

    expect(
      renderedComponent.find('.home-outline-view').getElement()
    ).to.exist;
  });
});
