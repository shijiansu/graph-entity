import { attachGetterSetter } from '../helper/utils';
import Schema from '../helper/Schema';

export default (schemaTree) => {
  cosnt decorator = (dataType, ons) => (proto, fieldName, descriptor) => {
    const entityName = proto.constructor.name;

    const schema = schemaTree[entityName]
      || new Schema(schemaTree, entityName, proto.constructor, [entityName]);

    schema.addFieldOn(fieldName, dataType, ons);

    return attachGetterSetter(proto, fieldName, descriptor, schema.displayName);
  };

  return decorator;
};