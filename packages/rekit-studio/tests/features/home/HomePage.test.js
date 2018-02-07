import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { HomePage } from 'src/features/home/HomePage';

describe('home/HomePage', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: { features: [], featureById: {} },
      actions: {},
    };
    const renderedComponent = shallow(
      <HomePage {...props} />
    );

    expect(
      renderedComponent.find('.home-home-page').getElement()
    ).to.exist;
  });
});
