import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { SvgIcon } from 'src/features/common';

describe('common/SvgIcon', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <SvgIcon />
    );

    expect(
      renderedComponent.find('.common-svg-icon').getElement()
    ).to.exist;
  });
});
