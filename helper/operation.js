import schemaStore from '../schemaStore';
import Schema from './Schema';
import { engine } from '../config';

export default (key, operationName, output, input, descriptor, isMutate = false) => {
  let outputType = output;
  let inputType = input;
  if (typeof output === 'object') {
    outputType = Schema.generateNestedFields(output, [key, 'output']).schemaKey;
  }

  if (typeof input === 'object') {
    inputType = Schema.generateNestedFields(input, [key, 'input']).schemaKey;
  }

  const originFunc = descriptor.value;
  descriptor.value = function (...args) {
    const ret = originFunc(...args);
    const { variables = ret, afterware, middleware } = ret;

    // it returns a Promise, so should be called by await
    return engine.cleanAndFetch(key, variables, middleware, afterware);
  };

  const schema = schemaStore[key] = schemaStore[key] || {};
  schema.name = operationName;
  schema.isMutate = isMutate;
  schema.output = outputType;
  schema.input = inputType;

  return descriptor;
};
