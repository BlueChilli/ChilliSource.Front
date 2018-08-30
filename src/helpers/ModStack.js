/** Libraries */
import ObjectMap from 'object.map';

/** Components */
import { Mod } from './';

/** Class ModStack */
class ModStack {
	// Variables
	/**
	 * @member
	 * @name stack
	 * @type {Object.<string, Mod>}
	 */
	static stack = {};
	static masterEnhancer = x => x;

	// Private Methods
	static addModuleToStack(module) {
		const moduleID = module.getId();

		if (this.stack[moduleID]) {
			console.warn(
				`Duplicate entry found for Mod '${module.getId()}'. Please check your list of modules in Entry.js`
			);
		} else {
			this.stack[moduleID] = module;
		}
	}

	/**
	 * Retreives the Mod selected by the user from the stack
	 * @param {string} moduleID The Mod that the user wants to retrieve
	 */
	static getModById(moduleID) {
		if (!this.stack[moduleID]) {
			throw new Error(
				`You tried to retrieve the Mod '${moduleID}' but the Mod was not provided to chillifront in Entry.js. You can not fetch a non-existent Mod`
			);
		}

		return this.stack[moduleID];
	}

	/**
	 * Adds all the modules to our stack. Removes duplicates
	 * @name add
	 * @param {Mod[]} modules
	 */
	static add(modules) {
		modules.forEach(module => {
			this.addModuleToStack(module);
		});
		return true;
	}

	/**
	 * @member
	 * @name getStack
	 * @returns {Object} An object containing key-value pairs of (moduleID, module)
	 */
	static getStack() {
		return this.stack;
	}

	static getModByName(name) {
		return this.getModById(name);
	}

	static getMasterEnhancer() {
		return this.masterEnhancer;
	}

	static setMasterEnhancer(enhancer) {
		this.masterEnhancer = enhancer;
	}

	// Show Logs in Console
	static showDebugInfo() {
		// React-Native is not a fan of the 'if' below
		if (typeof document === 'undefined') {
			return;
		}

		// Start logging
		ObjectMap(this.stack, (module, moduleId) => {
			const moduleName = module.getName();

			const label = moduleId === moduleName ? moduleId : `${moduleId} ${moduleName}`;

			const propertyValues = {
				id: moduleId,
				name: moduleName,
				options: module.getOptions(),
				middleware: module.middleware(),
				reducers: module.reducers(),
				storeEnhancer: module.storeEnhancer(),
				wrapApp: module.wrapApp(),
			};

			console.log(
				`%c ${label}`,
				'background: url("../assets/icon-bullet.png") 0 0/20px 20px no-repeat; padding-left: 16px; color: #00abec; font-weight:bold;'
			);

			if (propertyValues.middleware !== undefined) {
				console.log(
					`%c Middlewware`,
					'background: url("../assets/icon-tick.png") 0 0/20px 20px no-repeat; padding-left: 16px; color: #FFCC00; font-weight:bold;'
				);
			} else {
				console.log(
					`%c Middleware`,
					`background: url('../assets/icon-cross.png') 0 0/20px 20px no-repeat; padding-left: 16px; color: #ffffff;`
				);
			}

			if (propertyValues.reducers !== undefined) {
				console.log(
					`%c Reducers`,
					`background: url('../assets/icon-tick.png') 0 0/20px 20px no-repeat; padding-left: 16px; color: #FFCC00;`
				);
			} else {
				console.log(
					`%c Reducers`,
					`background: url('../assets/icon-cross.png') 0 0/20px 20px no-repeat; padding-left: 16px; color: #ffffff;`
				);
			}

			if (propertyValues.storeEnhancer !== undefined) {
				console.log(
					`%c Store Enhancer`,
					`background: url('../assets/icon-tick.png') 0 0/20px 20px no-repeat; padding-left: 16px; color: #FFCC00;`
				);
			} else {
				console.log(
					`%c Store Enhancer`,
					`background: url('../assets/icon-cross.png') 0 0/20px 20px no-repeat; padding-left: 16px; color: #ffffff;`
				);
			}

			if (propertyValues.wrapApp !== undefined) {
				console.log(
					`%c App Wrapper`,
					`background: url('../assets/icon-tick.png') 0 0/20px 20px no-repeat; padding-left: 16px; color: #FFCC00;`
				);
			} else {
				console.log(
					`%c App Wrapper`,
					`background: url('../assets/icon-cross.png') 0 0/20px 20px no-repeat; padding-left: 16px; color: #ffffff;`
				);
			}

			console.log('');
		});
	}
}

export default ModStack;
