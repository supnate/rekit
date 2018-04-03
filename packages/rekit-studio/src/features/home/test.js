import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const gqlQuery = gql`
  {
    rates(currency: "USD") {
      currency
      rate
    }
  }
`;

export default class B1 extends Component {
  static propTypes = {

  };

  render() {
    return (
      <div className="home-b-1">
        <Query query={gqlQuery}>
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;

            return data.rates.map(({ currency, rate }) => (
              <div key={currency} className="blog-article-list">
                <p>{`${currency}: ${rate}`}</p>
              </div>
            ));
          }}
        </Query>
      </div>
    );
  }
}
