import { attachOperation } from '../utils';
import { engine } from '../config';

export default (operation, output, input) => (proto, fieldName, descriptor) => {
  // don't know if proto is prototype of class (static or not)
  const entityName = proto.name || proto.constructor.name;

  // I store the query meta in the schemaTree because of exclude supporting
  const meta = attachOperation(entityName, fieldName, output, input, operation, 'query');

  const originFunc = descriptor.value;
  descriptor.value = function(...args) {
    const variable = originFunc(...args);

    // it returns a Promise, so should be called by await
    return engine.cleanAndFetch(meta, variable);
  };

  return descriptor;
};
