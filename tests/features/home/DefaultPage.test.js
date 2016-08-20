import React from 'react';
import { shallow } from 'enzyme';
import { Hello } from '../../../src/features/home';

const expect = require('chai').expect;

describe('<Hello />', () => {
  it('renders a <Hello>', () => {
    const renderedComponent = shallow(
      <Hello />
    );

    expect(
      renderedComponent.find('div.home-hello').node
    ).to.exist;
  });
});
