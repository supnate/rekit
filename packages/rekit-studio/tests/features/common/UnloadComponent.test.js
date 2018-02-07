import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { UnloadComponent } from 'src/features/common';

describe('common/UnloadComponent', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(
      <UnloadComponent />
    );
  });
});
