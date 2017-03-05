import { getOperationKey } from '../helper/utils';

export default (schemaTree) => {
  const decorator = (paths) => (proto, fieldName, descriptor) => {
    // don't know if proto is prototype of class (static or not)
    const entityName = proto.name || proto.constructor.name;
    const operationKey = getOperationKey(entityName, fieldName);

    // store the query meta in the schemaTree because of exclude supporting
    schemaTree[operationKey] = schemaTree[operationKey] || {};
    schemaTree[operationKey].excludes = paths;

    return descriptor;
  };

  return decorator;
};