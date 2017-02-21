import schemaStore from './schemaStore';
import { compileToQueryString } from './utils';

export default class {
  cleanAndFetch(meta, variable) {
    const { input, name, output, type, exclude } = schemaStore[meta];

    const result = [];
    compileToQueryString(output, [], result, []);

    const varArray = [];
    Object.keys(variable).forEach(k => {
      const v = variable[k];
      varArray.push(`${k}:"${typeof v === 'string' ? v : JSON.stringify(v)}"`);
    });
    const body = `query {
      ${name}(${varArray.join(',')}){
        ${result.join('\n')}
      }
    }`;
    console.log(body);

    if (!window) {
      return Promise.resolve('no fetch');
    }

    return fetch(`http://52.77.106.36:4000/graphql`, {
      body: JSON.stringify({query: body}),
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
        loginrole: 'ADMIN',
        logintoken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ODE4M2I0NzBhZmE4MDFlMjMxNTkwNzkiLCJpYXQiOjE0Nzc5ODMwNDl9.X3ToMu6j-9mQVksVktxFpC1dhJ1jCoYnlvt8ZlAHyQg',
      },
    }).then(res => {
      return res.json()
    }).then(json => {
      if (json.errors) {
        return { errors: json.errors };
      }

      return json.data[name]
    });

  }

  compileQuery(output) {

  }

  cleanVariable(input, variable) {
    return variable;
  }

  composeResult(output, result, exclude) {

  }


};
