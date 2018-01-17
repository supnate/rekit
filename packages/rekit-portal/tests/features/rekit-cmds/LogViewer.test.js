import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { LogViewer } from 'src/features/rekit-cmds';

describe('rekit-cmds/LogViewer', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <LogViewer />
    );

    expect(
      renderedComponent.find('.rekit-cmds-log-viewer').getElement()
    ).to.exist;
  });
});
