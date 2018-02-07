import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { WelcomePage } from 'src/features/home';

describe('home/WelcomePage', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <WelcomePage />
    );

    expect(
      renderedComponent.find('.home-welcome-page').getElement()
    ).to.exist;
  });
});
