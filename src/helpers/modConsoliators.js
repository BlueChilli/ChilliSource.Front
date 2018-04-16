import isArray from 'lodash-es/isArray';
import {compose} from 'redux';
import ReduxConnectModule from './ReduxConnectModule';

// From the mod list, returns an array of middleware functions
export const consolidateMiddlewareFromMods = mods =>
  mods.map(thisModule => thisModule.middleware()).filter(v => v !== undefined);

// Returns array of appwrapper across entire modulestack
export const consolidateAppWrappersFromMods = mods =>
  mods.map(thisModule => thisModule.wrapApp(thisModule.options())).filter(v => v !== undefined);


// From the mod list, returns array of route objects that can be
// processed by react-router-config
export const consolidateRoutesFromMods = mods => {
  let routes = [];

  // All the things to globally enhance all components
  const enhancers = compose(...consolidateAppWrappersFromMods(mods));

  mods.forEach((thisModule) => {
    // Any enhancers specific to a mod, gets applied.
    const thisModuleEnhancers = compose(enhancers, ...thisModule.getEnhancers());

    const thisRoute = thisModule.routes(thisModuleEnhancers);

    // Differentiate between a single route and an array of routes
    if (isArray(thisRoute)) {
      routes = routes.concat(thisRoute);
    } else if (thisRoute) {
      routes.push(thisRoute);
    }
  });

  return routes;
};

// Returns a list of reducers
export const consolidateReducersFromMods = mods => {
  let reducers = {};
  mods.forEach((thisModule) => {
    reducers = {...reducers, ...thisModule.reducers()};
  });

  // combineReducers gets a bit annoyed if there are no reducers
  if (Object.keys(reducers).length === 0) {
    return {
      emptyReducer: [() => {
      }],
    };
  }

  return reducers;
};

// Return a list of reducers (from options)
export const consolidateReducersFromOptions = options => {
  return options.reducers ? options.reducers : {};
};


export const buildMasterEnhancerFromMods = mods => mods.map((thisModule) => {
  if (thisModule.mapStateToProps() !== undefined || thisModule.mapDispatchToProps() !== undefined) {
    return ReduxConnectModule(
      thisModule.mapStateToProps(),
      thisModule.mapDispatchToProps(),
      thisModule.getName(),
    );
  }
  return undefined;
}).filter(v => v !== undefined);


// Returns array of store enhancers
export const consolidateStoreEnhancersFromMods = mods =>
  mods.map(thisModule => thisModule.storeEnhancer()).filter(v => v !== undefined);


// returns a JSON object of all declared actions across all modules
export const consolidateActionsFromMods = (mods) => {
  const allActions = {};

  mods.forEach((thisModule) => {
    const action = thisModule.actions();
    if (action !== undefined) {
      for (const key of Object.keys(action)) {
        if (allActions[thisModule.getId()] === undefined) allActions[thisModule.getId()] = {};
        allActions[thisModule.getId()][key] = action[key];
      }
    }
  });

  return allActions;
};

// returns a JSON object of all declared enhancers across all modules
export const consolidateFunctionsFromMods = (mods) => {
  const allFunctions = {};

  mods.forEach((thisModule) => {
    const functn = thisModule.functions();
    if (functn !== undefined) {
      for (const key of Object.keys(functn)) {
        if (allFunctions[thisModule.getId()] === undefined) allFunctions[thisModule.getId()] = {};
        allFunctions[thisModule.getId()][key] = functn[key];
      }
    }
  });

  return allFunctions;
};

// store subscribers

export const consolidateStoreSubscribersfromMods = mods =>
  mods.map(thisModule => thisModule.storeSubscribe()).filter(v => v !== undefined);
