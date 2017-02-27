import { attachGetterSetter } from '../utils';
import Schema from '../helper/Schema';
import schemaStore from '../schemaStore';

export default (dataType, alias) => (proto, fieldName, descriptor) => {
  const entityName = proto.constructor.name;

  const schema = schemaStore[entityName]
    || new Schema(entityName, proto.constructor, [entityName]);

  schema.addField(fieldName, dataType, alias);

  return attachGetterSetter(proto, fieldName, descriptor, schema.displayName);
};