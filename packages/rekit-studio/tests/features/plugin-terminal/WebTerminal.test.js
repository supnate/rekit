import React from 'react';
import { shallow } from 'enzyme';
import { WebTerminal } from '../../../src/features/plugin-terminal';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<WebTerminal />);
  expect(renderedComponent.find('.plugin-terminal-web-terminal').length).toBe(1);
});
