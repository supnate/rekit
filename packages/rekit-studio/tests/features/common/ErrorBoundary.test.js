import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ErrorBoundary } from 'src/features/common';

describe('common/ErrorBoundary', () => {
  it('renders without error', () => {
    const renderedComponent = shallow(
      <ErrorBoundary />
    );
  });
});
