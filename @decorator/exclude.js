import { getOperationKey } from '../utils';
import schemaStore from '../schemaStore';

export default (paths) => (proto, fieldName, descriptor) => {
  // don't know if proto is prototype of class (static or not)
  const entityName = proto.name || proto.constructor.name;
  const operationKey = getOperationKey(entityName, fieldName);

  // store the query meta in the schemaTree because of exclude supporting
  schemaStore[operationKey] = schemaStore[operationKey] || {};
  schemaStore[operationKey].excludes = paths;

  return descriptor;
};
