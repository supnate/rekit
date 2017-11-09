import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { TestCoverageSummary } from 'src/features/rekit-tools/TestCoverageSummary';

describe('rekit-tools/TestCoverageSummary', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {
        rekit: { buildPort: 8888 },
      },
      rekitTools: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TestCoverageSummary {...props} />
    );

    expect(
      renderedComponent.find('.rekit-tools-test-coverage-summary').node
    ).to.exist;
  });
});
