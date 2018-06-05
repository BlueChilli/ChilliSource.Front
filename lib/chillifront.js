var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import React from 'react';
import { Provider } from 'react-redux';
import { withRouter, BrowserRouter } from 'react-router-dom';
import { compose } from 'redux';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';
import { renderRoutes } from 'react-router-config';
import { enhancer } from './index';
import history from "./getHistory";

import { consolidateAppWrappersFromMods, buildMasterEnhancerFromMods, consolidateMiddlewareFromMods, consolidateReducersFromMods, consolidateRoutesFromMods, consolidateStoreEnhancersFromMods, consolidateActionsFromMods, consolidateFunctionsFromMods, consolidateStoreSubscribersfromMods, consolidateReducersFromOptions, consolidateInitialisers } from './helpers/modConsoliators';

import ModStack from './ModStack';
import enhanceWithExtraProps from './helpers/enhanceWithExtraProps';

// eslint-disable-next-line
//const history = typeof document != 'undefined' ? createHistory() : createMemoryHistory();

export default (function (mods, configureStore) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  ModStack.add(mods);

  // creates a master enhancer HOC from the mod manifest
  var createdMasterEnhancer = buildMasterEnhancerFromMods(mods);

  // Functions
  var consolidatedFunctions = consolidateFunctionsFromMods(mods);
  ModStack.addFunctions(consolidatedFunctions);

  // Actions
  var consolidatedActions = consolidateActionsFromMods(mods);
  ModStack.addActions(consolidatedActions);

  // Add global component enhancer to stack, including actions.
  // The enhancer function wraps every component.
  ModStack.setMasterEnhancerFunction(compose.apply(undefined, _toConsumableArray(createdMasterEnhancer).concat([enhanceWithExtraProps])));

  // Look for modules which wrap the entire app. These are different to enhancers
  // as they don't pass props up the tree.
  var consolidatedAppWrappers = consolidateAppWrappersFromMods(mods);

  // Look for modules which add middleware
  var consolidatedMiddleware = consolidateMiddlewareFromMods(mods);

  // add react-router-redux to middlewares too
  consolidatedMiddleware.push(routerMiddleware(history));

  // Look for modules which want to impact the reducer
  var consolidatedReducers = _extends({}, consolidateReducersFromOptions(options), consolidateReducersFromMods(mods));

  // Looks for modules which add routes
  var consolidatedRouteComponents = consolidateRoutesFromMods(mods);

  // Looks for store subscribers
  var consolidatedSubscribers = consolidateStoreSubscribersfromMods(mods);

  // Store enhancers
  var consolidatedStoreEnhancers = consolidateStoreEnhancersFromMods(mods);

  // Insert Reducers/Middleware into the store
  var store = configureStore(undefined, _extends({}, consolidatedReducers, {
    router: routerReducer
  }), consolidatedMiddleware, consolidatedStoreEnhancers);

  // Any subscribers?
  consolidatedSubscribers.forEach(function (subscriber) {
    store.subscribe(subscriber(store));
  });

  // Any initialisers?
  consolidateInitialisers(mods);

  // App and Routes are here
  return function (EntryComponent) {

    if (process.env.NODE_ENV !== 'production') {
      ModStack.show();
    }

    var EntryWithAppWrappers = compose.apply(undefined, _toConsumableArray(consolidatedAppWrappers).concat([enhancer]))(EntryComponent);
    var WrapperAndRouter = withRouter(EntryWithAppWrappers);

    return function chillifront() {
      return React.createElement(
        Provider,
        { store: store },
        React.createElement(
          Router,
          { history: history },
          React.createElement(WrapperAndRouter, { routes: renderRoutes(consolidatedRouteComponents) })
        )
      );
    };
  };
});