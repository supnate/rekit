// Button.test.js
import React from 'react';
import { shallow } from 'enzyme';

import { DefaultPage } from '../../../src/features/home';
const expect = require('chai').expect;

describe('<Button />', () => {
  it('renders a <button>', () => {
    const renderedComponent = shallow(
      <DefaultPage></DefaultPage>
    );

    expect(
      renderedComponent.find("button").node
    ).toExist();
  });

  it('renders text', () => {
    const text = "Click me!";
    const renderedComponent = shallow(
      <Button>{ text }</Button>
    );

    expect(
      renderedComponent.contains(text)
    ).toEqual(true);
  });

  it('handles clicks', () => {
    const onClickSpy = expect.createSpy();
    const renderedComponent = shallow(
      <Button onClick={onClickSpy} />
    );

    renderedComponent.find('button').simulate('click');

    expect(onClickSpy).toHaveBeenCalled();
  });
});
