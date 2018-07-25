import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { FormDialog } from 'src/features/core/FormDialog';

describe('core/FormDialog', () => {
  it('renders node with correct class name', () => {
    const props = {
      coreUi: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <FormDialog {...props} />
    );

    expect(
      renderedComponent.find('.core-form-dialog').getElement()
    ).to.exist;
  });
});
