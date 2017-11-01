import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RedditList } from './';
import { counterPlusOne, counterMinusOne, resetCounter, fetchRedditReactjsList } from './redux/actions';

export class DefaultPage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    const { count, fetchRedditReactjsListPending, redditReactjsList, fetchRedditReactjsListError } = this.props.home;
    const { counterPlusOne, counterMinusOne, resetCounter, fetchRedditReactjsList } = this.props.actions;
    return (
      <div className="home-default-page">
        <a href="http://github.com/supnate/rekit"><img src={require('../../images/logo.png')} className="app-logo" alt="logo" /></a>
        <h1>Welcome to your Rekit application!</h1>
        <p>
          Contratulations! You have created your Rekit app successfully! Seeing this page means everything works well now.
        </p>
        <p>
          By default <a href="https://github.com/supnate/rekit-portal">Rekit portal</a> is also started at <a href="http://localhost:6076">http://localhost:6076</a> to manage the project.
        </p>
        <p>
          The app has been initialized with two features named &quot;common&quot; and &quot;home&quot; and two samples: counter and Reddit list viewer as shown below.
        </p>
        <p>
          To learn more about how to get started, you can visit: <a href="http://rekit.js.org/docs/get-started.html">Get started</a>
        </p>
        <h3>Demos</h3>
        <p>Here are two simple demos for your quick reference. You can open the browser dev tools to see Redux action logs.</p>
        <p className="section-title">To see how Redux works in the project, here is the demo of a simple counter:</p>
        <div className="demo-count">
          <button className="btn-minus-one" onClick={counterMinusOne} disabled={count === 0}>-</button>
          <label>{count}</label>
          <button className="btn-plus-one" onClick={counterPlusOne}>+</button>
          <button className="btn-reset-counter" onClick={resetCounter}>Reset</button>
        </div>

        <p className="section-title">To see how async flow works, here is an example of fetching reddit reactjs topics:</p>
        <div className="demo-reddit">
          <button className="btn-fetch-reddit" disabled={fetchRedditReactjsListPending} onClick={fetchRedditReactjsList}>
            {fetchRedditReactjsListPending ? 'Fetching...' : 'Fetch reactjs topics'}
          </button>
          {
            fetchRedditReactjsListError &&
              <div className="fetch-list-error">
                Failed to load: {fetchRedditReactjsListError.toString()}
              </div>
          }
          <RedditList list={redditReactjsList} />
        </div>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    home: state.home,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ counterPlusOne, counterMinusOne, resetCounter, fetchRedditReactjsList }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DefaultPage);
