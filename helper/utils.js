let uuid = 1;
export const PREFIX = '$$GE_';

export const getNewSchemaKey = () => `${PREFIX}anonymous_${uuid++}`;
export const getHiddenFieldName = (field) => `${PREFIX}hidden_${field}`;
export const getOperationKey = (entity, field) => `${PREFIX}operation_${entity}_${field}`;

export const ATOM_TYPE = ['Date', 'String', 'Number', 'Boolean', 'ID'];

export const attachGetterSetter = (fieldName, descriptor, displayName, dataType) => {
  const __fieldName = getHiddenFieldName(fieldName);

  const normalize = ATOM_TYPE.includes(dataType) ? (value) => {
    if (value === null || value === undefined) {
      return null;
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
    }
  } : v => v;

  // warning when accessing an untouched field
  descriptor.get = function () {
    if (!this[__fieldName]) {
      console.warn(`Graph Entity: You are trying to access an untouched field (${displayName}::${fieldName})`);
      return undefined;
    }

    return this[__fieldName].value;
  };

  descriptor.set = function (value) {
    this[__fieldName] = {
      touched: true,
      value: normalize(value),
    };
  };

  // hack for babel-decorator-plugin
  delete descriptor.initializer;

  delete descriptor.writable;
  delete descriptor.value;

  return descriptor;
};
