import React from 'react';
import { shallow } from 'enzyme';
import { DefaultPage } from '../../../src/features/plugin-terminal/DefaultPage';

describe('plugin-terminal/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      pluginTerminal: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DefaultPage {...props} />
    );

    expect(
      renderedComponent.find('.plugin-terminal-default-page').length
    ).toBe(1);
  });
});
