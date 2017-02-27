import schemaStore from './schemaStore';

export default class {
  cleanAndFetch(metaKey, variables, middleware, afterware) {
    const { input, name, output, isMutate, excludes = [] } = schemaStore[metaKey];
    const outputFields = schemaStore[output].composeToString(['', ''], excludes);
    const varArray = Object.keys(variables).map(k => {
      const value = variables[k];
      return `${k}: "${typeof value === 'string' ? value : JSON.stringify(value)}"`;
    });

    const body = `${isMutate ? 'mutate' : 'query'} {
      ${name}(${varArray.join(',')}){
        ${outputFields.join('\n')}
      }
    }`;

    return fetch('http://52.77.106.36:4000/graphql', {
      body: JSON.stringify({ query: body }),
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
        loginrole: 'ADMIN',
        logintoken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ODE4M2I0NzBhZmE4MDFlMjMxNTkwNzkiLCJpYXQiOjE0Nzc5ODMwNDl9.X3ToMu6j-9mQVksVktxFpC1dhJ1jCoYnlvt8ZlAHyQg',
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

      const result = schemaStore[output].composeResult(outputData);
      if (afterware) {
        return afterware(result);
      }

      return result;
    });
  }
}
