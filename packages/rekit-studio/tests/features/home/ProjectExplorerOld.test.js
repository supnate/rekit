import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ProjectExplorerOld } from 'src/features/home/ProjectExplorerOld';

describe('home/ProjectExplorerOld', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
      treeData: {},
    };
    const renderedComponent = shallow(<ProjectExplorerOld {...props} />);

    expect(renderedComponent.find('.home-project-explorer-old').getElement()).to.exist;
  });
});
