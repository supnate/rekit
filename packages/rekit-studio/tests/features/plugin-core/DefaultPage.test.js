import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DefaultPage } from 'src/features/plugin-core/DefaultPage';

describe('plugin-core/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      pluginCore: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DefaultPage {...props} />
    );

    expect(
      renderedComponent.find('.plugin-core-default-page').getElement()
    ).to.exist;
  });
});
