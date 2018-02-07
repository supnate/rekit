import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { RunTestPage } from 'src/features/rekit-tools/RunTestPage';

describe('rekit-tools/RunTestPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      rekitTools: {},
      actions: {},
      match: {
        params: {
          testFile: 'abc',
        },
      }
    };
    const renderedComponent = shallow(
      <RunTestPage {...props} />
    );

    expect(
      renderedComponent.find('.rekit-tools-run-test-page').getElement()
    ).to.exist;
  });
});
