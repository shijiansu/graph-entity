/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// This is used for storing the schema tree.
//
// TODO: It's single instance per app now
//
// {
//   // Assessment is class identifier of an entity
//   // has relation to $$_GE_display_name but not readable
//   Assessment: {
//     $$_GE_constructor: Assessment,
//     $$_GE_display_name: 'Assessment',
//     id: { type: 'String', path: 'id' },
//     user: { type: 'User', path: 'user', on: 'asdfasdf' },
//     answerText: { type: 'String', path: 'answer.title.text' }
//   }
// }

exports.default = {};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var uuid = 1;
var PREFIX = exports.PREFIX = '$$GE_';

var getNewSchemaKey = exports.getNewSchemaKey = function getNewSchemaKey() {
  return PREFIX + 'anonymous_' + uuid++;
};
var getHiddenFieldName = exports.getHiddenFieldName = function getHiddenFieldName(field) {
  return PREFIX + 'hidden_' + field;
};

var ATOM_TYPE = exports.ATOM_TYPE = ['Date', 'String', 'Number', 'Boolean', 'ID'];

var attachGetterSetter = exports.attachGetterSetter = function attachGetterSetter(proto, fieldName, descriptor, displayName) {
  var __fieldName = getHiddenFieldName(fieldName);

  // TODO: change prototype in different order may cause performance issue
  //       according to v8 hidden class mechanism.
  //       put prototype outside ??
  descriptor.get = function () {
    if (!this[__fieldName]) {
      console.warning('Graph Entity: You are trying to access an untouched field (' + displayName + '::' + fieldName + ')');
      return undefined;
    }

    return this[__fieldName].value;
  };

  descriptor.set = function (value) {
    this[__fieldName] = {
      touched: true,
      value: value
    };
  };

  // hack for babel-decorator-plugin
  delete descriptor.initializer;

  delete descriptor.writable;
  delete descriptor.value;

  return descriptor;
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _schemaStore = __webpack_require__(0);

var _schemaStore2 = _interopRequireDefault(_schemaStore);

var _utils = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Schema = function () {
  _createClass(Schema, [{
    key: 'displayName',
    get: function get() {
      return this.paths.join('::');
    }
  }]);

  function Schema(name, entityClass, paths) {
    _classCallCheck(this, Schema);

    this.schemaKey = '';
    this.paths = [];
    this.entityClass = null;
    this.fields = {};
    this.ons = {};

    this.schemaKey = name || (0, _utils.getNewSchemaKey)();
    this.paths = paths;
    this.entityClass = entityClass;

    _schemaStore2.default[this.schemaKey] = this;
  }

  _createClass(Schema, [{
    key: 'addField',
    value: function addField(name, type, alias) {
      if ((typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'object') {
        type = Schema.generateNestedFields(type, this.paths.concat(name));
      }

      this.fields[name] = { type: type, alias: alias || name };
    }
  }, {
    key: 'addFieldOn',
    value: function addFieldOn(name, type, ons) {
      var _this = this;

      if ((typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'object') {
        type = Schema.generateNestedFields(type, this.paths.concat(name));
      }

      if (!(ons instanceof Array)) {
        ons = [ons];
      }

      ons.forEach(function (o) {
        if (!_this.ons[o]) {
          _this.ons[o] = {};
        }

        // use alias for handle convenniencely
        _this.ons[o][name] = { type: type, alias: name };
      });
    }
  }, {
    key: 'composeToString',
    value: function composeToString(paths) {
      var _this2 = this;

      var excludes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      var result = [];

      var toString = function toString(fields, innerPaths) {
        var spaces = '  '.repeat(innerPaths.length);

        Object.keys(fields).forEach(function (key) {
          var _fields$key = fields[key],
              type = _fields$key.type,
              alias = _fields$key.alias;


          if (excludes.indexOf('' + innerPaths.concat(key).join('.')) >= 0) {
            return;
          }

          if (_utils.ATOM_TYPE.indexOf(type) >= 0) {
            result.push('' + spaces + alias);
          } else {
            result.push('' + spaces + alias + ' {');
            result.push.apply(result, _toConsumableArray(_schemaStore2.default[type].composeToString(innerPaths.concat(alias), excludes)));
            result.push(spaces + '}');
          }
        });
      };

      // compose normal fields
      toString(this.fields, paths);

      // compose 'on' fields
      Object.keys(this.ons).forEach(function (key) {
        var spaces = '  '.repeat(paths.length);

        result.push(spaces + '... on ' + key + ' {');
        toString(_this2.ons[key], paths.concat(key));
        result.push(spaces + '}');
      });

      return result;
    }
  }], [{
    key: 'generateNestedFields',
    value: function generateNestedFields(fields, paths) {
      var AnonymousClass = function AnonymousClass() {};
      var schema = new Schema(null, AnonymousClass, paths);

      Object.keys(fields).forEach(function (key) {
        Object.defineProperty(AnonymousClass.prototype, key, function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return _utils.attachGetterSetter.apply(undefined, args.concat([schema.displayName]));
        });

        schema.addField(key, fields[key], key);
      });

      return schema.schemaKey;
    }
  }]);

  return Schema;
}();

exports.default = Schema;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = __webpack_require__(1);

var _Schema = __webpack_require__(2);

var _Schema2 = _interopRequireDefault(_Schema);

var _schemaStore = __webpack_require__(0);

var _schemaStore2 = _interopRequireDefault(_schemaStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (dataType, alias) {
  return function (proto, fieldName, descriptor) {
    var entityName = proto.constructor.name;

    var schema = _schemaStore2.default[entityName] || new _Schema2.default(entityName, proto.constructor, [entityName]);

    schema.addField(fieldName, dataType, alias);

    return (0, _utils.attachGetterSetter)(proto, fieldName, descriptor, schema.displayName);
  };
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = __webpack_require__(1);

var _Schema = __webpack_require__(2);

var _Schema2 = _interopRequireDefault(_Schema);

var _schemaStore = __webpack_require__(0);

var _schemaStore2 = _interopRequireDefault(_schemaStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (dataType, ons) {
  return function (proto, fieldName, descriptor) {
    var entityName = proto.constructor.name;

    var schema = _schemaStore2.default[entityName] || new _Schema2.default(entityName, proto.constructor, [entityName]);

    schema.addFieldOn(fieldName, dataType, ons);

    return (0, _utils.attachGetterSetter)(proto, fieldName, descriptor, schema.displayName);
  };
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _desc, _value, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9;
// import query from './@decorator/query';

var _field = __webpack_require__(3);

var _field2 = _interopRequireDefault(_field);

var _fieldOn = __webpack_require__(4);

var _fieldOn2 = _interopRequireDefault(_fieldOn);

var _schemaStore = __webpack_require__(0);

var _schemaStore2 = _interopRequireDefault(_schemaStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

var Assessment = (_dec = (0, _field2.default)('String'), _dec2 = (0, _field2.default)('Date'), _dec3 = (0, _field2.default)('Date'), _dec4 = (0, _field2.default)('String'), _dec5 = (0, _field2.default)('String'), _dec6 = (0, _field2.default)({
  address: 'String',
  verified: 'String'
}, 'emails'), _dec7 = (0, _field2.default)({
  type: 'String',
  streetName: 'String',
  streetNumber: 'String',
  floor: 'String',
  unit: 'String',
  city: 'String',
  country: {
    code: 'String',
    description: 'String'
  },
  postCode: 'String'
}), _dec8 = (0, _fieldOn2.default)({ a: 'String', b: { c: 'String', d: 'String' } }, 'asdf'), _dec9 = (0, _fieldOn2.default)('String', ['asdf', 'sss']), (_class =

// @query('user', 'Assessment')
// static get(id) {
//   return { id };
// }
function Assessment() {
  _classCallCheck(this, Assessment);

  _initDefineProp(this, 'id', _descriptor, this);

  _initDefineProp(this, 'createdAt', _descriptor2, this);

  _initDefineProp(this, 'updatedAt', _descriptor3, this);

  _initDefineProp(this, 'role', _descriptor4, this);

  _initDefineProp(this, 'username', _descriptor5, this);

  _initDefineProp(this, 'myEmails', _descriptor6, this);

  _initDefineProp(this, 'addresses', _descriptor7, this);

  _initDefineProp(this, 'oyoyo', _descriptor8, this);

  _initDefineProp(this, 'ayaya', _descriptor9, this);
}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'id', [_dec], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'createdAt', [_dec2], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, 'updatedAt', [_dec3], {
  enumerable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, 'role', [_dec4], {
  enumerable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, 'username', [_dec5], {
  enumerable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, 'myEmails', [_dec6], {
  enumerable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class.prototype, 'addresses', [_dec7], {
  enumerable: true,
  initializer: null
}), _descriptor8 = _applyDecoratedDescriptor(_class.prototype, 'oyoyo', [_dec8], {
  enumerable: true,
  initializer: null
}), _descriptor9 = _applyDecoratedDescriptor(_class.prototype, 'ayaya', [_dec9], {
  enumerable: true,
  initializer: null
})), _class));


console.log(_schemaStore2.default.Assessment.composeToString([]).join('\n'));

// Assessment.get("NTgyZDVhZDEyNjQ1YjcyMGIzN2Q4YTEx").then((res) => {
//   debugger
//   console.log(res);
// });

/***/ })
/******/ ]);