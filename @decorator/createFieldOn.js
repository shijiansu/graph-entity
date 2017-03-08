import { attachGetterSetter, SCHEMA_NAME } from '../helper/utils';
import Schema from '../helper/Schema';

export default (schemaTree) => {
  const decorator = (dataType, ons) => (proto, fieldName, descriptor) => {
    const entityName = proto.constructor.name;

    if (proto.constructor[SCHEMA_NAME]) {
      proto.constructor[SCHEMA_NAME] = entityName;
    }

    const schema = schemaTree[entityName]
      || new Schema(schemaTree, entityName, proto.constructor, [entityName]);

    schema.addFieldOn(fieldName, dataType, ons);

    return attachGetterSetter(fieldName, descriptor, schema.displayName, dataType);
  };

  return decorator;
};