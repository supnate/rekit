import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DefaultPage } from 'src/features/plugin-cra/DefaultPage';

describe('plugin-cra/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      pluginCra: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DefaultPage {...props} />
    );

    expect(
      renderedComponent.find('.plugin-cra-default-page').getElement()
    ).to.exist;
  });
});
