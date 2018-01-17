import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ProjectExplorer } from 'src/features/home/ProjectExplorer';

describe('home/ProjectExplorer', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
      treeData: {},
    };
    const renderedComponent = shallow(
      <ProjectExplorer {...props} />
    );

    expect(
      renderedComponent.find('.home-project-explorer').getElement()
    ).to.exist;
  });
});
