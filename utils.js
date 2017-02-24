let uuid = 1;
export const PREFIX = '$$GE_';

export const getNewSchemaKey = () => `${PREFIX}anonymous_${uuid++}`;
export const getHiddenFieldName = (field) => `${PREFIX}hidden_${field}`;

export const ATOM_TYPE = ['Date', 'String', 'Number', 'Boolean', 'ID'];

export const attachGetterSetter = (proto, fieldName, descriptor, displayName) => {
  const __fieldName = getHiddenFieldName(fieldName);

  // TODO: change prototype in different order may cause performance issue
  //       according to v8 hidden class mechanism.
  //       put prototype outside ??
  descriptor.get = function () {
    if (!this[__fieldName]) {
      console.warning(`Graph Entity: You are trying to access an untouched field (${displayName}::${fieldName})`);
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


