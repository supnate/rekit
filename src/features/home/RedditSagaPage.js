import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { RedditList } from './';

export class RedditSagaPage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.actions.fetchRedditBySaga();
  }

  render() {
    const home = this.props.home;

    return (
      <div className="home-reddit-saga-page">
        { home.fetchRedditBySagaPending ? 'loading'
          :
          (home.redditList ? <RedditList list={home.redditList} /> : 'no data.')
        }
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
    actions: bindActionCreators({ ...actions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RedditSagaPage);
