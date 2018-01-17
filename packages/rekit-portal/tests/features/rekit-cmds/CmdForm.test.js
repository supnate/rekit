import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { CmdForm } from 'src/features/rekit-cmds/CmdForm';

describe('rekit-cmds/CmdForm', () => {
  it('renders node with correct class name', () => {
    const props = {
      rekitCmds: {},
      home: {
        features: ['f1'],
        featureById: {
          f1: {
            name: 'F1',
            deps: [],
          }
        },
      },
      actions: {},
      form: {},
    };
    const renderedComponent = shallow(
      <CmdForm {...props} />
    );

    expect(
      renderedComponent.find('.rekit-cmds-cmd-form').getElement()
    ).to.exist;
  });
});
