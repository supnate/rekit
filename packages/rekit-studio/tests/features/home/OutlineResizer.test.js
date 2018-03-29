import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { OutlineResizer } from 'src/features/home/OutlineResizer';

describe('home/OutlineResizer', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <OutlineResizer {...props} />
    );

    expect(
      renderedComponent.find('.home-outline-resizer').getElement()
    ).to.exist;
  });
});
