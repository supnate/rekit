import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { P1 } from 'features/test-1/P1';

describe('test-1/P1', () => {
  it('renders node with correct class name', () => {
    const pageProps = {
      test1: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <P1 {...pageProps} />
    );

    expect(
      renderedComponent.find('.test-1-p-1').node
    ).to.exist;
  });
});
