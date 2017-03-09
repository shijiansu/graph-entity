import { SCHEMA_NAME, atomToVariableString } from '../helper/utils';

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
