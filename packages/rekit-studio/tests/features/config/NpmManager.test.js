import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { NpmManager } from 'src/features/config/NpmManager';

describe('config/NpmManager', () => {
  it('renders node with correct class name', () => {
    const props = {
      config: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <NpmManager {...props} />
    );

    expect(
      renderedComponent.find('.config-npm-manager').getElement()
    ).to.exist;
  });
});
