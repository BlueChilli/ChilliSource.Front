var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import isArray from 'lodash-es/isArray';
import { compose } from 'redux';
import ReduxConnectModule from './ReduxConnectModule';

// From the mod list, returns an array of middleware functions
export var consolidateMiddlewareFromMods = function consolidateMiddlewareFromMods(mods) {
  return mods.map(function (thisModule) {
    return thisModule.middleware();
  }).filter(function (v) {
    return v !== undefined;
  });
};

// Returns array of appwrapper across entire modulestack
export var consolidateAppWrappersFromMods = function consolidateAppWrappersFromMods(mods) {
  return mods.map(function (thisModule) {
    return thisModule.wrapApp(thisModule.options());
  }).filter(function (v) {
    return v !== undefined;
  });
};

// From the mod list, returns array of route objects that can be
// processed by react-router-config
export var consolidateRoutesFromMods = function consolidateRoutesFromMods(mods) {
  var routes = [];

  // All the things to globally enhance all components
  var enhancers = compose.apply(undefined, _toConsumableArray(consolidateAppWrappersFromMods(mods)));

  mods.forEach(function (thisModule) {
    // Any enhancers specific to a mod, gets applied.
    var thisModuleEnhancers = compose.apply(undefined, [enhancers].concat(_toConsumableArray(thisModule.getEnhancers())));

    var thisRoute = thisModule.routes(thisModuleEnhancers);

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
export var consolidateReducersFromMods = function consolidateReducersFromMods(mods) {
  var reducers = {};
  mods.forEach(function (thisModule) {
    reducers = _extends({}, reducers, thisModule.reducers());
  });

  // combineReducers gets a bit annoyed if there are no reducers
  if (Object.keys(reducers).length === 0) {
    return {
      emptyReducer: [function () {}]
    };
  }

  return reducers;
};

// Return a list of reducers (from options)
export var consolidateReducersFromOptions = function consolidateReducersFromOptions(options) {
  return options.reducers ? options.reducers : {};
};

export var buildMasterEnhancerFromMods = function buildMasterEnhancerFromMods(mods) {
  return mods.map(function (thisModule) {
    if (thisModule.mapStateToProps() !== undefined || thisModule.mapDispatchToProps() !== undefined) {
      return ReduxConnectModule(thisModule.mapStateToProps(), thisModule.mapDispatchToProps(), thisModule.getName());
    }
    return undefined;
  }).filter(function (v) {
    return v !== undefined;
  });
};

// Returns array of store enhancers
export var consolidateStoreEnhancersFromMods = function consolidateStoreEnhancersFromMods(mods) {
  return mods.map(function (thisModule) {
    return thisModule.storeEnhancer();
  }).filter(function (v) {
    return v !== undefined;
  });
};

// returns a JSON object of all declared actions across all modules
export var consolidateActionsFromMods = function consolidateActionsFromMods(mods) {
  var allActions = {};

  mods.forEach(function (thisModule) {
    var action = thisModule.actions();
    if (action !== undefined) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(action)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          if (allActions[thisModule.getId()] === undefined) allActions[thisModule.getId()] = {};
          allActions[thisModule.getId()][key] = action[key];
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  });

  return allActions;
};

// returns a JSON object of all declared enhancers across all modules
export var consolidateFunctionsFromMods = function consolidateFunctionsFromMods(mods) {
  var allFunctions = {};

  mods.forEach(function (thisModule) {
    var functn = thisModule.functions();
    if (functn !== undefined) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Object.keys(functn)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var key = _step2.value;

          if (allFunctions[thisModule.getId()] === undefined) allFunctions[thisModule.getId()] = {};
          allFunctions[thisModule.getId()][key] = functn[key];
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  });

  return allFunctions;
};

// store subscribers

export var consolidateStoreSubscribersfromMods = function consolidateStoreSubscribersfromMods(mods) {
  return mods.map(function (thisModule) {
    return thisModule.storeSubscribe();
  }).filter(function (v) {
    return v !== undefined;
  });
};