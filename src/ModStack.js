/** Libraries */
import ObjectMap from 'object.map';

/** Components */
import { Mod } from './';

/** Helpers */
const addModuleToStack = Symbol('addModuleToStack');
const getModById = Symbol('getModById');
const masterEnhancer = Symbol('masterEnhancer');
const stack = Symbol('stack');

/** Class ModStack */
class ModStack {
	// Variables
	/**
	 * @member
	 * @name stack
	 * @type {Object.<string, Mod>}
	 */
	[stack] = {};
	[masterEnhancer] = x => x;

	// Private Methods
	[addModuleToStack] = module => {
		const moduleID = module.getId();

		if (this[stack][moduleID]) {
			console.warn(
				`Duplicate entry found for Mod '${module.getId()}'. Please check your list of modules in Entry.js`
			);
		} else {
			this[stack][moduleID] = module;
		}
	};

	/**
	 * Retreives the Mod selected by the user from the stack
	 * @param {string} moduleID The Mod that the user wants to retrieve
	 */
	[getModById] = moduleID => {
		if (!this[stack][moduleID]) {
			throw new Error(
				`You tried to retrieve the Mod '${moduleID}' but the Mod was not provided to chillifront in Entry.js. You can not fetch a non-existent Mod`
			);
		}

		return this[stack][moduleID];
	};

	/**
	 * Adds all the modules to our stack. Removes duplicates
	 * @name add
	 * @param {Mod[]} modules
	 */
	static add = modules => {
		modules.forEach(module => {
			this[addModuleToStack](module);
		});
		return true;
	};

	/**
	 * @member
	 * @name getStack
	 * @returns {Object} An object containing key-value pairs of (moduleID, module)
	 */
	static getStack = () => this[stack];

	static getModByName = this[getModById];

	static getMasterEnhancer = () => this[masterEnhancer];

	static setMasterEnhancer = enhancer => {
		this[masterEnhancer] = enhancer;
	};

	// Show Logs in Console
	static showDebugInfo = () => {
		// React-Native is not a fan of the 'if' below
		if (typeof document === 'undefined') {
			return;
		}

		// Start logging
		ObjectMap(this[stack], (module, moduleId) => {
			const moduleName = module.getName();

			const label = moduleId === moduleName ? moduleId : `${moduleId} ${moduleName}`;

			const propertyValues = {
				id: moduleId,
				name: moduleName,
				options: module.getOptions(),
				middleware: module.middleware(),
				reducers: module.reducers(),
				mapStateToProps: module.mapStateToProps(),
				mapDispatchToProps: module.mapDispatchToProps(),
				storeEnhancer: module.storeEnhancer(),
				wrapsApp: module.wrapsApp(),
			};

			console.log(`%c ${label}`, 'color: #abec; font-weight:bold;');
			if (propertyValues.middleware !== undefined) {
				console.log(`[Middleware] : ${propertyValues.middleware}`);
			}

			if (propertyValues.reducers !== undefined) {
				console.log(`[Reducers] : ${propertyValues.reducers}`);
			}

			if (propertyValues.mapStateToProps !== undefined) {
				console.log(`[mapStateToProps] : ${propertyValues.mapStateToProps}`);
			}

			if (propertyValues.mapDispatchToProps !== undefined) {
				console.log(`[mapDispatchToProps] : ${propertyValues.mapDispatchToProps}`);
			}

			if (propertyValues.storeEnhancer !== undefined) {
				console.log(`[Store Enhancer] : ${propertyValues.storeEnhancer}`);
			}

			if (propertyValues.wrapsApp !== undefined) {
				console.log(`[App Wrapper] : ${propertyValues.wrapsApp}`);
			}

			console.log('');
		});
	};
}

export default ModStack;
