import React from 'react';
import { shallow } from 'enzyme';
import { BottomDrawer } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<BottomDrawer />);
  expect(renderedComponent.find('.home-bottom-drawer').length).toBe(1);
});
