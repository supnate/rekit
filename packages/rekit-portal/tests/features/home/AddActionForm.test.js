import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { AddActionForm } from 'src/features/home';

describe('home/AddActionForm', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <AddActionForm />
    );

    expect(
      renderedComponent.find('.home-add-action-form').node
    ).to.exist;
  });
});
