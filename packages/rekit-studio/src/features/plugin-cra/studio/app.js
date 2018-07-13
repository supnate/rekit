// import axios from 'axios';
// import plugin from '../plugin/plugin';

export default {
  fetchProjectData() {
    return new Promise((resolve, reject) => {
      resolve({
        elementById: {
          xxx: { type: 'file', icon: 'file', name: 'XXX' },
        },
        elements: ['xxx'],
      });
    });
  },
};
