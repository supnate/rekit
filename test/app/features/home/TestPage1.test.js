import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, shallow } from 'enzyme';
import { expect } from 'chai';
import ConnectedTestPage1, { TestPage1 } from 'features/home/TestPage1';

const pageProps = {
  home: {},
  actions: {},
};

const store = createStore(state => state, pageProps);

describe('home/TestPage1', () => {
  it('redux connect works', () => {
    const wrapper = render(
      <Provider store={store}>
        <ConnectedTestPage1 />
      </Provider>
    );

    expect(
      wrapper.find('.home-test-page-1').length
    ).to.equal(1);
  });

  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <TestPage1 {...pageProps} />
    );

    expect(
      renderedComponent.find('.home-test-page-1').node
    ).to.exist;
  });
});
