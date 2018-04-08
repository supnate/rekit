import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { WebpackManager } from 'src/features/config/WebpackManager';

describe('config/WebpackManager', () => {
  it('renders node with correct class name', () => {
    const props = {
      config: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <WebpackManager {...props} />
    );

    expect(
      renderedComponent.find('.config-webpack-manager').getElement()
    ).to.exist;
  });
});
