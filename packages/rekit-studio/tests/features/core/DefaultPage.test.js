import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DefaultPage } from 'src/features/core/DefaultPage';

describe('core/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      dialog: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DefaultPage {...props} />
    );

    expect(
      renderedComponent.find('.core-default-page').getElement()
    ).to.exist;
  });
});
