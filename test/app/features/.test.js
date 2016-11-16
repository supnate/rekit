import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import {  } from 'src/components';

describe('/', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      < />
    );

    expect(
      renderedComponent.find('.component-').node
    ).to.exist;
  });
});
