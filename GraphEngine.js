import schemaStore from './schemaStore';
import { compileToQueryString } from './utils';

export default class {
  cleanAndFetch(meta, variable) {
    const { input, name, output, type, exclude } = schemaStore[meta];

    const result = [];
    compileToQueryString(output, [], result, []);

    console.log(result.join('\n'));
  }

  compileQuery(output) {

  }

  cleanVariable(input, variable) {
    return variable;
  }

  composeResult(output, result, exclude) {

  }


};
