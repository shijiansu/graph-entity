import GraphEntity, { GraphEngine } from '../index';

const engine = new GraphEngine('http://localhost:4000/graphql', {
  loginrole: 'ADMIN',
  logintoken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ODE4M2I0NzBhZmE4MDFlMjMxNTkwNzkiLCJpYXQiOjE0Nzc5ODMwNDl9.X3ToMu6j-9mQVksVktxFpC1dhJ1jCoYnlvt8ZlAHyQg',
});

export default new GraphEntity(engine);
