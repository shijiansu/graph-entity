import { getOperationKey } from '../helper/utils';

export default (schemaTree, engine, isMutate) => {
  const decorator = (operationName, output, input) => (proto, fieldName, descriptor) => {
    // don't know if proto is prototype of class (static or not)
    const entityName = proto.name || proto.constructor.name;
    const operationKey = getOperationKey(entityName, fieldName);

    // store the query meta in the schemaTree because of exclude supporting
    let outputType = output;
    let inputType = input;
    if (typeof output === 'object') {
      outputType = Schema.generateNestedFields(output, [key, 'output']);
    }

    if (typeof input === 'object') {
      inputType = Schema.generateNestedFields(input, [key, 'input']);
    }

    const originFunc = descriptor.value;
    descriptor.value = function (...args) {
      const ret = originFunc(...args);
      const { variables = ret, afterware, middleware } = ret;

      // it returns a Promise, so should be called by await
      return engine.cleanAndFetch(key, variables, middleware, afterware);
    };

    const schema = schemaTree[key] = schemaTree[key] || {};
    schema.name = operationName;
    schema.isMutate = isMutate;
    schema.output = outputType;
    schema.input = inputType;

    return descriptor;
  };

  return decorator;
};
