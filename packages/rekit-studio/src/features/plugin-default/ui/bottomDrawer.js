import OutputView from '../../home/OutputView';
import { ProblemsView } from '../';

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
        tab: 'Problems',
        key: 'problems',
        order: 1,
        component: ProblemsView,
      },
    ];
  },
};
