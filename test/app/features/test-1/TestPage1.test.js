import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { TestPage1 } from 'features/test-1/TestPage1';

describe('test-1/TestPage1', () => {
  it('renders node with correct class name', () => {
    const pageProps = {
      test1: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TestPage1 {...pageProps} />
    );

    expect(
      renderedComponent.find('.test-1-test-page-1').node
    ).to.exist;
  });
});
