import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Panel } from 'src/features/layout/Panel';

describe('layout/Panel', () => {
  it('renders node with correct class name', () => {
    const props = {
      layout: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <Panel {...props} />
    );

    expect(
      renderedComponent.find('.layout-panel').getElement()
    ).to.exist;
  });
});
