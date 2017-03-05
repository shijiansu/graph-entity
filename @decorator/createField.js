import { attachGetterSetter } from '../helper/utils';
import Schema from '../helper/Schema';

export default (schemaTree) => {
  const decorator = (dataType, alias) => (proto, fieldName, descriptor) => {
    const entityName = proto.constructor.name;

    const schema = schemaTree[entityName]
      || new Schema(schemaTree, entityName, proto.constructor, [entityName]);

    schema.addField(fieldName, dataType, alias);

    return attachGetterSetter(proto, fieldName, descriptor, schema.displayName);
  };

  return decorator;
};