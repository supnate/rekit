import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { EnvVarsManager } from 'src/features/config/EnvVarsManager';

describe('config/EnvVarsManager', () => {
  it('renders node with correct class name', () => {
    const props = {
      config: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <EnvVarsManager {...props} />
    );

    expect(
      renderedComponent.find('.config-env-vars-manager').getElement()
    ).to.exist;
  });
});
