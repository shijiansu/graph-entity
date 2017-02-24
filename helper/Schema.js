import schemaStore from '../schemaStore';
import { getNewSchemaKey, attachGetterSetter, ATOM_TYPE } from '../utils';

export default class Schema {
  schemaKey = '';
  paths = [];
  entityClass = null;

  get displayName() {
    return this.paths.join('::');
  }

  fields = {};
  ons = {};

  constructor(name, entityClass, paths) {
    this.schemaKey = name || getNewSchemaKey();
    this.paths = paths;
    this.entityClass = entityClass;

    schemaStore[this.schemaKey] = this;
  }

  addField(name, type, alias) {
    if (typeof type === 'object') {
      type = Schema.generateNestedFields(type, this.paths.concat(name));
    }

    this.fields[name] = { type, alias: alias || name };
  }

  addFieldOn(name, type, ons) {
    if (typeof type === 'object') {
      type = Schema.generateNestedFields(type, this.paths.concat(name));
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
  }

  composeToString(paths, excludes = []) {
    const result = [];

    const toString = (fields, innerPaths) => {
      const spaces = '  '.repeat(innerPaths.length);

      Object.keys(fields).forEach(key => {
        const { type, alias } = fields[key];

        if (excludes.indexOf(`${innerPaths.concat(key).join('.')}`) >= 0) {
          return;
        }

        if (ATOM_TYPE.indexOf(type) >= 0) {
          result.push(`${spaces}${alias}`);
        } else {
          result.push(`${spaces}${alias} {`);
          result.push(...schemaStore[type].composeToString(innerPaths.concat(alias), excludes));
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
          ? data[alias].map(d => schemaStore[type].composeResult(d))
          : schemaStore[type].composeResult(data[alias]);
      }
    });

    return instance;
  }

  cleanInput() {

  }

  static generateNestedFields(fields, paths) {
    const AnonymousClass = function () {};
    const schema = new Schema(null, AnonymousClass, paths);

    Object.keys(fields).forEach(key => {
      Object.defineProperty(
        AnonymousClass.prototype,
        key,
        attachGetterSetter(undefined, key, {}, schema.displayName)
      );

      schema.addField(key, fields[key], key);
    });

    return schema.schemaKey;
  }
}
