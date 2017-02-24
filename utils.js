let uuid = 1;
export const PREFIX = '$$GE_';

export const getNewSchemaKey = () => `${PREFIX}anonymous_${uuid++}`;
export const getHiddenFieldName = (field) => `${PREFIX}hidden_${field}`;
export const getOperationKey = (entity, field) => `${PREFIX}operation_${entity}_${field}`;

export const ATOM_TYPE = ['Date', 'String', 'Number', 'Boolean', 'ID'];

export const attachGetterSetter = (proto, fieldName, descriptor, displayName) => {
  const __fieldName = getHiddenFieldName(fieldName);

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
      value,
    };
  };

  // hack for babel-decorator-plugin
  delete descriptor.initializer;

  delete descriptor.writable;
  delete descriptor.value;

  return descriptor;
};
