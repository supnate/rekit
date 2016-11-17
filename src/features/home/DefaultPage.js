import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Hello, RedditList } from './index';
import * as actions from './redux/actions';

export class DefaultPage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.handlePlusOne = ::this.handlePlusOne;
    this.handleMinusOne = ::this.handleMinusOne;
    this.handleReset = ::this.handleReset;
    this.handleFetchReddit = ::this.handleFetchReddit;
  }

  handlePlusOne() {
    this.props.actions.counterPlusOne();
  }

  handleMinusOne() {
    this.props.actions.counterMinusOne();
  }

  handleReset() {
    this.props.actions.resetCounter();
  }

  handleFetchReddit() {
    this.props.actions.fetchRedditReactjsList();
  }

  render() {
    const { count, fetchRedditReactjsListPending, redditReactjsList, fetchRedditReactjsListError } = this.props.home;
    return (
      <div className="home-default-page">
        <Hello />
        <p>
          This is the sample page of the project. Seeing this page means everything works well now!<br />
          This project is initialized with one feature named "home" and two test pages. To remove the test pages, run below commands:
        </p>
        <ul className="cmd">
          <li>npm run rm:page home/test-page-1</li>
          <li>npm run rm:page home/test-page-2</li>
        </ul>
        <p>
          For more command line tools usage, please visit: <a href="http://github.com/supnate/rekit">http://github.com/supnate/rekit</a>.
        </p>
        <hr />
        <p>To quickly see how Redux works in the project, here is the demo of a simple counter:</p>
        <div className="demo-count">
          <button className="btn-minus-one" onClick={this.handleMinusOne} disabled={count === 0}>-</button>
          <label>{count}</label>
          <button className="btn-plus-one" onClick={this.handlePlusOne}>+</button>
          <button className="btn-reset-counter" onClick={this.handleReset}>Reset</button>
        </div>
        <hr />
        <p>To see how async flow works, here is an example of fetching reactjs topics from reddit.com/r/reactjs:</p>
        <div className="demo-reddit">
          <button className="btn-fetch-reddit" disabled={fetchRedditReactjsListPending} onClick={this.handleFetchReddit}>
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

function mapStateToProps(state) {
  return {
    home: state.home,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DefaultPage);
