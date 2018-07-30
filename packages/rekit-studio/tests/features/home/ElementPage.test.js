import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ElementPage } from 'src/features/home/ElementPage';

describe('home/ElementPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <ElementPage {...props} />
    );

    expect(
      renderedComponent.find('.home-element-page').getElement()
    ).to.exist;
  });
});
