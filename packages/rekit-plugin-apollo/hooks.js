'use strict';

const fs = require('fs');
const _ = require('lodash');

module.exports = function (rekitCore) {
  const { utils, refactor, vio } = rekitCore;

  function afterAddComponent(feature, component, args) {
    if (!args.apollo) return;
    const filePath = utils.mapComponent(feature, component) + '.js';

    // Import modules
    refactor.addImportFrom(filePath, 'graphql-tag', 'gql');
    refactor.addImportFrom(filePath, 'react-apollo', null, ['Query']);
    const lines = vio.getLines(filePath);

    // Define gql
    const line = refactor.lineIndex(lines, `class ${_.flow(_.camelCase, _.upperFirst)(component)} extends`);
    lines.splice(line, 0, `const gqlQuery = gql\`
  {
    rates(currency: "USD") {
      currency
      rate
    }
  }
\`;
`);

    // Inject the query
    const startLine = refactor.lineIndex(lines, `<div className="${_.kebabCase(feature)}-${_.kebabCase(component)}">`);
    lines.splice(startLine + 1, 1,
      '        <div>Here is a sample graphql query to get USD exchange rate:</div>',
      '        <Query query={gqlQuery}>',
      '          {({ loading, error, data }) => {',
      '            if (loading) return <p>Loading...</p>;',
      '            if (error) return <p>Error :(</p>;',
      '',
      '            return data.rates.map(({ currency, rate }) => (',
      '              <div key={currency} className="blog-article-list">',
      '                <p>{`${currency}: ${rate}`}</p>',
      '              </div>',
      '            ));',
      '          }}',
      '        </Query>',
    );
    vio.put(filePath, lines);
  }

  return {
    afterAddComponent,
  };
}
