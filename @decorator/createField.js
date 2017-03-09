import { attachGetterSetter, SCHEMA_NAME } from '../helper/utils';
import Schema from '../helper/Schema';

export default (schemaTree) => {
  const decorator = (dataType, alias) => (proto, fieldName, descriptor) => {
    const entityName = proto.constructor.name;

    if (!proto.constructor[SCHEMA_NAME]) {
      proto.constructor[SCHEMA_NAME] = entityName;
    }

    const schema = schemaTree[entityName]
      || new Schema(schemaTree, entityName, proto.constructor, [entityName]);

    const generatedType = schema.addField(fieldName, dataType, alias);

    return attachGetterSetter(fieldName, descriptor, schema.displayName, generatedType, schemaTree);
  };

  return decorator;
};
