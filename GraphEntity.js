import createField from './@decorator/createField';
import createFieldOn from './@decorator/createFieldOn';
import createOperation from './@decorator/createOperation';
import createExclude from './@decorator/createExclude';

export default class {
  /*
    // Assessment is class identifier of an entity
    // has relation to $$_GE_display_name but not readable

    Assessment: {
      $$_GE_constructor: Assessment,
      $$_GE_display_name: 'Assessment',
      id: { type: 'String', path: 'id' },
      user: { type: 'User', path: 'user', on: 'asdfasdf' },
    }
  */
  _schemaTree = {};

  constructor(engine, config) {
    if (!engine) {
      throw new Error('Please set an engine to graph-entity (graphEngine or restEngine)');
    }

    engine._schemaTree = this._schemaTree;

    this.field = createField(this._schemaTree);
    this.fieldOn = createFieldOn(this._schemaTree);
    this.exclude = createExclude(this._schemaTree);
    this.query = createOperation(this._schemaTree, engine, false);
    this.mutate = createOperation(this._schemaTree, engine, true);
  }
}
