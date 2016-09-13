import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, shallow } from 'enzyme';
import { expect } from 'chai';
import ConnectedTestPage2, { TestPage2 } from 'features/home/TestPage2';

const pageProps = {
  home: {},
  actions: {},
};

const store = createStore(state => state, pageProps);

describe('home/TestPage2', () => {
  it('redux connect works', () => {
    const wrapper = render(
      <Provider store={store}>
        <ConnectedTestPage2 />
      </Provider>
    );

    expect(
      wrapper.find('.home-test-page-2').length
    ).to.equal(1);
  });

  it('renders node with class name: home-test-page-2', () => {
    const renderedComponent = shallow(
      <TestPage2 {...pageProps} />
    );

    expect(
      renderedComponent.find('.home-test-page-2').node
    ).to.exist;
  });
});
