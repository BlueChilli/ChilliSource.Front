import React from 'react';
import {Provider} from 'react-redux';
import {withRouter, Router} from 'react-router-dom';
import {compose} from 'redux';
import {ConnectedRouter, routerReducer, routerMiddleware} from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';
import {renderRoutes} from 'react-router-config';
import {enhancer} from './index';
import history from "./getHistory";

import {
  consolidateAppWrappersFromMods, buildMasterEnhancerFromMods,
  consolidateMiddlewareFromMods,
  consolidateReducersFromMods,
  consolidateRoutesFromMods,
  consolidateStoreEnhancersFromMods,
  consolidateActionsFromMods,
  consolidateFunctionsFromMods,
  consolidateStoreSubscribersfromMods,
  consolidateReducersFromOptions, consolidateInitialisers
} from './helpers/modConsoliators';

import ModStack from './ModStack';
import enhanceWithExtraProps from './helpers/enhanceWithExtraProps';

// eslint-disable-next-line
//const history = typeof document != 'undefined' ? createHistory() : createMemoryHistory();

export default (mods, configureStore, options = {}) => {
  ModStack.add(mods);

  // creates a master enhancer HOC from the mod manifest
  const createdMasterEnhancer = buildMasterEnhancerFromMods(mods);

  // Functions
  const consolidatedFunctions = consolidateFunctionsFromMods(mods);
  ModStack.addFunctions(consolidatedFunctions);

  // Actions
  const consolidatedActions = consolidateActionsFromMods(mods);
  ModStack.addActions(consolidatedActions);

  // Add global component enhancer to stack, including actions.
  // The enhancer function wraps every component.
  ModStack.setMasterEnhancerFunction(compose(...createdMasterEnhancer, enhanceWithExtraProps));

  // Look for modules which wrap the entire app. These are different to enhancers
  // as they don't pass props up the tree.
  const consolidatedAppWrappers = consolidateAppWrappersFromMods(mods);

  // Look for modules which add middleware
  const consolidatedMiddleware = consolidateMiddlewareFromMods(mods);

  // add react-router-redux to middlewares too
  consolidatedMiddleware.push(routerMiddleware(history));

  // Look for modules which want to impact the reducer
  const consolidatedReducers = {
    ...consolidateReducersFromOptions(options),
    ...consolidateReducersFromMods(mods)
  };


  // Looks for modules which add routes
  const consolidatedRouteComponents = consolidateRoutesFromMods(mods);

  // Looks for store subscribers
  const consolidatedSubscribers = consolidateStoreSubscribersfromMods(mods);

  // Store enhancers
  const consolidatedStoreEnhancers = consolidateStoreEnhancersFromMods(mods);

  // Insert Reducers/Middleware into the store
  const store = configureStore(undefined, {
    ...consolidatedReducers,
    router: routerReducer,
  }, consolidatedMiddleware, consolidatedStoreEnhancers);

  // Any subscribers?
  consolidatedSubscribers.forEach((subscriber) => {
    store.subscribe(subscriber(store));
  });

  // Any initialisers?
  consolidateInitialisers(mods);

  // App and Routes are here
  return (EntryComponent) => {

    if (process.env.NODE_ENV !== 'production') {
      ModStack.show();
    }

    const EntryWithAppWrappers = compose(...consolidatedAppWrappers, enhancer)(EntryComponent);
    const WrapperAndRouter = withRouter(EntryWithAppWrappers);

    return function chillifront() {
      return (
        <Provider store={store}>
          <Router history={history}>
            <WrapperAndRouter routes={renderRoutes(consolidatedRouteComponents)}/>
          </Router>
        </Provider>
      );
    };
  };
};
