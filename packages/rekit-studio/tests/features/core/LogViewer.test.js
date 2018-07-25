import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { LogViewer } from 'src/features/core';

describe('core/LogViewer', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <LogViewer />
    );

    expect(
      renderedComponent.find('.core-log-viewer').getElement()
    ).to.exist;
  });
});
