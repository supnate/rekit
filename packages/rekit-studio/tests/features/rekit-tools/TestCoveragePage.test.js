import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { TestCoveragePage } from 'src/features/rekit-tools/TestCoveragePage';

describe('rekit-tools/TestCoveragePage', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {
        testCoverage: true,
      },
      rekitTools: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TestCoveragePage {...props} />
    );

    expect(
      renderedComponent.find('.rekit-tools-test-coverage-page').getElement()
    ).to.exist;
  });
});
