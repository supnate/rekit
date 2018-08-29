import React from 'react';
import { shallow } from 'enzyme';
import { OutputView } from '../../../src/features/home/OutputView';

describe('home/OutputView', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <OutputView {...props} />
    );

    expect(
      renderedComponent.find('.home-output-view').length
    ).toBe(1);
  });
});
