import { SCHEMA_NAME, atomToVariableString } from '../helper/utils';

/**********************************
 * global debug storage
 **********************************/
const $GE_DEBUG = [];

const outputOne = (debug) => {
  const hasError = !!debug.errors;
  console.group(`%c${debug.name}: ${hasError ? '×' : '√'}`, `font-size: 14px; font-weight: bold; color: ${hasError ? 'red' : 'green'}`);
  console.log('input', debug.input);
  console.log('errors', debug.errors);
  console.log('response', debug.response);
  console.log('graphiURL', debug.graphiURL);
  console.groupEnd();
};

window.$GE_LIST = () => { $GE_DEBUG.forEach(d => outputOne(d)); };

/**********************************
 *
 * network engine to visit graph server
 *
 **********************************/
export default class {
  _schemaTree = {};
  _uri = null;
  _headers = {};

  constructor(uri, headers) {
    this._uri = uri;
    this._headers = headers;
  }

  cleanAndFetch(metaKey, variables, middleware, afterware) {
    const { input, name, output, isMutation, excludes = [] } = this._schemaTree[metaKey];

    const outputFields = this._schemaTree[output].composeToString(['', ''], excludes);
    let intputFields = variables;

    if (input) {
      intputFields = this._schemaTree[input].composeVariables(variables);
    } else {
      intputFields = this.stringifyVariables(variables);
    }

    if (intputFields.startsWith('{')) {
      intputFields = intputFields.substring(1, intputFields.length - 2);
    }

    const body = `${isMutation ? 'mutation' : 'query'} {
      ${name}(${intputFields}){
        ${outputFields.join('\n')}
      }
    }`;

    const debug = {};
    $GE_DEBUG.push(debug);
    debug.name = name;
    debug.input = variables;
    debug.query = intputFields;
    debug.fields = outputFields.join('\n');
    debug.graphiURL = `http://localhost:4000/graphiql?query=${encodeURIComponent(body)}`;

    return fetch(this._uri, {
      body: JSON.stringify({ query: body }),
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
        ...this._headers,
      },
    })
    .then(res => res.json())
    .then(json => {
      debug.errors = json.errors;
      debug.response = json.data;
      outputOne(debug);

      if (json.errors) {
        return { errors: json.errors };
      }

      let outputData = json.data[name];
      if (middleware) {
        outputData = middleware(outputData);
      }

      const result = this._schemaTree[output].composeResult(outputData);
      if (afterware) {
        return afterware(result);
      }

      return result;
    });
  }

  stringifyVariables(variables) {
    if (variables === null || variables === undefined) {
      return 'null';
    }

    if (variables instanceof Array) {
      const result = variables.map(v => this.stringifyVariables(v));
      return `[${result.join(',\n')}]`;
    }

    if (typeof variables !== 'object') {
      return atomToVariableString(variables);
    }

    const schemaName = variables.constructor[SCHEMA_NAME];
    if (schemaName) {
      return this._schemaTree[schemaName].composeVariables(variables);
    }

    const result = Object.keys(variables).map(key => {
      const value = variables[key];
      return `${key}: ${this.stringifyVariables(value)}`;
    });

    return `{\n${result.join(',\n')}\n}`;
  }
}
