import _ from 'lodash';
import * as cra from '../plugin-cra';

export default {
  plugins: [cra],
  fetchProjectData() {
    const p = _.find(this.plugins, item => !!_.get(item, 'app.fetchProjectData'));
    return p.app.fetchProjectData();
  },
};
