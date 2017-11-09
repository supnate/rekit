import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { SearchInput } from 'src/features/common';

describe('common/SearchInput', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <SearchInput />
    );

    expect(
      renderedComponent.find('.common-search-input').node
    ).to.exist;
  });
});
