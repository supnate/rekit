import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DemoAlert } from 'src/features/home';

describe('home/DemoAlert', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <DemoAlert />
    );

    expect(
      renderedComponent.find('.home-demo-alert').getElement()
    ).to.exist;
  });
});
