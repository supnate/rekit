import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DepsManager } from 'src/features/config/DepsManager';

describe('config/DepsManager', () => {
  it('renders node with correct class name', () => {
    const props = {
      config: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DepsManager {...props} />
    );

    expect(
      renderedComponent.find('.config-deps-manager').getElement()
    ).to.exist;
  });
});
