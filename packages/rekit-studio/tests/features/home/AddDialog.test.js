import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { AddDialog } from 'src/features/home';

describe('home/AddDialog', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <AddDialog />
    );

    expect(
      renderedComponent.find('.home-add-dialog').getElement()
    ).to.exist;
  });
});
