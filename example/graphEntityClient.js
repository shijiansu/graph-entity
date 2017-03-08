import GraphEntity, { GraphEngine } from '../index';

const engine = new GraphEngine('http://localhost:4000/graphql', {
  customHeader: 'any value',
});

export default new GraphEntity(engine);
