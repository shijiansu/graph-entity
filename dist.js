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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compileToQueryString = exports.walkThrough = exports.attachOperation = exports.generateNestedEntity = exports.attachField = exports.attachGetterSetter = exports.getClassDisplayName = exports.getAnonymousClassName = exports.getOperationName = exports.getHiddenFieldName = exports.GE_DISPLAY_NAME = exports.GE_CONSTURCTOR = exports.PREFIX = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _schemaStore = __webpack_require__(1);

var _schemaStore2 = _interopRequireDefault(_schemaStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PREFIX = exports.PREFIX = '$$GE_';
var GE_CONSTURCTOR = exports.GE_CONSTURCTOR = PREFIX + '$$constructor';
var GE_DISPLAY_NAME = exports.GE_DISPLAY_NAME = PREFIX + '$$display_name';

var getHiddenFieldName = exports.getHiddenFieldName = function getHiddenFieldName(name) {
  return '' + PREFIX + name;
};
var getOperationName = exports.getOperationName = function getOperationName(entity, field) {
  return '' + PREFIX + entity + '_' + field;
};

var getAnonymousClassName = exports.getAnonymousClassName = function getAnonymousClassName() {
  var nestedNames = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var entityName = arguments[1];
  var classType = arguments[2];

  var names = nestedNames.join('_');
  return '' + PREFIX + classType + '_' + (names ? names + '_' : '') + entityName;
};

var getClassDisplayName = exports.getClassDisplayName = function getClassDisplayName() {
  var nestedNames = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  return nestedNames.join('::');
};

var attachGetterSetter = exports.attachGetterSetter = function attachGetterSetter(proto, fieldName, descriptor, entityName) {
  var __fieldName = getHiddenFieldName(fieldName);
  var entity = _schemaStore2.default[entityName];

  // TODO: change prototype in different order may cause performance issue
  //       according to v8 hidden class mechanism.
  //       put prototype outside ??
  descriptor.get = function () {
    if (!this[__fieldName]) {
      console.warning('Graph Entity: You are trying to access an untouched field (' + entity[GE_DISPLAY_NAME] + '::' + fieldName + ')');
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

var attachField = exports.attachField = function attachField(options, nestedNames) {
  var fieldName = options.fieldName,
      entityName = options.entityName,
      dataType = options.dataType,
      proto = options.proto,
      path = options.path,
      on = options.on;


  var entity = _schemaStore2.default[entityName] || {};
  if (!_schemaStore2.default[entityName]) {
    entity[GE_CONSTURCTOR] = proto.constructor;
    entity[GE_DISPLAY_NAME] = getClassDisplayName(nestedNames);

    _schemaStore2.default[entityName] = entity;
  }

  // if the field name is already defined
  if (entity[fieldName]) {
    throw new Error('Graph Entity: ' + entity[GE_DISPLAY_NAME] + '::' + path + ' is already defined.');
  }

  // add field to entity tree
  entity[fieldName] = {
    type: dataType.replace(/[\[\]\!]/g, ''),
    path: path,
    on: on
  };
};

var generateNestedEntity = exports.generateNestedEntity = function generateNestedEntity(options, nestedNames) {
  var classType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'anonymous';
  var fields = options.fields,
      fieldName = options.fieldName,
      entityName = options.entityName;


  var AnonymousClass = function AnonymousClass() {};
  var className = getAnonymousClassName(nestedNames, fieldName, classType);

  for (var key in fields) {
    if (_typeof(fields[key]) === 'object') {
      var type = generateNestedEntity({
        fields: fields[key], fieldName: key, entityName: className, proto: AnonymousClass.prototype
      }, nestedNames.concat([fieldName]), classType);

      attachField({
        fieldName: key, entityName: className, dataType: type, proto: AnonymousClass.prototype
      }, nestedNames.concat([fieldName]));
    } else {
      attachField({
        fieldName: key, entityName: className, dataType: fields[key], proto: AnonymousClass.prototype
      }, nestedNames.concat([fieldName]));
    }

    Object.defineProperty(AnonymousClass.prototype, key, function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return attachGetterSetter.apply(undefined, args.concat([entityName]));
    });
  }

  return className;
};

var attachOperation = exports.attachOperation = function attachOperation(entityName, fieldName, output, input, opName, opType) {
  var schemaName = getOperationName(entityName, fieldName);

  var outputType = output;
  var inputType = input;

  if ((typeof output === 'undefined' ? 'undefined' : _typeof(output)) === 'object') {
    outputType = generateNestedEntity({
      fields: output, fieldName: fieldName, entityName: entityName
    }, [entityName], 'output');
  } else if (!output) {
    outputType = entityName;
  }

  if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object') {
    inputType = generateNestedEntity({
      fields: input, fieldName: fieldName, entityName: entityName
    }, [entityName], 'input');
  }

  var schema = _schemaStore2.default[schemaName] = _schemaStore2.default[schemaName] || {};
  schema.name = opName;
  schema.type = opType;
  schema.output = outputType;
  schema.input = inputType;

  return schemaName;
};

var ATOM_TYPE = ['Date', 'String', 'Number', 'Boolean', 'ID'];

var walkThrough = exports.walkThrough = function walkThrough(dataType, callback, paths) {
  if (!_schemaStore2.default[dataType]) {
    throw new Error('Type ' + dataType + ' not found while walking through schema!');
  }

  var entity = _schemaStore2.default[dataType];

  for (var key in entity) {
    if (key.startsWith(PREFIX)) {
      continue;
    }

    var _entity$key = entity[key],
        type = _entity$key.type,
        path = _entity$key.path;

    callback(paths, entity[key]);

    if (ATOM_TYPE.indexOf(type) === -1) {
      walkThrough(type, callback, paths.concat(path.split('.')));
    }
  }
};

var compileToQueryString = exports.compileToQueryString = function compileToQueryString(dataType, paths, resultArray, excludeArray) {
  if (!_schemaStore2.default[dataType]) {
    throw new Error('Type ' + dataType + ' not found while compiling schema!');
  }

  var padSpaces = '  '.repeat(paths.length);
  var entity = _schemaStore2.default[dataType];
  var fieldsWithOn = {};
  var flattenFields = {};

  var _loop = function _loop(key) {
    if (key.startsWith(PREFIX)) {
      return 'continue';
    }

    var _entity$key2 = entity[key],
        type = _entity$key2.type,
        _entity$key2$path = _entity$key2.path,
        path = _entity$key2$path === undefined ? key : _entity$key2$path,
        on = _entity$key2.on;


    var flattenPath = path.split('.');

    // check for exclude
    if (excludeArray.indexOf('' + paths.join('.') + (paths.length ? '.' : '') + path) >= 0) {
      return 'continue';
    }

    // store ...on till finished other fields
    if (on) {
      var onArray = Array.isArray(on) ? on : [on];

      onArray.forEach(function (o) {
        fieldsWithOn[o] = entity[key];
      });
      return 'continue';
    }

    // deal with flatten path
    if (flattenPath.length > 1) {
      var current = flattenFields;

      flattenPath.forEach(function (p) {
        current[p] = current[p] || {};
        current = current[p];
      });
      return 'continue';
    }

    // append query string to results
    if (ATOM_TYPE.indexOf(type) === -1) {
      resultArray.push('' + padSpaces + path + ' {');
      compileToQueryString(type, paths.concat(path), resultArray, excludeArray);
      resultArray.push(padSpaces + '}');
    } else {
      resultArray.push('' + padSpaces + path);
    }
  };

  for (var key in entity) {
    var _ret = _loop(key);

    if (_ret === 'continue') continue;
  }

  for (var onName in fieldsWithOn) {
    var _fieldsWithOn$onName = fieldsWithOn[onName],
        _type = _fieldsWithOn$onName.type,
        _path = _fieldsWithOn$onName.path,
        _on = _fieldsWithOn$onName.on;


    resultArray.push(padSpaces + '... on ' + _on + ' {');

    if (ATOM_TYPE.indexOf(_type) === -1) {
      resultArray.push(padSpaces + '  ' + _path + ' {');
      compileToQueryString(_type, paths.concat(_path, ''), resultArray, excludeArray);
      resultArray.push(padSpaces + '  }');
    } else {
      resultArray.push(padSpaces + '  ' + _path);
    }

    resultArray.push(padSpaces + '}');
  }

  function handleFlatten(obj, name) {
    var keys = Object.keys(obj);
    if (keys.length === 0) {
      resultArray.push(padSpaces + '  ' + name);
      return;
    }

    resultArray.push(padSpaces + '  ' + name + ' {');
    keys.forEach(function (k) {
      handleFlatten(obj[k], k);
    });
    resultArray.push(padSpaces + '}');
  }

  Object.keys(flattenFields).forEach(function (k) {
    handleFlatten(flattenFields[k], k);
  });
};

/***/ }),
/* 1 */
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = __webpack_require__(0);

exports.default = function (dataType) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      flatten = _ref.flatten,
      on = _ref.on;

  return function (proto, fieldName, descriptor) {
    var entityName = proto.constructor.name;

    if (flatten && flatten.indexOf('.') > -1 && on) {
      throw new Error('Please don\'t use flatten and on at the same time: ' + flatten);
    }

    var path = flatten || fieldName;

    // store graph entity tree in global store
    (0, _utils.attachField)({ fieldName: fieldName, entityName: entityName, dataType: dataType, proto: proto, path: path, on: on }, [entityName]);
    return (0, _utils.attachGetterSetter)(proto, fieldName, descriptor, entityName);
  };
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = __webpack_require__(0);

exports.default = function (fields) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      on = _ref.on;

  return function (proto, fieldName, descriptor) {
    var entityName = proto.constructor.name;

    var anonymousClassName = (0, _utils.generateNestedEntity)({
      fields: fields, fieldName: fieldName, entityName: entityName
    }, [entityName]);

    (0, _utils.attachField)({
      fieldName: fieldName, entityName: entityName, dataType: anonymousClassName, proto: proto, path: fieldName, on: on
    }, [entityName]);

    return (0, _utils.attachGetterSetter)(proto, fieldName, descriptor, entityName);
  };
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = __webpack_require__(0);

var _config = __webpack_require__(6);

exports.default = function (operation, output, input) {
  return function (proto, fieldName, descriptor) {
    // don't know if proto is prototype of class (static or not)
    var entityName = proto.name || proto.constructor.name;

    // I store the query meta in the schemaTree because of exclude supporting
    var meta = (0, _utils.attachOperation)(entityName, fieldName, output, input, operation, 'query');

    var originFunc = descriptor.value;
    descriptor.value = function () {
      var variable = originFunc.apply(undefined, arguments);

      // it returns a Promise, so should be called by await
      return _config.engine.cleanAndFetch(meta, variable);
    };

    return descriptor;
  };
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _schemaStore = __webpack_require__(1);

var _schemaStore2 = _interopRequireDefault(_schemaStore);

var _utils = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _default = function () {
  function _default() {
    _classCallCheck(this, _default);
  }

  _createClass(_default, [{
    key: 'cleanAndFetch',
    value: function cleanAndFetch(meta, variable) {
      var _schemaStore$meta = _schemaStore2.default[meta],
          input = _schemaStore$meta.input,
          name = _schemaStore$meta.name,
          output = _schemaStore$meta.output,
          type = _schemaStore$meta.type,
          exclude = _schemaStore$meta.exclude;


      var result = [];
      (0, _utils.compileToQueryString)(output, [], result, []);

      var varArray = [];
      Object.keys(variable).forEach(function (k) {
        var v = variable[k];
        varArray.push(k + ':"' + (typeof v === 'string' ? v : JSON.stringify(v)) + '"');
      });
      var body = 'query {\n      ' + name + '(' + varArray.join(',') + '){\n        ' + result.join('\n') + '\n      }\n    }';
      console.log(body);

      if (!window) {
        return Promise.resolve('no fetch');
      }

      return fetch('http://52.77.106.36:4000/graphql', {
        body: JSON.stringify({ query: body }),
        method: 'POST',
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
          loginrole: 'ADMIN',
          logintoken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ODE4M2I0NzBhZmE4MDFlMjMxNTkwNzkiLCJpYXQiOjE0Nzc5ODMwNDl9.X3ToMu6j-9mQVksVktxFpC1dhJ1jCoYnlvt8ZlAHyQg'
        }
      }).then(function (res) {
        return res.json();
      }).then(function (json) {
        if (json.errors) {
          return { errors: json.errors };
        }

        return json.data[name];
      });
    }
  }, {
    key: 'compileQuery',
    value: function compileQuery(output) {}
  }, {
    key: 'cleanVariable',
    value: function cleanVariable(input, variable) {
      return variable;
    }
  }, {
    key: 'composeResult',
    value: function composeResult(output, result, exclude) {}
  }]);

  return _default;
}();

exports.default = _default;
;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.engine = undefined;

var _GraphEngine = __webpack_require__(5);

var _GraphEngine2 = _interopRequireDefault(_GraphEngine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var engine = exports.engine = new _GraphEngine2.default();

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _desc, _value, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8;

var _field = __webpack_require__(2);

var _field2 = _interopRequireDefault(_field);

var _nestedField = __webpack_require__(3);

var _nestedField2 = _interopRequireDefault(_nestedField);

var _query = __webpack_require__(4);

var _query2 = _interopRequireDefault(_query);

var _schemaStore = __webpack_require__(1);

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

var Assessment = (_dec = (0, _field2.default)('String'), _dec2 = (0, _field2.default)('Date'), _dec3 = (0, _field2.default)('Date'), _dec4 = (0, _field2.default)('String'), _dec5 = (0, _field2.default)('String'), _dec6 = (0, _field2.default)('String', { flatten: 'emails.address' }), _dec7 = (0, _field2.default)('String', { flatten: 'emails.verified' }), _dec8 = (0, _nestedField2.default)({
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
}), _dec9 = (0, _query2.default)('user', 'Assessment'), (_class = function () {
  function Assessment() {
    _classCallCheck(this, Assessment);

    _initDefineProp(this, 'id', _descriptor, this);

    _initDefineProp(this, 'createdAt', _descriptor2, this);

    _initDefineProp(this, 'updatedAt', _descriptor3, this);

    _initDefineProp(this, 'role', _descriptor4, this);

    _initDefineProp(this, 'username', _descriptor5, this);

    _initDefineProp(this, 'email', _descriptor6, this);

    _initDefineProp(this, 'verified', _descriptor7, this);

    _initDefineProp(this, 'addresses', _descriptor8, this);
  }

  _createClass(Assessment, null, [{
    key: 'get',
    value: function get(id) {
      return { id: id };
    }
  }]);

  return Assessment;
}(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'id', [_dec], {
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
}), _descriptor6 = _applyDecoratedDescriptor(_class.prototype, 'email', [_dec6], {
  enumerable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class.prototype, 'verified', [_dec7], {
  enumerable: true,
  initializer: null
}), _descriptor8 = _applyDecoratedDescriptor(_class.prototype, 'addresses', [_dec8], {
  enumerable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class, 'get', [_dec9], Object.getOwnPropertyDescriptor(_class, 'get'), _class)), _class));


console.log(_schemaStore2.default);

Assessment.get("NTgyZDVhZDEyNjQ1YjcyMGIzN2Q4YTEx").then(function (res) {
  debugger;
  console.log(res);
});

/***/ })
/******/ ]);