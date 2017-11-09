import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { About } from 'src/features/home/About';

describe('home/About', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {
        rekit: {},
      },
    };
    const renderedComponent = shallow(
      <About {...props} />
    );

    expect(
      renderedComponent.find('.home-about').node
    ).to.exist;
  });
});
