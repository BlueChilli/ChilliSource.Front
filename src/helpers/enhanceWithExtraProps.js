import {connect} from 'react-redux';
import * as React from 'react';
import {bindActionCreators} from 'redux';
import ModStack from '../ModStack';

export default (WrappedComponent) => {
  class EmptyModule extends React.Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  const mapDispatchToProps = dispatch => ({
    action: id => bindActionCreators(ModStack.getActionByID(id), dispatch),
    func: id => bindActionCreators(ModStack.getFunctionByID(id), dispatch)
  });

  return connect(null, mapDispatchToProps)(EmptyModule);
};
