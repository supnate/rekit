import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Hello } from 'features/home';

describe('<Hello />', () => {
  it('renders a <Hello>', () => {
    const renderedComponent = shallow(
      <Hello />
    );

    expect(
      renderedComponent.find('.home-hello').node
    ).to.exist;
  });
});
