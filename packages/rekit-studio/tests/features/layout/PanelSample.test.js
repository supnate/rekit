import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { PanelSample } from 'src/features/layout';

describe('layout/PanelSample', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <PanelSample />
    );

    expect(
      renderedComponent.find('.layout-panel-sample').getElement()
    ).to.exist;
  });
});
