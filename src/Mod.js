/**
 * @class Mod
 */
class Mod {
	constructor(options = {}, enhancers = {}) {
		this._options = { ...this.options(), ...options };
		this._name = this.name();
		this._enhancers = enhancers;
		this._id = options.id || this._name;
	}

	getId = () => this._id;

	getName = () => this._name;

	getEnhancers = () => this._enhancers;

	getOption = name => {
		if (this._options[name] !== undefined) {
			return this._options[name];
		}

		console.warn(
			`In Mod '${
				this._name
			}', You tried to call "this.getOption('${name}')" but the property ${name} is undefined. Please check that the property is defined before using it.`
		);
	};

	getOptions = () => this._options;

	name = () => {
		throw new Error(
			`You have not implemented "name() {}" function in your Mod. This is marked as required.`
		);
	};

	options = () => ({});

	middleware = () => {};

	reducers = () => {};

	storeEnhancer = () => {};

	storeSubscribe = () => {};

	wrapsApp = () => {};
}

export default Mod;
