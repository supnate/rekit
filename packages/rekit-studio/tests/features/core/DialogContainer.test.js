import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DialogContainer } from 'src/features/core/DialogContainer';

describe('core/DialogContainer', () => {
  it('renders node with correct class name', () => {
    const props = {
      coreUi: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DialogContainer {...props} />
    );

    expect(
      renderedComponent.find('.core-dialog-container').getElement()
    ).to.exist;
  });
});
