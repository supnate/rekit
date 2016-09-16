import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { TestPage2 } from 'features/home/TestPage2';

describe('home/TestPage2', () => {
  it('renders node with correct class name', () => {
    const pageProps = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TestPage2 {...pageProps} />
    );

    expect(
      renderedComponent.find('.home-test-page-2').node
    ).to.exist;
  });
});
