import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DefaultPage } from 'src/features/plugin/DefaultPage';

describe('plugin/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      extension: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DefaultPage {...props} />
    );

    expect(
      renderedComponent.find('.plugin-default-page').getElement()
    ).to.exist;
  });
});
