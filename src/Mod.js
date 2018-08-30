/**
 * @class Mod
 */
class Mod {
	constructor(options = {}, enhancers = []) {
		this._options = { ...this.options(), ...options };
		this._name = this.name();
		this._enhancers = enhancers;
		this._id = options.id || this._name;
	}

	getId() {
		return this._id;
	}

	getName() {
		return this._name;
	}

	getEnhancers() {
		return this._enhancers;
	}

	getOption(name) {
		if (this._options[name] !== undefined) {
			return this._options[name];
		}

		console.warn(
			`In Mod '${
				this._name
			}', You tried to call "this.getOption('${name}')" but the property ${name} is undefined. Please check that the property is defined before using it.`
		);
	}

	getOptions() {
		return this._options;
	}

	name() {
		throw new Error(
			`You have not implemented "name() {}" function in your Mod. This is marked as required.`
		);
	}

	options() {
		return {};
	}

	middleware() {}

	reducers() {}

	storeEnhancer() {}

	storeSubscribe() {}

	wrapApp() {}
}

export default Mod;
