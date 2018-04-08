import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DefaultPage } from 'src/features/config/DefaultPage';

describe('config/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      config: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DefaultPage {...props} />
    );

    expect(
      renderedComponent.find('.config-default-page').getElement()
    ).to.exist;
  });
});
