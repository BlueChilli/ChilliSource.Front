var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// If you want to access anything from the mod ecosystem,
// best to do with via this class

import objectMap from 'object.map';

var ModStack = function () {
  function ModStack() {
    _classCallCheck(this, ModStack);
  }

  _createClass(ModStack, null, [{
    key: 'add',
    value: function add(mod) {
      var _this = this;

      if (Array.isArray(mod) === true) {
        mod.forEach(function (thisModule) {
          _this.add(thisModule);
        });
      } else if (this.stack[mod.getId()]) {
        throw new Error('Duplicate module ID\'s "' + mod.getId() + '" found. Please give this module a unique ID.');
      } else {
        this.stack[mod.getId()] = mod;
      }
      return true;
    }
  }, {
    key: 'getAll',
    value: function getAll() {
      return this.stack;
    }
  }, {
    key: 'get',
    value: function get(name) {
      if (this.stack[name] === undefined) {
        throw new Error('Uh oh, Trying to get non-existent module \'' + name + '\' from modstack.\nList of modules available:', this.stack);
      }
      return this.stack[name];
    }
  }, {
    key: 'setMasterEnhancerFunction',
    value: function setMasterEnhancerFunction(ef) {
      this._masterEnhancerFunction = ef;
    }
  }, {
    key: 'getEnhancerFunction',
    value: function getEnhancerFunction() {
      return this._masterEnhancerFunction;
    }

    // all actions from consolidateActionsFromMods are turned into
    // a master blob

  }, {
    key: 'addActions',
    value: function addActions(actions) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(actions)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = Object.keys(actions[key])[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var actionName = _step2.value;

              var actionRef = key + '/' + actionName;
              this.actions[actionRef] = actions[key][actionName];
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
  }, {
    key: 'addFunctions',
    value: function addFunctions(functions) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = Object.keys(functions)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var key = _step3.value;
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = Object.keys(functions[key])[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var functionName = _step4.value;

              var functionRef = key + '/' + functionName;
              this._functions[functionRef] = functions[key][functionName];
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }, {
    key: 'getActionByID',
    value: function getActionByID(actionID) {
      if (this.actions[actionID] === undefined) {
        throw new Error('Was unable to find action "' + actionID + '".');
      }
      return this.actions[actionID];
    }
  }, {
    key: 'getFunctionByID',
    value: function getFunctionByID(functionID) {
      if (this._functions[functionID] === undefined) {
        throw new Error('Was unable to find function "' + functionID + '".');
      }
      return this._functions[functionID];
    }
  }, {
    key: 'functions',
    value: function functions() {
      return this._functions;
    }

    /* eslint-disable no-console */

  }, {
    key: 'show',
    value: function show() {
      var _this2 = this;

      // React Native not a fan of this
      if (typeof document === 'undefined') return;

      console.group('MODULES');

      var _loop = function _loop(key) {
        var vals = {
          id: _this2.stack[key].getId(),
          name: _this2.stack[key].getName(),
          options: _this2.stack[key].getOptions(),
          // exposes: this.stack[key].expose(),
          routes: _this2.stack[key].routes(function (x) {
            return x;
          }),
          hasMiddleware: _this2.stack[key].middleware() !== undefined,
          wrapsApp: _this2.stack[key].wrapApp() !== undefined,
          hasComponent: _this2.stack[key].hasComponent(),
          actions: _this2.stack[key].actions(),
          reducers: _this2.stack[key].reducers(),
          mapStateToProps: _this2.stack[key].mapStateToProps(),
          mapDispatchToProps: _this2.stack[key].mapDispatchToProps(),
          storeEnhancer: _this2.stack[key].storeEnhancer()
        };

        var label = vals.id !== vals.name ? vals.id + ' (' + vals.name + ')' : '' + vals.id;

        var desc = (vals.hasMiddleware ? '[Middleware]' : '') + (vals.hasComponent ? '[Component]' : '') + (vals.wrapsApp ? '[App Wrapper]' : '') + (vals.routes !== undefined ? '[Routes]' : '') + (vals.exposes !== undefined ? '[Exposes Functions]' : '') + (vals.actions !== undefined ? '[Actions]' : '') + (vals.reducers !== undefined ? '[Reducers]' : '') + (vals.mapStateToProps !== undefined ? '[State to Props]' : '') + (vals.mapDispatchToProps !== undefined ? '[Dispatch to Props]' : '') + (vals.storeEnhancer !== undefined ? '[Store Enhancer]' : '');
        console.groupCollapsed(label, desc);

        Object.keys(vals).forEach(function (key) {
          console.log(key, vals[key]);
        });
        console.groupEnd();
      };

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = Object.keys(this.stack)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var key = _step5.value;

          _loop(key);
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      console.groupEnd();

      // Show module actions
      console.group('ACTIONS');

      var actionTable = objectMap(this.actions, function (func) {
        return func.toString().match(/function\s*(.*?)\s*{/)[1];
      });

      console.table(actionTable);
      console.groupEnd();

      // Show module enhancers
      console.group('FUNCTIONS');

      var funcTable = objectMap(this._functions, function (func) {
        return func.toString().match(/function\s*(.*?)\s*{/)[1];
      });

      console.table(funcTable);
      console.groupEnd();
    }
  }]);

  return ModStack;
}();

ModStack.stack = {};
ModStack.actions = {};
ModStack._functions = {};

ModStack._masterEnhancerFunction = function (x) {
  return x;
};

export default ModStack;