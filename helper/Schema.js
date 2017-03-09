import { getNewSchemaKey, attachGetterSetter, ATOM_TYPE, atomToVariableString, SCHEMA_NAME } from './utils';

export default class Schema {
  _schemaTree = {};

  schemaKey = '';
  paths = [];
  entityClass = null;

  get displayName() {
    return this.paths.join('::');
  }

  fields = {};
  ons = {};

  constructor(schemaTree, name, entityClass, paths) {
    this._schemaTree = schemaTree;
    this.schemaKey = name || getNewSchemaKey();
    this.paths = paths;
    this.entityClass = entityClass;

    this._schemaTree[this.schemaKey] = this;
  }

  addField(name, type, alias) {
    if (typeof type === 'object') {
      type = Schema.generateNestedFields(this._schemaTree, type, this.paths.concat(name));
    }

    this.fields[name] = { type, alias: alias || name };
    return type;
  }

  addFieldOn(name, type, ons) {
    if (typeof type === 'object') {
      type = Schema.generateNestedFields(this._schemaTree, type, this.paths.concat(name));
    }

    if (!(ons instanceof Array)) {
      ons = [ons];
    }

    ons.forEach(o => {
      if (!this.ons[o]) {
        this.ons[o] = {};
      }

      // use alias for handle convenniencely
      this.ons[o][name] = { type, alias: name };
    });

    return type;
  }

  composeToString(paths, excludes = []) {
    const result = [];

    const toString = (fields, innerPaths) => {
      const spaces = '  '.repeat(innerPaths.length);

      Object.keys(fields).forEach(key => {
        const { type, alias } = fields[key];

        if (excludes.indexOf(`${innerPaths.filter(Boolean).concat(key).join('.')}`) >= 0) {
          return;
        }

        if (ATOM_TYPE.indexOf(type) >= 0) {
          result.push(`${spaces}${alias}`);
        } else {
          result.push(`${spaces}${alias} {`);
          result.push(...this._schemaTree[type].composeToString(innerPaths.concat(alias), excludes));
          result.push(`${spaces}}`);
        }
      });
    };

    // compose normal fields
    toString(this.fields, paths);

    // compose 'on' fields
    Object.keys(this.ons).forEach(key => {
      const spaces = '  '.repeat(paths.length);

      result.push(`${spaces}... on ${key} {`);
      toString(this.ons[key], paths.concat(key));
      result.push(`${spaces}}`);
    });

    return result;
  }

  composeResult(data) {
    const instance = new this.entityClass();

    // join 'on' fields into normal fields
    const allFields = { ...this.fields };
    Object.keys(this.ons).forEach(on => {
      Object.assign(allFields, this.ons[on]);
    });

    // map data to entity instance
    Object.keys(allFields).forEach(key => {
      const { type, alias } = allFields[key];

      if (!(alias in data)) {
        return;
      }

      if (data[alias] === null) {
        instance[key] = null;
      } else if (ATOM_TYPE.indexOf(type) >= 0) {
        instance[key] = data[alias];
      } else {
        instance[key] = data[alias] instanceof Array
          ? data[alias].map(d => this._schemaTree[type].composeResult(d))
          : this._schemaTree[type].composeResult(data[alias]);
      }
    });

    return instance;
  }

  composeVariables(variables) {
    if (variables == null || variables === undefined) {
      return 'null';
    }

    if (variables instanceof Array) {
      return `[${variables.map(item => this.composeVariables(item)).join(',\n')}]`;
    }

    // join 'on' fields into normal fields
    const allFields = { ...this.fields };
    Object.keys(this.ons).forEach(on => {
      Object.assign(allFields, this.ons[on]);
    });

    // if variables is object
    const result = Object.keys(allFields).map(key => {
      const { type, alias } = allFields[key];
      const value = variables[alias] || variables[key];

      if (ATOM_TYPE.includes(type)) {
        return `${alias}: ${atomToVariableString(value, type)}`;
      }

      const schema = this._schemaTree[type];
      return `${alias}: ${schema.composeVariables(value)}`;
    });

    return `{\n${result.join(',\n')}\n}`;
  }

  static generateNestedFields(schemaTree, fields, paths) {
    const AnonymousClass = function () {};
    const schema = new Schema(schemaTree, null, AnonymousClass, paths);

    AnonymousClass[SCHEMA_NAME] = schema.schemaKey;

    Object.keys(fields).forEach(key => {
      Object.defineProperty(
        AnonymousClass.prototype,
        key,
        attachGetterSetter(key, {}, schema.displayName, fields[key], schemaTree)
      );

      schema.addField(key, fields[key], key);
    });

    return schema.schemaKey;
  }
}
