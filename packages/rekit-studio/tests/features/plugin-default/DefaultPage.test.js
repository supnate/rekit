import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DefaultPage } from 'src/features/plugin-default/DefaultPage';

describe('plugin-default/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      pluginCore: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DefaultPage {...props} />
    );

    expect(
      renderedComponent.find('.plugin-default-default-page').getElement()
    ).to.exist;
  });
});
