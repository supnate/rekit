import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { CommonForm } from 'src/features/core/CommonForm';

describe('core/CommonForm', () => {
  it('renders node with correct class name', () => {
    const props = {
      dialog: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <CommonForm {...props} />
    );

    expect(
      renderedComponent.find('.core-common-form').getElement()
    ).to.exist;
  });
});
