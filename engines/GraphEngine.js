export default class {
  _schemaTree = {};
  _uri = null;
  _headers = {};

  constructor(uri, headers) {
    this._uri = uri;
    this._headers = headers;
  }

  cleanAndFetch(metaKey, variables, middleware, afterware) {
    const { input, name, output, isMutate, excludes = [] } = this._schemaTree[metaKey];
    const outputFields = this._schemaTree[output].composeToString(['', ''], excludes);
    const varArray = Object.keys(variables).map(k => {
      const value = variables[k];
      return `${k}: ${typeof value === 'string' ? '"' + value + '"' : JSON.stringify(value)}`;
    });

    const body = `${isMutate ? 'mutate' : 'query'} {
      ${name}(${varArray.join(',')}){
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
}
