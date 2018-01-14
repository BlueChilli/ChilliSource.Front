import jsonMerge from './helpers/jsonMerge';

export default class Mod {
  constructor(opts = {}, enhancers = []) {
    this._opts = jsonMerge(this.options(), opts);
    this._name = this.name();
    this._enhancers = enhancers;
    this._id = opts.id || this._name;
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
    if (this._opts[name] === undefined) {
      /* eslint-disable no-console */
      console.warn(`You tried to call this.getOption("${name}") in "${this.getName()}" but it's undefined. \n Options available are ${JSON.stringify(this._opts)}`);
    }
    return this._opts[name];
  }

  getOptions() {
    return this._opts;
  }


  name() {
    throw new Error(`Function name() missing in module name ${this.constructor.name}`);
  }

  options() {
    return {};
  }

  middleware() {
  }

  actions() {
  }

  reducers() {
  }

  routes() {
  }

  wrapApp() {
  }

  functions() {
  }


  mapStateToProps() {
    return undefined;
  }

  mapDispatchToProps() {
    return undefined;
  }

  storeEnhancer() {

  }

  storeSubscribe() {

  }

  // fyi, this is still work in progress
  component(dontThrow = false) {
    if (!dontThrow) {
      throw new Error(`No component exists for the '${this.getName()}' module. You tried to call getComponent() for it.`);
    }
    return false;
  }

  // fyi, this is still work in progress
  hasComponent() {
    return this.component(true) !== false;
  }
}
