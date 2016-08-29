import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, shallow } from 'enzyme';
import { expect } from 'chai';
import ConnectedTestPage3, { TestPage3 } from 'features/home/TestPage3';

const pageProps = {
  home: {},
  actions: {},
};

const store = createStore(state => state, pageProps);

describe('features/home/TestPage3', () => {
  it('redux connect works', () => {
    const wrapper = render(
      <Provider store={store}>
        <ConnectedTestPage3 />
      </Provider>
    );

    expect(
      wrapper.find('.home-test-page-3').length
    ).to.equal(1);
  });

  it('renders node with correct dom structure', () => {
    const renderedComponent = shallow(
      <TestPage3 {...pageProps} />
    );

    expect(
      renderedComponent.find('.home-test-page-3').node
    ).to.exist;
  });
});
