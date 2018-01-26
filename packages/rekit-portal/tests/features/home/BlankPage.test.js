import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { BlankPage } from 'src/features/home';

describe('home/BlankPage', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <BlankPage />
    );

    expect(
      renderedComponent.find('.home-blank-page').getElement()
    ).to.exist;
  });
});
