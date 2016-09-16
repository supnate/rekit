import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { TestPage1 } from 'features/home/TestPage1';

describe('home/TestPage1', () => {
  it('renders node with correct class name', () => {
    const pageProps = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TestPage1 {...pageProps} />
    );

    expect(
      renderedComponent.find('.home-test-page-1').node
    ).to.exist;
  });
});
