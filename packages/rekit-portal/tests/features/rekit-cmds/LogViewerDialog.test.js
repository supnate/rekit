import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { LogViewerDialog } from 'src/features/rekit-cmds/LogViewerDialog';

describe('rekit-cmds/LogViewerDialog', () => {
  it('renders dialog without error', () => {
    const props = {
      rekitCmds: {
        execCmdResult: {
          args: {},
          logs: [],
        },
      },
    };
    const renderedComponent = shallow(
      <LogViewerDialog {...props} />
    );

    // antd Modal renders the dialog into document.body, do don't test the dialog
    expect(
      renderedComponent
    ).to.exist;
  });
});
