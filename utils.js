import schemaStore from './schemaStore';

export const PREFIX = '$$GE_';
export const GE_CONSTURCTOR = `${PREFIX}$$constructor`;
export const GE_DISPLAY_NAME = `${PREFIX}$$display_name`;

export const getHiddenFieldName = (name) => `${PREFIX}${name}`;
export const getOperationName = (entity, field) => `${PREFIX}${entity}_${field}`;

export const getAnonymousClassName = (nestedNames = [], entityName, classType) => {
  const names = nestedNames.join('_');
  return `${PREFIX}${classType}_${names ? names + '_' : ''}${entityName}`;
};

export const getClassDisplayName = (nestedNames = []) => {
  return nestedNames.join('::');
};

export const attachGetterSetter = (proto, fieldName, descriptor, entityName) => {
  const __fieldName = getHiddenFieldName(fieldName);
  const entity = schemaStore[entityName];

  // TODO: change prototype in different order may cause performance issue
  //       according to v8 hidden class mechanism.
  //       put prototype outside ??
  descriptor.get = function() {
    if (!this[__fieldName]) {
      console.warning(`Graph Entity: You are trying to access an untouched field (${entity[GE_DISPLAY_NAME]}::${fieldName})`);
      return undefined;
    }

    return this[__fieldName].value;
  };

  descriptor.set = function(value) {
    this[__fieldName] = {
      touched: true,
      value,
    };
  };

  // hack for babel-decorator-plugin
  delete descriptor.initializer;

  delete descriptor.writable;
  delete descriptor.value;

  return descriptor;
};

export const attachField = (options, nestedNames) => {
  const { fieldName, entityName, dataType, proto, path, on } = options;

  const entity = schemaStore[entityName] || {};
  if (!schemaStore[entityName]) {
    entity[GE_CONSTURCTOR] = proto.constructor;
    entity[GE_DISPLAY_NAME] = getClassDisplayName(nestedNames);

    schemaStore[entityName] = entity;
  }

  // if the field name is already defined
  if (entity[fieldName]) {
    throw new Error(`Graph Entity: ${entity[GE_DISPLAY_NAME]}::${path} is already defined.`);
  }

  // add field to entity tree
  entity[fieldName] = {
    type: dataType.replace(/[\[\]\!]/g, ''),
    path,
    on,
  };
};

export const generateNestedEntity = (options, nestedNames, classType = 'anonymous') => {
  const { fields, fieldName, entityName } = options;

  const AnonymousClass = function () {};
  const className = getAnonymousClassName(nestedNames, fieldName, classType);

  for (const key in fields) {
    if (typeof fields[key] === 'object') {
      const type = generateNestedEntity({
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

    Object.defineProperty(
      AnonymousClass.prototype,
      key,
      (...args) => attachGetterSetter(...args, entityName)
    );
  }

  return className;
};


export const attachOperation = (entityName, fieldName, output, input, opName, opType) => {
  const schemaName = getOperationName(entityName, fieldName);

  let outputType = output;
  let inputType = input;

  if (typeof output === 'object') {
    outputType = generateNestedEntity({
      fields: output, fieldName, entityName
    }, [entityName], 'output');
  } else if (!output) {
    outputType = entityName;
  }

  if (typeof input === 'object') {
    inputType = generateNestedEntity({
      fields: input, fieldName, entityName
    }, [entityName], 'input');
  }

  const schema = schemaStore[schemaName] = schemaStore[schemaName] || {};
  schema.name = opName;
  schema.type = opType;
  schema.output = outputType;
  schema.input = inputType;

  return schemaName;
};

const ATOM_TYPE = ['Date', 'String', 'Number', 'Boolean', 'ID'];

export const walkThrough = (dataType, callback, paths) => {
  if (!schemaStore[dataType]) {
    throw new Error(`Type ${dataType} not found while walking through schema!`);
  }

  const entity = schemaStore[dataType];

  for (const key in entity) {
    if (key.startsWith(PREFIX)) {
      continue;
    }

    const { type, path } = entity[key];
    callback(paths, entity[key]);

    if (ATOM_TYPE.indexOf(type) === -1) {
      walkThrough(type, callback, paths.concat(path.split('.')));
    }
  }
};

export const compileToQueryString = (dataType, paths, resultArray, excludeArray) => {
  if (!schemaStore[dataType]) {
    throw new Error(`Type ${dataType} not found while compiling schema!`);
  }

  const padSpaces = '  '.repeat(paths.length);
  const entity = schemaStore[dataType];
  const fieldsWithOn = {};
  const flattenFields = {};

  for (const key in entity) {
    if (key.startsWith(PREFIX)) {
      continue;
    }

    const { type, path = key, on } = entity[key];

    const flattenPath = path.split('.');

    // check for exclude
    if (excludeArray.indexOf(`${paths.join('.')}${paths.length ? '.' : ''}${path}`) >= 0) {
      continue;
    }

    // store ...on till finished other fields
    if (on) {
      const onArray = Array.isArray(on) ? on : [on];

      onArray.forEach(o => {
        fieldsWithOn[o] = entity[key];
      });
      continue;
    }

    // deal with flatten path
    if (flattenPath.length > 1) {
      let current = flattenFields;

      flattenPath.forEach(p => {
        current[p] = current[p] || {};
        current = current[p];
      });
      continue;
    }

    // append query string to results
    if (ATOM_TYPE.indexOf(type) === -1) {
      resultArray.push(`${padSpaces}${path} {`);
      compileToQueryString(type, paths.concat(path), resultArray, excludeArray);
      resultArray.push(`${padSpaces}}`);
    } else {
      resultArray.push(`${padSpaces}${path}`);
    }
  }

  for (const onName in fieldsWithOn) {
    const { type, path, on } = fieldsWithOn[onName];

    resultArray.push(`${padSpaces}... on ${on} {`);

    if (ATOM_TYPE.indexOf(type) === -1) {
      resultArray.push(`${padSpaces}  ${path} {`);
      compileToQueryString(type, paths.concat(path, ''), resultArray, excludeArray);
      resultArray.push(`${padSpaces}  }`);
    } else {
      resultArray.push(`${padSpaces}  ${path}`);
    }

    resultArray.push(`${padSpaces}}`);
  }

  function handleFlatten(obj, name) {
    const keys = Object.keys(obj)
    if (keys.length === 0) {
      resultArray.push(`${padSpaces}  ${name}`);
      return;
    }

    resultArray.push(`${padSpaces}  ${name} {`);
    keys.forEach(k => {
      handleFlatten(obj[k], k);
    });
    resultArray.push(`${padSpaces}}`);
  }

  Object.keys(flattenFields).forEach(k => {
    handleFlatten(flattenFields[k], k);
  });
};

