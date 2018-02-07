import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { AllRoutesPage } from 'src/features/home/AllRoutesPage';

describe('home/AllRoutesPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <AllRoutesPage {...props} />
    );

    expect(
      renderedComponent.find('.home-all-routes-page').getElement()
    ).to.exist;
  });
});
