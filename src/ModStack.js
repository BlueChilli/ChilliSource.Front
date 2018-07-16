// If you want to access anything from the mod ecosystem,
// best to do with via this class

import objectMap from 'object.map';

export default class ModStack {
  static stack = {};
  static actions = {};
  static _functions = {};

  static _masterEnhancerFunction = x => x;

  static add(mod) {
    if (Array.isArray(mod) === true) {
      mod.forEach((thisModule) => {
        this.add(thisModule);
      });
    } else if (this.stack[mod.getId()]) {
      console.warn(`Duplicate module ID's "${mod.getId()}" found. Please give this module a unique ID.`);
    } else {
      this.stack[mod.getId()] = mod;
    }
    return true;
  }

  static getAll() {
    return this.stack;
  }


  static get(name) {
    if (this.stack[name] === undefined) {
      throw new Error(`Uh oh, Trying to get non-existent module '${name}' from modstack.\nList of modules available:`, this.stack);
    }
    return this.stack[name];
  }

  static setMasterEnhancerFunction(ef) {
    this._masterEnhancerFunction = ef;
  }

  static getEnhancerFunction() {
    return this._masterEnhancerFunction;
  }

  // all actions from consolidateActionsFromMods are turned into
  // a master blob
  static addActions(actions) {
    for (const key of Object.keys(actions)) {
      for (const actionName of Object.keys(actions[key])) {
        const actionRef = `${key}/${actionName}`;
        this.actions[actionRef] = actions[key][actionName];
      }
    }
  }

  static addFunctions(functions) {
    for (const key of Object.keys(functions)) {
      for (const functionName of Object.keys(functions[key])) {
        const functionRef = `${key}/${functionName}`;
        this._functions[functionRef] = functions[key][functionName];
      }
    }
  }

  static getActionByID(actionID) {
    if (this.actions[actionID] === undefined) {
      throw new Error(`Was unable to find action "${actionID}".`);
    }
    return this.actions[actionID];
  }

  static getFunctionByID(functionID) {
    if (this._functions[functionID] === undefined) {
      throw new Error(`Was unable to find function "${functionID}".`);
    }
    return this._functions[functionID];
  }

  static functions() {
    return this._functions;
  }

  /* eslint-disable no-console */
  static show() {
    // React Native not a fan of this
    if (typeof document === 'undefined') return;

    console.group('MODULES');
    for (const key of Object.keys(this.stack)) {
      const vals = {
        id: this.stack[key].getId(),
        name: this.stack[key].getName(),
        options: this.stack[key].getOptions(),
        // exposes: this.stack[key].expose(),
        routes: this.stack[key].routes(x => x),
        hasMiddleware: this.stack[key].middleware() !== undefined,
        wrapsApp: this.stack[key].wrapApp() !== undefined,
        hasComponent: this.stack[key].hasComponent(),
        actions: this.stack[key].actions(),
        reducers: this.stack[key].reducers(),
        mapStateToProps: this.stack[key].mapStateToProps(),
        mapDispatchToProps: this.stack[key].mapDispatchToProps(),
        storeEnhancer: this.stack[key].storeEnhancer(),
      };

      const label = vals.id !== vals.name ? `${vals.id} (${vals.name})` : `${vals.id}`;

      const desc = (vals.hasMiddleware ? '[Middleware]' : '') +
        (vals.hasComponent ? '[Component]' : '') +
        (vals.wrapsApp ? '[App Wrapper]' : '') +
        (vals.routes !== undefined ? '[Routes]' : '') +
        (vals.exposes !== undefined ? '[Exposes Functions]' : '') +
        (vals.actions !== undefined ? '[Actions]' : '') +
        (vals.reducers !== undefined ? '[Reducers]' : '') +
        (vals.mapStateToProps !== undefined ? '[State to Props]' : '') +
        (vals.mapDispatchToProps !== undefined ? '[Dispatch to Props]' : '') +
        (vals.storeEnhancer !== undefined ? '[Store Enhancer]' : '');
      console.groupCollapsed(label, desc);

      Object.keys(vals).forEach((key) => {
        console.log(key, vals[key]);
      });
      console.groupEnd();
    }

    console.groupEnd();

    // Show module actions
    console.group('ACTIONS');

    const actionTable = objectMap(
      this.actions,
      func => func.toString().match(/function\s*(.*?)\s*{/)[1],
    );

    console.table(actionTable);
    console.groupEnd();

    // Show module enhancers
    console.group('FUNCTIONS');

    const funcTable = objectMap(
      this._functions,
      func => func.toString().match(/function\s*(.*?)\s*{/)[1],
    );

    console.table(funcTable);
    console.groupEnd();
  }
}
