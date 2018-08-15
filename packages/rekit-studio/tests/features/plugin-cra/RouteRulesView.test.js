import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { RouteRulesView } from 'src/features/plugin-cra/RouteRulesView';

describe('plugin-cra/RouteRulesView', () => {
  it('renders node with correct class name', () => {
    const props = {
      pluginCra: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RouteRulesView {...props} />
    );

    expect(
      renderedComponent.find('.plugin-cra-route-rules-view').getElement()
    ).to.exist;
  });
});
