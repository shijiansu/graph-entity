import { attachGetterSetter, attachField } from '../utils';

export default (dataType, { flatten, on } = {}) => (proto, fieldName, descriptor) => {
  const entityName = proto.constructor.name;

  if (flatten && flatten.indexOf('.') > -1 && on) {
    throw new Error(`Please don't use flatten and on at the same time: ${flatten}`);
  }

  const path = flatten || fieldName;

  // store graph entity tree in global store
  attachField({ fieldName, entityName, dataType, proto, path, on }, [entityName]);
  return attachGetterSetter(proto, fieldName, descriptor, entityName);
};
