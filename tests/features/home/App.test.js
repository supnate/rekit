import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import App from 'src/features/home/App';


describe('features/home/App', () => {
  it('should render node with correct class name', () => {
    const renderedComponent = shallow(
      <App />
    );

    expect(
      renderedComponent.find('.home-app').getElement()
    ).to.exist;
  });
});
