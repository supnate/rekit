import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { DepsList } from 'src/features/config/DepsList';

describe('config/DepsList', () => {
  it('renders node with correct class name', () => {
    const props = {
      config: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DepsList {...props} />
    );

    expect(
      renderedComponent.find('.config-deps-list').getElement()
    ).to.exist;
  });
});
