import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DefaultPage } from 'src/features/default-plugin/DefaultPage';

describe('default-plugin/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      pluginCore: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DefaultPage {...props} />
    );

    expect(
      renderedComponent.find('.default-plugin-default-page').getElement()
    ).to.exist;
  });
});
