import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { CleanApp } from 'src/features/home';

describe('home/CleanApp', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <CleanApp />
    );

    expect(
      renderedComponent.find('.home-app').node
    ).to.exist;
  });
});
