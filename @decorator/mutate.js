import { getOperationKey } from '../utils';
import operationHelper from '../helper/operation';

export default (operationName, output, input) => (proto, fieldName, descriptor) => {
  // don't know if proto is prototype of class (static or not)
  const entityName = proto.name || proto.constructor.name;
  const operationKey = getOperationKey(entityName, fieldName);

  // store the query meta in the schemaTree because of exclude supporting
  return operationHelper(operationKey, operationName, output, input, descriptor, true);
};
