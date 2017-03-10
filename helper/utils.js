let uuid = 1;
export const PREFIX = '$$GE_';
export const SCHEMA_NAME = `${PREFIX}schema_name`;

export const getNewSchemaKey = () => `${PREFIX}anonymous_${uuid++}`;
export const getHiddenFieldName = (field) => `${PREFIX}hidden_${field}`;
export const getOperationKey = (entity, field) => `${PREFIX}operation_${entity}_${field}`;

export const ATOM_TYPE = ['Date', 'String', 'Number', 'Boolean', 'ID', 'Enum'];

export const attachGetterSetter = (fieldName, descriptor, displayName, dataType, schemaTree) => {
  const __fieldName = getHiddenFieldName(fieldName);

  const normalize = (value) => {
    if (value === null || value === undefined) {
      return null;
    }

    if (value instanceof Array) {
      return value.map(v => normalize(v));
    }

    switch (dataType) {
      case 'Date':
        return new Date(value);
      case 'String':
        return String(value);
      case 'Number':
        return Number(value);
      case 'Boolean':
        return Boolean(value);
      case 'ID':
        return value;
      case 'Enum':
        return value;
      default:
    }

    if (dataType !== value.constructor[SCHEMA_NAME]) {
      return schemaTree[dataType].composeResult(value);
    }
    return value;
  };

  // warning when accessing an untouched field
  descriptor.get = function () {
    if (!this[__fieldName]) {
      console.warn(`Graph Entity: You are trying to access an untouched field (${displayName}::${fieldName})`);
      return undefined;
    }

    this[__fieldName].value = normalize(this[__fieldName].value);
    return this[__fieldName].value;
  };

  descriptor.set = function (value) {
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

export const detectDataType = value => {
  if (value instanceof Date) {
    return 'Date';
  }

  switch (typeof value) {
    case 'number':
      return 'Number';
    case 'string':
      return 'String';
    case 'boolean':
      return 'Boolean';
    default:
      return 'ID';
  }
};

export const atomToVariableString = (value, dataType) => {
  if (value === null || value === undefined) {
    return 'null';
  }

  if (value instanceof Array) {
    return `[${value.map(v => atomToVariableString(v)).join(',')}]`;
  }

  const type = dataType || detectDataType(value);

  switch (type) {
    case 'Date':
      return value.getTime();
    case 'String':
      return `"${value}"`;
    case 'Number':
      return value;
    case 'Boolean':
      return value ? 'true' : 'false';
    case 'ID':
      return `"${value}"`;
    case 'Enum':
      return value;
    default:
  }
};
