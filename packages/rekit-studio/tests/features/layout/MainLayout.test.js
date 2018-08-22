import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { MainLayout } from 'src/features/layout/MainLayout';

describe('layout/MainLayout', () => {
  it('renders node with correct class name', () => {
    const props = {
      layout: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <MainLayout {...props} />
    );

    expect(
      renderedComponent.find('.layout-main-layout').getElement()
    ).to.exist;
  });
});
