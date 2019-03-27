// Test npm scripts work
const shell = require('shelljs');

const featureName = 'npm-test-feature';
shell.exec(`npm run add:feature ${featureName}`);
shell.exec(`npm run add:page ${featureName}/my-page`);
shell.exec(`npm run add:component ${featureName}/my-component`);
shell.exec(`npm run add:action ${featureName}/my-action`);
shell.exec(`npm run add:async-action ${featureName}/my-async-action`);

shell.exec(`npm run rm:page ${featureName}/my-page`);
shell.exec(`npm run rm:component ${featureName}/my-component`);
shell.exec(`npm run rm:action ${featureName}/my-action`);
shell.exec(`npm run rm:async-action ${featureName}/my-async-action`);
shell.exec(`npm run rm:feature ${featureName}`);
