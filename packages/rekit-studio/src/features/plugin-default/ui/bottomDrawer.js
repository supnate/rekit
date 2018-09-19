import React from 'react';
import OutputView from '../../home/OutputView';
import { ProblemsView, ProblemPaneTitle } from '../';

export default {
  getPanes() {
    return [
      {
        tab: 'Output',
        key: 'output',
        order: 10,
        component: OutputView,
      },
      {
        tab: <ProblemPaneTitle />,
        key: 'problems',
        order: 1,
        component: ProblemsView,
      },
    ];
  },
};
