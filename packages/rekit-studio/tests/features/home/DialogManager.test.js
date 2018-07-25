import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DialogManager } from 'src/features/home/DialogManager';

describe('home/DialogManager', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DialogManager {...props} />
    );

    expect(
      renderedComponent.find('.home-dialog-manager').getElement()
    ).to.exist;
  });
});
