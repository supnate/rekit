import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DefaultPage } from 'src/features/extension/DefaultPage';

describe('extension/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      extension: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DefaultPage {...props} />
    );

    expect(
      renderedComponent.find('.extension-default-page').getElement()
    ).to.exist;
  });
});
