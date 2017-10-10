import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { TestPage } from 'src/features/home/TestPage';

describe('home/TestPage', () => {
  it('renders node with correct class name', () => {
    const pageProps = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TestPage {...pageProps} />
    );

    expect(
      renderedComponent.find('.home-test-page').getElement()
    ).to.exist;
  });
});
