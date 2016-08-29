import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import ConnectedDefaultPage, { DefaultPage } from 'features/home/DefaultPage';

const pageProps = {
  home: {},
  actions: {
    counterPlusOne: sinon.spy(),
    counterMinusOne: sinon.spy(),
    resetCount: sinon.spy(),
  },
};

const store = createStore(state => state, pageProps);

describe('features/home/DefaultPage', () => {
  it('redux connect works', () => {
    const wrapper = render(
      <Provider store={store}>
        <ConnectedDefaultPage />
      </Provider>
    );

    expect(
      wrapper.find('.home-default-page').length
    ).to.equal(1);
  });

  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <DefaultPage {...pageProps} />
    );

    expect(
      renderedComponent.find('.home-default-page').node
    ).to.exist;
  });

  it('counter actions are called when buttons are clicked', () => {
    const renderedComponent = shallow(
      <DefaultPage {...pageProps} />
    );
    renderedComponent.find('.btn-plus-one').simulate('click');
    renderedComponent.find('.btn-minus-one').simulate('click');
    renderedComponent.find('.btn-reset-counter').simulate('click');
    expect(pageProps.actions.counterPlusOne).to.have.property('callCount', 1);
    expect(pageProps.actions.counterMinusOne).to.have.property('callCount', 1);
    expect(pageProps.actions.resetCount).to.have.property('callCount', 1);
  });
});
