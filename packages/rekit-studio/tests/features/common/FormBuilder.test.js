import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { FormBuilder } from 'src/features/common';

describe('common/FormBuilder', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <FormBuilder />
    );

    expect(
      renderedComponent.find('.common-form-builder').getElement()
    ).to.exist;
  });
});
