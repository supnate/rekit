import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ErrorBoundary } from 'src/features/common';

describe('common/ErrorBoundary', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <ErrorBoundary />
    );

    expect(
      renderedComponent.find('.common-error-boundary').getElement()
    ).to.exist;
  });
});
