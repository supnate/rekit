import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { EnvVarsList } from 'src/features/config/EnvVarsList';

describe('config/EnvVarsList', () => {
  it('renders node with correct class name', () => {
    const props = {
      config: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <EnvVarsList {...props} />
    );

    expect(
      renderedComponent.find('.config-env-vars-list').getElement()
    ).to.exist;
  });
});
