import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { LogViewerDialog } from 'src/features/core/LogViewerDialog';

describe('core/LogViewerDialog', () => {
  it('renders node with correct class name', () => {
    const props = {
      core: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <LogViewerDialog {...props} />
    );

    expect(
      renderedComponent.find('.core-log-viewer-dialog').getElement()
    ).to.exist;
  });
});
