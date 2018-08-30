/** Libraries */
import React from 'react';
import { Provider } from 'react-redux';
import { compose, combineReducers, createStore, applyMiddleware } from 'redux';
import { connectRouter, routerMiddleware, ConnectedRouter } from 'connected-react-router';
import { composeWithDevTools } from 'redux-devtools-extension';

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
 * The main wrapper
 * @param {Array} modules
 * @param {Function} configureStore
 * @param {Object} options
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

	const composedEnhancers = composeWithDevTools(
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
		// if (process.env.NODE_ENV !== 'production') {
		// 	ModStack.showDebugInfo();
		// }

		console.log('EntryComponent', EntryComponent);
		/**
		 * Wrap the main entry component with
		 * all the app wrappers and enhancers
		 * specified
		 */
		const WrappedEntryComponent = compose(
			...consolidatedAppWrappers,
			componentEnhancer
		)(EntryComponent);

		console.log('WrappedEntryComponent', WrappedEntryComponent);

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
