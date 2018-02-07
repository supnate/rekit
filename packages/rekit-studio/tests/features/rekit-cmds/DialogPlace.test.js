import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DialogPlace } from 'src/features/rekit-cmds/DialogPlace';

describe('rekit-cmds/DialogPlace', () => {
  it('renders node with correct class name', () => {
    const props = {
      rekitCmds: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DialogPlace {...props} />
    );

    expect(
      renderedComponent.find('.rekit-cmds-dialog-place').getElement()
    ).to.exist;
  });
});
