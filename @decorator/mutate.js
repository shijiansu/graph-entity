import { attachOperation } from '../utils';

export default (operation, output, input) => (proto, fieldName, descriptor) => {
  // don't know if proto is prototype of class (static or not)
  const entityName = proto.name || proto.constructor.name;

  // I store the mutate meta in the schemaTree because of exclude supporting
  attachOperation(entityName, fieldName, output, input, operation, 'mutate');

  return descriptor
};
