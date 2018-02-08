import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { PromptToStudio } from 'src/features/home';

describe('home/PromptToStudio', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <PromptToStudio />
    );

    expect(
      renderedComponent.find('.home-prompt-to-studio').getElement()
    ).to.exist;
  });
});
