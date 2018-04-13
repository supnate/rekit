import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { OutputPanel } from 'src/features/common/OutputPanel';

describe('common/OutputPanel', () => {
  it('renders node with correct class name', () => {
    const props = {
      common: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <OutputPanel {...props} />
    );

    expect(
      renderedComponent.find('.common-output-panel').getElement()
    ).to.exist;
  });
});
