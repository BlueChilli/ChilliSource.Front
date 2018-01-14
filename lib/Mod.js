var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import jsonMerge from './helpers/jsonMerge';

var Mod = function () {
  function Mod() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var enhancers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, Mod);

    this._opts = jsonMerge(this.options(), opts);
    this._name = this.name();
    this._enhancers = enhancers;
    this._id = opts.id || this._name;
  }

  _createClass(Mod, [{
    key: 'getId',
    value: function getId() {
      return this._id;
    }
  }, {
    key: 'getName',
    value: function getName() {
      return this._name;
    }
  }, {
    key: 'getEnhancers',
    value: function getEnhancers() {
      return this._enhancers;
    }
  }, {
    key: 'getOption',
    value: function getOption(name) {
      if (this._opts[name] === undefined) {
        /* eslint-disable no-console */
        console.warn('You tried to call this.getOption("' + name + '") in "' + this.getName() + '" but it\'s undefined. \n Options available are ' + JSON.stringify(this._opts));
      }
      return this._opts[name];
    }
  }, {
    key: 'getOptions',
    value: function getOptions() {
      return this._opts;
    }
  }, {
    key: 'name',
    value: function name() {
      throw new Error('Function name() missing in module name ' + this.constructor.name);
    }
  }, {
    key: 'options',
    value: function options() {
      return {};
    }
  }, {
    key: 'middleware',
    value: function middleware() {}
  }, {
    key: 'actions',
    value: function actions() {}
  }, {
    key: 'reducers',
    value: function reducers() {}
  }, {
    key: 'routes',
    value: function routes() {}
  }, {
    key: 'wrapApp',
    value: function wrapApp() {}
  }, {
    key: 'functions',
    value: function functions() {}
  }, {
    key: 'mapStateToProps',
    value: function mapStateToProps() {
      return undefined;
    }
  }, {
    key: 'mapDispatchToProps',
    value: function mapDispatchToProps() {
      return undefined;
    }
  }, {
    key: 'storeEnhancer',
    value: function storeEnhancer() {}
  }, {
    key: 'storeSubscribe',
    value: function storeSubscribe() {}

    // fyi, this is still work in progress

  }, {
    key: 'component',
    value: function component() {
      var dontThrow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (!dontThrow) {
        throw new Error('No component exists for the \'' + this.getName() + '\' module. You tried to call getComponent() for it.');
      }
      return false;
    }

    // fyi, this is still work in progress

  }, {
    key: 'hasComponent',
    value: function hasComponent() {
      return this.component(true) !== false;
    }
  }]);

  return Mod;
}();

export default Mod;