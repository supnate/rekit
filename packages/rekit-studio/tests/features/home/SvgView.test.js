import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { SvgView } from 'src/features/home';

describe('home/SvgView', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <SvgView />
    );

    expect(
      renderedComponent.find('.home-svg-view').getElement()
    ).to.exist;
  });
});
