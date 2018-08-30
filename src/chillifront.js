/** Libraries */
import React from 'react';
import { Provider } from 'react-redux';
import { compose, combineReducers, createStore, applyMiddleware } from 'redux';
import { connectRouter, routerMiddleware, ConnectedRouter } from 'connected-react-router';
import { composeWithDevTools } from 'redux-devtools-extension';
import { History } from 'history';

/** Helpers */
import {
	componentEnhancer,
	getAppWrappers,
	getMiddleware,
	getReducers,
	getReducersFromOptions,
	getStoreEnhancers,
	getStoreSubscribers,
	initialiseModulesIfRequired,
	ModStack,
	history,
} from './helpers';

/**
 * @typedef Options
 * @property {History} useHistory The history object to use instead of the internal default object.
 * @property {Object} reducers Addtional reducers without writing a Mod.
 * @property {bool} debug Show logs to the console. Defaults to false.
 * @property {bool} useDevTools Shows the redux store in the dev tools inspector. Defaults to true.
 */

/**
 * The main wrapper
 * @param {Array} modules
 * @param {Options} options
 */
export const chillifront = (modules, options = {}) => {
	// Add the modules
	ModStack.add(modules);

	// If user has specified the history object, use that
	const usableHistory = options.useHistory ? options.useHistory : history;

	// Get app wrappers
	const consolidatedAppWrappers = getAppWrappers(modules);

	// Get middleware
	const consolidatedMiddleware = getMiddleware(modules);
	consolidatedMiddleware.push(routerMiddleware(usableHistory));

	// Get reducers
	const consolidatedReducers = { ...getReducersFromOptions(options), ...getReducers(modules) };

	// Get store subscribers
	const consolidatedStoreSubscribers = getStoreSubscribers(modules);

	// Get store enhancers
	const consolidatedStoreEnhancers = getStoreEnhancers(modules);

	// Create store
	const rootReducer = combineReducers(consolidatedReducers);

	const composedEnhancers =
		options.useDevTools && options.useDevTools === true
			? composeWithDevTools(
					applyMiddleware(...consolidatedMiddleware),
					...consolidatedStoreEnhancers
			  )
			: compose(
					applyMiddleware(...consolidatedMiddleware),
					...consolidatedStoreEnhancers
			  );

	const store = createStore(connectRouter(usableHistory)(rootReducer), {}, composedEnhancers);

	// Add store subscribers

	consolidatedStoreSubscribers.forEach(subscriber => store.subscribe(subscriber(store)));

	// Initialise mods if required
	initialiseModulesIfRequired(modules);

	// Return
	return EntryComponent => {
		if (options.debug && options.debug === true && process.env.NODE_ENV !== 'production') {
			ModStack.showDebugInfo();
		}

		/**
		 * Wrap the main entry component with
		 * all the app wrappers and enhancers
		 * specified
		 */
		const WrappedEntryComponent = compose(
			...consolidatedAppWrappers,
			componentEnhancer
		)(EntryComponent);

		return function chillifront() {
			return (
				<Provider store={store}>
					<ConnectedRouter history={usableHistory}>
						<div>
							<WrappedEntryComponent />
						</div>
					</ConnectedRouter>
				</Provider>
			);
		};
	};
};
