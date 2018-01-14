import React, { Component } from 'react';
import { connect } from 'react-redux';

export default (mapStateToProps, mapDispatchToProps) => (WrappedComponent) => {
  class ReduxConnectModule extends Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ReduxConnectModule);
};
