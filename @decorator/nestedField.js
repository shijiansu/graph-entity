import { generateNestedEntity, attachGetterSetter, attachField } from '../utils';

export default (fields, { on } = {}) => (proto, fieldName, descriptor) => {
  const entityName = proto.constructor.name;

  const anonymousClassName = generateNestedEntity({
    fields, fieldName, entityName
  }, [entityName]);

  attachField({
    fieldName, entityName, dataType: anonymousClassName, proto, path: fieldName, on
  }, [entityName]);

  return attachGetterSetter(proto, fieldName, descriptor, entityName);
};
