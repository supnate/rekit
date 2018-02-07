import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { App } from 'src/features/home/App';

describe('home/App', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
      children: [],
    };
    const renderedComponent = shallow(
      <App {...props} />
    );

    expect(
      renderedComponent.find('.home-app').getElement()
    ).to.exist;
  });
});
