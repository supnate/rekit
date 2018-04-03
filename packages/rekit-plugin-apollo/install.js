
function install() {
  const { utils, vio, refactor } = require('rekit-core');

  const rootComp = utils.mapSrcFile('Root.js');

  // Add import from apollo modules
  refactor.addImportFrom(rootComp, 'apollo-boost', 'ApolloClient');
  refactor.addImportFrom(rootComp, 'react-apollo', null, ['ApolloProvider']);
  const lines = vio.getLines(rootComp);
  const line = refactor.lineIndex(lines, 'function renderRouteConfigV3');
  lines.splice(line, 0, `const client = new ApolloClient({
  // TODO: Replace uri with yours.
  uri: 'https://w5xlvm3vzz.lp.gql.zone/graphql',
});
`);

  // Inject <ApolloProvider>
  const startLine = refactor.lineIndex(lines, '<Provider ');
  lines.splice(startLine + 1, 0, '        <ApolloProvider client={client}>');
  const endLine = refactor.lineIndex(lines, '</Provider>');
  lines.splice(endLine, 0, '        </ApolloProvider>');

  for (let i = startLine + 2; i < endLine; i++ ){
    lines[i] = `  ${lines[i]}`;
  }
  vio.flush();

  console.log('You have successfully installed rekit-plugin-apollo.');
  console.log('To get started, edit src/Root.js to modify your graphql uri.');
  console.log('Then you can create a component with Apollo inside with "--apollo" argument in command line.');
  console.log('Or with Rekit Studio by check apollo checkbox.');
  console.log('Enjoy!');
}
module.exports = install;
