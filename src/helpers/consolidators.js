/**
 * Returns an array of middleware functions
 * @param {Array} modules
 *
 * @returns {Array<any>}
 */
const getMiddleware = modules =>
	modules.map(module => module.middleware()).filter(middleware => typeof middleware === 'function');

/**
 * Returns array of appwrapper across entire modulestack
 * @param {Array} modules
 *
 * @returns {Array}
 */
const getAppWrappers = modules =>
	modules
		.map(module => module.wrapApp(module.options()))
		.filter(appWrapper => appWrapper !== undefined);

/**
 * Returns a list of reducers
 * @param {Array} modules
 *
 * @returns {Array}
 */
const getReducers = modules => {
	const reducers = modules.reduce(
		(reduction, module) => ({ ...reduction, ...module.reducers() }),
		{}
	);

	// combineReducers function get annoyed when there are no reducers, so hacking
	if (Object.keys(reducers).length === 0) {
		return {
			emptyReducer: [() => {}],
		};
	}

	return reducers;
};

/**
 * Return a list of reducers (from options)
 * @param {Object} options
 */
const getReducersFromOptions = options => (options.reducers ? options.reducers : {});

/**
 * Returns array of store enhancers
 * @param {Array} modules
 *
 * @returns {Array}
 */
const getStoreEnhancers = modules =>
	modules
		.map(module => module.storeEnhancer())
		.filter(storeEnhancer => typeof storeEnhancer === 'function');

/**
 * Returns array of store subscribers
 * @param {Array} modules
 *
 * @returns {Array}
 */
const getStoreSubscribers = modules =>
	modules
		.map(module => module.storeSubscribe())
		.filter(storeSubscriber => typeof storeSubscriber === 'function');

/**
 * Initialises modules if required
 * @param {Array} modules
 */
const initialiseModulesIfRequired = modules => {
	modules.forEach(module => {
		if (typeof module.init === 'function') {
			module.init();
		}
	});
};

/**
 *
 * @param {Array} modules
 *
 * @returns {Array}
 */
const createMasterEnhancer = (...modules) => {
	console.log('createMasterEnhancer > modules', modules);
	return modules.map(module => undefined).filter(mod => mod !== undefined);
};

export {
	getMiddleware,
	getAppWrappers,
	getReducers,
	getReducersFromOptions,
	getStoreEnhancers,
	getStoreSubscribers,
	createMasterEnhancer,
	initialiseModulesIfRequired,
};
